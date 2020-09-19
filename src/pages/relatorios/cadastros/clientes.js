import React, { useState, useEffect } from "react";
import {
  Icon,
  Table,
  Button,
  Card,
  Descriptions,
  Select,
  Modal,
  Divider,
} from "antd";
import api from "../../../config/axios";
import Lottie from "react-lottie";
import animationData from "../../../animations/printer.json";

const { Option } = Select;

export default function RelatorioClientes() {
  const [loading, setLoading] = useState(false);
  const [loadingPrinter, setLoadingPrinter] = useState(false);
  const [modalSearch, setModalSearch] = useState(false);
  const [clients, setClients] = useState([]);
  const [find, setFind] = useState(null);
  const [totalActive, setTotalActive] = useState(null);
  const [totalBlock, setTotalBlock] = useState(null);
  const [totalRestrict, setTotalRestrict] = useState(null);
  const [totalClients, setTotalClients] = useState(null);

  const [buttonPrint, setButtonPrint] = useState(true);

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
      .post("/report/listClients", {
        find: find,
      })
      .then((response) => {
        setClients(response.data.clients);
        setTotalActive(response.data.totalActive);
        setTotalBlock(response.data.totalBlock);
        setTotalRestrict(response.data.totalRestrict);
        setTotalClients(response.data.totalClients);
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
      .post("/printerRelatorio/clients", { find: find })
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
      title: "Tipo",
      dataIndex: "typeClient",
      key: "typeClient",
      render: (tipo) => (
        <>
          {tipo === "fisic" && (
            <Button type="link" size="small">
              Física
            </Button>
          )}
          {tipo === "juridic" && (
            <Button type="link" size="small">
              Jurídica
            </Button>
          )}
        </>
      ),
      width: "8%",
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "CPF / CNPJ",
      dataIndex: "cpf_cnpj",
      key: "cpf_cnpj",
    },
    {
      title: "Razão Social",
      dataIndex: "socialName",
      key: "socialName",
    },
    {
      title: "Contato",
      dataIndex: "phoneComercial",
      key: "phoneComercial",
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
      width: "8%",
    },
    {
      title: "Restrito?",
      dataIndex: "restrict",
      key: "restrict",
      render: (rest) => (
        <>
          {rest === true && (
            <Icon
              type="check"
              style={{ color: "#4caf50", fontWeight: "bold", fontSize: 17 }}
            />
          )}
          {rest === false && (
            <Icon
              type="stop"
              style={{ color: "#f44336", fontWeight: "bold", fontSize: 17 }}
            />
          )}
        </>
      ),
      align: "center",
      width: "8%",
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
              Tipo dos dados: <strong>Clientes Ativos</strong>
            </p>
          )}
          {find === 2 && (
            <p style={{ marginBottom: -3, marginTop: -1 }}>
              Tipo dos dados: <strong>Clientes Bloqueados</strong>
            </p>
          )}
          {find === 3 && (
            <p style={{ marginBottom: -3, marginTop: -1 }}>
              Tipo dos dados: <strong>Clientes Restritos</strong>
            </p>
          )}
          {find === 4 && (
            <p style={{ marginBottom: -3, marginTop: -1 }}>
              Tipo dos dados: <strong>Todos os Clientes</strong>
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
        dataSource={clients}
        size="small"
        style={{ marginTop: 10 }}
        rowKey={(cli) => cli._id}
      />
      <Divider />
      <Descriptions layout="vertical" bordered size="small">
        <Descriptions.Item label="Clientes Ativos" span={1}>
          {totalActive}
        </Descriptions.Item>
        <Descriptions.Item label="Clientes Bloqueados" span={1}>
          {totalBlock}
        </Descriptions.Item>
        <Descriptions.Item label="Clientes Restritos" span={1}>
          {totalRestrict}
        </Descriptions.Item>
        <Descriptions.Item label="Total de Clientes" span={3}>
          {totalClients}
        </Descriptions.Item>
      </Descriptions>

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
          <Option value={1}>Clientes Ativos</Option>
          <Option value={2}>Clientes Bloqueados</Option>
          <Option value={3}>Clientes Restritos</Option>
          <Option value={4}>Buscar Todos</Option>
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
