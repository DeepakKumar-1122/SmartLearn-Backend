import express from 'express';
import mongoose from "mongoose";

const app = express();

app.use(express.json());

import learningPathRoutes from './routes/learningPathRoutes.js';

app.use("/api/learning-path", learningPathRoutes);


// Connet to MongoDB
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}!`);
    });
  })
  .catch((e) => {
    console.log(e);
  });