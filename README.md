# UniMovePM Cloud

A modern web dashboard for visualizing and managing simulation data, built with React, TypeScript, Vite, and Chart.js.  
Authentication is handled via AWS Cognito, and the app is ready for containerized deployment (Docker, AWS ECS).

---

## Features

- **Authentication:** Secure login with AWS Cognito.
- **Simulation Management:** View, filter, and delete simulation cards grouped by day.
- **Data Visualization:** Interactive charts for simulation data using Chart.js.
- **Responsive UI:** Clean, modern interface with light/dark mode support.
- **Skeleton Loaders:** Smooth loading experience with animated skeletons for cards and charts.
- **Production Ready:** Dockerized for easy deployment (local, cloud, ECS, etc).

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (for containerization)
- AWS account (for Cognito/ECS deployment)

### Local Development

1. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

2. **Run the app:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

3. **Open your browser:**  
   Visit [http://localhost:8080](http://localhost:8080) (or the port shown in your terminal).

---

### Docker

1. **Build the image:**
   ```sh
   docker build -t trial-image .
   ```

2. **Run the container:**
   ```sh
   docker run -p 8080:3000 trial-image
   ```

3. **Or use Docker Compose:**
   ```sh
   docker compose up --build
   ```

   The app will be available at [http://localhost:8080](http://localhost:8080).

---

### AWS ECS Deployment

- Push your Docker image to AWS ECR.
- Create an ECS cluster and service using the image.
- Expose port 8080 (or your chosen port) via a load balancer or security group.
- See [AWS ECS documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-launch-types.html) for details.

---

## Project Structure

```
src/
  Components/         # React components (cards, charts, skeletons, etc)
  Contexts/           # React context providers (auth, settings)
  Shared/             # Shared utilities and interfaces
  App.tsx             # Main app component
  Router.tsx          # Routing logic
  Visualization.tsx   # Visualization page
  ...
public/
  ...
Dockerfile
docker-compose.yml
vite.config.ts
.gitignore
```

---

## Customization

- **Cognito:** Configure your AWS Cognito settings in the authentication context/provider.
- **API:** Update `getCsvFile` and related API calls in `src/Shared/ApiFunctionCaller.ts` as needed.
- **Styling:** Tailwind CSS is used for styling; customize classes as you like.

---

## License

This project is for educational and demonstration purposes.  
For production use, please review and update security, error handling, and deployment settings.

---

## Author

Developed by [Your Name/Team].  
Feel free to contribute or open issues!

