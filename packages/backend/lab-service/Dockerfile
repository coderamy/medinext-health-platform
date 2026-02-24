FROM node:20-alpine

WORKDIR /app

COPY package*.json package-lock.json* ./
COPY packages/backend/shared/package*.json ./packages/backend/shared/
COPY packages/backend/lab-service/package*.json ./packages/backend/lab-service/

RUN npm install

COPY packages/backend/shared ./packages/backend/shared/
COPY packages/backend/lab-service ./packages/backend/lab-service/

WORKDIR /app/packages/backend/lab-service

EXPOSE 3008

CMD ["npm", "run", "start:prod"]
