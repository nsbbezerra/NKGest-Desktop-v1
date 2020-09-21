import React from "react";
import { Icon, Tabs, Button } from "antd";
import { Header } from "../../styles/styles";
import { Link } from "react-router-dom";

import Nfe from "./nfe";
import Nfce from "./nfce";
import Nfse from "./nfse";

const { TabPane } = Tabs;

export default function IndexFiscal() {
  return (
    <>
      <Header>
        <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
          <Icon type="file-done" style={{ fontSize: 20 }} /> EMITIR NOTA FISCAL
        </p>
        <Link to="/">
          <Button type="danger" shape="circle" icon="close" size="small" />
        </Link>
      </Header>

      <Tabs defaultActiveKey="1" tabPosition="top" style={{ marginTop: 10 }}>
        <TabPane tab={<span>NFE</span>} key="1">
          <Nfe />
        </TabPane>

        <TabPane tab={<span>NFCE</span>} key="2">
          <Nfce />
        </TabPane>

        <TabPane tab={<span>NFSE</span>} key="3" disabled>
          <Nfse />
        </TabPane>
      </Tabs>
    </>
  );
}
