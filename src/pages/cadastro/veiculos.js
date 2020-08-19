import React, { useState, useEffect } from 'react';
import { Icon, Row, Col, Input, Divider, TreeSelect, Button, Modal, Spin } from 'antd';
import { Header } from '../../styles/styles';
import { Link } from 'react-router-dom';
import api from '../../config/axios';
import TextMask from 'react-text-mask';

const { TextArea } = Input;
const { TreeNode } = TreeSelect;

function Veiculos() {

    const [clientes, setClientes] = useState([]);

    const [spinner, setSpinner] = useState(false);
    const [loading, setLoading] = useState(false);

    const [idCliente, setIdCliente] = useState('');
    const [clientName, setClientName] = useState('Selecione');
    const [modelo, setModelo] = useState('');
    const [marca, setMarca] = useState('');
    const [placa, setPlaca] = useState('');
    const [cor, setCor] = useState('');
    const [combustivel, setCombustivel] = useState('');
    const [obsCar, setObsCar] = useState('');

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

    async function RegisterCar() {

        if (idCliente === '') {
            warning('Atenção', 'Não existe um cliente selecionado para o cadastro');
            return false;
        }
        if (modelo === '') {
            warning('Atenção', 'O modelo está em branco');
            return false;
        }
        if (marca === '') {
            warning('Atenção', 'A marca está em branco');
            return false;
        }
        if (placa === '') {
            warning('Atenção', 'A placa está em branco');
            return false;
        }

        await setLoading(true);

        await api.post('/register/veiculos', {
            client: idCliente,
            model: modelo,
            marca: marca,
            placa: placa,
            color: cor,
            fuel: combustivel,
            obs: obsCar
        }).then(response => {
            setClientName('Selecione');
            setIdCliente('');
            setModelo('');
            setMarca('');
            setPlaca('');
            setCor('');
            setCombustivel('');
            setObsCar('');
            setLoading(false);
            success('Sucesso', response.data.message);
        }).catch(error => {
            setLoading(false);
            erro('Erro', error.response.data.message);
        });

    }

    useEffect(() => {
        FindClients();
    }, []);

    async function setClientId(client) {

        const result = await clientes.find(obj => obj.name === client);

        await setIdCliente(result._id);

        await setClientName(client);

    }

    return (
        <>

            <Header>
                <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='car' style={{ fontSize: 20 }} /> CADASTRO DE VEÍCULOS</p>
                <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
            </Header>

            <div style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 30, paddingRight: 30, width: '100%' }}>

                <Spin spinning={spinner} size='large'>

                    <Row gutter={10} style={{marginBottom: 7}}>

                        <Col span={8}>
                            <label>Cliente<span style={{ color: 'red' }}>*</span></label>
                            <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="Selecione"
                                treeDefaultExpandAll
                                onChange={(value) => setClientId(value)}
                                value={clientName}
                            >

                                {clientes.map(client => (

                                    <TreeNode value={client.name} title={client.name} key={client._id} />

                                ))}


                            </TreeSelect>
                        </Col>
                        <Col span={8}>
                            <label>Modelo<span style={{ color: 'red' }}>*</span></label>
                            <Input type='text' onChange={(e) => setModelo(e.target.value.toUpperCase())} value={modelo} />
                        </Col>
                        <Col span={8}>
                            <label>Marca<span style={{ color: 'red' }}>*</span></label>
                            <Input type='text' onChange={(e) => setMarca(e.target.value.toUpperCase())} value={marca} />
                        </Col>

                    </Row>

                    <Row gutter={10} style={{marginBottom: 7}}>

                        <Col span={8}>
                            <label>Placa<span style={{ color: 'red' }}>*</span></label>
                            <TextMask value={placa} onChange={(e) => setPlaca(e.target.value.toUpperCase())} className='ant-input' mask={[/[A-Z]/i, /[A-Z]/i, /[A-Z]/i, '-', /\d/, /\d/, /\d/, /\d/]} />
                        </Col>
                        <Col span={8}>
                            <label>Cor</label>
                            <Input type='text' onChange={(e) => setCor(e.target.value.toUpperCase())} value={cor} />
                        </Col>
                        <Col span={8}>
                            <label>Combustível</label>
                            <Input type='text' onChange={(e) => setCombustivel(e.target.value.toUpperCase())} value={combustivel} />
                        </Col>

                    </Row>

                    <Row gutter={10}>
                        <Col span={24}>
                            <label>Observações</label>
                            <TextArea rows={4} onChange={(e) => setObsCar(e.target.value.toUpperCase())} value={obsCar} />
                        </Col>
                    </Row>

                </Spin>

                <Divider />

                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>

                    <Button type="primary" icon="save" size='large' loading={loading} onClick={() => RegisterCar()}>
                        Cadastrar Veículo
                    </Button>

                    <label style={{ marginLeft: 50 }}><span style={{ color: 'red' }}>*</span> Campo Obrigatório</label>

                </div>

            </div>

        </>

    )
}

export default Veiculos;