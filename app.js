const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
const path = require("path");
const textflow = require("textflow.js");

// config dotenv
require('dotenv').config({
    path:".env"
});

// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order')
const sellerRoutes = require('./routes/seller');
const marketRoutes = require('./routes/market');
const referralRoutes = require('./routes/referral');
const profitRoutes = require('./routes/profit');


// express app
const app = express();
textflow.useKey(process.env.YOUR_API_KEY);

// database connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => console.log('mongo cloud database successfully connected!'));


// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes)
app.use('/api', sellerRoutes);
app.use('/api', marketRoutes);
app.use('/api', referralRoutes);
app.use('/api', profitRoutes);

// server port
const port = process.env.PORT;

// app.use(express.static(path.join(__dirname,"./build")));

// app.get("*",(req,res) =>{
//     res.sendFile(path.resolve(__dirname,"./build/index.html"));
// })

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

