import React from "react";
import { Tabs, Button, Icon } from "antd";
import { Link } from "react-router-dom";
import { Header } from "../../../styles/styles";

import ProdutosAll from "./produtos";
import ProdutosXml from "./produtosImporterXml";

const { TabPane } = Tabs;

export default function IndexAdminProducts() {
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
          <Icon type="tags" style={{ fontSize: 20 }} /> GERENCIAR PRODUTOS
        </p>
        <Link to="/">
          <Button type="danger" shape="circle" icon="close" size="small" />
        </Link>
      </Header>
      <Tabs>
        <TabPane
          tab={
            <span>
              <Icon type="tags" />
              Todos os Produtos
            </span>
          }
          key="1"
        >
          <ProdutosAll />
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="Download" />
              Importados do XML
            </span>
          }
          key="2"
        >
          <ProdutosXml />
        </TabPane>
      </Tabs>
    </>
  );
}
