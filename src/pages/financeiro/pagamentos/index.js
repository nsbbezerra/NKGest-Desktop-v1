import React from "react";
import { Icon, Button, Tabs } from "antd";
import { Header } from "../../../styles/styles";
import { Link } from "react-router-dom";

import IndexBoleto from "./boleto/index";
import IndexCheque from "./cheque/index";
import IndexDeposito from "./depositos/index";
import Debits from "./debitos/index";
import Verify from "./salesOrders/index";

const { TabPane } = Tabs;

export default function RelatorioCadastro() {
  return (
    <>
      <Header>
        <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
          <Icon type="dollar" style={{ fontSize: 20 }} /> GERENCIAR PAGAMENTOS
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
                <Icon type="barcode" />
                <span>Boletos</span>
              </span>
            }
            key="1"
          >
            <IndexBoleto />
          </TabPane>

          <TabPane
            tab={
              <span>
                <Icon type="idcard" />
                <span>Cheques</span>
              </span>
            }
            key="2"
          >
            <IndexCheque />
          </TabPane>

          <TabPane
            tab={
              <span>
                <Icon type="transaction" />
                <span>Depósitos / Transferências</span>
              </span>
            }
            key="3"
          >
            <IndexDeposito />
          </TabPane>

          <TabPane
            tab={
              <span>
                <Icon type="search" />
                <span>Verificar por Vendas / Ordens de Serviços</span>
              </span>
            }
            key="4"
          >
            <Verify />
          </TabPane>

          <TabPane
            tab={
              <span>
                <Icon type="fall" />
                <span>Pagamentos Vencidos</span>
              </span>
            }
            key="5"
          >
            <Debits />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
}
