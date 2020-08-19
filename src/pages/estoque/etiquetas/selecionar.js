import React, { useState, useEffect } from 'react';
import { Button, Table, Divider, Popconfirm, Statistic, Spin, Icon, Tooltip, Modal, Card, Row, Col, Input } from 'antd';
import api from '../../../config/axios';
import shortId from 'shortid';

export default function SelecionarImprimir() {

  const [products, setProducts] = useState([]);
  const [produtcPrint, setProductPrint] = useState([]);
  const [finderProduct, setFinderProduct] = useState('');
  const [productsHandle, setProductsHandle] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [modalHandleProducts, setModalHandleProducts] = useState(false);
  const [quantity, setQuantity] = useState(1);

  let arrayproduct = new Array();

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

  async function findProducts() {
    setSpinner(true)
    await api.get('/stock/findProdutosByCode').then(response => {
      setProducts(response.data.produtos)
      setSpinner(false);
    }).catch(error => {
      erro('Erro', error.response.data.message);
      setSpinner(false);
    });
  }

  useEffect(() => {
    findProducts();
  }, []);

  async function delItem(id) {
    const dataSource = await [...produtcPrint];
    setProductPrint(dataSource.filter(item => item._id !== id));
  }

  function handlePrint() {
    if (!produtcPrint.length) {
      warning('Atenção', 'Selecione os Produtos para impressão das etiquetas');
      return false;
    }
    printer();
  }

  function printer() {
    var mywindow = window.open('', 'Print', `height=${window.screen.height}, width=${window.screen.width}`, 'fullscreen=yes');
    mywindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Imprimir Etiquetas</title>
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
    
            .page-break {
                display: none;
            }
    
            .tickets-container {
                width: 100%;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: space-between;
            }
    
            .ticket {
                width: 25%;
                border: 1px dotted #999;
                padding: 5px;
                height: 29.05mm;
                text-align: center;
                margin-bottom: 10px;
            }
    
            .ticket-header {
                padding: 3px;
                height: 27px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                border-bottom: 1px solid #000;
            }
    
            .row-ticket {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                margin-top: 4px;
            }
    
            .left-ticket {
                width: 60%;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                position: relative;
            }
    
            .right-ticket {
                width: 40%;
                height: 100%;
                display: flex;
                justify-content: space-around;
                flex-direction: column;
                align-items: center;
                height: 100%;
                position: relative;
            }
    
            .ticket-header h6 {
                font-size: 9px;
            }
    
            .content-ticket {
                display: flex;
                width: 100%;
                flex-direction: row;
                justify-content: space-around;
                align-items: center;
            }
    
            .content-ticket p {
                font-size: 13px;
            }
    
            .content-price {
                width: 100%;
                text-align: center;
                border: 1px solid #000;
                padding: 2px;
                margin-top: 6px;
            }
    
            .content-price p {
                font-weight: bolder;
                font-size: 11px;
            }
    
            .barcode-img {
              height: 50px;
              width: 90%;
            }
    
            .right-ticket h4 {
                font-size: 15px;
                margin-top: 7px;
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
    
                .page {
                    visibility: hidden;
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    min-height: 100mm;
                }
    
                .content {
                    display: block;
                    visibility: visible;
                    position: relative;
                    width: 100%;
                }
    
                .page-break {
                    display: block;
                    page-break-after: always;
                    break-inside: avoid;
                    color: transparent;
                }
    
                .left-ticket {
                    width: 60%;
                }
    
                .right-ticket {
                    width: 40%;
                }
    
                .content-ticket p {
                    font-size: 9px;
                }
    
                .ticket-header h6 {
                    font-size: 7px;
                }
    
                .barcode-img {
                    height: 50px;
                    width: 90%;
                }
    
                .content-price {
                    padding: 2px;
                }
    
                .right-ticket h4 {
                    font-size: 10px;
                }
    
                .content-price p {
                    font-weight: bolder;
                    font-size: 8px;
                }
    
                .btn-print {
                    display: none;
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
    
                <div class="tickets-container">
                  ${produtcPrint.map(prod => {
      return `
                    <div class="ticket">
                        <div class="ticket-header">
                            <h6>${prod.codiname}</h6>
                        </div>
                        <div class="row-ticket">
                            <div class="left-ticket">
                                <div class="barcode">
                                  ${prod.codeUniversal === 'SEM GTIN' ? (
          `<img class="barcode-img"
                                    src="http://bwipjs-api.metafloor.com/?bcid=code128&text=${prod.code}"
                                    alt="código de barras" />`
        ) : (
            `<img class="barcode-img"
                                    src="http://bwipjs-api.metafloor.com/?bcid=code128&text=${prod.codeUniversal}"
                                    alt="código de barras" />`
          )}
                                </div>
                            </div>
                            <div class="right-ticket">
                                <div class="content-ticket">
                                    <p>Unidade:</p>
                                    <p><strong>${prod.unMedida}</strong></p>
                                </div>
                                <div class="content-price">
                                    <p>PREÇO</p>
                                </div>
                                <h4>R$ ${prod.valueSale.toFixed(2)}</h4>
                            </div>
                        </div>
                    </div>
                    `
    }).join('')}
   
                </div>
    
            </div>
    
        </div>
    
    </body>
    
    </html>
        `);
  }

  useEffect(() => {
    finderProductsBySource(finderProduct);
  }, [finderProduct]);

  async function finderProductsBySource(text) {
    if (text === '') {
      await setProductsHandle([]);
    } else {
      let filtro = await products.filter(val => val.codiname.includes(text));
      await setProductsHandle(filtro);
    }
  }

  async function handleFinish() {
    await setProductPrint(arrayproduct);
    setModalHandleProducts(false);
  }

  async function handleGenerate(id) {
    const result = await products.find(obj => obj._id === id);
    for (let index = 0; index < quantity; index++) {
      let info = await { _id: shortId.generate(), name: result.codiname, codeUniversal: result.codeUniversal, valueSale: result.valueSale, code: result.code, codiname: result.codiname, unMedida: result.unMedida };
      arrayproduct.push(info);
    }
    success('Sucesso', 'Adicionado com sucesso');
  }

  async function clearAll() {
    await setProductPrint([]);
    arrayproduct = [];
    success('Sucesso', 'Limpo com sucesso');
  }

  const columns = [
    {
      title: 'Produto',
      dataIndex: 'name',
      key: 'name',
      width: '40%'
    },
    {
      title: 'Código',
      dataIndex: 'code',
      key: 'code',
      width: '15%'
    },
    {
      title: 'Cód. Barras',
      dataIndex: 'codeUniversal',
      key: 'codeUniversal',
      width: '15%'
    },
    {
      title: 'Preço',
      dataIndex: 'valueSale',
      key: 'valueSale',
      render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15.5 }} prefix='R$' precision={2} />,
      width: '15%',
      align: 'right'
    },
    {
      title: 'Ações',
      dataIndex: '_id',
      key: '_id',
      render: (id) => <>
        <Popconfirm title='Deseja remover este item?' okText='Sim' cancelText='Não' onConfirm={() => delItem(id)}>
          <Icon type='close' style={{ color: 'red' }} />
        </Popconfirm>
      </>,
      width: '7%',
      align: 'center'
    }
  ];

  const columnsProductsHandle = [
    {
      title: 'Nome',
      dataIndex: 'codiname',
      key: 'codiname',
      width: '40%',
      ellipsis: true
    },
    {
      title: 'Código',
      dataIndex: 'code',
      key: 'code',
      align: 'center',
      width: '15%'
    },
    {
      title: 'Cód. Barras',
      dataIndex: 'codeUniversal',
      key: 'codeUniversal',
      width: '15%'
    },
    {
      title: 'Ações',
      dataIndex: '_id',
      key: '_id',
      render: (id) => <>
        <Tooltip placement='left' title='Gerar Etiquetas'>
          <Button shape="circle" icon="plus" type='primary' size='small' onClick={() => handleGenerate(id)} />
        </Tooltip>
      </>,
      width: '8%',
      align: 'center',
    }
  ];

  return (
    <>
      <Spin spinning={spinner} size='large'>

        <Table columns={columns} dataSource={produtcPrint} size='small' style={{ marginTop: 10 }} rowKey={(prod) => prod._id} />

        <div style={{ width: '100%' }}>
          <Divider />
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>

            <Button type="default" icon="search" size='large' style={{ marginRight: 15 }} onClick={() => setModalHandleProducts(true)}>
              Buscar Produtos
            </Button>

            <Button type="danger" icon="close" size='large' style={{ marginRight: 15 }} onClick={() => clearAll()}>
              Limpar Tudo
            </Button>

            <Button type="primary" icon="printer" size='large' onClick={() => handlePrint()}>
              Imprimir Etiquetas
            </Button>
          </div>
        </div>
      </Spin>

      <Modal
        visible={modalHandleProducts}
        title="Produtos"
        closable={false}
        width='97%'
        bodyStyle={{ padding: 15, height: '75vh', overflow: 'auto' }}
        centered
        footer={[
          <Button key='cancel' icon='close' type="danger" onClick={() => setModalHandleProducts(false)}>
            Cancelar
          </Button>,
          <Button type="primary" icon='check' style={{ marginRight: 15 }} onClick={() => handleFinish()}>
            Finalizar
        </Button>
        ]}
      >
        <Card size='small' bodyStyle={{ padding: 10 }} style={{ borderRadius: 5 }}>
          <Row gutter={8}>

            <Col span={6}>

              <label>Quantidade</label>
              <Input type='number' value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />

            </Col>

            <Col span={18}>

              <label>Digite para Buscar o Produto</label>
              <Input value={finderProduct} onChange={(e) => setFinderProduct(e.target.value.toUpperCase())} />

            </Col>

          </Row>
        </Card>

        <Table pagination={{ pageSize: 7 }} columns={columnsProductsHandle} dataSource={productsHandle} size='small' rowKey={(prod) => prod._id} rowClassName={(record) => record.estoqueAct <= 5 ? 'red-row' : ''} style={{ marginTop: 10 }} />

      </Modal>
    </>
  );
}