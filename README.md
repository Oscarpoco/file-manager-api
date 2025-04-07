# File Manager and Shopping List API

A Node.js application that serves as both a basic File Manager and a REST API for managing a shopping list. The application uses the built-in Node.js file system (fs) module to store shopping list data in JSON format and exposes CRUD operations through HTTP endpoints.

## Features

### File Manager:
* Creates a directory structure to store JSON files
* Creates and manages JSON files for the shopping list
* Reads and parses data from JSON files
* Updates files with new or modified data

### Shopping List API:
* Perform CRUD operations on the shopping list using HTTP methods
* RESTful endpoints for adding, reading, updating, and deleting shopping list items
* Basic error handling and validation

## Prerequisites

* [Node.js](https://nodejs.org/) (v12 or higher)
* [Postman](https://www.postman.com/) or any API testing tool for testing the API

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/oscarpoco/file-manager-api.git
cd file-manager-api
```

### Install Dependencies

```bash
npm install
```

### Start the Server

```bash
node app.js
```

The server will run at http://localhost:3000.

## API Usage

### Get All Items

**Request:**
```
GET http://localhost:3000/shopping-list
```

**Response:**
```json
[
  {
    "id": "1",
    "name": "Milk",
    "quantity": 1,
    "purchased": false
  },
  {
    "id": "2",
    "name": "Bread",
    "quantity": 2,
    "purchased": false
  }
]
```

### Add a New Item

**Request:**
```
POST http://localhost:3000/shopping-list
Content-Type: application/json

{
  "id": "3",
  "name": "Eggs",
  "quantity": 12,
  "purchased": false
}
```

**Response:**
```json
{
  "id": "3",
  "name": "Eggs",
  "quantity": 12,
  "purchased": false
}
```

### Update an Item

**Request:**
```
PUT http://localhost:3000/shopping-list
Content-Type: application/json

{
  "id": "1",
  "purchased": true
}
```

**Response:**
```json
{
  "id": "1",
  "name": "Milk",
  "quantity": 1,
  "purchased": true
}
```

### Delete an Item

**Request:**
```
DELETE http://localhost:3000/shopping-list
Content-Type: application/json

{
  "id": "2"
}
```

**Response:**
```json
{
  "message": "Item deleted"
}
```

## Project Structure

```
file-manager-api/
│
├── app.js                 # Main application entry point
├── data/                  # Directory created to store data files
│   └── shopping-list/     # Shopping list data directory
│       └── shopping-list.json  # JSON file containing shopping list items
│
├── package.json           # Project dependencies and scripts
└── README.md              # Project documentation
```

## How It Works

1. **Server Initialization**:
   - When the server starts, it checks if the required data directories and files exist
   - If not, it creates them automatically

2. **Data Storage**:
   - Shopping list items are stored in a JSON file at `data/shopping-list/shopping-list.json`
   - Each item in the shopping list has an ID, name, and can have additional properties

3. **API Operations**:
   - The server listens for HTTP requests to the `/shopping-list` endpoint
   - Different HTTP methods (GET, POST, PUT, DELETE) trigger corresponding CRUD operations
   - All operations update the JSON file in real-time

## Error Handling

The API includes basic error handling for:
- Invalid JSON format in requests
- Missing required fields (like ID)
- Item not found for update/delete operations
- Invalid HTTP methods




## Author

Oscar Poco (https://github.com/Oscarpoco)
