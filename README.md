# Pass Interviews (graduation-project)

## Description
"Pass Interviews" provides a realistic simulation of the interview process, replicating the dynamics, challenges, and expectations encountered in real-world interviews. This allows participants to gain valuable experience, build confidence, and enhance their chances of success in future interviews.



## Features 🚀🚀
- Authentication using JWT.
- Role-based Authorization.
- Signing-in using Email-Password, Google, GitHub, LinkedIn.
- Conducting Video Meetings via ZOOM API.
- Cron jobs for handling interviews statuses.
- Cloud storage for user profile image using AWS S3.
- Payment integration via PayPal API.
- Push Notifications integration via Firebase Cloud Messaging (FCM).
- Asynchronous Communication in Email Service via Message Queue.
- Unit & Integration Testing.
- Error and Exception handling.
- Containerization and Orchestration using Docker and Kubernetes.
- CI/CD on git push using Jenkins.

## Getting Started

To get started with this project, follow these steps:
### Using Docker:
```bash
docker compose up -d --build
```

### Manually:
- Install Dependencies
```bash
npm install
```

- Only Build
```bash
npm run build
```

- Build & Run in Production Mode
```bash
npm start
```

- Build & Run in Development Mode
```bash
npm run dev
```

### Testing
1. Install Dependencies
```bash
npm start
```
2. Run the tests
```bash
npm start
```

## Technology Stack
- Language: TypeScript
- Runtime Environment: NodeJS
- Framework: Express
- Database: MongoDB
- Message Queue: RabbitMQ
- Cloud: AWS
- Cloud Storage: AWS S3
- Containerization: Docker
- Orchestration: Kubernetes
- CI/CD: Jenkins

## Contributing
If you're interested in contributing to this project, please follow these guidelines:
1. Fork the repository.
2. Make your changes.
3. Submit a Pull Request.