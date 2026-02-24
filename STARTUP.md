# MediNext Health-Tech Platform - Startup Guide

## Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 15
- Redis >= 7
- Docker (optional, for containerized setup)

## Quick Start

### 1. Start Infrastructure Services

**Using Docker:**
```
bash
docker-compose up -d
```

**Manual Setup:**
- PostgreSQL: localhost:5432 (user: medinext, password: medinext_secret, db: medinext)
- Redis: localhost:6379

### 2. Start All Backend Services

**Start all services in development mode:**
```
bash
npm run start:dev
```

**Or start services individually:**

| Service | Command | Port |
|---------|---------|------|
| API Gateway | `cd packages/backend/api-gateway && npm run start:dev` | 3000 |
| Auth Service | `cd packages/backend/auth-service && npm run start:dev` | 3001 |
| Patient Service | `cd packages/backend/patient-service && npm run start:dev` | 3004 |
| Provider Service | `cd packages/backend/provider-service && npm run start:dev` | 3005 |
| Hospital Service | `cd packages/backend/hospital-service && npm run start:dev` | 3006 |
| Pharmacy Service | `cd packages/backend/pharmacy-service && npm run start:dev` | 3007 |
| Lab Service | `cd packages/backend/lab-service && npm run start:dev` | 3008 |
| Appointment Service | `cd packages/backend/appointment-service && npm run start:dev` | 3009 |
| Blood Bank Service | `cd packages/backend/blood-bank-service && npm run start:dev` | 3010 |
| Organ Donor Service | `cd packages/backend/organ-donor-service && npm run start:dev` | 3011 |
| Insurance Service | `cd packages/backend/insurance-service && npm run start:dev` | 3012 |
| Emergency Service | `cd packages/backend/emergency-service && npm run start:dev` | 3013 |
| AI Service | `cd packages/backend/ai-service && npm run start:dev` | 3014 |
| Notification Service | `cd packages/backend/notification-service && npm run start:dev` | 3015 |

## API Endpoints

### API Gateway (http://localhost:3000)

All requests go through the API Gateway which proxies to the appropriate service.

| Method | Endpoint | Service | Description |
|--------|----------|---------|-------------|
| GET | `/api/health` | Gateway | Health check |
| POST | `/api/v1/auth/register` | Auth | Register new user |
| POST | `/api/v1/auth/login` | Auth | Login user |
| POST | `/api/v1/auth/refresh` | Auth | Refresh token |
| GET | `/api/v1/auth/me` | Auth | Get current user |
| POST | `/api/v1/auth/logout` | Auth | Logout user |
| POST | `/api/v1/patients` | Patient | Create patient |
| GET | `/api/v1/patients` | Patient | Get all patients |
| GET | `/api/v1/patients/:id` | Patient | Get patient by ID |
| PUT | `/api/v1/patients/:id` | Patient | Update patient |
| DELETE | `/api/v1/patients/:id` | Patient | Delete patient |
| POST | `/api/v1/providers` | Provider | Create provider |
| GET | `/api/v1/providers` | Provider | Get all providers |
| GET | `/api/v1/providers/:id` | Provider | Get provider by ID |
| GET | `/api/v1/providers/nearby/:lat/:lng` | Provider | Find nearby providers |
| PUT | `/api/v1/providers/:id` | Provider | Update provider |
| PUT | `/api/v1/providers/:id/verify` | Provider | Verify provider |

### Direct Service Endpoints

#### Auth Service (http://localhost:3001/api/v1/auth)
```
POST   /register           - Register new user
POST   /login              - Login user
POST   /refresh            - Refresh token
GET    /me                 - Get current user profile
POST   /logout             - Logout user
POST   /change-password    - Change password (requires JWT)
```

#### Patient Service (http://localhost:3004/patients)
```
POST   /                    - Create patient
GET    /                    - List patients (pagination)
GET    /:id               - Get patient by ID
GET    /user/:userId       - Get patient by user ID
PUT    /:id               - Update patient
DELETE /:id               - Delete patient
PUT    /:id/insurance      - Update insurance info
PUT    /:id/emergency-contact - Update emergency contact
```

#### Provider Service (http://localhost:3005/providers)
```
POST   /                      - Create provider
GET    /                      - List providers (with filters)
GET    /:id                  - Get provider by ID
GET    /nearby/:lat/:lng     - Find nearby providers
PUT    /:id                  - Update provider
PUT    /:id/verify           - Verify provider
```

#### Appointment Service (http://localhost:3009/appointments)
```
POST   /                    - Create appointment
GET    /                    - List appointments
GET    /:id               - Get appointment by ID
PUT    /:id               - Update appointment
DELETE /:id               - Cancel appointment
```

#### Emergency Service (http://localhost:3013/emergency)
```
POST   /request              - Create emergency request
GET    /requests             - List emergency requests
GET    /requests/:id        - Get emergency request by ID
PUT    /requests/:id/status - Update request status
POST   /ambulances           - Request ambulance
GET    /ambulances           - List available ambulances
```

#### Organ Donor Service (http://localhost:3011/organ-donor)
```
POST   /donors               - Register organ donor
GET    /donors               - List donors
GET    /donors/:id          - Get donor by ID
POST   /recipients           - Register recipient
GET    /recipients           - List recipients
POST   /transplants          - Create transplant record
GET    /transplants          - List transplants
```

## Environment Variables

Create a `.env` file in each service or set these globally:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=medinext
DB_PASSWORD=medinext_secret
DB_NAME=medinext

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=medinext-secret-key
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000
```

## Testing

Run all tests:
```
bash
npm test
```

Run tests in watch mode:
```
bash
npm run test:watch
```

Build all services:
```
bash
npm run build
