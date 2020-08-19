import React, { useState, useEffect } from 'react';
import { Button, Spin, Modal } from 'antd';
import api from '../../../config/axios';

export default function GerarTodas() {

    const [spinner, setSpinner] = useState(false);
    const [products, setProducts] = useState([]);

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

    async function findProducts() {
        setSpinner(true);
        await api.get('/stock/findProdutosByCode').then(response => {
            setProducts(response.data.produtos);
            setSpinner(false);
        }).catch(error => {
            erro('Erro', error.message);
            setSpinner(false);
        });
    }

    useEffect(() => {
        findProducts();
    }, []);

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
                  ${products.map(prod => {
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

    return (
        <Spin spinning={spinner} size='large'>
            <Button
                size='large'
                type='primary'
                icon='tags'
                onClick={() => printer()}
            >
                Gerar etiquetas
      </Button>
        </Spin>
    )
}