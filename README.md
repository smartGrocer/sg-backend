# Cheappass.club

## Live Demo

- Frontend (WIP): [cheappass.club](https://cheappass.club/)
- Web API: [server.cheappass.club](https://server.cheappass.club/api)

## Overview

**Cheappass.club (formerly known as SmartGrocer)** is a comprehensive application that scrapes grocery store data across Canada to provide users with valuable insights on products and prices. The app allows users to add a list of grocery items to their cart, and then suggests the most cost-effective stores nearby, as well at historical price for a given product as well as any comparable products. Additionally, it identifies the best store or combination of stores to purchase the entire products in the cart at the lowest cost.

## Features

- **Data Scraping:** Collects store data, product details, and pricing from various grocery stores across Canada.
- **User Insights:** Analyze user buying behaviour based on the products/cart to provide insights.
- **Cost-Effective Shopping:** Recommends the most cost-effective stores based on the products in the cart and locations, using historical price data.
- **Multi-Store Optimization:** Identifies the best combination of stores to achieve the lowest overall cost for the product list.

## Product Roadmap

- See [TODO.md](TODO.md)

## Technology Stack

### Backend

- **Languages/Frameworks:** Typescript, Express, Node.js, Mongoose, Winston (Logger)
- **Database:** MongoDB
- **Testing:** Jest

### Scraping

- **Libraries:** axios, cheerio, cron
- **Panda Scraper** [amerkurev/scrapper](https://github.com/amerkurev/scrapper): Self-hosted Extract,Transform, and Load (ETL) pipeline for data agregation.

### Frontend (Currently WIP)

- **Framework:** React, React Router, React Query.
- **Languages:** Typescript
- **Styling:** TailwindCSS, DaisyUI.

### Deployment

- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Self-Hosting:** [Coolify](https://coolify.io/)
- **Monitoring:** NewRelic

## Installation and Running

### Prerequisites

- Node.js
- npm
- MongoDB instance or Atlas account
- Docker (Optional)
- Upstash Redis (Optional)

### Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

### Via Docker (Currently Deprecated)

> Note: Docker usage is currently deprecated due to switching to Coolify for hosting.

1. Start the project using Docker Compose:

   ```bash
   docker-compose -f .docker/docker-compose.dev.yml up --build
   ```

## License

This project is licensed under a proprietary license. Unauthorized copying, distribution, modification, or use of this software is strictly prohibited. For more information on licensing terms, please contact `nikhilpereira125@gmail.com`.

## Contact

For any inquiries, please contact `nikhilpereira125@gmail.com` or `nmpereira.com`.
