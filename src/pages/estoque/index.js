import React, { Component } from 'react';
import { Icon, Tabs, Button } from 'antd';
import { Header } from '../../styles/styles';
import { Link } from 'react-router-dom';

import Estoques from './controle/estoque';
import EstoqueBaixo from './controle/baixoEstoque';

const { TabPane } = Tabs;

export default class Estoque extends Component {
    render() {
        return (
            <>
                <Header>
                    <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='container' style={{ fontSize: 20 }} /> AJUSTAR ESTOQUE</p>
                    <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
                </Header>

                <div style={{ marginTop: 15 }}>

                    <Tabs defaultActiveKey="1" type='card'>
                        <TabPane tab={
                            <span>
                                <Icon type="switcher" />
                                Ajustar Estoque
                            </span>
                        } key="1">
                            <Estoques />
                        </TabPane>
                        <TabPane tab={
                            <span>
                                <Icon type="exception" />
                                Estoque Baixo
                            </span>
                        } key="3">
                            <EstoqueBaixo />
                        </TabPane>
                    </Tabs>

                </div>
            </>
        )
    }
}