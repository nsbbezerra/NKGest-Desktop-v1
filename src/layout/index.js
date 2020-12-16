import React, { Component } from "react";
import {
  Layout,
  Icon,
  Modal,
  Input,
  Button,
  Menu,
  Dropdown,
  Avatar,
  Row,
  Col,
  PageHeader,
  Divider,
} from "antd";
import { Link, MemoryRouter, withRouter } from "react-router-dom";
import "./style.css";
import api from "../config/axios";

import Lottie from "react-lottie";
import animationData from "../animations/erro.json";

import Routes from "./routes";
import ImgLogin from "../assets/entrar.svg";
import sgomIcon from "../assets/sgom.png";
import logoNkgest from "../assets/logo.png";

//** IMPORTAÇÃO DOS ÍCONES */

const { Content, Header, Sider } = Layout;
const { SubMenu } = Menu;

class Layouts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      modalConnection: false,
      modalAuth: false,
      stringConnection: "",
      showWarning: false,
      admin: true, //MUDAR PARA true
      caixa: true, //MUDAR PARA true
      sale: true, //MUDAR PARA TRUE
      loading: false,
      user: "",
      pass: "",
      modalSetting: false,
      ip: "",
      port: "",
      nameFunc: "",
      maximized: false,
    };
  }

  erro = (title, message) => {
    Modal.error({
      title: title,
      content: (
        <div>
          <p>{message}</p>
        </div>
      ),
      onOk() {},
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
      onOk() {},
    });
  };

  saveString = async () => {
    await localStorage.setItem("ip", this.state.ip);
    await localStorage.setItem("port", this.state.port);
    this.setState({ showWarning: true });
  };

  updateConnection = async () => {
    await localStorage.setItem("ip", this.state.ip);
    await localStorage.setItem("port", this.state.port);
    this.success(
      "Sucesso",
      "Nova rota de conexão salva com sucesso, reinicie o sistema."
    );
  };

  admin = async () => {
    const ipServ = await localStorage.getItem("ip");
    const portServ = await localStorage.getItem("port");
    if (!ipServ && !portServ) {
      this.setState({ modalConnection: true });
    } else {
      this.setState({ modalAuth: true });
      this.setState({ ip: ipServ });
      this.setState({ port: portServ });
    }
  };

  componentDidMount = () => {
    this.admin();
  };

  logout = async () => {
    await this.setState({ pass: "" });
    await this.setState({ user: "" });
    await this.setState({ nameFunc: "" });
    await sessionStorage.removeItem("name");
    await sessionStorage.removeItem("id");
    await this.props.history.push("/");
    this.setState({ modalAuth: true });
  };

  autheticate = async () => {
    this.setState({ loading: true });
    await api
      .post("/admin/auth", {
        user: this.state.user,
        pass: this.state.pass,
      })
      .then((response) => {
        sessionStorage.setItem("name", response.data.funcionario.name);
        sessionStorage.setItem("id", response.data.funcionario._id);
        this.setState({ nameFunc: response.data.funcionario.name });
        if (response.data.funcionario.admin === true) {
          this.setState({ admin: false });
          this.setState({ sale: false });
          this.setState({ caixa: false });
          this.setState({ modalAuth: false });
        }
        if (response.data.funcionario.sales === true) {
          this.setState({ admin: true });
          this.setState({ sale: false });
          this.setState({ caixa: true });
          this.setState({ modalAuth: false });
        }
        if (response.data.funcionario.caixa === true) {
          this.setState({ admin: true });
          this.setState({ sale: true });
          this.setState({ caixa: false });
          this.setState({ modalAuth: false });
        }
        this.setState({ loading: false });
      })
      .catch((error) => {
        if (error.message === "Network Error") {
          this.erro("Erro", "Sem conexão com o servidor");
          this.setState({ loading: false });
          return false;
        }
        this.setState({ loading: false });
        this.erro("Erro", error.response.data.message);
      });
  };

  render() {
    const menu = (
      <Menu>
        <Menu.Item key="0" title="Configurações do Sistema">
          <Link to="/configSistema">
            <Icon type="desktop" style={{ marginRight: 5 }} />
            Sistema
          </Link>
        </Menu.Item>
        <Menu.Item key="1">
          <Link to="/dadosEmpresa">
            <Icon type="shop" style={{ marginRight: 5 }} />
            Dados da Empresa
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3" onClick={() => this.logout()}>
          <Icon type="logout" style={{ marginRight: 5 }} />
          Sair
        </Menu.Item>
      </Menu>
    );

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };

    return (
      <MemoryRouter>
        <Layout
          style={{
            height: "100vh",
            maxHeight: "100vh",
          }}
        >
          <div
            style={{ boxShadow: "0px 0px 7px rgba(0,0,0,.6)", zIndex: 1000 }}
          >
            <Header
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="cabecalho-app">
                <Avatar src={sgomIcon} size="large" />
                <div>
                  <img
                    src={logoNkgest}
                    alt="logo nkgest"
                    style={{ height: 25, marginLeft: -15, marginBottom: 5 }}
                  />
                </div>
              </div>
              <PageHeader
                style={{ width: "70%" }}
                extra={[
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar size="default" icon="user" />
                      <span
                        style={{
                          color: "#fff",
                          fontWeight: 600,
                          width: "250px",
                        }}
                      >
                        {this.state.nameFunc}
                      </span>
                    </div>
                    <Divider type="vertical" />
                    <Dropdown overlay={menu} placement="bottomCenter">
                      <Button icon="tool" type="primary" />
                    </Dropdown>
                  </div>,
                ]}
              />
            </Header>
          </div>

          <Layout style={{ height: "100%", overflowY: "auto" }}>
            <Sider
              collapsed={this.state.collapse}
              collapsible
              onCollapse={() =>
                this.setState({ collapse: !this.state.collapse })
              }
              style={{
                height: "100%",
                maxHeight: "100%",
                overflowX: "hidden",
                boxShadow: "0px 0px 7px rgba(0,0,0,.6)",
                zIndex: 1000,
              }}
              theme="dark"
            >
              <Menu theme="dark" mode="vertical" inlineCollapsed={true}>
                <SubMenu
                  title={
                    <span className="submenu-title-wrapper">
                      <Icon type="tool" />
                      <span>Administrativo</span>
                    </span>
                  }
                  disabled={this.state.admin}
                >
                  <Menu.ItemGroup title="Pessoas">
                    <Menu.Item key="setting:1">
                      <Link to="/gerenciarFuncionario">
                        <Icon type="idcard" /> Gerenciar Funcionários
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="setting:2">
                      <Link to="/gestaoDeClientes">
                        <Icon type="team" /> Gerenciar Clientes
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="setting:3">
                      <Link to="/gerenciarFornecedor">
                        <Icon type="shopping-cart" /> Gerenciar Fornecedores
                      </Link>
                    </Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.ItemGroup title="Produtos / Serviços">
                    <Menu.Item key="setting:4">
                      <Link to="/gerenciarProdutos">
                        <Icon type="tags" /> Gerenciar Produtos
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="setting:5">
                      <Link to="/gerenciarServicos">
                        <Icon type="tool" /> Gerenciar Serviços
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="setting:6">
                      <Link to="/changeDespach">
                        <Icon type="shopping-cart" /> Alterar Fornecedor
                      </Link>
                    </Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.ItemGroup title="Vendas e Ordens de Serviços">
                    <Menu.Item key="setting:8">
                      <Link to="/gerenciarVendas">
                        <Icon type="shopping" /> Gerenciar Vendas / Ordens
                      </Link>
                    </Menu.Item>
                  </Menu.ItemGroup>
                </SubMenu>
                <SubMenu
                  title={
                    <span className="submenu-title-wrapper">
                      <Icon type="folder-add" />
                      <span>Cadastros</span>
                    </span>
                  }
                  disabled={this.state.admin}
                >
                  <Menu.Item key="setting:9">
                    <Link to="/clients">
                      <Icon type="user" /> Clientes
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="setting:11">
                    <Link to="/locations">
                      <Icon type="environment" /> Endereços
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="setting:12">
                    <Link to="/fornecers">
                      <Icon type="shopping-cart" /> Fornecedores
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="setting:13">
                    <Link to="/products">
                      <Icon type="tags" /> Produtos
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="setting:14">
                    <Link to="/services">
                      <Icon type="tool" /> Serviços
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="setting:15">
                    <Link to="/func">
                      <Icon type="idcard" /> Funcionários
                    </Link>
                  </Menu.Item>
                </SubMenu>

                <SubMenu
                  title={
                    <span className="submenu-title-wrapper">
                      <Icon type="container" />
                      <span>Estoque</span>
                    </span>
                  }
                  disabled={this.state.admin}
                >
                  <Menu.Item key="setting:16">
                    <Link to="/controlStoque">
                      <Icon type="control" /> Ajustar Estoque
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="setting:17">
                    <Link to="/addBuy">
                      <Icon type="plus" /> Adicionar Compra
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="setting:66">
                    <Link to="/xmlImport">
                      <Icon type="file-excel" /> Importar XML
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="setting:19">
                    <Link to="/tags">
                      <Icon type="tags" /> Etiquetas
                    </Link>
                  </Menu.Item>
                </SubMenu>

                <SubMenu
                  title={
                    <span className="submenu-title-wrapper">
                      <Icon type="shopping-cart" />
                      <span>Vendas</span>
                    </span>
                  }
                  disabled={this.state.sale}
                >
                  <Menu.ItemGroup title="Vendas / Ordens">
                    <Menu.Item key="setting:20">
                      <Link to="/balcao">
                        <Icon type="shopping" /> Balcão de Vendas
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="setting:21">
                      <Link to="/ordemDeServico">
                        <Icon type="file-text" /> Ordem de Serviço
                      </Link>
                    </Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.ItemGroup title="Orçamentos Salvos">
                    <Menu.Item key="setting:22">
                      <Link to="/orcamentos">
                        <Icon type="container" /> Vendas
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="setting:23">
                      <Link to="/ordersWait">
                        <Icon type="container" /> Ordens de Serviço
                      </Link>
                    </Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.ItemGroup title="Cadastros">
                    <Menu.Item key="setting:25">
                      <Link to="/clients">
                        <Icon type="user" /> Clientes
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="setting:27">
                      <Link to="/locations">
                        <Icon type="environment" /> Endereços
                      </Link>
                    </Menu.Item>
                  </Menu.ItemGroup>
                </SubMenu>

                <SubMenu
                  title={
                    <span className="submenu-title-wrapper">
                      <Icon type="calculator" />
                      <span>Caixa</span>
                    </span>
                  }
                  disabled={this.state.caixa}
                >
                  <Menu.Item key="setting:28">
                    <Link to="/caixa">
                      <Icon type="calculator" /> Caixa Diário
                    </Link>
                  </Menu.Item>
                  <Menu.ItemGroup title="Emissão de Boletos">
                    <Menu.Item key="setting:32">
                      <Link to="/boletos">
                        <Icon type="barcode" /> Emitir Boleto
                      </Link>
                    </Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.ItemGroup title="Vendas / Ordens">
                    <Menu.Item key="setting:81">
                      <Link to="/gerenciarVendas">
                        <Icon type="shopping" /> Gerenciar Vendas
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="setting:83">
                      <Link to="/gerenciarVendas">
                        <Icon type="file-text" /> Gerenciar Ordens
                      </Link>
                    </Menu.Item>
                  </Menu.ItemGroup>
                </SubMenu>

                <SubMenu
                  title={
                    <span className="submenu-title-wrapper">
                      <Icon type="line-chart" />
                      <span>Financeiro</span>
                    </span>
                  }
                  disabled={this.state.admin}
                >
                  <Menu.ItemGroup title="Lançamentos">
                    <Menu.Item key="setting:34">
                      <Link to="/contasPagar">
                        <Icon type="fall" /> Contas a Pagar
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="setting:35">
                      <Link to="/contasReceber">
                        <Icon type="rise" /> Contas a Receber
                      </Link>
                    </Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.ItemGroup title="Dados Financeiros">
                    <Menu.Item key="setting:37">
                      <Link to="/contasBancarias">
                        <Icon type="bank" /> Contas Bancárias
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="setting:38">
                      <Link to="/formaDePagamento">
                        <Icon type="credit-card" /> Forma de Pagamentos
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="setting:39">
                      <Link to="/planoDeContas">
                        <Icon type="fund" /> Plano de Contas
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="setting:40">
                      <Link to="/cheques">
                        <Icon type="idcard" /> Controle de Cheques
                      </Link>
                    </Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.ItemGroup title="Pagamentos">
                    <Menu.Item key="setting:41">
                      <Link to="/gerPagamentos">
                        <Icon type="dollar" /> Gerenciar Pagamentos
                      </Link>
                    </Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.ItemGroup title="Comissões">
                    <Menu.Item key="setting:42">
                      <Link to="/comissionsFunc">
                        <Icon type="percentage" /> Gerenciar Comissões
                      </Link>
                    </Menu.Item>
                  </Menu.ItemGroup>
                </SubMenu>

                <SubMenu
                  title={
                    <span className="submenu-title-wrapper">
                      <Icon type="read" />
                      <span>Relatórios</span>
                    </span>
                  }
                  disabled={this.state.admin}
                >
                  <Menu.ItemGroup title="Relatório de Cadastros">
                    <Menu.Item key="setting:43">
                      <Link to="/relatoriosCadastro">
                        <Icon type="profile" /> Cadastros
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="setting:44">
                      <Link to="/relatoriosEstoque">
                        <Icon type="tags" /> Produtos e Serviços
                      </Link>
                    </Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.ItemGroup title="Relatório Financeiro">
                    <Menu.Item key="setting:46">
                      <Link to="/relatoriosFinanceiro">
                        <Icon type="calculator" /> Relatório Financeiro
                      </Link>
                    </Menu.Item>
                  </Menu.ItemGroup>
                </SubMenu>
                <Menu.Item key="setting:97" disabled={this.state.caixa}>
                  <Link to="/invoices">
                    <Icon type="file-text" /> <span>Notas Fiscais</span>
                  </Link>
                </Menu.Item>
              </Menu>
            </Sider>

            <Layout style={{ height: "100%", padding: 10 }}>
              <Content
                style={{
                  margin: 0,
                  height: "100%",
                  background: "#fff",
                  padding: 5,
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    overflowY: "auto",
                    overflowX: "hidden",
                    padding: 5,
                  }}
                >
                  <Routes />
                </div>
              </Content>
            </Layout>
          </Layout>

          <Modal
            title={false}
            visible={this.state.modalConnection}
            closable={false}
            footer={[
              <Button
                key="submit"
                type="primary"
                icon="save"
                onClick={() => this.saveString()}
              >
                Salvar
              </Button>,
            ]}
            centered
            width="50%"
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Lottie options={defaultOptions} width={"50%"} />

              <p
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#f44336",
                  marginTop: -5,
                  marginBottom: -5,
                }}
              >
                Sem conexão com o servidor!
              </p>

              <p>
                Por favor insira no campo abaixo a rota de conexão com o
                servidor
              </p>
            </div>

            <Row gutter={10}>
              <Col span={18}>
                <label>IP do Servidor</label>
                <Input
                  type="text"
                  value={this.state.ip}
                  onChange={(e) => this.setState({ ip: e.target.value })}
                  size="large"
                  style={{ marginTop: 10 }}
                />
              </Col>
              <Col span={6}>
                <label>Porta do Servidor</label>
                <Input
                  type="text"
                  value={this.state.port}
                  onChange={(e) => this.setState({ port: e.target.value })}
                  size="large"
                  style={{ marginTop: 10 }}
                />
              </Col>
            </Row>

            {this.state.showWarning === true && (
              <p
                style={{
                  color: "#f44336",
                  fontSize: 18,
                  fontWeight: "bold",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                REINICIE O SISTEMA PARA QUE AS ALTERAÇÕES TENHAM EFEITO
              </p>
            )}
          </Modal>

          <Modal
            title={false}
            visible={this.state.modalAuth}
            closable={false}
            footer={[
              <Button
                key="settings"
                type="default"
                shape="circle"
                icon="setting"
                size="large"
                onClick={() => this.setState({ modalSetting: true })}
              />,
              <Button
                key="submit"
                type="primary"
                icon="login"
                loading={this.state.loading}
                size="large"
                onClick={() => this.autheticate()}
              >
                Login
              </Button>,
            ]}
            centered
            width="30%"
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <img
                alt="Image Login"
                src={ImgLogin}
                style={{ width: 90, height: 90 }}
              />
            </div>

            <Input
              type="text"
              autoFocus
              size="large"
              addonBefore={<Icon type="user" />}
              style={{ marginBottom: 15 }}
              value={this.state.user}
              onChange={(e) => this.setState({ user: e.target.value })}
              placeholder="Usuário"
            />

            <Input.Password
              type="text"
              size="large"
              addonBefore={<Icon type="key" />}
              value={this.state.pass}
              onChange={(e) => this.setState({ pass: e.target.value })}
              placeholder="Senha"
            />
          </Modal>

          <Modal
            title={false}
            visible={this.state.modalSetting}
            closable={false}
            footer={[
              <Button
                key="cancel"
                type="danger"
                icon="close"
                onClick={() => this.setState({ modalSetting: false })}
              >
                Cancelar
              </Button>,
              <Button
                key="submit"
                type="primary"
                icon="save"
                onClick={() => this.updateConnection()}
              >
                Salvar
              </Button>,
            ]}
            centered
            width="40%"
          >
            <label>IP do Servidor</label>
            <Input
              value={this.state.ip}
              onChange={(e) => this.setState({ ip: e.target.value })}
            />
            <label>Porta do Servidor</label>
            <Input
              value={this.state.port}
              onChange={(e) => this.setState({ port: e.target.value })}
            />
          </Modal>
        </Layout>
      </MemoryRouter>
    );
  }
}

export default withRouter(Layouts);
