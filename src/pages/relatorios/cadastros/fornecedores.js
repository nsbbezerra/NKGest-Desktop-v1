import React, { useState, useEffect } from "react";
import { Icon, Table, Button, Modal, Descriptions, Spin, Divider } from "antd";
import api from "../../../config/axios";
import Lottie from "react-lottie";
import animationData from "../../../animations/printer.json";

export default function RelatorioFornecedores() {
  const [spinner, setSpinner] = useState(false);
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecerCount, setFornecerCount] = useState(null);
  const [buttonPrint, setButtonPrint] = useState(true);
  const [loadingPrinter, setLoadingPrinter] = useState(false);

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

  async function finder() {
    setSpinner(true);
    await api
      .get("/report/listFornecers")
      .then((response) => {
        setFornecerCount(response.data.fornecersCount);
        setFornecedores(response.data.fornecers);
        setSpinner(false);
        setButtonPrint(false);
      })
      .catch((error) => {
        erro("Erro", error.message);
        setSpinner(false);
      });
  }

  useEffect(() => {
    finder();
  }, []);

  function printer(url) {
    window.open(
      url,
      "pdfSale",
      `height=${window.screen.height}, width=${window.screen.width}`
    );
  }

  async function findPrinter() {
    setLoadingPrinter(true);
    await api
      .post("/printerRelatorio/fornecers")
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

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

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
  ];

  return (
    <Spin spinning={spinner} size="large">
      <div
        style={{
          marginBottom: 10,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Button
          icon="printer"
          type="default"
          style={{ marginRight: 10 }}
          disabled={buttonPrint}
          onClick={() => findPrinter()}
        >
          Imprimir Relatório
        </Button>
      </div>

      <Table
        pagination={{ pageSize: 10 }}
        columns={columns}
        dataSource={fornecedores}
        size="small"
        style={{ marginTop: 10 }}
        rowKey={(cli) => cli._id}
      />
      <Divider />
      <Descriptions layout="vertical" bordered size="small">
        <Descriptions.Item label="Total de Fornecedores" span={3}>
          {fornecerCount}
        </Descriptions.Item>
      </Descriptions>

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
    </Spin>
  );
}
