import React, { useState, useEffect } from 'react';
import { Icon, Button, Table, Tabs, Tooltip, Modal, Row, Col, Input, Spin, Statistic } from 'antd';
import { Header } from '../../../styles/styles';
import { Link } from 'react-router-dom';
import CadastrarContas from './cadastrar';
import api from '../../../config/axios';

const { TabPane } = Tabs;

function ListContasBancarias() {

    const [spinner, setSpinner] = useState(false);
    const [modalEditInfo, setModalEditInfo] = useState(false);
    const [loading, setLoading] = useState(false);

    const [contas, setContas] = useState([]);
    const [idConta, setIdConta] = useState('');
    const [contaName, setContaName] = useState('');
    const [contaValue, setContaValue] = useState(0);
    const [newContaValue, setNewContaValue] = useState(0);

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

    async function findContas() {

        setSpinner(true);

        await api.get('/financial/listContasBancarias').then(response => {
            setContas(response.data.contas);
            setSpinner(false);
        }).catch(error => {
            erro('Erro', error.message);
            setSpinner(false);
        });

    }

    async function handleEditInfo(value) {
        const result = await contas.find(obj => obj._id === value);
        await setIdConta(result._id);
        await setContaName(result.bank);
        await setContaValue(result.value);
        await setNewContaValue(result.value)
        setModalEditInfo(true);
    }

    async function handleSendEditInfo() {

        setLoading(true);

        await api.put(`/financial/editConta/${idConta}`,{
            conta: contaName, saldo: newContaValue
        }).then(response => {
            setModalEditInfo(false);
            success('Sucesso', response.data.message);
            setContaName('');
            setContaValue(0);
            setNewContaValue(0);
            setLoading(false);
            findContas();
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoading(false);
        });

    }

    useEffect(() => {

        findContas();

    }, []);

    const columns = [
        {
            title: 'Conta Bancária',
            dataIndex: 'bank',
            key: 'bank',
        },
        {
            title: 'Valor (R$)',
            dataIndex: 'value',
            key: 'value',
            width: '25%',
            render: (value) => <Statistic value={value} valueStyle={{fontSize: 15.5}} prefix='R$' precision={2}/>,
            align: 'right'
        },
        {
            title: 'Ações',
            dataIndex: '_id',
            key: '_id',
            render: (id) => <>
                <Tooltip placement='top' title='Alterar Saldo'>
                    <Button shape="circle" icon="edit" type='primary' size='small' style={{ marginRight: 5 }} onClick={() => handleEditInfo(id)} />
                </Tooltip>
            </>,
            width: '9%',
            align: 'center'
        }
    ];

    return (

        <div style={{ height: '100%' }}>
            <Header>
                <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='bank' style={{ fontSize: 20 }} /> CONTAS BANCÁRIAS</p>
                <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
            </Header>

            <div style={{ marginTop: 10 }}>

                <Tabs defaultActiveKey="1" tabPosition='left' type='card'>

                    <TabPane tab="Listagem" key="1">

                        <Spin spinning={spinner} size='large'>

                            <Button type='default' icon='redo' onClick={() => findContas()} style={{ marginBottom: 10 }}>Atualizar</Button>

                            <Table pagination={{ pageSize: 10 }} columns={columns} dataSource={contas} size='small' rowKey={(account) => account._id} />

                        </Spin>

                    </TabPane>

                    <TabPane tab="Cadastrar" key="2">

                        <CadastrarContas />

                    </TabPane>

                </Tabs>

            </div>

            <Modal
                title="Alterar Saldo"
                visible={modalEditInfo}
                onCancel={() => setModalEditInfo(false)}
                footer={[
                    <Button key="back" icon='close' type='danger' onClick={() => setModalEditInfo(false)}>
                        Cancelar
                        </Button>,
                    <Button key="submit" icon='save' type="primary" loading={loading} onClick={() => { handleSendEditInfo() }}>
                        Salvar
                    </Button>,
                ]}
                width='60%'
            >

                <Row gutter={8}>

                    <Col span={8}>

                        <label>Nome da conta</label>
                        <Input type='text' onChange={(e) => setContaName(e.target.value.toUpperCase())} value={contaName} />

                    </Col>

                    <Col span={8}>

                        <label>Saldo atual</label>
                        <Input type='number' addonAfter='R$' readOnly value={contaValue} />

                    </Col>

                    <Col span={8}>

                        <label>Novo saldo</label>
                        <Input type='number' addonAfter='R$' onChange={(e) => setNewContaValue(e.target.value)} value={newContaValue} />

                    </Col>

                </Row>

            </Modal>

        </div>
    )
}

export default ListContasBancarias;