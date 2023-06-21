pipeline {
    agent any
    stages {
        stage("Pull Changes") {
            steps {
                dir("/var/jenkins_home/app/graduation-project") {
                    git branch: 'master', url: 'https://github.com/omarhosny206/graduation-project.git'
                }
            }
        }
      
       stage("Run Docker Compose") {
            steps {
                sh "docker compose -f /var/jenkins_home/app/graduation-project/docker-compose-dev2.yml up -d --build"
            }
        }
    }
}