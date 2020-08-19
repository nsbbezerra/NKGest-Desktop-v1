import React, { Component } from 'react';
import { Icon, Button, Table, Tooltip, Modal, Select, Card, Divider, TreeSelect, Spin, Tabs, Statistic, Row } from 'antd';
import { Header } from '../../../styles/styles';
import { Link } from 'react-router-dom';
import api from '../../../config/axios';

const { Option } = Select;
const { TreeNode } = TreeSelect;
const { TabPane } = Tabs;

export default class Boletos extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modalAdvancedFind: false,
            modalAdvancedFindOrders: false,
            typeAdvandcedFind: 1,
            loading: false,
            spinner: false,
            clients: [],
            clientName: null,
            clientId: null,
            pagVendas: [],
            pagOrdens: [],
            modalPaymentsVendas: false,
            modalPaymentsOrders: false,
            paymentSale: [],
            paymentOrder: [],
            products: [],
            services: [],
            drawerProducts: false,
            modalGenerate: false
        }
    }

    erro = (title, message) => {
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

    success = (title, message) => {
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

    warning = (title, message) => {
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

    findClients = async () => {
        this.setState({ spinner: true });
        await api.get(`/admin/listClientes`).then(response => {
            this.setState({ clients: response.data.clientes });
            this.setState({ spinner: false });
        }).catch(error => {
            this.erro('Erro', error.message);
            this.setState({ spinner: false });
        });
    }

    findVendasPayments = async () => {
        this.setState({ loading: true });
        await api.post('/payments/listBoletoSale', {
            find: this.state.typeAdvandcedFind, client: this.state.clientId
        }).then(response => {
            this.setState({ pagVendas: response.data.vendas });
            this.setState({ loading: false });
            this.setState({ modalAdvancedFind: false });
        }).catch(error => {
            this.erro('Erro', error.response.data.message);
            this.setState({ loading: false });
        });
    }

    findOrdersPayments = async () => {
        this.setState({ loading: true });
        await api.post('/payments/listBoletoOrder', {
            find: this.state.typeAdvandcedFind, client: this.state.clientId
        }).then(response => {
            this.setState({ pagOrdens: response.data.vendas });
            this.setState({ loading: false });
            this.setState({ modalAdvancedFindOrders: false });
        }).catch(error => {
            this.erro('Erro', error.response.data.message);
            this.setState({ loading: false });
        });
    }

    componentDidMount = () => {
        this.findClients();
        this.findVendasPayments();
        this.findOrdersPayments();
    }

    handleClient = async (value) => {
        const result = await this.state.clients.find(obj => obj.name === value);
        await this.setState({ clientId: result._id });
        await this.setState({ clientName: result.name });
    }

    findPaymentSale = async (id) => {
        this.setState({ spinner: true });
        await api.get(`/payments/findPaymentsById/${id}`).then(response => {
            this.setState({ paymentSale: response.data.payments })
            this.setState({ spinner: false });
            this.setState({ modalPaymentsVendas: true });
        }).catch(error => {
            this.erro('Erro', error.response.data.message);
            this.setState({ spinner: false });
        });
    }

    findPaymentOrders = async (id) => {
        this.setState({ spinner: true });
        await api.get(`/payments/findPaymentsOrdersById/${id}`).then(response => {
            this.setState({ paymentOrder: response.data.payments })
            this.setState({ spinner: false });
            this.setState({ modalPaymentsOrders: true });
        }).catch(error => {
            this.erro('Erro', error.response.data.message);
            this.setState({ spinner: false });
        });
    }

    viewInfoSalePay = async (id) => {
        const result = await this.state.pagVendas.find(obj => obj._id === id);
        await this.setState({ products: result.products });
        this.setState({ drawerProducts: true });
    }
    viewInfoOrderPay = async (id) => {
        const result = await this.state.pagOrdens.find(obj => obj._id === id);
        await this.setState({ services: result.services });
        this.setState({ drawerProducts: true });
    }

    handleDrawer = async () => {
        await this.setState({ products: [] });
        await this.setState({ services: [] });
        this.setState({ drawerProducts: false });
    }

    printBoleto = (info) => {
        window.open(info.boletoUrl, 'PrintPdf', `height=${window.screen.height}, width=${window.screen.width}`, 'fullscreen=yes');
    }

    generateBoletoSale = async(id) => {
        this.setState({ modalGenerate: true });
        this.setState({ modalPaymentsVendas: false });
        await api.post('/payments/gerBoletoVenda',{
            idPayment: id
        }).then(response => {
            this.printBoleto(response.data.payment);
            this.setState({ modalGenerate: false });
        }).catch(error => {
            this.erro('Erro', error.response.data.message);
            this.setState({ modalGenerate: false });
        });
    }

    generateBoletoOrder = async(id) => {
        this.setState({ modalGenerate: true });
        this.setState({ modalPaymentsOrders: false });
        await api.post('/payments/gerBoletoOrdens',{
            idPayment: id
        }).then(response => {
            this.printBoleto(response.data.payment);
            this.setState({ modalGenerate: false });
        }).catch(error => {
            this.erro('Erro', error.response.data.message);
            this.setState({ modalGenerate: false });
        });
    }

    render() {

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
                title: 'Data Compra',
                dataIndex: 'createDate',
                key: 'createDate',
                width: '10%',
                align: 'center'
            },
            {
                title: 'Valor',
                dataIndex: 'valueLiquido',
                key: 'valueLiquido',
                render: (valor) => <Statistic value={valor} precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} />,
                width: '13%',
                align: 'right'
            },
            {
                title: 'Pagamento',
                dataIndex: 'statusPay',
                key: 'statusPay',
                render: (value) => <>
                    {value === 'wait' && (
                        <Button size='small' style={{ width: '100%', backgroundColor: '#ffeb3b', color: '#444', fontWeight: 'bold' }} type='link' onClick={() => { }} >Em Aberto</Button>
                    )}
                    {value === 'pay' && (
                        <Button size='small' style={{ width: '100%', backgroundColor: '#4caf50', color: '#fff', fontWeight: 'bold' }} type='link' onClick={() => { }} >Pago</Button>
                    )}
                </>,
                width: '11%',
                align: 'center'
            },
            {
                title: 'Ações',
                dataIndex: '_id',
                key: '_id',
                render: (id) => <>
                    <Tooltip placement='top' title='Vizualizar Produtos/Serviços'>
                        <Button shape="circle" icon="search" type='default' size='small' style={{ marginRight: 5 }} onClick={() => this.viewInfoSalePay(id)} />
                    </Tooltip>
                    <Tooltip placement='top' title='Visualizar Pagamentos'>
                        <Button shape="circle" icon="barcode" type='primary' size='small' style={{ marginRight: 5 }} onClick={() => this.findPaymentSale(id)} />
                    </Tooltip>
                </>,
                width: '9%'
            }
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
                title: 'Data Compra',
                dataIndex: 'createDate',
                key: 'createDate',
                width: '10%',
                align: 'center'
            },
            {
                title: 'Valor',
                dataIndex: 'valueLiquido',
                key: 'valueLiquido',
                render: (valor) => <Statistic value={valor} precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} />,
                width: '13%',
                align: 'right'
            },
            {
                title: 'Pagamento',
                dataIndex: 'statusPay',
                key: 'statusPay',
                render: (value) => <>
                    {value === 'wait' && (
                        <Button size='small' style={{ width: '100%', backgroundColor: '#ffeb3b', color: '#444', fontWeight: 'bold' }} type='link' onClick={() => { }} >Em Aberto</Button>
                    )}
                    {value === 'pay' && (
                        <Button size='small' style={{ width: '100%', backgroundColor: '#4caf50', color: '#fff', fontWeight: 'bold' }} type='link' onClick={() => { }} >Pago</Button>
                    )}
                </>,
                width: '11%',
                align: 'center'
            },
            {
                title: 'Ações',
                dataIndex: '_id',
                key: '_id',
                render: (id) => <>
                    <Tooltip placement='top' title='Vizualizar Produtos/Serviços'>
                        <Button shape="circle" icon="search" type='default' size='small' style={{ marginRight: 5 }} onClick={() => this.viewInfoOrderPay(id)} />
                    </Tooltip>
                    <Tooltip placement='top' title='Visualizar Pagamentos'>
                        <Button shape="circle" icon="barcode" type='primary' size='small' style={{ marginRight: 5 }} onClick={() => this.findPaymentOrders(id)} />
                    </Tooltip>
                </>,
                width: '9%'
            }
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
                title: 'Status Pagamento',
                dataIndex: 'statusPay',
                key: 'statusPay',
                render: (value, id) => <>
                    {id.boleto === true && (
                        <>
                            {value === 'wait' && (
                                <Button type='link' size='small' style={{ backgroundColor: '#ffeb3b', color: '#444', width: '100%', fontWeight: 'bold' }} onClick={() => { }}>Em Aberto</Button>
                            )}
                            {value === 'pay' && (
                                <Button type='link' size='small' style={{ backgroundColor: '#4caf50', color: '#fff', width: '100%', fontWeight: 'bold' }}>Pago</Button>
                            )}
                        </>
                    )}
                    {id.boleto === false && (
                        <>
                            {value === 'wait' && (
                                <Button type='link' size='small' style={{ backgroundColor: '#ffeb3b', color: '#444', width: '100%', fontWeight: 'bold' }} onClick={() => { }}>Em Aberto</Button>
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
                                    <Button shape='circle' icon="printer" type='default' size='small' style={{ marginRight: 5 }} onClick={() => this.printBoleto(opt)} />
                                </Tooltip>
                            )}
                            {!opt.boletoUrl && (
                                <Tooltip placement='top' title='Gerar Boleto'>
                                    <Button shape='circle' icon="barcode" type='primary' size='small' style={{ marginRight: 5 }} onClick={() => this.generateBoletoSale(id)} />
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
                            {value === 'wait' && (
                                <Button type='link' size='small' style={{ backgroundColor: '#ffeb3b', color: '#444', width: '100%', fontWeight: 'bold' }} onClick={() => { }}>Em Aberto</Button>
                            )}
                            {value === 'pay' && (
                                <Button type='link' size='small' style={{ backgroundColor: '#4caf50', color: '#fff', width: '100%', fontWeight: 'bold' }}>Pago</Button>
                            )}
                        </>
                    )}
                    {id.boleto === false && (
                        <>
                            {value === 'wait' && (
                                <Button type='link' size='small' style={{ backgroundColor: '#ffeb3b', color: '#444', width: '100%', fontWeight: 'bold' }} onClick={() => { }}>Em Aberto</Button>
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
                                    <Button shape='circle' icon="printer" type='default' size='small' style={{ marginRight: 5 }} onClick={() => this.printBoleto(opt)} />
                                </Tooltip>
                            )}
                            {!opt.boletoUrl && (
                                <Tooltip placement='top' title='Gerar Boleto'>
                                    <Button shape='circle' icon="barcode" type='primary' size='small' style={{ marginRight: 5 }} onClick={() => this.generateBoletoOrder(id)} />
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
            <div style={{ height: '100%' }}>
                <Header>
                    <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='barcode' style={{ fontSize: 20 }} /> EMISSÃO DE BOLETOS</p>
                    <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
                </Header>

                <Tabs defaultActiveKey="1" type='card' style={{ marginTop: 10 }}>

                    <TabPane tab={
                        <span>
                            Venda de Produtos
                            </span>
                    } key="1">

                        <Spin spinning={this.state.spinner} size='large'>

                            <div style={{ marginBottom: 10, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                <Card size='small'>

                                    {this.state.typeAdvandcedFind === 1 && (
                                        <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos Dados: <strong>Todas as Vendas</strong></p>
                                    )}
                                    {this.state.typeAdvandcedFind === 2 && (
                                        <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos Dados: <strong>{`Todas as Vendas ao Cliente: ${this.state.clientName}`}</strong></p>
                                    )}

                                </Card>

                                <div>

                                    <Button icon='redo' type='default' style={{ marginRight: 10 }} onClick={() => this.findVendasPayments()}>Atualizar</Button>

                                    <Button icon='search' type='primary' onClick={() => this.setState({ modalAdvancedFind: true })}>Busca Avançada</Button>

                                </div>

                            </div>

                            <Table pagination={{ pageSize: 10 }} columns={columns} dataSource={this.state.pagVendas} size='small' rowKey={(vend) => vend._id} />

                        </Spin>

                    </TabPane>

                    <TabPane tab={
                        <span>
                            Ordens de Serviços
                            </span>
                    } key="2">

                        <Spin spinning={this.state.spinner} size='large'>

                            <div style={{ marginBottom: 10, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                                <Card size='small'>

                                    {this.state.typeAdvandcedFind === 1 && (
                                        <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos Dados: <strong>Todas as Ordens</strong></p>
                                    )}
                                    {this.state.typeAdvandcedFind === 2 && (
                                        <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos Dados: <strong>{`Todas as Ordens ao Cliente: ${this.state.clientName}`}</strong></p>
                                    )}

                                </Card>

                                <div>

                                    <Button icon='redo' type='default' style={{ marginRight: 10 }} onClick={() => this.findOrdersPayments()}>Atualizar</Button>

                                    <Button icon='search' type='primary' onClick={() => this.setState({ modalAdvancedFindOrders: true })}>Busca Avançada</Button>

                                </div>

                            </div>

                            <Table pagination={{ pageSize: 10 }} columns={columnsOrders} dataSource={this.state.pagOrdens} size='small' rowKey={(vend) => vend._id} />

                        </Spin>

                    </TabPane>

                </Tabs>

                <Modal
                    title="Busca Avançada"
                    visible={this.state.modalAdvancedFind}
                    onCancel={() => this.setState({ modalAdvancedFind: false })}
                    footer={[
                        <Button key="back" icon='close' type='danger' onClick={() => this.setState({ modalAdvancedFind: false })}>
                            Cancelar
                        </Button>,
                        <Button key="submit" icon='search' type="primary" loading={this.state.loading} onClick={() => { this.findVendasPayments() }}>
                            Buscar
                        </Button>,
                    ]}
                >

                    <Select value={this.state.typeAdvandcedFind} style={{ width: '100%' }} onChange={(value) => this.setState({ typeAdvandcedFind: value })}>
                        <Option value={1}>Todas</Option>
                        <Option value={2}>Por Cliente</Option>
                    </Select>

                    {this.state.typeAdvandcedFind === 2 && (
                        <>
                            <Divider style={{ fontSize: 15.5, fontWeight: 'bold' }}>SELECIONE O CLIENTE</Divider>

                            <TreeSelect
                                showSearch
                                style={{ width: '100%', marginBottom: 20 }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                value={this.state.clientName}
                                treeDefaultExpandAll
                                onChange={(value) => this.handleClient(value)}
                            >

                                {this.state.clients.map(client => (

                                    <TreeNode value={client.name} title={client.name} key={client._id} />

                                ))}

                            </TreeSelect>
                        </>
                    )}

                </Modal>

                <Modal
                    title="Busca Avançada"
                    visible={this.state.modalAdvancedFindOrders}
                    onCancel={() => this.setState({ modalAdvancedFindOrders: false })}
                    footer={[
                        <Button key="back" icon='close' type='danger' onClick={() => this.setState({ modalAdvancedFindOrders: false })}>
                            Cancelar
                        </Button>,
                        <Button key="submit" icon='search' type="primary" loading={this.state.loading} onClick={() => { this.findOrdersPayments() }}>
                            Buscar
                        </Button>,
                    ]}
                >

                    <Select value={this.state.typeAdvandcedFind} style={{ width: '100%' }} onChange={(value) => this.setState({ typeAdvandcedFind: value })}>
                        <Option value={1}>Todas</Option>
                        <Option value={2}>Por Cliente</Option>
                    </Select>

                    {this.state.typeAdvandcedFind === 2 && (
                        <>
                            <Divider style={{ fontSize: 15.5, fontWeight: 'bold' }}>SELECIONE O CLIENTE</Divider>

                            <TreeSelect
                                showSearch
                                style={{ width: '100%', marginBottom: 20 }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                value={this.state.clientName}
                                treeDefaultExpandAll
                                onChange={(value) => this.handleClient(value)}
                            >

                                {this.state.clients.map(client => (

                                    <TreeNode value={client.name} title={client.name} key={client._id} />

                                ))}

                            </TreeSelect>
                        </>
                    )}

                </Modal>

                <Modal
                    visible={this.state.modalPaymentsVendas}
                    onCancel={() => this.setState({ modalPaymentsVendas: false })}
                    title="Visualizar Pagamentos"
                    footer={[
                        <Button key='back' icon='close' type='danger' onClick={() => this.setState({ modalPaymentsVendas: false })}>
                            Fechar
                        </Button>,
                    ]}
                    width='80%'
                    style={{ top: 10 }}
                >

                    <Table pagination={{ pageSize: 10 }} columns={columnsPaymentSale} dataSource={this.state.paymentSale} rowKey={(pay) => pay._id} size='small' />

                </Modal>

                <Modal
                    visible={this.state.modalPaymentsOrders}
                    onCancel={() => this.setState({ modalPaymentsOrders: false })}
                    title="Visualizar Pagamentos"
                    footer={[
                        <Button key='back' icon='close' type='danger' onClick={() => this.setState({ modalPaymentsOrders: false })}>
                            Fechar
                        </Button>,
                    ]}
                    width='80%'
                    style={{ top: 10 }}
                >

                    <Table pagination={{ pageSize: 10 }} columns={columnsPaymentOrder} dataSource={this.state.paymentOrder} rowKey={(pay) => pay._id} size='small' />

                </Modal>

                <Modal
                    title="Informações"
                    width={'80%'}
                    onCancel={() => this.handleDrawer()}
                    visible={this.state.drawerProducts}
                    footer={[
                        <Button key='back' icon='close' type='danger' onClick={() => this.handleDrawer()}>
                            Fechar
                        </Button>
                    ]}
                >

                    {!!this.state.products.length && (
                        <>

                            <Card size='small' style={{ backgroundColor: '#001529', marginBottom: 10 }} bordered={false}>
                                <Row>
                                    <Icon type='tags' style={{ fontSize: 20, color: '#fff', marginRight: 15 }} />
                                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>PRODUTOS</span>
                                </Row>
                            </Card>

                            <Table pagination={{ pageSize: 10 }} columns={columnsProduct} dataSource={this.state.products} size='small' rowKey={(prod) => prod._id} />

                        </>
                    )}

                    {!!this.state.services.length && (
                        <>

                            <Card size='small' style={{ backgroundColor: '#001529', marginBottom: 10 }} bordered={false}>
                                <Row>
                                    <Icon type='tool' style={{ fontSize: 20, color: '#fff', marginRight: 15 }} />
                                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>SERVIÇOS</span>
                                </Row>
                            </Card>

                            <Table pagination={{ pageSize: 10 }} columns={columnsService} dataSource={this.state.services} size='small' rowKey={(prod) => prod._id} />

                        </>
                    )}

                </Modal>

                <Modal
                    visible={this.state.modalGenerate}
                    closable={false}
                    title={false}
                    footer={false}
                    centered
                >

                    <div style={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>

                        <Icon type='loading' style={{fontSize: 80}} />

                        <p style={{marginTop: 30, fontSize: 25, fontWeight: 'bold', marginBottom: -10}}>Gerando Boleto...</p>

                    </div>

                </Modal>

            </div>
        )
    }
}