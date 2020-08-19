import React, { useState, useEffect } from 'react';
import { Spin, Table, Button, Modal, Card, Select, Divider, TreeSelect, Statistic, Tooltip, Radio, Icon, Descriptions, Row, Tabs } from 'antd';
import api from '../../../../config/axios';
import moment from 'moment';
import '../../../../styles/style.css';

const { Option } = Select;
const { TreeNode } = TreeSelect;
const { TabPane } = Tabs;

export default function VerifyVendas() {

    const [spinner, setSpinner] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalSearch, setModalSearch] = useState(false);
    const [modalStatusPaymentSale, setModalStatusPaymentSale] = useState(false);
    const [modalStatusPaymentOrder, setModalStatusPaymentOrder] = useState(false);
    const [find, setFind] = useState(1);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [modalPaymentsVendas, setModalPaymentsVendas] = useState(false);
    const [modalPaymentsOrdens, setModalPaymentsOrdens] = useState(false);
    const [modalGenerate, setModalGenerate] = useState(false);
    const [modalVerify, setModalVerify] = useState(false);
    const [drawerProducts, setDrawerProducts] = useState(false);

    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');
    const [clientId, setClientId] = useState(null);
    const [clientName, setClientName] = useState(null);
    const [status, setStatus] = useState(null);
    const [statusOrder, setStatusOrder] = useState(null);

    const [clients, setClients] = useState([]);
    const [pagamentoVendas, setPagamentoVendas] = useState([]);
    const [pagamentoOrdens, setPagamentoOrdens] = useState([]);
    const [idPagamento, setIdPagamento] = useState(null);
    const [idPagamentoOrder, setIdPagamentoOrder] = useState(null);
    const [vendas, setVendas] = useState([]);
    const [ordens, setOrdens] = useState([]);
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);

    const [clienteTitulo, setClienteTitulo] = useState('')
    const [descriptionsPay, setDescriptionsPay] = useState('');
    const [dataVencimento, setDataVencimento] = useState('');
    const [clienteTituloOrder, setClienteTituloOrder] = useState('')
    const [descriptionsPayOrder, setDescriptionsPayOrder] = useState('');
    const [dataVencimentoOrder, setDataVencimentoOrder] = useState('');

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

    function info(title, message) {
        Modal.info({
            title: title,
            content: (
                <div>
                    <p>{message}</p>
                </div>
            ),
            onOk() { },
        });
    }

    async function finder() {
        if (find === '') {
            warning('Atenção', 'Selecione uma opção de busca');
            return false;
        }
        setLoading(true);
        setSpinner(true);
        await api.post('/payments/listSales', {
            find: find, client: clientId, mes: mes, ano: ano
        }).then(response => {
            setVendas(response.data.vendas);
            setOrdens(response.data.ordens);
            setLoading(false);
            setSpinner(false);
            setModalSearch(false);
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoading(false);
            setSpinner(false);
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

    async function findPaymentSale(id) {
        setSpinner(true);
        await api.get(`/payments/findPaymentsById/${id}`).then(response => {
            setPagamentoVendas(response.data.payments);
            setSpinner(false);
            setModalPaymentsVendas(true);
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setSpinner(false);
        });
    }

    async function findPaymentOrder(id) {
        setSpinner(true);
        await api.get(`/payments/findPaymentsOrdersById/${id}`).then(response => {
            setPagamentoOrdens(response.data.payments);
            setSpinner(false);
            setModalPaymentsOrdens(true);
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setSpinner(false);
        });
    }

    useEffect(() => {
        findClients();
        finder();
    }, []);

    async function handleClient(value) {
        const result = await clients.find(obj => obj.name === value);
        await setClientId(result._id);
        await setClientName(result.name);
    }

    async function handleChangeStatusSale(value) {
        await setIdPagamento(value._id);
        await setClienteTitulo(value.cliente.name);
        await setDescriptionsPay(value.title);
        await setDataVencimento(value.datePay);
        await setStatus(value.statusPay);
        setModalStatusPaymentSale(true);
    }

    async function handleChangeStatusOrder(value) {
        await setIdPagamentoOrder(value._id);
        await setClienteTituloOrder(value.cliente.name);
        await setDescriptionsPayOrder(value.title);
        await setDataVencimentoOrder(value.datePay);
        await setStatusOrder(value.statusPay);
        setModalStatusPaymentOrder(true);
    }

    async function sendUpdateStatusSale() {
        setLoadingUpdate(true);
        await api.put(`/payments/changePaymentSale/${idPagamento}`, {
            statusPay: status
        }).then(response => {
            success('Sucesso', response.data.message);
            setLoadingUpdate(false);
            finder();
            setModalStatusPaymentSale(false);
            setModalPaymentsVendas(false);
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoadingUpdate(false);
        });
    }

    async function sendUpdateStatusOrder() {
        setLoadingUpdate(true);
        await api.put(`/payments/changePaymentSale/${idPagamentoOrder}`, {
            statusPay: statusOrder
        }).then(response => {
            success('Sucesso', response.data.message);
            setLoadingUpdate(false);
            finder();
            setModalStatusPaymentOrder(false);
            setModalPaymentsOrdens(false);
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoadingUpdate(false);
        });
    }

    function printBoleto(info) {
        window.open(info.boletoUrl, 'PrintPdf', `height=${window.screen.height}, width=${window.screen.width}`, 'fullscreen=yes');
    }

    async function generateBoletoSale(id) {
        setModalGenerate(true);
        setModalPaymentsVendas(false);
        await api.post('/payments/gerBoletoVenda', {
            idPayment: id
        }).then(response => {
            printBoleto(response.data.payment);
            setModalGenerate(false);
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setModalGenerate(false);
        });
    }

    async function generateBoletoOrder(id) {
        setModalGenerate(true);
        setModalPaymentsOrdens(false);
        await api.post('/payments/gerBoletoOrdens', {
            idPayment: id
        }).then(response => {
            printBoleto(response.data.payment);
            setModalGenerate(false);
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setModalGenerate(false);
        });
    }

    async function verifyPaymentSale(id) {
        setModalVerify(true);
        setModalPaymentsVendas(false);
        await api.post('/payments/verifyPaymentSale', {
            idPayment: id
        }).then(response => {
            info('Informação', response.data.message)
            setModalVerify(false);
        }).catch(error => {
            erro('Erro', error.response.data.message)
            setModalVerify(false);
        });
    }

    async function verifyPaymentOrder(id) {
        setModalVerify(true);
        setModalPaymentsOrdens(false);
        await api.post('/payments/verifyPaymentOrder', {
            idPayment: id
        }).then(response => {
            info('Informação', response.data.message)
            setModalVerify(false);
        }).catch(error => {
            erro('Erro', error.response.data.message)
            setModalVerify(false);
        });
    }

    async function viewInfoSale(id) {
        const result = await vendas.find(obj => obj._id === id);
        await setProducts(result.products);
        setDrawerProducts(true);
    }

    async function viewInfoOrder(id) {
        const result = await ordens.find(obj => obj._id === id);
        await setServices(result.services);
        setDrawerProducts(true);
    }

    async function handleDrawer() {
        await setProducts([]);
        await setServices([]);
        setDrawerProducts(false);
    }

    const columnsVendas = [
        {
            title: 'Nº',
            dataIndex: 'number',
            key: 'number',
            align: 'center',
            width: '5%'
        },
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
            title: 'Status Pagamento',
            dataIndex: 'statusPay',
            key: 'statusPay',
            render: (value) => <>
                {value === 'wait' && (
                    <Button type='link' size='small' style={{ backgroundColor: '#ffeb3b', color: '#444', width: '100%', fontWeight: 'bold' }}>Em Aberto</Button>
                )}
                {value === 'pay' && (
                    <Button type='link' size='small' style={{ backgroundColor: '#4caf50', color: '#fff', width: '100%', fontWeight: 'bold' }}>Pago</Button>
                )}
            </>,
            align: 'center',
            width: '12%'
        },
        {
            title: 'Data da Compra',
            dataIndex: 'createDate',
            key: 'createDate',
            align: 'center',
            width: '10%'
        },
        {
            title: 'Valor',
            dataIndex: 'valueLiquido',
            key: 'valueLiquido',
            render: (value) => <Statistic value={value} precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} />,
            align: 'right',
            width: '10%'
        },
        {
            title: 'Ações',
            dataIndex: '_id',
            key: '_id',
            render: (id) => <>
                <Tooltip placement='top' title='Visualizar Informações'>
                    <Button icon='zoom-in' size='small' shape='circle' type='default' onClick={() => viewInfoSale(id)} style={{ marginRight: 5 }} />
                </Tooltip>
                <Tooltip placement='top' title='Visualizar Pagamentos'>
                    <Button icon='barcode' size='small' shape='circle' type='primary' onClick={() => findPaymentSale(id)} />
                </Tooltip>
            </>,
            width: '6%',
            align: 'center'
        }
    ]

    const columnsOrdens = [
        {
            title: 'Nº',
            dataIndex: 'number',
            key: 'number',
            align: 'center',
            width: '5%'
        },
        {
            title: 'Cliente',
            dataIndex: 'client.name',
            key: 'client.name',
            width: '25%'
        },
        {
            title: 'Vendedor',
            dataIndex: 'funcionario.name',
            key: 'funcionario.name',
            width: '25%'
        },
        {
            title: 'Veículo',
            dataIndex: 'veicles.model',
            key: 'veicles.model',
        },
        {
            title: 'Status Pagamento',
            dataIndex: 'statusPay',
            key: 'statusPay',
            render: (value) => <>
                {value === 'wait' && (
                    <Button type='link' size='small' style={{ backgroundColor: '#ffeb3b', color: '#444', width: '100%', fontWeight: 'bold' }}>Em Aberto</Button>
                )}
                {value === 'pay' && (
                    <Button type='link' size='small' style={{ backgroundColor: '#4caf50', color: '#fff', width: '100%', fontWeight: 'bold' }}>Pago</Button>
                )}
            </>,
            align: 'center',
            width: '12%'
        },
        {
            title: 'Data da Compra',
            dataIndex: 'createDate',
            key: 'createDate',
            align: 'center',
            width: '10%'
        },
        {
            title: 'Valor',
            dataIndex: 'valueLiquido',
            key: 'valueLiquido',
            render: (value) => <Statistic value={value} precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} />,
            align: 'right',
            width: '10%'
        },
        {
            title: 'Ações',
            dataIndex: '_id',
            key: '_id',
            render: (id) => <>
                <Tooltip placement='top' title='Visualizar Informações'>
                    <Button icon='zoom-in' size='small' shape='circle' type='default' onClick={() => viewInfoOrder(id)} style={{ marginRight: 5 }} />
                </Tooltip>
                <Tooltip placement='top' title='Visualizar Pagamentos'>
                    <Button icon='zoom-in' size='small' shape='circle' type='primary' onClick={() => findPaymentOrder(id)} />
                </Tooltip>
            </>,
            width: '6%',
            align: 'center'
        }
    ]

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
            title: 'Status Pagamento',
            dataIndex: 'statusPay',
            key: 'statusPay',
            render: (value, id) => <>
                {id.boleto === true && (
                    <>
                        {id.boletoUrl && (
                            <>
                                {value === 'wait' && (
                                    <Tooltip placement='top' title='Clique para verificar pagamento'>
                                        <Button type='link' size='small' style={{ backgroundColor: '#ffeb3b', color: '#444', width: '100%', fontWeight: 'bold' }} onClick={() => verifyPaymentSale(id._id)}>Em Aberto</Button>
                                    </Tooltip>
                                )}
                                {value === 'pay' && (
                                    <Button type='link' size='small' style={{ backgroundColor: '#4caf50', color: '#fff', width: '100%', fontWeight: 'bold' }}>Pago</Button>
                                )}
                            </>
                        )}
                        {!id.boletoUrl && (
                            <>
                                {value === 'wait' && (
                                    <Tooltip placement='top' title='Clique no Botão ao lado para gerar o boleto'>
                                        <Button type='link' size='small' style={{ backgroundColor: '#ffeb3b', color: '#444', width: '100%', fontWeight: 'bold' }} onClick={() => { }}>Em Aberto</Button>
                                    </Tooltip>
                                )}
                                {value === 'pay' && (
                                    <Button type='link' size='small' style={{ backgroundColor: '#4caf50', color: '#fff', width: '100%', fontWeight: 'bold' }}>Pago</Button>
                                )}
                            </>
                        )}
                    </>
                )}
                {id.boleto === false && (
                    <>
                        {value === 'wait' && (
                            <Tooltip placement='top' title='Clique alterar o status do pagamento'>
                                <Button type='link' size='small' style={{ backgroundColor: '#ffeb3b', color: '#444', width: '100%', fontWeight: 'bold' }} onClick={() => handleChangeStatusSale(id)}>Em Aberto</Button>
                            </Tooltip>
                        )}
                        {value === 'pay' && (
                            <Button type='link' size='small' style={{ backgroundColor: '#4caf50', color: '#fff', width: '100%', fontWeight: 'bold' }}>Pago</Button>
                        )}
                    </>
                )}

            </>,
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
        },
        {
            title: 'Ações',
            dataIndex: '_id',
            key: '_id',
            render: (id, opt) => <>
                {opt.boleto === true && (
                    <>
                        {opt.boletoUrl && (
                            <Tooltip placement='top' title='Imprimir Boleto'>
                                <Button shape='circle' icon="printer" type='default' size='small' style={{ marginRight: 5 }} onClick={() => printBoleto(opt)} />
                            </Tooltip>
                        )}
                        {!opt.boletoUrl && (
                            <Tooltip placement='top' title='Gerar Boleto'>
                                <Button shape='circle' icon="barcode" type='primary' size='small' style={{ marginRight: 5 }} onClick={() => generateBoletoSale(id)} />
                            </Tooltip>
                        )}
                    </>
                )}
            </>,
            width: '9%',
            align: 'center'
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
            title: 'Status Pagamento',
            dataIndex: 'statusPay',
            key: 'statusPay',
            render: (value, id) => <>
                {id.boleto === true && (
                    <>
                        {id.boletoUrl && (
                            <>
                                {value === 'wait' && (
                                    <Tooltip placement='top' title='Clique para verificar pagamento'>
                                        <Button type='link' size='small' style={{ backgroundColor: '#ffeb3b', color: '#444', width: '100%', fontWeight: 'bold' }} onClick={() => verifyPaymentOrder(id._id)}>Em Aberto</Button>
                                    </Tooltip>
                                )}
                                {value === 'pay' && (
                                    <Button type='link' size='small' style={{ backgroundColor: '#4caf50', color: '#fff', width: '100%', fontWeight: 'bold' }}>Pago</Button>
                                )}
                            </>
                        )}
                        {!id.boletoUrl && (
                            <>
                                {value === 'wait' && (
                                    <Tooltip placement='top' title='Clique no Botão ao lado para gerar o boleto'>
                                        <Button type='link' size='small' style={{ backgroundColor: '#ffeb3b', color: '#444', width: '100%', fontWeight: 'bold' }} onClick={() => { }}>Em Aberto</Button>
                                    </Tooltip>
                                )}
                                {value === 'pay' && (
                                    <Button type='link' size='small' style={{ backgroundColor: '#4caf50', color: '#fff', width: '100%', fontWeight: 'bold' }}>Pago</Button>
                                )}
                            </>
                        )}
                    </>
                )}
                {id.boleto === false && (
                    <>
                        {value === 'wait' && (
                            <Tooltip placement='top' title='Clique alterar o status do pagamento'>
                                <Button type='link' size='small' style={{ backgroundColor: '#ffeb3b', color: '#444', width: '100%', fontWeight: 'bold' }} onClick={() => handleChangeStatusOrder(id)}>Em Aberto</Button>
                            </Tooltip>
                        )}
                        {value === 'pay' && (
                            <Button type='link' size='small' style={{ backgroundColor: '#4caf50', color: '#fff', width: '100%', fontWeight: 'bold' }}>Pago</Button>
                        )}
                    </>
                )}

            </>,
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
        },
        {
            title: 'Ações',
            dataIndex: '_id',
            key: '_id',
            render: (id, opt) => <>
                {opt.boleto === true && (
                    <>
                        {opt.boletoUrl && (
                            <Tooltip placement='top' title='Imprimir Boleto'>
                                <Button shape='circle' icon="printer" type='default' size='small' style={{ marginRight: 5 }} onClick={() => printBoleto(opt)} />
                            </Tooltip>
                        )}
                        {!opt.boletoUrl && (
                            <Tooltip placement='top' title='Gerar Boleto'>
                                <Button shape='circle' icon="barcode" type='primary' size='small' style={{ marginRight: 5 }} onClick={() => generateBoletoOrder(id)} />
                            </Tooltip>
                        )}
                    </>
                )}
            </>,
            width: '9%',
            align: 'center'
        }
    ];

    const columnsProduct = [
        {
            title: 'Qtd',
            dataIndex: 'quantity',
            key: 'quantity',
            width: '6%'
        },
        {
            title: 'Produto',
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
            render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} />,
            width: '12%',
            align: 'right'
        },
        {
            title: 'Valor Tot',
            dataIndex: 'valueTotal',
            key: 'valueTotal',
            render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} />,
            width: '12%',
            align: 'right'
        },
    ];

    const DataAtual = new Date();
    const Ano = DataAtual.getFullYear();

    return (
        <Spin spinning={spinner} size='large'>

            <div style={{ marginBottom: 10, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                <Card size='small'>

                    {find === 1 && (
                        <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>Vendas / Ordens de Serviços Mês Atual</strong></p>
                    )}
                    {find === 2 && (
                        <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>{`Vendas / Ordens de Serviços do mês: ${mes} do ano: ${ano}`}</strong></p>
                    )}
                    {find === 3 && (
                        <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>Todas as Vendas / Ordens de Serviços</strong></p>
                    )}
                    {find === 4 && (
                        <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>{`Vendas / Ordens de Serviços do Cliente: ${clientName}`}</strong></p>
                    )}

                </Card>

                <div style={{ display: 'flex', flexDirection: 'row' }}>

                    <Button icon='reload' type='default' style={{ marginRight: 10 }} onClick={() => finder()}>Atualizar Dados</Button>

                    <Button icon='search' type='primary' onClick={() => setModalSearch(true)}>Busca Avançada</Button>

                </div>

            </div>

            <Tabs defaultActiveKey="1" type='card' tabPosition='left'>

                <TabPane tab={
                    <Tooltip placement='right' title='Vendas'>
                        <span>
                            <Icon type="shopping" />
                        </span>
                    </Tooltip>
                } key="1">

                    <Table pagination={{ pageSize: 10 }} columns={columnsVendas} dataSource={vendas} rowKey={(pay) => pay._id} size='small' />

                </TabPane>

                <TabPane tab={
                    <Tooltip placement='right' title='Ordens de Serviços'>
                        <span>
                            <Icon type="file-sync" />
                        </span>
                    </Tooltip>
                } key="2">

                    <Table pagination={{ pageSize: 10 }} columns={columnsOrdens} dataSource={ordens} rowKey={(pay) => pay._id} size='small' />

                </TabPane>

            </Tabs>

            <Modal
                visible={modalSearch}
                onCancel={() => setModalSearch(false)}
                title="Buscar Pagamento de Vendas"
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
                    <Option value={1}>Vendas / Ordens de Serviços - Mês Atual</Option>
                    <Option value={2}>Vendas / Ordens de Serviços - Por Perído</Option>
                    <Option value={3}>Vendas / Ordens de Serviços - Todas</Option>
                    <Option value={4}>Vendas / Ordens de Serviços - Por Cliente</Option>
                </Select>

                {find === 2 && (
                    <>
                        <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>SELECIONE O PERÍODO</Divider>
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

                {find === 4 && (
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

            </Modal>

            <Modal
                visible={modalStatusPaymentSale}
                onCancel={() => setModalStatusPaymentSale(false)}
                title="Alterar Status do Pagamento"
                footer={[
                    <Button key='back' icon='close' type='danger' onClick={() => setModalStatusPaymentSale(false)}>
                        Cancelar
                    </Button>,
                    <Button key='submit' icon='save' type='primary' loading={loadingUpdate} onClick={() => sendUpdateStatusSale()}>
                        Salvar
                    </Button>,
                ]}
            >

                <Descriptions size='small' bordered>
                    <Descriptions.Item label='Cliente' span={3}>{clienteTitulo}</Descriptions.Item>
                    <Descriptions.Item label='Pagamento' span={3}>{descriptionsPay}</Descriptions.Item>
                    <Descriptions.Item label='Vencimento' span={3}>{dataVencimento}</Descriptions.Item>
                </Descriptions>

                <Card style={{ marginTop: 15 }} size='small' title='Selecione uma opção'>

                    <Radio.Group onChange={(e) => setStatus(e.target.value)} value={status}>
                        <Radio value={'wait'}><Icon type='hourglass' /> Em Aberto</Radio>
                        <Radio value={'pay'}><Icon type='check' /> Pago</Radio>
                    </Radio.Group>

                </Card>

            </Modal>

            <Modal
                visible={modalStatusPaymentOrder}
                onCancel={() => setModalStatusPaymentOrder(false)}
                title="Alterar Status do Pagamento"
                footer={[
                    <Button key='back' icon='close' type='danger' onClick={() => setModalStatusPaymentOrder(false)}>
                        Cancelar
                    </Button>,
                    <Button key='submit' icon='save' type='primary' loading={loadingUpdate} onClick={() => sendUpdateStatusOrder()}>
                        Salvar
                    </Button>,
                ]}
            >

                <Descriptions size='small' bordered>
                    <Descriptions.Item label='Cliente' span={3}>{clienteTituloOrder}</Descriptions.Item>
                    <Descriptions.Item label='Pagamento' span={3}>{descriptionsPayOrder}</Descriptions.Item>
                    <Descriptions.Item label='Vencimento' span={3}>{dataVencimentoOrder}</Descriptions.Item>
                </Descriptions>

                <Card style={{ marginTop: 15 }} size='small' title='Selecione uma opção'>

                    <Radio.Group onChange={(e) => setStatusOrder(e.target.value)} value={statusOrder}>
                        <Radio value={'wait'}><Icon type='hourglass' /> Em Aberto</Radio>
                        <Radio value={'pay'}><Icon type='check' /> Pago</Radio>
                    </Radio.Group>

                </Card>

            </Modal>

            <Modal
                visible={modalPaymentsVendas}
                onCancel={() => setModalPaymentsVendas(false)}
                title="Visualizar Pagamentos"
                footer={[
                    <Button key='back' icon='close' type='danger' onClick={() => setModalPaymentsVendas(false)}>
                        Fechar
                    </Button>,
                ]}
                width='80%'
                style={{ top: 10 }}
            >

                <Table pagination={{ pageSize: 10 }} columns={columnsPaymentSale} dataSource={pagamentoVendas} rowKey={(pay) => pay._id} size='small' rowClassName={(record) => moment(new Date(record.dateToPay)) < moment(new Date) && record.statusPay === 'wait' ? 'red-row' : ''} />

            </Modal>

            <Modal
                visible={modalPaymentsOrdens}
                onCancel={() => setModalPaymentsOrdens(false)}
                title="Visualizar Pagamentos"
                footer={[
                    <Button key='back' icon='close' type='danger' onClick={() => setModalPaymentsOrdens(false)}>
                        Fechar
                    </Button>,
                ]}
                width='80%'
                style={{ top: 10 }}
            >

                <Table pagination={{ pageSize: 10 }} columns={columnsPaymentOrder} dataSource={pagamentoOrdens} rowKey={(pay) => pay._id} size='small' />

            </Modal>

            <Modal
                visible={modalGenerate}
                closable={false}
                title={false}
                footer={false}
                centered
            >

                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

                    <Icon type='loading' style={{ fontSize: 80 }} />

                    <p style={{ marginTop: 30, fontSize: 25, fontWeight: 'bold', marginBottom: -10 }}>Gerando Boleto...</p>

                </div>

            </Modal>

            <Modal
                visible={modalVerify}
                closable={false}
                title={false}
                footer={false}
                centered
            >

                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

                    <Icon type='loading' style={{ fontSize: 80 }} />

                    <p style={{ marginTop: 30, fontSize: 25, fontWeight: 'bold', marginBottom: -10 }}>Verificando Pagamento...</p>

                </div>

            </Modal>

            <Modal
                title="Informações"
                width={'80%'}
                onCancel={() => handleDrawer()}
                visible={drawerProducts}
                footer={[
                    <Button key='back' icon='close' type='danger' onClick={() => handleDrawer()}>
                        Fechar
                    </Button>
                ]}
            >

                {!!products.length && (
                    <>

                        <Card size='small' style={{ backgroundColor: '#001529', marginBottom: 10 }} bordered={false}>
                            <Row>
                                <Icon type='tags' style={{ fontSize: 20, color: '#fff', marginRight: 15 }} />
                                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>PRODUTOS</span>
                            </Row>
                        </Card>

                        <Table pagination={{ pageSize: 10 }} columns={columnsProduct} dataSource={products} size='small' rowKey={(prod) => prod._id} />

                    </>
                )}

                {!!services.length && (
                    <>

                        <Card size='small' style={{ backgroundColor: '#001529', marginBottom: 10 }} bordered={false}>
                            <Row>
                                <Icon type='tool' style={{ fontSize: 20, color: '#fff', marginRight: 15 }} />
                                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>SERVIÇOS</span>
                            </Row>
                        </Card>

                        <Table pagination={{ pageSize: 10 }} columns={columnsService} dataSource={services} size='small' rowKey={(prod) => prod._id} />

                    </>
                )}

            </Modal>

        </Spin>
    )
}