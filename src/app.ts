import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Application } from 'express';
import expressSession from "express-session";
import passport from 'passport';
import globalErrorHandler from './app/middlewares/globalError.middleware';
import notFound from './app/middlewares/notFound.middleware';
import router from './app/routes';
import "./config/passport";

dotenv.config();


export const app: Application = express();

app.use(
  expressSession({
    secret: "1111ij",
    resave: false,
    saveUninitialized: false,
  })
);


app.use(cookieParser())
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors());

app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

//  not found route handler
app.use(notFound)

// global error handler
app.use(globalErrorHandler);