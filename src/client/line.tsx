import React, { useState, useEffect, FC } from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData } from 'chart.js';
import { DataFrame } from 'dataframe-js';

type Props = {
  cases: [];
};

export const LineGraph: FC<Props> = (props) => {
  const [data, setData] = useState<ChartData>({});
  const [selected, setSelected] = useState<string>('cases');

  const { cases } = props;
  const df = new DataFrame(cases || []);
  const datesDf = df.unique('date').select('date');

  function countryData(
    df: DataFrame,
    datesDf: DataFrame,
    name: string,
    color: string,
    graphType: string
  ) {
    let tgt = df.filter((r) => r.get('country') === name).sortBy('date');
    if (tgt.count() !== datesDf.count()) {
      // データ発生以前の日付について0埋め。
      // (トルコは3/12からデータが発生)
      tgt = datesDf
        .leftJoin(tgt, 'date')
        .fillMissingValues(0, [graphType])
        .sortBy('date');
    }
    return {
      label: name,
      fill: false,
      lineTension: 0,
      backgroundColor: color,
      borderColor: color,
      pointRadius: 1,
      data: tgt.select(graphType).toArray().flat(),
    };
  }

  function drawGraph(graphType: string) {
    const colors = [
      'pink',
      'red',
      'green',
      'blue',
      'yellow',
      'lime',
      'orange',
      'skyblue',
      'magenta',
      'rebeccapurple',
    ];

    // 日付リスト
    const dates = df
      .unique('date')
      .select('date')
      .sortBy('date')
      .toArray()
      .flat();
    // 最新日
    const latestDate = dates.slice(-1)[0];

    const countries = df
      .filter((r) => r.get('date') === latestDate)
      .sortBy(graphType, true)
      .select('country')
      .toArray()
      .flat();

    // 感染者数/死亡者数上位10カ国
    const data = {
      labels: dates,
      datasets: [...Array(10)]
        .map((v, i) => i)
        .map((i) =>
          countryData(df, datesDf, countries[i], colors[i], graphType)
        ),
    };
    setData(data);
  }

  useEffect(() => {
    if (cases) {
      drawGraph('cases');
    }
  }, [cases]);

  function onChangeGraphType(gtype: string) {
    setSelected(gtype);
    drawGraph(gtype);
  }
  return !cases ? (
    <div>Now Loading...</div>
  ) : (
    <div>
      <div>
        <label>感染者数</label>
        <input
          type="radio"
          value="cases"
          checked={selected === 'cases'}
          onChange={(e) => onChangeGraphType(e.target.value)}
        />{' '}
        <label>死者数</label>
        <input
          type="radio"
          value="deaths"
          checked={selected === 'deaths'}
          onChange={(e) => onChangeGraphType(e.target.value)}
        />
      </div>
      <Line data={data} />
    </div>
  );
};
