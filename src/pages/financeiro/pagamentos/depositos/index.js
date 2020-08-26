import React from "react";
import { Icon, Tabs } from "antd";

import Vendas from "./vendas";
import Servicos from "./servicos";

const { TabPane } = Tabs;

export default function IndexDepósitos() {
  return (
    <>
      <Tabs defaultActiveKey="1" type="card" tabPosition="left">
        <TabPane
          tab={
            <span>
              <Icon type="shopping" />
              <span>Vendas</span>
            </span>
          }
          key="1"
        >
          <Vendas />
        </TabPane>

        <TabPane
          tab={
            <span>
              <Icon type="file-sync" />
              <span>Ordens</span>
            </span>
          }
          key="2"
        >
          <Servicos />
        </TabPane>
      </Tabs>
    </>
  );
}
