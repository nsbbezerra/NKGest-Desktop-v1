import React, { Component } from 'react';
import { Tabs, Icon, Button } from 'antd';
import { Link } from 'react-router-dom';
import { Header } from '../../styles/styles';
import Open from './aberto';
import Closed from './fechado';

const { TabPane } = Tabs;

export default class GerenciarCaixa extends Component {
    render() {
        return (
            <>

                <Header>
                    <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='calculator' style={{ fontSize: 20 }} /> CAIXA DIÁRIO</p>
                    <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
                </Header>

                <Tabs defaultActiveKey="1" tabPosition='left' type='card' style={{marginTop: 15}}>

                    <TabPane tab="Caixa Aberto" key="1">

                        <Open />

                    </TabPane>

                    <TabPane tab="Caixa Fechado" key="2">

                        <Closed />

                    </TabPane>

                </Tabs>

            </>
        )
    }
}