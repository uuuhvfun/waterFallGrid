import React from 'react';
import ReactDOM from 'react-dom';
import WaterfallGrid from './WaterfallGrid';
// import 'antd/dist/antd.css';
import './index.css';

const App = () => (
  <div>
    <h1>Waterfall Grid</h1>
    <WaterfallGrid />
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
