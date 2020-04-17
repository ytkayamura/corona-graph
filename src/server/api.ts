import express from 'express';
import { CaseModel } from './models';

const router = express.Router();

router.get('/cases', async (req, res) => {
  const data = await CaseModel.find({});
  res.status(200).send(data);
});
export default router;
