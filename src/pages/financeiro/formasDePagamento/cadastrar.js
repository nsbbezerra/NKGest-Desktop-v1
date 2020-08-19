import React, { useState, useEffect } from 'react';
import { Col, Row, Input, Select, Button, Divider, Switch, Icon, Modal, Spin } from 'antd';
import api from '../../../config/axios';

const { Option } = Select;

function SaveFormaPagamento() {

    const [spinner, setSpinner] = useState(false);
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [contaBancaria, setContaBancaria] = useState([]);

    const [titulo, setTitulo] = useState('');
    const [contBank, setContBank] = useState('');
    const [idContBank, setIdContBank] = useState('');
    const [statusPay, setStatusPay] = useState('');
    const [numParcela, setNumParcela] = useState(0);
    const [intervalParcela, setIntervalParcela] = useState(0);
    const [firstParcela, setFirstParcela] = useState(0);
    const [boleto, setBoleto] = useState(false);
    const [cheque, setCheque] = useState(false);
    const [acrescimo, setAcrescimo] = useState(false);
    const [credito, setCredito] = useState(false);

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

    async function findContaBancaria() {

        setSpinner(true);

        await api.get('/financial/listContasBancarias').then(response => {
            setContaBancaria(response.data.contas);
            setSpinner(false);
        }).catch(error => {
            erro('Erro', error.message);
            setSpinner(false);
        });

    };

    useEffect(() => {

        findContaBancaria();

    }, []);

    useEffect(() => {

        if (statusPay === 'vista') {
            setButtonDisabled(true);
        } else {
            setButtonDisabled(false);
        }

    }, [statusPay])

    async function handleContaBancaria(value) {
        const result = await contaBancaria.find(obj => obj._id === value);
        await setIdContBank(result._id);
        await setContBank(result.bank);
    }

    async function sendFormaPagamento() {

        if(titulo === ''){
            warning('Atenção', 'Digite um nome para esta forma de pagamento');
            return false;
        }
        if(statusPay === ''){
            warning('Atenção', 'Selecione um status de pagamento');
            return false;
        }
        if(idContBank === ''){
            warning('Atenção', 'Selecione uma conta bancária');
            return false;
        }

        setLoading(true);

        await api.post('/financial/saveFormaPagamento', {
            name: titulo, accountBank: idContBank, maxParcela: numParcela, intervalDays: intervalParcela, statusPay: statusPay, boleto: boleto, firtsPay: firstParcela, cheque: cheque, accData: acrescimo, credito: credito
        }).then(response => {
            success('Sucesso', response.data.message);
            setBoleto(false);
            setTitulo('');
            setStatusPay('');
            setContBank('');
            setFirstParcela('');
            setNumParcela(0);
            setFirstParcela(0);
            setIntervalParcela(0);
            setIdContBank('');
            setLoading(false);
            setCheque(false);
            setAcrescimo(false);
            setCredito(false);
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoading(false);
        });

    }

    function handleSetBoleto(value) {
        if(cheque === true) {
            setCheque(false);
        }
        if(acrescimo === true) {
            setAcrescimo(false)
        }
        if(credito === true) {
            setCredito(false)
        }
        setBoleto(value);
    }

    function handleSetCheque(value) {
        if(boleto === true) {
            setBoleto(false)
        }
        if(acrescimo === true) {
            setAcrescimo(false)
        }
        if(credito === true) {
            setCredito(false)
        }
        setCheque(value);
    }

    function handleSetAcrescimo(value) {
        if(cheque === true) {
            setCheque(false)
        }
        if(boleto === true) {
            setBoleto(false)
        }
        if(credito === true) {
            setCredito(false)
        }
        setAcrescimo(value)
    }

    function handleSetCredito(value) {
        if(cheque === true) {
            setCheque(false)
        }
        if(boleto === true) {
            setBoleto(false)
        }
        if(acrescimo === true) {
            setAcrescimo(false)
        }
        setCredito(value);
    }

    return (
        <div style={{paddingTop: 15, paddingBottom: 15, paddingLeft: 30, paddingRight: 30, width: '100%'}}>

            <Spin spinning={spinner} size='large'>

                <Row gutter={10}>

                    <Col span={10}>

                        <label>Forma de pagamento<span style={{ color: 'red' }}>*</span></label>
                        <Input type='text' onChange={(e) => setTitulo(e.target.value.toUpperCase())} value={titulo} />

                    </Col>

                    <Col span={8}>

                        <label>Conta bancária<span style={{ color: 'red' }}>*</span></label>
                        <Select value={contBank} style={{ width: '100%' }} onChange={(value) => handleContaBancaria(value)}>

                            {contaBancaria.map(contas => (

                                <Option value={contas._id} key={contas._id}>{contas.bank}</Option>

                            ))}

                        </Select>

                    </Col>

                    <Col span={6}>

                        <label>Status do pagamento<span style={{ color: 'red' }}>*</span></label>
                        <Select value={statusPay} style={{ width: '100%' }} onChange={(value) => { setStatusPay(value) }}>
                            <Option value='vista'>À vista</Option>
                            <Option value='parc'>Parcelado</Option>
                        </Select>

                    </Col>

                </Row>

                <Row gutter={10} style={{ marginTop: 15 }}>

                    <Col span={4}>

                        <label>Nº max. de parcelas<span style={{ color: 'red' }}>*</span></label>
                        <Input type='number' onChange={(e) => setNumParcela(e.target.value)} value={numParcela} disabled={buttonDisabled} />

                    </Col>

                    <Col span={4}>

                        <label>Intervalo das parcelas (dias)<span style={{ color: 'red' }}>*</span></label>
                        <Input type='number' onChange={(e) => setIntervalParcela(e.target.value)} value={intervalParcela} disabled={buttonDisabled} />

                    </Col>

                    <Col span={4}>

                        <label style={{ display: 'block', width: '100%' }}>Boleto?<span style={{ color: 'red' }}>*</span></label>
                        <Switch
                            checkedChildren={<Icon type="check" />}
                            unCheckedChildren={<Icon type="close" />}
                            checked={boleto}
                            onChange={(value) => handleSetBoleto(value)}
                            style={{ marginTop: 3.5 }}
                            disabled={buttonDisabled}
                        />

                    </Col>

                    <Col span={4}>

                        <label style={{ display: 'block', width: '100%' }}>Cheque?<span style={{ color: 'red' }}>*</span></label>
                        <Switch
                            checkedChildren={<Icon type="check" />}
                            unCheckedChildren={<Icon type="close" />}
                            checked={cheque}
                            onChange={(value) => handleSetCheque(value)}
                            style={{ marginTop: 3.5 }}
                            disabled={buttonDisabled}
                        />

                    </Col>

                    <Col span={4}>

                        <label style={{ display: 'block', width: '100%' }}>Transferência / Depósito?<span style={{ color: 'red' }}>*</span></label>
                        <Switch
                            checkedChildren={<Icon type="check" />}
                            unCheckedChildren={<Icon type="close" />}
                            checked={acrescimo}
                            onChange={(value) => handleSetAcrescimo(value)}
                            style={{ marginTop: 3.5 }}
                            disabled={buttonDisabled}
                        />

                    </Col>

                    <Col span={4}>

                        <label style={{ display: 'block', width: '100%' }}>Cartão de Crédito?<span style={{ color: 'red' }}>*</span></label>
                        <Switch
                            checkedChildren={<Icon type="check" />}
                            unCheckedChildren={<Icon type="close" />}
                            checked={credito}
                            onChange={(value) => handleSetCredito(value)}
                            style={{ marginTop: 3.5 }}
                            disabled={buttonDisabled}
                        />

                    </Col>

                </Row>

                <div style={{ width: '100%' }}>
                    <Divider />
                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>

                        <Button type="primary" icon="save" size='large' loading={loading} onClick={() => sendFormaPagamento()}>
                            Cadastrar
                        </Button>

                        <label style={{ marginLeft: 50 }}><span style={{ color: 'red' }}>*</span> Campo Obrigatório</label>

                    </div>
                </div>

            </Spin>

        </div>
    )
}

export default SaveFormaPagamento;