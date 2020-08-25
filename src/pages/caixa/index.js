import React, { Component } from "react";
import { Tabs, Icon, Button } from "antd";
import { Link } from "react-router-dom";
import { Header } from "../../styles/styles";
import Open from "./aberto";
import Closed from "./fechado";

const { TabPane } = Tabs;

export default class GerenciarCaixa extends Component {
  render() {
    return (
      <>
        <Header>
          <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
            <Icon type="calculator" style={{ fontSize: 20 }} /> CAIXA DIÁRIO
          </p>
          <Link to="/">
            <Button type="danger" shape="circle" icon="close" size="small" />
          </Link>
        </Header>

        <Tabs defaultActiveKey="1" tabPosition="top" style={{ marginTop: 10 }}>
          <TabPane
            tab={
              <span>
                <Icon type="unlock" />
                Aberto
              </span>
            }
            key="1"
          >
            <Open />
          </TabPane>

          <TabPane
            tab={
              <span>
                <Icon type="lock" />
                Fechado
              </span>
            }
            key="2"
          >
            <Closed />
          </TabPane>
        </Tabs>
      </>
    );
  }
}
