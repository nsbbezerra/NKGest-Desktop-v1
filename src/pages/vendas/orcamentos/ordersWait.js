import React, { useState, useEffect } from 'react';
import { Icon, Button, Row, Col, Input, Table, Card, TreeSelect, Divider, Tooltip, InputNumber, Modal, Select, Spin, Popconfirm, Statistic, Descriptions } from 'antd';
import { Header } from '../../../styles/styles';
import { Link } from 'react-router-dom';
import api from '../../../config/axios';
import PaymentModule from '../../../components/paymentsOrders';
import TemplatePrint from '../../../templates/printOrder';

const { TreeNode } = TreeSelect;
const { Option } = Select;

export default function Orcamentos() {

    const [spinner, setSpinner] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingSale, setLoadingSale] = useState(false);
    const [modalSearch, setModalSearch] = useState(false);
    const [modalSell, setModalSell] = useState(false);
    const [modalAuth, setModalAuth] = useState(false);
    const [loadingAutenticate, setLoadingAutenticate] = useState(false);
    const [dados, setDados] = useState({});
    const [modalSendSell, setModalSendSell] = useState(false);
    const [modalFinished, setModalFinished] = useState(false);
    const [modalDelSale, setModalDelSale] = useState(false);
    const [loadingDel, setLoadingDel] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [modalPrint, setModalPrint] = useState(false);

    const [clients, setClients] = useState([]);
    const [funcs, setFuncs] = useState([]);
    const [enderecos, setEnderecos] = useState([]);
    const [servicos, setServicos] = useState([]);

    const [searchType, setSearchType] = useState(null);
    const [funcionario, setFuncionario] = useState('');
    const [funcName, setFuncName] = useState('');
    const [cliente, setCliente] = useState('');
    const [clientName, setClientName] = useState('');
    const [mes2, setMes2] = useState('');
    const [dia, setDia] = useState('');
    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');

    const [orcaments, setOrcaments] = useState([]);
    const [ordem, setOrdem] = useState({});
    const [address, setAddress] = useState({});
    const [clientObj, setClientObj] = useState({});
    const [paymentsSale, setPaymentsSale] = useState([]);

    const [desconto, setDesconto] = useState(0);
    const [colorDesc, setColorDesc] = useState('#4caf50');

    const [userFunc, setUserFunc] = useState('');
    const [passFunc, setPassFunc] = useState('');

    const [totalOrdem, setTotalOrdem] = useState(0);
    const [totalOrdemLiquid, setTotalOrdemLiquid] = useState(0);
    const [servicesUpdate, setServicesUpdate] = useState([]);

    const [quantity, setQuantity] = useState(1);
    const [serviceId, setServiceId] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [totalUnit, setTotalUnit] = useState(0);

    const [desc, setDesc] = useState(0);
    const [liquid, setLiquid] = useState(0);
    const [brut, setBrut] = useState(0);
    const [orderFim, setOrderFim] = useState({});

    const [orderToDel, setOrderToDel] = useState('');
    const [veiculoCliente, setVeiculoCliente] = useState('');
    const [orderToSave, setOrderToSave] = useState('');
    const [nomeClientDesc, setNomeClientDesc] = useState('');

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

    function handleDelOrderSale(id) {
        setOrderToDel(id);
        setModalDelSale(true);
    }

    async function delOrderOrcament() {
        setLoadingDel(true);
        await api.delete(`/orders/delOrderSale/${orderToDel}`).then(response => {
            success('Sucesso', response.data.message);
            setLoadingDel(false);
            setModalDelSale(false);
            setOrcaments([]);
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoadingDel(false);
            setModalDelSale(false);
        });
    }

    async function sendFinder() {
        if (searchType === null) {
            warning('Atenção', 'Selecione uma opção de busca');
            return false;
        }
        setLoading(true);
        await api.post('/orders/findOrcamentsOrders', {
            type: searchType, funcionario: funcionario, cliente: cliente, data: `${dia}/${mes}/${ano}`, mes: mes2, ano: ano
        }).then(response => {
            setOrcaments(response.data.order);
            setLoading(false);
            setModalSearch(false);
            setSearchType(null);
            setAno('');
            setMes('');
            setDia('');
            setFuncionario('');
            setCliente('');
            setFuncName('');
            setClientName('');
            setMes2('');
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoading(false);
            setModalSearch(false);
        });
    }

    async function convertToSale() {
        setLoadingSale(true);
        await api.put(`/orders/convertOrderToSale/${ordem._id}`, {
            client: clientObj._id, services: servicesUpdate, desconto: desconto, valueLiquido: totalOrdemLiquid, valueBruto: totalOrdem
        }).then(response => {
            setDesc(response.data.order.desconto);
            setLiquid(response.data.order.valueLiquido);
            setBrut(response.data.order.valueBruto);
            setOrderFim(response.data.order);
            setModalSell(false);
            setModalSendSell(true);
            setLoadingSale(false);
            if (response.data.message) {
                info(response.data.message);
            }
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoadingSale(false);
        });
    }

    function info(message) {
        Modal.info({
            title: 'Informação',
            content: (
                <div>
                    <p>{message}</p>
                </div>
            ),
            onOk() { },
        });
    }

    async function handleFinished() {
        setModalFinished(false);
        await allClear();
        await setOrcaments([]);
    }

    async function allClear() {
        await setOrderFim({}); await setDesconto(0); await setDesc(0); await setLiquid(0); await setBrut(0); await setPaymentsSale([]);
    }

    async function FindPayments() {
        await api.post('/orders/findPayFormOrder', {
            order: ordem._id
        }).then(response => {
            setPaymentsSale(response.data.pagamentos);
            setModalFinished(true);
        }).catch(error => {
            erro('Erro', error.response.data.message);
        });
    }

    async function saveOrcamento() {
        setLoadingSave(true);
        await api.put(`/orders/saveOrderService/${orderToSave}`, {
            services: servicesUpdate, desconto: desconto, valueLiquido: totalOrdemLiquid, valueBruto: totalOrdem
        }).then(response => {
            success('Sucesso', response.data.message);
            setLoadingSave(false);
            setOrcaments([]);
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoadingSave(false);
        });
    }

    async function handleService(value) {
        const result = await servicos.find(obj => obj.name === value);
        await setServiceId(result._id);
        await setServiceName(result.name);
        await setTotalUnit(result.value);
    }

    async function setToTable() {
        if (serviceId === '') {
            warning('Atenção', 'Selecione um serviço');
            return false;
        }
        const total = totalUnit * quantity;
        const info = await { quantity: quantity, service: serviceId, name: serviceName, valueUnit: totalUnit, valueTotal: total };
        await setServicesUpdate([...servicesUpdate, info]);
        await setServiceId('');
        await setServiceName('');
        await setQuantity(1);
        await setTotalUnit(0);
    }

    async function delServiceTable(id) {
        const dataSource = await [...servicesUpdate];
        setServicesUpdate(dataSource.filter(item => item.service !== id));
    }

    async function findFunc() {
        setSpinner(true);
        await api.get('/admin/findFuncionariosComissioned').then(response => {
            setFuncs(response.data.funcionarios);
            setSpinner(false);
        }).catch(error => {
            erro('Erro', error.message);
            setSpinner(false);
        });
    }

    useEffect(() => {

        finders();
        findFunc();
        findDados();

    }, []);

    useEffect(() => {

        if (servicesUpdate.length) {

            var valores = servicesUpdate.filter(valor => {
                return valor.valueTotal;
            });

            var calculo = valores.reduce((sum, valor) => {
                return sum + valor.valueTotal;
            }, 0);

            setTotalOrdem(parseFloat(calculo.toFixed(2)));
            setTotalOrdemLiquid(parseFloat(calculo.toFixed(2)));

        } else {
            setTotalOrdem(0);
            setTotalOrdemLiquid(0);
        }

    }, [servicesUpdate]);

    useEffect(() => {

        if (Number.isNaN(desconto)) {
            setDesconto(0);
        }
        if (desconto > 20) {
            setColorDesc('#f44336');
        }
        if (desconto <= 20) {
            setColorDesc('#4caf50');
        }

    }, [desconto]);

    useEffect(() => {
        if (totalOrdemLiquid > totalOrdem) {
            setTotalOrdemLiquid(totalOrdem);
        }
        const percent = totalOrdemLiquid / totalOrdem * 100;
        const sobra = 100 - percent;
        setDesconto(parseFloat(sobra.toFixed(2)));
    }, [totalOrdemLiquid]);

    function handleCancel() {
        setModalSearch(false);
        setSearchType(null);
        setAno('');
        setMes('');
        setDia('');
        setFuncionario('');
        setCliente('');
        setFuncName('');
        setMes2('');
        setClientName('');
    }

    async function findDados() {
        setSpinner(true);
        await api.get('/organization/find').then(response => {
            setDados(response.data.empresa);
            setSpinner(false);
        }).catch(error => {
            erro('Erro', error.message);
            setSpinner(false);
        });
    }

    async function finders() {
        setSpinner(true);
        await api.get('/orders/listsOrcamentOrderService').then(response => {
            setClients(response.data.clients);
            setEnderecos(response.data.address);
            setServicos(response.data.services);
            setSpinner(false);
        }).catch(error => {
            erro('Erro', error.message);
            setSpinner(false);
        })
    }

    async function handleCliente(value) {
        const result = await clients.find(obj => obj.name === value);
        await setCliente(result._id);
        await setClientName(result.name);
    }

    async function handleVendedor(value) {
        const result = await funcs.find(obj => obj.name === value);
        await setFuncionario(result._id);
        await setFuncName(result.name);
    }

    async function handleOrder(id) {
        const result = await orcaments.find(obj => obj._id === id);
        const ender = await enderecos.find(obj => obj.client._id === result.client._id);
        const clienteObj = await clients.find(obj => obj._id === result.client._id);
        await setOrdem(result);
        if (!ender) {
            await setAddress({ street: '', number: '', comp: '', bairro: '', city: '', cep: '', state: '' });
        } else {
            await setAddress(ender);
        }
        await setTotalOrdemLiquid(result.valueLiquido);
        await setOrderToSave(result._id);
        await setVeiculoCliente(result.veicles.model);
        await setTotalOrdem(result.valueBruto);
        await setServicesUpdate(result.services);
        await setNomeClientDesc(clientObj.name);
        await setClientObj(clienteObj);
        setModalSell(true);
    }

    async function handleAutenticate() {
        setLoadingAutenticate(true);
        await api.post('/orders/autenticate', {
            user: userFunc, password: passFunc
        }).then(response => {
            setModalAuth(false);
            setLoadingAutenticate(false);
            setUserFunc('');
            setPassFunc('');
            convertToSale();
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoadingAutenticate(false);
            setDesconto(0);
        });
    }

    function handleSaveSellInfo() {
        if (desconto > 20) {
            setModalAuth(true);
            return false;
        }
        convertToSale();
    }

    function handleDesconto() {
        setDesconto(0);
        setModalAuth(false);
    }

    function handleConfirm() {
        setModalSendSell(false);
        FindPayments();
    }

    function handleClosePrintModal() {
        allClear();
        finders();
        setModalPrint(false);
    }

    const DataAtual = new Date();
    const Ano = DataAtual.getFullYear();

    const columnsPayment = [
        {
            title: 'Titulo',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Valor (R$)',
            dataIndex: 'value',
            key: 'value',
            width: '20%',
            render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15.5 }} prefix='R$' precision={2} />,
            align: 'right'
        },
        {
            title: 'Vencimento',
            dataIndex: 'datePay',
            key: 'datePay',
            width: '12%',
        }
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
            width: '15%',
            align: 'right'
        },
        {
            title: 'Valor Tot',
            dataIndex: 'valueTotal',
            key: 'valueTotal',
            render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15.5 }} prefix='R$' precision={2} />,
            width: '15%',
            align: 'right'
        },
        {
            title: '',
            dataIndex: '_id',
            key: '_id',
            width: '6%',
            render: (id) => <>
                <Popconfirm title='Deseja remover este item?' okText='Sim' cancelText='Não' onConfirm={() => delServiceTable(id)}>
                    <Icon type='close' style={{ color: 'red' }} />
                </Popconfirm>
            </>,
            align: 'center'
        }
    ];

    const columnsService2 = [
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
            width: '15%',
            align: 'right'
        },
        {
            title: 'Valor Tot',
            dataIndex: 'valueTotal',
            key: 'valueTotal',
            render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15.5 }} prefix='R$' precision={2} />,
            width: '15%',
            align: 'right'
        }
    ];

    const columns = [
        {
            title: 'Nº',
            dataIndex: 'number',
            key: 'number',
            width: '5%',
            align: 'center'
        },
        {
            title: 'Cliente',
            dataIndex: 'client.name',
            key: 'client.name',
        },
        {
            title: 'Veículo',
            dataIndex: 'veicles.model',
            key: 'veicles.model',
        },
        {
            title: 'Valor Bruto(R$)',
            dataIndex: 'valueBruto',
            key: 'valueBruto',
            render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15.5 }} prefix='R$' precision={2} />,
            width: '12%',
            align: 'right'
        },
        {
            title: 'Desconto (%)',
            dataIndex: 'desconto',
            key: 'desconto',
            render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15.5 }} prefix='%' />,
            width: '12%',
            align: 'right'
        },
        {
            title: 'Valor (R$)',
            dataIndex: 'valueLiquido',
            key: 'valueLiquido',
            render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15.5 }} prefix='R$' precision={2} />,
            width: '12%',
            align: 'right'
        },
        {
            title: 'Data',
            dataIndex: 'createDate',
            key: 'createDate',
            width: '12%',
            align: 'center'
        },
        {
            title: 'Ações',
            dataIndex: '_id',
            key: '_id',
            width: '6%',
            render: (id) => <>
                <Tooltip placement='top' title='Visualizar Ordem'>
                    <Button shape="circle" icon="search" size='small' style={{ marginRight: 5 }} type='primary' onClick={() => handleOrder(id)} />
                </Tooltip>
                <Tooltip placement='top' title='Excluir Ordem'>
                    <Button shape="circle" icon="close" size='small' type='danger' onClick={() => handleDelOrderSale(id)} />
                </Tooltip>
            </>,
            align: 'center'
        }
    ];

    const dataResume = [
        {
            key: '1',
            info: 'TOTAL BRUTO',
            value: `R$ ${brut}`
        },
        {
            key: '2',
            info: 'DESCONTO',
            value: `% ${desc}`
        },
        {
            key: '3',
            info: 'TOTAL A PAGAR',
            value: `R$ ${liquid}`
        },

    ];

    const columnsResume = [
        {
            title: 'Informações',
            dataIndex: 'info',
            key: 'info',
            width: '70%',
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            key: 'value',
            align: 'right'
        },
    ]

    return (
        <>
            <Header>
                <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='container' style={{ fontSize: 20 }} /> ORÇAMENTO DE ORDENS DE SERVIÇO</p>
                <div style={{ display: 'flex', flexDirection: 'row', position: 'absolute', right: 0, alignItems: 'center' }}>
                    <Link to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
                </div>
            </Header>

            <div style={{ marginTop: 15, overflow: 'hidden', height: '91%' }}>

                <Button type='primary' icon='search' onClick={() => setModalSearch(true)}>Busca Avançada</Button>

                <Spin spinning={spinner} size='large'>

                    <Table pagination={{ pageSize: 10 }} columns={columns} dataSource={orcaments} size='small' style={{ marginTop: 10 }} rowKey={(orca) => orca._id} />

                </Spin>

            </div>

            <Modal
                visible={modalSearch}
                title="Busca Avançada"
                onCancel={() => handleCancel()}
                footer={[
                    <Button key="back" icon='close' type='danger' onClick={() => handleCancel()}>
                        Cancelar
                    </Button>,
                    <Button key="submit" icon='search' type="primary" loading={loading} onClick={() => sendFinder()}>
                        Buscar
                    </Button>,
                ]}
                width='50%'
            >

                <label>Selecione uma opção:</label>
                <Select value={searchType} style={{ width: '100%' }} onChange={(value) => setSearchType(value)}>
                    <Option value={1}>Buscar por Vendedor</Option>
                    <Option value={2}>Buscar por Cliente</Option>
                    <Option value={3}>Buscar por Data</Option>
                    <Option value={4}>Buscar por Período</Option>
                </Select>

                {searchType === 1 && (
                    <>
                        <Divider>Selecione o Vendedor</Divider>
                        <TreeSelect
                            showSearch
                            style={{ width: '100%', marginBottom: 20 }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            value={funcName}
                            treeDefaultExpandAll
                            onChange={(value) => handleVendedor(value)}
                        >

                            {funcs.map(fun => (
                                <TreeNode value={fun.name} title={fun.name} key={fun._id} />
                            ))}

                        </TreeSelect>
                    </>
                )}

                {searchType === 2 && (
                    <>
                        <Divider>Selecione o Cliente</Divider>
                        <TreeSelect
                            showSearch
                            style={{ width: '100%', marginBottom: 20 }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            value={clientName}
                            treeDefaultExpandAll
                            onChange={(value) => handleCliente(value)}
                        >

                            {clients.map(cli => (
                                <TreeNode value={cli.name} title={cli.name} key={cli._id} />
                            ))}

                        </TreeSelect>
                    </>
                )}

                {searchType === 3 && (
                    <>
                        <Divider>Selecione a Data</Divider>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                            <Select value={dia} style={{ width: 100, marginRight: 10 }} onChange={(value) => setDia(value)}>
                                <Option value='1'>1</Option>
                                <Option value='2'>2</Option>
                                <Option value='3'>3</Option>
                                <Option value='4'>4</Option>
                                <Option value='5'>5</Option>
                                <Option value='6'>6</Option>
                                <Option value='7'>7</Option>
                                <Option value='8'>8</Option>
                                <Option value='9'>9</Option>
                                <Option value='10'>10</Option>
                                <Option value='11'>11</Option>
                                <Option value='12'>12</Option>
                                <Option value='13'>13</Option>
                                <Option value='14'>14</Option>
                                <Option value='15'>15</Option>
                                <Option value='16'>16</Option>
                                <Option value='17'>17</Option>
                                <Option value='18'>18</Option>
                                <Option value='19'>19</Option>
                                <Option value='20'>20</Option>
                                <Option value='21'>21</Option>
                                <Option value='22'>22</Option>
                                <Option value='23'>23</Option>
                                <Option value='24'>24</Option>
                                <Option value='25'>25</Option>
                                <Option value='26'>26</Option>
                                <Option value='27'>27</Option>
                                <Option value='28'>28</Option>
                                <Option value='29'>29</Option>
                                <Option value='30'>30</Option>
                                <Option value='31'>31</Option>
                            </Select>

                            <Select value={mes} style={{ width: 150, marginRight: 10 }} onChange={(value) => setMes(value)}>
                                <Option value='1'>Janeiro</Option>
                                <Option value='2'>Fevereiro</Option>
                                <Option value='3'>Março</Option>
                                <Option value='4'>Abril</Option>
                                <Option value='5'>Maio</Option>
                                <Option value='6'>Junho</Option>
                                <Option value='7'>Julho</Option>
                                <Option value='8'>Agosto</Option>
                                <Option value='9'>Setembro</Option>
                                <Option value='10'>Outubro</Option>
                                <Option value='11'>Novembro</Option>
                                <Option value='12'>Dezembro</Option>
                            </Select>

                            <Select value={ano} style={{ width: 100 }} onChange={(value) => setAno(value)}>
                                <Option value={Ano - 1}>{Ano - 1}</Option>
                                <Option value={Ano}>{Ano}</Option>
                                <Option value={Ano + 1}>{Ano + 1}</Option>
                                <Option value={Ano + 2}>{Ano + 2}</Option>
                                <Option value={Ano + 3}>{Ano + 3}</Option>
                            </Select>

                        </div>
                    </>
                )}

                {searchType === 4 && (
                    <>
                        <Divider>Selecione o Período</Divider>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Select value={mes2} style={{ width: 150, marginRight: 10 }} onChange={(value) => setMes2(value)}>
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

                            <Select value={ano} style={{ width: 100 }} onChange={(value) => setAno(value)}>
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

            <Modal
                visible={modalSell}
                title="Finalizar a Ordem de Serviço"
                onCancel={() => setModalSell(false)}
                footer={false}
                width='95%'
                bodyStyle={{ padding: 3 }}
                style={{ top: 20 }}
            >

                <Row gutter={8} style={{ height: '100%' }}>

                    <Col span={17} style={{ height: '100%', overflowX: 'hidden' }}>

                        <Spin spinning={spinner} size='large'>

                            <Card size='small' style={{ height: '100%' }} bordered={false}>

                                <Row gutter={8}>

                                    <Col span={16}>

                                        <label>Cliente</label>
                                        <Input type='text' size='large' value={clientObj.name} readOnly />

                                    </Col>

                                    <Col span={8}>

                                        <label>Veículo</label>
                                        <Input type='text' size='large' value={veiculoCliente} readOnly />

                                    </Col>

                                </Row>

                                <Row>

                                    <Col span={24} style={{ overflow: 'auto', overflowX: 'hidden', marginTop: 10 }}>

                                        <Row gutter={8}>

                                            <Col span={3}>

                                                <label>Quantidade</label>
                                                <Input type='number' value={quantity} onChange={(e) => setQuantity(e.target.value)} />

                                            </Col>

                                            <Col span={18}>

                                                <label>Selecione o serviço</label>
                                                <TreeSelect
                                                    showSearch
                                                    style={{ width: '100%', marginBottom: 20 }}
                                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                    value={serviceName}
                                                    treeDefaultExpandAll
                                                    onChange={(value) => handleService(value)}
                                                >

                                                    {servicos.map(ser => (
                                                        <TreeNode value={ser.name} title={ser.name} key={ser._id} />
                                                    ))}

                                                </TreeSelect>

                                            </Col>

                                            <Col span={3}>

                                                <label style={{ color: 'transparent' }}>Add</label>
                                                <Button style={{ width: '100%' }} type='primary' icon='plus' onClick={() => setToTable()}>Add</Button>

                                            </Col>

                                        </Row>

                                        <Row>

                                            <Col span={24} style={{ overflow: 'auto' }}>

                                                <Table pagination={{ pageSize: 7 }} columns={columnsService} dataSource={servicesUpdate} size='small' rowKey={(chave) => chave.service} />

                                            </Col>

                                        </Row>

                                    </Col>

                                </Row>

                            </Card>

                        </Spin>

                    </Col>

                    <Col span={7} style={{ height: '100%', borderLeft: '1px solid lightgray' }}>

                        <Card size='small' style={{ height: '100%' }} bordered={false}>

                            <Row gutter={8} style={{ minHeight: 240 }}>

                                <Col span={24} style={{ marginBottom: -5 }}>

                                    <Card size='small' bordered={false} style={{ backgroundColor: '#f8f8f8' }} title='Dados do cliente' headStyle={{ backgroundColor: '#001529', color: '#fff', fontWeight: 'bold' }}>

                                        <Row >
                                            <Col span={24} style={{ marginBottom: -10 }}>
                                                <label style={{ fontSize: 12 }}>CPF / CNPJ</label>
                                                <p style={{ fontWeight: 'bold', fontSize: 14 }}>{clientObj.cpf_cnpj}</p>
                                            </Col>
                                        </Row>

                                        <Row gutter={8}>
                                            <Col span={19} style={{ marginBottom: -10 }}>
                                                <label style={{ fontSize: 12 }}>Endereço</label>
                                                <p style={{ fontWeight: 'bold', fontSize: 14 }}>{address.street}</p>
                                            </Col>
                                            <Col span={4} style={{ marginBottom: -10 }}>
                                                <label style={{ display: 'block', width: '100%', textAlign: 'right', fontSize: 12 }}>Número</label>
                                                <p style={{ fontWeight: 'bold', width: '100%', textAlign: 'right', fontSize: 14 }}>{address.number}</p>
                                            </Col>
                                        </Row>

                                        <Row gutter={8}>
                                            <Col span={19} style={{ marginBottom: -10 }}>
                                                <label style={{ fontSize: 12 }}>Cidade</label>
                                                <p style={{ fontWeight: 'bold' }}>{address.city}</p>
                                            </Col>
                                            <Col span={4} style={{ marginBottom: -10 }}>
                                                <label style={{ display: 'block', width: '100%', textAlign: 'right', fontSize: 12 }}>UF</label>
                                                <p style={{ fontWeight: 'bold', width: '100%', textAlign: 'right', fontSize: 14 }}>{address.state}</p>
                                            </Col>
                                        </Row>

                                        <Row gutter={8}>
                                            <Col span={12} style={{ marginBottom: -10 }}>
                                                <label style={{ fontSize: 12 }}>Telefone Comercial</label>
                                                <p style={{ fontWeight: 'bold', fontSize: 14 }}>{clientObj.phoneComercial}</p>
                                            </Col>

                                            <Col span={11} style={{ marginBottom: -10 }}>
                                                <label style={{ display: 'block', width: '100%', textAlign: 'right', fontSize: 12 }}>Telefone Celular</label>
                                                <p style={{ fontWeight: 'bold', width: '100%', textAlign: 'right', fontSize: 14 }}>{clientObj.celOne}</p>
                                            </Col>
                                        </Row>

                                    </Card>

                                </Col>

                            </Row>

                            <Row gutter={8} style={{ marginTop: 15 }}>

                                <Col span={24}>

                                    <label>Total Bruto</label>
                                    <InputNumber
                                        value={totalOrdem}
                                        min={0}
                                        formatter={value => `R$ ${value}`}
                                        parser={value => value.replace('R$', '')}
                                        onChange={() => { }}
                                        style={{ width: '100%', backgroundColor: '#001529', color: '#fff', fontWeight: 'bold' }}
                                        readOnly
                                        size='large'
                                    />

                                </Col>

                            </Row>

                            <Row gutter={8} style={{ marginTop: 5 }}>

                                <Col span={10}>
                                    <label>Desconto</label>
                                    <InputNumber
                                        value={desconto}
                                        min={0}
                                        formatter={value => `${value} %`}
                                        parser={value => value.replace('%', '')}
                                        onChange={() => { }}
                                        style={{ backgroundColor: colorDesc, width: '100%' }}
                                        readOnly
                                        size='large'
                                    />

                                </Col>

                                <Col span={14}>
                                    <label>Total Líquido</label>
                                    <Input type='number' addonBefore='R$' size='large' value={totalOrdemLiquid} onChange={(e) => setTotalOrdemLiquid(e.target.value)} />
                                </Col>

                            </Row>

                            <Row gutter={8} style={{ marginTop: 10 }}>

                                <Col span={12}>

                                    <Button size='large' type='default' icon='save' loading={loadingSave} style={{ width: '100%' }}
                                        onClick={() => saveOrcamento()}
                                    >Salvar</Button>

                                </Col>

                                <Col span={12}>

                                    <Button size='large' type='primary' icon='check' style={{ width: '100%' }}
                                        loading={loadingSale} onClick={() => handleSaveSellInfo()}
                                    >Finalizar</Button>

                                </Col>

                            </Row>

                        </Card>

                    </Col>

                </Row>

            </Modal>

            <Modal
                visible={modalAuth}
                title="Senha administrativa"
                closable={false}
                footer={[
                    <Button key="back" icon='close' type='danger' onClick={() => handleDesconto()}>
                        Cancelar
                        </Button>,
                    <Button key="submit" icon='key' type="primary" loading={loadingAutenticate} onClick={() => handleAutenticate()}>
                        Verificar
                    </Button>,
                ]}
                width='40%'
            >

                <Row>

                    <Col span={24}>

                        <label>Usuário</label>
                        <Input type='text' value={userFunc} onChange={(e) => setUserFunc(e.target.value)} />

                    </Col>

                </Row>

                <Row style={{ marginTop: 10 }}>

                    <Col span={24}>

                        <label>Senha</label>
                        <Input.Password value={passFunc} onChange={(e) => setPassFunc(e.target.value)} />

                    </Col>

                </Row>

                <p style={{ width: '100%', color: '#f44336', fontWeight: 'bold', marginTop: 10, textAlign: 'center' }}>A porcentagem de desconto é maior do que o permitido, por favor contate seu gerente para a autorização desta operação</p>

            </Modal>

            <Modal
                visible={modalSendSell}
                title="Finalizar Venda"
                closable={false}
                footer={false}
                width='90%'
                centered
            >

                {modalSendSell === true && (
                    <PaymentModule price={ordem.valueLiquido} idSale={ordem._id} brut={ordem.valueBruto} desc={ordem.desconto} confirm={handleConfirm} />
                )}

            </Modal>

            <Modal
                visible={modalFinished}
                title="Informações da Venda"
                closable={false}
                footer={[
                    <Button key="submit" type="danger" icon='close' loading={loading} onClick={() => handleFinished()}>
                        Fechar
                    </Button>,
                    <Button key="print" icon='printer' type="primary" loading={loading} onClick={() => setModalPrint(true)}>
                        Imprimir Ordem de Serviço
                    </Button>,
                ]}
                width='70%'
                style={{ top: 20 }}
            >

                <Card size='small' bodyStyle={{ backgroundColor: '#4caf50', color: '#FFF', borderRadius: 5 }} bordered={false}>

                    <p style={{ fontSize: 17, fontWeight: 'bold', width: '100%', textAlign: 'center', marginBottom: -2.5 }}><Icon type='check' style={{ color: 'white' }} /> Processo concluído com sucesso!</p>

                </Card>

                <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>CLIENTE</Divider>
                <Descriptions bordered size='small'>
                    <Descriptions.Item span={3} label='Nome'>
                        {nomeClientDesc}
                    </Descriptions.Item>
                </Descriptions>

                <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>SERVIÇOS</Divider>
                <Table pagination={false} columns={columnsService2} dataSource={servicesUpdate} size='small' rowKey={(chave) => chave.service} />

                {!!paymentsSale.length && (
                    <>
                        <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>PAGAMENTOS</Divider>
                        <Table pagination={false} columns={columnsPayment} dataSource={paymentsSale} size='small' rowKey={(prod) => prod._id} style={{ marginTop: 10 }} />
                    </>
                )}

                <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>RESUMO</Divider>
                <Table pagination={false} columns={columnsResume} dataSource={dataResume} size='small' showHeader={false} />

            </Modal>

            <Modal
                visible={modalDelSale}
                title="Excluir Ordem de Serviço"
                closable={false}
                footer={[
                    <Button key="back" icon='close' type='danger' onClick={() => setModalDelSale(false)}>
                        Não
                        </Button>,
                    <Button key="submit" icon='check' type="primary" loading={loadingDel} onClick={() => delOrderOrcament()}>
                        Sim
                    </Button>,
                ]}
            >

                <p>Deseja excluir esta ordem de serviço?</p>

            </Modal>

            <Modal
                visible={modalPrint}
                title="Imprimir"
                onCancel={() => handleClosePrintModal()}
                footer={false}
                width='30%'
                centered
            >

                {modalPrint === true && (
                    <TemplatePrint empresa={dados} cliente={clientObj} endereco={address} venda={orderFim} />
                )}

            </Modal>

        </>
    )
}