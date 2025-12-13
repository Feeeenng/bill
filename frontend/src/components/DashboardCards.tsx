import { Card, Col, Empty, Progress, Row, Statistic, Tag, Tooltip, Typography } from "antd";
import type { DashboardSummary } from "../types";

interface DashboardCardsProps {
  data: DashboardSummary | null;
  loading: boolean;
}

const DashboardCards = ({ data, loading }: DashboardCardsProps) => {
  if (!data) {
    return (
      <Card className="content-card">
        <Empty description="No data for this day yet." />
      </Card>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card className="content-card" loading={loading} title="Daily Overview">
          <Statistic
            title="Total spend (¥)"
            value={data.total_spending}
            precision={2}
            valueStyle={{ color: "#36f6f0" }}
          />
          <Typography.Paragraph style={{ marginTop: 8 }}>
            Captured <Tag color="blue">{data.entry_count}</Tag> entries
          </Typography.Paragraph>
          {data.top_category && (
            <Typography.Text type="secondary">
              Top category · <Tag color="magenta">{data.top_category}</Tag>
            </Typography.Text>
          )}
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card className="content-card" loading={loading} title="Category split">
          {data.categories.map((category) => (
            <div key={category.category} style={{ marginBottom: 12 }}>
              <Tooltip title={`¥${category.amount.toFixed(2)}`}>
                <Typography.Text style={{ display: "block" }}>
                  {category.category} · {category.percentage.toFixed(1)}%
                </Typography.Text>
                <Progress
                  percent={Math.min(100, Number(category.percentage.toFixed(1)))}
                  showInfo={false}
                  strokeColor="#6246ff"
                />
              </Tooltip>
            </div>
          ))}
          {data.categories.length === 0 && (
            <Typography.Paragraph type="secondary">
              No spend categories for the selected date.
            </Typography.Paragraph>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardCards;
