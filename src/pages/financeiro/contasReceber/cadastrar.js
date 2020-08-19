import React, { useState, useEffect } from 'react';
import { Col, Row, Input, Select, Button, Divider, Spin, TreeSelect, DatePicker, Modal } from 'antd';
import api from '../../../config/axios';

const { Option } = Select;
const { TreeNode } = TreeSelect;

export default function AddContasReceber() {

    const [loading, setLoading] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const [planoContas, setPlanoContas] = useState([]);
    const [formaPagamento, setFormaPagamento] = useState([]);
    const [contasBancarias, setContasBancarias] = useState([]);

    const [title, setTitle] = useState('');
    const [planoContaId, setPlanoContaId] = useState('');
    const [planoContaName, setPlanoContaName] = useState('');
    const [formaPagamentoId, setFormaPagamentoId] = useState('');
    const [contasBancariaId, setContasBancariaId] = useState('');
    const [vencimento, setVencimento] = useState('');
    const [valor, setValor] = useState(0);
    const [status, setStatus] = useState('');

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

    async function allClear(){
        await setTitle(''); await setPlanoContaId(''); await setPlanoContaName(''); await setFormaPagamentoId(''); await setContasBancariaId(''); await setVencimento(''); await setValor(0); await setStatus(''); await setVencimento('');
    }

    async function saveContReceive() {
        if(planoContaId === '') {
            warning('Atenção', 'Não existe um plano de contas selecionado');
            return false;
        }
        if(title === '') {
            warning('Atenção', 'Digite uma descrição para este lançamento');
            return false;
        }
        if(formaPagamentoId === '') {
            warning('Atenção', 'Não existe uma forma de pagamento selecionada');
            return false;
        }
        if(contasBancariaId === '') {
            warning('Atenção', 'Não existe uma conta bancária selecionada');
            return false;
        }
        if(vencimento === '') {
            warning('Atenção', 'Digite uma data de vencimento');
            return false;
        }
        if(valor === 0) {
            warning('Atenção', 'O valor deste lançamento está definido com 0');
            return false;
        }
        if(status === '') {
            warning('Atenção', 'Não existe um status de pagamento selecionado');
            return false;
        }
        setLoading(true);
        await api.post('/financial/createContasReceber',{
            planContas: planoContaId, payForm: formaPagamentoId, accountBank: contasBancariaId, vencimento: vencimento, value: valor, statusPay: status, description: title
        }).then(response => {
            success('Sucesso', response.data.message);
            setLoading(false);
            allClear();
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoading(false);
        })
    }

    async function finders() {
        setSpinner(true);
        await api.get('/financial/findersReceive').then(response => {
            setPlanoContas(response.data.planoConta);
            setFormaPagamento(response.data.formaPagamento);
            setContasBancarias(response.data.contas);
            setSpinner(false);
        }).catch(error => {
            erro('Erro', error.message);
            setSpinner(false);
        });
    }

    async function handlePlanoConta(value) {
        const result = await planoContas.find(obj => obj.planoConta === value);
        await setPlanoContaId(result._id);
        await setPlanoContaName(result.planoConta);
    }

    useEffect(() => {

        finders();

    }, []);

    return (
        <div style={{paddingTop: 15, paddingBottom: 15, paddingLeft: 30, paddingRight: 30, width: '100%'}}>
            <Spin spinning={spinner} size='large'>
                <Row gutter={10}>

                    <Col span={12}>

                        <label>Descrição do recebimento<span style={{ color: 'red' }}>*</span></label>
                        <Input type='text' value={title} onChange={(e) => setTitle(e.target.value.toUpperCase())} />

                    </Col>

                    <Col span={6}>

                        <label>Plano de contas<span style={{ color: 'red' }}>*</span></label>
                        <TreeSelect
                            showSearch
                            style={{ width: '100%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            value={planoContaName}
                            treeDefaultExpandAll
                            onChange={(value) => handlePlanoConta(value)}
                        >

                            {planoContas.map(plano => (

                                <TreeNode value={plano.planoConta} title={plano.planoConta} key={plano._id} />

                            ))}

                        </TreeSelect>

                    </Col>

                    <Col span={6}>

                        <label>Vencimento<span style={{ color: 'red' }}>*</span></label>
                        <DatePicker format='DD/MM/YYYY' style={{width: '100%'}} onChange={(value) => setVencimento(value)} showToday={false}/>

                    </Col>

                </Row>

                <Row gutter={10} style={{ marginTop: 15 }}>

                    <Col span={8}>

                        <label>Forma de pagamento<span style={{ color: 'red' }}>*</span></label>
                        <Select value={formaPagamentoId} style={{ width: '100%' }} onChange={(e) => setFormaPagamentoId(e)}>
                            {formaPagamento.map(forma => (
                                <Option value={forma._id} key={forma._id}>{forma.name}</Option>
                            ))}
                        </Select>

                    </Col>

                    <Col span={8}>

                        <label>Conta bancária<span style={{ color: 'red' }}>*</span></label>
                        <Select value={contasBancariaId} style={{ width: '100%' }} onChange={(e) => setContasBancariaId(e)}>
                            {contasBancarias.map(conta => (
                                <Option value={conta._id} key={conta._id}>{conta.bank}</Option>
                            ))}
                        </Select>

                    </Col>

                    <Col span={8}>

                        <label>Valor<span style={{ color: 'red' }}>*</span></label>
                        <Input addonAfter='R$' type='number' value={valor} onChange={(e) => setValor(parseFloat(e.target.value))}/>

                    </Col>

                </Row>

                <Row gutter={10} style={{ marginTop: 15 }}>

                    <Col span={6}>

                        <label style={{ display: 'block', width: '100%', marginBottom: 3 }}>Status do Pagamento<span style={{ color: 'red' }}>*</span></label>
                        <Select value={status} style={{ width: '100%' }} onChange={(e) => setStatus(e)}>
                            <Option value='wait'>Em Aberto</Option>
                            <Option value='pay'>Pago</Option>
                        </Select>

                    </Col>

                    <Col span={5}>

                    </Col>

                    <Col span={5}>

                    </Col>

                    <Col span={4}>

                    </Col>

                    <Col span={4}>

                    </Col>

                </Row>

                <div style={{ width: '100%' }}>
                    <Divider />
                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>

                        <Button type="primary" icon="save" size='large' loading={loading} onClick={() => saveContReceive()}>
                            Cadastrar
                        </Button>

                        <label style={{ marginLeft: 50 }}><span style={{ color: 'red' }}>*</span> Campo Obrigatório</label>

                    </div>
                </div>
            </Spin>
        </div>
    )
}