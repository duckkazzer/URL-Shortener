# URL Shortener Project

This project is a URL shortener application with a backend built using NestJS and a frontend built using React. The project is containerized using Docker for easy setup and deployment.

## Table of Contents

- [URL Shortener Project](#url-shortener-project)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
  - [Contributing](#contributing)

## Features

- Shorten long URLs
- Redirect to original URLs using short URLs
- View analytics for shortened URLs (click count, recent clicks, Ip)
- Delete shortened URLs

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Installation

1. Clone the repository:

   ```bash
     git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
     cd YOUR_REPOSITORY_NAME

2. Create a .env file in the backend directory with the following content:

   ```bash
     DATABASE_HOST=db
     DATABASE_PORT=5432
     DATABASE_USER=user
     DATABASE_PASSWORD=password
     DATABASE_NAME=url_shortener

3. Build and start the Docker containers:

   ```bash
     docker-compose up --build

## Usage
  1. Open your browser and navigate to http://localhost:3001 to access the frontend application.
  2. Use the form to shorten URLs, view analytics, and delete URLs.

## API Endpoints
  Backend API
  
  - POST /urls/shorten
    - Create a shortened URL.
    - Request body:
      ```bash
      {
        "originalUrl": "https://example.com",
        "expiresAt": "2025-12-31T23:59:59.999Z",
        "alias": "custom-alias"
      }
    - Response:
      ```bash
      {
        "shortUrl": "http://localhost:3000/custom-alias"
      }
  
  - GET /urls/:alias
    - Redirect to the original URL using the short URL.
  
  - GET /urls
    - Get a list of all shortened URLs.
      
  - GET /urls/info/:alias
    - Get information about a specific shortened URL.
    - Response:
      ```bash
      {
        "originalUrl": "https://example.com",
        "createdAt": "2025-03-06T14:44:32.884Z",
        "expiresAt": "2025-12-31T23:59:59.999Z",
        "clickCount": 10
      }
         
  - DELETE /urls/delete/:alias
    - Delete a specific shortened URL.
    - Response:
      ```bash
      {
        "message": "URL deleted successfully"
      }
      
  - GET /urls/analytics/:alias
    - Delete a specific shortened URL.
    - Response:
      ```bash
      {
      "clickCount": 10,
      "recentClicks": [
          {
            "clickedAt": "2025-03-06T14:44:32.884Z",
            "ipAddress": "192.168.1.1"
          }
        ]
      }


## Contributing
  Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
      
    

