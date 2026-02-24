FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY packages/backend/api-gateway/package*.json ./packages/backend/api-gateway/
COPY packages/backend/shared ./packages/backend/shared/

WORKDIR /app/packages/backend/api-gateway
RUN npm install

COPY packages/backend/api-gateway ./packages/backend/api-gateway/
COPY packages/backend/shared ./packages/backend/shared/

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
