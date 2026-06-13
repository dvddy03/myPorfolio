pipeline {
    agent any

    environment {
        DOCKERHUB_USER  = "d4ddy03"
        IMAGE_BACKEND   = "${DOCKERHUB_USER}/myportfolio-backend"
        IMAGE_FRONTEND  = "${DOCKERHUB_USER}/myportfolio-frontend"
        IMAGE_TAG       = "${BUILD_NUMBER}"
        COMPOSE_PROJECT = "myportfolio"
        K8S_NAMESPACE   = "myportfolio"
        KUBECONFIG      = "/var/jenkins_home/.kube/config"
        AWS_DEFAULT_REGION = "eu-west-3"
        AWS_SHARED_CREDENTIALS_FILE = "/var/jenkins_home/.aws/credentials"
    }

    triggers { githubPush() }

    stages {

        stage("Checkout") {
            steps {
                checkout scm
                sh "git log -1 --oneline || true"
            }
        }

        stage("Build") {
            steps {
                sh "cp .env.example .env"
                sh "docker compose -p ${COMPOSE_PROJECT} build"
            }
        }

        stage("SonarQube Analysis") {
            steps {
                withSonarQubeEnv("sonarqube") {
                    script {
                        def scannerHome = tool "sonarqube-scanner"
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage("Quality Gate") {
            steps {
                timeout(time: 5, unit: "MINUTES") {
                    waitForQualityGate abortPipeline: true
                }
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

        stage("Deploy Docker Compose") {
            steps {
                sh "docker compose -p ${COMPOSE_PROJECT} down --remove-orphans || true"
                sh "docker compose -p ${COMPOSE_PROJECT} up -d"
                sh "docker compose -p ${COMPOSE_PROJECT} ps"
            }
        }

        stage("Deploy Minikube") {
            steps {
                script {
                    sh "kubectl config use-context minikube --kubeconfig=${KUBECONFIG}"
                    sh "kubectl set image deployment/backend backend=${IMAGE_BACKEND}:${IMAGE_TAG} -n ${K8S_NAMESPACE} --kubeconfig=${KUBECONFIG}"
                    sh "kubectl set image deployment/frontend frontend=${IMAGE_FRONTEND}:${IMAGE_TAG} -n ${K8S_NAMESPACE} --kubeconfig=${KUBECONFIG}"
                    sh "kubectl rollout status deployment/backend -n ${K8S_NAMESPACE} --timeout=120s --kubeconfig=${KUBECONFIG}"
                    sh "kubectl rollout status deployment/frontend -n ${K8S_NAMESPACE} --timeout=120s --kubeconfig=${KUBECONFIG}"
                    sh "kubectl get pods -n ${K8S_NAMESPACE} --kubeconfig=${KUBECONFIG}"
                }
            }
        }

        stage("Deploy EKS") {
            steps {
                script {
                    sh "kubectl config use-context arn:aws:eks:eu-west-3:587748224212:cluster/myportfolio-eks --kubeconfig=${KUBECONFIG}"
                    sh "kubectl get nodes --kubeconfig=${KUBECONFIG}"
                    sh "kubectl set image deployment/backend backend=${IMAGE_BACKEND}:${IMAGE_TAG} -n ${K8S_NAMESPACE} --kubeconfig=${KUBECONFIG}"
                    sh "kubectl set image deployment/frontend frontend=${IMAGE_FRONTEND}:${IMAGE_TAG} -n ${K8S_NAMESPACE} --kubeconfig=${KUBECONFIG}"
                    sh "kubectl rollout status deployment/backend -n ${K8S_NAMESPACE} --timeout=180s --kubeconfig=${KUBECONFIG}"
                    sh "kubectl rollout status deployment/frontend -n ${K8S_NAMESPACE} --timeout=180s --kubeconfig=${KUBECONFIG}"
                    sh "kubectl get pods -n ${K8S_NAMESPACE} --kubeconfig=${KUBECONFIG}"
                }
            }
        }

    }

    post {
        success {
            emailext(
                to: "papalioune03@gmail.com",
                subject: "SUCCESS: Pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """Le pipeline a reussi !
Build: #${env.BUILD_NUMBER}
Portfolio Docker Compose : http://192.168.93.239:8080
Portfolio Minikube       : http://192.168.49.2:30080
Portfolio EKS            : http://a8976107d488e498395d1c1225bec5e2-67bcae6fdeb95e76.elb.eu-west-3.amazonaws.com
SonarQube                : http://192.168.93.239:9000/dashboard?id=myportfolio-pipeline
Logs Jenkins             : ${env.BUILD_URL}""",
                mimeType: "text/plain"
            )
        }
        failure {
            emailext(
                to: "papalioune03@gmail.com",
                subject: "FAILURE: Pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Le pipeline a echoue ! Logs: ${env.BUILD_URL}console",
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
