import React, { Component } from 'react';
import { Icon, Table, Input, Button, Tooltip, Col, Row, Select, Spin, Modal, Switch, Card } from 'antd';
import Highlighter from 'react-highlight-words';
import api from '../../../config/axios';

const { Option } = Select;

export default class Permissoes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            loading: false,
            admin: false,
            sales: false,
            comissioned: false,
            caixa: false,
            funcionarios: [],
            spinner: false,
            modalFunc: false,
            comission: '',
            user: '',
            password: '',
            cargo: '',
            idFunc: '',
            ativo: null
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

    sendUpdateFunc = async () => {
        if (this.state.password === '') {
            this.warning('Atenção', 'Por favor insira uma senha no campo de senha');
            return false;
        }
        this.setState({ loading: true });
        await api.put(`/admin/changeFuncStatus/${this.state.idFunc}`, {
            admin: this.state.admin,
            sales: this.state.sales,
            caixa: this.state.caixa,
            comission: this.state.comission,
            comissioned: this.state.comissioned,
            user: this.state.user,
            password: this.state.password,
            cargo: this.state.cargo
        }).then(response => {
            this.success('Sucesso', response.data.message);
            this.findFunc();
            this.setState({ password: '' });
            this.setState({ loading: false });
            this.setState({ modalFunc: false });
        }).catch(error => {
            this.erro('Erro', error.response.data.message);
            this.setState({ loading: false });
            this.setState({ modalFunc: false });
        })
    }

    sendActive = async () => {
        this.setState({ spinner: true });
        await api.put(`/admin/activeFunc/${this.state.idFunc}`, {
            active: this.state.ativo
        }).then(response => {
            this.success('Sucesso', response.data.message);
            this.findFunc();
            this.setState({ spinner: false });
        }).catch(error => {
            this.erro('Erro', error.response.data.message);
            this.setState({ spinner: false });
        });
    }

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

    componentDidMount = () => {
        this.findFunc();
    }

    handleSalesAdmin = () => {
        if (this.state.admin === true) {
            this.setState({ admin: false });
        }
        if (this.state.caixa === true) {
            this.setState({ caixa: false });
        }
        this.setState({ sales: !this.state.sales });
    }

    handleAdmin = () => {
        if (this.state.sales === true) {
            this.setState({ sales: false });
        }
        if (this.state.caixa === true) {
            this.setState({ caixa: false });
        }
        this.setState({ admin: !this.state.admin });
    }

    handleCaixa = () => {
        if (this.state.admin === true) {
            this.setState({ admin: false });
        }
        if (this.state.sales === true) {
            this.setState({ sales: false });
        }
        this.setState({ caixa: !this.state.caixa });
    }

    handleGetFuncInfo = async (id) => {
        const result = await this.state.funcionarios.find(obj => obj._id === id);
        await this.setState({ idFunc: id });
        await this.setState({ sales: result.sales });
        await this.setState({ caixa: result.caixa });
        await this.setState({ admin: result.admin });
        await this.setState({ comission: result.comission });
        await this.setState({ comissioned: result.comissioned });
        await this.setState({ user: result.user });
        await this.setState({ cargo: result.cargo });
        this.setState({ modalFunc: true });
    }

    handleActive = async (id) => {
        await this.setState({ idFunc: id._id });
        await this.setState({ ativo: !id.active });
        this.sendActive();
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
                width: '6%'
            },
            {
                title: 'Ações',
                dataIndex: '_id',
                key: '_id',
                render: (id) => <>
                    <Tooltip placement='top' title='Gerenciar'>
                        <Button shape="circle" icon="tool" type='primary' size='small' style={{ marginRight: 5 }} onClick={() => this.handleGetFuncInfo(id)} />
                    </Tooltip>
                </>,
                width: '6%'
            }
        ];

        return (
            <>
                <Spin spinning={this.state.spinner} size='large'>

                    <Table columns={columns} dataSource={this.state.funcionarios} size='small' rowKey={(func) => func._id} />

                </Spin>

                <Modal
                    title="Gerenciar Funcionário"
                    visible={this.state.modalFunc}
                    onCancel={() => this.setState({ modalFunc: false })}
                    footer={[
                        <Button key="back" icon='close' type='danger' onClick={() => this.setState({ modalFunc: false })}>
                            Cancelar
                        </Button>,
                        <Button key="submit" icon='save' type="primary" loading={this.state.loading} onClick={() => { this.sendUpdateFunc() }}>
                            Salvar
                        </Button>,
                    ]}
                    width='80%'
                >

                    <>

                        <Row gutter={8} style={{marginBottom: 10}}>

                            <Col span={18}>

                                <Card size='small'>
                                    <Row style={{marginTop: -5}}>

                                        <Col span={8}>

                                            <label>Função administrativa?</label>
                                            <div style={{ width: '100%' }}>
                                                <Switch
                                                    checkedChildren={<Icon type="check" />}
                                                    unCheckedChildren={<Icon type="close" />}
                                                    checked={this.state.admin}
                                                    onChange={() => this.handleAdmin()}
                                                />
                                            </div>

                                        </Col>

                                        <Col span={8}>

                                            <label>Atividade de vendas?</label>
                                            <div style={{ width: '100%' }}>
                                                <Switch
                                                    checkedChildren={<Icon type="check" />}
                                                    unCheckedChildren={<Icon type="close" />}
                                                    checked={this.state.sales}
                                                    onChange={() => this.handleSalesAdmin()}
                                                />
                                            </div>

                                        </Col>

                                        <Col span={8}>

                                            <label>Função de caixa?</label>
                                            <div style={{ width: '100%' }}>
                                                <Switch
                                                    checkedChildren={<Icon type="check" />}
                                                    unCheckedChildren={<Icon type="close" />}
                                                    checked={this.state.caixa}
                                                    onChange={() => this.handleCaixa()}
                                                />
                                            </div>

                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span={6}>

                                <label>Cargo<span style={{ color: 'red' }}>*</span></label>

                                <Select value={this.state.cargo} style={{ width: '100%' }} onChange={(value) => this.setState({ cargo: value })}>

                                    <Option key={1} value={'Administrador(a)'}>Administrador(a)</Option>
                                    <Option key={2} value={'Diretor(a)'}>Diretor(a)</Option>
                                    <Option key={3} value={'Gerente'}>Gerente</Option>
                                    <Option key={4} value={'Caixa'}>Caixa</Option>
                                    <Option key={5} value={'Vendedor(a)'}>Vendedor(a)</Option>
                                    <Option key={6} value={'Auxiliar de Almoxarifado'}>Auxiliar de Almoxarifado</Option>
                                    <Option key={7} value={'Zelador(a)'}>Zelador(a)</Option>
                                    <Option key={8} value={'Conferente'}>Conferente</Option>
                                    <Option key={9} value={'Mecânico'}>Mecânico</Option>
                                    <Option key={10} value={'Auxiliar de Mecânico'}>Auxiliar de Mecânico</Option>

                                </Select>
                            </Col>
                        </Row>

                        {this.state.admin === true && (

                            <>

                                <Row gutter={8}>

                                    <Col span={12}>

                                        <label>Usuário</label>
                                        <Input type='text' onChange={(e) => this.setState({ user: e.target.value })} value={this.state.user} />

                                    </Col>

                                    <Col span={12}>

                                        <label>Senha administrativa</label>
                                        <Input.Password onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} />

                                    </Col>

                                </Row>

                            </>

                        )}

                        {this.state.caixa === true && (

                            <>

                                <Row gutter={8}>

                                    <Col span={12}>

                                        <label>Usuário</label>
                                        <Input type='text' onChange={(e) => this.setState({ user: e.target.value })} value={this.state.user} />

                                    </Col>

                                    <Col span={12}>

                                        <label>Senha</label>
                                        <Input.Password onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} />

                                    </Col>

                                </Row>

                            </>

                        )}

                        {this.state.sales === true && (

                            <>

                                <Row gutter={8}>

                                    <Col span={8}>

                                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                                            <label>Comissionado?</label>
                                            <Switch
                                                checkedChildren={<Icon type="check" />}
                                                unCheckedChildren={<Icon type="close" />}
                                                defaultChecked={this.state.comissioned}
                                                onChange={(value) => this.setState({ comissioned: value })}
                                                style={{ marginLeft: 10, marginTop: -2.5 }}
                                            />
                                        </div>

                                        <Input type='number' addonAfter='%' disabled={!this.state.comissioned} onChange={(e) => this.setState({ comission: e.target.value })} value={this.state.comission} />

                                    </Col>

                                    <Col span={8}>

                                        <label>Usuário</label>
                                        <Input type='text' onChange={(e) => this.setState({ user: e.target.value })} value={this.state.user} />

                                    </Col>

                                    <Col span={8}>

                                        <label>Senha</label>
                                        <Input.Password onChange={(e) => this.setState({ password: e.target.value })} value={this.state.password} />

                                    </Col>

                                </Row>

                            </>

                        )}

                    </>

                </Modal>
            </>
        )
    }
}