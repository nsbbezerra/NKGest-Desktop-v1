import React, { Component } from 'react';
import { Icon, Tabs, Button } from 'antd';
import { Header } from '../../../styles/styles';
import { Link } from 'react-router-dom';

import Individual from './individual';
import Selecionar from './selecionar';
import Todas from './todas';

const { TabPane } = Tabs;

export default class Etiquetas extends Component {
    render() {
        return (
            <>
                <Header>
                    <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='tags' style={{ fontSize: 20 }} /> ETIQUETAS DOS PRODUTOS</p>
                    <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
                </Header>

                <div style={{ marginTop: 10 }}>

                    <Tabs defaultActiveKey="1" type='card'>
                        <TabPane tab={
                            <span>
                                <Icon type="printer" />
                                Impressão Individual
                            </span>
                        } key="1">
                            <Individual />
                        </TabPane>
                        <TabPane tab={
                            <span>
                                <Icon type="printer" />
                                Impressão Selecionada
                            </span>
                        } key="2">
                            <Selecionar />
                        </TabPane>
                        <TabPane tab={
                            <span>
                                <Icon type="printer" />
                                Imprimir Todas
                            </span>
                        } key="3">
                            <Todas />
                        </TabPane>
                    </Tabs>

                </div>
            </>
        )
    }
}