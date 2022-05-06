import { Tooltip, Card, List, Spin, Typography } from "antd";
import React from "react";
import Plot from "react-plotly.js";
import { useQuery } from "react-query";
import {
  fetchMetrics,
  fetchRepositoriesMetrics,
  FetchRepositoriesMetricsProps,
  MetricById,
  RepositoriesMetrics,
} from "../api";
import { UNDER_THRESHOLD_BACKGROUND_COLOR } from "../constants";

const getMedian = (arr: number[]): number => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

type PlotProps = Plot["props"];

const PLOT_CONFIG: PlotProps["config"] = {
  toImageButtonOptions: {
    format: "svg",
    filename: "metrics",
    height: 1024,
    width: 800,
    scale: 1,
  },
  scrollZoom: false,
  responsive: false,
  showEditInChartStudio: true,
  plotlyServerURL: "https://chart-studio.plotly.com",
};

interface Props {
  dataset: string;
  selectedRepository: string;
  clusterSize: number;
  showDescriptions: boolean;
}

const Info = ({ text }: { text: string }) => (
  <Typography.Title level={2} style={{ marginTop: "40px " }}>
    {text}
  </Typography.Title>
);

export const Dashboard = ({
  dataset,
  selectedRepository,
  clusterSize,
  showDescriptions,
}: Props) => {
  const { data: metricData, status: metricStatus } = useQuery<MetricById>(
    "metrics",
    fetchMetrics
  );

  const { data: repositoryData, status: repositoryStatus } = useQuery<
    RepositoriesMetrics,
    unknown,
    RepositoriesMetrics,
    [string, FetchRepositoriesMetricsProps]
  >(
    ["cluster", { dataset, repository: selectedRepository, clusterSize }],
    fetchRepositoriesMetrics
  );

  if (!selectedRepository) {
    return <Info text="Please, select a repository" />;
  }

  if (metricStatus === "loading" || repositoryStatus === "loading") {
    return (
      <Spin
        size="large"
        style={{
          marginTop: "40px",
        }}
      />
    );
  }

  if (metricStatus === "error" || repositoryStatus === "error") {
    return <Info text="Error loading data. Please reload the page" />;
  }

  if (!metricData || !repositoryData) {
    return <Info text="No data to display" />;
  }

  const dashboardData = Object.entries(metricData).map(([id, metric]) => {
    const selectedRepositoryMetric = repositoryData.selected.metrics[id];

    const y = [
      selectedRepositoryMetric,
      ...repositoryData.repos.filter((x) => x.near).map((x) => x.metrics[id]),
    ];

    const isUnderThreshold =
      (getMedian(y) > selectedRepositoryMetric ? true : false) ===
      metric.is_upper;

    const backgroundColor: Partial<PlotProps["layout"]> = isUnderThreshold
      ? {
          plot_bgcolor: UNDER_THRESHOLD_BACKGROUND_COLOR,
          paper_bgcolor: UNDER_THRESHOLD_BACKGROUND_COLOR,
        }
      : {};

    const data: PlotProps["data"] = [
      {
        y,
        name: "Metric",
        type: "box",
        boxpoints: "all",
        jitter: 0.3,
        pointpos: -1.8,
        boxmean: true,
      },
      {
        y: [selectedRepositoryMetric],
        name: repositoryData.selected.name,
        x: ["Metric"],
        marker: {
          size: 7,
        },
      },
    ];

    const layout: PlotProps["layout"] = {
      ...backgroundColor,
      title: metric.name.split("_").join(" "),
      titlefont: { size: 24 },
      showlegend: false,
      yaxis: {
        type: "log",
        autorange: true,
        showgrid: false,
        zeroline: true,
      },
    };

    return {
      id,
      isUnderThreshold,
      description: metric.description,
      data,
      layout,
    };
  });

  return (
    <List
      style={{
        display: "flex",
        justifyContent: "center",
      }}
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
      dataSource={dashboardData}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <Tooltip title={showDescriptions ? item.description : undefined}>
            <Card
              hoverable
              style={{
                display: "flex",
                justifyContent: "center",
                backgroundColor: item.isUnderThreshold
                  ? UNDER_THRESHOLD_BACKGROUND_COLOR
                  : undefined,
              }}
            >
              <Plot
                data={item.data}
                layout={item.layout}
                config={PLOT_CONFIG}
              />
            </Card>
          </Tooltip>
        </List.Item>
      )}
    />
  );
};
