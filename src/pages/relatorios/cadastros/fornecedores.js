import React, { useState, useEffect } from "react";
import { Icon, Table, Button, Modal, Descriptions, Spin, Divider } from "antd";
import api from "../../../config/axios";

export default function RelatorioFornecedores() {
  const [spinner, setSpinner] = useState(false);
  const [fornecedores, setFornecedores] = useState([]);
  const [fornecerCount, setFornecerCount] = useState(null);
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
    findDados();
  }, []);

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
          <title>Imprimir Relatório de Fornecedores</title>
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
        
            .table-client {
              width: 100%;
              border: 1px solid #000;
              border-radius: 5px;
              overflow: hidden;
            }
        
            .table-client thead tr td {
              padding: 5px;
              font-weight: bold;
              font-size: 13px;
              border-bottom: 1px solid #000;
              border-right: 1px solid #000;
            }
        
            .table-client thead tr td:last-child {
              border-right: none;
            }
        
            .table-client tbody tr td {
              padding: 5px;
              font-size: 12px;
              border-right: 1px solid #000;
            }
        
            .table-client tbody tr td:last-child {
              border-right: none;
            }
        
            .active,
            .active2 {
              width: 8%;
              text-align: center;
            }
        
            .phone,
            .phone2 {
              width: 9%;
              text-align: center;
            }
        
            .name,
            .socialName,
            .name2,
            .socialName2 {
              width: 35%;
            }
        
            .email,
            .email2 {
              width: 18%;
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
        
              .name,
              .socialName,
              .name2,
              .socialName2 {
                width: 23%;
              }
        
              .active,
              .active2 {
                width: 5%;
              }
        
              .info-container p {
                font-size: 11px;
              }
        
              .table-client tbody tr td {
                font-size: 10px;
              }
        
              .table-client thead tr td {
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
        
              <h2>RELATÓRIO DE FORNECEDORES</h2>
        
              <table class="table-client" cellspacing='0'>
                <thead>
                  <tr>
                    <td class="name">NOME</td>
                    <td class="socialName">RAZÃO SOCIAL</td>
                    <td class="phone">FONE</td>
                    <td class="email">EMAIL</td>
                    <td class="active">ATIVO?</td>
                  </tr>
                </thead>
                <tbody>
                    ${fornecedores.map((forn) => {
                      return `<tr>
                        <td class="name2">${forn.name}</td>
                        <td class="socialName2">${forn.socialName}</td>
                        <td class="phone2">${forn.phoneComercial}</td>
                        <td class="email2">${forn.email}</td>
                        ${
                          forn.active
                            ? `<td class="active2">Sim</td>`
                            : `<td class="active2">Não</td>`
                        }
                      </tr>`;
                    })}
                </tbody>
              </table>
        
              <table class="table-resume">
        
                  <thead>
                    <tr>
                      <td class="valueslast">TOTAL DOS FORNECEDORES</td>
                      <td class="moneylast">${fornecerCount}</td>
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
          onClick={() => printer()}
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
    </Spin>
  );
}
