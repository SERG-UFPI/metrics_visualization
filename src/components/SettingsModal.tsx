import { Form, InputNumber, Modal, Select, Switch } from "antd";
import React from "react";

interface Props {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  dataset: string;
  setDataset: (value: string) => void;
  clusterSize: number;
  setClusterSize: (value: number) => void;
  showDescriptions: boolean;
  setShowDescriptions: (value: boolean) => void;
}

const { Option } = Select;

type FormProps = Pick<Props, "dataset" | "clusterSize" | "showDescriptions">;

export const SettingsModal = ({
  isModalVisible,
  setIsModalVisible,
  dataset,
  setDataset,
  clusterSize,
  setClusterSize,
  showDescriptions,
  setShowDescriptions,
}: Props) => {
  const [form] = Form.useForm<FormProps>();

  const onCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onOk = async () => {
    const validatedForm = await form.validateFields();
    setIsModalVisible(false);
    setDataset(validatedForm.dataset);
    setClusterSize(validatedForm.clusterSize);
    setShowDescriptions(validatedForm.showDescriptions);
  };

  return (
    // @ts-ignore
    <Modal
      title="Settings"
      visible={isModalVisible}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form
        form={form}
        initialValues={{ dataset, clusterSize, showDescriptions }}
      >
        <Form.Item label="Dataset" name="dataset">
          <Select>
            <Option value="2">
              Dataset de repositórios de popularidade média
            </Option>
          </Select>
        </Form.Item>
        <Form.Item label="Size of cluster" name="clusterSize">
          <InputNumber min={1} />
        </Form.Item>
        <Form.Item
          label="Show description on metric tooltip"
          name="showDescriptions"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
