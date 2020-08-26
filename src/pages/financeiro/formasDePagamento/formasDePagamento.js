import React, { Component } from "react";
import {
  Icon,
  Button,
  Table,
  Tabs,
  Tooltip,
  Modal,
  Input,
  Row,
  Col,
  Select,
  Switch,
  Spin,
} from "antd";
import { Header } from "../../../styles/styles";
import { Link } from "react-router-dom";
import Highlighter from "react-highlight-words";
import api from "../../../config/axios";

import CadastrarContas from "./cadastrar";

const { TabPane } = Tabs;
const { Option } = Select;

export default class ContasReceber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      modalDel: false,
      modalEditInfo: false,
      loading: false,
      spinner: false,
      formaDePagamento: [],
      constasBancarias: [],
      idAccountBank: "",
      boleto: null,
      cheque: null,
      acrescimo: null,
      credito: null,
      firtsPay: 0,
      intervalDays: 0,
      maxParcela: 0,
      name: "",
      statusPay: "",
      idForma: "",
      buttonDisabled: false,
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

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Buscar`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Buscar
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Limpar
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  findFormaPagamento = async () => {
    this.setState({ spinner: true });

    await api
      .get("/financial/findFormaPagamento")
      .then((response) => {
        this.setState({ formaDePagamento: response.data.formaPagamento });
        this.setState({ spinner: false });
      })
      .catch((error) => {
        this.erro("Erro", error.message);
        this.setState({ spinner: false });
      });
  };

  findContas = async () => {
    this.setState({ spinner: true });

    await api
      .get("/financial/listContasBancarias")
      .then((response) => {
        this.setState({ constasBancarias: response.data.contas });
        this.setState({ spinner: false });
      })
      .catch((error) => {
        this.erro("Erro", error.message);
        this.setState({ spinner: false });
      });
  };

  handleSendEditInfo = async () => {
    this.setState({ loading: true });

    await api
      .put(`/financial/editFormaPagamento/${this.state.idForma}`, {
        name: this.state.name,
        accountBank: this.state.idAccountBank,
        maxParcela: this.state.maxParcela,
        intervalDays: this.state.intervalDays,
        statusPay: this.state.statusPay,
        boleto: this.state.boleto,
        firtsPay: this.state.firtsPay,
        cheque: this.state.cheque,
        accData: this.state.acrescimo,
        credito: this.state.credito,
      })
      .then((response) => {
        this.success("Sucesso", response.data.message);
        this.setState({ modalEditInfo: false });
        this.setState({ loading: false });
        this.findFormaPagamento();
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ modalEditInfo: false });
        this.setState({ loading: false });
      });
  };

  componentDidMount = () => {
    this.findFormaPagamento();
    this.findContas();
  };

  handleEditInfo = async (id) => {
    const result = await this.state.formaDePagamento.find(
      (obj) => obj._id === id
    );
    await this.setState({ idForma: id });
    await this.setState({ idAccountBank: result.accountBank._id });
    await this.setState({ boleto: result.boleto });
    await this.setState({ firtsPay: result.firtsPay });
    await this.setState({ intervalDays: result.intervalDays });
    await this.setState({ maxParcela: result.maxParcela });
    await this.setState({ name: result.name });
    await this.setState({ statusPay: result.statusPay });
    await this.setState({ cheque: result.cheque });
    await this.setState({ acrescimo: result.accData });
    await this.setState({ credito: result.credito });
    this.setState({ modalEditInfo: true });
  };

  sendDelForma = async () => {
    this.setState({ loading: true });

    await api
      .delete(`/financial/delFormaPagamento/${this.state.idForma}`)
      .then((response) => {
        this.success("Sucesso", response.data.message);
        this.setState({ modalDel: false });
        this.setState({ loading: false });
        this.findFormaPagamento();
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ modalDel: false });
        this.setState({ loading: false });
      });
  };

  handleDelForma = async (id) => {
    await this.setState({ idForma: id });
    this.setState({ modalDel: true });
  };

  handleBoleto = (value) => {
    if (this.state.cheque === true) {
      this.setState({ cheque: false });
    }
    if (this.state.acrescimo === true) {
      this.setState({ acrescimo: false });
    }
    if (this.state.credito === true) {
      this.setState({ credito: false });
    }
    this.setState({ boleto: value });
  };

  handleCheque = (value) => {
    if (this.state.boleto === true) {
      this.setState({ boleto: false });
    }
    if (this.state.acrescimo === true) {
      this.setState({ acrescimo: false });
    }
    if (this.state.credito === true) {
      this.setState({ credito: false });
    }
    this.setState({ cheque: value });
  };

  handleAcrescimo = (value) => {
    if (this.state.cheque === true) {
      this.setState({ cheque: false });
    }
    if (this.state.boleto === true) {
      this.setState({ boleto: false });
    }
    if (this.state.credito === true) {
      this.setState({ credito: false });
    }
    this.setState({ acrescimo: value });
  };

  handleCredito = (value) => {
    if (this.state.cheque === true) {
      this.setState({ cheque: false });
    }
    if (this.state.boleto === true) {
      this.setState({ boleto: false });
    }
    if (this.state.acrescimo === true) {
      this.setState({ acrescimo: false });
    }
    this.setState({ credito: value });
  };

  render() {
    const columns = [
      {
        title: "Formas de Pagamento",
        dataIndex: "name",
        key: "name",
        ...this.getColumnSearchProps("name"),
      },
      {
        title: "Conta Bancária",
        dataIndex: "accountBank.bank",
        key: "accountBank.bank",
      },
      {
        title: "Nº max. Parcelas",
        dataIndex: "maxParcela",
        key: "maxParcela",
        align: "center",
      },
      {
        title: "Intervalo (dias)",
        dataIndex: "intervalDays",
        key: "intervalDays",
        align: "center",
      },
      {
        title: "Boleto?",
        dataIndex: "boleto",
        key: "boleto",
        render: (value) => (
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            {value === true && (
              <Icon
                type="check"
                style={{ color: "#4caf50", fontWeight: "bold", fontSize: 17 }}
              />
            )}
            {value === false && (
              <Icon
                type="stop"
                style={{ color: "#f44336", fontWeight: "bold", fontSize: 17 }}
              />
            )}
          </div>
        ),
      },
      {
        title: "Cheque?",
        dataIndex: "cheque",
        key: "cheque",
        render: (value) => (
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            {value === true && (
              <Icon
                type="check"
                style={{ color: "#4caf50", fontWeight: "bold", fontSize: 17 }}
              />
            )}
            {value === false && (
              <Icon
                type="stop"
                style={{ color: "#f44336", fontWeight: "bold", fontSize: 17 }}
              />
            )}
          </div>
        ),
      },
      {
        title: "Crédito?",
        dataIndex: "credito",
        key: "credito",
        render: (value) => (
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            {value === true && (
              <Icon
                type="check"
                style={{ color: "#4caf50", fontWeight: "bold", fontSize: 17 }}
              />
            )}
            {value === false && (
              <Icon
                type="stop"
                style={{ color: "#f44336", fontWeight: "bold", fontSize: 17 }}
              />
            )}
          </div>
        ),
      },
      {
        title: "Acréscimo?",
        dataIndex: "accData",
        key: "accData",
        render: (value) => (
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            {value === true && (
              <Icon
                type="check"
                style={{ color: "#4caf50", fontWeight: "bold", fontSize: 17 }}
              />
            )}
            {value === false && (
              <Icon
                type="stop"
                style={{ color: "#f44336", fontWeight: "bold", fontSize: 17 }}
              />
            )}
          </div>
        ),
      },
      {
        title: "Ações",
        dataIndex: "_id",
        key: "_id",
        render: (id) => (
          <>
            <Tooltip placement="top" title="Editar Informações">
              <Button
                shape="circle"
                icon="edit"
                type="primary"
                style={{ marginRight: 5 }}
                size="small"
                onClick={() => this.handleEditInfo(id)}
              />
            </Tooltip>
            <Tooltip placement="top" title="Excluir">
              <Button
                shape="circle"
                icon="close"
                type="danger"
                size="small"
                onClick={() => this.handleDelForma(id)}
              />
            </Tooltip>
          </>
        ),
        width: "9%",
        align: "center",
      },
    ];

    return (
      <div style={{ height: "100%" }}>
        <Header>
          <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
            <Icon type="dollar" style={{ fontSize: 20 }} /> FORMAS DE PAGAMENTO
          </p>
          <Link to="/">
            <Button type="danger" shape="circle" icon="close" size="small" />
          </Link>
        </Header>

        <div style={{ marginTop: 10 }}>
          <Tabs defaultActiveKey="1" tabPosition="top">
            <TabPane
              tab={
                <span>
                  <Icon type="ordered-list" />
                  Listagem
                </span>
              }
              key="1"
            >
              <Spin spinning={this.state.spinner} size="large">
                <Button
                  type="default"
                  icon="redo"
                  onClick={() => this.findFormaPagamento()}
                  style={{ marginBottom: 10 }}
                >
                  Atualizar
                </Button>

                <Table
                  pagination={{ pageSize: 10 }}
                  columns={columns}
                  dataSource={this.state.formaDePagamento}
                  rowKey={(forma) => forma._id}
                  size="small"
                />
              </Spin>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <Icon type="folder-add" />
                  Cadastrar
                </span>
              }
              key="2"
            >
              <CadastrarContas />
            </TabPane>
          </Tabs>
        </div>

        <Modal
          title="Excluir Lançamento"
          visible={this.state.modalDel}
          onCancel={() => this.setState({ modalDel: false })}
          footer={[
            <Button
              key="back"
              icon="close"
              type="danger"
              onClick={() => this.setState({ modalDel: false })}
            >
              Não
            </Button>,
            <Button
              key="submit"
              icon="check"
              type="primary"
              loading={this.state.loading}
              onClick={() => {
                this.sendDelForma();
              }}
            >
              Sim
            </Button>,
          ]}
        >
          <p>Tem certeza que deseja excluir esta forma de pagamento?</p>
        </Modal>

        <Modal
          title="Editar Informações"
          visible={this.state.modalEditInfo}
          onCancel={() => this.setState({ modalEditInfo: false })}
          footer={[
            <Button
              key="back"
              icon="close"
              type="danger"
              onClick={() => this.setState({ modalEditInfo: false })}
            >
              Cancelar
            </Button>,
            <Button
              key="submit"
              icon="search"
              type="primary"
              loading={this.state.loading}
              onClick={() => {
                this.handleSendEditInfo();
              }}
            >
              Salvar
            </Button>,
          ]}
          width="95%"
        >
          <Row gutter={10}>
            <Col span={10}>
              <label>
                Forma de pagamento<span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="text"
                onChange={(e) =>
                  this.setState({ name: e.target.value.toUpperCase() })
                }
                value={this.state.name}
              />
            </Col>

            <Col span={8}>
              <label>
                Conta bancária<span style={{ color: "red" }}>*</span>
              </label>
              <Select
                value={this.state.idAccountBank}
                style={{ width: "100%" }}
                onChange={(value) => this.setState({ idAccountBank: value })}
              >
                {this.state.constasBancarias.map((contas) => (
                  <Option value={contas._id} key={contas._id}>
                    {contas.bank}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col span={6}>
              <label>
                Status do pagamento<span style={{ color: "red" }}>*</span>
              </label>
              <Select
                value={this.state.statusPay}
                style={{ width: "100%" }}
                onChange={(value) => {
                  this.setState({ statusPay: value });
                }}
              >
                <Option value="vista">À vista</Option>
                <Option value="parc">Parcelado</Option>
              </Select>
            </Col>
          </Row>

          <Row gutter={10} style={{ marginTop: 15 }}>
            <Col span={4}>
              <label>
                Nº max. de parcelas<span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="number"
                onChange={(e) => this.setState({ maxParcela: e.target.value })}
                value={this.state.maxParcela}
              />
            </Col>

            <Col span={4}>
              <label>
                Intervalo das parcelas (dias)
                <span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="number"
                onChange={(e) =>
                  this.setState({ intervalDays: e.target.value })
                }
                value={this.state.intervalDays}
              />
            </Col>

            <Col span={4}>
              <label style={{ display: "block", width: "100%" }}>
                Boleto?<span style={{ color: "red" }}>*</span>
              </label>
              <Switch
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="close" />}
                checked={this.state.boleto}
                onChange={(value) => this.handleBoleto(value)}
                style={{ marginTop: 3.5 }}
              />
            </Col>

            <Col span={4}>
              <label style={{ display: "block", width: "100%" }}>
                Cheque?<span style={{ color: "red" }}>*</span>
              </label>
              <Switch
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="close" />}
                checked={this.state.cheque}
                onChange={(value) => this.handleCheque(value)}
                style={{ marginTop: 3.5 }}
              />
            </Col>

            <Col span={4}>
              <label style={{ display: "block", width: "100%" }}>
                Transferência / Deposito?<span style={{ color: "red" }}>*</span>
              </label>
              <Switch
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="close" />}
                checked={this.state.acrescimo}
                onChange={(value) => this.handleAcrescimo(value)}
                style={{ marginTop: 3.5 }}
              />
            </Col>

            <Col span={4}>
              <label style={{ display: "block", width: "100%" }}>
                Cartão de Crédito?<span style={{ color: "red" }}>*</span>
              </label>
              <Switch
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="close" />}
                checked={this.state.credito}
                onChange={(value) => this.handleCredito(value)}
                style={{ marginTop: 3.5 }}
              />
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
