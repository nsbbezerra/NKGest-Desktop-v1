import React, { Component } from "react";
import { Icon, Button, Tabs, Layout, Menu } from "antd";
import { Header } from "../../../styles/styles";
import { Link } from "react-router-dom";

import PermissoesTab from "./permissoes";
import AtivacoesTab from "./ativacoes";
import ComissioesTab from "./comissoes";

const { TabPane } = Tabs;
const { Sider, Content } = Layout;

export default class AdminFuncionarios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: true,
      component: "permissao",
    };
  }
  render() {
    return (
      <>
        <Layout style={{ height: "100%", width: "100%" }}>
          <Sider
            collapsible
            collapsed={this.state.collapse}
            onCollapse={() => this.setState({ collapse: !this.state.collapse })}
          >
            <Menu theme="dark" defaultSelectedKeys="permissao">
              <Menu.Item
                key="permissao"
                onClick={() => this.setState({ component: "permissao" })}
              >
                <Icon type="lock" /> <span>Permissão</span>
              </Menu.Item>
              <Menu.Item
                key="comissoes"
                onClick={() => this.setState({ component: "comissoes" })}
              >
                <Icon type="percentage" /> <span>Comissões</span>
              </Menu.Item>
              <Menu.Item
                key="gestao"
                onClick={() => this.setState({ component: "gestao" })}
              >
                <Icon type="tool" /> <span>Gestão de Dados</span>
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
                  <Icon type="user" style={{ fontSize: 20 }} /> GERENCIAR
                  FUNCIONÁRIOS
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
              {this.state.component === "permissao" && <PermissoesTab />}
              {this.state.component === "comissoes" && <ComissioesTab />}
              {this.state.component === "gestao" && <AtivacoesTab />}
            </Content>
          </Layout>
        </Layout>
      </>
    );
  }
}
