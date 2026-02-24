# Medinext Health Platform

A comprehensive microservices-based healthcare platform built with NestJS for the backend and Vite for the frontend.

## 🏥 Overview

Medinext Health Platform is a full-stack healthcare application that provides various health services including:
- Patient management
- Provider management
- Appointment scheduling
- Hospital services
- Pharmacy services
- Lab services
- Blood bank management
- Insurance services
- Organ donor management
- Emergency services
- AI-powered health analysis
- Notifications

## 🏗️ Architecture

### Backend Services (NestJS Microservices)

| Service | Description | Port |
|---------|-------------|------|
| API Gateway | Main entry point for all API requests | 3000 |
| Auth Service | Authentication and authorization | 3001 |
| Patient Service | Patient management | 3002 |
| Provider Service | Healthcare provider management | 3003 |
| Hospital Service | Hospital information management | 3004 |
| Appointment Service | Appointment scheduling | 3005 |
| Pharmacy Service | Pharmacy management | 3006 |
| Lab Service | Laboratory services | 3007 |
| Blood Bank Service | Blood bank management | 3008 |
| Insurance Service | Insurance processing | 3009 |
| Organ Donor Service | Organ donor registration | 3010 |
| Emergency Service | Emergency response | 3011 |
| AI Service | AI-powered health analysis | 3012 |
| Notification Service | Push and email notifications | 3013 |

### Frontend

- **Framework**: React with Vite
- **UI**: Custom CSS with responsive design

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or pnpm

### Installation

1. Clone the repository:
```
bash
git clone https://github.com/coderamy/medinext-health-platform.git
cd medinext-health-platform
```

2. Install dependencies:
```
bash
npm install
```

3. Start all services with Docker:
```
bash
docker-compose up -d
```

Or start services individually:
```
bash
# Start backend services
cd packages/backend
npm run start:dev

# Start frontend
cd packages/frontend
npm run dev
```

## 📁 Project Structure

```
health-tech-unicorn-platform/
├── .github/
│   └── workflows/          # CI/CD workflows
├── packages/
│   ├── backend/
│   │   ├── api-gateway/   # API Gateway service
│   │   ├── auth-service/  # Authentication service
│   │   ├── patient-service/
│   │   ├── provider-service/
│   │   ├── hospital-service/
│   │   ├── appointment-service/
│   │   ├── pharmacy-service/
│   │   ├── lab-service/
│   │   ├── blood-bank-service/
│   │   ├── insurance-service/
│   │   ├── organ-donor-service/
│   │   ├── emergency-service/
│   │   ├── ai-service/
│   │   ├── notification-service/
│   │   └── shared/        # Shared utilities
│   └── frontend/          # React frontend application
├── monitoring/            # Prometheus configuration
├── docker-compose.yml
├── package.json
└── README.md
```

## 🔧 Configuration

Environment variables can be configured in `.env` files for each service.

## 🧪 Testing

Run tests for all packages:
```
bash
npm run test
```

Run tests for a specific service:
```
bash
cd packages/backend/auth-service
npm run test
```

## 📝 API Documentation

API endpoints are available through the API Gateway at `http://localhost:3000`.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Authors

- Medinext Health Platform Team

---

Built with ❤️ for better healthcare delivery
