import React from 'react';
import { Tabs, Tooltip, Icon } from 'antd';

import BalancetePlanodeContas from './relatorioPlanodeContas';
import BalancetesGerados from './gerados';

const { TabPane } = Tabs;

export default function GerarBalancete() {

    return (
        <>

            <Tabs defaultActiveKey="1" tabPosition='left' type='card'>

                <TabPane tab={
                    <Tooltip placement='right' title='Gerar Balancete mensal'>
                        <span>
                            <Icon type="area-chart" />
                        </span>
                    </Tooltip>
                } key="1">

                    <BalancetePlanodeContas />

                </TabPane>

                <TabPane tab={
                    <Tooltip placement='right' title='Balancetes Gerados'>
                        <span>
                            <Icon type="check" />
                        </span>
                    </Tooltip>
                } key="2">

                    <BalancetesGerados />

                </TabPane>

            </Tabs>

        </>
    )

}