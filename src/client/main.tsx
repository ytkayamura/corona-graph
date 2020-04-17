import React, { useState, useEffect, FC } from 'react';
import ReactDOM from 'react-dom';
import { LineGraph } from './line';
import axios from 'axios';

const App: FC = () => {
  const [cases, setCases] = useState<[]>();
  async function getData() {
    const res = await axios.get('/api/cases');
    setCases(res.data);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <LineGraph cases={cases} />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#app'));
