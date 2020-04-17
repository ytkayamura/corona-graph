import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cron from 'node-cron';

import api from './api';
import scrapeKourou from './getDataKourou';

const PORT: number = Number(process.env.PORT) || 8081;
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/corona';

mongoose.connect(DB_URI);
const routine = () => {
  scrapeKourou();
};
routine();
cron.schedule('0 * * * *', async () => {
  // 1時間ごとに実行
  try {
    routine();
  } catch (e) {
    console.log(e);
  }
});

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);

app.listen(PORT, (err: Error): void => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Express app listening on port ${PORT}`);
  }
});
export default app;
