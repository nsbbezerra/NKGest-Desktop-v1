import React, { Component } from 'react';
import { Icon, Table, Input, Button, Tooltip, Col, Row, Select, Modal } from 'antd';
import Highlighter from 'react-highlight-words';
import InputMask from 'react-input-mask';
import api from '../../../config/axios';

const { Option } = Select;

export default class Ativacoes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            loading: false,
            funcionarios: [],
            name: '',
            dateBirth: '',
            gender: '',
            celOne: '',
            celTwo: '',
            email: '',
            idFunc: ''
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

    findFunc = async () => {
        this.setState({ spinner: true });
        await api.get('/admin/findFuncionarios').then(response => {
            this.setState({ funcionarios: response.data.funcionarios });
            this.setState({ spinner: false });
        }).catch(error => {
            this.erro('Erro', error.message);
            this.setState({ spinner: false });
        });
    }

    sendUpdateFunc = async () => {
        this.setState({ loading: true });
        await api.put(`/admin/changeFuncData/${this.state.idFunc}`, {
            name: this.state.name,
            gender: this.state.gender,
            dateBirth: this.state.dateBirth,
            celOne: this.state.celOne,
            celTwo: this.state.celTwo,
            email: this.state.email,
        }).then(response => {
            this.findFunc();
            this.setState({ drawerUpdate: false });
            this.success('Sucesso', response.data.message);
            this.setState({ loading: false });
        }).catch(error => {
            this.erro('Erro', error.response.data.message);
            this.setState({ loading: false });
        });
    }

    componentDidMount = () => {
        this.findFunc();
    }

    handleInformation = async (id) => {
        const result = await this.state.funcionarios.find(obj => obj._id === id);
        await this.setState({ idFunc: id });
        await this.setState({ name: result.name });
        await this.setState({ gender: result.gender });
        await this.setState({ dateBirth: result.dateBirth });
        await this.setState({ celOne: result.celOne });
        await this.setState({ celTwo: result.celTwo });
        await this.setState({ email: result.email });
        this.setState({ drawerUpdate: true });
    }

    render() {

        const columns = [
            {
                title: 'Nome',
                dataIndex: 'name',
                key: 'name',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: 'Função',
                dataIndex: 'cargo',
                key: 'cargo',
                ...this.getColumnSearchProps('cargo'),
            },
            {
                title: 'Telefone 1',
                dataIndex: 'celOne',
                key: 'celOne',
            },
            {
                title: 'Telefone 2',
                dataIndex: 'celTwo',
                key: 'celTwo',
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: 'Ações',
                dataIndex: '_id',
                key: '_id',
                render: (id) => <>
                    <Tooltip placement='top' title='Editar'>
                        <Button shape="circle" icon="edit" size='small' style={{ marginRight: 5 }} type='primary' onClick={() => this.handleInformation(id)} />
                    </Tooltip>
                </>,
                width: '6%'
            }
        ];

        return (
            <>

                <Table columns={columns} dataSource={this.state.funcionarios} size='small' rowKey={(func) => func._id} />

                <Modal
                    title="Editar Informações"
                    visible={this.state.drawerUpdate}
                    onCancel={() => this.setState({ drawerUpdate: false })}
                    footer={[
                        <Button key="back" icon='close' type='danger' onClick={() => this.setState({ drawerUpdate: false })}>
                            Cancelar
                        </Button>,
                        <Button key="submit" icon='save' type="primary" loading={this.state.loading} onClick={() => { this.sendUpdateFunc() }}>
                            Salvar
                        </Button>,
                    ]}
                    width='80%'
                >

                    <Row gutter={8}>

                        <Col span={16}>

                            <label>Nome do funcionário<span style={{ color: 'red' }}>*</span></label>
                            <Input type='text' onChange={(e) => this.setState({ name: e.target.value.toUpperCase() })} value={this.state.name} />

                        </Col>

                        <Col span={4}>

                            <label>Sexo<span style={{ color: 'red' }}>*</span></label>
                            <Select value={this.state.gender} style={{ width: '100%' }} onChange={(value) => this.setState({ gender: value })}>
                                <Option value='masc'>Masculino</Option>
                                <Option value='fem'>Feminino</Option>
                            </Select>

                        </Col>

                        <Col span={4}>

                            <label>Data de nascimento<span style={{ color: 'red' }}>*</span></label>
                            <InputMask mask={'99/99/9999'} className='ant-input' onChange={(e) => this.setState({ dateBirth: e.target.value })} value={this.state.dateBirth} />

                        </Col>

                    </Row>

                    <Row gutter={8}>

                        <Col span={8}>
                            <label>Telefone celular 1<span style={{ color: 'red' }}>*</span></label>
                            <InputMask mask={'99 99999-9999'} className='ant-input' onChange={(e) => this.setState({ celOne: e.target.value })} value={this.state.celOne} />
                        </Col>

                        <Col span={8}>
                            <label>Telefone celular 2</label>
                            <InputMask mask={'99 99999-9999'} className='ant-input' onChange={(e) => this.setState({ celTwo: e.target.value })} value={this.state.celTwo} />
                        </Col>

                        <Col span={8}>
                            <label>Email</label>
                            <Input type='text' onChange={(e) => this.setState({ email: e.target.value })} value={this.state.email} />
                        </Col>

                    </Row>

                </Modal>

            </>
        )
    }
}