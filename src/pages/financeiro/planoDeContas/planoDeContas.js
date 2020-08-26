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
  Spin,
} from "antd";
import { Header } from "../../../styles/styles";
import { Link } from "react-router-dom";
import Highlighter from "react-highlight-words";
import api from "../../../config/axios";

import CadastrarContas from "./cadastrar";

const { TabPane } = Tabs;
const { Option } = Select;

export default class PlanoDeContas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      modalDel: false,
      modalConfirm: false,
      modalEditInfo: false,
      loading: false,
      spinner: false,
      planoDeContas: [],
      idConta: null,
      nomeConta: null,
      tipoMovimento: null,
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

  handleDelete = async (id) => {
    await this.setState({ idConta: id });
    this.setState({ modalDel: true });
  };

  handleSendDelete = async () => {
    this.setState({ loading: true });

    await api
      .delete(`/financial/delPlanoContas/${this.state.idConta}`)
      .then((response) => {
        this.setState({ modalDel: false });
        this.success("Sucesso", response.data.message);
        this.setState({ loading: false });
        this.findPlanoContas();
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ loading: false });
      });
  };

  handleSendEditInfo = async () => {
    this.setState({ loading: true });

    await api
      .put(`/financial/editPlanoConta/${this.state.idConta}`, {
        plano: this.state.nomeConta,
        tipo: this.state.tipoMovimento,
      })
      .then((response) => {
        this.setState({ modalEditInfo: false });
        this.success("Sucesso", response.data.message);
        this.setState({ loading: false });
        this.findPlanoContas();
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ loading: false });
      });
  };

  handleEditInfo = async (id) => {
    const result = await this.state.planoDeContas.find((obj) => obj._id === id);
    await this.setState({ idConta: id });
    await this.setState({ nomeConta: result.planoConta });
    await this.setState({ tipoMovimento: result.typeMoviment });
    this.setState({ modalEditInfo: true });
  };

  findPlanoContas = async () => {
    this.setState({ spinner: true });

    await api
      .get("/financial/findPlanoContas")
      .then((response) => {
        this.setState({ planoDeContas: response.data.planoConta });
        this.setState({ spinner: false });
      })
      .catch((error) => {
        this.erro("Erro", error.message);
        this.setState({ spinner: false });
      });
  };

  componentDidMount = () => {
    this.findPlanoContas();
  };

  render() {
    const columns = [
      {
        title: "Plano de Contas",
        dataIndex: "planoConta",
        key: "planoConta",
        ...this.getColumnSearchProps("planoConta"),
      },
      {
        title: "Tipo de Movimento",
        dataIndex: "typeMoviment",
        key: "typeMoviment",
        render: (mov) => (
          <>
            {mov === "credit" && (
              <Button
                size="small"
                type="link"
                style={{
                  backgroundColor: "#4caf50",
                  color: "#fff",
                  width: "100%",
                }}
              >
                Crédito
              </Button>
            )}
            {mov === "debit" && (
              <Button
                size="small"
                type="link"
                style={{
                  backgroundColor: "#f44336",
                  color: "#fff",
                  width: "100%",
                }}
              >
                Débito
              </Button>
            )}
          </>
        ),
        width: "17%",
        align: "center",
      },
      {
        title: "Ações",
        dataIndex: "_id",
        key: "_id",
        render: (id) => (
          <>
            <Tooltip placement="top" title="Editar">
              <Button
                shape="circle"
                icon="edit"
                type="primary"
                size="small"
                style={{ marginRight: 5 }}
                onClick={() => this.handleEditInfo(id)}
              />
            </Tooltip>
            <Tooltip placement="top" title="Excluir">
              <Button
                shape="circle"
                icon="close"
                size="small"
                type="danger"
                onClick={() => this.handleDelete(id)}
              />
            </Tooltip>
          </>
        ),
        width: "10%",
        align: "center",
      },
    ];

    return (
      <div style={{ height: "100%" }}>
        <Header>
          <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
            <Icon type="book" style={{ fontSize: 20 }} /> PLANO DE CONTAS
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
                  onClick={() => this.findPlanoContas()}
                  style={{ marginBottom: 10 }}
                >
                  Atualizar
                </Button>

                <Table
                  pagination={{ pageSize: 10 }}
                  columns={columns}
                  dataSource={this.state.planoDeContas}
                  rowKey={(plano) => plano._id}
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
          title="Excluir Plano de Conta"
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
                this.handleSendDelete();
              }}
            >
              Sim
            </Button>,
          ]}
        >
          <p>Tem certeza que deseja excluir este plano de conta?</p>
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
              icon="save"
              type="primary"
              loading={this.state.loading}
              onClick={() => {
                this.handleSendEditInfo();
              }}
            >
              Salvar
            </Button>,
          ]}
          width="75%"
        >
          <Row gutter={8}>
            <Col span={18}>
              <label>
                Plano de contas<span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="text"
                onChange={(e) =>
                  this.setState({ nomeConta: e.target.value.toUpperCase() })
                }
                value={this.state.nomeConta}
              />
            </Col>

            <Col span={6}>
              <label>
                Tipo de Movimento<span style={{ color: "red" }}>*</span>
              </label>
              <Select
                value={this.state.tipoMovimento}
                style={{ width: "100%", marginBottom: 20 }}
                onChange={(value) => this.setState({ tipoMovimento: value })}
              >
                <Option value="credit">Crédito</Option>
                <Option value="debit">Débito</Option>
              </Select>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}
