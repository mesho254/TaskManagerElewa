const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const cors = require('cors');
const corsOptions={origin:"*",credentials:true,optionSuccessStatus:200};
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./Swagger.json');

const app = express();
// Load env variables
dotenv.config();

// Swagger UI middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Connect to database
connectDB();


// Middleware
app.use(express.json());
app.use(cors(corsOptions))
app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./Routes/authRoutes'));
app.use('/api/departments', require('./Routes/departmentRoutes'));
app.use('/api/tasks', require('./Routes/taskRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`You can Test the API here ${"http://localhost:5000/api-docs/"}`);
});
