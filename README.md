## 🚀 Quick Start

Create `.env` file in the project root with the following variables:

```env
APP_PORT=3000

MONGODB_PORT=27017
MONGODB_HOST=mongodb

REDIS_PORT=6379
REDIS_HOST=redis-timeseries

KAFKA_PORT=9092
KAFKA_HOST=kafka
KAFKA_LOGS_CLIENT=logs-producer
```

Move the docker-compose directory one level up (to be at the same level as test-task-service-1 and
test-task-service-2)

├── test-task-service-1 ├── test-task-service-2 └── docker-compose

Start the project:

```bash
docker-compose --evn-file .env up --build -d
```

Hint: API docs available at GET localhost:3000/api
