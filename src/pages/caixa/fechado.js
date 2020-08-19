import React, { Component } from 'react';
import { Table, Button, Tooltip, Divider, Drawer, Spin, Descriptions, Modal, Select, Switch, Icon, Statistic } from 'antd';
import api from '../../config/axios';

const { Option } = Select;

export default class CaixaFechado extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            modalOpenCaixa: false,
            modalFluxo: false,
            modalCaixa: false,
            loading: false,
            caixas: [],
            spinner: false,
            spinnerFlux: false,
            movimentLoading: false,
            moviments: [],
            cashier: {},
            funcCaixa: [],
            typeAdvandcedFind: null,
            modalAdvancedFind: false,
            dia: '',
            mes: '',
            ano: '',
            incFunc: false,
            idFunc: null,
            vendas: [],
            servicos: []
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

    findCaixas = async () => {
        this.setState({ spinner: true });
        await api.get('/cashier/listClose').then(response => {
            this.setState({ caixas: response.data.caixas });
            this.setState({ spinner: false });
        }).catch(error => {
            this.erro('Erro', error.message);
            this.setState({ spinner: false });
        });
    }

    findFuncCaixa = async () => {
        this.setState({ spinner: true });
        await api.get('/cashier/findFuncCaixas').then(response => {
            this.setState({ funcCaixa: response.data.funcionarios });
            this.setState({ spinner: false });
        }).catch(error => {
            this.erro('Erro', error.message);
            this.setState({ spinner: false });
        });
    }

    sendFindMoviment = async (id) => {
        this.setState({ movimentLoading: true });
        await api.post(`/cashier/findMoviment/${id}`).then(response => {
            this.setState({ moviments: response.data.findMoviments });
            this.setState({ cashier: response.data.findCaixa });
            this.setState({ movimentLoading: false });
            this.setState({ modalFluxo: true });
        }).catch(error => {
            this.erro('Erro', error.response.data.message);
            this.setState({ movimentLoading: false });
        });
    }

    sendAdvancedFind = async () => {
        if (this.state.typeAdvandcedFind === null) {
            this.warning('Atenção', 'Selecione uma opção de busca');
            return false;
        }
        this.setState({ loading: true });
        await api.post('/cashier/advancedFind', {
            func: this.state.idFunc, type: this.state.typeAdvandcedFind, dia: this.state.dia, mes: this.state.mes, ano: this.state.ano
        }).then(response => {
            this.setState({ caixas: response.data.caixa });
            this.setState({ loading: false });
            this.setState({ modalAdvancedFind: false });
        }).catch(error => {
            this.erro('Erro', error.response.data.message);
            this.setState({ loading: false });
        });
    }

    componentDidMount = () => {
        this.findCaixas();
        this.findFuncCaixa();
    }

    handleFunc = async (value) => {
        if (value === true) {
            this.setState({ incFunc: value });
        }
        if (value === false) {
            this.setState({ incFunc: value });
            this.setState({ idFunc: null });
        }
    }

    sendFindFlux = async (id) => {
        this.setState({ spinnerFlux: true });
        this.setState({ modalCaixa: true });
        await api.get(`/cashier/findCashierOrders/${id}`).then(response => {
            this.setState({ vendas: response.data.vendas });
            this.setState({ servicos: response.data.servicos });
            this.setState({ spinnerFlux: false });
        }).catch(error => {
            this.erro('Erro', error.response.data.message);
            this.setState({ spinnerFlux: false });
        });
    }

    render() {

        const columns = [
            {
                title: 'Funcionário',
                dataIndex: 'funcionario.name',
                key: 'funcionario.name',
            },
            {
                title: 'Valor Inicial (R$)',
                dataIndex: 'valueOpened',
                key: 'valueOpened',
                render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15.5 }} prefix='R$' precision={2} />,
                align: 'right'
            },
            {
                title: 'Saldo (R$)',
                dataIndex: 'saldo',
                key: 'saldo',
                render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15.5 }} prefix='R$' precision={2} />,
                align: 'right'
            },
            {
                title: 'Valor Final (R$)',
                dataIndex: 'valueClosed',
                key: 'valueClosed',
                render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15.5 }} prefix='R$' precision={2} />,
                align: 'right'
            },
            {
                title: 'Data Movimentação',
                dataIndex: 'movimentDate',
                key: 'movimentDate',
                align: 'center'
            },
            {
                title: 'Ações',
                dataIndex: '_id',
                key: '_id',
                render: (id) => <>
                    <Tooltip placement='top' title='Visualizar Movimentação'>
                        <Button shape='circle' icon="search" size='small' style={{ marginRight: 5 }} type='default' onClick={() => this.sendFindMoviment(id)} />
                    </Tooltip>
                    <Tooltip placement='top' title='Visualizar Fluxo'>
                        <Button shape='circle' icon="line-chart" size='small' type='primary' onClick={() => this.sendFindFlux(id)} />
                    </Tooltip>
                </>,
                width: '9%',
                align: 'center'
            }
        ];

        const columnsVendas = [
            {
                title: 'Cliente',
                dataIndex: 'client.name',
                key: 'client.name',
            },
            {
                title: 'Vendedor',
                dataIndex: 'funcionario.name',
                key: 'funcionario.name',
            },
            {
                title: 'Valor (R$)',
                dataIndex: 'valueLiquido',
                key: 'valueLiquido',
                render: (valor) => <Statistic value={valor} precision={2} valueStyle={{fontSize: 15.5}} prefix="R$" />,
                align: 'right',
                width: '13%'
            },
            {
                title: 'Pagamento',
                dataIndex: 'statusPay',
                key: 'statusPay',
                width: '10%',
                align: 'center',
                render: (value) => <>
                    {value === 'wait' && (
                        <Button type='link' size='small' style={{backgroundColor: '#ffeb3b', color: '#444', width: '100%'}}>Em Aberto</Button>
                    )}
                    {value === 'pay' && (
                        <Button type='link' size='small' style={{backgroundColor: '#4caf50', color: '#fff', width: '100%'}}>Pago</Button>
                    )}
                </>
            },
            {
                title: 'Data',
                dataIndex: 'createDate',
                key: 'createDate',
                width: '10%',
                align: 'center'
            },
        ];

        const columnServicos = [
            {
                title: 'Cliente',
                dataIndex: 'client.name',
                key: 'client.name',
            },
            {
                title: 'Vendedor',
                dataIndex: 'funcionario.name',
                key: 'funcionario.name',
            },
            {
                title: 'Tot. Produtos',
                dataIndex: 'productLiquid',
                key: 'productLiquid',
                render: (valor) => <Statistic value={valor} precision={2} valueStyle={{fontSize: 15.5}} prefix="R$" />,
                align: 'right',
                width: '13%'
            },
            {
                title: 'Tot. Servicos',
                dataIndex: 'serviceLiquid',
                key: 'serviceLiquid',
                render: (valor) => <Statistic value={valor} precision={2} valueStyle={{fontSize: 15.5}} prefix="R$" />,
                align: 'right',
                width: '13%'
            },
            {
                title: 'Total',
                dataIndex: 'valueLiquido',
                key: 'valueLiquido',
                render: (valor) => <Statistic value={valor} precision={2} valueStyle={{fontSize: 15.5}} prefix="R$" />,
                align: 'right',
                width: '13%'
            },
            {
                title: 'Pagamento',
                dataIndex: 'statusPay',
                key: 'statusPay',
                width: '10%',
                align: 'center',
                render: (value) => <>
                    {value === 'wait' && (
                        <Button type='link' size='small' style={{backgroundColor: '#ffeb3b', color: '#444', width: '100%'}}>Em Aberto</Button>
                    )}
                    {value === 'pay' && (
                        <Button type='link' size='small' style={{backgroundColor: '#4caf50', color: '#fff', width: '100%'}}>Pago</Button>
                    )}
                </>
            },
            {
                title: 'Data',
                dataIndex: 'createDate',
                key: 'createDate',
                width: '10%',
                align: 'center'
            },
        ];

        const columnsMoviments = [
            {
                title: 'Descrição',
                dataIndex: 'description',
                key: 'description',
                width: '60%'
            },
            {
                title: 'Tipo de Movimento',
                dataIndex: 'typeMoviment',
                key: 'typeMoviment',
                render: (mov) => <>
                    {mov === 'credit' && (
                        <Button size='small' type='link' style={{ backgroundColor: '#4caf50', color: '#fff', width: '100%' }}>Crédito</Button>
                    )}
                    {mov === 'debit' && (
                        <Button size='small' type='link' style={{ backgroundColor: '#f44336', color: '#fff', width: '100%' }}>Débito</Button>
                    )}
                </>,
                width: '20%',
                align: 'center'
            },
            {
                title: 'Valor (R$)',
                dataIndex: 'value',
                key: 'value',
                width: '12%',
                render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15.5 }} prefix='R$' precision={2} />,
                align: 'right'
            },
        ];

        const DataAtual = new Date();
        const Ano = DataAtual.getFullYear();

        return (
            <>
                <Spin spinning={this.state.spinner} size='large'>

                    <Button type='primary' icon='search' style={{ marginBottom: 10 }} onClick={() => this.setState({ modalAdvancedFind: true })}>Busca Avançada</Button>

                    <Table columns={columns} dataSource={this.state.caixas} size='small' rowKey={(cashier) => cashier._id} />

                </Spin>

                <Drawer
                    title="Movimentação do Caixa"
                    width={'80%'}
                    closable={true}
                    onClose={() => this.setState({ modalFluxo: false })}
                    visible={this.state.modalFluxo}
                    placement='left'
                >

                    {this.state.cashier !== {} && (

                        <Descriptions layout="vertical" bordered size='small'>
                            <Descriptions.Item label="Valor de Abertura" span={1}>{`R$ ${this.state.cashier.valueOpened}`}</Descriptions.Item>
                            <Descriptions.Item label="Valor de Fechamento" span={1}>{`R$ ${this.state.cashier.valueClosed}`}</Descriptions.Item>
                            <Descriptions.Item label="Saldo" span={1}>{`R$ ${this.state.cashier.saldo}`}</Descriptions.Item>
                            <Descriptions.Item label="Data da Movimentação" span={3}>{this.state.cashier.movimentDate}</Descriptions.Item>
                        </Descriptions>

                    )}

                    <Divider>Movimentações do Caixa</Divider>

                    <Table columns={columnsMoviments} dataSource={this.state.moviments} size='small' rowKey={(mov) => mov._id} />

                </Drawer>

                <Modal
                    title="Busca Avançada"
                    visible={this.state.modalAdvancedFind}
                    onCancel={() => this.setState({ modalAdvancedFind: false })}
                    footer={[
                        <Button key="back" icon='close' type='danger' onClick={() => this.setState({ modalAdvancedFind: false })}>
                            Cancelar
                        </Button>,
                        <Button key="submit" icon='search' type="primary" loading={this.state.loading} onClick={() => this.sendAdvancedFind()}>
                            Buscar
                        </Button>,
                    ]}
                    width='40%'
                >
                    <label>Selecione uma opção:</label>
                    <Select value={this.state.typeAdvandcedFind} style={{ width: '100%', marginBottom: 10 }} onChange={(value) => this.setState({ typeAdvandcedFind: value })}>
                        <Option value={1}>Buscar por data</Option>
                        <Option value={2}>Buscar por mês</Option>
                        <Option value={3}>Buscar por todos</Option>
                    </Select>

                    <label>Incluir funcionário na busca?</label>
                    <Switch
                        style={{ marginLeft: 10 }}
                        checkedChildren={<Icon type="check" />}
                        unCheckedChildren={<Icon type="close" />}
                        checked={this.state.incFunc}
                        onChange={(value) => this.handleFunc(value)}
                    />

                    {this.state.typeAdvandcedFind === 1 && (
                        <>
                            <Divider>Adicione a Data</Divider>

                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                <Select value={this.state.dia} style={{ width: 100, marginRight: 10 }} onChange={(value) => this.setState({ dia: value })}>
                                    <Option value='1'>1</Option>
                                    <Option value='2'>2</Option>
                                    <Option value='3'>3</Option>
                                    <Option value='4'>4</Option>
                                    <Option value='5'>5</Option>
                                    <Option value='6'>6</Option>
                                    <Option value='7'>7</Option>
                                    <Option value='8'>8</Option>
                                    <Option value='9'>9</Option>
                                    <Option value='10'>10</Option>
                                    <Option value='11'>11</Option>
                                    <Option value='12'>12</Option>
                                    <Option value='13'>13</Option>
                                    <Option value='14'>14</Option>
                                    <Option value='15'>15</Option>
                                    <Option value='16'>16</Option>
                                    <Option value='17'>17</Option>
                                    <Option value='18'>18</Option>
                                    <Option value='19'>19</Option>
                                    <Option value='20'>20</Option>
                                    <Option value='21'>21</Option>
                                    <Option value='22'>22</Option>
                                    <Option value='23'>23</Option>
                                    <Option value='24'>24</Option>
                                    <Option value='25'>25</Option>
                                    <Option value='26'>26</Option>
                                    <Option value='27'>27</Option>
                                    <Option value='28'>28</Option>
                                    <Option value='29'>29</Option>
                                    <Option value='30'>30</Option>
                                    <Option value='31'>31</Option>
                                </Select>

                                <Select value={this.state.mes} style={{ width: 150, marginRight: 10 }} onChange={(value) => this.setState({ mes: value })}>
                                    <Option value='1'>Janeiro</Option>
                                    <Option value='2'>Fevereiro</Option>
                                    <Option value='3'>Março</Option>
                                    <Option value='4'>Abril</Option>
                                    <Option value='5'>Maio</Option>
                                    <Option value='6'>Junho</Option>
                                    <Option value='7'>Julho</Option>
                                    <Option value='8'>Agosto</Option>
                                    <Option value='9'>Setembro</Option>
                                    <Option value='10'>Outubro</Option>
                                    <Option value='11'>Novembro</Option>
                                    <Option value='12'>Dezembro</Option>
                                </Select>

                                <Select value={this.state.ano} style={{ width: 100 }} onChange={(value) => this.setState({ ano: value })}>
                                    <Option value={Ano - 1}>{Ano - 1}</Option>
                                    <Option value={Ano}>{Ano}</Option>
                                    <Option value={Ano + 1}>{Ano + 1}</Option>
                                    <Option value={Ano + 2}>{Ano + 2}</Option>
                                    <Option value={Ano + 3}>{Ano + 3}</Option>
                                </Select>

                            </div>
                        </>
                    )}

                    {this.state.typeAdvandcedFind === 2 && (

                        <>

                            <Divider>Adicione o Mês e Ano</Divider>

                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                <Select value={this.state.mes} style={{ width: 150, marginRight: 10 }} onChange={(value) => this.setState({ mes: value })}>
                                    <Option value='Janeiro'>Janeiro</Option>
                                    <Option value='Fevereiro'>Fevereiro</Option>
                                    <Option value='Março'>Março</Option>
                                    <Option value='Abril'>Abril</Option>
                                    <Option value='Maio'>Maio</Option>
                                    <Option value='Junho'>Junho</Option>
                                    <Option value='Julho'>Julho</Option>
                                    <Option value='Agosto'>Agosto</Option>
                                    <Option value='Setembro'>Setembro</Option>
                                    <Option value='Outubro'>Outubro</Option>
                                    <Option value='Novembro'>Novembro</Option>
                                    <Option value='Dezembro'>Dezembro</Option>
                                </Select>

                                <Select value={this.state.ano} style={{ width: 100 }} onChange={(value) => this.setState({ ano: value })}>
                                    <Option value={Ano - 1}>{Ano - 1}</Option>
                                    <Option value={Ano}>{Ano}</Option>
                                    <Option value={Ano + 1}>{Ano + 1}</Option>
                                    <Option value={Ano + 2}>{Ano + 2}</Option>
                                    <Option value={Ano + 3}>{Ano + 3}</Option>
                                </Select>

                            </div>

                        </>

                    )}

                    {this.state.incFunc === true && (

                        <>

                            <Divider>Selecione o Funcionário</Divider>

                            <Select value={this.state.idFunc} style={{ width: '100%' }} onChange={(value) => this.setState({ idFunc: value })}>

                                {this.state.funcCaixa.map(funcionarios => (

                                    <Option value={funcionarios._id} key={funcionarios._id}>{funcionarios.name}</Option>

                                ))}

                            </Select>

                        </>

                    )}

                </Modal>

                <Drawer
                    title="Fluxo do Caixa"
                    width={'80%'}
                    closable={true}
                    onClose={() => this.setState({ modalCaixa: false })}
                    visible={this.state.modalCaixa}
                    placement='left'
                >
                    <Spin spinning={this.state.spinnerFlux} size='large'>
                        <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>VENDAS</Divider>
                        <Table columns={columnsVendas} dataSource={this.state.vendas} size='small' rowKey={(mov) => mov._id} />

                        <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>ORDENS DE SERVIÇO</Divider>
                        <Table columns={columnServicos} dataSource={this.state.servicos} size='small' rowKey={(mov) => mov._id} />
                    </Spin>

                </Drawer>

            </>
        )
    }
}