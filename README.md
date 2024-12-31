# Ygglink - Home App (In progress)

An **educational project** showcasing microservice architecture using **.NET 9**, **Angular**, and various related technologies. The project simulates a "home dashboard" where users can:

- Add tasks to a calendar with reminders  
- Track selected stocks  
- (More features planned, such as shopping lists and budget tracking)

The main goals are to learn about containerization, microservices, messaging, caching, and best practices in modern application development.

---

## Table of Contents

1. [Features](#features)  
2. [Architecture](#architecture)  
3. [Tech Stack](#tech-stack)   
4. [Usage](#usage)  
5. [Planned Features](#planned-features)  
6. [License](#license)

---

## Features

1. **Task Management & Calendar**  
   - Create, update, and delete tasks  
   - Calendar interface for scheduling  
   - Notifications for upcoming tasks

2. **Stock Tracking**  
   - Search and track specific stocks  
   - Display price updates and historical data  
   - Notifications for significant price changes

3. **Notifications Service**  
   - Centralized service for sending out push/email/text alerts  
   - Integrates with RabbitMQ to receive events from other services

4. **Caching & Persistence**  
   - **Redis** for caching commonly accessed or session-based data  
   - **SQL Server** for structured data (tasks, user profiles)  
   - **MongoDB** for unstructured or semi-structured data (stock history, logs)

5. **Background Jobs**  
   - Automatically fetch updated stock data on a schedule  
   - Clean up old notifications or tasks

6. **Real-time Communication (WebSockets)**  
   - Instant updates to the frontend for tasks, stocks, or notifications  
   - Optionally leveraging SignalR or other WebSocket-based solutions

---

## Architecture

Below is a simplified view of the microservice architecture: (In progress)


### High-Level Flow

1. **Angular** UI interacts with a gateway or aggregated endpoints.  
2. **API Gateway** forwards requests to the appropriate microservices (Tasks, Stocks, Notifications).  
3. **RabbitMQ** handles asynchronous communication between services.  
4. **Redis** is used for caching frequently accessed data.  
5. Each microservice manages its own data via **SQL Server** or **MongoDB**.

---

## Tech Stack

- **Frontend**  
  - [Angular](https://angular.io/) for building a single-page application

- **Backend**  
  - [.NET 9](https://dotnet.microsoft.com/) for microservices and API endpoints  
  - [RabbitMQ](https://www.rabbitmq.com/) for asynchronous messaging  
  - [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) for real-time updates (or SignalR)

- **Databases**  
  - [SQL Server](https://www.microsoft.com/en-us/sql-server) for relational data (e.g., tasks, user profiles)  
  - [MongoDB](https://www.mongodb.com/) for NoSQL data (e.g., stock history, logs)

- **Cache**  
  - [Redis](https://redis.io/) for distributed caching

- **Containerization**  
  - [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) for deploying services in containers

---

## Usage
- Register or Login.
- Add Tasks in "Calendar" section.
- Assign a name, due date, and set notification preferences.
- Track Stocks by searching or adding new ticker symbols on the "Stocks" page.
- Configure price alerts or real-time updates.
- Receive Notifications (email, SMS, or in-app) when tasks are due or stock prices hit thresholds.

## Planned Features
- **Advanced Stock Analytics**
  - Integrate more data sources, create dashboards, and real-time charting.
- **Mobile-Friendly UI**
  - Responsive design adjustments for better usability on phones and tablets.
- **Logging & Monitoring**
  - Use Serilog or ELK/EFK stack for centralized logging.
- **CI/CD Pipeline**
  - Set up GitHub Actions or Azure DevOps to automate testing and deployment.

## License
This project is licensed under the MIT License. Feel free to use, modify, and distribute this code for educational or commercial purposes.


