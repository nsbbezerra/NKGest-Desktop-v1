import React from 'react';
import { Icon, Tooltip, Tabs } from 'antd';

import Vendas from './vendas';
import Servicos from './servicos';

const { TabPane } = Tabs;

export default function IndexDepósitos() {
    return (
        <>

            <Tabs defaultActiveKey="1" type='card' tabPosition='left'>

                <TabPane tab={
                    <Tooltip placement='right' title='Pagamentos de Vendas'>
                        <span>
                            <Icon type="shopping" />
                        </span>
                    </Tooltip>
                } key="1">

                    <Vendas />

                </TabPane>

                <TabPane tab={
                    <Tooltip placement='right' title='Pagamentos de Ordens de Serviços'>
                        <span>
                            <Icon type="file-sync" />
                        </span>
                    </Tooltip>
                } key="2">

                    <Servicos />

                </TabPane>


            </Tabs>

        </>
    )
}