import { Layout } from "antd";
import HomePage from "./pages/Home";

const { Content } = Layout;

const App = () => (
  <Layout className="app-shell">
    <Content>
      <HomePage />
    </Content>
  </Layout>
);

export default App;
