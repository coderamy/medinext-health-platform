FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies at root level
COPY package*.json package-lock.json* ./
COPY packages/backend/shared/package*.json ./packages/backend/shared/
COPY packages/backend/auth-service/package*.json ./packages/backend/auth-service/

RUN npm install

# Copy source code
COPY packages/backend/shared ./packages/backend/shared/
COPY packages/backend/auth-service ./packages/backend/auth-service/

WORKDIR /app/packages/backend/auth-service

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
