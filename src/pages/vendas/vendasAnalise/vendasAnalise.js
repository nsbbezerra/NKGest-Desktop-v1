import React, { useState, useEffect } from 'react';
import { Button, Table, Tooltip, Modal, Spin, notification, Statistic } from 'antd';
import api from '../../../config/axios';

export default function VendasAnalise() {

    const [spinner, setSpinner] = useState(false);
    const [sales, setSales] = useState([]);

    function openNotificationWithIcon(type, title, message) {
        notification[type]({
            message: title,
            description: message,
        });
    };

    async function finder() {
        const idVend = await sessionStorage.getItem('id');
        setSpinner(true);
        await api.post('/orders/listSalesWaiting', {
            func: idVend
        }).then(response => {
            setSales(response.data.sales);
            setSpinner(false);
        }).catch(error => {
            openNotificationWithIcon('error', 'Erro', error.message);
            setSpinner(false);
        });
    }

    useEffect(() => {

        finder();

    }, []);

    async function findStatus(id) {
        setSpinner(true);
        await api.post('/orders/findStatusSale', {
            idOrder: id._id
        }).then(response => {
            if(response.data.sale.waiting === 'yes') {
                warning();
            }
            if(response.data.sale.waiting === 'cancel') {
                erro();
            }
            if(response.data.sale.waiting === 'none') {
                sucesso();
            }
            setSpinner(false);
        }).catch(error => {
            openNotificationWithIcon('error', 'Erro', error.response.data.message);
            setSpinner(false);
        });
    }

    function warning() {
        Modal.warning({
            title: 'ATENÇÃO',
            content: 'Esta venda ainda está em análise'
        });
    }

    function erro() {
        Modal.error({
            title: 'NÃO AUTORIZADA',
            content: 'Esta venda não foi autorizada'
        });
    }

    function sucesso() {
        Modal.success({
            title: 'AUTORIZADA',
            content: 'Esta venda foi autorizada'
        });
    }

    const columns = [
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
            title: 'Valor',
            dataIndex: 'valueLiquido',
            key: 'valueLiquido',
            render: (valor) => <Statistic value={valor} precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} />,
            width: '20%',
            align: 'center'
        },
        {
            title: 'Status da Venda',
            dataIndex: 'waiting',
            key: 'waiting',
            render: (value, id) => <>
                {value === 'yes' && (
                    <Tooltip placement='top' title='Visualizar Status'>
                        <Button type='link' size='small' style={{ width: '100%', backgroundColor: '#ffeb3b', color: '#444', fontWeight: 'bold' }} onClick={() => findStatus(id)}>Aguardando</Button>
                    </Tooltip>
                )}
                {value === 'no' && (
                    <Tooltip placement='top' title='Visualizar Status'>
                        <Button type='link' size='small' style={{ width: '100%', backgroundColor: '#f44336', color: '#fff', fontWeight: 'bold' }} onClick={() => findStatus(id)}>Reprovado</Button>
                    </Tooltip>
                )}
                {value === 'none' && (
                    <Tooltip placement='top' title='Visualizar Status'>
                        <Button type='link' size='small' style={{ width: '100%', backgroundColor: '#4caf50', color: '#fff', fontWeight: 'bold' }} onClick={() => findStatus(id)}>Aprovado</Button>
                    </Tooltip>
                )}
            </>,
            width: '15%',
            align: 'center'
        }
    ];

    return (

        <div style={{ marginTop: 15 }}>

            <Spin spinning={spinner} size='large'>

                <Table pagination={{ pageSize: 10 }} columns={columns} dataSource={sales} size='small' rowKey={(vend) => vend._id} />

            </Spin>

        </div>

    )
}