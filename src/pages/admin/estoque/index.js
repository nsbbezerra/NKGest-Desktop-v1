import React, { useState } from "react";
import { Tabs, Button, Icon, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { Header } from "../../../styles/styles";

import ProdutosAll from "./produtos";
import ProdutosXml from "./produtosImporterXml";

const { TabPane } = Tabs;
const { Content, Sider } = Layout;

export default function IndexAdminProducts() {
  const [collapse, setCollapse] = useState(true);
  const [component, setComponent] = useState("todos");
  return (
    <>
      <Layout style={{ height: "100%", width: "100%" }}>
        <Sider
          collapsible
          collapsed={collapse}
          onCollapse={() => setCollapse(!collapse)}
        >
          <Menu theme="dark" defaultSelectedKeys="todos">
            <Menu.Item key="todos" onClick={() => setComponent("todos")}>
              <Icon type="tags" /> <span>Todos os Produtos</span>
            </Menu.Item>
            <Menu.Item key="xml" onClick={() => setComponent("xml")}>
              <Icon type="download" /> <span>XML Importados</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content
            style={{
              background: "#fff",
              padding: 10,
              overflowY: "auto",
            }}
          >
            <Header style={{ marginBottom: 10 }}>
              <p
                style={{
                  fontWeight: "bold",
                  marginBottom: -0.01,
                  fontSize: 18,
                }}
              >
                <Icon type="tags" style={{ fontSize: 20 }} /> GERENCIAR PRODUTOS
              </p>
              <Link to="/">
                <Button
                  type="danger"
                  shape="circle"
                  icon="close"
                  size="small"
                />
              </Link>
            </Header>
            {component === "todos" && <ProdutosAll />}
            {component === "xml" && <ProdutosXml />}
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
