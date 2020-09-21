import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Drawer,
  Card,
  Row,
  Statistic,
  Spin,
  Descriptions,
  Tooltip,
  Modal,
  Icon,
} from "antd";
import api from "../../../config/axios";
import Lottie from "react-lottie";
import animationData from "../../../animations/printer.json";

export default function RelatorioPlanodeContas() {
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [gerado, setGerado] = useState([]);
  const [relatorioMensal, setRelatorioMensal] = useState({});
  const [drawerInfo, setDrawerInfo] = useState(false);
  const [modalSearch, setModalSearch] = useState(false);
  const [balanceteId, setBalanceteId] = useState("");
  const [loadingPrinter, setLoadingPrinter] = useState(false);
  const [idToPrint, setIdToPrint] = useState("");

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

  function success(title, message) {
    Modal.success({
      title: title,
      content: (
        <div>
          <p>{message}</p>
        </div>
      ),
      onOk() {},
    });
  }

  async function findMesGerado() {
    setSpinner(true);
    await api
      .get("/balancete/list")
      .then((response) => {
        setGerado(response.data.balanco);
        setSpinner(false);
      })
      .catch((error) => {
        erro("Erro", error.message);
        setSpinner(false);
      });
  }

  useEffect(() => {
    findMesGerado();
  }, []);

  async function delBalancete() {
    setLoading(true);
    await api
      .delete(`/balancete/del/${balanceteId}`)
      .then((response) => {
        success("Sucesso", response.data.message);
        setLoading(false);
        setModalSearch(false);
        findMesGerado();
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoading(false);
      });
  }

  async function handleBalancete(id) {
    const result = await gerado.find((obj) => obj._id === id);
    await setRelatorioMensal(result);
    await setIdToPrint(result._id);
    setDrawerInfo(true);
  }

  function handleDelBalancete(id) {
    setBalanceteId(id);
    setModalSearch(true);
  }

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

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
      .post("/printerRelatorio/balancete", { id: idToPrint })
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
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      width: "80%",
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
      align: "right",
      render: (valor) => (
        <Statistic
          precision={2}
          prefix="R$"
          valueStyle={{ fontSize: 15.5 }}
          value={valor}
        />
      ),
    },
  ];

  const columnsBalancetes = [
    {
      title: "Descrição",
      dataIndex: "title",
      key: "title",
      width: "25%",
    },
    {
      title: "Salto Anterior",
      dataIndex: "saldoAnterior",
      key: "saldoAnterior",
      align: "right",
      render: (valor) => (
        <Statistic
          precision={2}
          prefix="R$"
          valueStyle={{ fontSize: 15.5 }}
          value={valor}
        />
      ),
      width: "13%",
    },
    {
      title: "Entradas",
      dataIndex: "entradas",
      key: "entradas",
      align: "right",
      render: (valor) => (
        <Statistic
          precision={2}
          prefix="R$"
          valueStyle={{ fontSize: 15.5 }}
          value={valor}
        />
      ),
      width: "13%",
    },
    {
      title: "Saídas",
      dataIndex: "saidas",
      key: "saidas",
      align: "right",
      render: (valor) => (
        <Statistic
          precision={2}
          prefix="R$"
          valueStyle={{ fontSize: 15.5 }}
          value={valor}
        />
      ),
      width: "13%",
    },
    {
      title: "Saldo Atual",
      dataIndex: "saldoAtual",
      key: "saldoAtual",
      align: "right",
      render: (valor) => (
        <Statistic
          precision={2}
          prefix="R$"
          valueStyle={{ fontSize: 15.5 }}
          value={valor}
        />
      ),
      width: "13%",
    },
    {
      title: "Data de Fechamento",
      dataIndex: "dataFechamento",
      key: "dataFechamento",
      align: "center",
    },
    {
      title: "Ações",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      render: (id) => (
        <>
          <Tooltip placement="top" title="Visualizar Balancete">
            <Button
              shape="circle"
              icon="search"
              type="default"
              size="small"
              style={{ marginRight: 5 }}
              onClick={() => handleBalancete(id)}
            />
          </Tooltip>
          <Tooltip placement="top" title="Excluir">
            <Button
              shape="circle"
              icon="close"
              type="danger"
              size="small"
              onClick={() => handleDelBalancete(id)}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <div style={{ height: "100%" }}>
      <Spin spinning={spinner} size="large">
        <Table
          columns={columnsBalancetes}
          dataSource={gerado}
          size="small"
          rowKey={(ent) => ent._id}
        />

        <Drawer
          title="Balancete Mensal"
          width={"80%"}
          closable={true}
          onClose={() => setDrawerInfo(false)}
          visible={drawerInfo}
          placement="left"
        >
          <div style={{ overflow: "hidden" }}>
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
                {relatorioMensal && (
                  <p style={{ marginBottom: -3, marginTop: -1 }}>
                    Data do Fechamento:{" "}
                    <strong>{relatorioMensal.dataFechamento}</strong>
                  </p>
                )}
              </Card>

              <Row>
                <Button
                  icon="printer"
                  type="primary"
                  style={{ marginRight: 10 }}
                  onClick={() => generatePrint()}
                >
                  Imprimir Relatório
                </Button>
              </Row>
            </div>

            <Card
              size="small"
              style={{ backgroundColor: "#001529", marginBottom: 10 }}
              bordered={false}
            >
              <Row>
                <Icon
                  type="rise"
                  style={{ fontSize: 20, color: "#fff", marginRight: 15 }}
                />
                <span
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  RECEITAS
                </span>
              </Row>
            </Card>

            <Table
              columns={columns}
              dataSource={relatorioMensal.receives}
              size="small"
              rowKey={(ent) => ent.id}
            />

            <Card
              size="small"
              style={{ backgroundColor: "#001529", marginBottom: 10 }}
              bordered={false}
            >
              <Row>
                <Icon
                  type="fall"
                  style={{ fontSize: 20, color: "#fff", marginRight: 15 }}
                />
                <span
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  DESPESAS
                </span>
              </Row>
            </Card>

            <Table
              columns={columns}
              dataSource={relatorioMensal.withdraw}
              size="small"
              rowKey={(ent) => ent.id}
            />

            <Card
              size="small"
              style={{ backgroundColor: "#001529", marginBottom: 10 }}
              bordered={false}
            >
              <Row>
                <Icon
                  type="line-chart"
                  style={{ fontSize: 20, color: "#fff", marginRight: 15 }}
                />
                <span
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  RESUMO
                </span>
              </Row>
            </Card>

            {relatorioMensal && (
              <Descriptions bordered size="small">
                <Descriptions.Item span={3} label="SALDO ANTERIOR">
                  <Statistic
                    precision={2}
                    prefix="R$"
                    valueStyle={{ fontSize: 15.5 }}
                    value={relatorioMensal.saldoAnterior}
                  />
                </Descriptions.Item>
                <Descriptions.Item span={3} label="TOTAL DAS ENTRADAS">
                  <Statistic
                    precision={2}
                    prefix="R$"
                    valueStyle={{ fontSize: 15.5 }}
                    value={relatorioMensal.entradas}
                  />
                </Descriptions.Item>
                <Descriptions.Item span={3} label="TOTAL DAS SAÍDAS">
                  <Statistic
                    precision={2}
                    prefix="R$"
                    valueStyle={{ fontSize: 15.5 }}
                    value={relatorioMensal.saidas}
                  />
                </Descriptions.Item>
                <Descriptions.Item span={3} label="SALDO ATUAL">
                  <Statistic
                    precision={2}
                    prefix="R$"
                    valueStyle={{ fontSize: 15.5 }}
                    value={relatorioMensal.saldoAtual}
                  />
                </Descriptions.Item>
              </Descriptions>
            )}
          </div>
        </Drawer>

        <Modal
          visible={modalSearch}
          onCancel={() => setModalSearch(false)}
          title="Excluir Balancete"
          footer={[
            <Button
              key="back"
              icon="close"
              type="danger"
              onClick={() => setModalSearch(false)}
            >
              Não
            </Button>,
            <Button
              key="submit"
              icon="check"
              type="primary"
              loading={loading}
              onClick={() => delBalancete()}
            >
              Sim
            </Button>,
          ]}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon type="exclamation-circle" style={{ fontSize: 100 }} />
          </div>

          <p
            style={{
              width: "100%",
              textAlign: "center",
              fontSize: 40,
              color: "#444",
              fontWeight: "bold",
            }}
          >
            ATENÇÃO
          </p>

          <p
            style={{
              width: "100%",
              textAlign: "center",
              marginTop: 10,
              color: "#f44336",
              fontWeight: "bold",
            }}
          >
            Você está prestes a excluir um balancete financeiro, esta ação irá
            excluir todo o relatório referente a este período, isto pode causar
            uma desordem nos relatórios financeiros, mas, você pode gerar este
            balancete novamente na seção: GERAR BALANCETE MENSAL, no canto
            esquerdo da sua tela, deseja continuar?
          </p>
        </Modal>
      </Spin>

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
    </div>
  );
}
