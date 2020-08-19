import React, { Component } from 'react';
import { Icon, Button, Table, notification, Spin, Modal, Tooltip, Input, Row, Col, Statistic, Switch } from 'antd';
import { Header } from '../../../styles/styles';
import { Link } from 'react-router-dom';
import api from '../../../config/axios';
import Highlighter from 'react-highlight-words';

const { TextArea } = Input;

export default class GerenciaServicos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            spinner: false,
            loading: false,
            services: [],
            name: null,
            value: null,
            active: null,
            idService: null,
            modalService: false,
            description: ''
        }
    }

    openNotificationWithIcon = (type, title, message) => {
        notification[type]({
            message: title,
            description: message,
        });
    };

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

    findServices = async () => {
        this.setState({ spinner: true });
        await api.get('/admin/listService').then(response => {
            this.setState({ services: response.data.services });
            this.setState({ spinner: false });
        }).catch(error => {
            if (error.message === 'Network Error') {
                this.openNotificationWithIcon('error', 'Erro', 'Sem conexão com o servidor');
                this.setState({ spinner: false });
                return false;
            }
        });
    }

    componentDidMount = () => {
        this.findServices();
    }

    handleActive = async (id) => {
        await this.setState({ idService: id._id });
        await this.setState({ active: !id.active });
        this.sendActive();
    }

    handleEditService = async (id) => {
        const result = await this.state.services.find(obj => obj._id === id);
        await this.setState({ idService: result._id });
        await this.setState({ name: result.name });
        await this.setState({ value: result.value });
        await this.setState({ cityCode: result.cityServiceCode });
        this.setState({ modalService: true });
    }

    sendUpdateService = async () => {
        this.setState({ loading: true });
        await api.put(`/admin/changeServiceInfo/${this.state.idService}`, {
            name: this.state.name, value: this.state.value, description: this.state.description
        }).then(response => {
            this.openNotificationWithIcon('success', 'Sucesso', response.data.message);
            this.setState({ loading: false });
            this.setState({ modalService: false });
            this.findServices();
        }).catch(error => {
            this.openNotificationWithIcon('error', 'Erro', error.response.data.message);
            this.setState({ loading: false });
        });
    }

    sendActive = async () => {
        this.setState({ spinner: true });
        await api.put(`/admin/activeService/${this.state.idService}`, {
            active: this.state.active
        }).then(response => {
            this.openNotificationWithIcon('success', 'Sucesso', response.data.message);
            this.setState({ spinner: false });
            this.findServices();
        }).catch(error => {
            this.openNotificationWithIcon('error', 'Erro', error.response.data.message);
            this.setState({ spinner: false });
        });
    }

    render() {

        const columns = [
            {
                title: 'Nome',
                dataIndex: 'name',
                key: 'name',
                ...this.getColumnSearchProps('name'),
                width: '45%'
            },
            {
                title: 'Preço',
                dataIndex: 'value',
                key: 'value',
                width: '20%',
                render: (price) => <Statistic precision={2} value={price} valueStyle={{ fontSize: 15.5 }} prefix='R$' />
            },
            {
                title: 'Ativo?',
                dataIndex: 'active',
                key: 'active',
                width: '10%',
                render: (act, id) => <Switch
                    checkedChildren={<Icon type="check" />}
                    unCheckedChildren={<Icon type="close" />}
                    defaultChecked={act}
                    onChange={() => this.handleActive(id)}
                />
            },
            {
                title: 'Ações',
                dataIndex: '_id',
                key: '_id',
                render: (id) => <>
                    <Tooltip placement='top' title='Editar'>
                        <Button shape="circle" icon="edit" type='primary' size='small' style={{ marginRight: 5 }} onClick={() => this.handleEditService(id)} />
                    </Tooltip>
                </>,
                width: '6%',
                align: 'center'
            }
        ];

        return (
            <>

                <Header>
                    <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='tool' style={{ fontSize: 20 }} /> GERENCIAR SERVIÇOS</p>
                    <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
                </Header>

                <div style={{ marginTop: 15 }}>

                    <Spin spinning={this.state.spinner} size='large'>

                        <Table columns={columns} dataSource={this.state.services} size='small' rowKey={(prod) => prod._id} />

                    </Spin>

                </div>

                <Modal
                    title="Gerenciar Serviço"
                    visible={this.state.modalService}
                    onCancel={() => this.setState({ modalService: false })}
                    footer={[
                        <Button key="back" type='default' onClick={() => this.setState({ modalService: false })}>
                            Cancelar
                        </Button>,
                        <Button key="submit" type="primary" loading={this.state.loading} onClick={() => { this.sendUpdateService() }}>
                            Salvar
                        </Button>,
                    ]}
                    width='80%'
                >

                    <Row gutter={10} style={{ marginBottom: 10 }}>

                        <Col span={18}>

                            <label>Nome do Serviço</label>
                            <Input value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />

                        </Col>

                        <Col span={6}>

                            <label>Preço</label>
                            <Input type='number' addonAfter='R$' value={this.state.value} onChange={(e) => this.setState({ value: parseFloat(e.target.value) })} />

                        </Col>

                    </Row>

                    <Row gutter={10}>

                        <Col span={24}>

                            <label>Descrição</label>
                            <TextArea alue={this.state.description} onChange={(e) => this.setState({ description: e.target.value })} rows={3}/>

                        </Col>

                    </Row>

                </Modal>

            </>
        )
    }
}