pipeline {
    agent any

    environment {
        DOCKERHUB_USER  = d4ddy03
        IMAGE_BACKEND   = /myportfolio-backend
        IMAGE_FRONTEND  = /myportfolio-frontend
        IMAGE_TAG       = 
        COMPOSE_PROJECT = myportfolio
    }

    triggers {
        githubPush()
    }

    stages {

        stage(Checkout) {
            steps {
                checkout scm
            }
        }

        stage(Build) {
            steps {
                sh cp .env.example .env
                sh docker compose -p build
            }
        }

        stage(SonarQube Analysis) {
            steps {
                withSonarQubeEnv('sonarqube') {
                    script {
                        def scannerHome = tool 'sonarqube-scanner'
                        def nodejsHome  = tool 'nodejs'
                        sh /bin/sonar-scanner -Dsonar.nodejs.executable=/bin/node
                    }
                }
            }
        }

        stage(Quality Gate) {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage(Push) {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: dockerhub-creds,
                    usernameVariable: DOCKER_USER,
                    passwordVariable: DOCKER_PASS
                )]) {
                    sh echo
