import React, { useState, useEffect } from "react";
import {
  Icon,
  Button,
  Table,
  Modal,
  Select,
  Card,
  Divider,
  Row,
  Statistic,
  Spin,
  Descriptions,
  Switch,
} from "antd";
import api from "../../../config/axios";
import Lottie from "react-lottie";
import animationData from "../../../animations/printer.json";

const { Option } = Select;

export default function RelatorioPlanodeContas() {
  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [mes, setMes] = useState("Mês");
  const [ano, setAno] = useState("Ano");
  const [lastGerado, setLastGerado] = useState([]);
  const [showTables, setShowTables] = useState(false);
  const [relatorioMensal, setRelatorioMensal] = useState({});
  const [modalAdvancedFind, setModalAdvancedFind] = useState(false);
  const [loadingPrinter, setLoadingPrinter] = useState(false);
  const [idToPrint, setIdToPrint] = useState("");
  const [useSaldo, setUseSaldo] = useState(false);

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

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    console.log(useSaldo);
  }, [useSaldo]);

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

  async function findMesGerado() {
    setSpinner(true);
    await api
      .get("/balancete/lastGer")
      .then((response) => {
        setLastGerado(response.data.balanco);
        setSpinner(false);
      })
      .catch((error) => {
        erro("Erro", error.message);
        setSpinner(false);
      });
  }

  async function gerarBalacete() {
    setLoading(true);
    await api
      .post("/report/createBalancete", {
        mes: mes,
        ano: ano,
        useSaldo: useSaldo,
      })
      .then((response) => {
        setRelatorioMensal(response.data.relatorioMensal);
        setIdToPrint(response.data.relatorioMensal._id);
        setLoading(false);
        setShowTables(true);
        setModalAdvancedFind(false);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoading(false);
      });
  }

  useEffect(() => {
    findMesGerado();
  }, []);

  function handleBalancete() {
    if (mes === "Mês") {
      warning("Atenção", "Selecione um Mês");
      return false;
    }
    if (ano === "Ano") {
      warning("Atenção", "Selecione um Ano");
      return false;
    }
    setModalAdvancedFind(true);
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

  const DataAtual = new Date();
  const Ano = DataAtual.getFullYear();

  return (
    <div style={{ height: "100%" }}>
      <Spin spinning={spinner} size="large">
        <Row>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Card size="small">
              {!lastGerado.length && (
                <p style={{ marginBottom: -3, marginTop: -1 }}>
                  Ainda não existe balancetes gerados
                </p>
              )}
              {!!lastGerado.length && (
                <p style={{ marginBottom: -3, marginTop: -1 }}>
                  Último balancete gerado:{" "}
                  <strong>{`${lastGerado[0].month} de ${lastGerado[0].year}`}</strong>
                </p>
              )}
            </Card>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div style={{ marginRight: 10 }}>
                <label style={{ marginRight: 10 }}>Usar Saldo Anterior?</label>
                <Switch
                  defaultChecked={useSaldo}
                  onChange={(value) => setUseSaldo(value)}
                />
              </div>
              <Select
                value={mes}
                style={{ width: 150, marginRight: 10 }}
                onChange={(value) => setMes(value)}
              >
                <Option value="Janeiro">Janeiro</Option>
                <Option value="Fevereiro">Fevereiro</Option>
                <Option value="Março">Março</Option>
                <Option value="Abril">Abril</Option>
                <Option value="Maio">Maio</Option>
                <Option value="Junho">Junho</Option>
                <Option value="Julho">Julho</Option>
                <Option value="Agosto">Agosto</Option>
                <Option value="Setembro">Setembro</Option>
                <Option value="Outubro">Outubro</Option>
                <Option value="Novembro">Novembro</Option>
                <Option value="Dezembro">Dezembro</Option>
              </Select>

              <Select
                value={ano}
                style={{ width: 100, marginRight: 10 }}
                onChange={(value) => setAno(value)}
              >
                <Option value={Ano - 1}>{Ano - 1}</Option>
                <Option value={Ano}>{Ano}</Option>
              </Select>

              <Button
                key="submit"
                type="primary"
                onClick={() => handleBalancete()}
              >
                Gerar Balancete
              </Button>
            </div>
          </div>
        </Row>

        <Divider />

        {showTables === true && (
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
              <>
                <Divider />
                <Descriptions bordered size="small">
                  <Descriptions.Item span={1} label="SALDO ANTERIOR">
                    <Statistic
                      precision={2}
                      prefix="R$"
                      valueStyle={{ fontSize: 15.5 }}
                      value={relatorioMensal.saldoAnterior}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item span={1} label="TOTAL DAS ENTRADAS">
                    <Statistic
                      precision={2}
                      prefix="R$"
                      valueStyle={{ fontSize: 15.5 }}
                      value={relatorioMensal.entradas}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item span={1} label="TOTAL DAS SAÍDAS">
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
              </>
            )}
          </div>
        )}

        <Modal
          title="Gerar Balancete"
          visible={modalAdvancedFind}
          onCancel={() => setModalAdvancedFind(false)}
          footer={[
            <Button
              key="back"
              icon="close"
              type="danger"
              onClick={() => setModalAdvancedFind(false)}
            >
              Não
            </Button>,
            <Button
              key="submit"
              icon="check"
              type="primary"
              loading={loading}
              onClick={() => gerarBalacete()}
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
            Esta operação pode demorar um pouco, é recomendável que este
            balancete seja gerado no computador onde está instalado o SERVIDOR,
            tenha certeza que está gerando o balancete para o período certo,
            caso contrário, pode ocorrer uma desordem nos relatórios financeiros
            da sua empresa, quer continuar?
          </p>

          <p
            style={{
              width: "100%",
              textAlign: "center",
              marginTop: 10,
              color: "#444",
            }}
          >
            Período a ser gerado: <strong>{`${mes} de ${ano}`}</strong>
          </p>
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
      </Spin>
    </div>
  );
}
