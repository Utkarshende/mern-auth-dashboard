const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// ROUTES
// Do NOT put auth middleware here. It should be inside the specific task routes instead.
app.use('/api/auth', require('./routes/auth')); 
app.use('/api/tasks', require('./routes/tasks'));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.log(err));