import dotenv from 'dotenv';
import express, { type Application } from 'express';

dotenv.config();

export const app: Application = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});


