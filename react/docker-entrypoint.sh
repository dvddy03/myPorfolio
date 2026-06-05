#!/bin/sh
# Substitue les variables d'environnement dans la config nginx
# NGINX_RESOLVER : IP du resolver DNS (127.0.0.11 pour Docker, 10.96.0.10 pour K8s)
# BACKEND_HOST   : nom DNS du backend (backend pour Docker, backend-service.myportfolio.svc.cluster.local pour K8s)

export NGINX_RESOLVER=${NGINX_RESOLVER:-127.0.0.11}
export BACKEND_HOST=${BACKEND_HOST:-backend}

envsubst '${NGINX_RESOLVER} ${BACKEND_HOST}'   < /etc/nginx/templates/default.conf.template   > /etc/nginx/conf.d/default.conf

echo "[nginx] Resolver: ${NGINX_RESOLVER} | Backend: ${BACKEND_HOST}"
exec nginx -g 'daemon off;'
