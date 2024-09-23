
# javascript

const fs = require('fs');
const path = require('path');
const http = require('http');

### These lines import the required Node.js modules:
### fs: For working with the file system.
### path: For handling and transforming file paths.
### http: For creating the server and handling HTTP requests.

# javascript

const dataDir = path.join(__dirname, 'data', 'shopping-list');
const shoppingListFile = path.join(dataDir, 'shopping-list.json');
const port = 3000;

### dataDir: Combines the current directory (__dirname), data, and shopping-list to create the full path where the shopping list data is stored.
### shoppingListFile: Full path to the shopping-list.json file, which will store the shopping list data.
### port: Defines the port number (3000) where the server will listen for HTTP requests.

## Directory Initialization

# javascript

const initializeData = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('Data directory created:', dataDir);
  } else {
    console.log('Data directory already exists:', dataDir);
  }

  if (!fs.existsSync(shoppingListFile)) {
    fs.writeFileSync(shoppingListFile, JSON.stringify([], null, 2));
    console.log('shopping-list.json created.');
  } else {
    console.log('shopping-list.json already exists.');
  }
};


### initializeData: A function to set up the initial directory and JSON file if they don't already exist.
### Checks if the dataDir exists. If not, it creates the directory.
### Then checks if the shopping-list.json file exists. If not, it creates the file and initializes it with an empty array ([]) in JSON format.

# javascript

initializeData();

### Calls initializeData when the server starts to ensure the directory and file are present.
### JSON File Operations

# javascript

const readJSONFile = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent);
};

const writeJSONFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

### readJSONFile: A function that reads the contents of the JSON file, parses it, and returns the JavaScript object or array. utf8 encoding is used to read the file as a string.
### writeJSONFile: A function that takes data and writes it to the JSON file, converting it back into JSON format.

## Handle CRUD Operations

# javascript

const handleShoppingListRequest = (req, res) => {
  const method = req.method;

### handleShoppingListRequest: Main function to handle different HTTP methods (GET, POST, PUT, DELETE). req.method stores the request method type (GET, POST, etc.).
### GET Request (Retrieve List)

# javascript

if (method === 'GET') {
  try {
    const shoppingList = readJSONFile(shoppingListFile);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(shoppingList));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Failed to read shopping list' }));
  }
}

### If the request method is GET, the function retrieves the shopping list by reading the shopping-list.json file using readJSONFile.
### If successful, it responds with a status code of 200 (OK) and sends the shopping list as a JSON response.
### If an error occurs, it responds with a status code of 500 and an error message.
### POST Request (Add New Item)

# javascript

else if (method === 'POST') {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    try {
      const newItem = JSON.parse(body);
      if (!newItem.id || !newItem.name) {
        throw new Error('Invalid item format');
      }
      const shoppingList = readJSONFile(shoppingListFile);
      shoppingList.push(newItem);
      writeJSONFile(shoppingListFile, shoppingList);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newItem));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  });
}


### If the method is POST, it handles adding a new item to the shopping list.
### Listens for incoming data (req.on('data')) and appends chunks to the body.
### Once the body is fully received (req.on('end')), it parses the body (JSON string) into a JavaScript object.
### It checks if the item has both id and name, throws an error if the format is invalid.
### The new item is added to the shopping list, and the file is updated using writeJSONFile.
### Returns the newly added item with a status code of 201 (Created). If an error occurs, it responds with a 400 status code (Bad Request).
### PUT/PATCH Request (Update Item)

# javascript

else if (method === 'PUT' || method === 'PATCH') {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    try {
      const updatedItem = JSON.parse(body);
      if (!updatedItem.id) {
        throw new Error('Item ID is required for update');
      }
      const shoppingList = readJSONFile(shoppingListFile);
      const index = shoppingList.findIndex(item => item.id === updatedItem.id);
      if (index !== -1) {
        shoppingList[index] = { ...shoppingList[index], ...updatedItem };
        writeJSONFile(shoppingListFile, shoppingList);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(shoppingList[index]));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Item not found' }));
      }
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  });
}

### Handles PUT or PATCH requests, which are used to update an existing item.
#### Receives and parses the request body as JSON.
#### It requires the item to have an id for identification, otherwise throws an error.
### Finds the item in the shopping list by comparing the id. If found, it updates the item.
#### Writes the updated shopping list back to the file and responds with the updated item.
### If the item is not found, it responds with a 404 status code (Not Found).
### DELETE Request (Delete Item)

# javascript

else if (method === 'DELETE') {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    try {
      const { id } = JSON.parse(body);
      if (!id) {
        throw new Error('Item ID is required for deletion');
      }
      let shoppingList = readJSONFile(shoppingListFile);
      const initialLength = shoppingList.length;
      shoppingList = shoppingList.filter(item => item.id !== id);
      if (shoppingList.length < initialLength) {
        writeJSONFile(shoppingListFile, shoppingList);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Item deleted' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Item not found' }));
      }
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
  });
}

### Handles DELETE requests, used to delete an item.
### Parses the body to get the id of the item to be deleted.
### Filters the shopping list to remove the item with the matching id.
### If the list is shorter than before, it writes the updated list to the file and returns a success message.
### If no item was removed, it responds with a 404 status code.
### Method Not Allowed

# javascript

else {
  res.writeHead(405, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}

### For any HTTP method other than GET, POST, PUT, PATCH, or DELETE, the server responds with a 405 status code (Method Not Allowed).
### Creating the HTTP Server

# javascript

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/shopping-list')) {
    handleShoppingListRequest(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});


### This creates the HTTP server and listens for requests.
### If the URL path starts with /shopping-list, it routes the request to handleShoppingListRequest.
### Otherwise, it responds with a 404 status code (Not Found).

# javascript

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

### Starts the server on the defined port (3000), and logs a message indicating that the server is running.
### In summary, this Node.js application serves as a basic file manager and REST API for managing a shopping list. It supports operations like retrieving the list (GET), adding new items (POST), updating items (PUT/PATCH), and deleting items (DELETE).