## 🚀 Quick Start

**Prerequisites:** Apply Docker Compose from the first microservice first!

Create a `.env` file in the project root with the following variables:

```env
APP_PORT=3001

REDIS_PORT=6379
REDIS_HOST=redis-timeseries

KAFKA_PORT=9092
KAFKA_HOST=kafka
KAFKA_LOGS_CLIENT=logs-consumer
KAFKA_CONSUMER_GROUP_ID=logs-consumer-group

ELASTICSEARCH_PORT=9200
ELASTICSEARCH_HOST=elasticsearch
```

Hint: API docs available at GET localhost:3001/api
