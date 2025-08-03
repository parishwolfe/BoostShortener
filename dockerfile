FROM node:20-alpine

WORKDIR /app

# Install Dependencies
COPY package*.json ./
RUN npm install
COPY . .

# Set up Database
RUN npx prisma generate --schema=./db/schema.prisma

# Build the application for production
RUN npm run build

# Expose Port and Start Application in production mode
EXPOSE 3000
CMD ["npm", "run", "start"]