import React, { useState, useEffect } from 'react';
import { Icon, Table, Button, Card, Descriptions, Select, Modal, Spin, TreeSelect, Divider, Statistic, Row, Drawer, Tooltip } from 'antd';
import api from '../../../config/axios';

const { Option } = Select;
const { TreeNode } = TreeSelect;

export default function RelatorioServicos() {

    const [clients, setClients] = useState([]);
    const [vendedor, setVendedor] = useState([]);
    const [drawerProducts, setDrawerProducts] = useState(false);

    const [loading, setLoading] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [modalSearch, setModalSearch] = useState(false);
    const [servicosVendas, setServicosVendas] = useState([]);
    const [servicosVendasPay, setServicosVendasPay] = useState([]);
    const [find, setFind] = useState(null);
    const [totalServicosPay, setTotalServicosPay] = useState(null);
    const [totalServicosWait, setTotalServicosWait] = useState(null);

    const [clientId, setClientId] = useState(null);
    const [clientName, setClientName] = useState(null);
    const [vendedorId, setVendedorId] = useState(null);
    const [vendedorName, setVendedorName] = useState(null);
    const [mes, setMes] = useState(null);
    const [ano, setAno] = useState(null);

    const [buttonPrint, setButtonPrint] = useState(true);

    const [showTables, setShowTables] = useState(false);

    const [servicos, setServicos] = useState([]);

    const [dados, setDados] = useState({});

    function erro(title, message) {
        Modal.error({
            title: title,
            content: (
                <div>
                    <p>{message}</p>
                </div>
            ),
            onOk() { },
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
            onOk() { },
        });
    }

    async function findDados() {
        await api.get('/organization/find').then(response => {
            setDados(response.data.empresa);
        }).catch(error => {
            erro('Erro', error.message);
        });
    }

    async function findClients() {
        setSpinner(true)
        await api.get(`/admin/listClientes`).then(response => {
            setClients(response.data.clientes)
            setSpinner(false);
        }).catch(error => {
            erro('Erro', error.message);
            setSpinner(false);
        });
    }

    useEffect(() => {
        findClients();
        findVendedor();
        findDados();
    }, []);

    async function findVendedor() {
        setSpinner(true)
        await api.get('/admin/findFuncionariosComissioned').then(response => {
            setVendedor(response.data.funcionarios)
            setSpinner(false);
        }).catch(error => {
            erro('Erro', error.message);
            setSpinner(false);
        });
    }

    async function finder() {
        if (find === null) {
            warning('Atenção', 'Selecione uma opção de busca');
            return false;
        }
        setLoading(true);
        await api.post('/report/listServicesOrders', {
            find: find, client: clientId, func: vendedorId, mes: mes, ano: ano
        }).then(response => {
            setServicosVendas(response.data.servicesWait);
            setServicosVendasPay(response.data.servicesPay);
            setTotalServicosPay(response.data.calcPay);
            setTotalServicosWait(response.data.calcWait);
            setLoading(false);
            setModalSearch(false);
            setButtonPrint(false);
            setShowTables(true);
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoading(false);
        });
    }

    async function handleClient(value) {
        const result = await clients.find(obj => obj.name === value);
        await setClientId(result._id);
        await setClientName(result.name);
    }

    async function handleVendedor(value) {
        const result = await vendedor.find(obj => obj.name === value);
        await setVendedorId(result._id);
        await setVendedorName(result.name);
    }

    async function viewInfoServicesPay(id) {
        const result = await servicosVendasPay.find(obj => obj._id === id);
        await setServicos(result.services);
        setDrawerProducts(true);
    }

    async function viewInfoServicesWait(id) {
        const result = await servicosVendas.find(obj => obj._id === id);
        await setServicos(result.services);
        setDrawerProducts(true);
    }

    function printer() {
        var mywindow = window.open('', 'Print', `height=${window.screen.height}, width=${window.screen.width}`, 'fullscreen=yes');
        mywindow.document.write(`
        <!DOCTYPE html>
        <html>
        
        <head>
          <title>Imprimir Relatório de Ordens de Serviço</title>
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
        
            .content h5 {
                margin-top: 10px;
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
                    <img src="${dados.logo_url}" style="width: 100px; max-height: 100px;"/>
                  </div>
        
                  <div class="company-info-container">
        
                    <h5>${dados.name}</h5>
                    <p>${dados.street}, ${dados.number}, ${dados.bairro}, ${dados.city} - ${dados.state}, CEP: ${dados.cep}.</p>
                    <p>CNPJ: ${dados.cnpj}, Fone ${dados.phoneComercial}</p>
                    <p>Email: ${dados.email}</p>
                  </div>
        
                </section>
        
              </div>
        
              <h2>RELATÓRIO DE ORDENS DE SERVIÇO</h2>
        
              <h5>ORDENS DE SERVIÇO PAGAS</h5>

            <table class="table-product" cellspacing='0'>
                <thead>
                    <tr>
                        <td class="name">CLIENTE</td>
                        <td class="vend">VENDEDOR</td>
                        <td class="data">DATA</td>
                        <td class="totBrut">TOT. BRUTO</td>
                        <td class="totLiqu">TOT. LIQUI.</td>
                        <td class="desc">DESC.</td>
                        <td class="pay">PAGO?</td>
                    </tr>
                </thead>
                <tbody>
                 ${servicosVendasPay.map(vend => {
            return `<tr>
                     <td class="name2">${vend.client.name}</td>
                     <td class="vend2">${vend.funcionario.name}</td>
                     <td class="data2">${vend.createDate}</td>
                     <td class="totBrut2">R$ ${vend.totalService}</td>
                     <td class="totLiqu2">R$ ${vend.serviceLiquid}</td>
                     <td class="desc2">% ${vend.desconto}</td>
                     ${vend.statusPay === 'pay' ? (`<td class="pay2">Sim</td>`) : (`<td class="pay2">Não</td>`)}
                 </tr>`
        }).join('')}
                </tbody>
            </table>
            
            <h5>ORDENS DE SERVIÇO EM ABERTO</h5>

            <table class="table-product" cellspacing='0'>
                <thead>
                    <tr>
                        <td class="name">CLIENTE</td>
                        <td class="vend">VENDEDOR</td>
                        <td class="data">DATA</td>
                        <td class="totBrut">TOT. BRUTO</td>
                        <td class="totLiqu">TOT. LIQUI.</td>
                        <td class="desc">DESC.</td>
                        <td class="pay">PAGO?</td>
                    </tr>
                </thead>
                <tbody>
                 ${servicosVendas.map(vend => {
            return `<tr>
                     <td class="name2">${vend.client.name}</td>
                     <td class="vend2">${vend.funcionario.name}</td>
                     <td class="data2">${vend.createDate}</td>
                     <td class="totBrut2">R$ ${vend.totalService}</td>
                     <td class="totLiqu2">R$ ${vend.serviceLiquid}</td>
                     <td class="desc2">% ${vend.desconto}</td>
                     ${vend.statusPay === 'pay' ? (`<td class="pay2">Sim</td>`) : (`<td class="pay2">Não</td>`)}
                 </tr>`
        }).join('')}
                </tbody>
            </table>
        
              <table class="table-resume">
        
                <thead>
                  <tr>
                    <td class="values">TOTAL ORDENS DE SERVIÇO: PAGO</td>
                    <td class="money">R$ ${totalServicosPay}</td>
                  </tr>
                  <tr>
                    <td class="values">TOTAL ORDENS DE SERVIÇO: EM ABERTO</td>
                    <td class="money">R$ ${totalServicosWait}</td>
                  </tr>
                  <tr>
                    <td class="valueslast">TOTAL GERAL</td>
                    <td class="moneylast">R$ ${totalServicosPay + totalServicosWait}</td>
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

    const DataAtual = new Date();
    const Ano = DataAtual.getFullYear();

    const columnServicesPay = [
        {
            title: 'Cliente',
            dataIndex: 'client.name',
            key: 'client.name',
        },
        {
            title: 'Vendedor',
            dataIndex: 'funcionario.name',
            key: 'funcionario.name',
        },
        {
            title: 'Total Serviços',
            dataIndex: 'serviceLiquid',
            key: 'serviceLiquid',
            render: (valor) => <Statistic value={valor} precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} />,
            align: 'right'
        },
        {
            title: 'Total Produtos',
            dataIndex: 'productLiquid',
            key: 'productLiquid',
            render: (valor) => <Statistic value={valor} precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} />,
            align: 'right'
        },
        {
            title: 'Valor Total',
            dataIndex: 'valueLiquido',
            key: 'valueLiquido',
            render: (valor) => <Statistic value={valor} precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} />,
            align: 'right'
        },
        {
            title: 'Data',
            dataIndex: 'createDate',
            key: 'createDate',
            align: 'center'
        },
        {
            title: 'Pago?',
            dataIndex: 'statusPay',
            key: 'statusPay',
            render: (act) => <>
                {act === 'pay' && (
                    <Icon type='check' style={{ color: '#4caf50', fontWeight: 'bold', fontSize: 17 }} />
                )}
                {act === 'wait' && (
                    <Icon type='stop' style={{ color: '#f44336', fontWeight: 'bold', fontSize: 17 }} />
                )}
            </>,
            align: 'center',
            width: '8%'
        },
        {
            title: 'Ações',
            dataIndex: '_id',
            key: '_id',
            render: (id) => <>
                <Tooltip placement='top' title='Vizualizar Produtos/Serviços'>
                    <Button icon='zoom-in' type='primary' shape='circle' size='small' onClick={() => viewInfoServicesPay(id)} />
                </Tooltip>
            </>,
            width: '6%',
            align: 'center'
        },
    ];

    const columnServicesWait = [
        {
            title: 'Cliente',
            dataIndex: 'client.name',
            key: 'client.name',
        },
        {
            title: 'Vendedor',
            dataIndex: 'funcionario.name',
            key: 'funcionario.name',
        },
        {
            title: 'Total Serviços',
            dataIndex: 'serviceLiquid',
            key: 'serviceLiquid',
            render: (valor) => <Statistic value={valor} precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} />,
            align: 'right'
        },
        {
            title: 'Total Produtos',
            dataIndex: 'productLiquid',
            key: 'productLiquid',
            render: (valor) => <Statistic value={valor} precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} />,
            align: 'right'
        },
        {
            title: 'Valor Total',
            dataIndex: 'valueLiquido',
            key: 'valueLiquido',
            render: (valor) => <Statistic value={valor} precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} />,
            align: 'right'
        },
        {
            title: 'Data',
            dataIndex: 'createDate',
            key: 'createDate',
            align: 'center'
        },
        {
            title: 'Pago?',
            dataIndex: 'statusPay',
            key: 'statusPay',
            render: (act) => <>
                {act === 'pay' && (
                    <Icon type='check' style={{ color: '#4caf50', fontWeight: 'bold', fontSize: 17 }} />
                )}
                {act === 'wait' && (
                    <Icon type='stop' style={{ color: '#f44336', fontWeight: 'bold', fontSize: 17 }} />
                )}
            </>,
            align: 'center',
            width: '8%'
        },
        {
            title: 'Ações',
            dataIndex: '_id',
            key: '_id',
            render: (id) => <>
                <Tooltip placement='top' title='Vizualizar Produtos/Serviços'>
                    <Button icon='zoom-in' type='primary' shape='circle' size='small' onClick={() => viewInfoServicesWait(id)} />
                </Tooltip>
            </>,
            width: '6%',
            align: 'center'
        },
    ];

    const columnsService = [
        {
            title: 'Qtd',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '6%'
        },
        {
            title: 'Serviço',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Valor Uni',
            dataIndex: 'valueUnit',
            key: 'valueUnit',
            render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15.5 }} prefix='R$' precision={2} />,
            width: '12%',
            align: 'right'
        },
        {
            title: 'Valor Tot',
            dataIndex: 'valueTotal',
            key: 'valueTotal',
            render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15.5 }} prefix='R$' precision={2} />,
            width: '12%',
            align: 'right'
        },
    ];

    return (
        <>

            <Spin spinning={spinner} size='large'>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <Card size='small'>

                        {find === null && (
                            <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>-</strong></p>
                        )}
                        {find === 1 && (
                            <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>Vendas de Produtos do Mês Atual</strong></p>
                        )}
                        {find === 2 && (
                            <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>{`Prestação de Serviço do mês de ${mes} do ano ${ano}`}</strong></p>
                        )}
                        {find === 3 && (
                            <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>{`Prestação de Serviço do ano ${ano}`}</strong></p>
                        )}
                        {find === 4 && (
                            <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>{`Prestação de Serviço do mês atual ao cliente: ${clientName}`}</strong></p>
                        )}
                        {find === 5 && (
                            <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>{`Prestação de Serviço do mês de ${mes} do ano ${ano}, ao cliente: ${clientName}`}</strong></p>
                        )}
                        {find === 6 && (
                            <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>{`Prestação de Serviço do ano ${ano}, ao cliente: ${clientName}`}</strong></p>
                        )}
                        {find === 7 && (
                            <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>{`Prestação de Serviço do mês atual pelo vendedor(a): ${vendedorName}`}</strong></p>
                        )}
                        {find === 8 && (
                            <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>{`Prestação de Serviço do mês de ${mes} do ano ${ano}, pelo vendedor(a): ${vendedorName}`}</strong></p>
                        )}
                        {find === 9 && (
                            <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>{`Prestação de Serviço do ano ${ano}, pelo vendedor(a): ${vendedorName}`}</strong></p>
                        )}

                    </Card>

                    <div style={{ display: 'flex', flexDirection: 'row' }}>

                        <Button icon='printer' type='default' style={{ marginRight: 10 }} disabled={buttonPrint} onClick={() => printer()}>Imprimir Relatório</Button>

                        <Button icon='search' type='primary' onClick={() => setModalSearch(true)}>Busca Avançada</Button>

                    </div>

                </div>

                <Divider/>

                {showTables === true && (
                    <>
                        <Card size='small' style={{ backgroundColor: '#001529', marginBottom: 10 }} bordered={false}>
                            <Row>
                                <Icon type='rise' style={{ fontSize: 20, color: '#fff', marginRight: 15 }} />
                                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>ORDENS DE SERVIÇO PAGAS</span>
                            </Row>
                        </Card>

                        {!!servicosVendasPay.length && (
                            <Table pagination={{ pageSize: 10 }} columns={columnServicesPay} dataSource={servicosVendasPay} size='small' rowKey={(cli) => cli._id} />
                        )}

                        <Card size='small' style={{ backgroundColor: '#001529', marginBottom: 10 }} bordered={false}>
                            <Row>
                                <Icon type='shopping-cart' style={{ fontSize: 20, color: '#fff', marginRight: 15 }} />
                                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>ORDENS DE SERVIÇO EM ABERTO</span>
                            </Row>
                        </Card>

                        {!!servicosVendas.length && (
                            <Table pagination={{ pageSize: 10 }} columns={columnServicesWait} dataSource={servicosVendas} size='small' rowKey={(cli) => cli._id} />
                        )}

                        {totalServicosWait && (
                            <>
                                <Card size='small' style={{ backgroundColor: '#001529', marginBottom: 10 }} bordered={false}>
                                    <Row>
                                        <Icon type='line-chart' style={{ fontSize: 20, color: '#fff', marginRight: 15 }} />
                                        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>RESUMO</span>
                                    </Row>
                                </Card>
                                <Descriptions layout="vertical" bordered size='small'>
                                    <Descriptions.Item label="Total de Ordens de Serviço Pagas" span={3}><Statistic value={totalServicosPay} precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} /></Descriptions.Item>
                                    <Descriptions.Item label="Total de Ordens de Serviço em Aberto" span={3}><Statistic value={totalServicosWait} precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} /></Descriptions.Item>
                                </Descriptions>
                            </>
                        )}
                    </>
                )}

                <Modal
                    visible={modalSearch}
                    onCancel={() => setModalSearch(false)}
                    title="Buscar Relatório"
                    footer={[
                        <Button key="back" icon='close' type='danger' onClick={() => setModalSearch(false)}>
                            Cancelar
                        </Button>,
                        <Button key="submit" icon='search' type="primary" loading={loading} onClick={() => finder()}>
                            Buscar
                    </Button>,
                    ]}
                >

                    <label>Selecione um tipo de busca:</label>
                    <Select value={find} style={{ width: '100%' }} onChange={(value) => setFind(value)}>
                        <Option value={1}>Prestação de Serviço do Mês Atual</Option>
                        <Option value={2}>Prestação de Serviço por Mês</Option>
                        <Option value={3}>Prestação de Serviço Anual</Option>
                        <Option value={4}>Prestação de Serviço do Mês Atual - Clientes</Option>
                        <Option value={5}>Prestação de Serviço por Mês - Clientes</Option>
                        <Option value={6}>Prestação de Serviço Anual - Clientes</Option>
                        <Option value={7}>Prestação de Serviço do Mês Atual - Vendedor</Option>
                        <Option value={8}>Prestação de Serviço por Mês - Vendedor</Option>
                        <Option value={9}>Prestação de Serviço Anual - Vendedor</Option>
                    </Select>

                    {find === 4 && (
                        <>
                            <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>SELECIONE O CLIENTE</Divider>
                            <TreeSelect
                                showSearch
                                style={{ width: '100%', marginBottom: 20 }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                value={clientName}
                                treeDefaultExpandAll
                                onChange={(value) => handleClient(value)}
                            >

                                {clients.map(client => (

                                    <TreeNode value={client.name} title={client.name} key={client._id} />

                                ))}

                            </TreeSelect>
                        </>
                    )}

                    {find === 5 && (
                        <>
                            <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>SELECIONE O CLIENTE</Divider>
                            <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                value={clientName}
                                treeDefaultExpandAll
                                onChange={(value) => handleClient(value)}
                            >

                                {clients.map(client => (

                                    <TreeNode value={client.name} title={client.name} key={client._id} />

                                ))}

                            </TreeSelect>
                        </>
                    )}

                    {find === 6 && (
                        <>
                            <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>SELECIONE O CLIENTE</Divider>
                            <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                value={clientName}
                                treeDefaultExpandAll
                                onChange={(value) => handleClient(value)}
                            >

                                {clients.map(client => (

                                    <TreeNode value={client.name} title={client.name} key={client._id} />

                                ))}

                            </TreeSelect>
                        </>
                    )}

                    {find === 7 && (
                        <>
                            <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>SELECIONE O VENDEDOR</Divider>
                            <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                value={vendedorName}
                                treeDefaultExpandAll
                                onChange={(value) => handleVendedor(value)}
                            >

                                {vendedor.map(vend => (

                                    <TreeNode value={vend.name} title={vend.name} key={vend._id} />

                                ))}

                            </TreeSelect>
                        </>
                    )}

                    {find === 8 && (
                        <>
                            <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>SELECIONE O VENDEDOR</Divider>
                            <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                value={vendedorName}
                                treeDefaultExpandAll
                                onChange={(value) => handleVendedor(value)}
                            >

                                {vendedor.map(vend => (

                                    <TreeNode value={vend.name} title={vend.name} key={vend._id} />

                                ))}

                            </TreeSelect>
                        </>
                    )}

                    {find === 9 && (
                        <>
                            <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>SELECIONE O VENDEDOR</Divider>
                            <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                value={vendedorName}
                                treeDefaultExpandAll
                                onChange={(value) => handleVendedor(value)}
                            >

                                {vendedor.map(vend => (

                                    <TreeNode value={vend.name} title={vend.name} key={vend._id} />

                                ))}

                            </TreeSelect>
                        </>
                    )}

                    {find === 2 && (
                        <>
                            <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>SELECIONE O MÊS</Divider>
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                <Select value={mes} style={{ width: 150, marginRight: 10 }} onChange={(e) => setMes(e)} placeholder='Mês'>
                                    <Option value='Janeiro'>Janeiro</Option>
                                    <Option value='Fevereiro'>Fevereiro</Option>
                                    <Option value='Março'>Março</Option>
                                    <Option value='Abril'>Abril</Option>
                                    <Option value='Maio'>Maio</Option>
                                    <Option value='Junho'>Junho</Option>
                                    <Option value='Julho'>Julho</Option>
                                    <Option value='Agosto'>Agosto</Option>
                                    <Option value='Setembro'>Setembro</Option>
                                    <Option value='Outubro'>Outubro</Option>
                                    <Option value='Novembro'>Novembro</Option>
                                    <Option value='Dezembro'>Dezembro</Option>
                                </Select>

                                <Select value={ano} style={{ width: 100 }} onChange={(e) => setAno(e)} placeholder='Ano'>
                                    <Option value={Ano - 1}>{Ano - 1}</Option>
                                    <Option value={Ano}>{Ano}</Option>
                                    <Option value={Ano + 1}>{Ano + 1}</Option>
                                    <Option value={Ano + 2}>{Ano + 2}</Option>
                                    <Option value={Ano + 3}>{Ano + 3}</Option>
                                </Select>

                            </div>
                        </>
                    )}

                    {find === 5 && (
                        <>
                            <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>SELECIONE O MÊS</Divider>
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                <Select value={mes} style={{ width: 150, marginRight: 10 }} onChange={(e) => setMes(e)} placeholder='Mês'>
                                    <Option value='Janeiro'>Janeiro</Option>
                                    <Option value='Fevereiro'>Fevereiro</Option>
                                    <Option value='Março'>Março</Option>
                                    <Option value='Abril'>Abril</Option>
                                    <Option value='Maio'>Maio</Option>
                                    <Option value='Junho'>Junho</Option>
                                    <Option value='Julho'>Julho</Option>
                                    <Option value='Agosto'>Agosto</Option>
                                    <Option value='Setembro'>Setembro</Option>
                                    <Option value='Outubro'>Outubro</Option>
                                    <Option value='Novembro'>Novembro</Option>
                                    <Option value='Dezembro'>Dezembro</Option>
                                </Select>

                                <Select value={ano} style={{ width: 100 }} onChange={(e) => setAno(e)} placeholder='Ano'>
                                    <Option value={Ano - 1}>{Ano - 1}</Option>
                                    <Option value={Ano}>{Ano}</Option>
                                    <Option value={Ano + 1}>{Ano + 1}</Option>
                                    <Option value={Ano + 2}>{Ano + 2}</Option>
                                    <Option value={Ano + 3}>{Ano + 3}</Option>
                                </Select>

                            </div>
                        </>
                    )}

                    {find === 8 && (
                        <>
                            <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>SELECIONE O MÊS</Divider>
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                <Select value={mes} style={{ width: 150, marginRight: 10 }} onChange={(e) => setMes(e)} placeholder='Mês'>
                                    <Option value='Janeiro'>Janeiro</Option>
                                    <Option value='Fevereiro'>Fevereiro</Option>
                                    <Option value='Março'>Março</Option>
                                    <Option value='Abril'>Abril</Option>
                                    <Option value='Maio'>Maio</Option>
                                    <Option value='Junho'>Junho</Option>
                                    <Option value='Julho'>Julho</Option>
                                    <Option value='Agosto'>Agosto</Option>
                                    <Option value='Setembro'>Setembro</Option>
                                    <Option value='Outubro'>Outubro</Option>
                                    <Option value='Novembro'>Novembro</Option>
                                    <Option value='Dezembro'>Dezembro</Option>
                                </Select>

                                <Select value={ano} style={{ width: 100 }} onChange={(e) => setAno(e)} placeholder='Ano'>
                                    <Option value={Ano - 1}>{Ano - 1}</Option>
                                    <Option value={Ano}>{Ano}</Option>
                                    <Option value={Ano + 1}>{Ano + 1}</Option>
                                    <Option value={Ano + 2}>{Ano + 2}</Option>
                                    <Option value={Ano + 3}>{Ano + 3}</Option>
                                </Select>

                            </div>
                        </>
                    )}

                    {find === 3 && (
                        <>
                            <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>SELECIONE O ANO</Divider>
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Select value={ano} style={{ width: 100 }} onChange={(e) => setAno(e)} placeholder='Ano'>
                                    <Option value={Ano - 1}>{Ano - 1}</Option>
                                    <Option value={Ano}>{Ano}</Option>
                                    <Option value={Ano + 1}>{Ano + 1}</Option>
                                    <Option value={Ano + 2}>{Ano + 2}</Option>
                                    <Option value={Ano + 3}>{Ano + 3}</Option>
                                </Select>
                            </div>
                        </>
                    )}
                    {find === 6 && (
                        <>
                            <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>SELECIONE O ANO</Divider>
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Select value={ano} style={{ width: 100 }} onChange={(e) => setAno(e)} placeholder='Ano'>
                                    <Option value={Ano - 1}>{Ano - 1}</Option>
                                    <Option value={Ano}>{Ano}</Option>
                                    <Option value={Ano + 1}>{Ano + 1}</Option>
                                    <Option value={Ano + 2}>{Ano + 2}</Option>
                                    <Option value={Ano + 3}>{Ano + 3}</Option>
                                </Select>
                            </div>
                        </>
                    )}
                    {find === 9 && (
                        <>
                            <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>SELECIONE O ANO</Divider>
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Select value={ano} style={{ width: 100 }} onChange={(e) => setAno(e)} placeholder='Ano'>
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

                <Drawer
                    title="Serviços"
                    width={'80%'}
                    closable={true}
                    onClose={() => setDrawerProducts(false)}
                    visible={drawerProducts}
                    placement='left'
                >

                    {!!servicos.length && (
                        <>

                            <Card size='small' style={{ backgroundColor: '#001529', marginBottom: 10 }} bordered={false}>
                                <Row>
                                    <Icon type='tool' style={{ fontSize: 20, color: '#fff', marginRight: 15 }} />
                                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>SERVIÇOS</span>
                                </Row>
                            </Card>

                            <Table pagination={{ pageSize: 10 }} columns={columnsService} dataSource={servicos} size='small' rowKey={(prod) => prod._id} />

                        </>
                    )}

                </Drawer>

            </Spin>

        </>
    )
}