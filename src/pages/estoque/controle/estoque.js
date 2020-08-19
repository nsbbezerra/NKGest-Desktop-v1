import React, { Component } from 'react';
import { Table, Input, Button, Icon, Switch, Tooltip, InputNumber, Modal, Spin } from 'antd';
import Highlighter from 'react-highlight-words';
import api from '../../../config/axios';
import '../../../styles/style.css';

export default class Estoque extends Component {

    constructor(props) {
        super(props)
        this.state = {
            searchText: '',
            loading: false,
            modalUpdate: false,
            spinner: false,
            produtos: [],
            idProduto: '',
            active: null,
            estoqueAct: null,
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

    handleUpdate = async (id) => {
        const result = await this.state.produtos.find(obj => obj._id === id);
        await this.setState({ idProduto: id });
        await this.setState({ estoqueAct: result.estoqueAct });
        this.setState({ modalUpdate: true });
    }

    findProducts = async () => {
        this.setState({ spinner: true });
        await api.get('/stock/findProdutos').then(response => {
            this.setState({ produtos: response.data.produtos });
            this.setState({ spinner: false });
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
            this.setState({ loading: false });
            this.setState({ modalUpdate: false });
            this.findProducts();
        }).catch(error => {
            this.erro('Erro', error.message);
            this.setState({ loading: false });
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

    handleActive = async (id) => {
        await this.setState({ idProduto: id._id });
        await this.setState({ active: !id.active });
        this.sendActive();
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
                title: 'Estoque',
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
                        <Button shape="circle" icon="tool" size='small' onClick={() => this.handleUpdate(id)} />
                    </Tooltip>
                </>,
            }
        ];

        return (
            <>
                <Spin spinning={this.state.spinner} size='large'>

                    <Table columns={columns} dataSource={this.state.produtos} size='small' rowKey={(product) => product._id} rowClassName={(record) => record.estoqueAct <= 5 ? 'red-row': ''}/>

                </Spin>

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
                    width='40%'
                    centered
                >

                    <label>Estoque</label>
                    <InputNumber
                        value={this.state.estoqueAct}
                        onChange={(value) => this.setState({ estoqueAct: value })}
                        style={{ width: '100%', marginBottom: 20 }}
                    />

                </Modal>
            </>
        )
    }
}