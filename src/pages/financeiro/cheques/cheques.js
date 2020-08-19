import React, { useState, useEffect } from 'react';
import { Icon, Button, Table, Tabs, Tooltip, Modal, Row, Col, Select, TreeSelect, Input, Radio, Spin, Statistic, DatePicker } from 'antd';
import { Header } from '../../../styles/styles';
import { Link } from 'react-router-dom';
import api from '../../../config/axios';
import moment from 'moment';
import '../../../styles/style.css';

import CadastrarContas from './cadastrar';

const { TabPane } = Tabs;
const { Option } = Select;
const { TreeNode } = TreeSelect;
const { TextArea } = Input;

function EditCheques() {

    const [modalEditInfo, setModalEditInfo] = useState(false);
    const [modalDel, setModalDel] = useState(false);
    const [modalConfirm, setModalConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const [cheques, setCheques] = useState([]);
    const [clientes, setClientes] = useState([]);

    const [chequeId, setChequeId] = useState('');
    const [clientId, setClientID] = useState('');
    const [clientName, setClientName] = useState('');
    const [tipo, setTipo] = useState('');
    const [numero, setNumero] = useState('');
    const [entidade, setEntidade] = useState('');
    const [situacao, setSituacao] = useState('');
    const [valor, setValor] = useState('');
    const [emissao, setEmissao] = useState('');
    const [vencimento, setVencimento] = useState('');
    const [obs, setObs] = useState('');

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

    async function findCheques() {

        setSpinner(true);

        await api.get('/financial/findCheques').then(response => {
            setCheques(response.data.cheques);
            setSpinner(false);
        }).catch(error => {
            erro('Erro', error.message);
            setSpinner(false);
        });

    }

    async function FindClients() {
        setSpinner(true);
        await api.get('/register/listClientes').then(response => {
            setClientes(response.data.clientes);
            setSpinner(false);
        }).catch(error => {
            setSpinner(false);
            erro('Erro', error.message);
        })
    }

    async function editCheque() {

        setLoading(true);

        await api.put(`/financial/editCheques/${chequeId}`, {
            client: clientId, number: numero, entity: entidade, situation: situacao, value: valor, emitDate: emissao, vencimento: vencimento, obs: obs, type: tipo
        }).then(response => {
            success('Sucesso', response.data.message);
            setClientID('');
            setClientName('');
            setNumero('');
            setEntidade('');
            setEmissao('');
            setSituacao('');
            setValor('');
            setVencimento('');
            setObs('');
            setTipo('');
            setLoading(false);
            setModalEditInfo(false);
            findCheques();
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoading(false);
            setModalEditInfo(false);
        });

    }

    async function sendUpdateSituation() {
        setLoading(true);
        await api.put(`/financial/editChequeSituation/${chequeId}`, {
            situation: situacao
        }).then(response => {
            success('Sucesso', response.data.message);
            setModalConfirm(false);
            setLoading(false)
            findCheques();
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setModalConfirm(false);
            setLoading(false)
        })
    }

    async function sendDelCheque() {

        setLoading(true);

        await api.delete(`/financial/delCheques/${chequeId}`).then(response => {
            success('Sucesso', response.data.message);
            setModalDel(false)
            setLoading(false);
            findCheques();
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setModalDel(false)
            setLoading(false);
        });

    }

    useEffect(() => {

        findCheques();
        FindClients();
        
    }, []);

    async function handleSituation(id) {
        setChequeId(id._id);
        setSituacao(id.situation);
        setModalConfirm(true);
    }

    async function handleCliente(value) {
        const result = await clientes.find(obj => obj.name === value);
        await setClientID(result._id);
        await setClientName(result.name);
    }

    async function handleCheque(value) {

        const result = await cheques.find(obj => obj._id === value);
        await setChequeId(value);
        await setClientID(result.client._id);
        await setClientName(result.client.name);
        await setTipo(result.type);
        await setEmissao(result.emitDate);
        await setEntidade(result.entity);
        await setNumero(result.number);
        await setObs(result.obs);
        await setSituacao(result.situation);
        await setValor(result.value);
        await setVencimento(result.vencimento);
        setModalEditInfo(true);

    }

    async function handleDelCheque(id) {

        await setChequeId(id);
        setModalDel(true);

    }

    const columns = [
        {
            title: 'Tipo',
            dataIndex: 'type',
            key: 'type',
            render: (type) => <>
                {type === 'prazo' && (
                    <Button size='small' style={{ width: '100%' }} type='link'>À prazo</Button>
                )}
                {type === 'vista' && (
                    <Button size='small' style={{ width: '100%' }} type='link'>À vista</Button>
                )}
            </>
        },
        {
            title: 'Cliente',
            dataIndex: 'client.name',
            key: 'client.name',
        },
        {
            title: 'Número',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: 'Entidade',
            dataIndex: 'entity',
            key: 'entity',
        },
        {
            title: 'Emissão',
            dataIndex: 'emitDate',
            key: 'emitDate',
            render: (data) => <p style={{marginBottom: -2}}>{moment(new Date(data)).format('DD/MM/YYYY')}</p>
        },
        {
            title: 'Vencimento',
            dataIndex: 'vencimento',
            key: 'vencimento',
            render: (data) => <p style={{marginBottom: -2}}>{moment(new Date(data)).format('DD/MM/YYYY')}</p>
        },
        {
            title: 'Valor (R$)',
            dataIndex: 'value',
            render: (value) => <Statistic value={value} valueStyle={{fontSize: 15.5}} prefix='R$' precision={2}/>,
            key: 'value',
        },
        {
            title: 'Situação',
            dataIndex: 'situation',
            key: 'situation',
            render: (situation, id) => <>
                {situation === 'done' && (
                    <Button size='small' style={{ width: '100%', backgroundColor: '#4caf50', color: '#fff', fontWeight: 'bold' }} type='link' onClick={() => handleSituation(id)} >Compensado</Button>
                )}
                {situation === 'wait' && (
                    <Button size='small' style={{ width: '100%', backgroundColor: '#ffeb3b', color: '#222', fontWeight: 'bold' }} type='link' onClick={() => handleSituation(id)} >Aguardando</Button>
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
                <Tooltip placement='top' title='Editar'>
                    <Button shape="circle" icon="edit" type='primary' size='small' style={{ marginRight: 5 }} onClick={() => handleCheque(id)} />
                </Tooltip>
                <Tooltip placement='top' title='Excluir'>
                    <Button shape="circle" icon="close" type='danger' size='small' style={{ marginRight: 5 }} onClick={() => handleDelCheque(id)} />
                </Tooltip>
            </>,
            width: '9%',
            align: 'center'
        }
    ];

    return (

        <div style={{ height: '100%' }}>
            <Header>
                <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='file-search' style={{ fontSize: 20 }} /> CONTROLE DE CHEQUES</p>
                <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
            </Header>

            <div style={{ marginTop: 10 }}>

                <Tabs defaultActiveKey="1" tabPosition='left' type='card'>

                    <TabPane tab="Listagem" key="1">

                        <Spin spinning={spinner} size='large'>

                            <Button type='default' icon='redo' onClick={() => findCheques()} style={{ marginBottom: 10 }}>Atualizar</Button>

                            <Table pagination={{ pageSize: 10 }} columns={columns} dataSource={cheques} rowKey={(chek) => chek._id} size='small' rowClassName={(record) => moment(new Date(record.vencimento)) < moment(new Date) && record.situation === 'wait' ? 'red-row' : ''}/>

                        </Spin>

                    </TabPane>

                    <TabPane tab="Cadastrar" key="2">

                        <CadastrarContas />

                    </TabPane>

                </Tabs>

            </div>

            <Modal
                title="Alterar Informações"
                visible={modalEditInfo}
                onCancel={() => setModalEditInfo(false)}
                footer={[
                    <Button key="back" icon='close' type='danger' onClick={() => setModalEditInfo(false)}>
                        Cancelar
                        </Button>,
                    <Button key="submit" icon='save' type="primary" loading={loading} onClick={() => editCheque()}>
                        Salvar
                    </Button>,
                ]}
                width='80%'
            >

                <Row gutter={8}>

                    <Col span={4}>

                        <label>Tipo<span style={{ color: 'red' }}>*</span></label>
                        <Select value={tipo} style={{ width: '100%' }} onChange={(value) => setTipo(value)}>
                            <Option value='vista'>À vista</Option>
                            <Option value='prazo'>À prazo</Option>
                        </Select>

                    </Col>

                    <Col span={6}>

                        <label>Número<span style={{ color: 'red' }}>*</span></label>
                        <Input type='number' onChange={(e) => setNumero(e.target.value)} value={numero} />

                    </Col>

                    <Col span={4}>

                        <label>Entidade<span style={{ color: 'red' }}>*</span></label>
                        <Input type='text' onChange={(e) => setEntidade(e.target.value.toUpperCase())} value={entidade} />

                    </Col>

                    <Col span={10}>

                        <label>Cliente<span style={{ color: 'red' }}>*</span></label>
                        <TreeSelect
                            showSearch
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            value={clientName}
                            treeDefaultExpandAll
                            onChange={(value) => handleCliente(value)}
                        >

                            {clientes.map(client => (

                                <TreeNode value={client.name} title={client.name} key={client._id} />

                            ))}

                        </TreeSelect>

                    </Col>

                </Row>

                <Row gutter={8} style={{ marginTop: 10 }}>

                    <Col span={6}>

                        <label>Situação<span style={{ color: 'red' }}>*</span></label>
                        <Select value={situacao} style={{ width: '100%' }} onChange={(value) => setSituacao(value)}>
                            <Option value='done'>Compensado</Option>
                            <Option value='wait'>Em Aberto</Option>
                        </Select>

                    </Col>

                    <Col span={6}>

                        <label>Valor<span style={{ color: 'red' }}>*</span></label>
                        <Input type='number' addonAfter='R$' onChange={(e) => setValor(e.target.value)} value={valor} />

                    </Col>

                    <Col span={6}>

                        <label>Emitido em:<span style={{ color: 'red' }}>*</span></label>
                        <DatePicker format='DD/MM/YYYY' style={{width: '100%'}} showToday={false} value={moment(new Date(emissao))} onChange={(value) => setEmissao(value)} />

                    </Col>

                    <Col span={6}>

                        <label>Vencimento<span style={{ color: 'red' }}>*</span></label>
                        <DatePicker format='DD/MM/YYYY' style={{width: '100%'}} showToday={false} value={moment(new Date(vencimento))} onChange={(value) => setVencimento(value)} />

                    </Col>

                </Row>

                <Row style={{ marginTop: 10 }}>

                    <Col span={24}>

                        <label>Observações</label>
                        <TextArea rows={4} onChange={(e) => setObs(e.target.value.toUpperCase())} value={obs} />

                    </Col>

                </Row>


            </Modal>

            <Modal
                title="Excluir Cheque"
                visible={modalDel}
                onCancel={() => setModalDel(false)}
                footer={[
                    <Button key="back" icon='close' type='dange' onClick={() => setModalDel(false)}>
                        Não
                    </Button>,
                    <Button key="submit" icon='check' type="primary" loading={loading} onClick={() => sendDelCheque()}>
                        Sim
                    </Button>,
                ]}
            >

                <p>Tem certeza que deseja excluir este cheque?</p>

            </Modal>

            <Modal
                title="Alterar Situação do Cheque"
                visible={modalConfirm}
                onCancel={() => setModalConfirm(false)}
                footer={[
                    <Button key="back" icon='close' type='danger' onClick={() => setModalConfirm(false)}>
                        Cancelar
                    </Button>,
                    <Button key="submit" icon='save' type="primary" loading={loading} onClick={() => sendUpdateSituation()}>
                        Salvar
                    </Button>,
                ]}
            >

                <Radio.Group onChange={(event) => setSituacao(event.target.value)} value={situacao}>
                    <Radio value='done'><Icon type='check' /> Compensado</Radio>
                    <Radio value='wait'><Icon type='hourglass' /> Aguardando</Radio>
                </Radio.Group>

            </Modal>

        </div>
    )
}

export default EditCheques;