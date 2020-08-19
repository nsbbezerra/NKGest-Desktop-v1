import React, { Component } from 'react';
import { Table, Input, Button, Icon, Switch, Tooltip, InputNumber, Row, Col, Modal, Divider, Drawer, Card, Spin } from 'antd';
import Highlighter from 'react-highlight-words';
import api from '../../../config/axios';

const { TextArea } = Input;

export default class BaixoEstoque extends Component {

    constructor(props) {
        super(props)
        this.state = {
            searchText: '',
            loading: false,
            modalUpdate: false,
            spinner: false,
            produtos: [],
            idProduto: '',
            fornecedor: {},
            nome: '',
            active: null,
            estoqueAct: null,
            sendMail: false,
            menssagem: ''
        }
    }

    erro = (title, message) => {
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

    warning = (title, message) => {
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

    success = (title, message) => {
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

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Buscar`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Buscar
            </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Limpar
            </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    });

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    EnviarEmail = async () => {
        if (this.state.menssagem === '') {
            this.warning('Atenção', 'Escreva uma mensagem para enviar');
            return false
        }
        this.setState({ loading: true });

        await api.post('/stock/sendPedido', {
            idFornecedor: this.state.fornecedor._id,
            menssagem: this.state.menssagem
        }).then(response => {
            this.success('Sucesso', response.data.message);
            this.setState({ menssagem: '' });
            this.setState({ loading: false });
        }).catch(error => {
            this.erro('Erro', error.menssagem);
            this.setState({ loading: false });
        });
    }

    findProducts = async () => {
        this.setState({ spinner: true });
        await api.get('/stock/baixoEstoque').then(response => {
            this.setState({ produtos: response.data.produtos });
            this.setState({ spinner: false });
        }).catch(error => {
            this.erro('Erro', error.message);
            this.setState({ spinner: false });
        });
    }

    sendActive = async () => {
        this.setState({ spinner: true });
        await api.put(`/stock/active/${this.state.idProduto}`, {
            active: this.state.active
        }).then(response => {
            this.success('Sucesso', response.data.message);
            this.setState({ spinner: false });
            this.findProducts();
        }).catch(error => {
            this.erro('Erro', error.message);
            this.setState({ spinner: false });
        });
    }

    sendUpdate = async () => {
        this.setState({ loading: true });
        await api.put(`/stock/ajusteEstoque/${this.state.idProduto}`, {
            estoqueAct: this.state.estoqueAct
        }).then(response => {
            this.success('Sucesso', response.data.message);
            this.setState({ estoqueAct: 0 });
            this.setState({ loading: false });
            this.findProducts();
        }).catch(error => {
            this.erro('Erro', error.message);
            this.setState({ loading: false });
        });
    }

    handleUpdate = async (id) => {
        const result = await this.state.produtos.find(obj => obj._id === id);
        await this.setState({ idProduto: id });
        await this.setState({ nome: result.name });
        await this.setState({ estoqueAct: result.estoqueAct });
        this.setState({ modalUpdate: true });
    }

    handleActive = async (id) => {
        await this.setState({ idProduto: id._id });
        await this.setState({ active: !id.active });
        this.sendActive();
    }

    handleEmail = async (id) => {
        const result = await this.state.produtos.find(obj => obj._id === id);
        await this.setState({ fornecedor: result.fornecedor });
        this.setState({ sendMail: true });
    }

    componentDidMount = () => {
        this.findProducts();
    }

    render() {

        const columns = [
            {
                title: 'Produto',
                dataIndex: 'name',
                key: 'name',
                width: '60%',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: 'Unidade Medida',
                dataIndex: 'unMedida',
                key: 'unMedida',
                ...this.getColumnSearchProps('unMedida'),
                align: 'center'
            },
            {
                title: 'Estoque atual',
                dataIndex: 'estoqueAct',
                key: 'estoqueAct',
                ...this.getColumnSearchProps('estoqueAct'),
                align: 'center'
            },
            {
                title: 'Ativo?',
                dataIndex: 'active',
                key: 'active _id',
                render: (active, id) => <>
                    <Switch
                        checkedChildren={<Icon type="check" />}
                        unCheckedChildren={<Icon type="close" />}
                        defaultChecked={active}
                        onChange={() => this.handleActive(id)}
                    />
                </>,
            },
            {
                title: 'Ações',
                dataIndex: '_id',
                key: '_id',
                render: (id) => <>
                    <Tooltip placement='top' title='Ajustar'>
                        <Button shape="circle" icon="tool" size='small' style={{ marginRight: 5 }} onClick={() => this.handleUpdate(id)} />
                    </Tooltip>
                    <Tooltip placement='top' title='Enviar pedido'>
                        <Button shape="circle" icon="shopping-cart" size='small' type='primary' onClick={() => this.handleEmail(id)} />
                    </Tooltip>
                </>,
            }
        ];

        return (
            <>
                <Spin spinning={this.state.spinner} size='large'>
                    <Table columns={columns} dataSource={this.state.produtos} size='small' rowKey={(produto) => produto._id} />
                </Spin>

                <Modal
                    visible={this.state.modalAuth}
                    title="Senha administrativa"
                    onCancel={() => this.setState({ modalAuth: false })}
                    footer={[
                        <Button key="back" icon='close' type='danger' onClick={() => this.setState({ modalAuth: false })}>
                            Cancelar
                        </Button>,
                        <Button key="submit" icon='search' type="primary" loading={this.state.loading} onClick={() => { this.handleAuth() }}>
                            Verificar
                        </Button>,
                    ]}
                    width='25%'
                >
                    <Row>

                        <Col span={24}>

                            <label>Usuário</label>
                            <Input type='text' />

                        </Col>

                    </Row>

                    <Row style={{ marginTop: 10 }}>

                        <Col span={24}>

                            <label>Senha</label>
                            <Input.Password />

                        </Col>

                    </Row>
                </Modal>

                <Modal
                    visible={this.state.modalUpdate}
                    onCancel={() => this.setState({ modalUpdate: false })}
                    title="Alterar produto"
                    footer={[
                        <Button key="back" icon='close' type='danger' onClick={() => this.setState({ modalUpdate: false })}>
                            Cancelar
                        </Button>,
                        <Button key="submit" icon='save' type="primary" loading={this.state.loading} onClick={() => { this.sendUpdate() }}>
                            Alterar
                        </Button>,
                    ]}
                    width='50%'
                    centered
                >

                    <h2 style={{ width: '100%', textAlign: 'center', fontWeight: 'bold', marginBottom: 20 }}>{this.state.nome}</h2>

                    <label>Estoque</label>
                    <InputNumber
                        value={this.state.estoqueAct}
                        onChange={(value) => this.setState({ estoqueAct: value })}
                        style={{ width: '100%', marginBottom: 20 }}
                    />

                </Modal>

                <Drawer
                    title="Enviar Pedido"
                    width={800}
                    closable={true}
                    onClose={() => this.setState({ sendMail: false })}
                    visible={this.state.sendMail}
                    placement='left'
                >

                    <Card size='small' title='Fornecedor' headStyle={{ fontWeight: 'bold' }}>
                        <p>{this.state.fornecedor.name}</p>
                    </Card>

                    <Divider />

                    <TextArea rows={16} value={this.state.menssagem} onChange={(e) => this.setState({ menssagem: e.target.value })} />

                    <div style={{ width: '100%' }}>
                        <Divider />
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>

                            <Button type="primary" icon="mail" size='large' loading={this.state.loading} onClick={() => this.EnviarEmail()}>
                                Enviar email
                            </Button>
                        </div>
                    </div>

                </Drawer>
            </>
        )
    }
}