require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const routes = require('./routes/index');
const swaggerUi = require('swagger-ui-express');
const Swagger = require('./swagger.json');
const User = require('./models/User');
const PORT = process.env.PORT || 3000;


connectDB();

app.use(cors(
    {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  ));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
console.log(process.env.DATABASE_URI)
app.get('/', (_req, res) => {
    res.send('Welcome to our devfest project API');
  });


app.use('/api', routes);

app.use('/documentation', swaggerUi.serve, swaggerUi.setup(Swagger));

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
})
