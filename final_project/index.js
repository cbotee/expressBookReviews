require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const secret = process.env.SECRET_KEY;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  console.log('JWT token:', token);
  console.log('JWT token secret:', secret);

  try {
    const decoded = jwt.verify(token, secret); 
    console.log('Decoded data:', decoded);
    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
});
 
const PORT =5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
