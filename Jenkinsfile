pipeline {
  agent any

  environment {
    AWS_REGION  = 'us-east-1'
    ECR_URL     = '654654233405.dkr.ecr.us-east-1.amazonaws.com'
    IMAGE_NAME  = 'nodeapp'
    APP_SERVER  = '3.239.149.77'
  }

  stages {

    stage('Clone') {
      steps {
        git branch: 'main', url: 'https://github.com/pardhan18/nodeapp-cicd.git'
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t $IMAGE_NAME:$BUILD_NUMBER .'
        sh 'docker tag $IMAGE_NAME:$BUILD_NUMBER $ECR_URL/$IMAGE_NAME:latest'
      }
    }

    stage('Push to ECR') {
      steps {
        sh '''
          aws ecr get-login-password --region $AWS_REGION \
            | docker login --username AWS --password-stdin $ECR_URL
          docker push $ECR_URL/$IMAGE_NAME:latest
        '''
      }
    }

    stage('Deploy to EC2') {
      steps {
        sh '''
          ssh -i /var/jenkins_home/.ssh/pardhan.pem -o StrictHostKeyChecking=no ec2-user@$APP_SERVER "
            aws ecr get-login-password --region us-east-1 \
              | docker login --username AWS --password-stdin $ECR_URL
            docker pull $ECR_URL/$IMAGE_NAME:latest
            docker stop nodeapp 2>/dev/null || true
            docker rm nodeapp 2>/dev/null || true
            docker run -d --name nodeapp --restart always -p 80:3000 \
              $ECR_URL/$IMAGE_NAME:latest
          "
        '''
      }
    }

  }

  post {
    success { echo '✅ Deployed! App is live on http://3.239.149.77' }
    failure { echo '❌ Pipeline failed — check the logs above' }
  }
}
