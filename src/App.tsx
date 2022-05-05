import React, { useState } from "react";
import { Layout, Input, Affix, Button } from "antd";
import { SearchOutlined, SettingOutlined } from "@ant-design/icons";
import "./App.css";
import { SettingsModal } from "./components/SettingsModal";
import { useQuery } from "react-query";
import { RepositoryMenu } from "./components/RepositoryMenu";
import { Dashboard } from "./components/Dashboard";
import { fetchRepositories, FetchRepositoriesProps, Repository } from "./api";

const { Content, Sider } = Layout;

export const SIDER_WIDTH = 350;

export default function App() {
  const [selectedRepository, setSelectedRepository] = useState("");
  const [input, setInput] = useState("");
  const [isSiderCollapsed, setIsSiderCollapsed] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [clusterSize, setClusterSize] = useState(50);
  const [dataset, setDataset] = useState("2");
  const [showDescriptions, setShowDescriptions] = useState(true);

  const { status, data } = useQuery<
    Repository[],
    unknown,
    Repository[],
    [string, FetchRepositoriesProps]
  >(["repositories", { dataset }], fetchRepositories);

  const repositoryNames = data?.map((x) => x.name) ?? [];

  const selectRepository = (name: string) => {
    if (name === selectedRepository) {
      setSelectedRepository("");
    } else {
      setSelectedRepository(name);
    }
  };

  return (
    <Layout hasSider>
      <SettingsModal
        isModalVisible={settingsVisible}
        setIsModalVisible={setSettingsVisible}
        dataset={dataset}
        setDataset={setDataset}
        clusterSize={clusterSize}
        setClusterSize={setClusterSize}
        showDescriptions={showDescriptions}
        setShowDescriptions={setShowDescriptions}
      />
      <Affix offsetTop={0}>
        <Sider
          className="sider"
          width={SIDER_WIDTH}
          collapsible
          collapsed={isSiderCollapsed}
          onCollapse={(isCollapsed) => setIsSiderCollapsed(isCollapsed)}
        >
          {!isSiderCollapsed && (
            <Affix offsetTop={0}>
              <div className="token-flex-center">
                <Button
                  icon={<SettingOutlined />}
                  className="settings-button"
                  onClick={() => setSettingsVisible(true)}
                />
                <Input
                  placeholder="Search for a repository"
                  prefix={<SearchOutlined />}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            </Affix>
          )}
          <RepositoryMenu
            display={!isSiderCollapsed}
            loading={status !== "success"}
            onRepositorySelect={selectRepository}
            repositoryNames={repositoryNames}
            searchTerm={input}
          />
        </Sider>
      </Affix>
      <Layout>
        <Content className="content">
          <Dashboard
            dataset={dataset}
            clusterSize={clusterSize}
            selectedRepository={selectedRepository}
            showDescriptions={showDescriptions}
          />
        </Content>
      </Layout>
    </Layout>
  );
}
