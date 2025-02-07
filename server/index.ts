// * SERVER * //
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// * INITIALIZE .ENV FILE
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

import apiRouter from './routers/apiRouter.ts';


// * CORS
app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());

// * ROUTER
app.use('/api', apiRouter);

// * START SERVER
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;