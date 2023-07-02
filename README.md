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


## Database Design
![pass-interviewing-system drawio](https://github.com/omarhosny206/graduation-project/assets/58389695/41ba4172-24e9-40e1-b218-ebde12ee47d7)

## Folder Structure
```
.
├── Dockerfile
├── Jenkinsfile
├── Jenkinsfile-remote-machine
├── README.md
├── docker-compose-dev.yml
├── docker-compose-dev2.yml
├── docker-compose.yml
├── nginx
│   └── nginx.conf
├── package-lock.json
├── package.json
├── pass-interviews-app-deployment.yml
├── src
│   ├── api-versions
│   │   ├── api-v1.ts
│   │   └── api-v2.ts
│   ├── config
│   │   ├── aws-s3-config.ts
│   │   ├── global.d.ts
│   │   └── mongo-config.ts
│   ├── controllers
│   │   ├── interview-controller.ts
│   │   ├── payment-controller.ts
│   │   ├── signin-controller.ts
│   │   ├── signup-controller.ts
│   │   └── user-controller.ts
│   ├── enums
│   │   ├── interview-status-enum.ts
│   │   ├── level-of-experience-enum.ts
│   │   ├── role-enum.ts
│   │   ├── skills-enum.ts
│   │   └── status-code-enum.ts
│   ├── interfaces
│   │   ├── error
│   │   │   └── response-error-interface.ts
│   │   ├── interviews
│   │   │   ├── interview-info-interface.ts
│   │   │   ├── interview-interface.ts
│   │   │   └── review-interface.ts
│   │   └── users
│   │       ├── fixed-users-interface.ts
│   │       ├── password-reset-interface.ts
│   │       ├── password-update-interface.ts
│   │       ├── signin-request-interface.ts
│   │       ├── signin-response-interface.ts
│   │       ├── socials-interface.ts
│   │       ├── timeslot-interface.ts
│   │       ├── user-info-interface.ts
│   │       └── user-interface.ts
│   ├── middlewares
│   │   ├── authentication.ts
│   │   ├── authorization.ts
│   │   ├── error-handler.ts
│   │   ├── expired-access-token-handler.ts
│   │   ├── github-authentication.ts
│   │   ├── google-authentication.ts
│   │   ├── linkedin-authentication.ts
│   │   ├── multer.ts
│   │   ├── not-found-handler.ts
│   │   ├── twitter-authentication.ts
│   │   └── validator.ts
│   ├── models
│   │   ├── interview-model.ts
│   │   └── user-model.ts
│   ├── routes
│   │   ├── expired-access-token-handler-route.ts
│   │   ├── interview-route.ts
│   │   ├── payment-route.ts
│   │   ├── signin-route.ts
│   │   ├── signup-route.ts
│   │   ├── signup-route2.ts
│   │   ├── user-route.ts
│   │   └── user-route2.ts
│   ├── server.ts
│   ├── services
│   │   ├── aws-s3-service.ts
│   │   ├── cron-service.ts
│   │   ├── email-publisher-service.ts
│   │   ├── email-service.ts
│   │   ├── image-service.ts
│   │   ├── interview-service.ts
│   │   ├── notification-service.ts
│   │   ├── payment-service.ts
│   │   ├── role-service.ts
│   │   ├── signin-service.ts
│   │   ├── signup-service.ts
│   │   ├── user-service.ts
│   │   └── video-meeting-service.ts
│   ├── utils
│   │   ├── all-level-of-experiences.ts
│   │   ├── all-roles.ts
│   │   ├── all-skills.ts
│   │   ├── all-status.ts
│   │   ├── api-error.ts
│   │   ├── authenticated-user-type.ts
│   │   ├── date-formatter.ts
│   │   ├── interview-type.ts
│   │   ├── jwt.ts
│   │   ├── response-error.ts
│   │   └── time-slots.ts
│   └── validations
│       ├── interview-create-order-schema.ts
│       ├── interview-info-schema.ts
│       ├── interview-schema.ts
│       ├── interview-update-review-schema.ts
│       ├── signin-schema.ts
│       ├── signup-by-provider-schema.ts
│       ├── signup-schema.ts
│       ├── user-delete-account.ts
│       ├── user-forgot-password-schema.ts
│       ├── user-info-schema.ts
│       ├── user-reset-password-schema.ts
│       ├── user-update-email-schema.ts
│       ├── user-update-password-schema.ts
│       ├── user-update-price-schema.ts
│       ├── user-update-skills-schema.ts
│       ├── user-update-socials-schema.ts
│       ├── user-update-timeslots-schema.ts
│       └── user-update-username-schema.ts
└── tsconfig.json
```

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
- Reverse Proxy: Nginx
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