import { Button, Card, Form, Input, InputNumber, Select, Typography } from "antd";
import { useMemo } from "react";
import type { VoiceEntryRequest } from "../types";

interface VoiceCaptureProps {
  loading: boolean;
  onCapture: (payload: VoiceEntryRequest) => Promise<void>;
}

const VoiceCapture = ({ loading, onCapture }: VoiceCaptureProps) => {
  const [form] = Form.useForm<VoiceEntryRequest>();
  const waveBars = useMemo(() => Array.from({ length: 12 }), []);

  const handleFinish = async (values: VoiceEntryRequest) => {
    await onCapture(values);
    form.resetFields();
  };

  return (
    <Card title="Voice Entry" className="content-card">
      <Typography.Paragraph type="secondary" style={{ marginBottom: 12 }}>
        Paste the speech-to-text transcript or wire it from a recorder. The API will attempt to
        infer amount and category and return an editable draft.
      </Typography.Paragraph>
      <div className="voice-wave" aria-hidden>
        {waveBars.map((_, index) => (
          <span key={index} />
        ))}
      </div>
      <Form layout="vertical" form={form} onFinish={handleFinish} style={{ marginTop: 16 }}>
        <Form.Item
          label="Transcript"
          name="transcript"
          rules={[{ required: true, message: "Please add a transcript" }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="e.g. Grabbed a latte for 32 yuan"
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>
        <Form.Item label="Amount hint (optional)" name="amount_hint">
          <InputNumber min={0.01} prefix="¥" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Category hint (optional)" name="category_hint">
          <Select
            allowClear
            placeholder="Leave empty for auto detection"
            options={[
              { value: "food", label: "Food" },
              { value: "transport", label: "Transport" },
              { value: "groceries", label: "Groceries" },
              { value: "housing", label: "Housing" },
              { value: "entertainment", label: "Entertainment" },
              { value: "others", label: "Others" }
            ]}
          />
        </Form.Item>
        <Form.Item label="Note hint (optional)" name="note_hint">
          <Input placeholder="Extra context for the new entry" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          loading={loading}
          style={{ marginTop: 8 }}
        >
          Parse Voice Entry
        </Button>
      </Form>
    </Card>
  );
};

export default VoiceCapture;
