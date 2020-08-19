import React, { useState, useEffect } from 'react';
import { Spin, Table, Button, Modal, Card, Select, Divider, TreeSelect, Statistic, Tooltip, Icon } from 'antd';
import api from '../../../../config/axios';
import moment from 'moment';
import '../../../../styles/style.css';

const { Option } = Select;
const { TreeNode } = TreeSelect;

export default function BoletoServicos() {

    const [spinner, setSpinner] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalSearch, setModalSearch] = useState(false);
    const [find, setFind] = useState(1);
    const [modalGenerate, setModalGenerate] = useState(false);
    const [modalVerify, setModalVerify] = useState(false);

    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');
    const [clientId, setClientId] = useState(null);
    const [clientName, setClientName] = useState(null);

    const [clients, setClients] = useState([]);
    const [pagamentos, setPagamentos] = useState([]);

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
        await api.post('/payments/listPaymentOrdersBoleto', {
            find: find, client: clientId, mes: mes, ano: ano
        }).then(response => {
            setPagamentos(response.data.payments)
            setLoading(false);
            setModalSearch(false);
            setSpinner(false);
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

    useEffect(() => {

        findClients();
        finder();

    }, []);

    async function handleClient(value) {
        const result = await clients.find(obj => obj.name === value);
        await setClientId(result._id);
        await setClientName(result.name);
    }

    function printBoleto(info) {
        window.open(info.boletoUrl, 'PrintPdf', `height=${window.screen.height}, width=${window.screen.width}`, 'fullscreen=yes');
    }

    async function generateBoletoOrder(id) {
        setModalGenerate(true);
        await api.post('/payments/gerBoletoOrdens', {
            idPayment: id
        }).then(response => {
            printBoleto(response.data.payment);
            setModalGenerate(false);
            finder();
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setModalGenerate(false);
        });
    }

    async function verifyPaymentOrder(id) {
        setModalVerify(true);
        await api.post('/payments/verifyPaymentOrder', {
            idPayment: id
        }).then(response => {
            info('Informação', response.data.message)
            setModalVerify(false);
            finder();
        }).catch(error => {
            erro('Erro', error.response.data.message)
            setModalVerify(false);
        });
    }

    const columnsPayment = [
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

    const DataAtual = new Date();
    const Ano = DataAtual.getFullYear();

    return (
        <Spin spinning={spinner} size='large'>

            <div style={{ marginBottom: 10, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                <Card size='small'>

                    {find === 1 && (
                        <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>Pagamentos do Mês Atual</strong></p>
                    )}
                    {find === 2 && (
                        <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>{`Pagamentos do mes: ${mes}; do ano: ${ano}`}</strong></p>
                    )}
                    {find === 3 && (
                        <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>{`Pagamentos do cliente: ${clientName}`}</strong></p>
                    )}

                </Card>

                <div style={{ display: 'flex', flexDirection: 'row' }}>

                    <Button icon='reload' type='default' style={{ marginRight: 10 }} onClick={() => finder()}>Atualizar Dados</Button>

                    <Button icon='search' type='primary' onClick={() => setModalSearch(true)}>Busca Avançada</Button>

                </div>

            </div>

            <Table pagination={{ pageSize: 10 }} columns={columnsPayment} dataSource={pagamentos} rowKey={(pay) => pay._id} size='small' rowClassName={(record) => moment(new Date(record.dateToPay)) < moment(new Date) && record.statusPay === 'wait' ? 'red-row' : ''}/>

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
                    <Option value={1}>Pagamentos em Aberto - Mês Atual</Option>
                    <Option value={2}>Pagamentos em Aberto - Por Mês</Option>
                    <Option value={3}>Pagamentos em Aberto - Por Clientes</Option>
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

                {find === 3 && (
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

        </Spin>
    )
}