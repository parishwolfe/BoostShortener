# Boost Shortener

This project is a URL shortener built with Next.js, Prisma, and PostgreSQL. It provides a simple interface to shorten URLs and manage them effectively.

## Getting Started

This code must be run in a docker environment to bring up both the code and the database. Ensure that you have Docker installed and running on your machine. Then run the following commands in your terminal:

```bash
echo DATABASE_URL="postgresql://postgres:postgres@db:5432/boostshortener" >> .env
echo POSTGRES_PASSWORD="postgres" >> db/.env

docker-compose up --build
```

Note these passwords are placeholders for local development. In production, you must use secure passwords and environment variables.

Once the containers are up and running, you can access the application at:  
Local:  [http://localhost:3000](http://localhost:3000)  
Dev: {TODO: insert dev URL once deployed}  
Prod: {TODO: insert prod URL once deployed}

## Development

To start the development server locally without docker, you can run the following commands:

```bash
npm install
npm run dev
```

This will start the application on [http://localhost:3000](http://localhost:3000) as well.
