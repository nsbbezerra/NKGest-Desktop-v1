import React, { Component } from 'react';
import { Icon, Button, Modal, Radio, Divider, Select, Table, Tooltip, TreeSelect, Input, Tabs, Spin, Statistic, Row, Col, Switch, Dropdown, Menu } from 'antd';
import api from '../../config/axios';
import imcsCsosn from '../../data/pisCst.json';
import PdfFile from '../../assets/pdf.svg';
import XmlFile from '../../assets/xml.svg';
import '../../styles/style.css';

const { Option } = Select;
const { TreeNode } = TreeSelect;
const { TabPane } = Tabs;
const { TextArea } = Input;

export default class NotaFiscalNFE extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modalAdvancedFind: false, loading: false, typeAdvandcedFind: 1, mes: '', ano: '', clientId: '', clientName: '', numberSale: '', sales: [], clients: [], modalPrint: false, spinner: false, xmlUrl: '', danfeUrl: '', modalConfigRasc: false, pisCst: imcsCsosn, icmsCstAct: false, pisCstAct: false, cofinsCstAct: false, icmsCstValue: '', pisCstValue: '', cofinsCstValue: '', cfopAct: false, cfopValue: '', freteModality: '', freteValue: 0, typeDocument: '', documentFinality: '', idOrder: '', idSale: '', loadingSendRasc: false, modalVerify: false, modalEmit: false, modalCancel: false, justify: '', modalJustify: false, modalDelRasc: false, items: [], modalRasc: false, natOpe: '', urlPdf: '', urlXml: '', numberSale: '', modalPrint: false, modeFile: 'pdf', nfeKey: '', idNfeCorrect: '', modalCorrectNfe: false, modalCorrect: false, correcao: '', modalEmail: false, emails: [], email: '', serie: '', numero_inicial: '', numero_final: '', modalInutil: false, infoAdd: '', valueBruto: 0, valueLiquid: 0, valueDesconto: 0, descontoRef: 0, modalEditProduct: false, indexProductToEdit: 0, idToEmit: '', typeCfop: '',

            natureza_operacao: "", tipo_documento: "", finalidade_emissao: "", cnpj_emitente: "", nome_emitente: "", nome_fantasia_emitente: "", logradouro_emitente: "", numero_emitente: "", bairro_emitente: "", municipio_emitente: "", uf_emitente: "", cep_emitente: "", inscricao_estadual_emitente: "", nome_destinatario: "", cpf_destinatario: "", telefone_destinatario: "", logradouro_destinatario: "",
            numero_destinatario: "", bairro_destinatario: "", municipio_destinatario: "", uf_destinatario: "", cep_destinatario: "", valor_frete: 0, modalidade_frete: 0, inscricao_estadual_destinatario: "", informacoes_adicionais_contribuinte: "", chave_nfe: "", cpf_emitente: "", cnpj_destinatario: "",

            numero_item: 0, codigo_produto: "", codigo_barras_comercial: "", descricao: "", cfop: "", cest: "", unidade_comercial: "", quantidade_comercial: 0, valor_unitario_comercial: 0, valor_unitario_tributavel: 0, unidade_tributavel: "", codigo_ncm: "", quantidade_tributavel: 0, valor_bruto: 0, icms_situacao_tributaria: "", icms_origem: "", pis_situacao_tributaria: "", cofins_situacao_tributaria: "", valor_desconto: 0,
            icms_aliquota: 0, icms_modalidade_base_calculo_st: "", icms_margem_valor_adicionado_st: 0, icms_aliquota_st: 0, fcp_percentual: 0, fcp_percentual_st: 0, fcp_percentual_retido_st: 0, ipi_situacao_tributaria: '',
            ipi_aliquota: 0, pis_aliquota_porcentual: 0, cofins_aliquota_porcentual: 0, ipi_codigo_enquadramento_legal: ''
        }
    }

    findRasc = async (id) => {
        this.setState({ spinner: true });
        await api.get(`/invoices/findRasc/${id}`).then(response => {
            this.setState({ idToEmit: response.data.rasc.sale });
            this.setState({ items: response.data.rasc.items });
            this.setState({ valueBruto: response.data.sale.valueBruto });
            this.setState({ valueLiquid: response.data.sale.valueLiquido });
            this.setState({ valueDesconto: response.data.sale.valueDesconto });
            this.setState({ descontoRef: response.data.sale.valueDesconto });

            this.setState({ natureza_operacao: response.data.rasc.natureza_operacao });
            this.setState({ tipo_documento: response.data.rasc.tipo_documento });
            this.setState({ finalidade_emissao: response.data.rasc.finalidade_emissao });
            if (response.data.rasc.cnpj_emitente) {
                this.setState({ cnpj_emitente: response.data.rasc.cnpj_emitente });
            } else {
                this.setState({ cpf_emitente: response.data.rasc.cpf_emitente });
            }
            this.setState({ nome_emitente: response.data.rasc.nome_emitente });
            if (response.data.rasc.nome_fantasia_emitente) {
                this.setState({ nome_fantasia_emitente: response.data.rasc.nome_fantasia_emitente });
            }
            this.setState({ logradouro_emitente: response.data.rasc.logradouro_emitente });
            this.setState({ numero_emitente: response.data.rasc.numero_emitente });
            this.setState({ bairro_emitente: response.data.rasc.bairro_emitente });
            this.setState({ municipio_emitente: response.data.rasc.municipio_emitente });
            this.setState({ uf_emitente: response.data.rasc.uf_emitente });
            this.setState({ cep_emitente: response.data.rasc.cep_emitente });
            if (response.data.rasc.inscricao_estadual_emitente) {
                this.setState({ inscricao_estadual_emitente: response.data.rasc.inscricao_estadual_emitente });
            }
            this.setState({ nome_destinatario: response.data.rasc.nome_destinatario });
            if (response.data.rasc.cpf_destinatario) {
                this.setState({ cpf_destinatario: response.data.rasc.cpf_destinatario });
            } else {
                this.setState({ cnpj_destinatario: response.data.rasc.cnpj_destinatario });
            }
            if (response.data.rasc.telefone_destinatario) {
                this.setState({ telefone_destinatario: response.data.rasc.telefone });
            }
            this.setState({ logradouro_destinatario: response.data.rasc.logradouro_destinatario });
            this.setState({ numero_destinatario: response.data.rasc.numero_destinatario });
            this.setState({ bairro_destinatario: response.data.rasc.bairro_destinatario });
            this.setState({ municipio_destinatario: response.data.rasc.municipio_destinatario });
            this.setState({ uf_destinatario: response.data.rasc.uf_destinatario });
            this.setState({ cep_destinatario: response.data.rasc.cep_destinatario });
            this.setState({ valor_frete: response.data.rasc.valor_frete });
            this.setState({ modalidade_frete: response.data.rasc.modalidade_frete });
            if (response.data.rasc.inscricao_estadual_destinatario) {
                this.setState({ inscricao_estadual_destinatario: response.data.rasc.inscricao_estadual_destinatario });
            }
            if (response.data.rasc.informacoes_adicionais_contribuinte) {
                this.setState({ informacoes_adicionais_contribuinte: response.data.rasc.informacoes_adicionais_contribuinte });
            }
            if (response.data.rasc.notas_referenciadas.length) {
                this.setState({ chave_nfe: response.data.rasc.notas_referenciadas[0].chave_nfe });
            }
            this.setState({ spinner: false });
            this.setState({ modalRasc: true });
        }).catch(error => {
            this.erro('Erro', error.response.data.message);
            this.setState({ spinner: false });
        });
    }

    erro = (title, message) => {
        Modal.error({
            title: title,
            content: (
                <div>
                    <p>{message}</p>
                </div>
            ),
            onOk() { },
        });
    };

    success = (title, message) => {
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

    successSefaz = (title, message, status, messageSefaz) => {
        Modal.success({
            title: title,
            content: (
                <div>
                    <p>{message}</p>
                    <p><strong>STATUS SEFAZ:</strong> {status}</p>
                    <p><strong>MENSAGEM SEFAZ:</strong> {messageSefaz}</p>
                </div>
            ),
            onOk() { },
        });
    }

    warning = (title, message) => {
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

    info = (title, message) => {
        Modal.info({
            title: title,
            content: (
                <div>
                    <p>{message}</p>
                </div>
            ),
            onOk() { },
        });
    }

    erro = (title, message) => {
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
    erroSefaz = (title, message, status, messageSefaz) => {
        Modal.warning({
            title: title,
            content: (
                <div>
                    <p>{message}</p>
                    <p><strong>STATUS SEFAZ:</strong> {status}</p>
                    <p><strong>MENSAGEM SEFAZ:</strong> {messageSefaz}</p>
                </div>
            ),
            onOk() { },
        });
    }

    erroValidacao = (title, message, erros) => {
        Modal.error({
            title: title,
            content: (
                <div>
                    <p>{message}</p>
                    {erros ? (
                        <>
                            <label>ERROS:</label>
                            {!!erros.length && (
                                erros.map(err => (
                                    <p key={err.mensagem}>{err.mensagem}</p>
                                ))
                            )}
                        </>
                    ) : ''}
                </div>
            ),
            onOk() { },
        });
    }

    findClients = async () => {
        this.setState({ spinner: true });
        await api.get(`/admin/listClientes`).then(response => {
            this.setState({ clients: response.data.clientes });
            this.setState({ spinner: false });
        }).catch(error => {
            if (error.message === 'Network Error') {
                this.erro('Erro', 'Sem conexão com o servidor');
                this.setState({ spinner: false });
                return false;
            } else {
                this.erro('Erro', error.response.data.message);
                this.setState({ spinner: false });
            }
        });
    }

    sendAdvancedFind = async () => {
        this.setState({ spinner: true });
        this.setState({ loading: true });
        await api.post('/invoices/finder', {
            find: this.state.typeAdvandcedFind,
            client: this.state.clientId,
            mes: this.state.mes,
            ano: this.state.ano,
            number: this.state.numberSale
        }).then(response => {
            this.setState({ sales: response.data.vendas });
            this.setState({ spinner: false });
            this.setState({ loading: false });
            this.setState({ modalAdvancedFind: false });
        }).catch(error => {
            this.erro('Erro', error.response.data.message);
            this.setState({ spinner: false });
            this.setState({ loading: false });
        })
    }

    handleClient = async (val) => {
        const result = await this.state.clients.find(obj => obj.name === val);
        await this.setState({ clientId: result._id });
        await this.setState({ clientName: result.name });
    }

    componentDidMount = () => {
        this.findClients();
        this.sendAdvancedFind();
    }

    handleRascSale = async (id) => {
        const result = await this.state.sales.find(obj => obj._id === id);
        this.setState({ clientId: result.client._id });
        this.setState({ idSale: id });
        this.setState({ modalConfigRasc: true });
    }


    allClear = () => {
        this.setState({ cfopAct: false }); this.setState({ cfopValue: '' }); this.setState({ typeDocument: '' }); this.setState({ documentFinality: '' }); this.setState({ freteModality: '' }); this.setState({ freteValue: 0 }); this.setState({ icmsCstAct: false }); this.setState({ icmsCstValue: '' }); this.setState({ pisCstAct: false }); this.setState({ pisCstValue: '' }); this.setState({ cofinsCstAct: false }); this.setState({ cofinsCstValue: '' }); this.setState({ items: [] }); this.setState({ idNfeCorrect: '' }); this.setState({ nfeKey: '' }); this.setState({ serie: '' }); this.setState({ numero_final: '' }); this.setState({ numero_inicial: '' }); this.setState({ infoAdd: '' }); this.setState({ typeCfop: '' }); this.setState({ natOpe: '' })
    }

    generateRascSale = async () => {
        this.setState({ loadingSendRasc: true });
        await api.post('/invoices/nfeRasc', {
            cliente: this.state.clientId, venda: this.state.idSale, cfop: { status: this.state.cfopAct, value: this.state.cfopValue, type: this.state.typeCfop }, config: { typeDocument: this.state.typeDocument, finality: this.state.documentFinality }, frete: { mode: this.state.freteModality, value: this.state.freteValue }, icms: { status: this.state.icmsCstAct, cst: this.state.icmsCstValue }, pis: { status: this.state.pisCstAct, cst: this.state.pisCstValue }, cofins: { status: this.state.cofinsCstAct, cst: this.state.cofinsCstValue }, natOpe: this.state.natOpe, obs: this.state.infoAdd
        }).then(response => {
            this.allClear();
            this.setState({ loadingSendRasc: false });
            this.setState({ modalConfigRasc: false });
            this.success('Sucesso', response.data.message);
            this.sendAdvancedFind();
        }).catch(error => {
            this.setState({ loadingSendRasc: false });
            this.setState({ modalConfigRasc: false });
            this.erro('Erro', error.response.data.message);
        });
    }

    findStatusNfe = async (id) => {
        this.setState({ modalVerify: true });
        await api.post('/invoices/statusNfe', {
            ref: id
        }).then(response => {
            if (response.data.info === 'processando_autorizacao') {
                this.setState({ modalVerify: false });
                this.info('Processando Autorização', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'autorizado') {
                this.setState({ modalVerify: false });
                this.success('Autorizado', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'erro_autorizacao') {
                this.setState({ modalVerify: false });
                this.erroSefaz('Erro de Autorização', response.data.message, response.data.statuSefaz, response.data.messageSafaz);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'denegado') {
                this.setState({ modalVerify: false });
                this.erro('Denegado', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'cancelado') {
                this.setState({ modalVerify: false });
                this.erro('NFE Cancelada', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            this.erro('Ops!', 'Alguma coisa não ocorreu bem, tente novamente!');
            this.setState({ modalVerify: false });
            this.sendAdvancedFind();
        }).catch(error => {
            this.setState({ modalVerify: false });
            this.erro('Erro', error.response.data.message);
        });
    }

    emmitNFE = async () => {
        this.setState({ modalEmit: true });
        await api.post('/invoices/nfe', {
            id: this.state.idToEmit, natureza_operacao: this.state.natureza_operacao, tipo_documento: this.state.tipo_documento, finalidade_emissao: this.state.finalidade_emissao, cnpj_emitente: this.state.cnpj_emitente, nome_emitente: this.state.nome_emitente, nome_fantasia_emitente: this.state.nome_fantasia_emitente, logradouro_emitente: this.state.logradouro_emitente, numero_emitente: this.state.numero_emitente, bairro_emitente: this.state.bairro_emitente, municipio_emitente: this.state.municipio_emitente, uf_emitente: this.state.uf_emitente, cep_emitente: this.state.cep_emitente, inscricao_estadual_emitente: this.state.inscricao_estadual_emitente, nome_destinatario: this.state.nome_destinatario, cpf_destinatario: this.state.cpf_destinatario, telefone_destinatario: this.state.telefone_destinatario, logradouro_destinatario: this.state.logradouro_destinatario,
            numero_destinatario: this.state.numero_destinatario, bairro_destinatario: this.state.bairro_destinatario, municipio_destinatario: this.state.municipio_destinatario, uf_destinatario: this.state.uf_destinatario, cep_destinatario: this.state.cep_destinatario, valor_frete: this.state.valor_frete, modalidade_frete: this.state.modalidade_frete, inscricao_estadual_destinatario: this.state.inscricao_estadual_destinatario, informacoes_adicionais_contribuinte: this.state.informacoes_adicionais_contribuinte, chave_nfe: this.state.chave_nfe, cpf_emitente: this.state.cpf_emitente, cnpj_destinatario: this.state.cnpj_destinatario, items: this.state.items
        }).then(response => {
            if (response.data.info === 'processando_autorizacao') {
                this.setState({ modalEmit: false });
                this.info('Processando Autorização', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'erro_autorizacao') {
                this.setState({ modalEmit: false });
                this.erroSefaz('Erro de Autorização', response.data.message, response.data.statuSefaz, response.data.messageSafaz);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'denegado') {
                this.setState({ modalEmit: false });
                this.erro('Denegado', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'requisicao_invalida') {
                this.setState({ modalEmit: false });
                this.erro('Requisição Inválida', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'empresa_nao_habilitada') {
                this.setState({ modalEmit: false });
                this.erro('Empresa não Habilitada', response.data.message, response.data.erros);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'nfe_cancelada') {
                this.setState({ modalEmit: false });
                this.erro('NFE Cancelada', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'permissao_negada') {
                this.setState({ modalEmit: false });
                this.erro('Permissão Negada', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'nao_encontrado') {
                this.setState({ modalEmit: false });
                this.erro('Não Encontrado', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'nfe_nao_autorizada') {
                this.setState({ modalEmit: false });
                this.erro('NFE Não Autorizada', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'nfe_autorizada') {
                this.setState({ modalEmit: false });
                this.erro('NFE Autorizada', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'em_processamento') {
                this.setState({ modalEmit: false });
                this.erro('Em Processamento', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'erro_validacao_schema') {
                this.setState({ modalEmit: false });
                this.erroValidacao('Erro de Validação do Esquema da Nota', response.data.message, response.data.erros);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'already_processed') {
                this.setState({ modalEmit: false });
                this.warning('Nota já Processada', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'erro_validacao') {
                this.setState({ modalEmit: false });
                this.erro('Erro de Validação', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            this.erro('Ops!', 'Alguma coisa não ocorreu bem, tente novamente!');
            this.setState({ modalEmit: false });
            this.sendAdvancedFind();
        }).catch(error => {
            this.setState({ modalEmit: false });
            this.erro('Erro', error.response.data.message);
        });
    }

    handleCancelNFE = async (id) => {
        await this.setState({ idSale: id });
        this.setState({ modalJustify: true });
    }

    handlePrintDanfeNFE = async (url) => {
        await this.setState({ danfeUrl: url });
        this.setState({ modalPrint: true });
    }

    cancleNFE = async () => {
        this.setState({ modalJustify: false });
        this.setState({ modalCancel: true });
        await api.post('/invoices/cancelNfe', {
            ref: this.state.idSale, justify: this.state.justify
        }).then(response => {
            if (response.data.info === 'cancelado') {
                this.setState({ modalCancel: false });
                this.successSefaz('NFE Cancelada', response.data.message, response.data.statuSefaz, response.data.messageSafaz);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'requisicao_invalida') {
                this.setState({ modalCancel: false });
                this.warning('Requisição Inválida', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'erro_cancelamento') {
                this.setState({ modalCancel: false });
                this.erro('Erro no cancelamento', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            this.erro('Ops!', 'Alguma coisa não ocorreu bem, tente novamente!');
            this.setState({ modalCancel: false });
            this.sendAdvancedFind();
        }).catch(error => {
            this.setState({ modalCancel: false });
            this.erro('Erro', error.response.data.message);
        });
    }

    handleDelRascNFE = async (id) => {
        await this.setState({ idSale: id });
        this.setState({ modalDelRasc: true });
    }

    delRascNFE = async () => {
        this.setState({ loadingSendRasc: true });
        await api.delete(`/invoices/delRasc/${this.state.idSale}`).then(response => {
            this.setState({ loadingSendRasc: false });
            this.setState({ modalDelRasc: false });
            this.sendAdvancedFind();
            this.success('Sucesso', response.data.message);
        }).catch(error => {
            this.setState({ loadingSendRasc: false });
            this.setState({ modalDelRasc: false });
            this.erro('Erro', error.response.data.message);
        });
    }

    handleDownloadXml = async () => {
        window.open(this.state.xmlUrl, "XmlDownload");
    }

    handleDownloadXmlCancel = async (url) => {
        window.open(url, "XmlDownload");
    }

    handleDownloadXmlCorrect = async (url) => {
        window.open(url, "XmlDownload");
    }

    handleDownloadPdf = async () => {
        let filename = `${this.state.numberSale}.pdf`;
        let pom = document.createElement('a');
        pom.download = filename;
        pom.href = this.state.urlPdf;
        pom.click();
    }

    handleDownloadPdfCorrect = async (url, number) => {
        let filename = `${number}.pdf`;
        let pom = document.createElement('a');
        pom.download = filename;
        pom.href = url;
        pom.click();
    }

    handleDocuments = async (pdf, xml, number) => {
        await this.setState({ urlPdf: pdf });
        await this.setState({ xmlUrl: xml });
        await this.setState({ numberSale: number });
        this.setState({ modalPrint: true });
    }

    handleDownloadDocument = () => {
        if (this.state.modeFile === 'pdf') {
            this.handleDownloadPdf();
        }
        if (this.state.modeFile === 'xml') {
            this.handleDownloadXml();
        }
    }

    handleDevolveRasc = async (id) => {
        await this.setState({ idNfeCorrect: id });
        this.setState({ modalCorrectNfe: true });
    }

    sendRascDevolve = async () => {
        this.setState({ loadingSendRasc: true });
        api.post('/invoices/nfeRascDev', {
            venda: this.state.idNfeCorrect, cfop: this.state.cfopValue, natOpe: this.state.natOpe, keyNfe: this.state.nfeKey, docType: this.state.typeDocument, finality: this.state.documentFinality, obs: this.state.infoAdd
        }).then(response => {
            this.setState({ modalCorrectNfe: false });
            this.success('Sucesso', response.data.message);
            this.sendAdvancedFind();
            this.allClear();
        }).catch(error => {
            this.setState({ loadingSendRasc: false });
            this.setState({ modalCorrectNfe: false });
            this.erro('Erro', error.response.data.message);
        });
    }

    handlePrintPdf = () => {
        window.open(this.state.urlPdf, 'PrintPdf', `height=${window.screen.height}, width=${window.screen.width}`, 'fullscreen=yes');
    }

    emitDevolveNFE = async (id) => {
        this.setState({ modalEmit: true });
        api.post('/invoices/sendDevNfe', {
            venda: id
        }).then(response => {
            if (response.data.info === 'processando_autorizacao') {
                this.setState({ modalEmit: false });
                this.info('Processando Autorização', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'erro_autorizacao') {
                this.setState({ modalEmit: false });
                this.erroSefaz('Erro de Autorização', response.data.message, response.data.statuSefaz, response.data.messageSafaz);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'denegado') {
                this.setState({ modalEmit: false });
                this.erro('Denegado', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'requisicao_invalida') {
                this.setState({ modalEmit: false });
                this.erro('Requisição Inválida', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'empresa_nao_habilitada') {
                this.setState({ modalEmit: false });
                this.erro('Empresa não Habilitada', response.data.message, response.data.erros);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'nfe_cancelada') {
                this.setState({ modalEmit: false });
                this.erro('NFE Cancelada', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'permissao_negada') {
                this.setState({ modalEmit: false });
                this.erro('Permissão Negada', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'nao_encontrado') {
                this.setState({ modalEmit: false });
                this.erro('Não Encontrado', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'nfe_nao_autorizada') {
                this.setState({ modalEmit: false });
                this.erro('NFE Não Autorizada', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'nfe_autorizada') {
                this.setState({ modalEmit: false });
                this.erro('NFE Autorizada', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'em_processamento') {
                this.setState({ modalEmit: false });
                this.erro('Em Processamento', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'erro_validacao_schema') {
                this.setState({ modalEmit: false });
                this.erroValidacao('Erro de Validação do Esquema da Nota', response.data.message, response.data.erros);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'already_processed') {
                this.setState({ modalEmit: false });
                this.warning('Nota já Processada', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.info === 'erro_validacao') {
                this.setState({ modalEmit: false });
                this.erro('Erro de Validação', response.data.message);
                this.sendAdvancedFind();
                return false;
            }
            this.erro('Ops!', 'Alguma coisa não ocorreu bem, tente novamente!');
            this.setState({ modalEmit: false });
            this.sendAdvancedFind();
        }).catch(error => {
            this.setState({ modalEmit: false });
            this.erro('Erro', error.response.data.message);
        });
    }

    handleCartaCorrect = async (id) => {
        await this.setState({ idNfeCorrect: id });
        this.setState({ modalCorrect: true });
    }

    sendCorrectNFE = async () => {
        this.setState({ loadingSendRasc: true });
        api.post('/invoices/cartaCorrect', {
            ref: this.state.idNfeCorrect, correct: this.state.correcao
        }).then(response => {
            this.setState({ loadingSendRasc: false });
            this.setState({ modalCorrect: false });
            this.info('Informação', response.data.mensagem);
            this.sendAdvancedFind();
            this.allClear();
        }).catch(error => {
            this.setState({ loadingSendRasc: false });
            this.setState({ modalCorrect: false });
            this.erro('Erro', error.response.data.message);
        });
    }

    handleSendEmail = async (id) => {
        await this.setState({ idNfeCorrect: id });
        this.setState({ modalEmail: true });
    }

    handleEmail = async () => {
        await this.setState({ emails: [...this.state.emails, this.state.email] });
        this.setState({ email: '' });
    }

    sendEmail = async () => {
        this.setState({ loadingSendRasc: true });
        api.post('/invoices/sendEmailNfe', {
            ref: this.state.idNfeCorrect, emails: this.state.emails
        }).then(response => {
            this.setState({ loadingSendRasc: false });
            this.setState({ modalEmail: false });
            this.success('Sucesso', response.data.message);
            this.allClear();
        }).catch(error => {
            this.setState({ loadingSendRasc: false });
            this.setState({ modalEmail: false });
            this.erro('Erro', error.response.data.message);
        });
    }

    handleInutil = async (id) => {
        this.setState({ modalInutil: true });
    }

    sendInutil = async () => {
        this.setState({ loadingSendRasc: true });
        api.post('/invoices/inutilNFe', {
            serie: this.state.serie, numero_inicial: this.state.numero_inicial, numero_final: this.state.numero_final, justificativa: this.state.justify
        }).then(response => {
            if (response.data.status === 'autorizado') {
                this.setState({ modalInutil: false });
                this.success('Autorizado', response.data.message);
                this.setState({ loadingSendRasc: false });
                this.sendAdvancedFind();
                return false;
            }
            if (response.data.status === 'erro_autorizacao') {
                this.setState({ modalInutil: false });
                this.erro('Erro de Autorização', response.data.message);
                this.setState({ loadingSendRasc: false });
                this.sendAdvancedFind();
                return false;
            }
            this.setState({ modalInutil: false });
            this.erro('Erro', 'Alguma coisa não ocorreu bem');
            this.setState({ loadingSendRasc: false });
        }).catch(error => {
            this.erro('Erro', error.response.data.message);
            this.setState({ loadingSendRasc: false });
        });
    }

    replaceValue = (value) => {
        let casas = Math.pow(10, 2);
        return Math.floor(value * casas) / casas;
    }

    handleEditProduct = async (id) => {
        const result = await this.state.items.find(obj => obj._id === id);
        const indexArr = await this.state.items.findIndex(obj => obj._id === id);
        this.setState({ indexProductToEdit: indexArr });
        this.setState({ numero_item: result.numero_item });
        this.setState({ codigo_produto: result.codigo_produto });
        this.setState({ descricao: result.descricao });
        this.setState({ cfop: result.cfop });
        this.setState({ unidade_comercial: result.unidade_comercial });
        this.setState({ quantidade_comercial: result.quantidade_comercial });
        this.setState({ valor_unitario_comercial: result.valor_unitario_comercial });
        this.setState({ valor_unitario_tributavel: result.valor_unitario_tributavel });
        this.setState({ unidade_tributavel: result.unidade_tributavel });
        this.setState({ codigo_ncm: result.codigo_ncm });
        this.setState({ quantidade_tributavel: result.quantidade_tributavel });
        this.setState({ valor_bruto: result.valor_bruto });
        this.setState({ icms_situacao_tributaria: result.icms_situacao_tributaria });
        this.setState({ icms_origem: result.icms_origem });
        this.setState({ pis_situacao_tributaria: result.pis_situacao_tributaria });
        this.setState({ cofins_situacao_tributaria: result.cofins_situacao_tributaria });
        this.setState({ icms_aliquota: result.icms_aliquota });
        this.setState({ icms_modalidade_base_calculo_st: result.icms_modalidade_base_calculo_st });
        this.setState({ icms_margem_valor_adicionado_st: result.icms_margem_valor_adicionado_st });
        this.setState({ icms_aliquota_st: result.icms_aliquota_st });
        this.setState({ fcp_percentual: result.fcp_percentual });
        this.setState({ fcp_percentual_retido_st: result.fcp_percentual_retido_st });
        this.setState({ fcp_percentual_st: result.fcp_percentual_st });
        this.setState({ ipi_situacao_tributaria: result.ipi_situacao_tributaria });
        this.setState({ ipi_aliquota: result.ipi_aliquota });
        this.setState({ pis_aliquota_porcentual: result.pis_aliquota_porcentual });
        this.setState({ cofins_aliquota_porcentual: result.cofins_aliquota_porcentual });
        this.setState({ ipi_codigo_enquadramento_legal: result.ipi_codigo_enquadramento_legal });
        if (result.valor_desconto) {
            this.setState({ valor_desconto: result.valor_desconto });
        }
        if (result.cest) {
            this.setState({ cest: result.cest });
        }
        this.setState({ modalEditProduct: true });
    }

    updateProduct = () => {
        if (this.state.descontoRef < this.state.valor_desconto) {
            this.warning('Atenção', 'O valor de desconto digitado é menor do que o restante do desconto');
            return false;
        }
        if (this.state.descontoRef <= 0 && this.state.valueDesconto > 0) {
            this.warning('Atenção', 'O valor do desconto é 0');
            return false;
        }
        this.state.items[this.state.indexProductToEdit].cfop = this.state.cfop;
        this.state.items[this.state.indexProductToEdit].cest = this.state.cest;
        this.state.items[this.state.indexProductToEdit].codigo_ncm = this.state.codigo_ncm;
        this.state.items[this.state.indexProductToEdit].valor_desconto = this.state.valor_desconto;
        this.state.items[this.state.indexProductToEdit].icms_situacao_tributaria = this.state.icms_situacao_tributaria;
        this.state.items[this.state.indexProductToEdit].icms_origem = this.state.icms_origem;
        this.state.items[this.state.indexProductToEdit].pis_situacao_tributaria = this.state.pis_situacao_tributaria;
        this.state.items[this.state.indexProductToEdit].cofins_situacao_tributaria = this.state.cofins_situacao_tributaria;
        this.state.items[this.state.indexProductToEdit].icms_aliquota = this.state.icms_aliquota;
        this.state.items[this.state.indexProductToEdit].icms_modalidade_base_calculo_st = this.state.
            icms_modalidade_base_calculo_st;
        this.state.items[this.state.indexProductToEdit].icms_margem_valor_adicionado_st = this.state.icms_margem_valor_adicionado_st;
        this.state.items[this.state.indexProductToEdit].icms_aliquota_st = this.state.icms_aliquota_st;
        this.state.items[this.state.indexProductToEdit].fcp_percentual = this.state.fcp_percentual;
        this.state.items[this.state.indexProductToEdit].fcp_percentual_retido_st = this.state.fcp_percentual_retido_st;
        this.state.items[this.state.indexProductToEdit].fcp_percentual_st = this.state.fcp_percentual_st;
        this.state.items[this.state.indexProductToEdit].ipi_aliquota = this.state.ipi_aliquota;
        this.state.items[this.state.indexProductToEdit].ipi_situacao_tributaria = this.state.ipi_situacao_tributaria;
        this.state.items[this.state.indexProductToEdit].pis_aliquota_porcentual = this.state.pis_aliquota_porcentual;
        this.state.items[this.state.indexProductToEdit].cofins_aliquota_porcentual = this.state.cofins_aliquota_porcentual;
        this.state.items[this.state.indexProductToEdit].ipi_codigo_enquadramento_legal = this.state.ipi_codigo_enquadramento_legal;
        this.setState({ cest: '' });
        this.setState({ descontoRef: this.state.descontoRef - this.state.valor_desconto });
        this.setState({ modalEditProduct: false });
        this.success('Sucesso', 'Produto Atualizado com Sucesso');
    }

    setAllDescToProduct = async (id) => {
        if (this.state.descontoRef === 0) {
            this.warning('Atenção', 'O valor do desconto é 0');
            return false;
        }
        const indexArr = await this.state.items.findIndex(obj => obj._id === id);
        const valorDoProduto = await this.state.items[indexArr].valor_bruto;
        if (valorDoProduto < this.state.valueDesconto) {
            this.warning('Atenção', 'O valor do produto é menor que o valor do desconto');
            return false;
        }
        this.state.items[indexArr].valor_desconto = this.state.valueDesconto;
        this.setState({ descontoRef: 0 });
        this.success('Sucesso', 'Desconto inserido com sucesso');
    }

    handleEmitNFE = () => {
        this.setState({ modalRasc: false });
        this.emmitNFE();
    }

    render() {

        const DataAtual = new Date();
        const Ano = DataAtual.getFullYear();

        const columns = [
            {
                title: 'Nº',
                dataIndex: 'number',
                key: 'number',
                align: 'center',
                width: '5%'
            },
            {
                title: 'Cliente',
                dataIndex: 'client.name',
                key: 'client.name',
                width: '35%'
            },
            {
                title: 'Data',
                dataIndex: 'createDate',
                key: 'createDate',
                width: '10%',
                align: 'center'
            },
            {
                title: 'Valor',
                dataIndex: 'valueLiquido',
                key: 'valueLiquido',
                width: '8%',
                align: 'right',
                render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15.5 }} precision={2} prefix='R$' />
            },
            {
                title: 'Status',
                dataIndex: 'nfeStatus',
                key: 'nfeStatus',
                width: "10%",
                align: 'center',
                render: (value, info) => <>
                    {!value && (
                        <Tooltip title='Consultar status da NFE' placement='top'>
                            <Button size='small' type='link' style={{ backgroundColor: '#9e9e9e', color: '#000', fontWeight: 'bold', width: '100%' }} onClick={() => { }}>Não Emitido</Button>
                        </Tooltip>
                    )}
                    {value === 'autorizado' && (
                        <>
                            {info.inutil === true ? (
                                <Tooltip title='Consultar status da NFE' placement='top'>
                                    <Button size='small' type='link' style={{ backgroundColor: '#1a1a1a', color: '#fff', fontWeight: 'bold', width: '100%' }} onClick={() => { }}>Inutilizada</Button>
                                </Tooltip>
                            ) : (
                                    <Tooltip title='Consultar status da NFE' placement='top'>
                                        <Button size='small' type='link' style={{ backgroundColor: '#4caf50', color: '#fff', fontWeight: 'bold', width: '100%' }} onClick={() => this.findStatusNfe(info._id)}>Autorizado</Button>
                                    </Tooltip>
                                )}
                        </>
                    )}
                    {value === 'processando_autorizacao' && (
                        <Tooltip title='Consultar status da NFE' placement='top'>
                            <Button size='small' type='link' style={{ backgroundColor: '#ffeb3b', color: '#222', fontWeight: 'bold', width: '100%' }} onClick={() => this.findStatusNfe(info._id)}>Processando</Button>
                        </Tooltip>
                    )}
                    {value === 'erro_autorizacao' && (
                        <Tooltip title='Consultar status da NFE' placement='top'>
                            <Button size='small' type='link' style={{ backgroundColor: '#f44336', color: '#fff', fontWeight: 'bold', width: '100%' }} onClick={() => this.findStatusNfe(info._id)}>Erro Autorização</Button>
                        </Tooltip>
                    )}
                    {value === 'denegado' && (
                        <Tooltip title='Consultar status da NFE' placement='top'>
                            <Button size='small' style={{ backgroundColor: '#212121', color: '#fff', fontWeight: 'bold', width: '100%' }} onClick={() => this.findStatusNfe(info._id)}>Denegada</Button>
                        </Tooltip>
                    )}
                    {value === 'cancelado' && (
                        <Tooltip title='Consultar status da NFE' placement='top'>
                            <Button size='small' type='link' style={{ backgroundColor: '#f44336', color: '#fff', fontWeight: 'bold', width: '100%' }} onClick={() => this.findStatusNfe(info._id)}>Cancelada</Button>
                        </Tooltip>
                    )}
                </>
            },
            {
                title: 'NFE',
                dataIndex: 'rascunhoNFE',
                key: 'rascunhoNFE',
                width: '15%',
                align: 'center',
                render: (val, info) => <>
                    {!info.rascunhoNFE && (
                        <Button size='small' icon='file-sync' style={{ width: '100%' }} type='default' onClick={() => this.handleRascSale(info._id)}>Gerar Rascunho</Button>
                    )}
                    {info.rascunhoNFE === true && (
                        <div style={{ width: '100%' }}>
                            {!info.nfeStatus && (
                                <Dropdown overlay={() => (
                                    <Menu>
                                        <Menu.Item key="1" onClick={() => this.findRasc(info._id)}>
                                            <Icon type="search" style={{ marginRight: 5 }} />
                                                Visualizar e Emitir NFE
                                        </Menu.Item>
                                        <Menu.Item key="2" onClick={() => this.handleDelRascNFE(info._id)}>
                                            <Icon type="close" style={{ marginRight: 5 }} />
                                                Excluir Rascunho
                                        </Menu.Item>
                                    </Menu>
                                )} trigger={['click']} placement='bottomRight'>
                                    <Button icon='setting' size='small' style={{ width: '100%' }}>Opções da NFE</Button>
                                </Dropdown>
                            )}
                            {info.nfeStatus === 'autorizado' && (
                                <>
                                    <Dropdown overlay={() => (
                                        <Menu>
                                            <Menu.Item key="1" onClick={() => this.handleDocuments(info.nfeDanfeUrl, info.nfeXmlUrl, info.number)}>
                                                <Icon type="file-text" style={{ marginRight: 5 }} />
                                                    Documentos da NFE
                                            </Menu.Item>
                                            <Menu.Item key="3" onClick={() => this.handleSendEmail(info._id)}>
                                                <Icon type="mail" style={{ marginRight: 5 }} />
                                                    Enviar por Email
                                            </Menu.Item>
                                            <Menu.Divider />
                                            <Menu.Item key="2" onClick={() => this.handleCancelNFE(info._id)}>
                                                <Icon type="close" style={{ marginRight: 5 }} />
                                                Cancelar NFE
                                            </Menu.Item>
                                            <Menu.Divider />
                                            <Menu.Item key="4" onClick={() => this.handleDevolveRasc(info._id)} disabled={!info.devolve ? false : true}>
                                                <Icon type="import" style={{ marginRight: 5 }} />
                                                Gerar Rascunho de Devolução
                                            </Menu.Item>
                                            <Menu.Item key="5" onClick={() => this.emitDevolveNFE(info._id)} disabled={info.devolve ? false : true}>
                                                <Icon type="cloud-upload" style={{ marginRight: 5 }} />
                                                Emitir NFE de Devolução
                                            </Menu.Item>
                                            <Menu.Item key="6" onClick={() => this.handleDocuments(info.nfeDanfeUrl, info.nfeXmlUrl, info.number)} disabled={info.devolve ? false : true}>
                                                <Icon type="file-text" style={{ marginRight: 5 }} />
                                                Documentos da NFE de Devolução
                                            </Menu.Item>
                                            <Menu.Divider />
                                            <Menu.Item key="7" onClick={() => this.handleCartaCorrect(info._id)} disabled={!info.correct ? false : true}>
                                                <Icon type="edit" style={{ marginRight: 5 }} />
                                                Carta de Correção
                                            </Menu.Item>
                                            <Menu.Item key="0" onClick={() => this.handleDocuments(info.pdfCartaCorrect, info.xmlCartaCorrect, info.number)} disabled={info.correct ? false : true}>
                                                <Icon type="file-text" style={{ marginRight: 5 }} />
                                                Documentos de Correção
                                            </Menu.Item>
                                        </Menu>
                                    )} trigger={['click']} placement='bottomRight'>
                                        <Button icon='setting' size='small' style={{ width: '100%' }}>Opções da NFE</Button>
                                    </Dropdown>
                                </>
                            )}
                            {info.nfeStatus === 'processando_autorizacao' && (
                                <Button size='small' icon='search' type='default' onClick={() => this.findRasc(info._id)} style={{ width: '100%' }}>Vizualizar Rascunho</Button>
                            )}
                            {info.nfeStatus === 'erro_autorizacao' && (
                                <Dropdown overlay={() => (
                                    <Menu>
                                        <Menu.Item key="1" onClick={() => this.findRasc(info._id)}>
                                            <Icon type="search" style={{ marginRight: 5 }} />
                                                Visualizar Rascunho
                                        </Menu.Item>
                                        <Menu.Item key="2" onClick={() => this.handleDelRascNFE(info._id)}>
                                            <Icon type="close" style={{ marginRight: 5 }} />
                                                Excluir Rascunho
                                        </Menu.Item>
                                    </Menu>
                                )} trigger={['click']} placement='bottomRight'>
                                    <Button icon='setting' size='small' style={{ width: '100%' }}>Opções da NFE</Button>
                                </Dropdown>
                            )}
                            {info.nfeStatus === 'denegado' && (
                                <Button size='small' icon='search' type='default' onClick={() => this.findRasc(info._id)} style={{ width: '100%' }}>Vizualizar Rascunho</Button>
                            )}
                            {info.nfeStatus === 'cancelado' && (
                                <Button size='small' icon='file-text' type='default' onClick={() => this.handleDownloadXmlCancel(info.nfeXmlUrl, info.number)} style={{ width: '100%' }}>Documentos de Cancelamento</Button>
                            )}
                        </div>
                    )
                    }
                </>
            }
        ];

        const products = [
            {
                title: 'Ações',
                dataIndex: '_id',
                key: '_id',
                render: (id) => <>
                    <Tooltip placement='top' title='Editar'>
                        <Button shape="circle" icon="edit" type='primary' size='small' onClick={() => this.handleEditProduct(id)} style={{ marginRight: 5 }} />
                    </Tooltip>
                    <Tooltip placement='right' title='Adicionar todo o desconto a este produto'>
                        <Button shape="circle" icon="percentage" type='default' size='small' onClick={() => this.setAllDescToProduct(id)} />
                    </Tooltip>
                </>,
                width: '7%',
                align: 'center'
            },
            {
                title: 'Nº',
                dataIndex: 'numero_item',
                key: 'numero_item',
                width: '4%',
                align: 'center'
            },
            {
                title: 'QTD.',
                dataIndex: 'quantidade_comercial',
                key: 'quantidade_comercial',
                width: '5%',
                align: 'center'
            },
            {
                title: 'UNI.',
                dataIndex: 'unidade_comercial',
                key: 'unidade_comercial',
                width: '5%',
                align: 'center'
            },
            {
                title: 'Descrição',
                dataIndex: 'descricao',
                key: 'descricao',
                width: '40%'
            },
            {
                title: 'CFOP',
                dataIndex: 'cfop',
                key: 'cfop',
                width: '10%',
                align: 'center'
            },
            {
                title: 'NCM',
                dataIndex: 'codigo_ncm',
                key: 'codigo_ncm',
                width: '10%',
                align: 'center'
            },
            {
                title: 'ICMS ORIGEM',
                dataIndex: 'icms_origem',
                key: 'icms_origem',
                width: '10%',
                align: 'center'
            },
            {
                title: 'ICMS CST/CSOSN',
                dataIndex: 'icms_situacao_tributaria',
                key: 'icms_situacao_tributaria',
                width: '10%',
                align: 'center'
            },
            {
                title: '% ICMS',
                dataIndex: 'icms_aliquota',
                key: 'icms_aliquota',
                width: '6%',
                align: 'center'
            },
            {
                title: '% ICMS ST',
                dataIndex: 'icms_aliquota_st',
                key: 'icms_aliquota_st',
                width: '8%',
                align: 'center'
            },
            {
                title: '% ICMS ST MVA',
                dataIndex: 'icms_margem_valor_adicionado_st',
                key: 'icms_margem_valor_adicionado_st',
                width: '10%',
                align: 'center'
            },
            {
                title: '% FCP',
                dataIndex: 'fcp_percentual',
                key: 'fcp_percentual',
                width: '6%',
                align: 'center'
            },
            {
                title: '% FCP ST',
                dataIndex: 'fcp_percentual_st',
                key: 'fcp_percentual_st',
                width: '6%',
                align: 'center'
            },
            {
                title: '% FCP ST Ret.',
                dataIndex: 'fcp_percentual_retido_st',
                key: 'fcp_percentual_retido_st',
                width: '9%',
                align: 'center'
            },
            {
                title: 'ICMS ST Mod. B.C',
                dataIndex: 'icms_modalidade_base_calculo_st',
                key: 'icms_modalidade_base_calculo_st',
                render: (value) => <>
                    {value === '0' && (<span>Preço tabelado ou máximo sugerido</span>)}
                    {value === '1' && (<span>Lista Negativa (valor)</span>)}
                    {value === '2' && (<span>Lista Positiva (valor)</span>)}
                    {value === '3' && (<span>Lista Neutra (valor)</span>)}
                    {value === '4' && (<span>Margem Valor Agregado (%)</span>)}
                    {value === '5' && (<span>Pauta (valor)</span>)}
                </>
                ,
                width: '15%',
                align: 'center'
            },
            {
                title: '% PIS',
                dataIndex: 'pis_aliquota_porcentual',
                key: 'pis_aliquota_porcentual',
                width: '7%',
                align: 'center'
            },
            {
                title: 'PIS CST',
                dataIndex: 'pis_situacao_tributaria',
                key: 'pis_situacao_tributaria',
                width: '7%',
                align: 'center'
            },
            {
                title: '% COFINS',
                dataIndex: 'cofins_aliquota_porcentual',
                key: 'cofins_aliquota_porcentual',
                width: '10%',
                align: 'center'
            },
            {
                title: 'COFINS CST',
                dataIndex: 'cofins_situacao_tributaria',
                key: 'cofins_situacao_tributaria',
                width: '10%',
                align: 'center'
            },
            {
                title: 'IPI CST',
                dataIndex: 'ipi_situacao_tributaria',
                key: 'ipi_situacao_tributaria',
                width: '7%',
                align: 'center'
            },
            {
                title: '% IPI',
                dataIndex: 'ipi_aliquota',
                key: 'ipi_aliquota',
                width: '7%',
                align: 'center'
            },
            {
                title: 'IPI Cod.',
                dataIndex: 'ipi_codigo_enquadramento_legal',
                key: 'ipi_codigo_enquadramento_legal',
                width: '7%',
                align: 'center'
            },
            {
                title: 'V.Unit',
                dataIndex: 'valor_unitario_comercial',
                key: 'valor_unitario_comercial',
                width: '10%',
                align: 'right',
                render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15.5 }} precision={2} prefix='R$' />
            },
            {
                title: 'V.Total',
                dataIndex: 'valor_bruto',
                key: 'valor_bruto',
                width: '10%',
                align: 'right',
                render: (value) => <Statistic value={value} valueStyle={{ fontSize: 15.5 }} precision={2} prefix='R$' />
            }
        ];

        return (
            <>
                <div style={{ marginTop: 10, width: '80%', position: 'absolute', right: 0, top: -10, zIndex: 200 }}>

                    <div style={{ marginBottom: 10, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                        {this.state.typeAdvandcedFind === 1 && (
                            <p style={{ marginBottom: -3, marginTop: -1 }}><strong>Vendas:</strong> Mês Atual</p>
                        )}
                        {this.state.typeAdvandcedFind === 2 && (
                            <p style={{ marginBottom: -3, marginTop: -1 }}><strong>Vendas, Cliente:</strong> {this.state.clientName}</p>
                        )}
                        {this.state.typeAdvandcedFind === 3 && (
                            <p style={{ marginBottom: -3, marginTop: -1 }}><strong>Vendas, Período:</strong> {this.state.mes} de {this.state.ano}</p>
                        )}
                        {this.state.typeAdvandcedFind === 4 && (
                            <p style={{ marginBottom: -3, marginTop: -1 }}><strong>Vendas, Número:</strong> {this.state.numberSale}</p>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'row', marginLeft: 10 }}>

                            <Button icon='close' type='default' onClick={() => this.handleInutil()} style={{ marginRight: 5, backgroundColor: '#1a1a1a', color: '#fff' }}>Inutilizar NFE</Button>

                            <Button icon='search' type='primary' onClick={() => this.setState({ modalAdvancedFind: true })}>Busca Avançada</Button>

                        </div>

                    </div>

                </div>

                <Spin spinning={this.state.spinner} size='large'>

                    <Table columns={columns} dataSource={this.state.sales} size='small' rowKey={(sales) => sales._id} rowClassName={(record) => record.devolve ? 'red-row' : ''} />

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 10 }}>
                        <div style={{ width: 20, height: 20, backgroundColor: '#ffebee', border: '1px solid lightgray' }} />
                        <label style={{ marginLeft: 10 }}>Venda com NFE de devolução emitida</label>
                    </div>

                </Spin>

                <Modal
                    title="Busca Avançada"
                    visible={this.state.modalAdvancedFind}
                    onCancel={() => this.setState({ modalAdvancedFind: false })}
                    footer={[
                        <Button key="back" icon='close' type='danger' onClick={() => this.setState({ modalAdvancedFind: false })}>
                            Cancelar
                        </Button>,
                        <Button key="submit" icon='search' type="primary" loading={this.state.loading} onClick={() => { this.sendAdvancedFind() }}>
                            Buscar
                        </Button>,
                    ]}
                    width='40%'
                >

                    <Radio.Group onChange={(event) => { this.setState({ typeAdvandcedFind: event.target.value }) }} value={this.state.typeAdvandcedFind}>
                        <Radio value={1}>Mês Atual</Radio>
                        <Radio value={2}>Por Cliente</Radio>
                        <Radio value={3}>Por Período</Radio>
                        <Radio value={4}>Por Número</Radio>
                    </Radio.Group>

                    {this.state.typeAdvandcedFind === 3 && (
                        <>
                            <Divider>Selecione o Período</Divider>

                            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                                <Select value={this.state.mes} style={{ width: 150, marginRight: 10 }} onChange={(value) => this.setState({ mes: value })}>
                                    <Option value='Janeiro'>Janeiro</Option>
                                    <Option value='Fevereiro'>Fevereiro</Option>
                                    <Option value='Março'>Março</Option>
                                    <Option value='Abril'>Abril</Option>
                                    <Option value='Maio'>Maio</Option>
                                    <Option value='Junho'>Junho</Option>
                                    <Option value='Julho'>Julho</Option>
                                    <Option value='Agosto'>Agosto</Option>
                                    <Option value='Setembro'>Setembro</Option>
                                    <Option value='Outubro'>Outubro</Option>
                                    <Option value='Novembro'>Novembro</Option>
                                    <Option value='Dezembro'>Dezembro</Option>
                                </Select>

                                <Select value={this.state.ano} style={{ width: 100 }} onChange={(value) => this.setState({ ano: value })}>
                                    <Option value={Ano - 1}>{Ano - 1}</Option>
                                    <Option value={Ano}>{Ano}</Option>
                                    <Option value={Ano + 1}>{Ano + 1}</Option>
                                    <Option value={Ano + 2}>{Ano + 2}</Option>
                                    <Option value={Ano + 3}>{Ano + 3}</Option>
                                </Select>

                            </div>
                        </>
                    )}

                    {this.state.typeAdvandcedFind === 2 && (
                        <>
                            <Divider>Selecione o Cliente</Divider>
                            <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="Selecione o Cliente"
                                treeDefaultExpandAll
                                value={this.state.clientName}
                                onChange={(value) => this.handleClient(value)}
                            >
                                {this.state.clients.map(client => (
                                    <TreeNode value={client.name} title={client.name} key={client._id} />
                                ))}
                            </TreeSelect>
                        </>
                    )}

                    {this.state.typeAdvandcedFind === 4 && (
                        <>
                            <Divider>Digite o Número da Venda / Ordem de Serviço</Divider>
                            <Input value={this.state.numberSale} onChange={(e) => this.setState({ numberSale: e.target.value })} />
                        </>
                    )}

                </Modal>

                <Modal
                    visible={this.state.modalConfigRasc}
                    title="Configurações da NFE"
                    onCancel={() => this.setState({ modalConfigRasc: false })}
                    footer={[
                        <Button key="back" icon='close' type='danger' onClick={() => this.setState({ modalConfigRasc: false })}>
                            Cancelar
                        </Button>,
                        <Button key="submit" icon='save' type="primary" loading={this.state.loadingSendRasc} onClick={() => this.generateRascSale()}>
                            Salvar Rascunho
                        </Button>,
                    ]}
                    width='80%'
                >
                    <Divider style={{ fontSize: 15, fontWeight: 'bold', marginTop: 1, marginBottom: 1 }}>TRIBUTAÇÃO</Divider>
                    <Row gutter={10}>
                        <Col span={8}>
                            <label>IMCS CSOSN - Usar novo valor? <Switch checked={this.state.icmsCstAct} onChange={(value) => this.setState({ icmsCstAct: value })} checkedChildren={<Icon type="check" />}
                                unCheckedChildren={<Icon type="close" />} /></label>
                            <Select value={this.state.icmsCstValue} style={{ width: '100%' }} onChange={(value) => this.setState({ icmsCstValue: value })} disabled={!this.state.icmsCstAct}>
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
                        </Col>

                        <Col span={8}>
                            <label>PIS CST - Usar novo valor? <Switch checked={this.state.pisCstAct} onChange={(value) => this.setState({ pisCstAct: value })} checkedChildren={<Icon type="check" />}
                                unCheckedChildren={<Icon type="close" />} /></label>
                            <Select value={this.state.pisCstValue} style={{ width: '100%' }} onChange={(value) => this.setState({ pisCstValue: value })} disabled={!this.state.pisCstAct}>
                                {this.state.pisCst.map(list => (
                                    <Option value={list.code} key={list.code}>{list.desc}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={8}>
                            <label>COFINS CST - Usar novo valor? <Switch checked={this.state.cofinsCstAct} onChange={(value) => this.setState({ cofinsCstAct: value })} checkedChildren={<Icon type="check" />}
                                unCheckedChildren={<Icon type="close" />} /></label>
                            <Select value={this.state.cofinsCstValue} style={{ width: '100%' }} onChange={(value) => this.setState({ cofinsCstValue: value })} disabled={!this.state.cofinsCstAct}>
                                {this.state.pisCst.map(list => (
                                    <Option value={list.code} key={list.code}>{list.desc}</Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>

                    <Divider style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 1 }}>CONFIGURAÇÕES GERAIS</Divider>

                    <Row gutter={10} style={{ marginBottom: 7 }}>
                        <Col span={8}>
                            <Row>
                                <Col span={16} style={{ paddingRight: 2.5 }}>
                                    <label>CFOP - Usar novo valor? <Switch checked={this.state.cfopAct} onChange={(value) => this.setState({ cfopAct: value })} checkedChildren={<Icon type="check" />}
                                        unCheckedChildren={<Icon type="close" />} /></label>
                                    <Input value={this.state.cfopValue} onChange={(e) => this.setState({ cfopValue: e.target.value })} disabled={!this.state.cfopAct} />
                                </Col>
                                <Col span={8} style={{ paddingLeft: 2.5 }}>
                                    <label>Tipo Operação</label>
                                    <Select value={this.state.typeCfop} style={{ width: '100%' }} onChange={(value) => this.setState({ typeCfop: value })}>
                                        <Option value={"interno"}>Estadual</Option>
                                        <Option value={"externo"}>Interestadual</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <label>Modalidade Frete</label>
                            <Select value={this.state.freteModality} style={{ width: '100%' }} onChange={(value) => this.setState({ freteModality: value })}>
                                <Option value={"0"}>Por conta do Emitente</Option>
                                <Option value={"1"}>Por conta do Destinatário</Option>
                                <Option value={"2"}>Por conta de Terceiros</Option>
                                <Option value={"9"}>Sem Frete</Option>
                            </Select>
                        </Col>
                        <Col span={8}>
                            <label>Valor do Frete</label>
                            <Input value={this.state.freteValue} onChange={(e) => this.setState({ freteValue: e.target.value })} />
                        </Col>
                    </Row>

                    <Row gutter={10} style={{ marginBottom: 7 }}>
                        <Col span={12}>
                            <label>Natureza da Operação</label>
                            <Select value={this.state.natOpe} style={{ width: '100%' }} onChange={(value) => this.setState({ natOpe: value })}>
                                <Option value={"VENDA AO CONSUMIDOR"}>Venda ao Consumidor</Option>
                                <Option value={"COMPRA DE PRODUTOS"}>Compra de Produtos</Option>
                                <Option value={"DEVOLUÇÃO DE MERCADORIA"}>Devolução de Mercadoria</Option>
                                <Option value={"REMESSA"}>Remessa</Option>
                                <Option value={"IMPORTAÇÃO"}>Importação</Option>
                                <Option value={"EXPORTAÇÃO"}>Exportação</Option>
                                <Option value={"INDUSTRIALIZAÇÃO"}>Industrialização</Option>
                                <Option value={"RETORNO"}>Retorno</Option>
                            </Select>
                        </Col>
                        <Col span={6}>
                            <label>Tipo de Documento</label>
                            <Select value={this.state.typeDocument} style={{ width: '100%' }} onChange={(value) => this.setState({ typeDocument: value })}>
                                <Option value={"0"}>Nota Fiscal de Entrada</Option>
                                <Option value={"1"}>Nota Fiscal de Saída</Option>
                            </Select>
                        </Col>
                        <Col span={6}>
                            <label>Finalidade do Documento</label>
                            <Select value={this.state.documentFinality} style={{ width: '100%' }} onChange={(value) => this.setState({ documentFinality: value })}>
                                <Option value={"1"}>Normal</Option>
                                <Option value={"2"}>Complementar</Option>
                                <Option value={"3"}>Nota de Ajuste</Option>
                                <Option value={"4"}>Devolução</Option>
                            </Select>
                        </Col>
                    </Row>

                    <Row gutter={10}>
                        <Col span={24}>
                            <label>Informações Adicionais</label>
                            <TextArea rows={4} value={this.state.infoAdd} onChange={(e) => this.setState({ infoAdd: e.target.value.toUpperCase() })} />
                        </Col>
                    </Row>

                    <label style={{ color: 'red' }}>Se optar por não usar um novo valor a NFE será emitida com os valores cadastrado nos produtos</label>

                </Modal>

                <Modal
                    visible={this.state.modalCorrectNfe}
                    title="Rascunho NFE de Devolução"
                    onCancel={() => this.setState({ modalCorrectNfe: false })}
                    footer={[
                        <Button key="back" icon='close' type='danger' onClick={() => this.setState({ modalCorrectNfe: false })}>
                            Cancelar
                        </Button>,
                        <Button key="submit" icon='save' type="primary" loading={this.state.loadingSendRasc} onClick={() => this.sendRascDevolve()}>
                            Salvar Rascunho
                        </Button>,
                    ]}
                    width='90%'
                    bodyStyle={{ padding: 15, height: '78vh', overflow: 'auto' }}
                    centered
                >

                    <Row gutter={10} style={{ marginBottom: 7 }}>
                        <Col span={6}>
                            <Row>
                                <Col span={16} style={{ paddingRight: 2.5 }}>
                                    <label>CFOP</label>
                                    <Input value={this.state.cfopValue} onChange={(e) => this.setState({ cfopValue: e.target.value })} />
                                </Col>
                                <Col span={8} style={{ paddingLeft: 2.5 }}>
                                    <label>Tipo Operação</label>
                                    <Select value={this.state.typeCfop} style={{ width: '100%' }} onChange={(value) => this.setState({ typeCfop: value })}>
                                        <Option value={"interno"}>Estadual</Option>
                                        <Option value={"externo"}>Interestadual</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={6}>
                            <label>Tipo de Documento</label>
                            <Select value={this.state.typeDocument} style={{ width: '100%' }} onChange={(value) => this.setState({ typeDocument: value })}>
                                <Option value={"0"}>Nota Fiscal de Entrada</Option>
                                <Option value={"1"}>Nota Fiscal de Saída</Option>
                            </Select>
                        </Col>
                        <Col span={6}>
                            <label>Finalidade do Documento</label>
                            <Select value={this.state.documentFinality} style={{ width: '100%' }} onChange={(value) => this.setState({ documentFinality: value })}>
                                <Option value={"1"}>Normal</Option>
                                <Option value={"2"}>Complementar</Option>
                                <Option value={"3"}>Nota de Ajuste</Option>
                                <Option value={"4"}>Devolução</Option>
                            </Select>
                        </Col>
                        <Col span={6}>
                            <label>IMCS CSOSN - Usar novo valor? <Switch checked={this.state.icmsCstAct} onChange={(value) => this.setState({ icmsCstAct: value })} checkedChildren={<Icon type="check" />}
                                unCheckedChildren={<Icon type="close" />} /></label>
                            <Select value={this.state.icmsCstValue} style={{ width: '100%' }} onChange={(value) => this.setState({ icmsCstValue: value })} disabled={!this.state.icmsCstAct}>
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
                        </Col>
                    </Row>

                    <Row gutter={10} style={{ marginBottom: 7 }}>
                        <Col span={12}>
                            <label>Natureza da Operação</label>
                            <Select value={this.state.natOpe} style={{ width: '100%' }} onChange={(value) => this.setState({ natOpe: value })}>
                                <Option value={"VENDA AO CONSUMIDOR"}>Venda ao Consumidor</Option>
                                <Option value={"COMPRA DE PRODUTOS"}>Compra de Produtos</Option>
                                <Option value={"DEVOLUÇÃO DE MERCADORIA"}>Devolução de Mercadoria</Option>
                                <Option value={"REMESSA"}>Remessa</Option>
                                <Option value={"IMPORTAÇÃO"}>Importação</Option>
                                <Option value={"EXPORTAÇÃO"}>Exportação</Option>
                                <Option value={"INDUSTRIALIZAÇÃO"}>Industrialização</Option>
                                <Option value={"RETORNO"}>Retorno</Option>
                            </Select>
                        </Col>
                        <Col span={12}>
                            <label>Chave da NFE</label>
                            <Input value={this.state.nfeKey} onChange={(e) => this.setState({ nfeKey: e.target.value })} />
                        </Col>
                    </Row>

                    <Row gutter={10}>
                        <Col span={24}>
                            <label>Informações Adicionais</label>
                            <TextArea rows={4} value={this.state.infoAdd} onChange={(e) => this.setState({ infoAdd: e.target.value.toUpperCase() })} />
                        </Col>
                    </Row>

                </Modal>

                <Modal
                    visible={this.state.modalVerify}
                    closable={false}
                    title={false}
                    footer={false}
                    centered
                >

                    <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

                        <Icon type='loading' style={{ fontSize: 80 }} />

                        <p style={{ marginTop: 30, fontSize: 25, fontWeight: 'bold', marginBottom: -10 }}>Consultando status da NFE...</p>

                    </div>

                </Modal>

                <Modal
                    visible={this.state.modalEmit}
                    closable={false}
                    title={false}
                    footer={false}
                    centered
                >

                    <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

                        <Icon type='loading' style={{ fontSize: 80 }} />

                        <p style={{ marginTop: 30, fontSize: 25, fontWeight: 'bold', marginBottom: -10 }}>Emitindo a NFE, aguarde!</p>

                    </div>

                </Modal>

                <Modal
                    visible={this.state.modalCancel}
                    closable={false}
                    title={false}
                    footer={false}
                    centered
                >

                    <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

                        <Icon type='loading' style={{ fontSize: 80 }} />

                        <p style={{ marginTop: 30, fontSize: 25, fontWeight: 'bold', marginBottom: -10 }}>Cancelando a NFE, aguarde!</p>

                    </div>

                </Modal>

                <Modal
                    visible={this.state.modalJustify}
                    title="Justificativa de Cancelamento da NFE"
                    onCancel={() => this.setState({ modalJustify: false })}
                    footer={[
                        <Button key="back" icon='close' type='danger' onClick={() => this.setState({ modalJustify: false })}>
                            Cancelar
                        </Button>,
                        <Button key="submit" icon='rocket' type="primary" onClick={() => this.cancleNFE()}>
                            Enviar Cancelamento
                        </Button>,
                    ]}
                    width='80%'
                >

                    <TextArea rows={4} value={this.state.justify} onChange={(e) => this.setState({ justify: e.target.value.toUpperCase() })} />

                </Modal>

                <Modal
                    visible={this.state.modalInutil}
                    title="Inutilização da NFE"
                    onCancel={() => this.setState({ modalInutil: false })}
                    footer={[
                        <Button key="back" icon='close' type='danger' onClick={() => this.setState({ modalInutil: false })}>
                            Cancelar
                        </Button>,
                        <Button key="submit" loading={this.state.loadingSendRasc} icon='rocket' type="primary" onClick={() => this.sendInutil()}>
                            Enviar
                        </Button>,
                    ]}
                    width='80%'
                >

                    <Row gutter={10} style={{ marginBottom: 7 }}>
                        <Col span={8}>
                            <label>Série</label>
                            <Input value={this.state.serie} onChange={(e) => this.setState({ serie: e.target.value })} />
                        </Col>
                        <Col span={8}>
                            <label>Número Inicial</label>
                            <Input value={this.state.numero_inicial} onChange={(e) => this.setState({ numero_inicial: e.target.value })} />
                        </Col>
                        <Col span={8}>
                            <label>Número Final</label>
                            <Input value={this.state.numero_final} onChange={(e) => this.setState({ numero_final: e.target.value })} />
                        </Col>
                    </Row>

                    <Row gutter={10}>
                        <Col span={24}>
                            <label>Justificativa</label>
                            <TextArea rows={4} value={this.state.justify} onChange={(e) => this.setState({ justify: e.target.value.toUpperCase() })} />
                        </Col>
                    </Row>

                </Modal>

                <Modal
                    visible={this.state.modalEmail}
                    title="Enviar NFE por Email"
                    onCancel={() => this.setState({ modalEmail: false })}
                    footer={[
                        <Button key="back" icon='close' type='danger' onClick={() => this.setState({ modalEmail: false })}>
                            Cancelar
                        </Button>,
                        <Button key="submit" icon='rocket' type="primary" loading={this.state.loadingSendRasc} onClick={() => this.sendEmail()}>
                            Enviar Email
                        </Button>,
                    ]}
                    width='40%'
                >
                    <label>Email</label>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <Input value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} />
                        <Button icon='plus' type='primary' style={{ marginLeft: 10 }} onClick={() => this.handleEmail()}>Adicionar</Button>
                    </div>

                    {!!this.state.emails.length && (
                        <>
                            <Divider>Emails</Divider>
                            {this.state.emails.map(ema => (
                                <p key={ema}>{ema}</p>
                            ))}
                        </>
                    )}

                </Modal>

                <Modal
                    visible={this.state.modalCorrect}
                    title="Carta de Correção da NFE"
                    onCancel={() => this.setState({ modalCorrect: false })}
                    footer={[
                        <Button key="back" icon='close' type='danger' onClick={() => this.setState({ modalCorrect: false })}>
                            Cancelar
                        </Button>,
                        <Button key="submit" icon='rocket' type="primary" loading={this.state.loadingSendRasc} onClick={() => this.sendCorrectNFE()}>
                            Enviar Correção
                        </Button>,
                    ]}
                    width='80%'
                >

                    <TextArea rows={4} value={this.state.correcao} onChange={(e) => this.setState({ correcao: e.target.value })} />

                </Modal>

                <Modal
                    visible={this.state.modalDelRasc}
                    title="Excluir Rascunho da NFE"
                    onCancel={() => this.setState({ modalDelRasc: false })}
                    footer={[
                        <Button key="back" icon='close' type='danger' onClick={() => this.setState({ modalDelRasc: false })}>
                            Não
                        </Button>,
                        <Button key="submit" icon='check' type="primary" loading={this.state.loadingSendRasc} onClick={() => this.delRascNFE()}>
                            Sim
                        </Button>,
                    ]}
                    width='45%'
                >

                    <p>Tem certeza que deseja excluir o rascunho da NFE?</p>

                </Modal>

                <Modal
                    visible={this.state.modalRasc}
                    title="Rascunho da NFE"
                    onCancel={() => this.setState({ modalRasc: false })}
                    footer={[
                        <Input key="brut" type='number' addonBefore='Bruto' addonAfter='R$' style={{ width: 250, marginRight: 5 }} value={this.replaceValue(this.state.valueBruto)} readOnly />,
                        <Input key="liquid" type='number' addonBefore='Líquido' addonAfter='R$' style={{ width: 280, marginRight: 5 }} value={this.replaceValue(this.state.valueLiquid)} readOnly />,
                        <Input key="desc" type='number' addonBefore='Desconto' addonAfter='R$' style={{ width: 280, marginRight: 10 }} value={this.state.valueDesconto} readOnly />,
                        <Button key="submit" icon='save' type="primary" onClick={() => this.handleEmitNFE()}>
                            Salva e Emitir NFE
                        </Button>,
                    ]}
                    width='90%'
                    centered
                    bodyStyle={{ overflow: 'auto', height: '81vh', overflowX: 'hidden', padding: 13 }}
                >

                    <Tabs defaultActiveKey="1" type='card'>
                        <TabPane tab={
                            <span>
                                Emitente
                            </span>
                        } key="1">
                            <Row gutter={10} style={{ marginBottom: 7 }}>
                                <Col span={16}>
                                    <label>Nome / Razão Social</label>
                                    <Input value={this.state.nome_emitente} onChange={(e) => this.setState({ nome_emitente: e.target.value.toUpperCase() })} />
                                </Col>
                                <Col span={8}>
                                    <label>Nome Fantasia</label>
                                    <Input value={this.state.nome_fantasia_emitente} onChange={(e) => this.setState({ nome_fantasia_emitente: e.target.value.toUpperCase() })} />
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col span={8}>
                                    <label>CNPJ</label>
                                    <Input value={this.state.cnpj_emitente} onChange={(e) => this.setState({ cnpj_emitente: e.target.value.toUpperCase() })} disabled={this.state.cnpj_emitente ? false : true} />
                                </Col>
                                <Col span={8}>
                                    <label>CPF</label>
                                    <Input value={this.state.cpf_emitente} onChange={(e) => this.setState({ cpf_emitente: e.target.value.toUpperCase() })} disabled={this.state.cpf_emitente ? false : true} />
                                </Col>
                                <Col span={8}>
                                    <label>Inscrição Estadual</label>
                                    <Input value={this.state.inscricao_estadual_emitente} onChange={(e) => this.setState({ inscricao_estadual_emitente: e.target.value.toUpperCase() })} />
                                </Col>
                            </Row>
                            <Divider style={{ fontWeight: 'bold' }}>ENDEREÇO</Divider>
                            <Row gutter={10} style={{ marginBottom: 7 }}>
                                <Col span={20}>
                                    <label>Logradouro</label>
                                    <Input value={this.state.logradouro_emitente} onChange={(e) => this.setState({ logradouro_emitente: e.target.value.toUpperCase() })} />
                                </Col>
                                <Col span={4}>
                                    <label>Número</label>
                                    <Input value={this.state.numero_emitente} onChange={(e) => this.setState({ numero_emitente: e.target.value.toUpperCase() })} />
                                </Col>
                            </Row>
                            <Row gutter={10} style={{ marginBottom: 7 }}>
                                <Col span={6}>
                                    <label>Bairro</label>
                                    <Input value={this.state.bairro_emitente} onChange={(e) => this.setState({ bairro_emitente: e.target.value.toUpperCase() })} />
                                </Col>
                                <Col span={8}>
                                    <label>Município</label>
                                    <Input value={this.state.municipio_emitente} onChange={(e) => this.setState({ municipio_emitente: e.target.value.toUpperCase() })} />
                                </Col>
                                <Col span={4}>
                                    <label>Estado</label>
                                    <Input value={this.state.uf_emitente} onChange={(e) => this.setState({ uf_emitente: e.target.value.toUpperCase() })} />
                                </Col>
                                <Col span={6}>
                                    <label>CEP</label>
                                    <Input value={this.state.cep_emitente} onChange={(e) => this.setState({ cep_emitente: e.target.value.toUpperCase() })} />
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab={
                            <span>
                                Destinatário
                            </span>
                        } key="2">
                            <Row gutter={10} style={{ marginBottom: 7 }}>
                                <Col span={16}>
                                    <label>Nome / Razão Social</label>
                                    <Input value={this.state.nome_destinatario} onChange={(e) => this.setState({ nome_destinatario: e.target.value.toUpperCase() })} />
                                </Col>
                                <Col span={8}>
                                    <label>Nome Fantasia</label>
                                    <Input value={this.state.nome_fantasia_destinatario} onChange={(e) => this.setState({ nome_fantasia_destinatario: e.target.value.toUpperCase() })} />
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col span={6}>
                                    <label>CNPJ</label>
                                    <Input value={this.state.cnpj_destinatario} onChange={(e) => this.setState({ cnpj_destinatario: e.target.value.toUpperCase() })} disabled={this.state.cnpj_destinatario ? false : true} />
                                </Col>
                                <Col span={6}>
                                    <label>CPF</label>
                                    <Input value={this.state.cpf_destinatario} onChange={(e) => this.setState({ cpf_destinatario: e.target.value.toUpperCase() })} disabled={this.state.cpf_destinatario ? false : true} />
                                </Col>
                                <Col span={6}>
                                    <label>Inscrição Estadual</label>
                                    <Input value={this.state.inscricao_estadual_destinatario} onChange={(e) => this.setState({ inscricao_estadual_destinatario: e.target.value.toUpperCase() })} />
                                </Col>
                                <Col span={6}>
                                    <label>Telefone</label>
                                    <Input value={this.state.telefone_destinatario} onChange={(e) => this.setState({ telefone_destinatario: e.target.value.toUpperCase() })} />
                                </Col>
                            </Row>
                            <Divider style={{ fontWeight: 'bold' }}>ENDEREÇO</Divider>
                            <Row gutter={10} style={{ marginBottom: 7 }}>
                                <Col span={20}>
                                    <label>Logradouro</label>
                                    <Input value={this.state.logradouro_destinatario} onChange={(e) => this.setState({ logradouro_destinatario: e.target.value.toUpperCase() })} />
                                </Col>
                                <Col span={4}>
                                    <label>Número</label>
                                    <Input value={this.state.numero_destinatario} onChange={(e) => this.setState({ numero_destinatario: e.target.value.toUpperCase() })} />
                                </Col>
                            </Row>
                            <Row gutter={10} style={{ marginBottom: 7 }}>
                                <Col span={6}>
                                    <label>Bairro</label>
                                    <Input value={this.state.bairro_destinatario} onChange={(e) => this.setState({ bairro_destinatario: e.target.value.toUpperCase() })} />
                                </Col>
                                <Col span={8}>
                                    <label>Município</label>
                                    <Input value={this.state.municipio_destinatario} onChange={(e) => this.setState({ municipio_destinatario: e.target.value.toUpperCase() })} />
                                </Col>
                                <Col span={4}>
                                    <label>Estado</label>
                                    <Input value={this.state.uf_destinatario} onChange={(e) => this.setState({ uf_destinatario: e.target.value.toUpperCase() })} />
                                </Col>
                                <Col span={6}>
                                    <label>CEP</label>
                                    <Input value={this.state.cep_destinatario} onChange={(e) => this.setState({ cep_destinatario: e.target.value.toUpperCase() })} />
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab={
                            <span>
                                Produtos
                            </span>
                        } key="3">
                            <Table columns={products} dataSource={this.state.items} size='small' rowKey={(prod) => prod._id} scroll={{ x: 3000 }} pagination={{ pageSize: 10 }} />
                        </TabPane>
                        <TabPane tab={
                            <span>
                                Outros
                            </span>
                        } key="4">
                            <Row gutter={10} style={{ marginBottom: 7 }}>
                                <Col span={6}>
                                    <label>Modalidade Frete</label>
                                    <Select value={this.state.modalidade_frete} style={{ width: '100%' }} onChange={(value) => this.setState({ modalidade_frete: value })}>
                                        <Option value={"0"}>Por conta do Emitente</Option>
                                        <Option value={"1"}>Por conta do Destinatário</Option>
                                        <Option value={"2"}>Por conta de Terceiros</Option>
                                        <Option value={"9"}>Sem Frete</Option>
                                    </Select>
                                </Col>
                                <Col span={6}>
                                    <label>Valor do Frete</label>
                                    <Input value={this.state.valor_frete} onChange={(e) => this.setState({ valor_frete: e.target.value })} readOnly />
                                </Col>
                                <Col span={6}>
                                    <label>Tipo de Documento</label>
                                    <Select value={this.state.tipo_documento} style={{ width: '100%' }} onChange={(value) => this.setState({ tipo_documento: value })}>
                                        <Option value={"0"}>Nota Fiscal de Entrada</Option>
                                        <Option value={"1"}>Nota Fiscal de Saída</Option>
                                    </Select>
                                </Col>
                                <Col span={6}>
                                    <label>Finalidade do Documento</label>
                                    <Select value={this.state.finalidade_emissao} style={{ width: '100%' }} onChange={(value) => this.setState({ finalidade_emissao: value })}>
                                        <Option value={"1"}>Normal</Option>
                                        <Option value={"2"}>Complementar</Option>
                                        <Option value={"3"}>Nota de Ajuste</Option>
                                        <Option value={"4"}>Devolução</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row gutter={10} style={{ marginBottom: 7 }}>
                                <Col span={24}>
                                    <label>Informações Adicionais</label>
                                    <TextArea rows={4} value={this.state.informacoes_adicionais_contribuinte} onChange={(e) => this.setState({ informacoes_adicionais_contribuinte: e.target.value.toUpperCase() })} />
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col span={24}>
                                    <label>Notas Referenciadas - Chave da NFE</label>
                                    <Input value={this.state.chave_nfe} onChange={(e) => this.setState({ chave_nfe: e.target.value.toUpperCase() })} />
                                </Col>
                            </Row>
                        </TabPane>
                    </Tabs>

                </Modal>

                <Modal
                    visible={this.state.modalPrint}
                    title="Documentos da NFE"
                    onCancel={() => this.setState({ modalPrint: false })}
                    footer={[
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'flex-end' }} key='div'>
                            {this.state.modeFile === 'pdf' && (
                                <Button key="back" icon='printer' type='default' onClick={() => this.handlePrintPdf()}>
                                    Imprimir
                                </Button>
                            )}
                            <Button key="submit" icon='download' type="primary" onClick={() => this.handleDownloadDocument()}>
                                Baixar
                            </Button>
                        </div>
                    ]}
                    width='30%'
                    centered
                >
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Radio.Group onChange={(e) => this.setState({ modeFile: e.target.value })} value={this.state.modeFile}>
                            <Radio.Button value='pdf' style={{ height: 100 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                                    <img src={PdfFile} style={{ width: 70, height: 70 }} />
                                    DANFE
                            </div>
                            </Radio.Button>
                            <Radio.Button value='xml' style={{ height: 100 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                                    <img src={XmlFile} style={{ width: 70, height: 70 }} />
                                    XML
                            </div>
                            </Radio.Button>
                        </Radio.Group>
                    </div>
                </Modal>

                <Modal
                    visible={this.state.modalEditProduct}
                    title="Editar Produto"
                    onCancel={() => this.setState({ modalEditProduct: false })}
                    footer={[
                        <Button key="submit" icon='save' type="primary" onClick={() => this.updateProduct()}>
                            Atualizar
                        </Button>,
                    ]}
                    width='90%'
                    centered
                >
                    <Row gutter={10} style={{ marginBottom: 7 }}>
                        <Col span={4}>
                            <label>Nº Item</label>
                            <Input value={this.state.numero_item} readOnly />
                        </Col>
                        <Col span={4}>
                            <label>Quantidade</label>
                            <Input value={this.state.quantidade_comercial} readOnly />
                        </Col>
                        <Col span={12}>
                            <label>Descrição</label>
                            <Input value={this.state.descricao} readOnly />
                        </Col>
                        <Col span={4}>
                            <label>Código</label>
                            <Input value={this.state.codigo_produto} readOnly />
                        </Col>
                    </Row>
                    <Row gutter={10} style={{ marginBottom: 7 }}>
                        <Col span={6}>
                            <label>Código Barras</label>
                            <Input value={this.state.codigo_barras_comercial} readOnly />
                        </Col>
                        <Col span={6}>
                            <label>CFOP</label>
                            <Input value={this.state.cfop} onChange={(e) => this.setState({ cfop: e.target.value })} />
                        </Col>
                        <Col span={6}>
                            <label>CEST</label>
                            <Input value={this.state.cest} onChange={(e) => this.setState({ cest: e.target.value })} />
                        </Col>
                        <Col span={6}>
                            <label>NCM</label>
                            <Input value={this.state.codigo_ncm} onChange={(e) => this.setState({ codigo_ncm: e.target.value })} />
                        </Col>
                    </Row>
                    <Row gutter={10} style={{ marginBottom: 7 }}>
                        <Col span={8}>
                            <label>Valor Unitário</label>
                            <Input value={this.replaceValue(this.state.valor_unitario_comercial)} readOnly addonAfter='R$' />
                        </Col>
                        <Col span={8}>
                            <label>Valor Total</label>
                            <Input value={this.replaceValue(this.state.valor_bruto)} readOnly addonAfter='R$' />
                        </Col>
                        <Col span={8}>
                            <label>{`Desconto: Referência = ${this.state.descontoRef}`}</label>
                            <Input value={this.state.valor_desconto} onChange={(e) => this.setState({ valor_desconto: e.target.value })} addonAfter='R$' />
                        </Col>
                    </Row>
                    <Row gutter={10} style={{ marginBottom: 7 }}>
                        <Col span={8}>
                            <label>ICMS Situação Tributária</label>
                            <Select value={this.state.icms_situacao_tributaria} style={{ width: '100%' }} onChange={(value) => this.setState({ icms_situacao_tributaria: value })}>
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
                        </Col>
                        <Col span={8}>
                            <label>ICMS Origem<span style={{ color: 'red' }}>*</span></label>
                            <Select value={this.state.icms_origem} style={{ width: '100%', marginBottom: 10 }} onChange={(value) => this.setState({ icms_origem: value })}>
                                <Option value={"0"}>0 - Nacional</Option>
                                <Option value={"1"}>1 - Estrangeira (importação direta)</Option>
                                <Option value={"2"}>2 - Estrangeira (adquirida no mercado interno)</Option>
                                <Option value={"3"}>3 - Nacional com mais de 40% de conteúdo estrangeiro</Option>
                                <Option value={"4"}>4 - Nacional produzida através de processos produtivos básicos</Option>
                                <Option value={"5"}>5 - Nacional com menos de 40% de conteúdo estrangeiro</Option>
                                <Option value={"6"}>6 - Estrangeira (importação direta) sem produto nacional similar</Option>
                                <Option value={"7"}>7 - Estrangeira (adquirida no mercado interno) sem produto nacional similar</Option>
                                <Option value={"8"}>8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%;</Option>
                            </Select>
                        </Col>
                        <Col span={8}>
                            <label>Alíquota ICMS</label>
                            <Input type='number' value={this.state.icms_aliquota} onChange={(e) => this.setState({ icms_aliquota: e.target.value })} />
                        </Col>
                    </Row>
                    <Row gutter={10} style={{ marginBottom: 7 }}>
                        <Col span={8}>
                            <label>Alíquota ICMS ST</label>
                            <Input type='number' value={this.state.icms_aliquota_st} onChange={(e) => this.setState({ icms_aliquota_st: e.target.value })} />
                        </Col>
                        <Col span={8}>
                            <label>ICMS ST MVA</label>
                            <Input type='number' value={this.state.icms_margem_valor_adicionado_st} onChange={(e) => this.setState({ icms_margem_valor_adicionado_st: e.target.value })} />
                        </Col>
                        <Col span={8}>
                            <label>Modalidade de B.C. da ST</label>
                            <Select value={this.state.icms_modalidade_base_calculo_st} style={{ width: '100%', marginBottom: 10 }} onChange={(value) => this.setState({ icms_modalidade_base_calculo_st: value })}>
                                <Option value={"0"}>Preço tabelado ou máximo sugerido</Option>
                                <Option value={"1"}>Lista Negativa (valor)</Option>
                                <Option value={"2"}>Lista Positiva (valor)</Option>
                                <Option value={"3"}>Lista Neutra (valor)</Option>
                                <Option value={"4"}>Margem Valor Agregado (%)</Option>
                                <Option value={"5"}>Pauta (valor)</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={10} style={{ marginBottom: 7 }}>
                        <Col span={8}>
                            <label>Alíquota FCP</label>
                            <Input type='number' value={this.state.fcp_percentual} onChange={(e) => this.setState({ fcp_percentual: e.target.value })} />
                        </Col>
                        <Col span={8}>
                            <label>Alíquota FCP ST</label>
                            <Input type='number' value={this.state.fcp_percentual_st} onChange={(e) => this.setState({ fcp_percentual_st: e.target.value })} />
                        </Col>
                        <Col span={8}>
                            <label>Alíquota FCP ST Retido</label>
                            <Input type='number' value={this.state.fcp_percentual_retido_st} onChange={(e) => this.setState({ fcp_percentual_retido_st: e.target.value })} />
                        </Col>
                    </Row>
                    <Row gutter={10} style={{ marginBottom: 7 }}>
                        <Col span={12}>
                            <label>IPI CST</label>
                            <Select value={this.state.ipi_situacao_tributaria} style={{ width: '100%' }} onChange={(value) => this.setState({ ipi_situacao_tributaria: value })}>
                                <Option value={""}>Nenhum</Option>
                                <Option value={"00"}>00 – Entrada com Recuperação de Crédito</Option>
                                <Option value={"01"}>01 – Entrada Tributada com Alíquota Zero</Option>
                                <Option value={"02"}>02 – Entrada Isenta</Option>
                                <Option value={"03"}>03 – Entrada Não Tributada</Option>
                                <Option value={"04"}>04 – Entrada Imune</Option>
                                <Option value={"05"}>05 – Entrada com Suspensão</Option>
                                <Option value={"49"}>49 – Outras Entradas</Option>
                                <Option value={"50"}>50 – Saída Tributada</Option>
                                <Option value={"51"}>51 – Saída Tributável com Alíquota Zero</Option>
                                <Option value={"52"}>52 – Saída Isenta</Option>
                                <Option value={"53"}>53 – Saída Não Tributada</Option>
                                <Option value={"54"}>54 – Saída Imune</Option>
                                <Option value={"55"}>55 – Saída com Suspensão</Option>
                                <Option value={"99"}>99 – Outras Saídas</Option>
                            </Select>
                        </Col>
                        <Col span={6}>
                            <label>Alíquota IPI</label>
                            <Input type='number' value={this.state.ipi_aliquota} onChange={(e) => this.setState({ ipi_aliquota: e.target.value })} />
                        </Col>
                        <Col span={6}>
                            <label>IPI Código</label>
                            <Input type='number' value={this.state.ipi_codigo_enquadramento_legal} onChange={(e) => this.setState({ ipi_codigo_enquadramento_legal: e.target.value })} />
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col span={6}>
                            <label>PIS Situação Tributária</label>
                            <Select value={this.state.pis_situacao_tributaria} style={{ width: '100%' }} onChange={(value) => this.setState({ pis_situacao_tributaria: value })}>
                                {this.state.pisCst.map(list => (
                                    <Option value={list.code} key={list.code}>{list.desc}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={6}>
                            <label>Alíquota PIS</label>
                            <Input type='number' value={this.state.pis_aliquota_porcentual} onChange={(e) => this.setState({ pis_aliquota_porcentual: e.target.value })} />
                        </Col>
                        <Col span={6}>
                            <label>COFINS Situação Tributária</label>
                            <Select value={this.state.cofins_situacao_tributaria} style={{ width: '100%' }} onChange={(value) => this.setState({ cofins_situacao_tributaria: value })}>
                                {this.state.pisCst.map(list => (
                                    <Option value={list.code} key={list.code}>{list.desc}</Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={6}>
                            <label>Alíquota COFINS</label>
                            <Input type='number' value={this.state.cofins_aliquota_porcentual} onChange={(e) => this.setState({ cofins_aliquota_porcentual: e.target.value })} />
                        </Col>
                    </Row>
                </Modal>
            </>
        )
    }
}