import React from "react";
import { Icon, Tabs, Button } from "antd";
import { Header } from "../../styles/styles";
import { Link } from "react-router-dom";

import Estoques from "./controle/estoque";
import EstoqueBaixo from "./controle/baixoEstoque";

const { TabPane } = Tabs;

export default function Estoque() {
  return (
    <>
      <Header style={{ marginBottom: 10 }}>
        <p
          style={{
            fontWeight: "bold",
            marginBottom: -0.01,
            fontSize: 18,
          }}
        >
          <Icon type="container" style={{ fontSize: 20 }} />
          AJUSTAR ESTOQUE / PRODUTOS COM BAIXO ESTOQUE
        </p>
        <Link to="/">
          <Button type="danger" shape="circle" icon="close" size="small" />
        </Link>
      </Header>
      <Tabs>
        <TabPane
          tab={
            <span>
              <Icon type="switcher" />
              Ajustar Estoque
            </span>
          }
          key="1"
        >
          <Estoques />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="exception" />
              Baixo Estoque
            </span>
          }
          key="2"
        >
          <EstoqueBaixo />
        </TabPane>
      </Tabs>
    </>
  );
}
