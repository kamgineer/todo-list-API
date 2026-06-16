const express = require("express");
const db = require("./db/queries");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// functions to authenticate user
passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await db.getUser(email);
            if (!user) {
                return done(null, false, { message: "Email not found" });
            }
            if (user.password !== password) {
                return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);
        } catch(err) {
            return done(err);
        }
    })
);

passport.use(new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
        try {
            const user = await db.getUserWithID(payload.id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// Create user / User registration
app.post('/register', async (req, res) => {

    // Check that there's a request body and that it contains name, email and password
    if(!req.body || !req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).send('Name, email and password are required.');
    }

    // Add new user to database table
    await db.insertUser(req.body.name, req.body.email, req.body.password);

    // Respond with a token that can be used for authentication.
    return res.json({
        token: "xyz"
    });

});

// User log in
app.post('/login', (req, res, next) => {

    // Check that there's a request body and that it contains email and password
    if(!req.body || !req.body.email || !req.body.password) {
        return res.status(400).send('Email and password are required.');
    }

    // use passport to authenticate the provided credentials
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: info?.message || "Login failed" });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "15m" });
        return res.json({ token });
    }) (req, res, next);
});

// Create a to-do item
app.post('/todos', passport.authenticate("jwt", { session: false }), async (req, res) => {

    // if authentication is unsuccessful, the response is 401 Unauthorized

    // Check that there's a request body and that it contains title and description
    if(!req.body || !req.body.title || !req.body.description) {
        return res.status(400).send('Title and Description are required.');
    }

    // Add task to database table
    await db.insertTask(req.body.title, req.body.description, req.user.id);

    // Get task from database table, so you can get the id from the database table
    const task = await db.getLatestTask(req.body.title, req.body.description, req.user.id);

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
  console.log(`Express app - listening on port ${PORT}!`);
});