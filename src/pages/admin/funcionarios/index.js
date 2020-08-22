import React, { Component } from "react";
import { Icon, Button, Tabs } from "antd";
import { Header } from "../../../styles/styles";
import { Link } from "react-router-dom";

import PermissoesTab from "./permissoes";
import AtivacoesTab from "./ativacoes";
import ComissioesTab from "./comissoes";

const { TabPane } = Tabs;

export default function AdminFuncionarios() {
  return (
    <>
      <Header>
        <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
          <Icon type="idcard" style={{ fontSize: 20 }} /> GESTÃO DE FUNCIONÁRIOS
        </p>
        <Link to="/">
          <Button type="danger" shape="circle" icon="close" size="small" />
        </Link>
      </Header>
      <Tabs>
        <TabPane
          tab={
            <span>
              <Icon type="lock" />
              Permissões
            </span>
          }
          key="1"
        >
          <PermissoesTab />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="percentage" />
              Comissões
            </span>
          }
          key="2"
        >
          <ComissioesTab />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="profile" />
              Dados
            </span>
          }
          key="3"
        >
          <AtivacoesTab />
        </TabPane>
      </Tabs>
    </>
  );
}
