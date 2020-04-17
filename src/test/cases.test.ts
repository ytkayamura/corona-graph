import mongoose from 'mongoose';
import { CaseModel } from '../server/models';
import { DataFrame } from 'dataframe-js';

mongoose.connect('mongodb://localhost/corona2');
let data, df, tgt, dates, j;
async function getData() {
  data = await CaseModel.find({});
  df = new DataFrame(data.map((e) => e.toObject()));
  tgt = df.filter((r) => r.get('country') === 'トルコ').sortBy('date');
  dates = df.unique('date').select('date');

  j = dates.leftJoin(tgt, 'date').fillMissingValues(0, ['cases', 'deaths']);
}
getData();

/*
 * 以下、インタラクティブに確認用。
 * 一括で実行するとgetData()が終わってないのでエラーになる。
 */
tgt.select('country', 'date', 'cases').toArray();
j.toArray();
j.sortBy('date').toArray().flat();
