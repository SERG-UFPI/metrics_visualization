import { Menu, Spin } from "antd";
import React, { ComponentProps } from "react";

interface Props {
  display: boolean;
  loading: boolean;
  repositoryNames: string[];
  onRepositorySelect: (repositoryName: string) => void;
  searchTerm: string;
}

export const RepositoryMenu = ({
  display,
  loading,
  repositoryNames,
  onRepositorySelect,
  searchTerm,
}: Props) => {
  const menuProps: ComponentProps<typeof Menu> = {
    theme: "dark",
    mode: "inline",
    defaultSelectedKeys: [],
    selectable: true,
  };

  if (!display) {
    return <Menu {...menuProps} />;
  }

  if (loading) {
    return (
      <Menu {...menuProps}>
        <div
          style={{
            display: "flex",
            marginTop: "20px",
          }}
        >
          <Spin
            size="large"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
        </div>
      </Menu>
    );
  }

  // return (  <Select
  //   showSearch
  //   placeholder="Select a repository"
  //   optionFilterProp="children"
  //   // filterOption={(input, option) =>
  //   //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  //   }
  // >
  //   <Option value="jack">Jack</Option>
  //   <Option value="lucy">Lucy</Option>
  //   <Option value="tom">Tom</Option>
  // </Select>)

  // const renderRow = ({ key }) => (
  //   <Menu.Item key={key} onClick={() => onRepositorySelect(key)}>
  //     {key}
  //   </Menu.Item>
  // );

  // const Row = ({ index }: { index: number }) => {
  //   const name = repositoryNames[index];
  //   return <Menu.Item key={name}>{name}</Menu.Item>;
  // };

  // return (
  //   <Menu {...menuProps}>
  //     {/* <VirtualList
  //       height={150}
  //       itemCount={repositoryNames.length}
  //       itemSize={35}
  //       width={300}
  //     > */}
  //       {/* @ts-ignore */}
  //       {/* {Row}
  //     </VirtualList> */}
  //   </Menu>
  // );

  return (
    <Menu {...menuProps}>
      {repositoryNames
        .filter((name) => name.includes(searchTerm))
        .map((name) => (
          <Menu.Item key={name} onClick={() => onRepositorySelect(name)}>
            {name}
          </Menu.Item>
        ))}
    </Menu>
  );
};
