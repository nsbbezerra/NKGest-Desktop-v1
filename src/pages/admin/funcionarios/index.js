import React, { Component } from 'react';
import { Icon, Button, Tabs } from 'antd';
import { Header } from '../../../styles/styles';
import { Link } from 'react-router-dom';

import PermissoesTab from './permissoes';
import AtivacoesTab from './ativacoes';
import ComissioesTab from './comissoes';

const { TabPane } = Tabs;

export default class AdminFuncionarios extends Component {
    render() {
        return (
            <>

                <Header>
                    <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='user' style={{ fontSize: 20 }} /> GERENCIAR FUNCIONÁRIOS</p>
                    <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
                </Header>

                <div style={{ marginTop: 15 }}>

                    <Tabs defaultActiveKey="1" type='card'>

                        <TabPane tab="Permissões" key="1">

                            <PermissoesTab />

                        </TabPane>

                        <TabPane tab="Comissões" key="2">

                            <ComissioesTab />

                        </TabPane>

                        <TabPane tab="Gestão de Dados" key="3">

                            <AtivacoesTab />

                        </TabPane>

                    </Tabs>

                </div>

            </>
        )
    }
}