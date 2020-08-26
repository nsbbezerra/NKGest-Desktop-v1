import React, { Component } from "react";
import {
  Icon,
  Button,
  Table,
  Tabs,
  Tooltip,
  Modal,
  Input,
  Radio,
  Row,
  Col,
  Select,
  Card,
  Divider,
  Spin,
  TreeSelect,
  Statistic,
  DatePicker,
} from "antd";
import { Header } from "../../../styles/styles";
import { Link } from "react-router-dom";
import Highlighter from "react-highlight-words";
import moment from "moment";
import api from "../../../config/axios";
import "../../../styles/style.css";

import CadastrarContas from "./cadastrar";

const { TabPane } = Tabs;
const { Option } = Select;
const { TreeNode } = TreeSelect;

export default class ContasReceber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      modalDel: false,
      modalConfirm: false,
      modalEditInfo: false,
      modalAdvancedFind: false,
      typeAdvandcedFind: 1,
      modalInfo: false,
      loading: false,
      loadingUpdate: false,
      loadingDel: false,
      loadingPay: false,
      spinner: false,
      planoContas: [],
      formaPagamento: [],
      contasBancarias: [],
      contasReceber: [],
      title: "",
      planoContaId: "",
      planoContaName: "",
      formaPagamentoId: "",
      contasBancariaId: "",
      vencimento: "",
      valor: 0,
      status: "",
      dia: "",
      mes: "",
      ano: "",
      mesNumber: "",
      idConta: null,
      statusPay: null,
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

  warning = (title, message) => {
    Modal.warning({
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

  finders = async () => {
    this.setState({ spinner: true });
    await api
      .get("/financial/findersReceive")
      .then((response) => {
        this.setState({ planoContas: response.data.planoConta });
        this.setState({ formaPagamento: response.data.formaPagamento });
        this.setState({ contasBancarias: response.data.contas });
        this.setState({ spinner: false });
      })
      .catch((error) => {
        this.erro("Erro", error.message);
        this.setState({ spinner: false });
      });
  };

  componentDidMount = () => {
    this.finders();
    this.sendAdvancedFind();
  };

  sendAdvancedFind = async () => {
    if (this.state.typeAdvandcedFind === null) {
      this.warning("Atenção", "Selecione uma opção de busca");
      return false;
    }
    this.setState({ loading: true });
    await api
      .post("/financial/findContasReceber", {
        typeSearch: this.state.typeAdvandcedFind,
        data: `${this.state.dia}/${this.state.mesNumber}/${this.state.ano}`,
        mes: this.state.mes,
        ano: this.state.ano,
      })
      .then((response) => {
        this.setState({ contasReceber: response.data.contasReceber });
        this.setState({ loading: false });
        this.setState({ modalAdvancedFind: false });
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ loading: false });
      });
  };

  handlePlanoConta = async (value) => {
    const result = await this.state.planoContas.find(
      (obj) => obj.planoConta === value
    );
    await this.setState({ planoContaId: result._id });
    await this.setState({ planoContaName: result.planoConta });
  };

  handleAdvancedFind = () => {
    this.setState({ dia: "" });
    this.setState({ mes: "" });
    this.setState({ mesNumber: "" });
    this.setState({ ano: "" });
    this.setState({ modalAdvancedFind: true });
  };

  handleEditInfo = async (value) => {
    const result = await this.state.contasReceber.find(
      (obj) => obj._id === value
    );
    await this.setState({ idConta: value });
    await this.setState({ title: result.description });
    await this.setState({ planoContaId: result.planContas._id });
    await this.setState({ planoContaName: result.planContas.planoConta });
    await this.setState({ vencimento: result.vencimento });
    await this.setState({ formaPagamentoId: result.payForm._id });
    await this.setState({ contasBancariaId: result.accountBank._id });
    await this.setState({ valor: result.value });
    await this.setState({ status: result.statusPay });
    this.setState({ modalInfo: true });
  };

  sendUpdateConta = async () => {
    this.setState({ loadingUpdate: true });
    await api
      .put(`/financial/changeContasReceber/${this.state.idConta}`, {
        planContas: this.state.planoContaId,
        payForm: this.state.formaPagamentoId,
        accountBank: this.state.contasBancariaId,
        vencimento: this.state.vencimento,
        value: this.state.valor,
        description: this.state.title,
      })
      .then((response) => {
        this.success("Sucesso", response.data.message);
        this.setState({ loadingUpdate: false });
        this.finders();
        this.setState({ modalInfo: false });
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ loadingUpdate: false });
      });
  };

  handleDelete = async (value) => {
    await this.setState({ idConta: value });
    this.setState({ modalDel: true });
  };

  sendDelete = async () => {
    this.setState({ loadingDel: true });
    await api
      .delete(`/financial/delContasReceber/${this.state.idConta}`)
      .then((response) => {
        this.success("Sucesso", response.data.message);
        this.finders();
        this.setState({ loadingDel: false });
        this.setState({ modalDel: false });
      })
      .catch((error) => {
        this.setState({ loadingDel: false });
        this.erro("Erro", error.response.data.message);
      });
  };

  handleChangeConfirm = async (value) => {
    await this.setState({ idConta: value._id });
    await this.setState({ statusPay: value.statusPay });
    this.setState({ modalConfirm: true });
  };

  sendChangePayment = async () => {
    this.setState({ loadingPay: true });
    await api
      .put(`/financial/changePaymentContasReceber/${this.state.idConta}`, {
        statusPay: this.state.statusPay,
      })
      .then((response) => {
        this.success("Sucesso", response.data.message);
        this.setState({ loadingPay: false });
        this.setState({ modalConfirm: false });
        this.sendAdvancedFind();
      })
      .catch((error) => {
        this.setState({ loadingPay: false });
        this.erro("Erro", error.response.data.message);
      });
  };

  render() {
    const columns = [
      {
        title: "Descrição",
        dataIndex: "description",
        key: "description",
        ...this.getColumnSearchProps("description"),
      },
      {
        title: "Plano de Contas",
        dataIndex: "planContas.planoConta",
        key: "planContas.planoConta",
        width: "20%",
      },
      {
        title: "Vencimento",
        dataIndex: "vencimento",
        key: "vencimento",
        width: "10%",
        render: (value) => (
          <p style={{ marginBottom: -2 }}>
            {moment(new Date(value)).format("DD/MM/YYYY")}
          </p>
        ),
      },
      {
        title: "Valor",
        dataIndex: "value",
        key: "value",
        render: (value) => (
          <Statistic
            value={value}
            valueStyle={{ fontSize: 15.5 }}
            prefix="R$"
            precision={2}
          />
        ),
        width: "12%",
        align: "center",
      },
      {
        title: "Pagamento",
        dataIndex: "statusPay",
        key: "statusPay",
        render: (value, id) => (
          <>
            {value === "pay" && (
              <Tooltip
                title="Clique aqui para Gerenciar o Pagamento"
                placement="top"
              >
                <Button
                  size="small"
                  style={{
                    width: "100%",
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                  type="link"
                  onClick={() => this.handleChangeConfirm(id)}
                >
                  Pago
                </Button>
              </Tooltip>
            )}
            {value === "wait" && (
              <Tooltip
                title="Clique aqui para Gerenciar o Pagamento"
                placement="top"
              >
                <Button
                  size="small"
                  style={{
                    width: "100%",
                    backgroundColor: "#ffeb3b",
                    color: "#444",
                    fontWeight: "bold",
                  }}
                  type="link"
                  onClick={() => this.handleChangeConfirm(id)}
                >
                  Em Aberto
                </Button>
              </Tooltip>
            )}
          </>
        ),
        width: "8%",
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
        width: "9%",
        align: "center",
      },
    ];

    const DataAtual = new Date();
    const Ano = DataAtual.getFullYear();

    return (
      <div style={{ height: "100%" }}>
        <Header>
          <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
            <Icon type="rise" style={{ fontSize: 20 }} /> CONTAS A RECEBER
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
              <div
                style={{
                  marginBottom: 10,
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Card size="small">
                  {this.state.typeAdvandcedFind === null && (
                    <p style={{ marginBottom: -3, marginTop: -1 }}>
                      Data dos dados: <strong>-</strong>
                    </p>
                  )}

                  {this.state.typeAdvandcedFind === 1 && (
                    <p style={{ marginBottom: -3, marginTop: -1 }}>
                      Data dos dados: <strong>Mês Atual</strong>
                    </p>
                  )}

                  {this.state.typeAdvandcedFind === 2 && (
                    <p style={{ marginBottom: -3, marginTop: -1 }}>
                      Data dos dados:{" "}
                      <strong>{`${this.state.dia}/${this.state.mesNumber}/${this.state.ano}`}</strong>
                    </p>
                  )}

                  {this.state.typeAdvandcedFind === 3 && (
                    <p style={{ marginBottom: -3, marginTop: -1 }}>
                      Data dos dados:{" "}
                      <strong>{`${this.state.mes} de ${this.state.ano}`}</strong>
                    </p>
                  )}

                  {this.state.typeAdvandcedFind === 4 && (
                    <p style={{ marginBottom: -3, marginTop: -1 }}>
                      Data dos dados:{" "}
                      <strong>{`Ano de ${this.state.ano}`}</strong>
                    </p>
                  )}
                </Card>

                <Button
                  icon="search"
                  type="primary"
                  onClick={() => this.handleAdvancedFind()}
                >
                  Busca Avançada
                </Button>
              </div>

              <Spin spinning={this.state.spinner} size="large">
                <Table
                  pagination={{ pageSize: 10 }}
                  columns={columns}
                  dataSource={this.state.contasReceber}
                  size="small"
                  rowKey={(cont) => cont._id}
                  rowClassName={(record) =>
                    moment(new Date(record.vencimento)) < moment(new Date()) &&
                    record.statusPay === "wait"
                      ? "red-row"
                      : ""
                  }
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
              onClick={() => this.setState({ modalAuth: false })}
            >
              Não
            </Button>,
            <Button
              key="submit"
              icon="check"
              type="primary"
              loading={this.state.loadingDel}
              onClick={() => {
                this.sendDelete();
              }}
            >
              Sim
            </Button>,
          ]}
        >
          <p>Tem certeza que deseja excluir este lançamento?</p>
        </Modal>

        <Modal
          title="Alterar Status de Pagamento"
          visible={this.state.modalConfirm}
          onCancel={() => this.setState({ modalConfirm: false })}
          footer={[
            <Button
              key="back"
              icon="close"
              type="danger"
              onClick={() => this.setState({ modalConfirm: false })}
            >
              Cancelar
            </Button>,
            <Button
              key="submit"
              icon="save"
              type="primary"
              loading={this.state.loadingPay}
              onClick={() => {
                this.sendChangePayment();
              }}
            >
              Salvar
            </Button>,
          ]}
        >
          <Radio.Group
            onChange={(e) => this.setState({ statusPay: e.target.value })}
            value={this.state.statusPay}
          >
            <Radio value={"wait"}>
              <Icon type="hourglass" /> Em Aberto
            </Radio>
            <Radio value={"pay"}>
              <Icon type="check" /> Pago
            </Radio>
          </Radio.Group>
        </Modal>

        <Modal
          title="Editar Informações"
          visible={this.state.modalInfo}
          onCancel={() => this.setState({ modalInfo: false })}
          footer={[
            <Button
              key="calcel"
              icon="close"
              type="danger"
              onClick={() => this.setState({ modalInfo: false })}
            >
              Cancelar
            </Button>,
            <Button
              key="submit"
              icon="save"
              type="primary"
              loading={this.state.loadingUpdate}
              onClick={() => this.sendUpdateConta()}
            >
              Salvar
            </Button>,
          ]}
          width="85%"
        >
          <Row gutter={10}>
            <Col span={12}>
              <label>
                Descrição do recebimento<span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="text"
                value={this.state.title}
                onChange={(e) =>
                  this.setState({ title: e.target.value.toUpperCase() })
                }
              />
            </Col>

            <Col span={6}>
              <label>
                Plano de contas<span style={{ color: "red" }}>*</span>
              </label>
              <TreeSelect
                showSearch
                style={{ width: "100%" }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                value={this.state.planoContaName}
                treeDefaultExpandAll
                onChange={(value) => this.handlePlanoConta(value)}
              >
                {this.state.planoContas.map((plano) => (
                  <TreeNode
                    value={plano.planoConta}
                    title={plano.planoConta}
                    key={plano._id}
                  />
                ))}
              </TreeSelect>
            </Col>

            <Col span={6}>
              <label>
                Vencimento<span style={{ color: "red" }}>*</span>
              </label>
              <DatePicker
                value={moment(new Date(this.state.vencimento))}
                format="DD/MM/YYYY"
                onChange={(value) => this.setState({ vencimento: value })}
                showToday={false}
                style={{ width: "100%" }}
              />
            </Col>
          </Row>

          <Row gutter={10} style={{ marginTop: 15 }}>
            <Col span={8}>
              <label>
                Forma de pagamento<span style={{ color: "red" }}>*</span>
              </label>
              <Select
                value={this.state.formaPagamentoId}
                style={{ width: "100%" }}
                onChange={(e) => this.setState({ formaPagamentoId: e })}
              >
                {this.state.formaPagamento.map((forma) => (
                  <Option value={forma._id} key={forma._id}>
                    {forma.name}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col span={8}>
              <label>
                Conta bancária<span style={{ color: "red" }}>*</span>
              </label>
              <Select
                value={this.state.contasBancariaId}
                style={{ width: "100%" }}
                onChange={(e) => this.setState({ contasBancariaId: e })}
              >
                {this.state.contasBancarias.map((conta) => (
                  <Option value={conta._id} key={conta._id}>
                    {conta.bank}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col span={8}>
              <label>
                Valor<span style={{ color: "red" }}>*</span>
              </label>
              <Input
                addonAfter="R$"
                type="number"
                value={this.state.valor}
                onChange={(e) =>
                  this.setState({ valor: parseFloat(e.target.value) })
                }
              />
            </Col>
          </Row>
        </Modal>

        <Modal
          title="Busca Avançada"
          visible={this.state.modalAdvancedFind}
          onCancel={() => this.setState({ modalAdvancedFind: false })}
          footer={[
            <Button
              key="1"
              icon="close"
              type="danger"
              onClick={() => this.setState({ modalAdvancedFind: false })}
            >
              Cancelar
            </Button>,
            <Button
              key="2"
              icon="search"
              type="primary"
              loading={this.state.loading}
              onClick={() => {
                this.sendAdvancedFind();
              }}
            >
              Buscar
            </Button>,
          ]}
        >
          <Select
            value={this.state.typeAdvandcedFind}
            style={{ width: "100%" }}
            onChange={(e) => this.setState({ typeAdvandcedFind: e })}
            placeholder="Ano"
          >
            <Option value={1}>Mês Atual</Option>
            <Option value={2}>Por Data</Option>
            <Option value={3}>Por Mês</Option>
            <Option value={4}>Por Ano</Option>
          </Select>

          {this.state.typeAdvandcedFind === 2 && (
            <>
              <Divider />

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Select
                  value={this.state.dia}
                  style={{ width: 100, marginRight: 10 }}
                  onChange={(e) => this.setState({ dia: e })}
                  placeholder="Dia"
                >
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                  <Option value="5">5</Option>
                  <Option value="6">6</Option>
                  <Option value="7">7</Option>
                  <Option value="8">8</Option>
                  <Option value="9">9</Option>
                  <Option value="10">10</Option>
                  <Option value="11">11</Option>
                  <Option value="12">12</Option>
                  <Option value="13">13</Option>
                  <Option value="14">14</Option>
                  <Option value="15">15</Option>
                  <Option value="16">16</Option>
                  <Option value="17">17</Option>
                  <Option value="18">18</Option>
                  <Option value="19">19</Option>
                  <Option value="20">20</Option>
                  <Option value="21">21</Option>
                  <Option value="22">22</Option>
                  <Option value="23">23</Option>
                  <Option value="24">24</Option>
                  <Option value="25">25</Option>
                  <Option value="26">26</Option>
                  <Option value="27">27</Option>
                  <Option value="28">28</Option>
                  <Option value="29">29</Option>
                  <Option value="30">30</Option>
                  <Option value="31">31</Option>
                </Select>

                <Select
                  value={this.state.mesNumber}
                  style={{ width: 150, marginRight: 10 }}
                  onChange={(e) => this.setState({ mesNumber: e })}
                  placeholder="Mês"
                >
                  <Option value="1">Janeiro</Option>
                  <Option value="2">Fevereiro</Option>
                  <Option value="3">Março</Option>
                  <Option value="4">Abril</Option>
                  <Option value="5">Maio</Option>
                  <Option value="6">Junho</Option>
                  <Option value="7">Julho</Option>
                  <Option value="8">Agosto</Option>
                  <Option value="9">Setembro</Option>
                  <Option value="10">Outubro</Option>
                  <Option value="11">Novembro</Option>
                  <Option value="12">Dezembro</Option>
                </Select>

                <Select
                  value={this.state.ano}
                  style={{ width: 100 }}
                  onChange={(e) => this.setState({ ano: e })}
                  placeholder="Ano"
                >
                  <Option value={Ano - 1}>{Ano - 1}</Option>
                  <Option value={Ano}>{Ano}</Option>
                  <Option value={Ano + 1}>{Ano + 1}</Option>
                  <Option value={Ano + 2}>{Ano + 2}</Option>
                  <Option value={Ano + 3}>{Ano + 3}</Option>
                </Select>
              </div>
            </>
          )}

          {this.state.typeAdvandcedFind === 3 && (
            <>
              <Divider />

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Select
                  value={this.state.mes}
                  style={{ width: 150, marginRight: 10 }}
                  onChange={(e) => this.setState({ mes: e })}
                  placeholder="Mês"
                >
                  <Option value="Janeiro">Janeiro</Option>
                  <Option value="Fevereiro">Fevereiro</Option>
                  <Option value="Março">Março</Option>
                  <Option value="Abril">Abril</Option>
                  <Option value="Maio">Maio</Option>
                  <Option value="Junho">Junho</Option>
                  <Option value="Julho">Julho</Option>
                  <Option value="Agosto">Agosto</Option>
                  <Option value="Setembro">Setembro</Option>
                  <Option value="Outubro">Outubro</Option>
                  <Option value="Novembro">Novembro</Option>
                  <Option value="Dezembro">Dezembro</Option>
                </Select>

                <Select
                  value={this.state.ano}
                  style={{ width: 100 }}
                  onChange={(e) => this.setState({ ano: e })}
                  placeholder="Ano"
                >
                  <Option value={Ano - 1}>{Ano - 1}</Option>
                  <Option value={Ano}>{Ano}</Option>
                  <Option value={Ano + 1}>{Ano + 1}</Option>
                  <Option value={Ano + 2}>{Ano + 2}</Option>
                  <Option value={Ano + 3}>{Ano + 3}</Option>
                </Select>
              </div>
            </>
          )}

          {this.state.typeAdvandcedFind === 4 && (
            <>
              <Divider />

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Select
                  value={this.state.ano}
                  style={{ width: 100 }}
                  onChange={(e) => this.setState({ ano: e })}
                  placeholder="Ano"
                >
                  <Option value={Ano - 1}>{Ano - 1}</Option>
                  <Option value={Ano}>{Ano}</Option>
                  <Option value={Ano + 1}>{Ano + 1}</Option>
                  <Option value={Ano + 2}>{Ano + 2}</Option>
                  <Option value={Ano + 3}>{Ano + 3}</Option>
                </Select>
              </div>
            </>
          )}
        </Modal>
      </div>
    );
  }
}
