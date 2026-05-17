pipeline {
    agent any

    environment {
        DOCKERHUB_USER  = "d4ddy03"
        IMAGE_BACKEND   = "${DOCKERHUB_USER}/portfolio-backend"
        IMAGE_FRONTEND  = "${DOCKERHUB_USER}/portfolio-frontend"
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
            echo "Pipeline termine avec succes — Portfolio en ligne sur :8080"
        }
        failure {
            echo "Pipeline echoue — verifier les logs ci-dessus."
            sh "docker compose -p ${COMPOSE_PROJECT} down || true"
        }
        always {
            cleanWs()
        }
    }
}
