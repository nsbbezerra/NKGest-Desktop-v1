import React, { useState, useEffect } from 'react';
import { Col, Row, Input, Select, Button, Divider, TreeSelect, Spin, DatePicker, Modal } from 'antd';
import api from '../../../config/axios';

const { Option } = Select;
const { TreeNode } = TreeSelect;
const { TextArea } = Input;

function CadastrarCheques() {

    const [spinner, setSpinner] = useState(false);
    const [loading, setLoading] = useState(false);

    const [clientes, setClientes] = useState([]);
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

    async function saveCheque() {

        if(clientId === '') {
            warning('Atenção', 'Não existe um cliente selecionado');
            return false;
        }

        setLoading(true);

        await api.post('/financial/saveCheque',{
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
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoading(false);
        });

    }

    useEffect(() => {

        FindClients();

    }, []);

    async function handleCliente(value) {
        const result = await clientes.find(obj => obj.name === value);
        await setClientID(result._id);
        await setClientName(result.name);
    }

    return (
        <div style={{paddingTop: 15, paddingBottom: 15, paddingLeft: 30, paddingRight: 30, width: '100%'}}>

            <Spin spinning={spinner} size='large'>

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
                        <Input type='number' onChange={(e) => setNumero(e.target.value)} value={numero}/>

                    </Col>

                    <Col span={4}>

                        <label>Entidade<span style={{ color: 'red' }}>*</span></label>
                        <Input type='text' onChange={(e) => setEntidade(e.target.value.toUpperCase())} value={entidade}/>

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

                <Row gutter={8} style={{ marginTop: 7 }}>

                    <Col span={6}>

                        <label>Situação<span style={{ color: 'red' }}>*</span></label>
                        <Select value={situacao} style={{ width: '100%' }} onChange={(value) => setSituacao(value)}>
                            <Option value='done'>Compensado</Option>
                            <Option value='wait'>Em Aberto</Option>
                        </Select>

                    </Col>

                    <Col span={6}>

                        <label>Valor<span style={{ color: 'red' }}>*</span></label>
                        <Input type='number' addonAfter='R$' onChange={(e) => setValor(e.target.value)} value={valor}/>

                    </Col>

                    <Col span={6}>

                        <label>Emitido em:<span style={{ color: 'red' }}>*</span></label>
                        <DatePicker format='DD/MM/YYYY' style={{width: '100%'}} showToday={false} value={emissao} onChange={(value) => setEmissao(value)} />

                    </Col>

                    <Col span={6}>

                        <label>Vencimento<span style={{ color: 'red' }}>*</span></label>
                        <DatePicker format='DD/MM/YYYY' style={{width: '100%'}} showToday={false} value={vencimento} onChange={(value) => setVencimento(value)} />

                    </Col>

                </Row>

                <Row style={{ marginTop: 7 }}>

                    <Col span={24}>

                        <label>Observações</label>
                        <TextArea rows={4} onChange={(e) => setObs(e.target.value.toUpperCase())} value={obs}/>

                    </Col>

                </Row>

            </Spin>

            <div style={{ width: '100%' }}>
                <Divider />
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>

                    <Button type="primary" icon="save" size='large' loading={loading} onClick={() => saveCheque()}>
                        Cadastrar
                    </Button>

                    <label style={{ marginLeft: 50 }}><span style={{ color: 'red' }}>*</span> Campo Obrigatório</label>

                </div>
            </div>

        </div>
    )
}

export default CadastrarCheques;