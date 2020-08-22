import React, { useState, useEffect } from 'react';
import { Icon, Table, Button, Card, Descriptions, Select, notification, Modal, Statistic } from 'antd';
import api from '../../../config/axios';

const { Option } = Select;

export default function RelatorioProdutos() {

    const [loading, setLoading] = useState(false);
    const [modalSearch, setModalSearch] = useState(false);
    const [produtos, setProdutos] = useState([]);
    const [find, setFind] = useState(null);
    const [totalActive, setTotalActive] = useState(null);
    const [totalBlock, setTotalBlock] = useState(null);
    const [totalProdutos, setTotalProdutos] = useState(null);
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

    useEffect(() => {
        findDados();
    }, [])

    async function finder() {
        if (find === null) {
            warning('Atenção', 'Selecione uma opção de busca');
            return false;
        }
        setLoading(true);
        await api.post('/report/listProducts', {
            find: find
        }).then(response => {
            setProdutos(response.data.products);
            setTotalActive(response.data.totalActive);
            setTotalBlock(response.data.totalBlock);
            setTotalProdutos(response.data.totalProducts);
            setLoading(false);
            setModalSearch(false);
            setButtonPrint(false);
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoading(false);
        });
    }

    function printer() {
        var mywindow = window.open('', 'Print', `height=${window.screen.height}, width=${window.screen.width}`, 'fullscreen=yes');
        mywindow.document.write(`
        <!DOCTYPE html>
        <html>
        
        <head>
            <title>Imprimir Relatório de Produtos</title>
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
        
                .active,
                .active2 {
                    width: 8%;
                    text-align: center;
                }
        
                .phone,
                .cel,
                .phone2,
                .cel2 {
                    width: 9%;
                    text-align: center;
                }
        
                .name,
                .name2 {
                    width: 60%;
                }
        
                .uni,
                .uni2 {
                    width: 5%;
                    text-align: center;
                }
        
                .estoque,
                .estoque2 {
                    width: 10%;
                    text-align: center;
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
        
                    <h2>RELATÓRIO DE PRODUTOS</h2>
        
                    <table class="table-product" cellspacing='0'>
                        <thead>
                            <tr>
                                <td class="name">PRODUTO</td>
                                <td class="uni">UNI</td>
                                <td class="estoque">ESTOQUE</td>
                                <td class="price">PREÇO</td>
                                <td class="active">ATIVO?</td>
                            </tr>
                        </thead>
                        <tbody>
                            ${produtos.map(prod => {
            return `<tr>
                                <td class="name2">${prod.name}</td>
                                <td class="uni2">${prod.unMedida}</td>
                                <td class="estoque2">${prod.estoqueAct}</td>
                                <td class="price2">R$ ${prod.valueSale}</td>
                                ${prod.active ? (`<td class="active2">Sim</td>`) : (`<td class="active2">Não</td>`)}
                            </tr>`
        }).join('')}
                        </tbody>
                    </table>
        
                    <table class="table-resume">
        
                        <thead>
                            <tr>
                                <td class="valueslast">TOTAL DOS PRODUTOS</td>
                                <td class="moneylast">${totalProdutos}</td>
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
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            width: '30%'
        },
        {
            title: 'Fornecedor',
            dataIndex: 'fornecedor.name',
            key: 'fornecedor.name',
            width: '30%'
        },
        {
            title: 'Código Universal',
            dataIndex: 'codeUniversal',
            key: 'codeUniversal',
        },
        {
            title: 'Valor de Venda',
            dataIndex: 'valueSale',
            key: 'valueSale',
            render: (valor) => <Statistic prefix='R$' precision={2} valueStyle={{ fontSize: 15.5 }} value={valor} />,
            align: 'right'
        },
        {
            title: 'Estoque',
            dataIndex: 'estoqueAct',
            key: 'estoqueAct',
            align: 'center',
            width: '7%'
        },
        {
            title: 'Ativo?',
            dataIndex: 'active',
            key: 'active',
            render: (act) => <>
                {act === true && (
                    <Icon type='check' style={{ color: '#4caf50', fontWeight: 'bold', fontSize: 17 }} />
                )}
                {act === false && (
                    <Icon type='stop' style={{ color: '#f44336', fontWeight: 'bold', fontSize: 17 }} />
                )}
            </>,
            align: 'center',
            width: '7%'
        }
    ];

    return (
        <>

            <div style={{ marginBottom: 10, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                <Card size='small'>

                    {find === null && (
                        <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>-</strong></p>
                    )}
                    {find === 1 && (
                        <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>Produtos Ativos</strong></p>
                    )}
                    {find === 2 && (
                        <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>Produtos Bloqueados</strong></p>
                    )}
                    {find === 3 && (
                        <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>Baixo Estoque</strong></p>
                    )}
                    {find === 4 && (
                        <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>Todos os Produtos</strong></p>
                    )}

                </Card>

                <div style={{ display: 'flex', flexDirection: 'row' }}>

                    <Button icon='printer' type='default' style={{ marginRight: 10 }} disabled={buttonPrint} onClick={() => printer()}>Imprimir Relatório</Button>

                    <Button icon='search' type='primary' onClick={() => setModalSearch(true)}>Busca Avançada</Button>

                </div>

            </div>

            <Table pagination={{ pageSize: 10 }} columns={columns} dataSource={produtos} size='small' style={{ marginTop: 15, marginBottom: 15 }} rowKey={(cli) => cli._id} />

            {totalProdutos && (
                <Descriptions layout="vertical" bordered size='small'>
                    <Descriptions.Item label="Produtos Ativos" span={3}>{totalActive}</Descriptions.Item>
                    <Descriptions.Item label="Produtos Bloqueados" span={3}>{totalBlock}</Descriptions.Item>
                    <Descriptions.Item label="Total de Produtos" span={3}>{totalProdutos}</Descriptions.Item>
                </Descriptions>
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
                    <Option value={1}>Produtos Ativos</Option>
                    <Option value={2}>Produtos Bloqueados</Option>
                    <Option value={3}>Baixo Estoque</Option>
                    <Option value={4}>Todos os Produtos</Option>
                </Select>

            </Modal>

        </>
    )
}