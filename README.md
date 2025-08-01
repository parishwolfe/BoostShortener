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

To start the development server locally with hot reload, you can run the following commands:

```bash
./scripts/run_dev.sh
```

This will start the application on [http://localhost:3000](http://localhost:3000) as well.

## Considerations for Scaling

When deploying this service to production, it is imperative to address the following concerns to ensure optimal performance and reliability:

- **Rate Limiting & Traffic Management:**  
  In production environments—particularly when operating within Kubernetes or multiple containerized deployments—it is essential to enforce rate limiting upstream of your application. An Nginx load balancer, for example, can effectively throttle abusive traffic. Implement the following snippet in your Nginx configuration to control the request rate and shield your containers:
  
  ```nginx
  # Establish a shared memory zone to store rate limiting metrics.
  limit_req_zone $binary_remote_addr zone=mylimit:10m rate=100r/m;
  
  server {
      listen 80;
      server_name yourdomain.com;
  
      location / {
          # Enforce rate limiting on all incoming requests.
          limit_req zone=mylimit burst=20 nodelay;
  
          proxy_pass http://your_upstream;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      }
  }
  ```
  
  This configuration guarantees that requests are controlled at the network edge, thereby preventing any single client from overloading your service.

- **Database Considerations:**  
  As the service scales horizontally, ensure that your PostgreSQL database can sustain a high level of concurrent connections. Employ connection pooling mechanisms (e.g., PgBouncer) and allocate resources prudently. Ongoing performance monitoring is critical to adjust your database infrastructure as load conditions evolve.

- **Horizontal Auto Scaling:**  
  It is non-negotiable to implement auto scaling for both your application containers and the database. Use the Horizontal Pod Autoscaler (HPA) in Kubernetes to dynamically adjust the number of Next.js containers. Additionally, explore managed PostgreSQL offerings that provide seamless horizontal scalability to meet variable demand.

- **Distributed Caching:**  
  With anticipated high request volumes—especially for redirect operations—deploy a distributed caching layer (such as Redis). This measure will drastically reduce database load by caching URL lookups and resulting in improved performance.

By rigorously addressing these aspects, you will ensure that the infrastructure scales efficiently while maintaining high performance and stability under heavy load.

## Comprehensive API Documentation

For easy reference, there is a postman collection that can be imported containing API endpoints and details at `/boostshortener.postman_collection.json`.

### POST /api/shorten

Creates a new short link. An optional `expiration` parameter (in minutes) can be provided so that the link expires after that many minutes.

#### Request Body

```json
{
  "url": "https://example.com",
  "expiration": 10  // Optional: number of minutes before the link expires.
}
```

#### Responses

- **201 Created**

  The short link was created successfully.
  
  ```json
  {
    "shortCode": "abc123",
    "url": "https://example.com"
  }
  ```

- **400 Bad Request**

  Either the URL is invalid or the expiration value is not a positive number.
  
  ```json
  {
    "error": "Invalid URL",
    "message": "Provided URL is not valid: https://example.com"
  }
  ```
  
  or
  
  ```json
  {
    "error": "Invalid expiration",
    "message": "Expiration must be a positive number (minutes)"
  }
  ```

- **500 Internal Server Error**

  ```json
  {
    "error": "Internal Server Error"
  }
  ```

---

### GET /api/all-links

Fetches all short links that are active and not expired.

#### Response

- **200 OK**

  ```json
  {
    "message": "ok",
    "links": [
      {
        "shortCode": "abc123",
        "originalUrl": "https://example.com",
        "createdAt": "2023-01-01T00:00:00Z",
        "clicks": 0,
        "isActive": true,
        "expiresAt": "2023-01-01T00:10:00Z"  // May be null if no expiration was set.
      }
    ]
  }
  ```

- **500 Internal Server Error**

  ```json
  {
    "error": "Internal Server Error"
  }
  ```

---

### POST /api/deactivate

Deactivates an existing short link using its `shortCode`.

#### Request Body

```json
{
  "shortCode": "abc123"
}
```

#### Responses

- **200 OK**

  ```json
  {
    "message": "Link deactivated",
    "link": {
      "id": 1,
      "shortCode": "abc123",
      "originalUrl": "https://example.com",
      "createdAt": "2023-01-01T00:00:00Z",
      "clicks": 0,
      "isActive": false,
      "expiresAt": "2023-01-01T00:10:00Z"  // May be null if no expiration was set.
    }
  }
  ```

- **400 Bad Request**

  ```json
  {
    "error": "Invalid short code"
  }
  ```

- **404 Not Found**

  ```json
  {
    "error": "Link not found"
  }
  ```

- **500 Internal Server Error**

  ```json
  {
    "error": "Internal Server Error"
  }
  ```

---

### GET /[code]

Redirects to the original URL associated with the given `shortCode` provided in the URL. It increments the click counter if the link is active and not expired. If the link is expired or inactive, a 404 page is returned.

#### URL Example

```text
http://localhost:3000/abc123
```

#### Behavior

- **307 Temporary Redirect**

  If the link exists, is active, and not expired, the application will:
  
  - Increment the click counter.
  - Redirect the user to the original URL.
  
- **404 Not Found**

  If the link is expired or inactive (or does not exist), a 404 response is generated.

## Next Steps

These are the next things to tackle:
  
- [ ] Unit Tests
- [ ] CICD pipeline
- [ ] Code quality checks
- [ ] Build out UI for management
