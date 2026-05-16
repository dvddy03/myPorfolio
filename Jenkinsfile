pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "d4ddy03"
        IMAGE_BACKEND  = "${DOCKERHUB_USER}/portfolio-backend"
        IMAGE_FRONTEND = "${DOCKERHUB_USER}/portfolio-frontend"
        IMAGE_TAG      = "${BUILD_NUMBER}"
    }

    stages {

        stage("Checkout") {
            steps {
                checkout scm
            }
        }

        stage("Build") {
            steps {
                sh "docker compose build"
            }
        }

        stage("Deploy") {
            steps {
                sh "docker compose down --remove-orphans || true"
                sh "docker compose up -d"
                sh "docker compose ps"
            }
        }

    }

    post {
        success {
            echo "Pipeline termine avec succes — Portfolio en ligne sur :8080"
        }
        failure {
            echo "Pipeline echoue — verifier les logs ci-dessus."
            sh "docker compose down || true"
        }
        always {
            cleanWs()
        }
    }
}
