
# NestJS Bull Queue Implementation

This project demonstrates the integration of [Bull](https://github.com/OptimalBits/bull), a popular Redis-based queue library, with a NestJS application for efficient background task processing.

---

## Features

- Queue setup using `@nestjs/bull` package.
- Redis integration for managing queues.
- Routes to add and retrieve job details.
- Job processing for document upload tasks.
- Modularized structure for scalability and maintainability.

---

## Prerequisites

- **Node.js**: Ensure Node.js (v14 or later) is installed.
- **Redis**: Install and run Redis. [Redis Quick Start](https://redis.io/docs/getting-started/installation/)

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kunalpratapsinghh/user-document-management>
   cd user-document-management
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start Redis:

   ```bash
   redis-server
   ```

4. Run the application:

   ```bash
   npm run start
   ```

---

## Routes

### 1. Add a Job to the Queue

**POST** `/queue/document-upload`  
Adds a job to the `document-upload` queue.  

**Request Body**:  

```json
{
  "documentId": "12345"
}
```

**Response**:  

```json
{
  "status": "success",
  "jobId": "9",
  "message": "Job added to queue successfully"
}
```

---

### 2. Get Job Status

**GET** `/queue/document-upload/:jobId`  
Retrieves the status of a specific job.  

**Response**:  

- **If the job is found**:  

  ```json
  {
    "status": "completed",
    "jobId": "9",
    "data": {
      "documentId": "12345"
    }
  }
  ```

- **If the job is not found**:  

  ```json
  {
    "status": "error",
    "message": "Job not found"
  }
  ```

---

## Application Structure

### Modules

- **BullQueueModule**: Configures the Bull queue and handles job processing.
  - Registers the `document-upload` queue.
  - Exports `BullQueueService` for interacting with the queue.

### Controllers

#### QueueController

Defines the REST API endpoints for interacting with the `document-upload` queue:

- **POST** `/queue/document-upload`: Add a job to the queue.
- **GET** `/queue/document-upload/:jobId`: Fetch the status of a job.

---

### Services

#### BullQueueService

Handles queue interactions, including adding jobs and fetching job status.  

**Methods**:  

- `sendMessageToQueue(documentId: string)`: Adds a job to the queue.  
- `getJobStatus(jobId: string)`: Retrieves the status of a job.  

---

## Configuration

The `BullModule` is configured in the `BullQueueModule` to connect to Redis:

```typescript
BullModule.registerQueue({
  name: 'document-upload',
  redis: {
    host: 'localhost',
    port: 6379,
  },
});
```

Ensure your Redis server is running and accessible at `localhost:6379`.

---

## Usage

1. Add a job to the queue using `POST /queue/document-upload` with the required `documentId`.  

2. Monitor the job's status using `GET /queue/document-upload/:jobId`.  

3. Process the job in `BullQueueProcessor`:

   ```typescript
   @Process('processDocument')
   async handleDocumentProcessing(job: Job<{ documentId: string }>) {
     console.log(`Processing document with ID: ${job.data.documentId}`);
   }
   ```

---

### Author

Kunal Pratap Singh  
8906694875 
