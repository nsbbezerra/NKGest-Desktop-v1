import React, { useState, useEffect } from 'react';
import { Icon, Button, Row, Col, Input, Card, Modal, Radio, Divider } from 'antd';
import { Header } from '../../styles/styles';
import { Link } from 'react-router-dom';
import Matri from '../../assets/print.svg';
import Norm from '../../assets/printer.svg';
import api from '../../config/axios';

export default function DadosSistema() {

    const [port, setPort] = useState('');
    const [loadingIcms, setLoadingIcms] = useState(false);
    const [ip, setIp] = useState('');
    const [modePrint, setModePrint] = useState('');
    const [interno, setInterno] = useState(0);
    const [externo, setExterno] = useState(0);
    const [importado, setImportado] = useState(0);

    async function admin() {
        const ipServ = await localStorage.getItem('ip');
        const portServ = await localStorage.getItem('port');
        const printMode = await localStorage.getItem('print');
        if (printMode) {
            await setModePrint(printMode);
        }
        await setIp(ipServ);
        await setPort(portServ);
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

    async function updateConnection() {
        await localStorage.setItem('ip', ip);
        await localStorage.setItem('port', port);
        success('Sucesso', 'Nova rota de conexão salva com sucesso, reinicie o sistema');
    }

    async function updatePrinter() {
        await localStorage.setItem('print', modePrint);
        success('Sucesso', 'Padrão de Impressão salvo com sucesso, reinicie o sistema');
    }

    async function findGlobals() {
        api.get('/organization/findConfigsGlobal').then(response => {
            if (response.data.conf) {
                setInterno(response.data.conf.icms.interno);
                setExterno(response.data.conf.icms.externo);
                setImportado(response.data.conf.icms.importado);
            }
        }).catch(error => {
            erro('Erro', error.response.data.message);
        });
    }

    async function updateConfigsGlobal() {
        setLoadingIcms(true);
        api.post('/organization/configsGlobal', {
            icms: { interno: interno, externo: externo, importado: importado }
        }).then(response => {
            if (response.data.conf) {
                setInterno(response.data.conf.icms.interno);
                setExterno(response.data.conf.icms.externo);
                setImportado(response.data.conf.icms.importado);
            }
            success('Sucesso', 'Configurações salvas com sucesso');
            setLoadingIcms(false);
        }).catch(error => {
            setLoadingIcms(false);
            erro('Erro', error.response.data.message);
        });
    }

    useEffect(() => {
        admin();
        findGlobals();
    }, [])

    return (
        <>

            <Header>
                <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='desktop' style={{ fontSize: 20 }} /> CONFIGURAÇÕES DO SISTEMA</p>
                <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
            </Header>

            <div style={{ marginTop: 10, overflow: 'hidden' }}>

                <Row gutter={10}>

                    <Col span={8}>

                        <Card size='small' title='Conexão com Servidor' headStyle={{ fontWeight: 'bold' }} bodyStyle={{ height: 173 }}>
                            <label>IP do Servidor</label>
                            <Input type='text' value={ip} onChange={(e) => setIp(e.target.value)} style={{ width: '100%' }} />
                            <label>Porta do Servidor</label>
                            <Input type='text' value={port} onChange={(e) => setPort(e.target.value)} style={{ width: '100%', marginBottom: 10 }} />
                            <Button icon='save' type='primary' onClick={() => updateConnection()}>Salvar</Button>
                        </Card>

                    </Col>

                    <Col span={8}>

                        <Card size='small' title='Padrão de Impressão' headStyle={{ fontWeight: 'bold' }} bodyStyle={{ height: 173 }}>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 14 }}>
                                <Radio.Group onChange={(e) => setModePrint(e.target.value)} value={modePrint}>
                                    <Radio.Button value='matricial' style={{ height: 100 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                                            <img src={Matri} style={{ width: 70, height: 70 }} />
                                        Matricial
                                    </div>
                                    </Radio.Button>
                                    <Radio.Button value='normal' style={{ height: 100 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                                            <img src={Norm} style={{ width: 70, height: 70 }} />
                                        Normal
                                    </div>
                                    </Radio.Button>
                                </Radio.Group>
                            </div>
                            <Button icon='save' type='primary' onClick={() => updatePrinter()}>Salvar</Button>
                        </Card>

                    </Col>

                </Row>

                <Divider style={{ fontWeight: 'bold' }}>Configurações Globais</Divider>

                <Row gutter={10}>

                    <Col span={8}>

                        <Card size='small' title='Alíquota de ICMS' headStyle={{ fontWeight: 'bold' }} bodyStyle={{ height: 173 }}>
                            <Row>
                                <Col span={12} style={{ paddingRight: 2.5 }}>
                                    <label>Alíquota Interna (Estadual)</label>
                                    <Input type='number' value={interno} onChange={(e) => setInterno(e.target.value)} style={{ width: '100%' }} />
                                </Col>
                                <Col span={12} style={{ paddingLeft: 2.5 }}>
                                    <label>Alíquota Externa (Interestadual)</label>
                                    <Input type='number' value={externo} onChange={(e) => setExterno(e.target.value)} style={{ width: '100%', marginBottom: 10 }} />
                                </Col>
                            </Row>
                            <label>Alíquota para Produtos Importados</label>
                            <Input type='number' value={importado} onChange={(e) => setImportado(e.target.value)} style={{ width: '100%', marginBottom: 10 }} />
                            <Button icon='save' type='primary' loading={loadingIcms} onClick={() => updateConfigsGlobal()}>Salvar</Button>
                        </Card>

                    </Col>

                    <Col span={8}>
                    </Col>

                </Row>

            </div>

        </>
    )

}