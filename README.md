# Test Task Project

Microservice application with two services using MongoDB, Redis, Kafka and Elasticsearch.

### Service-1 (Main Service)

- **File Processing**: Download files from URLs and parse JSON/Excel files
- **Data Storage**: Store parsed data in MongoDB
- **API**: REST API for retrieving data from uploaded files
- **Logging**: Send logs to Service-2 via Kafka
- **Metrics**: Record API events in Redis TimeSeries for performance monitoring

### Service-2 (Analytics Service)

- **Log Processing**: Subscribe to Service-1 logs via Kafka and automatically store in Elasticsearch
- **Search API**: REST API for retrieving logs with filters
- **PDF Reports**: Generate PDF reports with response time statistics from Service-1 endpoints

### Infrastructure

- **MongoDB**: Database for document storage
- **Redis**: Cache and time series for logs
- **Kafka**: Message queue for inter-service communication
- **Elasticsearch**: Search engine for logs and analytics

## 🚀 Quick Start

### 1. Create `.env` file in the project root

```env
# Service ports
SERVICE_1_PORT=3000
SERVICE_2_PORT=3001

# MongoDB configuration
MONGODB_HOST=mongodb
MONGODB_PORT=27017

# Redis configuration
REDIS_HOST=redis-timeseries
REDIS_PORT=6379

# Kafka configuration
KAFKA_HOST=kafka
KAFKA_PORT=9092

# Elasticsearch configuration
ELASTICSEARCH_HOST=elasticsearch
ELASTICSEARCH_PORT=9200
```

### 2. Start the project

```bash
docker-compose --env-file .env up --build -d
```

## 📋 Available Services

- **Service-1 API**: http://localhost:3000
  - **API Documentation**: http://localhost:3000/api (GET)
- **Service-2 API**: http://localhost:3001
  - **API Documentation**: http://localhost:3001/api (GET)

> **Note**: Database services (MongoDB, Redis, Kafka, Elasticsearch) are only accessible within the Docker network and not exposed to the host for security reasons.

## 📁 Project Structure

```
test-task/
├── service-1/          # Main service - file processing & API
├── service-2/          # Analytics service - logs & reports
├── docker-compose.yml  # Docker configuration
├── .env               # Environment variables
└── README.md          # Documentation
```
