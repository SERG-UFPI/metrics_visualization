import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import data from './data/data.json'
import { Layout, Menu, Input, Affix, List, Card } from 'antd';
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

const SIDER_WIDTH = 350

const getRepositoryNames = () => {
  const repositorySet = new Set()

  for (var metric_name in data['metrics']) {
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
        name: 'Metric',
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
            x: ['Metric'],
            marker:
            {
              size: 7
            }
          }
        )
      }
    }

    dashboard.push({
      box,
      'layout': {
        title: metric_name,
        yaxis:
        {
          type: 'log',
          autorange: true,
          showgrid: true,
          zeroline: true,
        },
        showlegend: false,
      }
    })
  }

  return dashboard
}

export default function App() {
  const [selectedRepository, setSelectedRepository] = useState()
  const [input, setInput] = useState('')
  const [isSiderCollapsed, setIsSiderCollapsed] = useState(false)

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
      width: 800,
      scale: 1
    },
    scrollZoom: false,
    responsive: false,
    showEditInChartStudio: true,
    plotlyServerURL: "https://chart-studio.plotly.com",
  };

  return (
    <Layout hasSider>
      <Affix offsetTop={0}>
        <Sider
          className="sider"
          width={SIDER_WIDTH}
          collapsible
          collapsed={isSiderCollapsed}
          onCollapse={(isCollapsed) => setIsSiderCollapsed(isCollapsed)}
        >
          {!isSiderCollapsed &&
            <Affix offsetTop={0}>
              <Input
                size="large"
                placeholder='Search for a repository'
                prefix={<SearchOutlined />}
                value={input}
                onChange={e => setInput(e.target.value)}
              />
            </Affix>
          }
          <Menu
            theme="dark"
            mode="inline"
            multiple
          >
            {!isSiderCollapsed && repositoryNames.filter(name => name
              .includes(input))
              .map((name, index) => (
                <Menu.Item key={name} onClick={() => selectRepository(name)}>
                  {name}
                </Menu.Item>
              ))}
          </Menu>
        </Sider>
      </Affix>
      <Layout>
        <Content className="content">
          <List
            className="content-list"
            grid={{
              gutter: 16,
              column: 2,
              xs: 1,
              sm: 1,
              md: 1,
              lg: 1,
              xl: 1,
              xxl: 2,
            }}
            dataSource={dashboard}
            renderItem={item => (
              <List.Item>
                <Card
                  width={0}
                  hoverable
                  className="content-list-card"
                >
                  <Plot
                    data={item.box}
                    layout={item.layout}
                    config={config}
                  />
                </Card>
              </List.Item>
            )}
          />
        </Content>
      </Layout>
    </Layout>
  );
}
