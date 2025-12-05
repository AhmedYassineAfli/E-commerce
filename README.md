# 🛒 E-Commerce Platform

> A modern, full-stack e-commerce solution built with Spring Boot and Angular

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-19.2-red.svg)](https://angular.io/)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

This E-Commerce platform is a comprehensive solution designed to provide a seamless online shopping experience. Built with modern technologies and best practices, it offers a robust backend API powered by Spring Boot and an elegant, responsive frontend developed with Angular.

The platform supports multiple user roles including customers, dealers, and deliverers, providing a complete ecosystem for online commerce operations.

## ✨ Features

### Customer Features
- 🔐 User authentication and authorization
- 🛍️ Product browsing and search
- 🛒 Shopping cart management
- 📦 Order placement and tracking
- 👤 User profile management
- 📱 Responsive design for all devices

### Dealer Features
- 📊 Product management (CRUD operations)
- 📈 Inventory tracking
- 💼 Order management
- 📊 Sales analytics

### Deliverer Features
- 🚚 Delivery assignment management
- 📍 Order tracking
- ✅ Delivery status updates

### Admin Features
- 👥 User management
- 📂 Category management
- 📊 System analytics
- 🔧 Platform configuration

## 🏗️ Architecture

This application follows a **microservices-inspired architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Angular Frontend                      │
│              (Port 4200 - Development)                   │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │Components│  │ Services │  │  Guards  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/REST API
                      │
┌─────────────────────▼───────────────────────────────────┐
│              Spring Boot Backend                         │
│              (Port 8080 - Default)                       │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │Controller│  │ Service  │  │Repository│             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────┬───────────────────────────────────┘
                      │ JPA/Hibernate
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  MySQL Database                          │
│                  (Port 3306)                             │
└─────────────────────────────────────────────────────────┘
```

## 🛠️ Technologies

### Backend
- **Framework**: Spring Boot 3.5.6
- **Language**: Java 17
- **Database**: MySQL
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Maven
- **API Documentation**: SpringDoc OpenAPI (Swagger UI)
- **Development Tools**: Spring Boot DevTools

### Frontend
- **Framework**: Angular 19.2
- **Language**: TypeScript 5.7
- **UI/UX**: Custom CSS with AOS animations
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **State Management**: RxJS
- **Server-Side Rendering**: Angular SSR
- **Testing**: Jasmine & Karma

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK)** 17 or higher
  ```bash
  java -version
  ```

- **Node.js** 18.x or higher and npm
  ```bash
  node --version
  npm --version
  ```

- **MySQL** 8.0 or higher
  ```bash
  mysql --version
  ```

- **Maven** 3.6+ (or use the included Maven wrapper)
  ```bash
  mvn --version
  ```

- **Angular CLI** 19.x
  ```bash
  npm install -g @angular/cli
  ```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/E-commerce.git
cd E-commerce
```

### 2. Database Setup

Create a MySQL database for the application:

```sql
CREATE DATABASE ecommerce_db;
CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd Backend
./mvnw clean install
```

### 4. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../Frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

Edit `Backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=ecommerce_user
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Server Configuration
server.port=8080

# Swagger/OpenAPI Configuration
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
```

### Frontend Configuration

The frontend uses a proxy configuration for API calls. Check `Frontend/proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

## 🏃 Running the Application

### Start the Backend

```bash
cd Backend
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### Start the Frontend

In a new terminal:

```bash
cd Frontend
npm start
```

The frontend will start on `http://localhost:4200`

### Access the Application

- **Frontend**: [http://localhost:4200](http://localhost:4200)
- **Backend API**: [http://localhost:8080](http://localhost:8080)
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **API Docs**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

## 📚 API Documentation

The API documentation is automatically generated using SpringDoc OpenAPI and is available through Swagger UI.

### Accessing Swagger UI

Once the backend is running, navigate to:
```
http://localhost:8080/swagger-ui.html
```

### Main API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User authentication |
| `/api/auth/register` | POST | User registration |
| `/api/products` | GET | Get all products |
| `/api/products/{id}` | GET | Get product by ID |
| `/api/products` | POST | Create new product |
| `/api/products/{id}` | PUT | Update product |
| `/api/products/{id}` | DELETE | Delete product |
| `/api/categories` | GET | Get all categories |
| `/api/orders` | GET | Get all orders |
| `/api/orders/{id}` | GET | Get order by ID |
| `/api/orders` | POST | Create new order |
| `/api/cart` | GET | Get user cart |
| `/api/cart/add` | POST | Add item to cart |

## 📁 Project Structure

```
E-commerce/
├── Backend/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/iset/
│   │   │   │       ├── controllers/  # REST Controllers
│   │   │   │       ├── services/     # Business Logic
│   │   │   │       ├── repositories/ # Data Access Layer
│   │   │   │       ├── models/       # Entity Classes
│   │   │   │       ├── dto/          # Data Transfer Objects
│   │   │   │       └── config/       # Configuration Classes
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                     # Unit & Integration Tests
│   ├── pom.xml                       # Maven Dependencies
│   └── mvnw                          # Maven Wrapper
│
├── Frontend/                         # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/          # Reusable Components
│   │   │   ├── pages/               # Page Components
│   │   │   ├── services/            # API Services
│   │   │   ├── guards/              # Route Guards
│   │   │   ├── models/              # TypeScript Interfaces
│   │   │   ├── app.component.*      # Root Component
│   │   │   ├── app.routes.ts        # Routing Configuration
│   │   │   └── app.config.ts        # App Configuration
│   │   ├── assets/                  # Static Assets
│   │   └── styles.css               # Global Styles
│   ├── angular.json                 # Angular Configuration
│   ├── package.json                 # npm Dependencies
│   ├── proxy.conf.json              # Proxy Configuration
│   └── tsconfig.json                # TypeScript Configuration
│
└── README.md                        # This file
```

## 🧪 Testing

### Backend Tests

Run backend tests using Maven:

```bash
cd Backend
./mvnw test
```

### Frontend Tests

Run frontend tests using Angular CLI:

```bash
cd Frontend
npm test
```

For end-to-end tests:

```bash
npm run e2e
```

## 🔨 Building for Production

### Backend Production Build

```bash
cd Backend
./mvnw clean package
```

The JAR file will be created in `Backend/target/Backend-E-commerce-0.0.1-SNAPSHOT.jar`

Run the production build:

```bash
java -jar target/Backend-E-commerce-0.0.1-SNAPSHOT.jar
```

### Frontend Production Build

```bash
cd Frontend
npm run build
```

The production files will be in `Frontend/dist/frontend/browser/`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow Java coding conventions for backend code
- Follow Angular style guide for frontend code
- Write meaningful commit messages
- Add unit tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- Angular team for the powerful frontend framework
- All contributors who have helped this project grow

## 📞 Support

For support, email your-email@example.com or open an issue in the GitHub repository.

---

<div align="center">
  Made with ❤️ by Your Team
</div>
