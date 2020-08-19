import React, { Component } from 'react';
import { Icon, Button, Tabs } from 'antd';
import { Header } from '../../../styles/styles';
import { Link } from 'react-router-dom';

import Clientes from './clientes';
import Fornecedores from './fornecedores';
import Funcionarios from './funcionarios';

const { TabPane } = Tabs;

export default class RelatorioCadastro extends Component {
    render() {
        return (
            <>

                <Header>
                    <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='solution' style={{ fontSize: 20 }} /> RELATÓRIOS DE CADASTRO</p>
                    <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
                </Header>

                <div style={{ marginTop: 10 }}>

                    <Tabs defaultActiveKey="1" type='card'>

                        <TabPane tab={
                            <span>
                                Clientes
                            </span>
                        } key="1">

                            <Clientes />

                        </TabPane>

                        <TabPane tab={
                            <span>
                                Fornecedores
                            </span>
                        } key="2">

                            <Fornecedores />

                        </TabPane>

                        <TabPane tab={
                            <span>
                                Funcionários
                            </span>
                        } key="3">

                            <Funcionarios />

                        </TabPane>

                    </Tabs>

                </div>

            </>
        )
    }
}