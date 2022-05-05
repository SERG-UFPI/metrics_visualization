import { BASE_URL } from "./constants";

type CustomQuery<T> = {
  queryKey: [string, T];
};

export type MetricById = Record<
  string,
  {
    description: string;
    is_upper: boolean;
    name: string;
  }
>;

export const fetchMetrics = (): Promise<MetricById> =>
  fetch(`${BASE_URL}/metrics`).then((response) => response.json());

export interface Repository {
  name: string;
  language: string;
  loc: number;
  stars: number;
  forks: number;
  open_issues: number;
  devs: number;
  commits: number;
}

export interface FetchRepositoriesProps {
  dataset: string;
}

export const fetchRepositories = ({
  queryKey: [_key, { dataset }],
}: CustomQuery<FetchRepositoriesProps>): Promise<Repository[]> =>
  fetch(`${BASE_URL}/datasets/${dataset}/repos`).then((response) =>
    response.json()
  );

export interface FetchRepositoriesMetricsProps {
  dataset: string;
  repository: string;
  clusterSize: number;
}

interface RepositoryMetrics {
  name: string;
  distance: number;
  x: number;
  y: number;
  near: boolean;
  metrics: Record<string, number>;
}

interface SelectedRepositoryMetrics extends RepositoryMetrics {
  language: string;
  loc: number;
  stars: number;
  forks: number;
  open_issues: number;
  devs: number;
  commits: number;
}

export interface RepositoriesMetrics {
  selected: SelectedRepositoryMetrics;
  repos: RepositoryMetrics[];
}

export const fetchRepositoriesMetrics = ({
  queryKey: [_key, { dataset, repository, clusterSize }],
}: CustomQuery<FetchRepositoriesMetricsProps>): Promise<RepositoriesMetrics> =>
  fetch(
    `${BASE_URL}/datasets/${dataset}/cluster/${repository}?near_n=${clusterSize}`
  ).then((response) => response.json());
