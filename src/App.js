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

    //Uma métric especific
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

    /*
    boxes.push(
      {
        //Valor dessa métrica, no reposito X
        // y: [iluwatar/java-design-patterns], 
        y: [data['iluwatar/java-design-patterns']],
        x: [key],
        name: key,
        marker:
        {
          size: 7
        }
      })
      */
  }

  var layout =
  {
    title: 'Metrics',
    yaxis:
    {
      //type: 'log',
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

  var items = []
  for (var key in data) {
    var element = (<li>{<span>{key}: {data[key]}</span>}</li>)
    items.push(element)
  }

  return (
    <div>
      <div>
        <Plot
          data={boxes}
          layout={layout}
          config={config}
        />
      </div>
      <div>
        <Plot
          data={boxes}
          layout={layout}
          config={config}
        />
      </div>
      <ul>
        {items.map(item => item)}
      </ul>
    </div>
  );
}
