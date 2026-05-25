pipeline {
    agent any

    environment {
        DOCKERHUB_USER  = "d4ddy03"
        IMAGE_BACKEND   = "${DOCKERHUB_USER}/myportfolio-backend"
        IMAGE_FRONTEND  = "${DOCKERHUB_USER}/myportfolio-frontend"
        IMAGE_TAG       = "${BUILD_NUMBER}"
        COMPOSE_PROJECT = "myportfolio"
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
                to: "papalioune03@gmail.com",
                subject: "SUCCESS: Pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    Le pipeline a reussi !
                    Job: ${env.JOB_NAME}
                    Build: #${env.BUILD_NUMBER}
                    Portfolio: http://192.168.93.239:8080
                    Logs: ${env.BUILD_URL}
                """,
                mimeType: "text/plain"
            )
        }
        failure {
            emailext(
                to: "papalioune03@gmail.com",
                subject: "FAILURE: Pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    Le pipeline a echoue !
                    Job: ${env.JOB_NAME}
                    Build: #${env.BUILD_NUMBER}
                    Logs: ${env.BUILD_URL}console
                """,
                mimeType: "text/plain"
            )
            sh "docker compose -p ${COMPOSE_PROJECT} down || true"
        }
        always {
            sh "docker logout || true"
            cleanWs()
        }
    }
}
