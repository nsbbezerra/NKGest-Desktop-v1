import React, { useState, useEffect } from 'react';
import { Spin, Table, Button, Modal, Card, Select, Divider, TreeSelect, Statistic, Tooltip, Radio, Icon, Descriptions } from 'antd';
import api from '../../../../config/axios';
import moment from 'moment';
import '../../../../styles/style.css';

const { Option } = Select;
const { TreeNode } = TreeSelect;

export default function DepósitosServicos() {

    const [spinner, setSpinner] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalSearch, setModalSearch] = useState(false);
    const [modalStatusPayment, setModalStatusPayment] = useState(false);
    const [find, setFind] = useState(1);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');
    const [clientId, setClientId] = useState(null);
    const [clientName, setClientName] = useState(null);
    const [status, setStatus] = useState(null);

    const [clients, setClients] = useState([]);
    const [pagamentos, setPagamentos] = useState([]);
    const [idPagamento, setIdPagamento] = useState(null);

    const [clienteTitulo, setClienteTitulo] = useState('')
    const [descriptionsPay, setDescriptionsPay] = useState('');
    const [dataVencimento, setDataVencimento] = useState('');

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

    async function finder() {
        if (find === '') {
            warning('Atenção', 'Selecione uma opção de busca');
            return false;
        }
        setLoading(true);
        setSpinner(true);
        await api.post('/payments/listPaymentOrdersAccData', {
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

    async function handleChangeStatus(value) {
        await setIdPagamento(value._id);
        await setClienteTitulo(value.cliente.name);
        await setDescriptionsPay(value.title);
        await setDataVencimento(value.datePay);
        await setStatus(value.statusPay);
        setModalStatusPayment(true);
    }

    async function sendUpdateStatus() {
        setLoadingUpdate(true);
        await api.put(`/payments/changePaymentOrder/${idPagamento}`, {
            statusPay: status
        }).then(response => {
            success('Sucesso', response.data.message);
            setLoadingUpdate(false);
            finder();
            setModalStatusPayment(false);
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoadingUpdate(false);
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
                {value === 'wait' && (
                    <Tooltip placement='top' title='Clique para verificar pagamento'>
                        <Button type='link' size='small' style={{ backgroundColor: '#ffeb3b', color: '#444', width: '100%', fontWeight: 'bold' }} onClick={() => handleChangeStatus(id)}>Em Aberto</Button>
                    </Tooltip>
                )}
                {value === 'pay' && (
                    <Button type='link' size='small' style={{ backgroundColor: '#4caf50', color: '#fff', width: '100%', fontWeight: 'bold' }}>Pago</Button>
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
                    <Tooltip placement='top' title='Imprimir Boleto'>
                        <Button shape='circle' icon="barcode" type='primary' size='small' style={{ marginRight: 5 }} onClick={() => { }} />
                    </Tooltip>
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
                visible={modalStatusPayment}
                onCancel={() => setModalStatusPayment(false)}
                title="Alterar Status do Pagamento"
                footer={[
                    <Button key='back' icon='close' type='danger' onClick={() => setModalStatusPayment(false)}>
                        Cancelar
                    </Button>,
                    <Button key='submit' icon='save' type='primary' loading={loadingUpdate} onClick={() => sendUpdateStatus()}>
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

        </Spin>
    )
}