import React from "react";
import { Tabs, Tooltip, Icon } from "antd";

import GerarAnual from "./gerarAnual";
import ListarAnual from "./listAnual";

const { TabPane } = Tabs;

export default function GerarBalancete() {
  return (
    <>
      <Tabs defaultActiveKey="1" tabPosition="left" type="card">
        <TabPane
          tab={
            <Tooltip placement="right" title="Gerar Balancete Anual">
              <span>
                <Icon type="area-chart" />
                Gerar
              </span>
            </Tooltip>
          }
          key="1"
        >
          <GerarAnual />
        </TabPane>

        <TabPane
          tab={
            <Tooltip placement="right" title="Balancetes Anuais Gerados">
              <span>
                <Icon type="check" />
                Finalizados
              </span>
            </Tooltip>
          }
          key="2"
        >
          <ListarAnual />
        </TabPane>
      </Tabs>
    </>
  );
}
