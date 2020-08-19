import React, { Component } from 'react';
import { Icon, Table, Button, Tooltip, Switch, Input, Row, Col, Divider, Select, Radio, Modal, Spin, Descriptions } from 'antd';
import Highlighter from 'react-highlight-words';
import InputMask from 'react-input-mask';
import { Link } from 'react-router-dom';
import { Header } from '../../../styles/styles';
import api from '../../../config/axios';
import TextMask from 'react-text-mask';

const { TextArea } = Input;
const { Option } = Select;

export default class GestaoDeClientes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            modalInfo: false,
            loading: false,
            modalUpdate: false,
            addressClient: false,
            veicleClient: false,
            drawerCar: false,
            drawerAddress: false,
            modalAdvancedFind: false,
            typeAdvandcedFind: 1,
            spinner: false,
            clientes: [],
            address: {},
            car: [],
            infoCliente: {},
            idCliente: '',
            ativo: null,
            restrito: null,
            loadingAddress: false,
            loadingCar: false,
            idCar: null,
            idAddress: null,
            newModelo: '',
            newMarca: '',
            newPlaca: '',
            newCor: '',
            newCombustivel: '',
            newObsCar: '',
            newRua: '',
            newNumero: '',
            newComp: '',
            newBairro: '',
            newCep: '',
            newCidade: '',
            newEstado: '',
            modalDelVeicle: false,
            modalDelEndereco: false,
            celOne: "",
            celTwo: "",
            cpf_cnpj: "",
            dateBirth: "",
            email: "",
            emitter: "",
            manager: "",
            municipalRegistration: "",
            name: "",
            obs: "",
            phoneComercial: "",
            rg: "",
            socialName: "",
            stateRegistration: "",
            typeClient: "",
            loadingClient: false
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

    handleInformation = async (id) => {
        const result = await this.state.clientes.find(obj => obj._id === id);
        await this.setState({ idCliente: id });
        await this.setState({ typeClient: result.typeClient });
        await this.setState({ celOne: result.celOne });
        await this.setState({ celTwo: result.celTwo });
        await this.setState({ cpf_cnpj: result.cpf_cnpj });
        await this.setState({ dateBirth: result.dateBirth });
        await this.setState({ email: result.email });
        await this.setState({ emitter: result.emitter });
        await this.setState({ manager: result.manager });
        await this.setState({ municipalRegistration: result.municipalRegistration });
        await this.setState({ name: result.name });
        await this.setState({ obs: result.obs });
        await this.setState({ phoneComercial: result.phoneComercial });
        await this.setState({ rg: result.rg });
        await this.setState({ socialName: result.socialName });
        await this.setState({ stateRegistration: result.stateRegistration });
        this.setState({ modalInfo: true });
    }

    sendUpdateClient = async () => {
        this.setState({ loadingClient: true });
        await api.put(`/admin/editCliente/${this.state.idCliente}`, {
            name: this.state.name,
            cpf_cnpj: this.state.cpf_cnpj,
            rg: this.state.rg,
            emitter: this.state.emitter,
            dateBirth: this.state.dateBirth,
            email: this.state.email,
            socialName: this.state.socialName,
            stateRegistration: this.state.stateRegistration,
            municipalRegistration: this.state.municipalRegistration,
            manager: this.state.manager,
            phoneComercial: this.state.phoneComercial,
            celOne: this.state.celOne,
            celTwo: this.state.celTwo,
            obs: this.state.obs,
        }).then(response => {
            this.success('Sucesso', response.data.message);
            this.findClients();
            this.setState({ loadingClient: false });
        }).catch(error => {
            if (error.message === 'Network Error') {
                this.erro('Erro', 'Sem conexão com o servidor');
                this.setState({ loadingClient: false });
                return false;
            }
            this.erro('Erro', error.response.data.message);
            this.setState({ loadingClient: false });
        });
    }

    sendUpdateCar = async () => {
        this.setState({ loadingCar: true });
        await api.put(`/admin/editVeiculo/${this.state.idCar}`, {
            model: this.state.newModelo,
            marca: this.state.newMarca,
            placa: this.state.newPlaca,
            color: this.state.newCor,
            fuel: this.state.newCombustivel,
            obs: this.state.newObsCar
        }).then(response => {
            this.success('Sucesso', response.data.message);
            this.setState({ loadingCar: false });
        }).catch(error => {
            if (error.message === 'Network Error') {
                this.erro('Erro', 'Sem conexão com o servidor');
                this.setState({ loadingCar: false });
                return false;
            }
            this.erro('Erro', error.response.data.message);
            this.setState({ loadingCar: false });
        });
    }

    sendUpdateAddress = async () => {
        this.setState({ loadingAddress: true });
        await api.put(`/admin/editEndereco/${this.state.idAddress}`, {
            street: this.state.newRua,
            number: this.state.newNumero,
            comp: this.state.newComp,
            bairro: this.state.newBairro,
            cep: this.state.newCep,
            city: this.state.newCidade,
            state: this.state.newEstado
        }).then(response => {
            this.success('Sucesso', response.data.message);
            this.setState({ loadingAddress: false });
        }).catch(error => {
            if (error.message === 'Network Error') {
                this.erro('Erro', 'Sem conexão com o servidor');
                this.setState({ loadingAddress: false });
                return false;
            }
            this.erro('Erro', error.response.data.message);
            this.setState({ loadingAddress: false });
        });
    }

    sendDelVeicle = async () => {
        this.setState({ loading: true });
        await api.delete(`/admin/delVeiculo/${this.state.idCar}`).then(response => {
            this.setState({ loading: false });
            this.setState({ modalDelVeicle: false });
            this.success('Sucesso', response.data.message);
        }).catch(error => {
            if (error.message === 'Network Error') {
                this.erro('Erro', 'Sem conexão com o servidor');
                this.setState({ loading: false });
                this.setState({ modalDelVeicle: false });
                return false;
            }
            this.setState({ loading: false });
            this.setState({ modalDelVeicle: false });
            this.erro('Erro', error.response.data.message);
        });
    }

    sendDelAddress = async () => {
        this.setState({ loading: true });
        await api.delete(`/admin/delEndereco/${this.state.idAddress}`).then(response => {
            this.setState({ loading: false });
            this.setState({ modalDelEndereco: false });
            this.success('Sucesso', response.data.message);
        }).catch(error => {
            if (error.message === 'Network Error') {
                this.erro('Erro', 'Sem conexão com o servidor');
                this.setState({ loading: false });
                this.setState({ modalDelEndereco: false });
                return false;
            }
            this.setState({ loading: false });
            this.setState({ modalDelEndereco: false });
            this.erro('Erro', error.response.data.message);
        });
    }

    handleUpdateCar = async (id) => {
        const result = await this.state.car.find(obj => obj._id === id);
        await this.setState({ idCar: id });
        await this.setState({ newModelo: result.model });
        await this.setState({ newMarca: result.marca });
        await this.setState({ newPlaca: result.placa });
        await this.setState({ newCor: result.color });
        await this.setState({ newCombustivel: result.fuel });
        await this.setState({ newObsCar: result.obs });
        this.setState({ veicleClient: false });
        this.setState({ viewInfo: false });
        this.setState({ drawerCar: true });
    }

    handleUpdateAddress = async (address) => {
        await this.setState({ idAddress: address._id });
        await this.setState({ newRua: address.street });
        await this.setState({ newNumero: address.number });
        await this.setState({ newComp: address.comp });
        await this.setState({ newBairro: address.bairro });
        await this.setState({ newCep: address.cep });
        await this.setState({ newCidade: address.city });
        await this.setState({ newEstado: address.state });
        this.setState({ addressClient: false });
        this.setState({ viewInfo: false });
        this.setState({ drawerAddress: true });
    }

    handleDelVeicle = async (veicle) => {
        await this.setState({ idCar: veicle });
        this.setState({ viewInfo: false });
        this.setState({ veicleClient: false });
        this.setState({ modalDelVeicle: true });
    }

    handleDelAddress = async (address) => {
        await this.setState({ idAddress: address });
        this.setState({ viewInfo: false });
        this.setState({ addressClient: false });
        this.setState({ modalDelEndereco: true });
    }

    handleSendAdvancedFind = async () => {
        this.setState({ loading: true });
        await api.post(`/admin/buscaGestao`, {
            find: this.state.typeAdvandcedFind
        }).then(response => {
            this.setState({ clientes: response.data.clientes });
            this.setState({ loading: false });
            this.setState({ modalAdvancedFind: false });
        }).catch(error => {
            if (error.message === 'Network Error') {
                this.erro('Erro', 'Sem conexão com o servidor');
                this.setState({ loading: false });
                return false;
            }
            this.erro('Erro', error.response.data.message);
            this.setState({ loading: false });
        })
    }

    findClients = async () => {
        this.setState({ spinner: true });
        await api.get(`/admin/listClientes`).then(response => {
            this.setState({ clientes: response.data.clientes });
            this.setState({ spinner: false });
        }).catch(error => {
            if (error.message === 'Network Error') {
                this.erro('Erro', 'Sem conexão com o servidor');
                this.setState({ spinner: false });
                return false;
            }
        });
    }

    findAddress = async () => {
        this.setState({ loadingAddress: true });
        await api.get(`/admin/findAddressId/${this.state.idCliente}`).then(response => {
            this.setState({ address: response.data.endereco });
            this.setState({ loadingAddress: false });
            this.setState({ addressClient: true });
        }).catch(error => {
            if (error.message === 'Network Error') {
                this.erro('Erro', 'Sem conexão com o servidor');
                this.setState({ loadingAddress: false });
                return false;
            }
            this.erro('Erro', error.response.data.message);
            this.setState({ loadingAddress: false });
        });
    }

    findCar = async () => {
        this.setState({ loadingCar: true });
        await api.get(`/admin/findVeicleId/${this.state.idCliente}`).then(response => {
            this.setState({ car: response.data.veiculo });
            this.setState({ loadingCar: false });
            this.setState({ veicleClient: true });
        }).catch(error => {
            if (error.message === 'Network Error') {
                this.erro('Erro', 'Sem conexão com o servidor');
                this.setState({ loadingCar: false });
                return false;
            }
            this.erro('Erro', error.response.data.message);
            this.setState({ loadingCar: false });
        });
    }

    sendActive = async () => {
        this.setState({ spinner: true });
        await api.put(`/admin/activeClients/${this.state.idCliente}`, {
            active: this.state.ativo
        }).then(response => {
            this.success('Sucesso', response.data.message);
            this.setState({ spinner: false });
            this.findClients();
        }).catch(error => {
            if (error.message === 'Network Error') {
                this.erro('Erro', 'Sem conexão com o servidor');
                this.setState({ spinner: false });
                return false;
            }
            this.erro('Erro', error.response.data.message);
            this.setState({ spinner: false });
        });
    }

    sendRestrict = async () => {
        this.setState({ spinner: true });
        await api.put(`/admin/restrictClients/${this.state.idCliente}`, {
            restrict: this.state.restrito
        }).then(response => {
            this.success('Sucesso', response.data.message);
            this.setState({ spinner: false });
            this.findClients();
        }).catch(error => {
            if (error.message === 'Network Error') {
                this.erro('Erro', 'Sem conexão com o servidor');
                this.setState({ spinner: false });
                return false;
            }
            this.erro('Erro', error.response.data.message);
            this.setState({ spinner: false });
        });
    }

    componentDidMount = () => {
        this.findClients();
    }

    handleActive = async (id) => {
        await this.setState({ idCliente: id._id });
        await this.setState({ ativo: !id.active });
        this.sendActive();
    }

    handleRestrict = async (id) => {
        await this.setState({ idCliente: id._id });
        await this.setState({ restrito: !id.restrict });
        this.sendRestrict();
    }

    render() {

        const columns = [
            {
                title: 'Cliente',
                dataIndex: 'name',
                key: 'name',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: 'Razão Social',
                dataIndex: 'socialName',
                key: 'socialName',
                ...this.getColumnSearchProps('socialName'),
            },
            {
                title: 'CPF / CNPJ',
                dataIndex: 'cpf_cnpj',
                key: 'cpf_cnpj',
                ...this.getColumnSearchProps('cpf_cnpj'),
            },
            {
                title: 'Tel Comercial',
                dataIndex: 'phoneComercial',
                key: 'phoneComercial',
            },
            {
                title: 'Tel Celular',
                dataIndex: 'celOne',
                key: 'celOne',
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
                width: '5%',
                align: 'center'
            },
            {
                title: 'Restrito?',
                dataIndex: 'restrict',
                key: 'restrict',
                render: (restrict, id) => <>
                    <Switch
                        checkedChildren={<Icon type="check" />}
                        unCheckedChildren={<Icon type="close" />}
                        defaultChecked={restrict}
                        onChange={() => this.handleRestrict(id)}
                    />
                </>,
                width: '6%',
                align: 'center'
            },
            {
                title: 'Ações',
                dataIndex: '_id',
                key: '_id',
                render: (_id) => <>
                    <Tooltip placement='top' title='Informações'>
                        <Button shape="circle" icon="edit" type='primary' size='small' onClick={() => this.handleInformation(_id)} />
                    </Tooltip>
                </>,
                width: '7%',
                align: 'center'
            }
        ];

        return (
            <>

                <Header>
                    <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='team' style={{ fontSize: 20 }} />  GESTÃO DE CLIENTES</p>
                    <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
                </Header>

                <Spin spinning={this.state.spinner} size='large'>

                    <Button icon='search' type='primary' style={{ marginTop: 10 }} onClick={() => this.setState({ modalAdvancedFind: true })}>Busca Avançada</Button>

                    <Table pagination={{ pageSize: 10 }} columns={columns} dataSource={this.state.clientes} size='small' style={{ marginTop: 10 }} rowKey={(client) => client._id} />

                </Spin>

                <Modal
                    title={`Visualizar Endereço`}
                    visible={this.state.addressClient}
                    onCancel={() => this.setState({ addressClient: false })}
                    footer={[
                        <Button key="submit" icon='close' type="danger" onClick={() => this.setState({ addressClient: false })}>
                            Fechar
                        </Button>,
                    ]}
                    width='80%'
                    style={{ top: 15 }}
                >

                    {!this.state.address && (
                        <p>Este cliente não possui um endereço cadastrado</p>
                    )}

                    {this.state.address && (
                        <>

                            <Row style={{ marginTop: 10 }}>

                                <Col span={24} style={{ padding: 4 }}>
                                    <Descriptions layout="vertical" bordered size='small'>
                                        <Descriptions.Item label="Rua" span={2}>{this.state.address.street}</Descriptions.Item>
                                        <Descriptions.Item label="Número">{this.state.address.number}</Descriptions.Item>
                                        <Descriptions.Item label="Bairro" span={3}>{this.state.address.bairro}</Descriptions.Item>
                                        <Descriptions.Item label="Complemento" span={3}>{this.state.address.comp}</Descriptions.Item>
                                        <Descriptions.Item label="CEP" span={1}>{this.state.address.cep}</Descriptions.Item>
                                        <Descriptions.Item label="Cidade" span={2}>{this.state.address.city}</Descriptions.Item>
                                        <Descriptions.Item label="Estaddo" span={3}>{this.state.address.state}</Descriptions.Item>
                                    </Descriptions>
                                </Col>

                            </Row>

                            <div style={{ width: '100%' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'flex-end', alignItems: 'center', padding: 4 }}>

                                    <Button type="default" icon="edit" size='default' style={{ marginRight: 10 }}
                                        onClick={() => this.handleUpdateAddress(this.state.address)}
                                    >
                                        Editar endereço
                                    </Button>

                                    <Button type="danger" icon="close" size='default' onClick={() => this.handleDelAddress(this.state.address._id)}>
                                        Excluir endereço
                                    </Button>

                                </div>
                            </div>

                        </>
                    )}

                </Modal>

                <Modal
                    title={`Visualizar Veículos`}
                    visible={this.state.veicleClient}
                    onCancel={() => this.setState({ veicleClient: false })}
                    footer={[
                        <Button key="submit" icon='close' type="danger" onClick={() => this.setState({ veicleClient: false })}>
                            Fechar
                            </Button>,
                    ]}
                    width='80%'
                    style={{ top: 15 }}
                >

                    {!this.state.car.length && (
                        <p>Este cliente não tem um veículo cadastrado</p>
                    )}

                    {this.state.car.map(carro => (
                        <div key={carro._id}>
                            <Row style={{ marginTop: 10 }}>

                                <Col span={24} style={{ padding: 4 }}>
                                    <Descriptions layout="vertical" bordered size='small'>
                                        <Descriptions.Item label="Modelo" span={2}>{carro.model}</Descriptions.Item>
                                        <Descriptions.Item label="Marca">{carro.marca}</Descriptions.Item>
                                        <Descriptions.Item label="Placa" span={1}>{carro.placa}</Descriptions.Item>
                                        <Descriptions.Item label="Cor" span={1}>{carro.color}</Descriptions.Item>
                                        <Descriptions.Item label="Combustível" span={1}>{carro.fuel}</Descriptions.Item>
                                        <Descriptions.Item label="Observações" span={3}>{carro.obs}</Descriptions.Item>
                                    </Descriptions>

                                    <div style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'flex-end', alignItems: 'center', padding: 4 }}>

                                            <Button type="default" icon="edit" size='default' style={{ marginRight: 10 }}
                                                onClick={() => this.handleUpdateCar(carro._id)}
                                            >
                                                Editar veículo
                                            </Button>

                                            <Button type="danger" icon="close" size='default' onClick={() => this.handleDelVeicle(carro._id)}>
                                                Excluir veículo
                                            </Button>

                                        </div>
                                    </div>

                                    <Divider />
                                </Col>

                            </Row>
                        </div>
                    ))}

                </Modal>

                <Modal
                    title={`Editar Informações`}
                    visible={this.state.modalInfo}
                    onCancel={() => this.setState({ modalInfo: false })}
                    footer={[
                        <Button key="address" icon='environment' type="default" onClick={() => this.findAddress()}
                            loading={this.state.loadingAddress}>
                            Endereço
                        </Button>,
                        <Button key="veicle" icon='car' type="default" onClick={() => this.findCar()}
                            loading={this.state.loadingCar}>
                            Veículos
                        </Button>,
                        <Button key="submit" icon='save' type="primary" loading={this.state.loadingClient} onClick={() => this.sendUpdateClient()}>
                            Salvar Alterações
                        </Button>,
                    ]}
                    width='90%'
                    style={{ top: 15 }}
                >

                    {this.state.typeClient === 'fisic' && (

                        <>
                            <Row style={{ marginBottom: 7 }}>

                                <Col span={18} style={{ padding: 4 }}>
                                    <label>Nome<span style={{ color: 'red' }}>*</span></label>
                                    <Input value={this.state.name} type='text' onChange={(e) => this.setState({ name: e.target.value.toUpperCase() })} />
                                </Col>

                                <Col span={6} style={{ padding: 4 }}>
                                    <label>Email</label>
                                    <Input value={this.state.email} type='text' onChange={(e) => this.setState({ email: e.target.value })} />
                                </Col>

                            </Row>

                            <Row style={{ marginBottom: 7 }}>

                                <Col span={6} style={{ padding: 4 }}>
                                    <label>CPF<span style={{ color: 'red' }}>*</span></label>
                                    <InputMask mask={'999.999.999-99'} className='ant-input' onChange={(e) => this.setState({ cpf_cnpj: e.target.value })} value={this.state.cpf_cnpj} />
                                </Col>

                                <Col span={6} style={{ padding: 4 }}>
                                    <label>RG<span style={{ color: 'red' }}>*</span></label>
                                    <Input type='number' onChange={(e) => this.setState({ rg: e.target.value.toUpperCase() })} value={this.state.rg} />
                                </Col>

                                <Col span={6} style={{ padding: 4 }}>
                                    <label>Órgão emissor<span style={{ color: 'red' }}>*</span></label>
                                    <Input type='text' onChange={(e) => this.setState({ emitter: e.target.value.toUpperCase() })} value={this.state.emitter} />
                                </Col>

                                <Col span={6} style={{ padding: 4 }}>
                                    <label>Data de nascimento<span style={{ color: 'red' }}>*</span></label>
                                    <InputMask mask={'99/99/9999'} className='ant-input' onChange={(e) => this.setState({ dateBirth: e.target.value })} value={this.state.dateBirth} />
                                </Col>

                            </Row>

                            <Row>

                                <Col span={6} style={{ padding: 4 }}>
                                    <label>Inscrição estadual</label>
                                    <Input type='text' onChange={(e) => this.setState({ stateRegistration: e.target.value })} value={this.state.stateRegistration} />
                                </Col>

                                <Col span={6} style={{ padding: 4 }}>
                                    <label>Telefone comercial</label>
                                    <InputMask mask={'99 9999-9999'} className='ant-input' onChange={(e) => this.setState({ phoneComercial: e.target.value })} value={this.state.phoneComercial} />
                                </Col>

                                <Col span={6} style={{ padding: 4 }}>
                                    <label>Telefone celular 1<span style={{ color: 'red' }}>*</span></label>
                                    <InputMask mask={'99 99999-9999'} className='ant-input' onChange={(e) => this.setState({ celOne: e.target.value })} value={this.state.celOne} />
                                </Col>

                                <Col span={6} style={{ padding: 4 }}>
                                    <label>Telefone celular 2</label>
                                    <InputMask mask={'99 99999-9999'} className='ant-input' onChange={(e) => this.setState({ celTwo: e.target.value })} value={this.state.celTwo} />
                                </Col>

                            </Row>

                            <Row>
                                <Col span={24} style={{ padding: 4 }}>
                                    <label>Observações</label>
                                    <TextArea rows={4} onChange={(e) => this.setState({ obs: e.target.value.toUpperCase() })} value={this.state.obs} />
                                </Col>
                            </Row>
                        </>

                    )}

                    {this.state.typeClient === 'juridic' && (

                        <>
                            <Row style={{ marginBottom: 7 }}>


                                <Col span={18} style={{ padding: 4 }}>
                                    <label>Nome<span style={{ color: 'red' }}>*</span></label>
                                    <Input value={this.state.name} type='text' onChange={(e) => this.setState({ name: e.target.value.toUpperCase() })} />
                                </Col>

                                <Col span={6} style={{ padding: 4 }}>
                                    <label>Email</label>
                                    <Input value={this.state.email} type='text' onChange={(e) => this.setState({ email: e.target.value })} />
                                </Col>

                            </Row>

                            <Row style={{ marginBottom: 7 }}>

                                <Col span={8} style={{ padding: 4 }}>
                                    <label>CNPJ<span style={{ color: 'red' }}>*</span></label>
                                    <InputMask mask={'99.999.999/9999-99'} className='ant-input' onChange={(e) => this.setState({ cpf_cnpj: e.target.value })} value={this.state.cpf_cnpj} />
                                </Col>

                                <Col span={8} style={{ padding: 4 }}>
                                    <label>Razão social<span style={{ color: 'red' }}>*</span></label>
                                    <Input type='text' onChange={(e) => this.setState({ socialName: e.target.value.toUpperCase() })} value={this.state.socialName} />
                                </Col>

                                <Col span={8} style={{ padding: 4 }}>
                                    <label>Inscrição estadual</label>
                                    <Input type='text' onChange={(e) => this.setState({ stateRegistration: e.target.value })} value={this.state.stateRegistration} />
                                </Col>


                            </Row>

                            <Row style={{ marginBottom: 7 }}>

                                <Col span={8} style={{ padding: 4 }}>
                                    <label>Telefone comercial</label>
                                    <InputMask mask={'99 9999-9999'} className='ant-input' onChange={(e) => this.setState({ phoneComercial: e.target.value })} value={this.state.phoneComercial} />
                                </Col>

                                <Col span={8} style={{ padding: 4 }}>
                                    <label>Telefone celular 1<span style={{ color: 'red' }}>*</span></label>
                                    <InputMask mask={'99 99999-9999'} className='ant-input' onChange={(e) => this.setState({ celOne: e.target.value })} value={this.state.celOne} />
                                </Col>

                                <Col span={8} style={{ padding: 4 }}>
                                    <label>Telefone celular 2</label>
                                    <InputMask mask={'99 99999-9999'} className='ant-input' onChange={(e) => this.setState({ celTwo: e.target.value })} value={this.state.celTwo} />
                                </Col>

                            </Row>

                            <Row>

                                <Col span={12} style={{ padding: 4 }}>
                                    <label>Inscrição municipal</label>
                                    <Input onChange={(e) => this.setState({ municipalRegistration: e.target.value })} value={this.state.municipalRegistration} />
                                </Col>

                                <Col span={12} style={{ padding: 4 }}>
                                    <label>Responsável</label>
                                    <Input type='text' onChange={(e) => this.setState({ manager: e.target.value.toUpperCase() })} value={this.state.manager} />
                                </Col>

                            </Row>

                            <Row>
                                <Col span={24} style={{ padding: 4 }}>
                                    <label>Observações</label>
                                    <TextArea rows={4} onChange={(e) => this.setState({ obs: e.target.value.toUpperCase() })} value={this.state.obs} />
                                </Col>
                            </Row>
                        </>

                    )}

                </Modal>

                <Modal
                    title={`Editar Veículo`}
                    visible={this.state.drawerCar}
                    onCancel={() => this.setState({ drawerCar: false })}
                    footer={[
                        <Button key="cancel" icon='close' type="danger" onClick={() => this.setState({ drawerCar: false })}>
                            Cancelar
                        </Button>,
                        <Button key="submit" icon='save' type="primary" loading={this.state.loadingCar} onClick={() => this.sendUpdateCar()}>
                            Salvar Alterações
                        </Button>,
                    ]}
                    width='80%'
                    style={{ top: 15 }}
                >

                    <Row style={{ marginTop: 10 }}>

                        <Col span={12} style={{ padding: 4 }}>
                            <label>Modelo<span style={{ color: 'red' }}>*</span></label>
                            <Input type='text' onChange={(e) => this.setState({ newModelo: e.target.value.toUpperCase() })} value={this.state.newModelo} />
                        </Col>
                        <Col span={6} style={{ padding: 4 }}>
                            <label>Marca<span style={{ color: 'red' }}>*</span></label>
                            <Input type='text' onChange={(e) => this.setState({ newMarca: e.target.value.toUpperCase() })} value={this.state.newMarca} />
                        </Col>
                        <Col span={6} style={{ padding: 4 }}>
                            <label>Placa<span style={{ color: 'red' }}>*</span></label>
                            <TextMask value={this.state.newPlaca} onChange={(e) => this.setState({ newPlaca: e.target.value.toUpperCase() })} className='ant-input' mask={[/[A-Z]/i, /[A-Z]/i, /[A-Z]/i, '-', /\d/, /\d/, /\d/, /\d/]} />
                        </Col>

                    </Row>

                    <Row>

                        <Col span={12} style={{ padding: 4 }}>
                            <label>Cor</label>
                            <Input type='text' onChange={(e) => this.setState({ newCor: e.target.value.toUpperCase() })} value={this.state.newCor} />
                        </Col>
                        <Col span={12} style={{ padding: 4 }}>
                            <label>Combustível</label>
                            <Input type='text' onChange={(e) => this.setState({ newCombustivel: e.target.value.toUpperCase() })} value={this.state.newCombustivel} />
                        </Col>

                    </Row>

                    <Row>
                        <Col span={24} style={{ padding: 4 }}>
                            <label>Observações</label>
                            <TextArea rows={4} onChange={(e) => this.setState({ newObsCar: e.target.value.toUpperCase() })} value={this.state.newObsCar} />
                        </Col>
                    </Row>

                </Modal>

                <Modal
                    title={`Editar Endereço`}
                    visible={this.state.drawerAddress}
                    onCancel={() => this.setState({ drawerAddress: false })}
                    footer={[
                        <Button key="cancel" icon='close' type="danger" onClick={() => this.setState({ drawerAddress: false })}>
                            Cancelar
                        </Button>,
                        <Button key="submit" icon='save' type="primary" loading={this.state.loadingAddress} onClick={() => this.sendUpdateAddress()}>
                            Salvar Alterações
                        </Button>,
                    ]}
                    width='80%'
                    style={{ top: 15 }}
                >

                    <Row style={{ marginTop: 10 }}>

                        <Col span={20} style={{ padding: 4 }}>
                            <label>Rua<span style={{ color: 'red' }}>*</span></label>
                            <Input type='text' onChange={(e) => this.setState({ newRua: e.target.value.toUpperCase() })} value={this.state.newRua} />
                        </Col>

                        <Col span={4} style={{ padding: 4 }}>
                            <label>Número<span style={{ color: 'red' }}>*</span></label>
                            <Input type='text' onChange={(e) => this.setState({ newNumero: e.target.value.toUpperCase() })} value={this.state.newNumero} />
                        </Col>

                    </Row>

                    <Row style={{ marginTop: 10 }}>

                        <Col span={12} style={{ padding: 4 }}>
                            <label>Complemento</label>
                            <Input type='text' onChange={(e) => this.setState({ newComp: e.target.value.toUpperCase() })} value={this.state.newComp} />
                        </Col>

                        <Col span={12} style={{ padding: 4 }}>
                            <label>Bairro<span style={{ color: 'red' }}>*</span></label>
                            <Input type='text' onChange={(e) => this.setState({ newBairro: e.target.value.toUpperCase() })} value={this.state.newBairro} />
                        </Col>

                    </Row>

                    <Row style={{ marginTop: 10 }}>

                        <Col span={6} style={{ padding: 4 }}>
                            <label>CEP<span style={{ color: 'red' }}>*</span></label>
                            <InputMask mask={'99.999-999'} className='ant-input' onChange={(e) => this.setState({ newCep: e.target.value })} value={this.state.newCep} />
                        </Col>

                        <Col span={12} style={{ padding: 4 }}>
                            <label>Cidade<span style={{ color: 'red' }}>*</span></label>
                            <Input type='text' onChange={(e) => this.setState({ newCidade: e.target.value.toUpperCase() })} value={this.state.newCidade} />
                        </Col>

                        <Col span={6} style={{ padding: 4 }}>
                            <label>UF<span style={{ color: 'red' }}>*</span></label>
                            <Select value={this.state.newEstado} style={{ width: '100%' }} onChange={(value) => this.setState({ newEstado: value })}>
                                <Option value='AC'>AC</Option>
                                <Option value='AL'>AL</Option>
                                <Option value='AP'>AP</Option>
                                <Option value='AM'>AM</Option>
                                <Option value='BA'>BA</Option>
                                <Option value='CE'>CE</Option>
                                <Option value='DF'>DF</Option>
                                <Option value='ES'>ES</Option>
                                <Option value='GO'>GO</Option>
                                <Option value='MA'>MA</Option>
                                <Option value='MT'>MT</Option>
                                <Option value='MS'>MS</Option>
                                <Option value='MG'>MG</Option>
                                <Option value='PA'>PA</Option>
                                <Option value='PB'>PB</Option>
                                <Option value='PR'>PR</Option>
                                <Option value='PE'>PE</Option>
                                <Option value='PI'>PI</Option>
                                <Option value='RJ'>RJ</Option>
                                <Option value='RN'>RN</Option>
                                <Option value='RS'>RS</Option>
                                <Option value='RO'>RO</Option>
                                <Option value='RR'>RR</Option>
                                <Option value='SC'>SC</Option>
                                <Option value='SP'>SP</Option>
                                <Option value='SE'>SE</Option>
                                <Option value='TO'>TO</Option>
                            </Select>
                        </Col>

                    </Row>

                </Modal>

                <Modal
                    title="Busca Avançada"
                    visible={this.state.modalAdvancedFind}
                    onCancel={() => this.setState({ modalAdvancedFind: false })}
                    footer={[
                        <Button key="back" icon='close' type='danger' onClick={() => this.setState({ modalAdvancedFind: false })}>
                            Cancelar
                        </Button>,
                        <Button key="submit" icon='search' type="primary" loading={this.state.loading} onClick={() => { this.handleSendAdvancedFind() }}>
                            Buscar
                        </Button>,
                    ]}
                >

                    <Radio.Group onChange={(event) => { this.setState({ typeAdvandcedFind: event.target.value }) }} value={this.state.typeAdvandcedFind}>
                        <Radio value={1} style={{ width: '100%' }}>Clientes Ativos</Radio>
                        <Radio value={2} style={{ width: '100%' }}>Clientes Bloqueados</Radio>
                        <Radio value={3} style={{ width: '100%' }}>Clientes com Restrição</Radio>
                        <Radio value={4} style={{ width: '100%' }}>Todos os Clientes</Radio>
                    </Radio.Group>

                </Modal>

                <Modal
                    title="Excluir Veículo"
                    visible={this.state.modalDelVeicle}
                    onCancel={() => this.setState({ modalDelVeicle: false })}
                    footer={[
                        <Button key="back" icon='close' type='danger' onClick={() => this.setState({ modalDelVeicle: false })}>
                            Não
                        </Button>,
                        <Button key="submit" icon='check' type="primary" loading={this.state.loading} onClick={() => { this.sendDelVeicle() }}>
                            Sim
                        </Button>,
                    ]}
                >

                    <p>Tem certeza que deseja excluir este veículo?</p>

                </Modal>

                <Modal
                    title="Excluir Endereço"
                    visible={this.state.modalDelEndereco}
                    onCancel={() => this.setState({ modalDelEndereco: false })}
                    footer={[
                        <Button key="back" type='danger' icon='close' onClick={() => this.setState({ modalDelEndereco: false })}>
                            Não
                        </Button>,
                        <Button key="submit" icon='check' type="primary" loading={this.state.loading} onClick={() => { this.sendDelAddress() }}>
                            Sim
                        </Button>,
                    ]}
                >

                    <p>Tem certeza que deseja excluir este endereço?</p>

                </Modal>

            </>
        )
    }
}