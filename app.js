const fs = require('fs');
const path = require('path');
const http = require('http');

const dataDir = path.join(__dirname, 'data', 'shopping-list');
const shoppingListFile = path.join(dataDir, 'shopping-list.json');
const port = 3000;

// Function to initialize the data directory and JSON file
const initializeData = () => {
  // Check if data directory exists, if not, create it
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('Data directory created:', dataDir);
  } else {
    console.log('Data directory already exists:', dataDir);
  }

  // Check if shopping-list.json exists, if not, create it with an empty array
  if (!fs.existsSync(shoppingListFile)) {
    fs.writeFileSync(shoppingListFile, JSON.stringify([], null, 2));
    console.log('shopping-list.json created.');
  } else {
    console.log('shopping-list.json already exists.');
  }
};

// Initialize data on server start
initializeData();

// Helper functions to read and write JSON data
const readJSONFile = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent);
};

const writeJSONFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Handle CRUD operations for the shopping list
const handleShoppingListRequest = (req, res) => {
  const method = req.method;

  if (method === 'GET') {
    // Retrieve the shopping list
    try {
      const shoppingList = readJSONFile(shoppingListFile);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(shoppingList));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to read shopping list' }));
    }
  } else if (method === 'POST') {
    // Add a new item to the shopping list
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
  } else if (method === 'PUT' || method === 'PATCH') {
    // Update an existing item in the shopping list
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
  } else if (method === 'DELETE') {
    // Delete an item from the shopping list
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
  } else {
    // Method not allowed
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
};

// Create the HTTP server
const server = http.createServer((req, res) => {
  if (req.url.startsWith('/shopping-list')) {
    handleShoppingListRequest(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
