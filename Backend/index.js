const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const corsOptions={origin:"*",credentials:true,optionSuccessStatus:200};
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./Swagger.json');
const mongoose = require('mongoose');
const path = require('path')

const app = express();
// Load env variables
dotenv.config();

// Swagger UI middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Connect to database
const mongooseOptions={
  useNewUrlParser:true,
  useUnifiedTopology:true
};
mongoose.connect(process.env.MONGO_URI,
mongooseOptions,err=>{
  if(err){
      console.log(err)
  }
  else{
      console.log("Connected to MongoDB")
  }
});


// Middleware
app.use(express.json());
app.use(cors(corsOptions))
app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./Routes/authRoutes'));
app.use('/api/departments', require('./Routes/departmentRoutes'));
app.use('/api/tasks', require('./Routes/taskRoutes'));
app.use('/uploads', express.static(path.join(__dirname, './uploads/')));
app.use('/public', express.static(path.join(__dirname, './public/')));

app.get("/",(req,res)=>{
  res.status(200).json({
      team_name:"Mesho Devs",dev_team:["Mesho","Mesho254"].sort()})
  });
  
app.use("*",(req,res)=>{
  res.status(500).json({status:"error",message:"This route does not exist"})
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`You can Test the API here ${"http://localhost:5000/api-docs/"}`);
});
