# File Manager and Shopping List API
This project is a Node.js application that serves as both a basic File Manager and a REST API for managing a shopping list. The application uses the built-in Node.js file system (fs) module to store shopping list data in JSON format and exposes CRUD operations (Create, Read, Update, Delete) through HTTP endpoints.

## Features

### File Manager:

Create a directory to store JSON files.
Create a new JSON file for the shopping list.
Read and parse data from the JSON file.
Update the JSON file with new or modified data.

### Shopping List API:

Perform CRUD operations on the shopping list using HTTP methods.
Endpoints available for adding, reading, updating, and deleting shopping list items.
Basic error handling and validation.

### Prerequisites
Node.js installed
Postman or any API testing tool for testing the API

## Getting Started
Clone the repository:

git clone https://github.com/oscarpoco/file-manager-shopping-list-api.git

Navigate to the project directory:

cd file-manager-shopping-list-api

### Install the required dependencies:

npm install

Start the server:

node app.js
The server will run at http://localhost:3000.

### Project Structure

file-manager-api/
│
├── data/                         # Directory for storing shopping list data
│   └── shopping-list/            # Directory created dynamically to store the shopping-list.json file
│       └── shopping-list.json    # JSON file for shopping list data
├── app.js                        # Main server file with API and File Manager logic
├── package.json                  # Project metadata and dependencies
└── node_modules/                 # Node.js modules installed via npm


### API Endpoints
GET /shopping-list: Retrieve the shopping list
POST /shopping-list: Add a new item to the shopping list
PUT /shopping-list: Update an existing item in the shopping list
DELETE /shopping-list: Delete an item from the shopping list