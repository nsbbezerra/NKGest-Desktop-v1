import React, { Component } from 'react';
import { Icon, Button, Tabs } from 'antd';
import { Header } from '../../../styles/styles';
import { Link } from 'react-router-dom';

import Vendas from './vendasAnalise';
import Ordens from './ordens';

const { TabPane } = Tabs;

export default class Analise extends Component {
    render() {
        return (
            <>

                <Header>
                    <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='file-search' style={{ fontSize: 20 }} /> VENDAS EM ANALISE</p>
                    <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
                </Header>

                <div style={{ marginTop: 15 }}>

                    <Tabs defaultActiveKey="1" type='card'>

                        <TabPane tab={
                            <span>
                                <Icon type="shopping" />
                                Vendas
                            </span>
                        } key="1">

                            <Vendas />

                        </TabPane>

                        <TabPane tab={
                            <span>
                                <Icon type="file-sync" />
                                Ordens de Serviço
                            </span>
                        } key="2">

                            <Ordens />

                        </TabPane>

                    </Tabs>

                </div>

            </>
        )
    }
}