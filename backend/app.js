const path = require('path');
const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const usersRouter = require('./routes/userRoutes');
const walletsRouter = require('./routes/walletRoutes');
const transactionsRouter = require('./routes/transactionRoutes');
const adminRouter = require('./routes/adminRoutes');
const { testInterval } = require('./services/interval');

const app = express();
// Serving statci files
app.use(express.static(path.join(__dirname, 'public')));
// console.log(__dirname);
// Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(hpp());

// Limit requests from same API
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 300,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// set CORS
app.use(cors());

// Body parser, reading data from body into req.body
app.use(express.urlencoded({extended: true, limit: '10kb'}));
app.use(express.json({limit: '10kb'}));
app.use(cookieParser());

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  // console.log('cookie', req.cookies);
  // console.log('header', req.headers);
  next();
});

// Routes
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/wallets', walletsRouter);
app.use('/api/v1/transactions', transactionsRouter);
app.use('/api/v1/admin', adminRouter);



// Handling unhandled Routes
// app.all('*', (req, res, next) => {
  
// });


module.exports = app;