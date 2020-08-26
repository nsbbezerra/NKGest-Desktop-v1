import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  Select,
  Card,
  Divider,
  Row,
  Statistic,
  Descriptions,
  Icon,
} from "antd";
import api from "../../../config/axios";
import moment from "moment";

const { Option } = Select;

export default function RelatorioFinanceiro() {
  const [loading, setLoading] = useState(false);
  const [showTables, setShowTables] = useState(false);

  const [modalAdvancedFind, setModalAdvancedFind] = useState(false);
  const [typeAdvandcedFind, setTypeAdvancedFind] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [despesas, setDespesas] = useState([]);

  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");

  const [valorProdutos, setValorProdutos] = useState(0);
  const [valorServicos, setValorServicos] = useState(0);
  const [valorReceitas, setValorReceitas] = useState(0);
  const [valorDespesas, setValorDespesas] = useState(0);

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

  useEffect(() => {
    findDados();
  }, []);

  async function sendAdvancedFind() {
    if (typeAdvandcedFind === "") {
      warning("Atenção", "Selecione uma opção de busca");
      return false;
    }
    setLoading(true);
    await api
      .post("/report/fluxCashier", {
        find: typeAdvandcedFind,
        mes: mes,
        ano: ano,
      })
      .then((response) => {
        setButtonPrint(false);
        setProdutos(response.data.products);
        setServicos(response.data.services);
        setReceitas(response.data.receitas);
        setDespesas(response.data.despesas);
        setValorProdutos(response.data.calcTotalProductSale);
        setValorServicos(response.data.calcTotalServices);
        setValorReceitas(response.data.calcTotalReceitas);
        setValorDespesas(response.data.calcTotalDespesas);
        setLoading(false);
        setModalAdvancedFind(false);
        setShowTables(true);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoading(false);
      });
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
          <title>Imprimir Relatório de Fluxo de Caixa</title>
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
              margin-bottom: 10px;
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
        
            .name,
            .name2,
            .vend,
            .vend2 {
              width: 25%;
            }
        
            .data,
            .data2 {
              width: 10%;
              text-align: center;
            }
        
            .totBrut,
            .totBrut2,
            .totLiqu,
            .totLiqu2 {
              width: 10%;
              text-align: right;
            }
        
            .desc,
            .desc2 {
              width: 5%;
              text-align: center;
            }
        
            .pay,
            .pay2 {
              width: 5%;
              text-align: center;
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
                font-size: 10px;
              }
        
              .table-product thead tr td {
                font-size: 11px;
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
        
                ${
                  typeAdvandcedFind === 1
                    ? `<h2>RELATÓRIO DE FLUXO DE CAIXA DO MES ATUAL</h2>`
                    : `<h2>RELATÓRIO DE FLUXO DE CAIXA DO MES DE: ${mes} DE ${ano}</h2>`
                }
        
              <div class="cabecalho">
                <p>VENDA DE PRODUTOS</p>
              </div>
        
              <table class="table-product" cellspacing='0'>
                <thead>
                  <tr>
                    <td class="name">CLIENTE</td>
                    <td class="vend">PAGAMENTO</td>
                    <td class="data">DATA</td>
                    <td class="totBrut">VALOR</td>
                    <td class="pay">PAGO?</td>
                  </tr>
                </thead>
                <tbody>
                    ${produtos
                      .map((prod) => {
                        return `<tr>
                        <td class="name2">${prod.cliente.name}</td>
                        <td class="vend2">${prod.title}</td>
                        <td class="data2">${prod.datePay}</td>
                        <td class="totBrut2">R$ ${prod.value}</td>
                        ${
                          prod.statusPay === "pay"
                            ? `<td class="pay2">Sim</td>`
                            : `<td class="pay2">Não</td>`
                        }
                      </tr>`;
                      })
                      .join("")}
                </tbody>
              </table>
        
              <div class="cabecalho">
                <p>ORDENS DE SERVIÇO</p>
              </div>
        
              <table class="table-product" cellspacing='0'>
                <thead>
                  <tr>
                    <td class="name">CLIENTE</td>
                    <td class="vend">PAGAMENTO</td>
                    <td class="data">DATA</td>
                    <td class="totBrut">VALOR</td>
                    <td class="pay">PAGO?</td>
                  </tr>
                </thead>
                <tbody>
                    ${servicos
                      .map((prod) => {
                        return `<tr>
                        <td class="name2">${prod.cliente.name}</td>
                        <td class="vend2">${prod.title}</td>
                        <td class="data2">${prod.datePay}</td>
                        <td class="totBrut2">R$ ${prod.value}</td>
                        ${
                          prod.statusPay === "pay"
                            ? `<td class="pay2">Sim</td>`
                            : `<td class="pay2">Não</td>`
                        }
                      </tr>`;
                      })
                      .join("")}
                </tbody>
              </table>
        
              <div class="cabecalho">
                <p>RECEITAS DIVERSAS</p>
              </div>
        
              <table class="table-product" cellspacing='0'>
                <thead>
                  <tr>
                    <td class="description">DESCRIÇÃO</td>
                    <td class="data">DATA</td>
                    <td class="totBrut">VALOR</td>
                    <td class="pay">PAGO?</td>
                  </tr>
                </thead>
                <tbody>
                    ${receitas
                      .map((rec) => {
                        return `<tr>
                        <td class="description2">${rec.description}</td>
                        <td class="data2">${rec.vencimento}</td>
                        <td class="totBrut2">R$ ${rec.value}</td>
                        ${
                          rec.statusPay === "pay"
                            ? `<td class="pay2">Sim</td>`
                            : `<td class="pay2">Não</td>`
                        }
                      </tr>`;
                      })
                      .join("")}
                </tbody>
              </table>
        
              <div class="cabecalho">
                <p>DESPESAS DIVERSAS</p>
              </div>
        
              <table class="table-product" cellspacing='0'>
                <thead>
                  <tr>
                    <td class="description">DESCRIÇÃO</td>
                    <td class="data">DATA</td>
                    <td class="totBrut">VALOR</td>
                    <td class="pay">PAGO?</td>
                  </tr>
                </thead>
                <tbody>
                    ${despesas
                      .map((rec) => {
                        return `<tr>
                        <td class="description2">${rec.description}</td>
                        <td class="data2">${rec.vencimento}</td>
                        <td class="totBrut2">R$ ${rec.value}</td>
                        ${
                          rec.statusPay === "pay"
                            ? `<td class="pay2">Sim</td>`
                            : `<td class="pay2">Não</td>`
                        }
                      </tr>`;
                      })
                      .join("")}
                </tbody>
              </table>
        
              <table class="table-resume">
        
                <thead>
                  <tr>
                    <td class="values">TOTAL VENDA DE PRODUTOS</td>
                    <td class="money">${valorProdutos}</td>
                  </tr>
                  <tr>
                    <td class="values">TOTAL ORDENS DE SERVIÇO</td>
                    <td class="money">${valorServicos}</td>
                  </tr>
                  <tr>
                    <td class="values">TOTAL DAS RECEITAS DIVERSAS</td>
                    <td class="money">${valorReceitas}</td>
                  </tr>
                  <tr>
                    <td class="valueslast">TOTAL DAS DESPESAS DIVERSAS</td>
                    <td class="moneylast">${valorDespesas}</td>
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

  const columnsProducts = [
    {
      title: "Cliente",
      dataIndex: "cliente.name",
      key: "cliente.name",
    },
    {
      title: "Forma Pagamento",
      dataIndex: "title",
      key: "title",
      width: "20%",
    },
    {
      title: "Pagamento",
      dataIndex: "datePay",
      key: "datePay",
      width: "10%",
      align: "center",
      render: (valor) => <span>{moment(valor).format("DD/MM/YYYY")}</span>,
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
      width: "10%",
      align: "center",
      render: (valor) => (
        <Statistic
          valueStyle={{ fontSize: 15.5 }}
          prefix="R$"
          precision={2}
          value={valor}
        />
      ),
    },
    {
      title: "Situação",
      dataIndex: "statusPay",
      key: "statusPay",
      render: (value) => (
        <>
          {value === "pay" && (
            <Button
              size="small"
              style={{
                width: "100%",
                backgroundColor: "#4caf50",
                color: "#fff",
                fontWeight: "bold",
              }}
              type="link"
            >
              Pago
            </Button>
          )}
          {value === "wait" && (
            <Button
              size="small"
              style={{
                width: "100%",
                backgroundColor: "#ffeb3b",
                color: "#444",
                fontWeight: "bold",
              }}
              type="link"
            >
              Em Aberto
            </Button>
          )}
        </>
      ),
      width: "11%",
    },
  ];

  const columnsServices = [
    {
      title: "Cliente",
      dataIndex: "cliente.name",
      key: "cliente.name",
    },
    {
      title: "Forma Pagamento",
      dataIndex: "title",
      key: "title",
      width: "20%",
    },
    {
      title: "Pagamento",
      dataIndex: "datePay",
      key: "datePay",
      width: "10%",
      align: "center",
      render: (valor) => <span>{moment(valor).format("DD/MM/YYYY")}</span>,
    },
    {
      title: "Produtos",
      dataIndex: "valueProducts",
      key: "valueProducts",
      width: "10%",
      align: "center",
      render: (valor) => (
        <Statistic
          valueStyle={{ fontSize: 15.5 }}
          prefix="R$"
          precision={2}
          value={valor}
        />
      ),
    },
    {
      title: "Serviços",
      dataIndex: "valueServices",
      key: "valueServices",
      width: "10%",
      align: "center",
      render: (valor) => (
        <Statistic
          valueStyle={{ fontSize: 15.5 }}
          prefix="R$"
          precision={2}
          value={valor}
        />
      ),
    },
    {
      title: "Valor Total",
      dataIndex: "value",
      key: "value",
      width: "10%",
      align: "center",
      render: (valor) => (
        <Statistic
          valueStyle={{ fontSize: 15.5 }}
          prefix="R$"
          precision={2}
          value={valor}
        />
      ),
    },
    {
      title: "Situação",
      dataIndex: "statusPay",
      key: "statusPay",
      render: (value) => (
        <>
          {value === "pay" && (
            <Button
              size="small"
              style={{
                width: "100%",
                backgroundColor: "#4caf50",
                color: "#fff",
                fontWeight: "bold",
              }}
              type="link"
            >
              Pago
            </Button>
          )}
          {value === "wait" && (
            <Button
              size="small"
              style={{
                width: "100%",
                backgroundColor: "#ffeb3b",
                color: "#444",
                fontWeight: "bold",
              }}
              type="link"
            >
              Em Aberto
            </Button>
          )}
        </>
      ),
      width: "11%",
    },
  ];

  const columnsReceitas = [
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      width: "25%",
    },
    {
      title: "Forma Pagamento",
      dataIndex: "payForm.name",
      key: "payForm.name",
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
      width: "10%",
      align: "center",
      render: (valor) => (
        <Statistic
          valueStyle={{ fontSize: 15.5 }}
          prefix="R$"
          precision={2}
          value={valor}
        />
      ),
    },
    {
      title: "Vencimento",
      dataIndex: "vencimento",
      key: "vencimento",
      width: "10%",
      align: "center",
      render: (valor) => <span>{moment(valor).format("DD/MM/YYYY")}</span>,
    },
    {
      title: "Situação",
      dataIndex: "statusPay",
      key: "statusPay",
      render: (value) => (
        <>
          {value === "pay" && (
            <Button
              size="small"
              style={{
                width: "100%",
                backgroundColor: "#4caf50",
                color: "#fff",
                fontWeight: "bold",
              }}
              type="link"
            >
              Pago
            </Button>
          )}
          {value === "wait" && (
            <Button
              size="small"
              style={{
                width: "100%",
                backgroundColor: "#ffeb3b",
                color: "#444",
                fontWeight: "bold",
              }}
              type="link"
            >
              Em Aberto
            </Button>
          )}
        </>
      ),
      width: "11%",
    },
  ];

  const DataAtual = new Date();
  const Ano = DataAtual.getFullYear();

  return (
    <div style={{ height: "100%" }}>
      <div style={{ marginTop: 15, overflow: "hidden" }}>
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
            {typeAdvandcedFind === "" && (
              <p style={{ marginBottom: -3, marginTop: -1 }}>
                Data dos Dados: <strong>-</strong>
              </p>
            )}

            {typeAdvandcedFind === 1 && (
              <p style={{ marginBottom: -3, marginTop: -1 }}>
                Data dos Dados: <strong>Mês Atual</strong>
              </p>
            )}

            {typeAdvandcedFind === 2 && (
              <p style={{ marginBottom: -3, marginTop: -1 }}>
                Período dos Dados: <strong>{`${mes} de ${ano}`}</strong>
              </p>
            )}
          </Card>

          <Row>
            <Button
              icon="printer"
              type="default"
              style={{ marginRight: 10 }}
              disabled={buttonPrint}
              onClick={() => printer()}
            >
              Imprimir Relatório
            </Button>

            <Button
              icon="search"
              type="primary"
              onClick={() => setModalAdvancedFind(true)}
            >
              Busca Avançada
            </Button>
          </Row>
        </div>

        {showTables === true && (
          <>
            <Card
              size="small"
              style={{ backgroundColor: "#001529", marginBottom: 10 }}
              bordered={false}
            >
              <Row>
                <Icon
                  type="tags"
                  style={{ fontSize: 20, color: "#fff", marginRight: 15 }}
                />
                <span
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  VENDA DE PRODUTOS
                </span>
              </Row>
            </Card>

            <Table
              columns={columnsProducts}
              dataSource={produtos}
              size="small"
              rowKey={(line) => line._id}
            />

            <Card
              size="small"
              style={{
                backgroundColor: "#001529",
                marginBottom: 10,
                marginTop: 10,
              }}
              bordered={false}
            >
              <Row>
                <Icon
                  type="tool"
                  style={{ fontSize: 20, color: "#fff", marginRight: 15 }}
                />
                <span
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  PRESTAÇÃO DE SERVIÇOS
                </span>
              </Row>
            </Card>

            <Table
              columns={columnsServices}
              dataSource={servicos}
              size="small"
              rowKey={(line) => line._id}
            />

            <Card
              size="small"
              style={{
                backgroundColor: "#001529",
                marginBottom: 10,
                marginTop: 10,
              }}
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
                  RECEITAS DIVERSAS
                </span>
              </Row>
            </Card>

            <Table
              columns={columnsReceitas}
              dataSource={receitas}
              size="small"
              rowKey={(line) => line._id}
            />

            <Card
              size="small"
              style={{
                backgroundColor: "#001529",
                marginBottom: 10,
                marginTop: 10,
              }}
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
                  DESPESAS DIVERSAS
                </span>
              </Row>
            </Card>

            <Table
              columns={columnsReceitas}
              dataSource={despesas}
              size="small"
              rowKey={(line) => line._id}
            />

            <Card
              size="small"
              style={{
                backgroundColor: "#001529",
                marginBottom: 10,
                marginTop: 10,
              }}
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

            <Descriptions bordered size="small">
              <Descriptions.Item span={1} label="Total de Venda de Produtos">
                <Statistic
                  value={valorProdutos}
                  precision={2}
                  prefix="R$"
                  valueStyle={{ fontSize: 15.5 }}
                />
              </Descriptions.Item>
              <Descriptions.Item
                span={1}
                label="Total de Prestação de Serviços"
              >
                <Statistic
                  value={valorServicos}
                  precision={2}
                  prefix="R$"
                  valueStyle={{ fontSize: 15.5 }}
                />
              </Descriptions.Item>
              <Descriptions.Item span={1} label="Total das Receitas Diversas">
                <Statistic
                  value={valorReceitas}
                  precision={2}
                  prefix="R$"
                  valueStyle={{ fontSize: 15.5 }}
                />
              </Descriptions.Item>
              <Descriptions.Item span={1} label="Total das Despesas Diversas">
                <Statistic
                  value={valorDespesas}
                  precision={2}
                  prefix="R$"
                  valueStyle={{ fontSize: 15.5 }}
                />
              </Descriptions.Item>
              <Descriptions.Item span={2} label="Saldo Atual">
                <Statistic
                  value={
                    valorProdutos +
                    valorServicos +
                    valorReceitas -
                    valorDespesas
                  }
                  precision={2}
                  prefix="R$"
                  valueStyle={{ fontSize: 15.5 }}
                />
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </div>

      <Modal
        title="Busca Avançada"
        visible={modalAdvancedFind}
        onCancel={() => setModalAdvancedFind(false)}
        footer={[
          <Button
            key="back"
            icon="close"
            type="danger"
            onClick={() => setModalAdvancedFind(false)}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            icon="search"
            type="primary"
            loading={loading}
            onClick={() => sendAdvancedFind()}
          >
            Buscar
          </Button>,
        ]}
      >
        <label>Selecione uma opção:</label>
        <Select
          value={typeAdvandcedFind}
          style={{ width: "100%" }}
          onChange={(value) => setTypeAdvancedFind(value)}
        >
          <Option value={1}>Mês Atual</Option>
          <Option value={2}>Por Período</Option>
        </Select>

        {typeAdvandcedFind === 2 && (
          <>
            <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
              SELECIONE O PERÍODO
            </Divider>

            <div
              style={{
                width: "100%",
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
                style={{ width: 100 }}
                onChange={(value) => setAno(value)}
              >
                <Option value={Ano - 1}>{Ano - 1}</Option>
                <Option value={Ano}>{Ano}</Option>
                <Option value={Ano + 1}>{Ano + 1}</Option>
                <Option value={Ano + 2}>{Ano + 2}</Option>
                <Option value={Ano + 3}>{Ano + 3}</Option>
              </Select>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
