pipeline {
    agent any

    environment {
        DOCKERHUB_USER  = "d4ddy03"
        IMAGE_BACKEND   = "${DOCKERHUB_USER}/myportfolio-backend"
        IMAGE_FRONTEND  = "${DOCKERHUB_USER}/myportfolio-frontend"
        IMAGE_TAG       = "${BUILD_NUMBER}"
        COMPOSE_PROJECT = "myportfolio"
        RECIPIENT       = "papalioune03@gmail.com"
    }

    triggers {
        githubPush()
    }

    stages {

        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Build") {
            steps {
                sh "cp .env.example .env"
                sh "docker compose -p ${COMPOSE_PROJECT} build"
            }
        }

        stage("Push") {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "dockerhub-creds",
                    usernameVariable: "DOCKER_USER",
                    passwordVariable: "DOCKER_PASS"
                )]) {
                    sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                    sh "docker tag ${COMPOSE_PROJECT}-backend  ${IMAGE_BACKEND}:${IMAGE_TAG}"
                    sh "docker tag ${COMPOSE_PROJECT}-frontend ${IMAGE_FRONTEND}:${IMAGE_TAG}"
                    sh "docker tag ${COMPOSE_PROJECT}-backend  ${IMAGE_BACKEND}:latest"
                    sh "docker tag ${COMPOSE_PROJECT}-frontend ${IMAGE_FRONTEND}:latest"
                    sh "docker push ${IMAGE_BACKEND}:${IMAGE_TAG}"
                    sh "docker push ${IMAGE_BACKEND}:latest"
                    sh "docker push ${IMAGE_FRONTEND}:${IMAGE_TAG}"
                    sh "docker push ${IMAGE_FRONTEND}:latest"
                    sh "docker logout"
                }
            }
        }

        stage("Deploy") {
            steps {
                sh "docker compose -p ${COMPOSE_PROJECT} down --remove-orphans || true"
                sh "docker compose -p ${COMPOSE_PROJECT} up -d"
                sh "docker compose -p ${COMPOSE_PROJECT} ps"
            }
        }

    }

    post {
        success {
            emailext(
                to: "${RECIPIENT}",
                subject: "✅ Jenkins — ${JOB_NAME} #${BUILD_NUMBER} — SUCCES",
                body: """
                <html><body>
                <h2 style="color:#2E75B6;">Pipeline Jenkins — Succès</h2>
                <table>
                  <tr><td><b>Projet</b></td><td>${JOB_NAME}</td></tr>
                  <tr><td><b>Build</b></td><td>#${BUILD_NUMBER}</td></tr>
                  <tr><td><b>Durée</b></td><td>${currentBuild.durationString}</td></tr>
                  <tr><td><b>Images Docker Hub</b></td><td>${IMAGE_BACKEND}:${IMAGE_TAG}</td></tr>
                  <tr><td><b>Portfolio</b></td><td><a href="http://192.168.93.239:8080">http://192.168.93.239:8080</a></td></tr>
                </table>
                <p><a href="${BUILD_URL}">Voir les logs Jenkins</a></p>
                </body></html>
                """,
                mimeType: "text/html"
            )
        }
        failure {
            emailext(
                to: "${RECIPIENT}",
                subject: "❌ Jenkins — ${JOB_NAME} #${BUILD_NUMBER} — ECHEC",
                body: """
                <html><body>
                <h2 style="color:#C00000;">Pipeline Jenkins — Échec</h2>
                <table>
                  <tr><td><b>Projet</b></td><td>${JOB_NAME}</td></tr>
                  <tr><td><b>Build</b></td><td>#${BUILD_NUMBER}</td></tr>
                  <tr><td><b>Durée</b></td><td>${currentBuild.durationString}</td></tr>
                </table>
                <p><a href="${BUILD_URL}console">Voir les logs d erreur</a></p>
                </body></html>
                """,
                mimeType: "text/html"
            )
            sh "docker compose -p ${COMPOSE_PROJECT} down || true"
        }
        always {
            sh "docker logout || true"
            cleanWs()
        }
    }
}
