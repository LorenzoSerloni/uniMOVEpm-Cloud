![UniMovePm Logo](./public/Univpm_Logo.svg)
# UniMovePM Cloud


![Dashboard Page](.\public\Homepage.png)
![Visualization Page](.\public\VisualizationPage.png)

This projetc is linked to the uniMOVEpm analytics dashboard web based comprehensive analytics dashboard designed for monitoring and controlling autonomous vehicles in the Bosch Future Mobility Challenge. The idea behind the project is to buils a modern cloud hosted website for visualizing and managing simulation data coming from the numerous simulation sessions in preparation for the competition and also for deep analysis during the competition days to improve the performance of the car. The website is built with React, TypeScript, Vite, and Chart.js.  
Authentication is handled via AWS Cognito, and the app is ready for containerized deployment (Docker, AWS ECS).

---

## Features

- **Authentication:** Secure login with AWS Cognito.
- **Simulation Management:** View, filter, and delete simulation.
- **Data Visualization:** Interactive charts for simulation data using Chart.js.
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

- **Cognito:** Configured AWS Cognito settings in the authentication context/provider.
- **API:** Update related API calls in `src/Shared/ApiFunctionCaller.ts` as needed.
- **Styling:** Tailwind CSS is used for styling.

---

## License

This project is for educational and demonstration purposes.

---

## Author

Developed by Lorenzo Serloni & Simone Marconi.

