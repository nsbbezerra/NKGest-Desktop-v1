import React, { useState, useEffect } from 'react';
import { Button, Table, Drawer, Card, Row, Statistic, Spin, Descriptions, Tooltip, Modal, Icon } from 'antd';
import api from '../../../config/axios';

export default function RelatorioPlanodeContas() {

  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [gerado, setGerado] = useState([]);
  const [relatorioMensal, setRelatorioMensal] = useState({});
  const [drawerInfo, setDrawerInfo] = useState(false);
  const [modalSearch, setModalSearch] = useState(false);
  const [balanceteId, setBalanceteId] = useState('');
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

  function success(title, message) {
    Modal.success({
      title: title,
      content: (
        <div>
          <p>{message}</p>
        </div>
      ),
      onOk() { },
    });
  }

  async function findMesGerado() {
    setSpinner(true);
    await api.get('/balancete/list').then(response => {
      setGerado(response.data.balanco);
      setSpinner(false);
    }).catch(error => {
      erro('Erro', error.message);
      setSpinner(false);
    });
  }

  useEffect(() => {

    findMesGerado();
    findDados();

  }, []);

  async function delBalancete() {
    setLoading(true);
    await api.delete(`/balancete/del/${balanceteId}`).then(response => {
      success('Sucesso', response.data.message);
      setLoading(false);
      setModalSearch(false);
      findMesGerado();
    }).catch(error => {
      erro('Erro', error.response.data.message);
      setLoading(false);
    });
  }

  async function findDados() {
    await api.get('/organization/find').then(response => {
      setDados(response.data.empresa);
    }).catch(error => {
      erro('Erro', error.message);
    });
  }

  async function handleBalancete(id) {
    const result = await gerado.find(obj => obj._id === id);
    await setRelatorioMensal(result);
    setDrawerInfo(true);
  }

  function handleDelBalancete(id) {
    setBalanceteId(id);
    setModalSearch(true);
  }

  function printer() {
    var mywindow = window.open('', 'Print', `height=${window.screen.height}, width=${window.screen.width}`, 'fullscreen=yes');
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
        
              <h2>RELATÓRIO FINANCEIRO DO MES DE: ${relatorioMensal.month} DE ${relatorioMensal.year}</h2>
        
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
                    ${relatorioMensal.receives.map(rec => {
      return `<tr>
                        <td class="desc2">${rec.description}</td>
                        <td class="price2">R$ ${rec.value}</td>
                      </tr>`
    }).join('')}
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
                 ${relatorioMensal.withdraw.map(wit => {
      return `<tr>
                    <td class="desc2">${wit.description}</td>
                    <td class="price2">R$ ${wit.value}</td>
                  </tr>`
    }).join('')}
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
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
      width: '80%'
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value',
      align: 'right',
      render: (valor) => <Statistic precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} value={valor} />
    }
  ];

  const columnsBalancetes = [
    {
      title: 'Descrição',
      dataIndex: 'title',
      key: 'title',
      width: '25%'
    },
    {
      title: 'Salto Anterior',
      dataIndex: 'saldoAnterior',
      key: 'saldoAnterior',
      align: 'right',
      render: (valor) => <Statistic precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} value={valor} />,
      width: '13%'
    },
    {
      title: 'Entradas',
      dataIndex: 'entradas',
      key: 'entradas',
      align: 'right',
      render: (valor) => <Statistic precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} value={valor} />,
      width: '13%'
    },
    {
      title: 'Saídas',
      dataIndex: 'saidas',
      key: 'saidas',
      align: 'right',
      render: (valor) => <Statistic precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} value={valor} />,
      width: '13%'
    },
    {
      title: 'Saldo Atual',
      dataIndex: 'saldoAtual',
      key: 'saldoAtual',
      align: 'right',
      render: (valor) => <Statistic precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} value={valor} />,
      width: '13%'
    },
    {
      title: 'Data de Fechamento',
      dataIndex: 'dataFechamento',
      key: 'dataFechamento',
      align: 'center'
    },
    {
      title: 'Ações',
      dataIndex: '_id',
      key: '_id',
      align: 'center',
      render: (id) => <>
        <Tooltip placement='top' title='Visualizar Balancete'>
          <Button shape='circle' icon='search' type='default' size='small' style={{ marginRight: 5 }} onClick={() => handleBalancete(id)} />
        </Tooltip>
        <Tooltip placement='top' title='Excluir'>
          <Button shape='circle' icon='close' type='danger' size='small' onClick={() => handleDelBalancete(id)} />
        </Tooltip>
      </>
    },
  ];

  return (

    <div style={{ height: '100%' }}>

      <Spin spinning={spinner} size='large'>

        <Table columns={columnsBalancetes} dataSource={gerado} size='small' rowKey={(ent) => ent._id} />

        <Drawer
          title="Balancete Mensal"
          width={'80%'}
          closable={true}
          onClose={() => setDrawerInfo(false)}
          visible={drawerInfo}
          placement='left'
        >

          <div style={{ overflow: 'hidden' }}>

            <div style={{ marginBottom: 10, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

              <Card size='small'>

                {relatorioMensal && (
                  <p style={{ marginBottom: -3, marginTop: -1 }}>Data do Fechamento: <strong>{relatorioMensal.dataFechamento}</strong></p>
                )}

              </Card>

              <Row>

                <Button icon='printer' type='primary' style={{ marginRight: 10 }} onClick={() => printer()}>Imprimir Relatório</Button>

              </Row>

            </div>

            <Card size='small' style={{ backgroundColor: '#001529', marginBottom: 10 }} bordered={false}>
              <Row>
                <Icon type='rise' style={{ fontSize: 20, color: '#fff', marginRight: 15 }} />
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>RECEITAS</span>
              </Row>
            </Card>

            <Table columns={columns} dataSource={relatorioMensal.receives} size='small' rowKey={(ent) => ent.id} />

            <Card size='small' style={{ backgroundColor: '#001529', marginBottom: 10 }} bordered={false}>
              <Row>
                <Icon type='fall' style={{ fontSize: 20, color: '#fff', marginRight: 15 }} />
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>DESPESAS</span>
              </Row>
            </Card>

            <Table columns={columns} dataSource={relatorioMensal.withdraw} size='small' rowKey={(ent) => ent.id} />

            <Card size='small' style={{ backgroundColor: '#001529', marginBottom: 10 }} bordered={false}>
              <Row>
                <Icon type='line-chart' style={{ fontSize: 20, color: '#fff', marginRight: 15 }} />
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>RESUMO</span>
              </Row>
            </Card>

            {relatorioMensal && (
              <Descriptions bordered size='small'>
                <Descriptions.Item span={3} label='SALDO ANTERIOR'><Statistic precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} value={relatorioMensal.saldoAnterior} /></Descriptions.Item>
                <Descriptions.Item span={3} label='TOTAL DAS ENTRADAS'><Statistic precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} value={relatorioMensal.entradas} /></Descriptions.Item>
                <Descriptions.Item span={3} label='TOTAL DAS SAÍDAS'><Statistic precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} value={relatorioMensal.saidas} /></Descriptions.Item>
                <Descriptions.Item span={3} label='SALDO ATUAL'><Statistic precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} value={relatorioMensal.saldoAtual} /></Descriptions.Item>
              </Descriptions>
            )}

          </div>

        </Drawer>

        <Modal
          visible={modalSearch}
          onCancel={() => setModalSearch(false)}
          title="Excluir Balancete"
          footer={[
            <Button key="back" icon='close' type='danger' onClick={() => setModalSearch(false)}>
              Não
                        </Button>,
            <Button key="submit" icon='check' type="primary" loading={loading} onClick={() => delBalancete()}>
              Sim
                    </Button>,
          ]}
        >

          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            <Icon type='exclamation-circle' style={{ fontSize: 100 }} />

          </div>

          <p style={{ width: '100%', textAlign: 'center', fontSize: 40, color: '#444', fontWeight: 'bold' }}>ATENÇÃO</p>

          <p style={{ width: '100%', textAlign: 'center', marginTop: 10, color: '#f44336', fontWeight: 'bold' }}>Você está prestes a excluir um balancete financeiro, esta ação irá excluir todo o relatório referente a este período, isto pode causar uma desordem nos relatórios financeiros, mas, você pode gerar este balancete novamente na seção: GERAR BALANCETE MENSAL, no canto esquerdo da sua tela, deseja continuar?</p>

        </Modal>

      </Spin>

    </div>
  )
}