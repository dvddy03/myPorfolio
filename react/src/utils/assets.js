import profileImage from "../../../profil.jpeg";
import projectActiveDirectory from "../../../assets/project-ad.jpeg";
import projectIds from "../../../assets/project-ids.png";
import projectIot from "../../../assets/project-iot.svg";
import projectSiem from "../../../assets/project-siem.png";

const projectImages = {
  ids: projectIds,
  siem: projectSiem,
  ad: projectActiveDirectory,
  iot: projectIot,
};

export function getProfileImage() {
  return profileImage;
}

export function getProjectImage(project) {
  if (project?.imageUrl) {
    return project.imageUrl;
  }

  if (project?.imageKey && projectImages[project.imageKey]) {
    return projectImages[project.imageKey];
  }

  return "";
}
