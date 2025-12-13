import { Button, Card, DatePicker, Form, Input, InputNumber, Select } from "antd";
import type { Dayjs } from "dayjs";
import type { EntryPayload } from "../types";

const categoryOptions = [
  { value: "food", label: "Food & Coffee" },
  { value: "transport", label: "Transport" },
  { value: "groceries", label: "Groceries" },
  { value: "housing", label: "Housing" },
  { value: "entertainment", label: "Entertainment" },
  { value: "others", label: "Others" }
];

type FormValues = EntryPayload & { occurred_at?: Dayjs };

interface EntryFormProps {
  loading: boolean;
  onSubmit: (payload: EntryPayload) => Promise<void>;
}

const EntryForm = ({ loading, onSubmit }: EntryFormProps) => {
  const [form] = Form.useForm<FormValues>();

  const handleFinish = async (values: FormValues) => {
    const normalized: EntryPayload = {
      ...values,
      occurred_at: values.occurred_at?.toISOString(),
      method: "manual"
    };
    await onSubmit(normalized);
    form.resetFields(["amount", "note"]);
  };

  return (
    <Card title="Manual Entry" className="content-card">
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          label="Amount (¥)"
          name="amount"
          rules={[{ required: true, message: "Please enter an amount" }]}
        >
          <InputNumber
            min={0.01}
            step={1}
            prefix="¥"
            size="large"
            style={{ width: "100%" }}
            placeholder="Enter spend amount"
          />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Select a category" }]}
        >
          <Select
            options={categoryOptions}
            size="large"
            placeholder="Pick a spending type"
            popupMatchSelectWidth={false}
          />
        </Form.Item>
        <Form.Item label="Note" name="note">
          <Input size="large" placeholder="Optional description" />
        </Form.Item>
        <Form.Item label="Occurred at" name="occurred_at">
          <DatePicker showTime size="large" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={loading}
            shape="round"
          >
            Save Entry
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EntryForm;
