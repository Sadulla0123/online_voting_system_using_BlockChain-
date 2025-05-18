pipeline {
    agent any
    environment {
        DOCKERHUB_CRED = credentials('dockerhub-creds')  // Jenkins-stored Docker Hub credentials
        SONAR_TOKEN = credentials('sonar-token')         // SonarQube token
        REPO_NAME = "online_voting_system_using_BlockChain"  // Your GitHub repo name
        DOCKER_IMAGE = "sadullaa/blockchain-voting"  // Customize your Docker image name
    }
    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', 
                url: "https://github.com/Sadulla0123/online_voting_system_using_BlockChain-.git"
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    // Install Node.js dependencies for React/frontend
                    dir('client') {
                        bat 'npm install'
                    }
                    // Install blockchain dependencies (e.g., Truffle, Hardhat)
                    dir('blockchain') {
                        bat 'npm install'
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    bat 'sonar-scanner.bat -Dsonar.projectKey=blockchain-voting -Dsonar.sources=. -Dsonar.host.url=http://localhost:9000 -Dsonar.login=${SONAR_TOKEN}'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('client') {
                    bat 'npm run build'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${env.BUILD_ID}")
                }
            }
        }

        stage('Security Scan (Trivy)') {
            steps {
                bat "trivy image --exit-code 1 --severity CRITICAL ${DOCKER_IMAGE}:${env.BUILD_ID}"
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-creds') {
                        docker.image("${DOCKER_IMAGE}:${env.BUILD_ID}").push()
                    }
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                withAWS(credentials: 'aws-creds', region: 'us-east-1') {
                    bat 'kubectl apply -f k8s/deployment.yaml'
                    bat 'kubectl apply -f k8s/service.yaml'
                }
            }
        }
    }
    post {
        success {
            slackSend channel: '#devops', 
                     message: "✅ Pipeline SUCCESS: ${env.JOB_NAME} (Build ${env.BUILD_NUMBER})"
        }
        failure {
            slackSend channel: '#devops', 
                     message: "❌ Pipeline FAILED: ${env.JOB_NAME} (Build ${env.BUILD_NUMBER})"
        }
    }
}
