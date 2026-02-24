FROM node:20-alpine

WORKDIR /app

COPY package*.json package-lock.json* ./
COPY packages/backend/shared/package*.json ./packages/backend/shared/
COPY packages/backend/patient-service/package*.json ./packages/backend/patient-service/

RUN npm install

COPY packages/backend/shared ./packages/backend/shared/
COPY packages/backend/patient-service ./packages/backend/patient-service/

WORKDIR /app/packages/backend/patient-service

EXPOSE 3004

CMD ["npm", "run", "start:prod"]
