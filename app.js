const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require("path");
const textflow = require("textflow.js");

// config dotenv
require('dotenv').config({
    path: ".env"
});

// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const sellerRoutes = require('./routes/seller');
const operatorRoutes = require('./routes/operator');
const marketRoutes = require('./routes/market');
const referralRoutes = require('./routes/referral');
const profitRoutes = require('./routes/profit');

// express app
const app = express();
textflow.useKey(process.env.YOUR_API_KEY);

// database connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB connected!'))
  .catch(err => console.log('DB connection error:', err));

// middlewares
app.use(morgan('dev'));
app.use(express.json()); // express.json() already parses JSON, no need for body-parser
app.use(cookieParser());
// app.use(cors()); // allow cross-origin requests
app.use(cors({
    origin: ['http://localhost:5173', 'https://osonmarket.com']
}));

// routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', sellerRoutes);
app.use('/api', operatorRoutes);
app.use('/api', marketRoutes);
app.use('/api', referralRoutes);
app.use('/api', profitRoutes);

// Serve static files for production (optional)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
    });
}

// server port
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});