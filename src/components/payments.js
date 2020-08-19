import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Divider, Button, Spin, Select, Input, Card, message } from 'antd';
import api from '../config/axios';

const { Option } = Select;

function ModulePayments({ price, idSale, brut, desc, confirm }) {

    const [loading, setLoading] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [formaPagamento, setFormaPagamento] = useState([]);

    const [otherPayment, setOtherPayment] = useState(false);
    const [paymentFinal, setPaymentFinal] = useState([]);

    const [viewParcelaFirst, setViewParcelaFirst] = useState(false);
    const [statusPaymentFirst, setStatusPaymentFirst] = useState('');
    const [paymentIdFirst, setPaymentIdFirst] = useState('');
    const [parcelasFirst, setParcelasFirst] = useState(0);
    const [valueFirstPayFirst, setValueFirstPayFirst] = useState(price);
    const [maxParcelaFirst, setMaxParcelaFirst] = useState([]);
    const [nameFormaFirstPay, setNameFormaFirstPay] = useState('');

    const [statusParcelament, setStatusParcelament] = useState('');
    const [statusParcelamentTwo, setStatusParcelamentTwo] = useState('');

    const [viewParcelaTwo, setViewParcelaTwo] = useState(false);
    const [statusPaymentTwo, setStatusPaymentTwo] = useState('');
    const [paymentIdTwo, setPaymentIdTwo] = useState('');
    const [parcelasTwo, setParcelasTwo] = useState(0);
    const [valueFirstPayTwo, setValueFirstPayTwo] = useState(0);
    const [maxParcelaTwo, setMaxParcelaTwo] = useState([]);
    const [nameFormaSecondPay, setNameFormaSecondPay] = useState('');

    const [disabledButton, setDisabledButton] = useState(true);
    const [disabledButton2, setDisabledButton2] = useState(false);

    const [finished, setFinished] = useState(false);

    const info = (text) => {
        message.warning(text);
    }

    const success = (text) => {
        message.success(text);
    }

    const fatal = (text) => {
        message.error(text);
    }

    async function findFormaPagamento() {

        setSpinner(true);

        await api.get('/financial/findFormaPagamento').then(response => {
            setFormaPagamento(response.data.formaPagamento);
            setSpinner(false);
        }).catch(error => {
            setSpinner(true);
        });

    }

    useEffect(() => {
        findFormaPagamento();
    }, [])

    async function processPayment() {

        if (paymentIdFirst === '') {
            info('Selecione uma forma de pagamento');
            return false;
        }

        if (otherPayment === true) {
            if (paymentIdTwo === '') {
                info('Selecione uma forma de pagamento para o pagamento adicional');
                return false;
            }
        }

        if (paymentFinal.length) {
            paymentFinal.length = 0;
        }
        if (otherPayment === false) {
            await paymentFinal.push({
                paymentId: paymentIdFirst,
                total: valueFirstPayFirst,
                parcelas: parcelasFirst,
                statusPayment: statusPaymentFirst
            });
        }
        if (otherPayment === true) {
            await paymentFinal.push({
                paymentId: paymentIdFirst,
                total: valueFirstPayFirst,
                parcelas: parcelasFirst,
                statusPayment: statusPaymentFirst
            }, {
                paymentId: paymentIdTwo,
                total: valueFirstPayTwo,
                parcelas: parcelasTwo,
                statusPayment: statusPaymentTwo
            });
        }
        setDisabledButton(false);
        setDisabledButton2(true);
    }

    async function delPayments() {
        await setPaymentFinal([]); await setPaymentIdFirst(''); await setValueFirstPayFirst(price); await setParcelasFirst(0); await setStatusPaymentFirst(''); await setPaymentIdTwo(''); await setValueFirstPayTwo(0); await setParcelasTwo(0); await setStatusPaymentTwo(''); await setStatusParcelament(''); await setStatusParcelamentTwo(''); setDisabledButton(true); setDisabledButton2(false);
    }

    async function FinalizarVenda() {

        setLoading(true);

        await api.post('/orders/createPaymentSale', {
            orderId: idSale, payment: paymentFinal,
        }).then(response => {
            setLoading(false);
            setFinished(true);
            success('Pagamentos cadastrados com sucesso!');
        }).catch(error => {
            setLoading(false);
            fatal(error.response.data.message);
        });

    }

    useEffect(() => {

        if (valueFirstPayFirst < price) {
            const rest = price - valueFirstPayFirst;
            setValueFirstPayTwo(parseFloat(rest));
            setOtherPayment(true);
        }
        if (valueFirstPayFirst === price) {
            setValueFirstPayTwo(0);
            setOtherPayment(false);
        }
        if (valueFirstPayFirst > price) {
            setValueFirstPayFirst(price);
            setOtherPayment(false);
        }

    }, [valueFirstPayFirst]);


    async function handleFirstPay(value) {
        if (maxParcelaFirst.length) {
            await setMaxParcelaFirst([]);
        }
        const result = await formaPagamento.find(obj => obj._id === value);

        await setPaymentIdFirst(result._id);

        if (result.accData === true) {
            await setStatusPaymentFirst('wait');
        }

        if (result.statusPay === 'parc') {
            await setStatusPaymentFirst('wait');
            await setStatusParcelament('parc');
            await updateEstado(result.maxParcela);
        } else {
            await setStatusPaymentFirst('done');
            await setStatusParcelament('vista');
            await setParcelasFirst(0);
            await setViewParcelaFirst(false);
        }
        setNameFormaFirstPay(result.name);
    }

    async function updateEstado(value) {
        const total = await value;
        var numberParcela = new Array();
        for (var i = 0; i < total; i++) {
            var model = { num: i + 1, name: `${i + 1}x` };
            await numberParcela.push(model);
        }
        await setMaxParcelaFirst(numberParcela);
        await setViewParcelaFirst(true);
    }

    async function handleSecondPay(value) {
        if (maxParcelaTwo.length) {
            await setMaxParcelaTwo([]);
        }
        const result = await formaPagamento.find(obj => obj._id === value);

        await setPaymentIdTwo(result._id);

        if (result.accData === true) {
            await setStatusPaymentTwo('wait');
        }

        if (result.statusPay === 'parc') {
            await setStatusPaymentTwo('wait');
            await setStatusParcelamentTwo('parc');
            await updateEstadoTwo(result.maxParcela);
        } else {
            await setStatusPaymentTwo('done');
            await setStatusParcelamentTwo('vista');
            await setParcelasTwo(0);
            await setViewParcelaTwo(false);
        }
        setNameFormaSecondPay(result.name);
    }

    async function updateEstadoTwo(value) {
        const total = await value;
        var numberParcela = new Array();
        for (var i = 0; i < total; i++) {
            var model = { num: i + 1, name: `${i + 1}x` };
            await numberParcela.push(model);
        }
        await setMaxParcelaTwo(numberParcela);
        await setViewParcelaTwo(true);
    }

    function replaceValue(value) {
        let casas = Math.pow(10, 2);
        return Math.floor(value * casas) / casas;
    }

    const dataResume = [
        {
            key: '1',
            info: 'TOTAL BRUTO',
            value: `R$ ${replaceValue(brut)}`
        },
        {
            key: '2',
            info: 'DESCONTO',
            value: `% ${replaceValue(desc)}`
        },
        {
            key: '3',
            info: 'TOTAL A PAGAR',
            value: `R$ ${replaceValue(price)}`
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
    ];

    return (
        <>
            <Spin spinning={spinner} size='large'>
                <Row gutter={15}>

                    <Col span={12}>

                        <Row gutter={8}>

                            <Col span={24}>

                                <label style={{ display: 'block' }}>Forma de Pagamento</label>
                                <Select value={paymentIdFirst} size='large' style={{ width: '100%' }} onChange={(value) => handleFirstPay(value)}>
                                    {formaPagamento.map(forma => (

                                        <Option value={forma._id} key={forma._id}>{forma.name}</Option>

                                    ))}
                                </Select>

                            </Col>

                        </Row>

                        <Row gutter={8} style={{ marginTop: 10 }}>

                            <Col span={12}>

                                <label>Valor</label>
                                <Input type='number' addonAfter='R$' size='large' value={replaceValue(valueFirstPayFirst)} onChange={(e) => setValueFirstPayFirst(e.target.value)} max={price} />

                            </Col>

                            <Col span={12}>

                                {viewParcelaFirst === true && (
                                    <>

                                        <label>Parcelas</label>
                                        <Select value={parcelasFirst} size='large' style={{ width: '100%' }} onChange={(value) => setParcelasFirst(value)}>

                                            {maxParcelaFirst.map(max => (
                                                <Option value={max.num} key={max.num}>{max.name}</Option>
                                            ))}

                                        </Select>

                                    </>
                                )}

                            </Col>

                        </Row>

                        {otherPayment === true && (

                            <>

                                <Divider>Pagamento Adicional</Divider>

                                <Row gutter={8}>

                                    <Col span={24}>

                                        <label style={{ display: 'block' }}>Forma de Pagamento</label>
                                        <Select value={paymentIdTwo} size='large' style={{ width: '100%' }} onChange={(value) => handleSecondPay(value)}>
                                            {formaPagamento.map(forma => (

                                                <Option value={forma._id} key={forma._id}>{forma.name}</Option>

                                            ))}
                                        </Select>

                                    </Col>

                                </Row>

                                <Row gutter={8} style={{ marginTop: 10 }}>

                                    <Col span={12}>

                                        <label>Valor</label>
                                        <Input type='number' addonAfter='R$' size='large' value={replaceValue(valueFirstPayTwo)} readOnly />

                                    </Col>

                                    <Col span={12}>

                                        {viewParcelaTwo === true && (
                                            <>
                                                <label>Parcelas</label>
                                                <Select value={parcelasTwo} size='large' style={{ width: '100%' }} onChange={(value) => setParcelasTwo(value)}>
                                                    {maxParcelaTwo.map(max => (
                                                        <Option value={max.num} key={max.num}>{max.name}</Option>
                                                    ))}
                                                </Select>
                                            </>
                                        )}

                                    </Col>

                                </Row>

                            </>

                        )}

                    </Col>

                    <Col span={12}>

                        <Row>

                            <Col span={24}>

                                <label>Pagamento</label>
                                <Card size='small' bordered={false} bodyStyle={{ backgroundColor: 'lightgray' }}>

                                    {statusParcelament === 'vista' && (
                                        <p style={{ fontSize: 20, width: '100%', textAlign: 'center', marginBottom: -4 }}><strong>{nameFormaFirstPay} </strong>{`R$ ${replaceValue(valueFirstPayFirst)}`}</p>
                                    )}

                                    {statusParcelament === 'parc' && (
                                        <p style={{ fontSize: 20, width: '100%', textAlign: 'center', marginBottom: -4 }}><strong>{nameFormaFirstPay}: </strong>{`R$ ${replaceValue(valueFirstPayFirst)} em ${parcelasFirst} vezes`}</p>
                                    )}

                                </Card>

                            </Col>

                        </Row>

                        {otherPayment === true && (

                            <Row style={{ marginTop: 10 }}>

                                <Col span={24}>

                                    <label>Pagamento Adicional</label>
                                    <Card size='small' bordered={false} bodyStyle={{ backgroundColor: 'lightgray' }}>

                                        {statusParcelamentTwo === 'vista' && (
                                            <p style={{ fontSize: 20, width: '100%', textAlign: 'center', marginBottom: -4 }}><strong>{nameFormaFirstPay} </strong>{`R$ ${replaceValue(valueFirstPayTwo)}`}</p>
                                        )}

                                        {statusParcelamentTwo === 'parc' && (
                                            <p style={{ fontSize: 20, width: '100%', textAlign: 'center', marginBottom: -4 }}><strong>{nameFormaSecondPay}: </strong>{`R$ ${replaceValue(valueFirstPayTwo)} em ${parcelasTwo} vezes`}</p>
                                        )}

                                    </Card>

                                </Col>

                            </Row>

                        )}

                        <Table pagination={false} columns={columnsResume} dataSource={dataResume} size='small' showHeader={false} style={{ marginTop: 10 }} />

                    </Col>

                </Row>

                <Divider />

                <div style={{ width: '100%', marginTop: -3 }}>

                    {finished === false ? (
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'flex-end' }}>
                            <Button key="exclud" disabled={disabledButton} style={{ marginRight: 10 }} onClick={() => delPayments()}>
                                Apagar Pagamentos
                            </Button>
                            <Button key="clear" disabled={disabledButton2} style={{ marginRight: 10 }} onClick={() => processPayment()}>
                                Processar Pagamento
                            </Button>
                            <Button key="submit" disabled={disabledButton} type="primary" loading={loading} onClick={() => FinalizarVenda()}>
                                Finalizar
                            </Button>
                        </div>
                    ) : (
                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'flex-end' }}>
                                <Button type="primary" icon='check' onClick={confirm}>
                                    Concluir
                                </Button>
                            </div>
                        )}

                </div>

            </Spin>
        </>
    )
}

export default ModulePayments;