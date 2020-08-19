import React, { Component } from 'react';
import { Icon, Table, Input, Button, Row, notification, Spin, Statistic, Modal } from 'antd';
import Highlighter from 'react-highlight-words';
import api from '../../../config/axios';

export default class Permissoes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            funcionarios: [],
            spinner: false,
            comission: 0,
            idFunc: null
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
        await api.get('/admin/findFuncionariosComissioned').then(response => {
            this.setState({ funcionarios: response.data.funcionarios });
            this.setState({ spinner: false });
        }).catch(error => {
            this.erro('Erro', error.message);
            this.setState({ spinner: false });
        });
    }

    sendUpdateComission = async() => {
        this.setState({ spinner: true });
        await api.put(`/admin/changeComission/${this.state.idFunc}`,{
            comission: this.state.comission
        }).then(response => {
            this.success('Sucesso', response.data.message);
            this.findFunc();
            this.setState({ spinner: false });
        }).catch(error => {
            this.erro('Erro', error.response.data.message);
        });
    }

    componentDidMount = () => {
        this.findFunc();
    }

    handleChangeComission = async(id) => {
        await this.setState({ idFunc: id });
        this.sendUpdateComission();
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
                title: 'Comissão Atual',
                dataIndex: 'comission',
                key: 'comission',
                render: (value) => <Statistic value={value} valueStyle={{fontSize: 15.5}} suffix="%"/>,
                align: 'center'
            },
            {
                title: 'Nova Comissão',
                dataIndex: '_id',
                key: '_id',
                render: (id) => <Row>
                    <Input type='number' style={{ width: '50%', marginRight: 5 }} addonAfter='%' onChange={(e) => this.setState({ comission: e.target.value })} value={this.state.comission}/>
                    <Button type='primary' icon='edit' onClick={() => this.handleChangeComission(id)}>Alterar</Button>
                </Row>,
            }
        ];

        return (
            <>
                <Spin spinning={this.state.spinner} size='large'>
                    <Table columns={columns} dataSource={this.state.funcionarios} size='small' rowKey={(func) => func._id}/>
                </Spin>
            </>
        )
    }
}