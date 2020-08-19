import React, { useState } from 'react';
import { Icon, Button, Tooltip, Modal } from 'antd';
import './style.css';
import api from '../../../config/axios';
import { Header } from '../../../styles/styles';
import { Link } from 'react-router-dom';

function UpdatedTaxes() {

    const [loadindImport, setLoadingImport] = useState(false);

    const [xmlFile, setXmlFile] = useState(null);

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

    function delXmlFile() {
        setXmlFile(null);
    }

    async function sendXmlFile() {
        if (xmlFile === null) {
            warning('Atenção', 'Por favor selecione um arquivo para envio');
            return false;
        }
        const data = new FormData();
        data.append('xml', xmlFile);
        setLoadingImport(true);
        await api.post('/xmlImport/updateProducts', data).then(response => {
            success('Sucesso', response.data.message);
            setLoadingImport(false);
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoadingImport(false);
        });
    }

    return (
        <div>

            <Header>
                <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='percentage' style={{ fontSize: 20 }} /> ATUALIZAR IMPOSTOS</p>
                <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
            </Header>

            <div style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 30, paddingRight: 30, width: '100%' }}>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                    <label id='xmlFile'>
                        <input type='file' onChange={event => setXmlFile(event.target.files[0])} />
                        {!xmlFile && (
                            <p style={{ marginBottom: -.5 }}><Icon type='file-done' style={{ fontSize: 15, marginRight: 10 }} />Clique aqui para adicionar o arquivo XML da nota fiscal</p>
                        )}
                        {xmlFile && (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <p style={{ marginBottom: -.5 }}>{xmlFile.name}</p>
                                    <Tooltip title='Excluir XML'>
                                        <Button icon='close' type='link' style={{ marginLeft: 10, marginTop: -5, marginBottom: -5, color: 'red' }} onClick={() => delXmlFile()} />
                                    </Tooltip>
                                </div>
                                <p style={{ marginBottom: -.5, fontStyle: 'italic', fontSize: 11, color: 'lightgray' }}>Clique em IMPORTAR XML para enviar o arquivo para o servidor</p>
                            </>
                        )}
                    </label>

                </div>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: 15 }}>
                    <Button icon='percentage' type='primary' style={{ marginRight: 15 }} onClick={() => sendXmlFile()} loading={loadindImport}>Atualizar Impostos</Button>
                </div>

            </div>

        </div>
    );
}

export default UpdatedTaxes;