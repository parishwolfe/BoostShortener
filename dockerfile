FROM node:20-alpine

WORKDIR /app

# Install Dependencies
COPY package*.json ./
RUN npm install
COPY . .

# Set up Database
RUN npx prisma generate --schema=./db/schema.prisma

# Expose Port and Start Application
EXPOSE 3000
CMD ["npm", "run", "dev"]