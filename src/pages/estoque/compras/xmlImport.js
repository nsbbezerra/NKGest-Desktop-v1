import React, { useState } from 'react';
import { Icon, Button, Tooltip, Divider, Table, Statistic, Row, Col, Input, Modal } from 'antd';
import './style.css';
import api from '../../../config/axios';
import { Header } from '../../../styles/styles';
import { Link } from 'react-router-dom';
import InputMask from 'react-input-mask';
import moment from 'moment';

function XmlImporter() {

    const [loadindImport, setLoadingImport] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);

    const [xmlFile, setXmlFile] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [fornecedorName, setFornecedorName] = useState('');
    const [fornecedorCNPJ, setFornecedorCNPJ] = useState('');
    const [fornecedorFone, setFornecedorFone] = useState('');
    const [fornecedorCity, setFornecedorCity] = useState('');
    const [fornecedorState, setFornecedorState] = useState('');
    const [fornecedorCEP, setFornecedorCEP] = useState('');
    const [fornecedorFantasia, setFornecedorFantasia] = useState('');
    const [fornecedorId, setFornecedorId] = useState('');
    const [chaveNfe, setChaveNfe] = useState('');
    const [protocolo, setProtocolo] = useState('');
    const [naturezaOpe, setNaturezaOpe] = useState('');
    const [numeroNota, setNumeroNota] = useState('');
    const [serie, setSerie] = useState('');
    const [operacao, setOperacao] = useState('');
    const [dataEmissao, setDataEmissao] = useState('');
    const [baseCalculoIcms, setBaseCalculoIcms] = useState('');
    const [totalIcms, setTotalIcms] = useState('');
    const [toalIcmsDesonerado, setToalIcmsDesonerado] = useState('');
    const [baseCalculoIcmsSt, setBaseCalculoIcmsSt] = useState('');
    const [baseCalculoIcmsRetido, setBaseCalculoIcmsRetido] = useState('');
    const [totalIcmsSt, setTotalIcmsSt] = useState('');
    const [totalIcmsStRetido, setTotalIcmsStRetido] = useState('');
    const [totalProdutos, setTotalProdutos] = useState('');
    const [totalFrete, setTotalFrete] = useState('');
    const [valorDesconto, setValorDesconto] = useState('');
    const [valorSeguro, setValorSeguro] = useState('');
    const [valorPis, setValorPis] = useState('');
    const [valorCofins, setValorCofins] = useState('');
    const [valorOutrasDespesas, setValorOutrasDespesas] = useState('');
    const [valorNota, setValorNota] = useState('');
    const [totalTributos, setTotalTributos] = useState('');

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

    async function saveProducts() {
        setLoadingSave(true);
        api.post('/xmlImport/saveProducts', {
            chaveNfe: chaveNfe, products: produtos, fornecedor: fornecedorId
        }).then(response => {
            setLoadingSave(false);
            success('Sucesso', response.data.message);
        }).catch(error => {
            setLoadingSave(false);
            erro('Erro', error.response.data.message);
        })
    }

    function delXmlFile() {
        setXmlFile(null);
    }

    async function sendXmlFile() {
        if (xmlFile === null) {
            warning('Atenção', 'Por favor selecione um arquivo para envio');
            return false;
        }
        const data = new FormData();
        data.append('xml', xmlFile);
        setLoadingImport(true);
        await api.post('/xmlImport/importXml', data).then(response => {
            success('Sucesso', 'Dados carregados com sucesso');
            setFornecedorId(response.data.fornecer._id);
            setFornecedorName(response.data.fornecer.socialName);
            setFornecedorCNPJ(response.data.fornecer.cpf_cnpj);
            setFornecedorFone(response.data.fornecer.phoneComercial);
            setFornecedorCEP(response.data.fornecer.cep);
            setFornecedorCity(response.data.fornecer.city);
            setFornecedorState(response.data.fornecer.state);
            setFornecedorFantasia(response.data.fornecer.name);
            setChaveNfe(response.data.infoProtocolo.chaveNfe);
            setProtocolo(response.data.infoProtocolo.protocolo);
            setNaturezaOpe(response.data.infoProtocolo.naturezaOperacao);
            setNumeroNota(response.data.infoProtocolo.numeroNota);
            setSerie(response.data.infoProtocolo.serieNota);
            setOperacao(response.data.infoProtocolo.operacao);
            setDataEmissao(response.data.infoProtocolo.dataEmissao);
            setBaseCalculoIcms(response.data.infoProtocolo.baseCalculoIcms);
            setTotalIcms(response.data.infoProtocolo.totalIcms);
            setToalIcmsDesonerado(response.data.infoProtocolo.toalIcmsDesonerado);
            setBaseCalculoIcmsSt(response.data.infoProtocolo.baseCalculoIcmsSt);
            setBaseCalculoIcmsRetido(response.data.infoProtocolo.baseCalculoIcmsRetido);
            setTotalIcmsSt(response.data.infoProtocolo.totalIcmsSt);
            setTotalIcmsStRetido(response.data.infoProtocolo.totalIcmsStRetido);
            setTotalProdutos(response.data.infoProtocolo.totalProdutos);
            setTotalFrete(response.data.infoProtocolo.totalFrete);
            setValorDesconto(response.data.infoProtocolo.valorDesconto);
            setValorSeguro(response.data.infoProtocolo.valorSeguro);
            setValorPis(response.data.infoProtocolo.valorPis);
            setValorCofins(response.data.infoProtocolo.valorCofins);
            setValorOutrasDespesas(response.data.infoProtocolo.valorOutrasDespesas);
            setValorNota(response.data.infoProtocolo.valorNota);
            setTotalTributos(response.data.infoProtocolo.totalTributos);
            setProdutos(response.data.produtos);
            setLoadingImport(false);
        }).catch(error => {
            erro('Erro', error.response.data.message);
            setLoadingImport(false);
        });
    }

    const columnsProduct = [
        {
            title: 'Produto',
            dataIndex: 'nome',
            key: 'nome',
            width: '25%'
        },
        {
            title: 'Qtd',
            dataIndex: 'quantidadeComercial',
            key: 'quantidadeComercial',
            render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15 }} precision={0} />,
            width: '6%',
            align: 'center'
        },
        {
            title: 'Unid.',
            dataIndex: 'unidadeComercial',
            key: 'unidadeComercial',
            align: 'center',
            width: '5%'
        },
        {
            title: 'CEST',
            dataIndex: 'cest',
            key: 'cest',
            align: 'center',
            width: '6%'
        },
        {
            title: 'CFOP',
            dataIndex: 'cfop',
            key: 'cfop',
            align: 'center',
            width: '6%'
        },
        {
            title: 'NCM',
            dataIndex: 'ncm',
            key: 'ncm',
            align: 'center',
            width: '7%'
        },
        {
            title: 'Cód. Barras',
            dataIndex: 'codeBarras',
            key: 'codeBarras',
            align: 'center',
            width: '8%'
        },
        {
            title: 'V. Unitário',
            dataIndex: 'valorUnitarioComercial',
            key: 'valorUnitarioComercial',
            render: (value) => <>
                {value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} />}
            </>,
            width: '8%',
            align: 'right'
        },
        {
            title: 'Outros Val.',
            dataIndex: 'outrasDespesas',
            key: 'valueTotal',
            render: (value) => <>
                {value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} />}
            </>,
            width: '8%',
            align: 'right'
        },
        {
            title: 'Frete',
            dataIndex: 'valorDoFrete',
            key: 'valorDoFrete',
            render: (value) => <>
                {value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} />}
            </>,
            align: 'right',
            width: '8%',
        },
        {
            title: 'V. Total',
            dataIndex: 'valorTotal',
            key: 'valorTotal',
            render: (value) => <>
                {value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} />}
            </>,
            width: '8%',
            align: 'right'
        },
        {
            title: 'V. de Venda',
            dataIndex: 'valorVenda',
            key: 'valorVenda',
            render: (value) => <>
                {value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} />}
            </>,
            width: '8%',
            align: 'right'
        },
        {
            title: 'ICMS CST',
            dataIndex: 'icms.icmsCst',
            key: 'icms.icmsCst',
            align: 'center',
            width: '5%'
        },
        {
            title: 'ICMS CSOSN',
            dataIndex: 'icms.icmsCsosn',
            key: 'icms.icmsCsosn',
            align: 'center',
            width: '6%'
        },
        {
            title: 'ICMS ORI.',
            dataIndex: 'icms.icmsOrigem',
            key: 'icms.icmsOrigem',
            align: 'center',
            width: '5%'
        },
        {
            title: 'ICMS B.C.',
            dataIndex: 'icms.icmsBaseCalculo',
            key: 'icms.icmsBaseCalculo',
            align: 'center',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} />}</>,
            width: '6%'
        },
        {
            title: 'V. ICMS',
            dataIndex: 'icms.icmsValor',
            key: 'icms.icmsValor',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} />}</>,
            width: '6%',
            align: 'right'
        },
        {
            title: 'ICMS %',
            dataIndex: 'icms.icmsPorcentagem',
            key: 'icms.icmsPorcentagem',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} suffix='%' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} suffix='%' precision={2} />}</>,
            width: '6%',
            align: 'right'
        },
        {
            title: 'ICMS ST %',
            dataIndex: 'icms.icmsAliquotaSt',
            key: 'icms.icmsAliquotaSt',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} suffix='%' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} suffix='%' precision={2} />}</>,
            width: '6%',
            align: 'right'
        },
        {
            title: 'ICMS ST B.C.',
            dataIndex: 'icms.icmsBaseCalculoSt',
            key: 'icms.icmsBaseCalculoSt',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} />}</>,
            width: '6%',
            align: 'right'
        },
        {
            title: 'V. ICMS ST',
            dataIndex: 'icms.valorIcmsSt',
            key: 'icms.valorIcmsSt',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} />}</>
            ,
            width: '6%',
            align: 'right'
        },
        {
            title: '% Marg. Ad. ST',
            dataIndex: 'icms.icmsMargemValorAdicionadoSt',
            key: 'icms.icmsMargemValorAdicionadoSt',
            render: (value) => <>{value ? <Statistic value={value} suffix='%' valueStyle={{ fontSize: 15 }} precision={2} /> : <Statistic value={0} suffix='%' valueStyle={{ fontSize: 15 }} precision={2} />}</>
            ,
            width: '6%',
            align: 'right'
        },
        {
            title: 'ICMS Mod. B.C ST',
            dataIndex: 'icms.icmsModalidadeBaseCalculoSt',
            key: 'icms.icmsModalidadeBaseCalculoSt',
            render: (value) => <>
                {value === '0' && (<span>Preço tabelado ou máximo sugerido</span>)}
                {value === '1' && (<span>Lista Negativa (valor)</span>)}
                {value === '2' && (<span>Lista Positiva (valor)</span>)}
                {value === '3' && (<span>Lista Neutra (valor)</span>)}
                {value === '4' && (<span>Margem Valor Agregado (%)</span>)}
                {value === '5' && (<span>Pauta (valor)</span>)}
            </>
            ,
            width: '12%',
            align: 'center'
        },
        {
            title: 'V. FCP',
            dataIndex: 'icms.valorFcp',
            key: 'icms.valorFcp',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} precision={2} prefix='R$' />}</>
            ,
            width: '6%',
            align: 'right'
        },
        {
            title: 'V. FCP ST',
            dataIndex: 'icms.valorFcpSt',
            key: 'icms.valorFcpSt',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} precision={2} prefix='R$' />}</>
            ,
            width: '6%',
            align: 'right'
        },
        {
            title: 'V. FCP ST RET.',
            dataIndex: 'icms.valorFcpRetido',
            key: 'icms.valorFcpRetido',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} precision={2} prefix='R$' />}</>
            ,
            width: '6%',
            align: 'right'
        },
        {
            title: '% FCP',
            dataIndex: 'icms.porcentagemFcp',
            key: 'icms.porcentagemFcp',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} suffix='%' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} suffix='%' precision={2} />}</>,
            width: '6%',
            align: 'right'
        },
        {
            title: '% FCP ST',
            dataIndex: 'icms.porcentagemFcpSt',
            key: 'icms.porcentagemFcpSt',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} suffix='%' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} suffix='%' precision={2} />}</>,
            width: '6%',
            align: 'right'
        },
        {
            title: '% FCP RET.',
            dataIndex: 'icms.porcentagemFcpRetido',
            key: 'icms.porcentagemFcpRetido',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} suffix='%' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} suffix='%' precision={2} />}</>,
            width: '6%',
            align: 'right'
        },
        {
            title: 'V. B.C. FCP',
            dataIndex: 'icms.baseCalculoFcp',
            key: 'icms.baseCalculoFcp',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} precision={2} prefix='R$' />}</>
            ,
            width: '6%',
            align: 'right'
        },
        {
            title: 'V. B.C. FCP ST',
            dataIndex: 'icms.baseCalculoFcpSt',
            key: 'icms.baseCalculoFcpSt',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} precision={2} prefix='R$' />}</>
            ,
            width: '6%',
            align: 'right'
        },
        {
            title: 'V. B.C. FCP RET.',
            dataIndex: 'icms.baseCalculoFcpRetido',
            key: 'icms.baseCalculoFcpRetido',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} precision={2} prefix='R$' />}</>
            ,
            width: '6%',
            align: 'right'
        },
        {
            title: 'PIS CST',
            dataIndex: 'pis.pisCst',
            key: 'pis.pisCst',
            align: 'center',
            width: '5%'
        },
        {
            title: 'PIS B.C.',
            dataIndex: 'pis.pisBaseCalculo',
            key: 'pis.pisBaseCalculo',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} precision={2} prefix='R$' />}</>
            ,
            width: '6%',
            align: 'right'
        },
        {
            title: '% PIS',
            dataIndex: 'pis.pisPorcentagem',
            key: 'pis.pisPorcentagem',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} suffix='%' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} suffix='%' precision={2} />}</>,
            width: '6%',
            align: 'right'
        },
        {
            title: 'V. PIS',
            dataIndex: 'pis.valorPis',
            key: 'pis.valorPis',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} precision={2} prefix='R$' />}</>
            ,
            width: '6%',
            align: 'right'
        },
        {
            title: 'COFINS CST',
            dataIndex: 'cofins.cofinsCst',
            key: 'cofins.cofinsCst',
            align: 'center',
            width: '5%'
        },
        {
            title: 'COFINS B.C.',
            dataIndex: 'cofins.pisBaseCalculo',
            key: 'cofins.pisBaseCalculo',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} precision={2} prefix='R$' />}</>
            ,
            width: '6%',
            align: 'right'
        },
        {
            title: '% COFINS',
            dataIndex: 'cofins.pisPorcentagem',
            key: 'cofins.pisPorcentagem',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} suffix='%' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} suffix='%' precision={2} />}</>,
            width: '6%',
            align: 'right'
        },
        {
            title: 'V. COFINS',
            dataIndex: 'cofins.valorPis',
            key: 'cofins.valorPis',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} prefix='R$' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} precision={2} prefix='R$' />}</>
            ,
            width: '6%',
            align: 'right'
        },
        {
            title: 'IPI CST',
            dataIndex: 'ipi.cst',
            key: 'ipi.cst',
            align: 'center',
            width: '6%'
        },
        {
            title: '% IPI',
            dataIndex: 'ipi.rate',
            key: 'ipi.rate',
            render: (value) => <>{value ? <Statistic value={value} valueStyle={{ fontSize: 15 }} suffix='%' precision={2} /> : <Statistic value={0} valueStyle={{ fontSize: 15 }} suffix='%' precision={2} />}</>,
            width: '6%',
            align: 'center'
        },
        {
            title: 'IPI Cod.',
            dataIndex: 'ipi.code',
            key: 'ipi.code',
            align: 'center',
            width: '6%'
        },
        {
            title: 'Cód. Ben. Fiscal',
            dataIndex: 'codigoBeneficioFiscal',
            key: 'codigoBeneficioFiscal',
            align: 'center',
            width: '8%'
        },
    ];

    return (
        <div>

            <Header>
                <p style={{ fontWeight: 'bold', marginBottom: -.01, fontSize: 18 }}><Icon type='file-excel' style={{ fontSize: 20 }} /> IMPORTAR XML</p>
                <Link style={{ position: 'absolute', right: 0 }} to='/'><Button type='danger' shape='circle' icon='close' size='small' /></Link>
            </Header>

            <div style={{ paddingTop: 15, paddingBottom: 15, paddingLeft: 30, paddingRight: 30, width: '100%' }}>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

                    <label id='xmlFile'>
                        <input type='file' onChange={event => setXmlFile(event.target.files[0])} />
                        {!xmlFile && (
                            <p style={{ marginBottom: -.5 }}><Icon type='file-done' style={{ fontSize: 15, marginRight: 10 }} />Clique aqui para adicionar o arquivo XML da nota fiscal</p>
                        )}
                        {xmlFile && (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <p style={{ marginBottom: -.5 }}>{xmlFile.name}</p>
                                    <Tooltip title='Excluir XML'>
                                        <Button icon='close' type='link' style={{ marginLeft: 10, marginTop: -5, marginBottom: -5, color: 'red' }} onClick={() => delXmlFile()} />
                                    </Tooltip>
                                </div>
                                <p style={{ marginBottom: -.5, fontStyle: 'italic', fontSize: 11, color: 'lightgray' }}>Clique em IMPORTAR XML para enviar o arquivo para o servidor</p>
                            </>
                        )}
                    </label>

                </div>

                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', marginTop: 15 }}>
                    <Button icon='file-done' type='primary' style={{ marginRight: 15 }} onClick={() => sendXmlFile()} loading={loadindImport}>Carregar Dados da NFE</Button>
                </div>

                {!!produtos.length && (
                    <>
                        <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>INFORMAÇÕES DO FORNECEDOR</Divider>
                        <Row gutter={10} style={{ marginBottom: 6 }}>
                            <Col span={12}>
                                <label>Razão Social</label>
                                <Input value={fornecedorName} readOnly />
                            </Col>
                            <Col span={12}>
                                <label>Nome / Nome Fantasia</label>
                                <Input value={fornecedorFantasia} readOnly />
                            </Col>
                        </Row>
                        <Row gutter={10} style={{ marginBottom: 6 }}>
                            <Col span={8}>
                                <label>CPF / CNPJ</label>
                                <InputMask mask={'99.999.999/9999-99'} className='ant-input' value={fornecedorCNPJ} readOnly />
                            </Col>
                            <Col span={8}>
                                <label>Telefone</label>
                                <Input value={fornecedorFone} readOnly />
                            </Col>
                            <Col span={8}>
                                <label>CEP</label>
                                <Input value={fornecedorCEP} readOnly />
                            </Col>
                        </Row>
                        <Row gutter={10} style={{ marginBottom: 6 }}>
                            <Col span={18}>
                                <label>Cidade</label>
                                <Input value={fornecedorCity} readOnly />
                            </Col>
                            <Col span={6}>
                                <label>Estado</label>
                                <Input value={fornecedorState} readOnly />
                            </Col>
                        </Row>

                        <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>INFORMAÇÕES DA NFE</Divider>
                        <Row gutter={10}>
                            <Col span={12} style={{ marginBottom: 6 }}>
                                <label>Natureza da Operação</label>
                                <Input value={naturezaOpe} readOnly />
                            </Col>
                            <Col span={12}>
                                <label>Chave da NFE</label>
                                <Input value={chaveNfe} readOnly />
                            </Col>
                        </Row>
                        <Row gutter={10} style={{ marginBottom: 6 }}>
                            <Col span={4}>
                                <label>Protocolo</label>
                                <Input value={protocolo} readOnly />
                            </Col>
                            <Col span={4}>
                                <label>Nº da Nota</label>
                                <Input value={numeroNota} readOnly />
                            </Col>
                            <Col span={4}>
                                <label>Série</label>
                                <Input value={serie} readOnly />
                            </Col>
                            <Col span={4}>
                                <label>Operação</label>
                                <Input value={operacao} readOnly />
                            </Col>
                            <Col span={4}>
                                <label>Data Emissão</label>
                                <Input value={moment(dataEmissao).format('DD/MM/YYYY')} readOnly />
                            </Col>
                            <Col span={4}>
                                <label>Valor da Nota</label>
                                <Input value={valorNota} readOnly />
                            </Col>
                        </Row>
                        <Row gutter={10} style={{ marginBottom: 6 }}>
                            <Col span={4}>
                                <label>Total Icms</label>
                                <Input value={totalIcms} readOnly />
                            </Col>
                            <Col span={4}>
                                <label>B.C. Icms</label>
                                <Input value={baseCalculoIcms} readOnly />
                            </Col>
                            <Col span={4}>
                                <label>Total Icms ST</label>
                                <Input value={totalIcmsSt} readOnly />
                            </Col>
                            <Col span={4}>
                                <label>B.C. Icms ST</label>
                                <Input value={baseCalculoIcmsSt} readOnly />
                            </Col>
                            <Col span={4}>
                                <label>Icms ST Retido</label>
                                <Input value={totalIcmsStRetido} readOnly />
                            </Col>
                            <Col span={4}>
                                <label>B.C. Icms ST Ret.</label>
                                <Input value={baseCalculoIcmsRetido} readOnly />
                            </Col>
                        </Row>
                        <Row gutter={10} style={{ marginBottom: 6 }}>
                            <Col span={4}>
                                <label>Total Produtos</label>
                                <Input value={totalProdutos} readOnly />
                            </Col>
                            <Col span={4}>
                                <label>Total Frete</label>
                                <Input value={totalFrete} readOnly />
                            </Col>
                            <Col span={4}>
                                <label>Valor Desconto</label>
                                <Input value={valorDesconto} readOnly />
                            </Col>
                            <Col span={4}>
                                <label>Valor Seguro</label>
                                <Input value={valorSeguro} readOnly />
                            </Col>
                            <Col span={4}>
                                <label>Valor Pis</label>
                                <Input value={valorPis} readOnly />
                            </Col>
                            <Col span={4}>
                                <label>Valor Cofins</label>
                                <Input value={valorCofins} readOnly />
                            </Col>
                        </Row>
                        <Row gutter={10}>
                            <Col span={4}>
                                <label>Outras Despesas</label>
                                <Input value={valorOutrasDespesas} readOnly />
                            </Col>
                            <Col span={4}>
                                <label>Icms Desonerado</label>
                                <Input value={toalIcmsDesonerado} readOnly />
                            </Col>
                            <Col span={4}>
                                <label>Total Tributos</label>
                                <Input value={totalTributos} readOnly />
                            </Col>
                            <Col span={4}>
                            </Col>
                            <Col span={4}>
                            </Col>
                            <Col span={4}>
                            </Col>
                        </Row>

                        <Divider style={{ fontSize: 15, fontWeight: 'bold' }}>INFORMAÇÕES DOS PRODUTOS</Divider>

                        <Table pagination={{ pageSize: 10 }} columns={columnsProduct} dataSource={produtos} size='small' rowKey={(prod) => prod.id} scroll={{ x: 5000 }} />

                        <Divider />

                        <Button icon='save' size='large' type='primary' style={{ marginBottom: 1 }} loading={loadingSave} onClick={() => saveProducts()}>Cadastrar Itens</Button>

                    </>
                )}

            </div>

        </div>
    );
}

export default XmlImporter;