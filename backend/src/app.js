const express = require('express');
const cors = require('cors');
const coursesRouter = require('./routes/courses');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/courses', coursesRouter);

module.exports = app;