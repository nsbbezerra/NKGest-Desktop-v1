import React, { useState, useEffect } from 'react';
import { Icon, Button, Table, Tooltip, Modal, Spin, notification, Statistic, TreeSelect, Tabs, Drawer, Divider, Descriptions, Radio } from 'antd';
import api from '../../../config/axios';
import { Link } from 'react-router-dom';
import { Header } from '../../../styles/styles';

const { TreeNode } = TreeSelect;
const { TabPane } = Tabs;

export default function VendasAnalise() {

    const [spinner, setSpinner] = useState(false);
    const [sales, setSales] = useState([]);
    const [orders, setOrders] = useState([]);
    const [vendedor, setVendedor] = useState([]);
    const [modalSearch, setModalSearch] = useState(false);
    const [vendedorId, setVendedorId] = useState('');
    const [vendedorName, setVendedorName] = useState('');
    const [loading, setLoading] = useState(false);
    const [paymentsOrders, setPaymentOrders] = useState([]);
    const [paymentSale, setPaymentSale] = useState([]);
    const [drawerInfo, setDrawerInfo] = useState(false);
    const [modalStatusPayment, setModalStatusPayment] = useState(false);
    const [modalStatusPaymentSale, setModalStatusPaymentSale] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [modalViewPaymentSale, setModalViewPaymentSale] = useState(false);
    const [modalViewPaymentOrder, setModalViewPaymentOrder] = useState(false);
    
    const [totalSales, setTotalSales] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [orderToUpdate, setOrderToUpdate] = useState(0);
    const [status, setStatus] = useState(null);

    const [pagamentosSale, setPagamentoSale] = useState([]);
    const [pagamentosOrder, setPagamentoOrder] = useState([]);

    function openNotificationWithIcon(type, title, message) {
        notification[type]({
            message: title,
            description: message,
        });
    };

    async function findVendedor() {
        setLoading(true)
        await api.get('/admin/findFuncionariosComissioned').then(response => {
            setVendedor(response.data.funcionarios)
            setLoading(false);
        }).catch(error => {
            openNotificationWithIcon('error', 'Erro', error.message);
            setLoading(false);
        });
    }

    async function finderSales() {
        if(vendedorId === '') {
            openNotificationWithIcon('warning', 'Atenção', 'Selecione uma opção de busca');
            return false;
        }
        setLoading(true);
        await api.post('/orders/listSalesWaiting', {
            func: vendedorId
        }).then(response => {
            setSales(response.data.sales);
            setLoading(false);
            setModalSearch(false);
        }).catch(error => {
            openNotificationWithIcon('error', 'Erro', error.message);
            setLoading(false);
        });
    }

    async function finderOrders() {
        if(vendedorId === '') {
            openNotificationWithIcon('warning', 'Atenção', 'Selecione uma opção de busca');
            return false;
        }
        setSpinner(true);
        await api.post('/orders/listOrdersWaiting', {
            func: vendedorId
        }).then(response => {
            setOrders(response.data.sales);
            setSpinner(false);
            setModalSearch(false);
        }).catch(error => {
            openNotificationWithIcon('error', 'Erro', error.message);
            setSpinner(false);
        });
    }

    function finder() {
        finderOrders();
        finderSales();
    }

    useEffect(() => {

        findVendedor();

    }, []);

    async function changeStatusOrder(id) {
        await setOrderToUpdate(id._id);
        await setStatus(id.waiting);
        setModalStatusPayment(true);
    }

    async function changeStatusSale(id) {
        await setOrderToUpdate(id._id);
        await setStatus(id.waiting);
        setModalStatusPaymentSale(true);
    }

    async function handleVendedor(value) {
        const result = await vendedor.find(obj => obj.name === value);
        await setVendedorId(result._id);
        await setVendedorName(result.name);
    }

    async function findDebits(id) {
        setSpinner(true);
        await api.post('/report/findebits',{
            client: id
        }).then(response => {
            setPaymentOrders(response.data.servicos);
            setPaymentSale(response.data.produtos);
            setTotalSales(response.data.calcTotalProdutos);
            setTotalOrders(response.data.calcTotalServicos);
            setDrawerInfo(true);
            setSpinner(false);
        }).catch(error => {
            openNotificationWithIcon('error', 'Erro', error.response.data.message);
            setSpinner(false);
        });
    }

    async function sendUpdateStatusOrder() {
        setLoadingUpdate(true);
        await api.put(`/orders/changeStatusOrdensWaiting/${orderToUpdate}`,{
            statuSale: status
        }).then(response => {
            openNotificationWithIcon('success', 'Sucesso', response.data.message);
            setLoadingUpdate(false);
            setOrders([]);
            setSales([]);
            setModalStatusPayment(false);
        }).catch(error => {
            openNotificationWithIcon('error', 'Erro', error.response.data.message);
            setLoadingUpdate(false);
        });
    }

    async function sendUpdateStatusSale() {
        setLoadingUpdate(true);
        await api.put(`/orders/changeStatusSalesWaiting/${orderToUpdate}`,{
            statuSale: status
        }).then(response => {
            openNotificationWithIcon('success', 'Sucesso', response.data.message);
            setLoadingUpdate(false);
            setOrders([]);
            setSales([]);
            setModalStatusPayment(false);
        }).catch(error => {
            openNotificationWithIcon('error', 'Erro', error.response.data.message);
            setLoadingUpdate(false);
        });
    }

    async function findPaymentsSale(id) {
        setSpinner(true);
        await api.get(`/payments/findPaymentsById/${id._id}`).then(response => {
            setPagamentoSale(response.data.payments);
            setSpinner(false);
            setModalViewPaymentSale(true);
        }).catch(error => {
            openNotificationWithIcon('error', 'Erro', error.response.data.message);
            setSpinner(false);
        });
    }

    async function findPaymentsOrder(id) {
        setSpinner(true);
        await api.get(`/payments/findPaymentsOrdersById/${id._id}`).then(response => {
            setPagamentoOrder(response.data.payments);
            setSpinner(false);
            setModalViewPaymentOrder(true);
        }).catch(error => {
            openNotificationWithIcon('error', 'Erro', error.response.data.message);
            setSpinner(false);
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
                        <Button type='link' size='small' style={{ width: '100%', backgroundColor: '#ffeb3b', color: '#444', fontWeight: 'bold' }} onClick={() => changeStatusSale(id)}>Aguardando</Button>
                    </Tooltip>
                )}
                {value === 'no' && (
                    <Tooltip placement='top' title='Visualizar Status'>
                        <Button type='link' size='small' style={{ width: '100%', backgroundColor: '#f44336', color: '#fff', fontWeight: 'bold' }} onClick={() => changeStatusSale(id)}>Reprovado</Button>
                    </Tooltip>
                )}
                {value === 'none' && (
                    <Tooltip placement='top' title='Visualizar Status'>
                        <Button type='link' size='small' style={{ width: '100%', backgroundColor: '#4caf50', color: '#fff', fontWeight: 'bold' }} onClick={() => changeStatusSale(id)}>Aprovado</Button>
                    </Tooltip>
                )}
            </>,
            width: '15%',
            align: 'center'
        },
        {
            title: 'Ações',
            dataIndex: 'client._id',
            key: 'client._id',
            render: (id, order) => <>
                <Tooltip placement='top' title='Visualizar Débitos'>
                    <Button shape='circle' icon='fall' size='small' type='danger' style={{ marginRight: 5 }} onClick={() => findDebits(id)} />
                </Tooltip>
                <Tooltip placement='top' title='Formas de Pagamento'>
                    <Button shape='circle' icon='dollar' size='small' type='primary' onClick={() => findPaymentsSale(order)} />
                </Tooltip>
            </>,
            width: '6%',
            align: 'center'
        },
    ];

    const columnsOrders = [
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
                    <Tooltip placement='top' title='Alterar Status'>
                        <Button type='link' size='small' style={{ width: '100%', backgroundColor: '#ffeb3b', color: '#444', fontWeight: 'bold' }} onClick={() => changeStatusOrder(id)}>Aguardando</Button>
                    </Tooltip>
                )}
                {value === 'no' && (
                    <Tooltip placement='top' title='Alterar Status'>
                        <Button type='link' size='small' style={{ width: '100%', backgroundColor: '#f44336', color: '#fff', fontWeight: 'bold' }} onClick={() => changeStatusOrder(id)}>Reprovado</Button>
                    </Tooltip>
                )}
                {value === 'none' && (
                    <Tooltip placement='top' title='Alterar Status'>
                        <Button type='link' size='small' style={{ width: '100%', backgroundColor: '#4caf50', color: '#fff', fontWeight: 'bold' }} onClick={() => changeStatusOrder(id)}>Aprovado</Button>
                    </Tooltip>
                )}
            </>,
            width: '15%',
            align: 'center'
        },
        {
            title: 'Ações',
            dataIndex: 'client._id',
            key: 'client._id',
            render: (id, order) => <>
                <Tooltip placement='top' title='Visualizar Débitos'>
                    <Button shape='circle' icon='fall' size='small' type='danger' style={{marginRight: 5}} onClick={() => findDebits(id)} />
                </Tooltip>
                <Tooltip placement='top' title='Formas de Pagamento'>
                    <Button shape='circle' icon='dollar' size='small' type='primary' onClick={() => findPaymentsOrder(order)} />
                </Tooltip>
            </>,
            width: '6%',
            align: 'center'
        },
    ];

    const columnsPaySales = [
        {
            title: 'Cliente',
            dataIndex: 'cliente.name',
            key: 'cliente.name',
        },
        {
            title: 'Forma Pagamento',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value',
            render: (valor) => <Statistic value={valor} precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} />,
            width: '20%',
            align: 'center'
        },
        {
            title: 'Data Vencimento',
            dataIndex: 'datePay',
            key: 'datePay',
            align: 'center',
            width: '15%'
        },
    ];

    const columnsPayOrders = [
        {
            title: 'Cliente',
            dataIndex: 'cliente.name',
            key: 'cliente.name',
        },
        {
            title: 'Forma Pagamento',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value',
            render: (valor) => <Statistic value={valor} precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} />,
            width: '20%',
            align: 'center'
        },
        {
            title: 'Data Vencimento',
            dataIndex: 'datePay',
            key: 'datePay',
            align: 'center',
            width: '15%'
        },
    ];

    const columnsPaymentSale = [
        {
            title: 'Cliente',
            dataIndex: 'cliente.name',
            key: 'cliente.name',
        },
        {
            title: 'Forma Pagamento',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Data Vencimento',
            dataIndex: 'datePay',
            key: 'datePay',
            align: 'center',
            width: '15%'
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value',
            render: (value) => <Statistic value={value} precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} />,
            align: 'right',
            width: '15%'
        }
    ];

    const columnsPaymentOrder = [
        {
            title: 'Cliente',
            dataIndex: 'cliente.name',
            key: 'cliente.name',
        },
        {
            title: 'Forma Pagamento',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Data Vencimento',
            dataIndex: 'datePay',
            key: 'datePay',
            align: 'center',
            width: '15%'
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value',
            render: (value) => <Statistic value={value} precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} />,
            align: 'right',
            width: '15%'
        }
    ];

    return (
        <div style={{ height: '100%' }}>
            <Header>
                <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='file-search' style={{ fontSize: 20 }} /> VENDAS EM ANALISE</p>
                <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
            </Header>

            <Button type='primary' icon='search' style={{ position: 'absolute', right: 0, top: 40, zIndex: 200 }} onClick={() => setModalSearch(true)}>Busca Avançada</Button>

            <Spin spinning={spinner} size='large'>

                <Tabs defaultActiveKey="1" type='card' style={{ marginTop: 15 }}>

                    <TabPane tab={
                        <span>
                            <Icon type="shopping" />
                            Vendas
                            </span>
                    } key="1">

                        <Table pagination={{ pageSize: 10 }} columns={columns} dataSource={sales} size='small' rowKey={(vend) => vend._id} />

                    </TabPane>

                    <TabPane tab={
                        <span>
                            <Icon type="file-sync" />
                            Ordens de Serviço
                            </span>
                    } key="2">

                        <Table pagination={{ pageSize: 10 }} columns={columnsOrders} dataSource={orders} size='small' rowKey={(vend) => vend._id} />

                    </TabPane>

                </Tabs>

            </Spin>

            <Modal
                visible={modalSearch}
                onCancel={() => setModalSearch(false)}
                title="Buscar Ordens"
                footer={[
                    <Button key="back" onClick={() => setModalSearch(false)}>
                        Cancelar
                        </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={() => finder()}>
                        Buscar
                    </Button>,
                ]}
            >

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

            </Modal>

            <Drawer
                    title="Débitos"
                    width={'80%'}
                    closable={true}
                    onClose={() => setDrawerInfo(false)}
                    visible={drawerInfo}
                    placement='left'
                >

                    <Divider style={{fontSize: 15, fontWeight: 'bold'}}>PAGAMENTO DE VENDAS DE PRODUTOS</Divider>
                    <Table pagination={{ pageSize: 10 }} columns={columnsPaySales} dataSource={paymentSale} size='small' rowKey={(vend) => vend._id} />

                    <Divider style={{fontSize: 15, fontWeight: 'bold'}}>PAGAMENTO DE ORDENS DE SERVIÇO</Divider>
                    <Table pagination={{ pageSize: 10 }} columns={columnsPayOrders} dataSource={paymentsOrders} size='small' rowKey={(vend) => vend._id} />

                    <Divider style={{fontSize: 15, fontWeight: 'bold'}}>RESUMO</Divider>
                    <Descriptions bordered size='small'>
                        <Descriptions.Item label='Total dos Débitos' span={3}><Statistic value={totalSales + totalOrders} precision={2} prefix='R$' valueStyle={{fontSize: 15.5}} /></Descriptions.Item>
                    </Descriptions>

                </Drawer>

                <Modal
                visible={modalStatusPayment}
                onCancel={() => setModalStatusPayment(false)}
                title="Alterar Status da Ordem de Serviço"
                footer={[
                    <Button key='back' onClick={() => setModalStatusPayment(false)}>
                        Cancelar
                    </Button>,
                    <Button key='submit' type='primary' loading={loadingUpdate} onClick={() => sendUpdateStatusOrder()}>
                        Salvar
                    </Button>,
                ]}
            >
                    <Radio.Group onChange={(e) => setStatus(e.target.value)} value={status}>
                        <Radio value={'none'}><Icon type='check' /> Autorizar</Radio>
                        <Radio value={'yes'}><Icon type='hourglass' /> Aguardar</Radio>
                        <Radio value={'cancel'}><Icon type='close' /> Não Autorizar</Radio>
                    </Radio.Group>

            </Modal>

            <Modal
                visible={modalStatusPaymentSale}
                onCancel={() => setModalStatusPaymentSale(false)}
                title="Alterar Status da Venda"
                footer={[
                    <Button key='back' onClick={() => setModalStatusPaymentSale(false)}>
                        Cancelar
                    </Button>,
                    <Button key='submit' type='primary' loading={loadingUpdate} onClick={() => sendUpdateStatusSale()}>
                        Salvar
                    </Button>,
                ]}
            >
                    <Radio.Group onChange={(e) => setStatus(e.target.value)} value={status}>
                        <Radio value={'none'}><Icon type='check' /> Autorizar</Radio>
                        <Radio value={'yes'}><Icon type='hourglass' /> Aguardar</Radio>
                        <Radio value={'cancel'}><Icon type='close' /> Não Autorizar</Radio>
                    </Radio.Group>

            </Modal>

            <Modal
                visible={modalViewPaymentSale}
                onCancel={() => setModalViewPaymentSale(false)}
                title="Pagamentos de Vendas"
                footer={[
                    <Button key='submit' type='primary' onClick={() => setModalViewPaymentSale(false)}>
                        Fechar
                    </Button>,
                ]}
                width='90%'
                style={{ top: 10 }}
            >

                <Table pagination={{ pageSize: 10 }} columns={columnsPaymentSale} dataSource={pagamentosSale} rowKey={(pay) => pay._id} size='small' />

            </Modal>

            <Modal
                visible={modalViewPaymentOrder}
                onCancel={() => setModalViewPaymentOrder(false)}
                title="Pagamentos de Ordens de Serviço"
                footer={[
                    <Button key='submit' type='primary' onClick={() => setModalViewPaymentOrder(false)}>
                        Fechar
                    </Button>,
                ]}
                width='90%'
                style={{ top: 10 }}
            >

                <Table pagination={{ pageSize: 10 }} columns={columnsPaymentOrder} dataSource={pagamentosOrder} rowKey={(pay) => pay._id} size='small' />

            </Modal>

        </div>
    )
}