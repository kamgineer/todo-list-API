const express = require("express");
const app = express();
const db = require("./db/queries");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create a to-do item
app.post('/todos', async (req, res) => {

    // Check that there's a request body and that it contains title and description
    if(!req.body || !req.body.title || !req.body.description) {
        return res.status(400).send('Title and Description are required.');
    }

    // Add task to database table
    // TODO: update 1 with actual user_id
    await db.insertTask(req.body.title, req.body.description, 1);

    // Get task from database table, so you can get the id from the database table
    const task = await db.getLatestTask(req.body.title, req.body.description, 1);

    // Upon successful creation of the to-do item, respond with the details of the created item.
    return res.json({
        id: task.id,
        title: task.title,
        description: task.description
    });

});

// Update a to-do item
app.put('/todos/:id', async (req, res) => {

    // Check that request body contains title and description
    if(!req.body || !req.body.title || !req.body.description) {
        return res.status(400).send('Title and Description are required.');
    }

    // Update database table record
    const id = parseInt(req.params.id, 10);
    await db.updateTask(req.body.title, req.body.description, id);

    // Get record that was just updated from the database table
    const task = await db.getTask(id);

    // Upon successful update of the to-do item, respond with the details of the updated item.
    return res.json({
        id: task.id,
        title: task.title,
        description: task.description
    });

});

// Delete a to-do item
app.delete('/todos/:id', async (req, res) => {

    // Delete task from database table
    const id = parseInt(req.params.id, 10);
    await db.deleteTask(id);

    // Upon successful deletion of the to-do item, respond with a 204 status code
    return res.status(204).send();
});

// Get to-do items
app.get('/todos', async (req, res) => {

    // Check that request query contains page and limit
    if(!req.query || !req.query.page || !req.query.limit) {
        return res.status(400).send('URL should look like: http://localhost:3000/todos?page=1&limit=10 with page and limit.');
    }

    // Convert info from req query from string to numbers, e.g. if path is entered as http://localhost:3000/todos?page=1&limit=10
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);

    // Get tasks and count of tasks to return from database table
    const tasks = await db.getAllTasks();
    const count = await db.getTaskCount();

    // Respond with the list of to-do items along with the pagination details.
    return res.json({
        data: tasks,
        page: page,
        limit: limit,
        total: count
    });
});

const PORT = 3000;
app.listen(PORT, (error) => {
  // Capture any startup errors, so they don't just silently fail
  if (error) {
    throw error;
  }
  console.log(`My first Express app - listening on port ${PORT}!`);
});