import React from 'react';
import { Tabs, Button, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { Header } from '../../../styles/styles';

import ProdutosAll from './produtos';
import ProdutosXml from './produtosImporterXml';

const { TabPane } = Tabs;

export default function indexAdminProducts() {
    return (
        <>

            <Header>
                <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='tags' style={{ fontSize: 20 }} /> GERENCIAR PRODUTOS</p>
                <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
            </Header>

            <div style={{ marginTop: 15 }}>

                <Tabs defaultActiveKey="1" type='card'>

                    <TabPane tab={
                        <span>
                            Todos os Produtos
                        </span>
                    } key="1">

                        <ProdutosAll />

                    </TabPane>

                    <TabPane tab={
                        <span>
                            Produtos Aguardando Alteração
                        </span>
                    } key="2">

                        <ProdutosXml />

                    </TabPane>

                </Tabs>

            </div>

        </>
    )
}