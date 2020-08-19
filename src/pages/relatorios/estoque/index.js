import React, { Component } from 'react';
import { Icon, Tabs, Button } from 'antd';
import { Header } from '../../../styles/styles';
import { Link } from 'react-router-dom';

import TodosOsProdutos from './produtos';
import Servicos from './servicos';

const { TabPane } = Tabs;

export default class RelatoriosdoEstoque extends Component {
    render() {
        return (
            <>
                <Header>
                    <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='container' style={{ fontSize: 20 }} />  RELATÓRIO DE ESTOQUE</p>
                    <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
                </Header>

                <div style={{ marginTop: 15 }}>

                    <Tabs defaultActiveKey="1" type='card'>
                        <TabPane tab={
                            <span>
                                <Icon type="tags" />
                                Produtos
                            </span>
                        } key="1">
                            <TodosOsProdutos />
                        </TabPane>
                        <TabPane tab={
                            <span>
                                <Icon type="tool" />
                                Serviços
                            </span>
                        } key="2">
                            <Servicos />
                        </TabPane>
                    </Tabs>

                </div>
            </>
        )
    }
}