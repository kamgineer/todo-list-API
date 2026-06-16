const pool = require("./pool");

async function getAllTasks() {
    const { rows } = await pool.query("SELECT id, title, description FROM tasks");
    return rows;
}

async function getLatestTask(title, description, user_id) {
    const { rows } = await pool.query(
        "SELECT id, title, description FROM tasks WHERE title = $1 AND description = $2 AND user_id = $3 ORDER BY id DESC LIMIT 1",
        [title, description, user_id]
    );
    return rows[0];
}

async function getTask(id) {
    const { rows } = await pool.query(
        "SELECT id, title, description FROM tasks WHERE id = $1",
        [id]
    );
    return rows[0];
}

async function getTaskCount() {
    const { rows } = await pool.query("SELECT COUNT(*) FROM tasks");
    return parseInt(rows[0].count, 10);
}

async function insertTask(title, description, user_id) {
    await pool.query("INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3)", [title, description, user_id]);
}

async function updateTask(title, description, id) {
    const { rows } = await pool.query(
        "UPDATE tasks SET title = $1, description = $2 WHERE id = $3",
        [title, description, id]
    );
    return;
}

async function deleteTask(id) {
    const { rows } = await pool.query(
        "DELETE FROM tasks WHERE id = $1",
        [id]
    );
    return;
}

async function insertUser(name, email, password) {
    await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [name, email, password]);
}

async function getUser(email) {
    const { rows } = await pool.query(
        "SELECT id, name, email, password FROM users WHERE email = $1",
        [email]
    );
    return rows[0];
}

async function getUserWithID(id) {
    const { rows } = await pool.query(
        "SELECT id, name, email, password FROM users WHERE id = $1",
        [id]
    );
    return rows[0];
}

module.exports = {
    getAllTasks,
    getLatestTask,
    getTask,
    getTaskCount,
    insertTask,
    updateTask,
    deleteTask,
    insertUser,
    getUser,
    getUserWithID
};