const path = require('path');
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const flash = require('express-flash');

const viewRouter = require('./routes/viewRoutes');
const authRouter = require('./routes/auth');
const courseRouter = require('./routes/courseRoutes');
const userRouter = require('./routes/userRoutes');
const homeworkRouter = require('./routes/homeworkRoutes');

const passport = require('passport');
const passportConfig = require('./config/passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');

dotenv.config({ path: './config/config.env' });

// Passport config
passportConfig(passport);

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// VIEW ENGINE
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Set global var
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.use('/', viewRouter);
app.use('/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/homework', homeworkRouter);

module.exports = app;
