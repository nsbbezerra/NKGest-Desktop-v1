import React, { useState, useEffect } from 'react';
import { Icon, Row, Col, TreeSelect, Button, Divider, Card, Spin, Modal } from 'antd';
import { Header } from '../../../styles/styles';
import { Link } from 'react-router-dom';
import api from '../../../config/axios';

const { TreeNode } = TreeSelect;

function AlterarFornecedor() {

    const [spinner, setSpinner] = useState(false);
    const [loading, setLoading] = useState(false);

    const [produtos, setProdutos] = useState([]);
    const [produtoNome, setProdutoNome] = useState('');
    const [produtoID, setProdutoID] = useState('');
    const [fornecedores, setFornecedores] = useState([]);
    const [nomeFornecedor, setNomeFornecedor] = useState('');
    const [idFornecedor, setIdFornecedor] = useState('');
    const [actualFornecer, setActualFornecer] = useState('');

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

    async function findProducts() {
        setSpinner(true);
        await api.get('/stock/findProdutos').then(response => {
            setProdutos(response.data.produtos);
            setSpinner(false);
        }).catch(error => {
            erro('Erro', error.message);
            setSpinner(false);
        });
    }

    async function findFornecedores() {
        setSpinner(true)
        await api.get('/stock/findFornecedores').then(response => {
            setFornecedores(response.data.fornecedores);
            setSpinner(false)
        }).catch(error => {
            erro('Erro', error.message);
            setSpinner(false);
        });
    }

    async function sendUpdateFornecer() {

        setLoading(true);

        await api.put(`/stock/alterarFornece/${produtoID}`, {
            fornecedor: idFornecedor
        }).then(response => {
            success('Sucesso', response.data.message);
            setActualFornecer('');
            setNomeFornecedor('');
            setProdutoNome('');
            setLoading(false);
            findProducts();
        }).catch(error => {
            erro('Erro', error.message);
            setLoading(false);
        });

    }

    async function handleFornecedor(value) {

        const result = await fornecedores.find(obj => obj.name === value);
        await setNomeFornecedor(result.name);
        await setIdFornecedor(result._id);

    }

    async function handleProduto(value) {

        const result = await produtos.find(obj => obj.name === value);
        await setProdutoNome(result.name);
        await setProdutoID(result._id);
        await setActualFornecer(result.fornecedor.name);

    }

    useEffect(() => {

        findProducts();
        findFornecedores();

    }, []);

    return (
        <>
            <Header>
                <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='idcard' style={{ fontSize: 20 }} /> TROCAR FORNECEDOR</p>
                <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
            </Header>

            <div style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 30, paddingRight: 30 }}>

                <Spin spinning={spinner} size='large'>

                    <Row>

                        <Col span={24} style={{ padding: 4 }}>

                            <label>Selecione o produto</label>
                            <TreeSelect
                                showSearch
                                style={{ width: '100%', marginBottom: 20 }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                value={produtoNome}
                                treeDefaultExpandAll
                                onChange={(value) => handleProduto(value)}
                            >

                                {produtos.map(product => (

                                    <TreeNode value={product.name} title={product.name} key={product._id} />

                                ))}

                            </TreeSelect>

                        </Col>

                    </Row>

                    <Row>

                        <Col span={24} style={{ padding: 4 }}>

                            <Card size='small' headStyle={{ fontWeight: 'bold' }} title='Fornecedor Atual'>
                                <p>{actualFornecer}</p>
                            </Card>

                        </Col>

                    </Row>

                    <Divider>NOVO FORNECEDOR</Divider>

                    <Row>

                        <Col span={24} style={{ padding: 4 }}>
                            <label>Selecione o novo fornecedor</label>
                            <TreeSelect
                                showSearch
                                style={{ width: '100%', marginBottom: 20 }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeDefaultExpandAll
                                value={nomeFornecedor}
                                onChange={(value) => handleFornecedor(value)}
                            >

                                {fornecedores.map(fornecer => (

                                    <TreeNode value={fornecer.name} title={fornecer.name} key={fornecer._id} />

                                ))}

                            </TreeSelect>
                        </Col>

                    </Row>

                </Spin>

                <Divider />

                <Button type="primary" icon="save" size='large' loading={loading} onClick={() => sendUpdateFornecer()}>
                    Salvar alterações
                </Button>

            </div>
        </>
    )
}

export default AlterarFornecedor;