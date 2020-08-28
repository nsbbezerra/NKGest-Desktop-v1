import React, { useState, useEffect } from "react";
import "./style.css";
import { Radio, Button, Divider } from "antd";
import Matri from "../assets/print.svg";
import Norm from "../assets/printer.svg";

function PrintSaleTemplate({ empresa, venda, cliente, endereco }) {
  const [modePrint, setModePrint] = useState("");

  async function findPrintMode() {
    const printMode = await localStorage.getItem("print");
    if (printMode) {
      await setModePrint(printMode);
    } else {
      return;
    }
  }

  useEffect(() => {
    findPrintMode();
  }, []);

  function replaceValue(value) {
    let casas = Math.pow(10, 2);
    let replaced = Math.floor(value * casas) / casas;

    return replaced.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function printingNormal() {
    var myWindow = window.open(
      "",
      "Print",
      `height=${window.screen.height}, width=${window.screen.width}`,
      "fullscreen=yes"
    );
    myWindow.document.write(`
        <!DOCTYPE html>
            <html lang="pt-br">

            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <link rel="stylesheet" href="style.css" />
            <title>Imprimir Venda</title>
            <style>
            * { padding: 0; margin: 0; outline: none; box-sizing: border-box; font-family: Calibri, 'Gill Sans', 'Gill Sans MT', 'Trebuchet MS', sans-serif !important;}
            body {
                width: 100vw;
                height: 100vh;
                background-color: #555;
                padding-top: 35px;
            }
            html::-webkit-scrollbar {
                display: none;
            }
            .page-print { width: 21cm; min-height: 14.8cm; background-color: #fff; box-shadow: 0 0 20px rgba(0,0,0,.5); margin: auto; padding: .5cm; margin-bottom: 35px; }
            .container-print { font-family: 'Courier New', Courier, monospace; }
            .cabecalho-print { display: flex; flex-direction: row; width: 100%; justify-content: center; align-items: center; border-bottom: 1px solid #000; padding-bottom: 3px; }
            .logo-container { width: 120px; height: 90px; display: flex; justify-content: center; align-items: center; }
            .logo-print { max-width: 85px; max-height: 85px; }
            .info-container { width: 100%; }
            .info-company { width: 100%; text-align: center; padding: 4px; border-bottom: 1px solid #000; }
            .info-company p { font-size: 11.5px; }
            .info-company h1 { font-size: 20px; }
            .info-order { display: flex; flex-direction: row; justify-content: space-between; padding-top: 8px; padding-right: 3px; padding-left: 3px; }
            .info-order p { font-size: 13px; }
            .client-container { width: 100%; display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 4px; font-size: 11.5px; border-bottom: 1px solid #000; }
            .client-info  { width: 70%; } .client-contact { width: 30%; text-align: right; }
            .title-print { width: 100%; border-bottom: 1px solid #000; padding: 3px; text-align: center; background-color: rgb(245, 245, 245); -webkit-print-color-adjust: exact; }
            .table-product { width: 100%; border-bottom: 1px solid #000; }
            .table-product thead tr td { font-size: 12px; font-weight: bold; padding: 3px; border-bottom: 1px solid #000; border-right: 1px solid #000; }
            .table-product thead tr td:last-child { border-right: none; }
            .qtd { width: 6%; text-align: center; } .desc { width: 55%; } .unid { width: 6%; text-align: center; } .v-unit { width: 16.5%; text-align: right; } .v-total { width: 16.5%; text-align: right; }
            .table-product tbody tr td { font-size: 11.5px; padding: 3px; border-right: 1px solid #000; }
            .table-product tbody tr td:last-child { border-right: none; }
            .resume-container { width: 100%; display: flex; flex-direction: row; justify-content: center; align-items: center; height: 63px; }
            .obs-container { width: 70%; border-bottom: 1px solid #000; border-right: 1px solid #000; padding: 3px; height: 100%; } .values-container { width: 30%; border-bottom: 1px solid #000; padding: 3px; text-align: center; height: 100%; }
            .obs-container h5 { font-size: 13px; } .obs-container p { font-size: 11.5px; }
            .info-resume { display: flex; flex-direction: row; font-size: 13px; width: 100%; margin-top: 3px; } .text-print { width: 50%; text-align: justify; } .cifrao-print { width: 10%; text-align: center; } .value-print { width: 40%; text-align: right; } .text-bold { font-weight: bold; }
            .warning-print { font-size: 10px; margin-top: 7px; font-style: italic; }
            .signature-container { width: 400px; text-align: center; font-size: 12px; margin-top: 70px; } .signature-container p { margin-top: 5px; }
            .signature { width: 400px; border-bottom: 1px solid #000; }
            .page-break { display: none; }
            .btn-print { border: none; padding: 10px; background-color: #f6f6f6; position: fixed; display: block; margin: auto; border-radius: 3px; cursor: pointer; box-shadow: 1px 1px 5px rgba(0,0,0,.5); font-weight: bold;  }
            
            @media print {
                @page { margin: .6cm; }
                body { padding: 0; }
                .page-print { visibility: hidden; margin: 0; padding: 0; }
                .container-print { visibility: visible; display: block; position: relative; padding: 3px; }
                .page-break { page-break-after: always; color: transparent; display: block; break-inside: avoid; }
                .btn-print { display: none; }
            }
            </style>
            </head>

            <body>
            <button class="btn-print" onclick="window.print()">IMPRIMIR</button>
            <div class="page-print">
                <div class="container-print">

                <div class="cabecalho-print">
                    <div class="logo-container">
                    <img alt="logo" class="logo-print" src="${
                      empresa.logo_url
                    }" />
                    </div>
                    <div class="info-container">
                    <div class="info-company">
                        <h1>${empresa.name}</h1>
                        <p><strong>END:</strong> ${empresa.street}, ${
      empresa.number
    }, ${empresa.bairro}, <strong>CEP:</strong> ${empresa.cep}, ${
      empresa.city
    } - ${empresa.state}
                        </p>
                        <p><strong>TEL:</strong> ${
                          empresa.phoneComercial
                        } - <strong>EMAIL:</strong> ${empresa.email}</p>
                    </div>
                    <div class="info-order">
                        <p><strong>NÚMERO DO PEDIDO:</strong> ${
                          venda.number
                        }</p>
                        <p><strong>DATA DA COMPRA:</strong> ${
                          venda.createDate
                        }</p>
                    </div>
                    </div>
                </div>

                <div class="client-container">
                    <div class="client-info">
                    <p><strong>CLIENTE:</strong> ${cliente.name}</p>
                    <p><strong>END:</strong> ${endereco.street}, ${
      endereco.number
    }, ${endereco.bairro}, ${endereco.city} - ${endereco.state}</p>
                    </div>
                    <div class="client-contact">
                    ${
                      cliente.phoneComercial
                        ? `<p><strong>CEL:</strong> ${cliente.phoneComercial}</p>`
                        : ""
                    }
                    ${
                      cliente.celOne
                        ? `<p><strong>TEL:</strong> ${cliente.celOne}</p>`
                        : ""
                    }
                    </div>
                </div>

                <div class="title-print">
                    <h5>VENDA DE PRODUTOS</h5>
                </div>

                <table class="table-product" cellspacing="0">
                    <thead>
                    <tr>
                        <td class="qtd">QTD</td>
                        <td class="desc">DESCRIÇÃO</td>
                        <td class="unid">UNI</td>
                        <td class="v-unit">V. UNIT</td>
                        <td class="v-total">V. TOTAL</td>
                    </tr>
                    </thead>

                    <tbody>
                    ${venda.products
                      .map((prod) => {
                        return `
                        <tr>
                            <td class="qtd">${prod.quantity}</td>
                            <td class="desc">${prod.name}</td>
                            <td class="unid">${prod.unidade}</td>
                            <td class="v-unit">${replaceValue(
                              prod.valueUnit
                            )}</td>
                            <td class="v-total">${replaceValue(
                              prod.valueTotal
                            )}</td>
                        </tr>
                        `;
                      })
                      .join("")}
                    </tbody>
                </table>

                <div class="title-print">
                    <h5>RESUMO</h5>
                </div>

                <div class="resume-container">

                    <div class="obs-container">
                    <h5>OBSERVAÇÕES:</h5>
                    ${venda.obs ? `<p>${venda.obs}</p>` : ""}
                    </div>

                    <div class="values-container">
                    <div class="info-resume">
                        <div class="text-print">
                        <p>VALOR TOTAL</p>
                        </div>
                        <div class="cifrao-print">
                        <p>R$</p>
                        </div>
                        <div class="value-print">
                        <p>${replaceValue(venda.valueBruto)}</p>
                        </div>
                    </div>
                    <div class="info-resume">
                        <div class="text-print">
                        <p>DESCONTO</p>
                        </div>
                        <div class="cifrao-print">
                        <p>%</p>
                        </div>
                        <div class="value-print">
                        <p>${parseFloat(venda.desconto.toFixed(2))}</p>
                        </div>
                    </div>
                    <div class="info-resume">
                        <div class="text-print">
                        <p class="text-bold">TOTAL A PAGAR</p>
                        </div>
                        <div class="cifrao-print">
                        <p class="text-bold">R$</p>
                        </div>
                        <div class="value-print">
                        <p class="text-bold">${replaceValue(
                          venda.valueLiquido
                        )}</p>
                        </div>
                    </div>
                    </div>

                </div>

                <p class="warning-print">Este documento não comprova pagamento.</p>

                <div class="signature-container">
                    <div class="signature"></div>
                    <p>ASSINATURA</p>
                </div>

                </div>
            </div>
            </body>
            </html>
        `);
    setTimeout(function () {
      myWindow.print();
    }, 2000);
  }

  function printingSimplify() {
    var myWindow = window.open(
      "",
      "Print",
      `height=${window.screen.height}, width=${window.screen.width}`,
      "fullscreen=yes"
    );
    myWindow.document.write(`
        <!DOCTYPE html>
            <html lang="pt-br">

            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <link rel="stylesheet" href="style.css" />
            <title>Imprimir Venda</title>
            <style>
            * { padding: 0; margin: 0; outline: none; box-sizing: border-box; font-family: Calibri, 'Gill Sans', 'Gill Sans MT', 'Trebuchet MS', sans-serif !important; }
            body {
                width: 100vw;
                height: 100vh;
                background-color: #555;
                padding-top: 35px;
            }
            html::-webkit-scrollbar {
                display: none;
            }
            .page-print { width: 21cm; min-height: 14.8cm; background-color: #fff; box-shadow: 0 0 20px rgba(0,0,0,.5); margin: auto; padding: .5cm; margin-bottom: 35px; }
            .container-print { font-family: 'Courier New', Courier, monospace; }
            .cabecalho-print { display: flex; flex-direction: row; width: 100%; justify-content: center; align-items: center; border-bottom: 1px solid #000; padding-bottom: 3px; }
            .logo-container { width: 120px; height: 90px; display: flex; justify-content: center; align-items: center; }
            .logo-print { max-width: 85px; max-height: 85px; }
            .info-container { width: 100%; }
            .info-company { width: 100%; text-align: center; padding: 4px; border-bottom: 1px solid #000; }
            .info-company p { font-size: 14px; }
            .info-company h1 { font-size: 20px; }
            .info-order { display: flex; flex-direction: row; justify-content: space-between; padding: 5px; padding-right: 3px; padding-left: 3px; }
            .info-order p { font-size: 15px; }
            .client-container { width: 100%; display: flex; flex-direction: row; justify-content: center; align-items: center; padding: 4px; font-size: 13px; border-bottom: 1px solid #000; }
            .client-info  { width: 70%; } .client-contact { width: 30%; text-align: right; }
            .title-print { width: 100%; border-bottom: 1px solid #000; padding: 5px; text-align: center; }
            .table-product { width: 100%; border-bottom: 1px solid #000; }
            .table-product thead tr td { font-size: 14px; font-weight: bold; padding: 5px; border-bottom: 1px solid #000; border-right: 1px solid #000; }
            .table-product thead tr td:last-child { border-right: none; }
            .qtd { width: 6%; text-align: center; } .desc { width: 55%; } .unid { width: 6%; text-align: center; } .v-unit { width: 16.5%; text-align: right; } .v-total { width: 16.5%; text-align: right; }
            .table-product tbody tr td { font-size: 14px; padding: 3px; border-right: 1px solid #000; }
            .table-product tbody tr td:last-child { border-right: none; }
            .resume-container { width: 100%; display: flex; flex-direction: row; justify-content: center; align-items: center; height: 63px; }
            .obs-container { width: 70%; border-bottom: 1px solid #000; border-right: 1px solid #000; padding: 3px; height: 100%; } .values-container { width: 30%; border-bottom: 1px solid #000; padding: 3px; text-align: center; height: 100%; }
            .obs-container h5 { font-size: 13px; } .obs-container p { font-size: 11.5px; }
            .info-resume { display: flex; flex-direction: row; font-size: 13.5px; width: 100%; margin-top: 3px; } .text-print { width: 50%; text-align: justify; } .cifrao-print { width: 10%; text-align: center; } .value-print { width: 40%; text-align: right; } .text-bold { font-weight: bold; }
            .warning-print { font-size: 10px; margin-top: 7px; font-style: italic; }
            .signature-container { width: 400px; text-align: center; font-size: 12px; margin-top: 70px; } .signature-container p { margin-top: 5px; }
            .signature { width: 400px; border-bottom: 1px solid #000; }
            .page-break { display: none; }
            .btn-print { border: none; padding: 10px; background-color: #f6f6f6; position: fixed; display: block; margin: auto; border-radius: 3px; cursor: pointer; box-shadow: 1px 1px 5px rgba(0,0,0,.5); font-weight: bold;  }
            
            @media print {
                @page { margin: .6cm; }
                body { padding: 0; }
                .page-print { visibility: hidden; margin: 0; padding: 0; }
                .container-print { visibility: visible; display: block; position: relative; padding: 3px; }
                .page-break { page-break-after: always; color: transparent; display: block; break-inside: avoid; }
                .btn-print { display: none; }
            }
            </style>
            </head>

            <body>
            <button class="btn-print" onclick="window.print()">IMPRIMIR</button>
            <div class="page-print">
                <div class="container-print">

                <div class="cabecalho-print">
                    <div class="info-container">
                    <div class="info-company">
                        <h1>${empresa.name}</h1>
                        <p><strong>END:</strong> ${empresa.street}, ${
      empresa.number
    }, ${empresa.bairro}, <strong>CEP:</strong> ${empresa.cep}, ${
      empresa.city
    } - ${empresa.state}
                        </p>
                        <p><strong>TEL:</strong> ${
                          empresa.phoneComercial
                        } - <strong>EMAIL:</strong> ${empresa.email}</p>
                    </div>
                    <div class="info-order">
                        <p><strong>NÚMERO DO PEDIDO:</strong> ${
                          venda.number
                        }</p>
                        <p><strong>DATA DA COMPRA:</strong> ${
                          venda.createDate
                        }</p>
                    </div>
                    </div>
                </div>

                <div class="client-container">
                    <div class="client-info">
                    <p><strong>CLIENTE:</strong> ${cliente.name}</p>
                    <p><strong>END:</strong> ${endereco.street}, ${
      endereco.number
    }, ${endereco.bairro}, ${endereco.city} - ${endereco.state}</p>
                    </div>
                    <div class="client-contact">
                    ${
                      cliente.phoneComercial
                        ? `<p><strong>CEL:</strong> ${cliente.phoneComercial}</p>`
                        : ""
                    }
                    ${
                      cliente.celOne
                        ? `<p><strong>TEL:</strong> ${cliente.celOne}</p>`
                        : ""
                    }
                    </div>
                </div>

                <div class="title-print">
                    <h5>VENDA DE PRODUTOS</h5>
                </div>

                <table class="table-product" cellspacing="0">
                    <thead>
                    <tr>
                        <td class="qtd">QTD</td>
                        <td class="desc">DESCRIÇÃO</td>
                        <td class="unid">UNI</td>
                        <td class="v-unit">V. UNIT</td>
                        <td class="v-total">V. TOTAL</td>
                    </tr>
                    </thead>

                    <tbody>
                    ${venda.products
                      .map((prod) => {
                        return `
                        <tr>
                            <td class="qtd">${prod.quantity}</td>
                            <td class="desc">${prod.name}</td>
                            <td class="unid">${prod.unidade}</td>
                            <td class="v-unit">${replaceValue(
                              prod.valueUnit
                            )}</td>
                            <td class="v-total">${replaceValue(
                              prod.valueTotal
                            )}</td>
                        </tr>
                        `;
                      })
                      .join("")}
                    </tbody>
                </table>

                <div class="title-print">
                    <h5>RESUMO</h5>
                </div>

                <div class="resume-container">

                    <div class="obs-container">
                    <h5>OBSERVAÇÕES:</h5>
                    ${venda.obs ? `<p>${venda.obs}</p>` : ""}
                    </div>

                    <div class="values-container">
                    <div class="info-resume">
                        <div class="text-print">
                        <p>VALOR TOTAL</p>
                        </div>
                        <div class="cifrao-print">
                        <p>R$</p>
                        </div>
                        <div class="value-print">
                        <p>${replaceValue(venda.valueBruto)}</p>
                        </div>
                    </div>
                    <div class="info-resume">
                        <div class="text-print">
                        <p>DESCONTO</p>
                        </div>
                        <div class="cifrao-print">
                        <p>%</p>
                        </div>
                        <div class="value-print">
                        <p>${parseFloat(venda.desconto.toFixed(2))}</p>
                        </div>
                    </div>
                    <div class="info-resume">
                        <div class="text-print">
                        <p class="text-bold">TOTAL A PAGAR</p>
                        </div>
                        <div class="cifrao-print">
                        <p class="text-bold">R$</p>
                        </div>
                        <div class="value-print">
                        <p class="text-bold">${replaceValue(
                          venda.valueLiquido
                        )}</p>
                        </div>
                    </div>
                    </div>

                </div>

                <p class="warning-print">Este documento não comprova pagamento.</p>

                <div class="signature-container">
                    <div class="signature"></div>
                    <p>ASSINATURA</p>
                </div>

                </div>
            </div>
            </body>
            </html>
        `);
    myWindow.print();
  }

  function handlePrint() {
    if (modePrint === "normal") {
      printingNormal();
    } else {
      printingSimplify();
    }
  }

  return (
    <div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <Radio.Group
          onChange={(e) => setModePrint(e.target.value)}
          value={modePrint}
        >
          <Radio.Button value="matricial" style={{ height: 100 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <img src={Matri} style={{ width: 70, height: 70 }} />
              Matricial
            </div>
          </Radio.Button>
          <Radio.Button value="normal" style={{ height: 100 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <img src={Norm} style={{ width: 70, height: 70 }} />
              Normal
            </div>
          </Radio.Button>
        </Radio.Group>
      </div>
      <Divider />
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: -3,
        }}
      >
        <Button type="primary" icon="printer" onClick={() => handlePrint()}>
          Imprimir
        </Button>
      </div>
    </div>
  );
}

export default PrintSaleTemplate;
