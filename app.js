const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

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
const invitesRoutes = require('./routes/invites');

// express app
const app = express();

// database connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB connected!'))
  .catch(err => console.log('DB connection error:', err));

// CORS configuration
const corsOptions = {
    origin: ['https://osonmarket.com', 'https://osonserver-517x.onrender.com', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));

// middlewares
app.use(morgan('dev'));
app.use(express.json()); // body-parser o'rniga express.json() ishlatilmoqda
app.use(cookieParser());

// routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', sellerRoutes);
app.use('/api', invitesRoutes);
app.use('/api', operatorRoutes);
app.use('/api', marketRoutes);
app.use('/api', referralRoutes);
app.use('/api', profitRoutes);

// OPTIONS requests for preflight
app.options('*', cors(corsOptions));

// server port
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});