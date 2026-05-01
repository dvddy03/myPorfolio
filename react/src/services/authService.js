const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export async function getCurrentAdmin() {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: "include",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw await buildRequestError(response);
  }

  const payload = await response.json();
  return payload.admin || null;
}

export async function loginAdmin(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw await buildRequestError(response);
  }

  const payload = await response.json();
  return payload.admin;
}

export async function logoutAdmin() {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok && response.status !== 204) {
    throw await buildRequestError(response);
  }
}

async function buildRequestError(response) {
  let message = "Requete impossible.";

  try {
    const payload = await response.json();
    if (payload.message) {
      message = payload.message;
    }
  } catch (_error) {
    if (response.status === 401) {
      message =
        "Connexion refusee sur cette URL. Utilisez l'adresse publique principale du portfolio.";
    } else if (response.status === 403) {
      message =
        "Cette URL de deploiement est protegee. Ouvrez le portfolio depuis son adresse publique principale.";
    }
  }

  return new Error(message);
}
