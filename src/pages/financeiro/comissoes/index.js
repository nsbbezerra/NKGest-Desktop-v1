import React, { useState, useEffect } from 'react';
import { Icon, Button, Table, Modal, Spin, Statistic, Descriptions, Select, Divider, TreeSelect, Card, Row } from 'antd';
import { Header } from '../../../styles/styles';
import { Link } from 'react-router-dom';
import api from '../../../config/axios';

const { Option } = Select;
const { TreeNode } = TreeSelect;

function Comissoes() {

    const [spinner, setSpinner] = useState(false);
    const [modalSearch, setModalSearch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [vendedor, setVendedor] = useState([]);
    const [find, setFind] = useState(null);
    const [vendedorId, setVendedorId] = useState(null);
    const [vendedorName, setVendedorName] = useState(null);
    const [mes, setMes] = useState(null);
    const [ano, setAno] = useState(null);

    const [comissionSale, setComissionSale] = useState([]);
    const [totalComission, setTotalComission] = useState(0);

    const [showTables, setShowTables] = useState(false);

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

    async function findVendedor() {
        setSpinner(true)
        await api.get('/admin/findFuncionariosComissioned').then(response => {
            setVendedor(response.data.funcionarios)
            setSpinner(false);
        }).catch(error => {
            erro('Erro', error.message);
            setSpinner(false);
        });
    }

    async function findComissions() {
        if (vendedorId === null) {
            warning('Atenção', 'Selecione um Vendedor');
            return false;
        }
        if (find === null) {
            warning('Atenção', 'Selecione um tipo de busca');
            return false;
        }
        if (find === 2) {
            if (mes === null) {
                warning('Atenção', 'Selecione um mês');
                return false;
            }
            if (ano === null) {
                warning('Atenção', 'Selecione um ano');
                return false;
            }
        }
        setLoading(true);
        await api.post('/comissions/findComissions', {
            find: find, vendedor: vendedorId, mes: mes, ano: ano
        }).then(response => {
            setComissionSale(response.data.comissionSale);
            setTotalComission(response.data.calcTotalSales);
            setLoading(false);
            setModalSearch(false);
            setShowTables(true);
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoading(false);
        });
    }

    useEffect(() => {

        findVendedor();

    }, []);

    async function handleVendedor(value) {
        const result = await vendedor.find(obj => obj.name === value);
        await setVendedorId(result._id);
        await setVendedorName(result.name);
    }

    const columnSale = [
        {
            title: 'Vendedor',
            dataIndex: 'funcionario.name',
            key: 'funcionario.name',
            width: '70%'
        },
        {
            title: 'Valor (R$)',
            dataIndex: 'value',
            key: 'value',
            render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15.5 }} prefix='R$' precision={2} />,
            align: 'right'
        },
    ];

    const DataAtual = new Date();
    const Ano = DataAtual.getFullYear();

    return (

        <div style={{ height: '100%' }}>
            <Header>
                <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='percentage' style={{ fontSize: 20 }} /> GERENCIAR COMISSÕES</p>
                <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
            </Header>

            <Spin spinning={spinner} size='large'>

                <div style={{ marginBottom: 10, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>

                    <Card size='small'>

                        {find === null && (
                            <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>-</strong></p>
                        )}
                        {find === 1 && (
                            <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>{`Comissão do vendedor(a) ${vendedorName}, referente ao Mês Atual`}</strong></p>
                        )}
                        {find === 2 && (
                            <p style={{ marginBottom: -3, marginTop: -1 }}>Tipo dos dados: <strong>{`Comissão do vendedor(a) ${vendedorName}, referente ao mês de ${mes} do ano de ${ano}`}</strong></p>
                        )}

                    </Card>

                    <div style={{ display: 'flex', flexDirection: 'row' }}>

                        <Button icon='search' type='primary' onClick={() => setModalSearch(true)}>Busca Avançada</Button>

                    </div>

                </div>

                {showTables === true && (
                    <div style={{ marginTop: 10 }}>

                        <Card size='small' style={{ backgroundColor: '#001529', marginBottom: 10 }} bordered={false}>
                            <Row>
                                <Icon type='tag' style={{ fontSize: 20, color: '#fff', marginRight: 15 }} />
                                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>VENDA DE PRODUTOS</span>
                            </Row>
                        </Card>

                        <Table pagination={{ pageSize: 10 }} columns={columnSale} dataSource={comissionSale} size='small' rowKey={(account) => account._id} />

                        <Card size='small' style={{ backgroundColor: '#001529', marginBottom: 10 }} bordered={false}>
                            <Row>
                                <Icon type='line-chart' style={{ fontSize: 20, color: '#fff', marginRight: 15 }} />
                                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>RESUMO</span>
                            </Row>
                        </Card>

                        <Descriptions bordered size='small'>
                            <Descriptions.Item span={3} label='TOTAL DAS COMISSÕES'><Statistic value={totalComission} precision={2} prefix='R$' valueStyle={{ fontSize: 15.5 }} /></Descriptions.Item>
                        </Descriptions>

                    </div>
                )}

            </Spin>

            <Modal
                visible={modalSearch}
                onCancel={() => setModalSearch(false)}
                title="Buscar Relatório"
                footer={[
                    <Button key="back" icon='close' type='danger' onClick={() => setModalSearch(false)}>
                        Cancelar
                        </Button>,
                    <Button key="submit" icon='search' type="primary" loading={loading} onClick={() => { findComissions() }}>
                        Buscar
                    </Button>,
                ]}
            >

                <label>Selecione um tipo de busca:</label>
                <Select value={find} style={{ width: '100%' }} onChange={(value) => setFind(value)}>
                    <Option value={1}>Comissões do Mês Atual</Option>
                    <Option value={2}>Comissões por Período</Option>
                </Select>

                <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>SELECIONE O VENDEDOR</Divider>
                <TreeSelect
                    showSearch
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    value={vendedorName}
                    treeDefaultExpandAll
                    onChange={(value) => handleVendedor(value)}
                >

                    {vendedor.map(vend => (

                        <TreeNode value={vend.name} title={vend.name} key={vend._id} />

                    ))}

                </TreeSelect>


                {find === 2 && (
                    <>
                        <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>SELECIONE O MÊS</Divider>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                            <Select value={mes} style={{ width: 150, marginRight: 10 }} onChange={(e) => setMes(e)} placeholder='Mês'>
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

                            <Select value={ano} style={{ width: 100 }} onChange={(e) => setAno(e)} placeholder='Ano'>
                                <Option value={Ano - 1}>{Ano - 1}</Option>
                                <Option value={Ano}>{Ano}</Option>
                                <Option value={Ano + 1}>{Ano + 1}</Option>
                                <Option value={Ano + 2}>{Ano + 2}</Option>
                                <Option value={Ano + 3}>{Ano + 3}</Option>
                            </Select>

                        </div>
                    </>
                )}

            </Modal>

        </div>
    )
}

export default Comissoes;