import React, { useState, useEffect } from 'react';
import { Row, Col, Input, TreeSelect, Divider, Button, Spin, Select, Icon, Modal } from 'antd';
import api from '../../../config/axios';
import PisCofinsCst from '../../../data/pisCst.json';
import { Header } from '../../../styles/styles';
import { Link } from 'react-router-dom';
import MargeLucro from '../../../data/margeLucro.json';

const { TreeNode } = TreeSelect;
const { Option } = Select;

function ComprasAtualizar() {

    const [spinner, setSpinner] = useState(false);
    const [loading, setLoading] = useState(false);

    const [produtos, setProdutos] = useState([]);
    const [produtoNome, setProdutoNome] = useState('');
    const [produtoID, setProdutoID] = useState('');
    const [custo, setCusto] = useState(0);
    const [despesas, setDespesas] = useState(0);
    const [margeLucro, setMargeLucro] = useState('');
    const [margeLucroData, setMargeLucroData] = useState(MargeLucro);
    const [margeLucroValue, setMargeLucroValue] = useState(0);
    const [venda, setVenda] = useState(0);
    const [codeUniv, setCodeUniv] = useState('');
    const [estoqueAtual, setEstoqueAtual] = useState(0);
    const [icms, setIcms] = useState(0);
    const [icmsCns, setIcmsCns] = useState('');
    const [pis, setPis] = useState(0);
    const [pisCns, setPisCns] = useState('');
    const [cofins, setCofins] = useState(0);
    const [cofinsCns, setCofinsCns] = useState('');
    const [cpof, setCpof] = useState('');
    const [ncm, setNcm] = useState('');
    const [cest, setCest] = useState('');
    const [uniMedida, setUniMedida] = useState('');
    const [qtdCompra, setQtdCompra] = useState(0);
    const [icmsOrigem, setIcmsOrigem] = useState('');
    const [pisOrigem, setPisOrigem] = useState('');
    const [cofinsOrigem, setCofinsOrigem] = useState('');
    const [listPisCofinsCst] = useState(PisCofinsCst);
    const [codeSku, setCodeSku] = useState('');

    function erro(title, message) {
        Modal.error({
            title: title,
            content: (
                <div>
                    <p>{message}</p>
                </div>
            ),
            onOk() { },
        });
    }

    function success(title, message) {
        Modal.success({
            title: title,
            content: (
                <div>
                    <p>{message}</p>
                </div>
            ),
            onOk() { },
        });
    }

    function warning(title, message) {
        Modal.warning({
            title: title,
            content: (
                <div>
                    <p>{message}</p>
                </div>
            ),
            onOk() { },
        });
    }

    async function findProducts() {
        setSpinner(true);
        await api.get('/stock/findProdutos').then(response => {
            setProdutos(response.data.produtos);
            setSpinner(false);
        }).catch(error => {
            erro('Erro', error.message);
            setSpinner(false);
        });
    }

    async function sendSales() {

        if (produtoID === '') {
            warning('Atenção', 'Não existe um produto selecionado');
            return false;
        }
        if (qtdCompra === 0) {
            warning('Atenção', 'O valor de atualização do estoque está definido como: 0');
            return false;
        }

        setLoading(true);

        await api.put(`/stock/sendSales/${produtoID}`, {
            code: codeSku, codeUniversal: codeUniv, valueCusto: custo + despesas, valueDiversos: despesas, valueSale: venda, estoqueAct: estoqueAtual + qtdCompra, cfop: cpof, ncm: ncm, cest: cest, icms: { rate: icms, csosn: icmsCns, origin: icmsOrigem }, pis: { rate: pis, cst: pisCns, origin: pisOrigem }, cofins: { rate: cofins, cst: cofinsCns, origin: cofinsOrigem }
        }).then(response => {
            success('Sucesso', response.data.message);
            setCodeUniv('');
            setCusto('');
            setDespesas('');
            setVenda('');
            setEstoqueAtual('');
            setProdutoNome('');
            setProdutoID('');
            setQtdCompra(0);
            setLoading(false);
            setCodeSku('');
            setIcmsCns(''); setPisCns(''); setCofinsCns(''); setIcmsOrigem(''); setPisOrigem(''); setCofinsOrigem('');
            findProducts();
        }).catch(error => {
            erro('Erro', error.message);
            setLoading(false);
        });

    }

    async function calculatePriceForSale() {
        let totalPrice = custo + despesas;
        let calcIcms = await (icms / 100) * totalPrice;
        let calcPis = await (pis / 100) * totalPrice;
        let calcCofins = await (cofins / 100) * totalPrice;
        let finalPrice = await totalPrice + calcIcms + calcPis + calcCofins;
        let calcFinal = await finalPrice * margeLucroValue
        await setVenda(calcFinal);
    }

    useEffect(() => {
        findProducts();
    }, []);

    async function handleProduto(value) {

        const result = await produtos.find(obj => obj.codiname === value);
        const cust = await result.valueCusto - result.valueDiversos;
        await setUniMedida(result.unMedida);
        await setIcms(result.icms.rate);
        await setIcmsCns(result.icms.csosn);
        await setPis(result.pis.rate);
        await setPisCns(result.pis.cst);
        await setCofins(result.cofins.rate);
        await setCofinsCns(result.cofins.cst);
        await setCpof(result.cfop);
        await setCest(result.cest);
        await setNcm(result.ncm);
        await setProdutoNome(result.codiname);
        await setProdutoID(result._id);
        await setCodeUniv(result.codeUniversal);
        await setCusto(cust);
        await setDespesas(result.valueDiversos);
        await setVenda(result.valueSale);
        await setEstoqueAtual(result.estoqueAct);
        await setIcmsOrigem(result.icms.origin);
        await setPisOrigem(result.pis.origin);
        await setCofinsOrigem(result.cofins.origin);
        await setCodeSku(result.code);
        if (result.margeLucro) {
            const resultMarge = await margeLucroData.marge.find(obj => obj.value === result.margeLucro);
            await setMargeLucro(resultMarge.text);
            await setMargeLucroValue(resultMarge.value);
        }

    }

    async function handleMarge(marge) {
        const result = await margeLucroData.marge.find(obj => obj.text === marge);
        await setMargeLucro(result.text);
        await setMargeLucroValue(result.value);
    }

    return (
        <>

            <Header>
                <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='plus' style={{ fontSize: 20 }} /> ADICIONAR COMPRA</p>
                <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
            </Header>

            <div style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 30, paddingRight: 30, width: '100%' }}>

                <Spin spinning={spinner} size='large'>

                    <Row gutter={10}>

                        <Col span={10}>

                            <label>Selecione o produto<span style={{ color: 'red' }}>*</span></label>
                            <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                value={produtoNome}
                                treeDefaultExpandAll
                                onChange={(value) => handleProduto(value)}
                            >

                                {produtos.map(products => (

                                    <TreeNode value={products.codiname} title={products.codiname} key={products._id} />

                                ))}

                            </TreeSelect>

                        </Col>

                        <Col span={5}>

                            <label>Código</label>
                            <Input type='text' readOnly value={codeSku} />

                        </Col>

                        <Col span={6}>

                            <label>Código de Barras</label>
                            <Input type='text' onChange={(e) => setCodeUniv(e.target.value)} value={codeUniv} />

                        </Col>

                        <Col span={3}>
                            <label>Uni. de medida<span style={{ color: 'red' }}>*</span></label>
                            <Select value={uniMedida} style={{ width: '100%' }} onChange={(value) => setUniMedida(value)}>
                                <Option value='KG'>Quilograma</Option>
                                <Option value='GR'>Grama</Option>
                                <Option value='UN'>Unidade</Option>
                                <Option value='MT'>Metro</Option>
                                <Option value='PC'>Peça</Option>
                                <Option value='CX'>Caixa</Option>
                                <Option value='DZ'>Duzia</Option>
                                <Option value='EM'>Embalagem</Option>
                                <Option value='FD'>Fardo</Option>
                                <Option value='KT'>KIT</Option>
                                <Option value='JG'>Jogo</Option>
                                <Option value='PT'>Pacote</Option>
                                <Option value='LATA'>Lata</Option>
                                <Option value='LT'>Litro</Option>
                                <Option value='SC'>Saco</Option>
                                <Option value='ROLO'>Rolo</Option>
                                <Option value='VD'>Vidro</Option>
                                <Option value='CE'>Centro</Option>
                                <Option value='CJ'>Conjunto</Option>
                                <Option value='CM'>Centímetro</Option>
                                <Option value='GF'>Garrafa</Option>
                            </Select>
                        </Col>

                    </Row>

                    <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>TRIBUTAÇÃO</Divider>

                    <Row gutter={10}>

                        <Col span={8}>

                            <label>ICMS<span style={{ color: 'red' }}>*</span></label>
                            <Input type='number' addonAfter='%' value={icms} onChange={(e) => setIcms(parseFloat(e.target.value))} style={{ marginBottom: 5 }} />

                            <label>ICMS: CST<span style={{ color: 'red' }}>*</span></label>
                            <Select value={icmsCns} style={{ width: '100%', marginBottom: 10 }} onChange={(value) => setIcmsCns(value)}>
                                <Option value={"101"}>101 - Tributada pelo Simples Nacional com permissão de crédito</Option>
                                <Option value={"102"}>102 - Tributada pelo Simples Nacional sem permissão de crédito</Option>
                                <Option value={"103"}>103 - Isenção do ICMS no Simples Nacional para faixa de receita bruta</Option>
                                <Option value={"201"}>201 - Tributada pelo Simples Nacional com permissão de crédito e com cobrança do ICMS por substituição tributária</Option>
                                <Option value={"202"}>202 - Tributada pelo Simples Nacional sem permissão de crédito e com cobrança do ICMS por substituição tributária</Option>
                                <Option value={"203"}>203 - Isenção do ICMS no Simples Nacional para faixa de receita bruta e com cobrança do ICMS por substituição tributária</Option>
                                <Option value={"300"}>300 - Imune</Option>
                                <Option value={"400"}>400 - Não tributada pelo Simples Nacional</Option>
                                <Option value={"500"}>500 - ICMS cobrado anteriormente por substituição tributária (substituído) ou por antecipação</Option>
                                <Option value={"900"}>900 - Outros</Option>
                            </Select>

                            <label>ICMS Origem<span style={{ color: 'red' }}>*</span></label>
                            <Input value={icmsOrigem} onChange={(e) => setIcmsOrigem(e.target.value)} />

                        </Col>

                        <Col span={8}>

                            <label>PIS<span style={{ color: 'red' }}>*</span></label>
                            <Input type='number' addonAfter='%' value={pis} onChange={(e) => setPis(parseFloat(e.target.value))} style={{ marginBottom: 5 }} />

                            <label>PIS: CST<span style={{ color: 'red' }}>*</span></label>
                            <Select value={pisCns} style={{ width: '100%', marginBottom: 10 }} onChange={(value) => setPisCns(value)}>
                                {listPisCofinsCst.map(list => (
                                    <Option value={list.code} key={list.code}>{list.desc}</Option>
                                ))}
                            </Select>

                            <label>PIS Origem<span style={{ color: 'red' }}>*</span></label>
                            <Input value={pisOrigem} onChange={(e) => setPisOrigem(e.target.value)} />

                        </Col>

                        <Col span={8}>

                            <label>COFINS<span style={{ color: 'red' }}>*</span></label>
                            <Input type='number' addonAfter='%' value={cofins} onChange={(e) => setCofins(parseFloat(e.target.value))} style={{ marginBottom: 5 }} />

                            <label>COFINS: CST<span style={{ color: 'red' }}>*</span></label>
                            <Select value={cofinsCns} style={{ width: '100%', marginBottom: 10 }} onChange={(value) => setCofinsCns(value)}>
                                {listPisCofinsCst.map(list => (
                                    <Option value={list.code} key={list.code}>{list.desc}</Option>
                                ))}
                            </Select>

                            <label>COFINS Origem<span style={{ color: 'red' }}>*</span></label>
                            <Input value={cofinsOrigem} onChange={(e) => setCofinsOrigem(e.target.value)} />

                        </Col>

                    </Row>

                    <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>VALORES</Divider>

                    <Row gutter={10}>

                        <Col span={8}>

                            <label>Valor de custo<span style={{ color: 'red' }}>*</span></label>
                            <Input
                                type='number'
                                addonAfter='R$'
                                value={custo}
                                onChange={(e) => setCusto(parseFloat(e.target.value))}
                            />

                        </Col>

                        <Col span={8}>

                            <label>Despesas diversas</label>
                            <Input
                                type='number'
                                addonAfter='R$'
                                value={despesas}
                                onChange={(e) => setDespesas(parseFloat(e.target.value))}
                            />

                        </Col>

                        <Col span={8}>

                            <label>Valor de venda<span style={{ color: 'red' }}>*</span></label>
                            <Input
                                type='number'
                                addonAfter='R$'
                                value={venda}
                                onChange={(e) => setVenda(parseFloat(e.target.value))}
                            />

                        </Col>

                    </Row>

                    <Row gutter={10}>
                        <Col span={12}>
                            <label>Selecione a Margem de Lucro</label>
                            <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                                value={margeLucro}
                                treeDefaultExpandAll
                                onChange={(value) => handleMarge(value)}
                            >
                                {margeLucroData.marge.map(mar => (
                                    <TreeNode value={mar.text} title={mar.text} key={mar.value} />
                                ))}
                            </TreeSelect>
                        </Col>
                        <Col span={12}>
                            <label style={{ color: 'white' }}>Preço</label>
                            <Button icon='calculator' type='primary' style={{ width: '100%' }} onClick={() => calculatePriceForSale()}>CALCULAR PREÇO</Button>
                        </Col>
                    </Row>

                    <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>OUTROS</Divider>

                    <Row gutter={10}>

                        <Col span={8}>

                            <label>CFOP<span style={{ color: 'red' }}>*</span></label>
                            <Input type='number' onChange={(e) => setCpof(e.target.value)} value={cpof} />

                        </Col>

                        <Col span={8}>

                            <label>NCM<span style={{ color: 'red' }}>*</span></label>
                            <Input type='number' value={ncm} onChange={(e) => setNcm(e.target.value)} />

                        </Col>

                        <Col span={8}>

                            <label>CEST<span style={{ color: 'red' }}>*</span></label>
                            <Input onChange={(e) => setCest(e.target.value)} value={cest} />

                        </Col>

                    </Row>

                    <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>ESTOQUE</Divider>

                    <Row gutter={10}>

                        <Col span={12}>

                            <label>Quantidade Atual<span style={{ color: 'red' }}>*</span></label>
                            <Input type='number' readOnly value={estoqueAtual} />

                        </Col>

                        <Col span={12}>

                            <label>Quantidade da Compra<span style={{ color: 'red' }}>*</span></label>
                            <Input type='number' onChange={(e) => setQtdCompra(parseInt(e.target.value))} value={qtdCompra} />

                        </Col>

                    </Row>

                </Spin>

                <Divider />

                <Button type="primary" icon="save" size='large' loading={loading} onClick={() => sendSales()}>
                    Salvar compra
                </Button>

            </div>

        </>
    )

}

export default ComprasAtualizar;