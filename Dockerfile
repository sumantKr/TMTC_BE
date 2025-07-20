# Development Dockerfile

FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

EXPOSE 3000

# Use the local nodemon + ts-node setup
CMD ["npm","run", "dev"]
