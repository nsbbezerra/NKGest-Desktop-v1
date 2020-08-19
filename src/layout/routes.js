import React from 'react';
import { Route } from 'react-router-dom';

import Home from '../pages/home/home';
import Clientes from '../pages/cadastro/clientes';
import Enderecos from '../pages/cadastro/enderecos';
import Veiculos from '../pages/cadastro/veiculos';
import Fornecedores from '../pages/cadastro/fornecedores';
import Produtos from '../pages/cadastro/produtos';
import Servicos from '../pages/cadastro/servicos';
import Funcionarios from '../pages/cadastro/funcionario';

import ControleEstoque from '../pages/estoque/index';
import AdicionarCompra from '../pages/estoque/compras/compras';
import ImportarXml from '../pages/estoque/compras/xmlImport';
import Etiquetas from '../pages/estoque/etiquetas/index.js';
import AlterarFornecedor from '../pages/estoque/alterarFornecedor/alterarFornecedor';

import BalcaoVendas from '../pages/vendas/balcao/balcao';
import Orcamentos from '../pages/vendas/orcamentos/orcamentos';
import OrdemDeServico from '../pages/vendas/ordemDeServico/ordemDeServico';
import OrdersWait from '../pages/vendas/orcamentos/ordersWait';

import ContasPagar from '../pages/financeiro/contasPagar/contasPagar';
import ContasReceber from '../pages/financeiro/contasReceber/contasReceber';
import Boletos from '../pages/financeiro/boletos/boletos';
import ContasBancarias from '../pages/financeiro/contasBancarias/contasBancarias';
import FormasDePagamento from '../pages/financeiro/formasDePagamento/formasDePagamento';
import PlanoDeContas from '../pages/financeiro/planoDeContas/planoDeContas';
import ControleCheques from '../pages/financeiro/cheques/cheques';

import RelatorioCadastros from '../pages/relatorios/cadastros/index';
import RelatorioFinanceiro from '../pages/relatorios/financeiro/index';
import RelatorioDeVendas from '../pages/relatorios/vendas/index';
import RelatorioDosProdutos from '../pages/relatorios/estoque/index';

import EmitNotaFiscal from '../pages/notaFiscal/index';

import GerenciarFuncionarios from '../pages/admin/funcionarios/index';
import VendasEmAnalise from '../pages/admin/vendasAnalise/vendasAnalise';
import GestaoClientes from '../pages/admin/gestaoClientes/index';
import GerenciaProdutos from '../pages/admin/estoque/index';
import GerenciaServicos from '../pages/admin/estoque/servicos';

import VendasEmAnaliseVendedor from '../pages/vendas/vendasAnalise/index';
import CaixaDiarioMovimento from '../pages/caixa/caixaMovimento';

import GerCaixa from '../pages/caixa/index';

import ConfigsSistema from '../pages/configuracao/sistema';
import DadosEmpresa from '../pages/configuracao/dadosEmpresa';

import GerenciarPagamentos from '../pages/financeiro/pagamentos/index';

import Comissoes from '../pages/financeiro/comissoes/index';

import GerenciarVendas from '../pages/admin/vendasGer/index';

import GerFornecedor from '../pages/admin/gerFornecedor/index';

import AtualizarImpostos from '../pages/estoque/compras/updateTaxes';

export default function Routes() {
    return (
        <>
            <Route exact path={'/'} component={Home} />
            <Route path={'/clients'} component={Clientes} />
            <Route path={'/locations'} component={Enderecos} />
            <Route path={'/veicles'} component={Veiculos} />
            <Route path={'/fornecers'} component={Fornecedores} />
            <Route path={'/products'} component={Produtos} />
            <Route path={'/services'} component={Servicos} />
            <Route path={'/func'} component={Funcionarios} />

            <Route path={'/controlStoque'} component={ControleEstoque} />
            <Route path={'/addBuy'} component={AdicionarCompra} />
            <Route path={'/xmlImport'} component={ImportarXml} />
            <Route path={'/tags'} component={Etiquetas} />
            <Route path={'/changeDespach'} component={AlterarFornecedor} />

            <Route path={'/balcao'} component={BalcaoVendas} />
            <Route path={'/orcamentos'} component={Orcamentos} />
            <Route path={'/ordemDeServico'} component={OrdemDeServico} />
            <Route path={'/vendasAnaliseVendedor'} component={VendasEmAnaliseVendedor} />
            <Route path={'/ordersWait'} component={OrdersWait} />

            <Route path={'/contasPagar'} component={ContasPagar} />
            <Route path={'/contasReceber'} component={ContasReceber} />
            <Route path={'/boletos'} component={Boletos} />
            <Route path={'/contasBancarias'} component={ContasBancarias} />
            <Route path={'/formaDePagamento'} component={FormasDePagamento} />
            <Route path={'/planoDeContas'} component={PlanoDeContas} />
            <Route path={'/cheques'} component={ControleCheques} />

            <Route path={'/relatoriosCadastro'} component={RelatorioCadastros} />
            <Route path={'/relatoriosFinanceiro'} component={RelatorioFinanceiro} />
            <Route path={'/relatorioVendas'} component={RelatorioDeVendas} />
            <Route path={'/relatoriosEstoque'} component={RelatorioDosProdutos} />

            <Route path={'/invoices'} component={EmitNotaFiscal} />

            <Route path={'/updatedTaxes'} component={AtualizarImpostos} />

            <Route path={'/gerenciarFuncionario'} component={GerenciarFuncionarios} />
            <Route path={'/vendasAnalise'} component={VendasEmAnalise} />
            <Route path={'/gestaoDeClientes'} component={GestaoClientes} />

            <Route path={'/caixa'} component={GerCaixa} />
            <Route path={'/movimentCaixa'} component={CaixaDiarioMovimento} />

            <Route path={'/configSistema'} component={ConfigsSistema} />
            <Route path={'/dadosEmpresa'} component={DadosEmpresa} />

            <Route path={'/gerenciarProdutos'} component={GerenciaProdutos} />
            <Route path={'/gerenciarServicos'} component={GerenciaServicos} />

            <Route path={'/gerPagamentos'} component={GerenciarPagamentos} />

            <Route path={'/comissionsFunc'} component={Comissoes} />

            <Route path={'/gerenciarVendas'} component={GerenciarVendas} />
            <Route path={'/gerenciarFornecedor'} component={GerFornecedor} />
        </>
    )
}