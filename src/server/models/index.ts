import mongoose, { Document, Model } from 'mongoose';

interface CaseDocument extends Document {
  date: string;
  country: string;
  cases: number;
  deaths: number;
  createAt: Date;
  updatedAt: Date;
}

export interface Case {
  date: string;
  country: string;
  cases: number;
  deaths: number;
}

export const CaseModel: Model<CaseDocument> = mongoose.model(
  'Cases',
  new mongoose.Schema({
    date: String,
    country: String,
    cases: Number,
    deaths: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  })
);

