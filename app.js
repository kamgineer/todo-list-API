const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create a to-do item
app.post('/todos', (req, res) => {

    // Check that request body contains title and description
    if(!req.body.title || !req.body.description) {
        return res.status(400).send('Title and Description are required.');
    }

    // TODO: database stuff (and then change the id value below)

    // Upon successful creation of the to-do item, respond with the details of the created item.
    return res.json({
        id: 1,
        title: req.body.title,
        description: req.body.description
    });

});

// Update a to-do item
app.put('/todos/:id', (req, res) => {

    // Check that request body contains title and description
    // TODO: HOW TO MAKE SURE YOU DON'T DUPLICATE THIS CODE WITH POST?
    if(!req.body.title || !req.body.description) {
        return res.status(400).send('Title and Description are required.');
    }

    // TODO: database stuff

    // Upon successful update of the to-do item, respond with the details of the created item.
    return res.json({
        id: Number(req.params.id),
        title: req.body.title,
        description: req.body.description
    });

});

// Delete a to-do item
app.delete('/todos/:id', (req, res) => {

    // TODO: database stuff

    // Upon successful deletion of the to-do item, respond with a 204 status code
    return res.status(204).send();
});

// Get to-do items
app.get('/todos', (req, res) => {
    // Check that request query contains page and limit
    if(!req.query.page || !req.query.limit) {
        return res.status(400).send('URL should look like: http://localhost:3000/todos?page=1&limit=10 with page and limit.');
    }

    // Convert info from req query from string to numbers, e.g. if path is entered as http://localhost:3000/todos?page=1&limit=10
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);

    // TODO: database stuff (and then change what you return below)

    // Respond with the list of to-do items along with the pagination details.
    return res.json({
        data: "need data",
        page: page,
        limit: limit,
        total: "calc total"
    });
    /*
    What you want to return:
    {
    "data": [
        {
        "id": 1,
        "title": "Buy groceries",
        "description": "Buy milk, eggs, bread"
        },
        {
        "id": 2,
        "title": "Pay bills",
        "description": "Pay electricity and water bills"
        }
    ],
    "page": 1,
    "limit": 10,
    "total": 2
    }
    */
});

const PORT = 3000;
app.listen(PORT, (error) => {
  // Capture any startup errors, so they don't just silently fail
  if (error) {
    throw error;
  }
  console.log(`My first Express app - listening on port ${PORT}!`);
});