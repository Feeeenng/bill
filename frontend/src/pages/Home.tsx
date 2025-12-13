import { Card, Col, DatePicker, List, Row, Space, Tag, Typography, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
import DashboardCards from "../components/DashboardCards";
import EntryForm from "../components/EntryForm";
import VoiceCapture from "../components/VoiceCapture";
import { createEntry, createVoiceEntry, fetchDashboard, fetchEntries } from "../services/api";
import type { DashboardSummary, Entry } from "../types";

const HomePage = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const loadData = useCallback(
    async (currentDate: Dayjs) => {
      setLoading(true);
      try {
        const [entryData, dashboardData] = await Promise.all([
          fetchEntries(currentDate.format("YYYY-MM-DD")),
          fetchDashboard(currentDate.format("YYYY-MM-DD"))
        ]);
        setEntries(entryData);
        setSummary(dashboardData);
      } catch (error) {
        console.error(error);
        messageApi.error("Unable to fetch data, please retry.");
      } finally {
        setLoading(false);
      }
    },
    [messageApi]
  );

  useEffect(() => {
    loadData(selectedDate);
  }, [selectedDate, loadData]);

  const handleManualSubmit = async (payload: Parameters<typeof createEntry>[0]) => {
    setFormLoading(true);
    try {
      await createEntry({ ...payload, method: "manual" });
      await loadData(selectedDate);
      messageApi.success("Manual entry saved.");
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to submit manual entry.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleVoiceSubmit = async (payload: Parameters<typeof createVoiceEntry>[0]) => {
    setVoiceLoading(true);
    try {
      const response = await createVoiceEntry(payload);
      messageApi.info(
        response.requires_confirmation
          ? "Voice entry parsed, please confirm."
          : "Voice entry created."
      );
      await loadData(selectedDate);
    } catch (error) {
      console.error(error);
      messageApi.error("Voice parsing failed.");
    } finally {
      setVoiceLoading(false);
    }
  };

  const handleDateChange = (value: Dayjs | null) => {
    setSelectedDate(value ?? dayjs());
  };

  return (
    <>
      {contextHolder}
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Typography.Title level={3} style={{ color: "#f5f7ff", marginBottom: 0 }}>
              Daily Ledger · {selectedDate.format("MMM DD")}
            </Typography.Title>
            <Typography.Text type="secondary">
              Track spending trends and capture entries in seconds.
            </Typography.Text>
          </Col>
          <Col>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              allowClear={false}
              size="large"
              style={{ minWidth: 180 }}
            />
          </Col>
        </Row>

        <DashboardCards data={summary} loading={loading} />

        <Row gutter={[24, 24]}>
          <Col xs={24} md={14}>
            <EntryForm loading={formLoading} onSubmit={handleManualSubmit} />
          </Col>
          <Col xs={24} md={10}>
            <VoiceCapture loading={voiceLoading} onCapture={handleVoiceSubmit} />
          </Col>
        </Row>

        <Card title="Entry Feed" className="content-card">
          <List
            className="entry-list"
            loading={loading}
            dataSource={entries}
            locale={{ emptyText: "No entries yet." }}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Space>
                      <Typography.Text strong>¥ {item.amount.toFixed(2)}</Typography.Text>
                      <Tag color={item.method === "voice" ? "purple" : "cyan"}>
                        {item.method === "voice" ? "Voice" : "Manual"}
                      </Tag>
                      <Tag>{item.category}</Tag>
                    </Space>
                  }
                  description={
                    <Typography.Text type="secondary">
                      {dayjs(item.occurred_at).format("HH:mm")} · {item.note || "No notes"}
                    </Typography.Text>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </Space>
    </>
  );
};

export default HomePage;
