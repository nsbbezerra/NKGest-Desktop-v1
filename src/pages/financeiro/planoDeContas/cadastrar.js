import React, { useState } from 'react';
import { Col, Row, Input, Select, Button, Divider, Modal } from 'antd';
import api from '../../../config/axios';

const { Option } = Select;

function SavePlanoContas() {

    const [loading, setLoading] = useState(false);

    const [planoConta, setPlanoConta] = useState('');
    const [movimento, setMovimento] = useState('');

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

    async function SendPlanoContas() {

        if (planoConta === '') {
            warning('Atenção', 'Digite um nome para este plano de contas');
            return false;
        }
        if (movimento === '') {
            warning('Atenção', 'Selecione um tipo de movimentação financeira');
            return false;
        }

        setLoading(true);

        await api.post('/financial/savePlanoContas', {
            plano: planoConta, tipo: movimento
        }).then(response => {
            success('Sucesso', response.data.message);
            setPlanoConta('');
            setMovimento('');
            setLoading(false);
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoading(false);
        });

    }

    return (
        <div style={{paddingTop: 15, paddingBottom: 15, paddingLeft: 30, paddingRight: 30, width: '100%'}}>

            <Row gutter={8}>

                <Col span={18}>

                    <label>Plano de contas<span style={{ color: 'red' }}>*</span></label>
                    <Input type='text' onChange={(e) => setPlanoConta(e.target.value.toUpperCase())} value={planoConta} />

                </Col>

                <Col span={6}>

                    <label>Tipo de Movimento<span style={{ color: 'red' }}>*</span></label>
                    <Select value={movimento} style={{ width: '100%', marginBottom: 20 }} onChange={(value) => setMovimento(value)}>
                        <Option value='credit'>Crédito</Option>
                        <Option value='debit'>Débito</Option>
                    </Select>

                </Col>

            </Row>

            <div style={{ width: '100%' }}>
                <Divider />
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>

                    <Button type="primary" icon="save" size='large' loading={loading} onClick={() => SendPlanoContas()}>
                        Cadastrar
                    </Button>

                    <label style={{ marginLeft: 50 }}><span style={{ color: 'red' }}>*</span> Campo Obrigatório</label>

                </div>
            </div>

        </div>
    )

}

export default SavePlanoContas;