import React, { useState } from 'react';
import { Col, Row, Input, Button, Divider, Modal } from 'antd';
import api from '../../../config/axios';

function AddContasBancarias() {

    const [loading, setLoading] = useState(false);

    const [conta, setConta] = useState('');
    const [saldo, setSaldo] = useState(0);

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

    async function sendSaveConta() {

        if(conta === '') {
            warning('Atenção', 'O nome da conta está em branco');
            return false;
        }
        
        setLoading(true);

        await api.post('/financial/saveContasBancarias',{
            conta: conta, saldo: saldo
        }).then(response => {
            success('Sucesso', response.data.message);
            setConta('');
            setSaldo('');
            setLoading(false);
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoading(false);
        });

    }

    return (
        <div style={{paddingTop: 15, paddingBottom: 15, paddingLeft: 30, paddingRight: 30, width: '100%'}}>

            <Row gutter={10}>

                <Col span={12}>

                    <label>Conta bancária<span style={{ color: 'red' }}>*</span></label>
                    <Input type='text' onChange={(e) => setConta(e.target.value.toUpperCase())} value={conta}/>

                </Col>

                <Col span={12}>

                    <label>Saldo inicial<span style={{ color: 'red' }}>*</span></label>
                    <Input type='number' onChange={(e) => setSaldo(e.target.value)} value={saldo} addonAfter='R$'/>

                </Col>

            </Row>

            <div style={{ width: '100%' }}>
                <Divider />
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>

                    <Button type="primary" icon="save" size='large' loading={loading} onClick={() => sendSaveConta()}>
                        Cadastrar
                    </Button>

                    <label style={{ marginLeft: 50 }}><span style={{ color: 'red' }}>*</span> Campo Obrigatório</label>
                </div>
            </div>

        </div>
    )

}

export default AddContasBancarias;