import React, { useState, useEffect } from "react";
import {
  Icon,
  Table,
  Button,
  Card,
  Descriptions,
  Select,
  Modal,
  Statistic,
} from "antd";
import api from "../../../config/axios";
import Lottie from "react-lottie";
import animationData from "../../../animations/printer.json";

const { Option } = Select;

export default function RelatorioServicos() {
  const [loading, setLoading] = useState(false);
  const [loadingPrinter, setLoadingPrinter] = useState(false);
  const [modalSearch, setModalSearch] = useState(false);
  const [servicos, setServicos] = useState([]);
  const [find, setFind] = useState(null);
  const [totalActive, setTotalActive] = useState(null);
  const [totalBlock, setTotalBlock] = useState(null);
  const [totalServicos, setTotalServicos] = useState(null);
  const [buttonPrint, setButtonPrint] = useState(true);
  const [dados, setDados] = useState({});

  function erro(title, message) {
    Modal.error({
      title: title,
      content: (
        <div>
          <p>{message}</p>
        </div>
      ),
      onOk() {},
    });
  }

  function warning(title, message) {
    Modal.warning({
      title: title,
      content: (
        <div>
          <p>{message}</p>
        </div>
      ),
      onOk() {},
    });
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  async function finder() {
    if (find === null) {
      warning("Atenção", "Selecione uma opção de busca");
      return false;
    }
    setLoading(true);
    await api
      .post("/report/listServices", {
        find: find,
      })
      .then((response) => {
        setServicos(response.data.services);
        setTotalActive(response.data.totalActive);
        setTotalBlock(response.data.totalBlock);
        setTotalServicos(response.data.totalServices);
        setLoading(false);
        setModalSearch(false);
        setButtonPrint(false);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoading(false);
      });
  }

  function printer(url) {
    window.open(
      url,
      "pdfSale",
      `height=${window.screen.height}, width=${window.screen.width}`
    );
  }

  async function generatePrint() {
    setLoadingPrinter(true);
    await api
      .post("/printerRelatorio/services", { find: find })
      .then((response) => {
        setLoadingPrinter(false);
        let link = response.data.link;
        printer(link);
      })
      .catch((error) => {
        setLoadingPrinter(false);
        if (error.response.data.message) {
          erro("Erro", error.response.data.message);
        } else {
          erro("Erro", "Ocorreu um erro ao gerar o relatório");
        }
      });
  }

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      width: "30%",
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      width: "30%",
    },
    {
      title: "Valor de Venda",
      dataIndex: "value",
      key: "value",
      render: (valor) => (
        <Statistic
          prefix="R$"
          precision={2}
          valueStyle={{ fontSize: 15.5 }}
          value={valor}
        />
      ),
      align: "right",
    },
    {
      title: "Ativo?",
      dataIndex: "active",
      key: "active",
      render: (act) => (
        <>
          {act === true && (
            <Icon
              type="check"
              style={{ color: "#4caf50", fontWeight: "bold", fontSize: 17 }}
            />
          )}
          {act === false && (
            <Icon
              type="stop"
              style={{ color: "#f44336", fontWeight: "bold", fontSize: 17 }}
            />
          )}
        </>
      ),
      align: "center",
      width: "7%",
    },
  ];

  return (
    <>
      <div
        style={{
          marginBottom: 10,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Card size="small">
          {find === null && (
            <p style={{ marginBottom: -3, marginTop: -1 }}>
              Tipo dos dados: <strong>-</strong>
            </p>
          )}
          {find === 1 && (
            <p style={{ marginBottom: -3, marginTop: -1 }}>
              Tipo dos dados: <strong>Serviços Ativos</strong>
            </p>
          )}
          {find === 2 && (
            <p style={{ marginBottom: -3, marginTop: -1 }}>
              Tipo dos dados: <strong>Serviços Bloqueados</strong>
            </p>
          )}
          {find === 3 && (
            <p style={{ marginBottom: -3, marginTop: -1 }}>
              Tipo dos dados: <strong>Todos os Serviços</strong>
            </p>
          )}
        </Card>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button
            icon="printer"
            type="default"
            style={{ marginRight: 10 }}
            disabled={buttonPrint}
            onClick={() => generatePrint()}
          >
            Imprimir Relatório
          </Button>

          <Button
            icon="search"
            type="primary"
            onClick={() => setModalSearch(true)}
          >
            Busca Avançada
          </Button>
        </div>
      </div>

      <Table
        pagination={{ pageSize: 10 }}
        columns={columns}
        dataSource={servicos}
        size="small"
        style={{ marginTop: 15, marginBottom: 15 }}
        rowKey={(cli) => cli._id}
      />

      {totalServicos && (
        <Descriptions layout="vertical" bordered size="small">
          <Descriptions.Item label="Serviços Ativos" span={3}>
            {totalActive}
          </Descriptions.Item>
          <Descriptions.Item label="Serviços Bloqueados" span={3}>
            {totalBlock}
          </Descriptions.Item>
          <Descriptions.Item label="Total de Serviços" span={3}>
            {totalServicos}
          </Descriptions.Item>
        </Descriptions>
      )}

      <Modal
        visible={modalSearch}
        onCancel={() => setModalSearch(false)}
        title="Buscar Relatório"
        footer={[
          <Button
            key="back"
            icon="close"
            type="danger"
            onClick={() => setModalSearch(false)}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            icon="search"
            type="primary"
            loading={loading}
            onClick={() => finder()}
          >
            Buscar
          </Button>,
        ]}
      >
        <label>Selecione um tipo de busca:</label>
        <Select
          value={find}
          style={{ width: "100%" }}
          onChange={(value) => setFind(value)}
        >
          <Option value={1}>Serviços Ativos</Option>
          <Option value={2}>Serviços Bloqueados</Option>
          <Option value={3}>Todos os Serviços</Option>
        </Select>
      </Modal>

      <Modal
        visible={loadingPrinter}
        closable={false}
        title={false}
        footer={false}
        centered
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Lottie options={defaultOptions} width={"50%"} />

          <p
            style={{
              marginTop: 30,
              fontSize: 25,
              fontWeight: "bold",
              marginBottom: -10,
            }}
          >
            Gerando Relatório
          </p>
        </div>
      </Modal>
    </>
  );
}
