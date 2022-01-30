import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import data from './data/data.json'
import { Layout, Menu, Input } from 'antd';
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  SearchOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import "./App.css"

const { Header, Content, Footer, Sider } = Layout;

const getRepositoryNames = () => {
  const repositorySet = new Set()

  for (var metric_name in data['metrics']) {
    var values = []

    for (var repository_metric in data['metrics'][metric_name]) {
      repositorySet.add(repository_metric)
    }
  }

  return Array.from(repositorySet)
}

const getDashboard = (selectedRepository) => {
  const dashboard = []
  for (var metric_name in data['metrics']) {
    var values = []

    for (var repository_metric in data['metrics'][metric_name]) {
      values.push(data['metrics'][metric_name][repository_metric])
    }

    let box = [
      // Box with the values from all repositories
      {
        y: values,
        name: metric_name,
        type: 'box',
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: -1.8,
        boxmean: false
      }
    ]

    if (selectedRepository) {
      if (selectedRepository in data['metrics'][metric_name]) {
        box.push(
          // Point with the repositories selected
          {
            y: [data['metrics'][metric_name][selectedRepository]],
            name: selectedRepository,
            x: [metric_name],
            marker:
            {
              size: 7
            }
          }
        )
      }
    }

    dashboard.push({
      box_name: metric_name,
      box,
      'layout': {
        title: metric_name,
        yaxis:
        {
          type: 'log',
          autorange: true,
          showgrid: true,
          zeroline: true
        }
      }
    })
  }

  return dashboard
}

export default function App() {
  const [selectedRepository, setSelectedRepository] = useState()
  const [input, setInput] = useState('')

  const dashboard = getDashboard(selectedRepository)
  const repositoryNames = getRepositoryNames()

  const selectRepository = (name) => {
    if (name === selectedRepository) {
      setSelectedRepository(undefined)
    } else {
      setSelectedRepository(name)
    }
  }

  const config = {
    toImageButtonOptions:
    {
      format: 'svg',
      filename: 'metrics',
      height: 1024,
      width: 1024,
      scale: 1
    },
    scrollZoom: false,
    responsive: false,
  };

  const siderWidth = 500;


  return (
    <Layout hasSider>
      <Sider
        width={siderWidth}
      >
        <Input
          size="large"
          placeholder='Search for a repository'
          prefix={<SearchOutlined />}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <Menu theme="dark" mode="inline">
          {repositoryNames.filter(name => name.includes(input)).map((name, index) => (
            <Menu.Item key={name} onClick={() => selectRepository(name)}>{name}</Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header />
        <Content>
          <div >
            <ul>
              {dashboard.map((item, index) => (
                <li key={index}>
                  <Plot
                    data={item['box']}
                    layout={item['layout']}
                    config={config}
                  />
                </li>
              ))}
            </ul>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
