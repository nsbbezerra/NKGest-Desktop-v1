import React from "react";
import { Icon, Button, Tabs } from "antd";
import { Header } from "../../../styles/styles";
import { Link } from "react-router-dom";

import RelatorioFinan from "./relatorioFinanceiro";
import Gerar from "./gerarBalancete";
import Anual from "./indexAnual";

const { TabPane } = Tabs;

export default function RelatorioCadastro() {
  return (
    <>
      <Header>
        <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
          <Icon type="fund" style={{ fontSize: 20 }} /> RELATÓRIO FINANCEIRO
        </p>
        <Link to="/">
          <Button type="danger" shape="circle" icon="close" size="small" />
        </Link>
      </Header>

      <div style={{ marginTop: 10 }}>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <Icon type="bar-chart" />
                Fluxo de Caixa
              </span>
            }
            key="1"
          >
            <RelatorioFinan />
          </TabPane>

          <TabPane
            tab={
              <span>
                <Icon type="line-chart" />
                Balancete Mensal
              </span>
            }
            key="2"
          >
            <Gerar />
          </TabPane>

          <TabPane
            tab={
              <span>
                <Icon type="calculator" />
                Balancete Anual
              </span>
            }
            key="3"
          >
            <Anual />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}
