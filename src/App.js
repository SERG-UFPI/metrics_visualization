import React from 'react';
import Plot from 'react-plotly.js';
import data from './data/issues-age-median.json'

export default function App() {

  var metrics = { 'Issues age median': data }

  var boxes = []

  for (var key in metrics) {

    var values = []

    for (var curr in metrics[key]) {
      values.push(metrics[key][curr])
    }

    console.log(values)

    boxes.push(
      {
        y: values,
        name: key,
        type: 'box',
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: -1.8,
        boxmean: false
      })
  }

  var layout =
  {
    title: 'Metrics',
    yaxis:
    {
      type: 'log',
      autorange: true,
      showgrid: true,
      zeroline: true
    }
  };

  var config =
  {
    toImageButtonOptions:
    {
      format: 'svg',
      filename: 'metrics',
      height: 1024,
      width: 1024,
      scale: 1
    },

    scrollZoom: true,

    responsive: true
  };

  return (
      <div>
        <Plot
          data={boxes}
          layout={layout}
          config={config}
        />
      </div>
  );
}
