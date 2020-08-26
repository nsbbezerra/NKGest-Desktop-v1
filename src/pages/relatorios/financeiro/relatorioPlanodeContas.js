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
} from "antd";
import api from "../../../config/axios";

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

  async function findDados() {
    await api
      .get("/organization/find")
      .then((response) => {
        setDados(response.data.empresa);
      })
      .catch((error) => {
        erro("Erro", error.message);
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
      })
      .then((response) => {
        setRelatorioMensal(response.data.relatorioMensal);
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
    findDados();
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

  function printer() {
    var mywindow = window.open(
      "",
      "Print",
      `height=${window.screen.height}, width=${window.screen.width}`,
      "fullscreen=yes"
    );
    mywindow.document.write(`
        <!DOCTYPE html>
        <html>
        
        <head>
          <title>Imprimir Relatório Financeiro</title>
          <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style type="text/css">
            * {
              margin: 0;
              padding: 0;
              outline: none;
              box-sizing: border-box;
              font-family: Arial, Helvetica, sans-serif;
            }
        
            html {
              background-color: #777;
              width: 100%;
            }
        
            body {
              width: 100%;
              height: 100%;
              padding: 10px;
            }
        
            html::-webkit-scrollbar {
              display: none;
            }
        
            .page {
              background-color: #fff;
              width: 80vw;
              height: 100% !important;
              box-shadow: 1px 1px 6px rgba(0, 0, 0, .6);
              padding: 15px;
              overflow: auto;
              position: relative;
              margin: auto;
              min-height: 297mm;
            }
        
            .content {
              display: block;
              position: relative;
            }
        
            .header-page {
              width: 100% !important;
              height: 110px;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              max-height: 110px;
              min-height: 110px;
            }
        
            .logo {
              width: 110px;
              height: 110px;
              padding: 5px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
        
            .company-info {
              width: 100%;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              border: 1px solid #000;
              height: 109.5px;
              border-radius: 5px;
            }
        
            .company-info-container {
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 10px;
            }
        
            .company-info-container h5 {
              font-size: 30px;
            }
        
            .company-info-container p {
              width: 100%;
              font-size: 15px;
              text-align: center;
            }
        
            .info-container {
              width: 100%;
              height: 48%;
              border: 1px solid #000;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center !important;
              border-radius: 5px;
            }
        
            .info-container h6 {
              margin-bottom: 5px;
              font-weight: bold;
            }
        
            .info-container p {
              font-size: 15px;
              font-style: italic;
            }
        
            .content h2 {
              width: 100%;
              text-align: center;
              margin-top: 10px;
            }
        
            .table-product {
              width: 100%;
              border: 1px solid #000;
              border-radius: 5px;
              overflow: hidden;
            }
        
            .table-product thead tr td {
              padding: 5px;
              font-weight: bold;
              font-size: 13px;
              border-bottom: 1px solid #000;
              border-right: 1px solid #000;
            }
        
            .table-product thead tr td:last-child {
              border-right: none;
            }
        
            .table-product tbody tr td {
              padding: 5px;
              font-size: 12px;
              border-right: 1px solid #000;
            }
        
            .table-product tbody tr td:last-child {
              border-right: none;
            }
        
            .desc,
            .desc2 {
              width: 85%;
            }
        
            .price,
            .price2 {
              width: 15%;
              text-align: right;
            }
        
            .table-resume {
              width: 100%;
              border: 1px solid #000;
              border-radius: 5px;
              overflow: hidden;
              margin-top: 30px;
            }
        
            .values {
              width: 80%;
              padding: 5px;
              border-right: 1px solid #000;
              font-weight: bold;
              border-bottom: 1px solid #000;
            }
        
            .money {
              padding: 5px;
              text-align: right;
              border-bottom: 1px solid #000;
            }
        
            .valueslast {
              width: 80%;
              padding: 5px;
              border-right: 1px solid #000;
              font-weight: bold;
            }
        
            .moneylast {
              padding: 5px;
              text-align: right;
            }
        
            .page-break {
              display: none;
            }
        
            .cabecalho {
              width: 100%;
              text-align: center;
              padding: 5px;
              font-weight: bold;
              font-style: italic;
              margin-top: 15px;
              margin-bottom: 10px;
              background: lightgray;
              border-radius: 5px;
            }
        
            .btn-print {
              border: none;
              padding: 10px;
              border-radius: 4px;
              font-weight: 700;
              position: fixed;
              top: 7px;
              left: 7px;
              cursor: pointer;
              z-index: 1000;
              box-shadow: 1px 1px 4px rgba(0, 0, 0, .6);
              background-color: white;
          }
        
            @media print {
        
              .btn-print {
                display: none;
              }

              .page {
                visibility: hidden;
                margin: 0;
                padding: 0;
                width: 100%;
              }
        
              .content {
                display: block;
                visibility: visible;
                position: relative;
                width: 100%;
              }
        
              .company-info-container h5 {
                font-size: 25px;
              }
        
              .company-info-container p {
                font-size: 12px;
              }
        
              .header-page,
              .logo,
              .order-info {
                max-height: 100px;
              }
        
              .info-container p {
                font-size: 11px;
              }
        
              .table-product tbody tr td {
                font-size: 11px;
              }
        
              .table-product thead tr td {
                font-size: 12px;
              }
              
              .page-break {
                display: block;
                page-break-after: always;
                break-inside: avoid;
                color: transparent;
              }
        
              @page {
                margin: .6cm;
              }
        
            }
          </style>
        </head>
        
        <body>
        
          <div class="page">

          <button class="btn-print" onclick="window.print()">IMPRIMIR</button>
        
            <div class="content">
        
              <div class="header-page">
        
                <section class="company-info">
        
                  <div class="logo">
                    <img src="${
                      dados.logo_url
                    }" style="width: 100px; max-height: 100px;"/>
                  </div>
        
                  <div class="company-info-container">
        
                    <h5>${dados.name}</h5>
                    <p>${dados.street}, ${dados.number}, ${dados.bairro}, ${
      dados.city
    } - ${dados.state}, CEP: ${dados.cep}.</p>
                    <p>CNPJ: ${dados.cnpj}, Fone ${dados.phoneComercial}</p>
                    <p>Email: ${dados.email}</p>
                  </div>
        
                </section>
        
              </div>
        
              <h2>RELATÓRIO FINANCEIRO DO MES DE: ${mes} DE ${ano}</h2>
        
              <div class="cabecalho">
                <p>ENTRADAS</p>
              </div>
        
              <table class="table-product" cellspacing='0'>
                <thead>
                  <tr>
                    <td class="desc">DESCRIÇÃO</td>
                    <td class="price">VALOR</td>
                  </tr>
                </thead>
                <tbody>
                    ${relatorioMensal.receives
                      .map((rec) => {
                        return `<tr>
                        <td class="desc2">${rec.description}</td>
                        <td class="price2">R$ ${rec.value}</td>
                      </tr>`;
                      })
                      .join("")}
                </tbody>
              </table>
        
              <div class="cabecalho">
                <p>SAÍDAS</p>
              </div>
        
              <table class="table-product" cellspacing='0'>
                <thead>
                  <tr>
                    <td class="desc">DESCRIÇÃO</td>
                    <td class="price">VALOR</td>
                  </tr>
                </thead>
                <tbody>
                 ${relatorioMensal.withdraw
                   .map((wit) => {
                     return `<tr>
                    <td class="desc2">${wit.description}</td>
                    <td class="price2">R$ ${wit.value}</td>
                  </tr>`;
                   })
                   .join("")}
                </tbody>
              </table>
        
              <table class="table-resume">
        
                <thead>
                  <tr>
                    <td class="values">SALDO ANTERIOR</td>
                    <td class="money">R$ ${relatorioMensal.saldoAnterior}</td>
                  </tr>
                  <tr>
                    <td class="values">TOTAL DAS ENTRADAS</td>
                    <td class="money">R$ ${relatorioMensal.entradas}</td>
                  </tr>
                  <tr>
                    <td class="values">TOTAL DAS SAÍDAS</td>
                    <td class="money">R$ ${relatorioMensal.saidas}</td>
                  </tr>
                  <tr>
                    <td class="valueslast">SALDO ATUAL</td>
                    <td class="moneylast">R$ ${relatorioMensal.saldoAtual}</td>
                  </tr>
                </thead>
        
              </table>
        
            </div>
        
          </div>
        
        </body>
        
        <p class="page-break">PageBreak</p>
        
        </html>
        `);
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
                  onClick={() => printer()}
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
      </Spin>
    </div>
  );
}
