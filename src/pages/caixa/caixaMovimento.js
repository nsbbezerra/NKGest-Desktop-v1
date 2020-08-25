import React, { Component } from "react";
import {
  Icon,
  Button,
  Modal,
  Table,
  Tooltip,
  Descriptions,
  Card,
  Spin,
  Divider,
  Input,
  Row,
  Col,
  Statistic,
  Tabs,
  Drawer,
} from "antd";
import { Header } from "../../styles/styles";
import { Link } from "react-router-dom";
import api from "../../config/axios";
import PaymentsModuleSale from "../../components/payments";
import PaymentsModuleOrder from "../../components/paymentsOrders";
import PrintSale from "../../templates/printSale";
import PrintOrder from "../../templates/printOrder";

const { TextArea } = Input;
const { TabPane } = Tabs;

export default class RelatorioVendas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalAdvancedFind: false,
      modalPaymentSale: false,
      modalPaymentOrder: false,
      loading: false,
      typeAdvandcedFind: null,
      typeAdvandcedFind2: null,
      moreOptions: null,
      modalInfo: false,
      modalDeposit: false,
      modalRetirar: false,
      modalCloseCaixa: false,
      modalDelOrder: false,
      modalDelOrderService: false,
      spinner: false,
      loadingDelPay: false,
      caixa: {},
      moviments: [],
      loadingInfo: false,
      idCaixa: null,
      description: "",
      value: 0,
      modalDelMoviment: false,
      idMoviment: null,
      modalSendCloseCaixa: false,
      disabledButton: false,
      calcCredits: 0,
      calcDebits: 0,
      result: 0,
      valueOpenedAct: 0,
      modalInfo2: false,
      sales: [],
      services: [],
      clientes: [],
      enderecos: [],
      orderToPrint: {},
      serviceToPrint: {},
      addressToPrint: {},
      clientToPrint: {},
      modalFinish: false,
      pagamentos: [],
      pagamentoServicos: [],
      idSale: null,
      idService: null,
      loadingFinish: false,
      modalFinishService: false,
      loadingFinishService: false,
      orderToDel: null,
      orderServiceToDel: null,
      loadingDelOrder: false,
      dados: {},
      saleToPay: {},
      orderToPay: {},
      modalNewPaySale: false,
      modalNewPayOrder: false,
      showPayModule: false,
      modalPrintOrder: false,
      modalPrintSale: false,
      totalBruto: 0,
      totalLiquido: 0,
      drawer: false,
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

  findCaixa = async () => {
    this.setState({ loadingInfo: true });
    const idCaixa = await sessionStorage.getItem("caixaId");

    await api
      .post(`/cashier/findMoviment/${idCaixa}`)
      .then((response) => {
        this.setState({ caixa: response.data.findCaixa });
        this.setState({ moviments: response.data.findMoviments });
        this.setState({ loadingInfo: false });
        this.setState({ modalInfo: true });
      })
      .catch((error) => {
        this.erro("Erro", error.message);
        this.setState({ loadingInfo: false });
      });
  };

  sendDeposit = async () => {
    if (this.state.description === "") {
      this.warning("Atenção", "A descrição da transação está em branco");
      return false;
    }
    if (this.state.value === 0) {
      this.warning("Atenção", "O valor da transação está definido como 0");
      return false;
    }
    this.setState({ loading: true });
    const idCaixa = await sessionStorage.getItem("caixaId");
    await api
      .put(`/cashier/deposit/${idCaixa}`, {
        deposit: this.state.value,
        description: this.state.description,
      })
      .then((response) => {
        this.success("Sucesso", response.data.message);
        this.setState({ description: "" });
        this.setState({ value: 0 });
        this.setState({ loading: false });
        this.setState({ modalDeposit: false });
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ loading: false });
        this.setState({ modalDeposit: false });
      });
  };

  delOrder = async () => {
    this.setState({ loadingDelOrder: true });
    await api
      .delete(`/orders/cancelSale/${this.state.orderToDel}`)
      .then((response) => {
        this.success("Sucesso", response.data.message);
        this.setState({ loadingDelOrder: false });
        this.setState({ modalDelOrder: false });
        this.finders();
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ loadingDelOrder: false });
      });
  };

  delOrderService = async () => {
    this.setState({ loadingDelOrder: true });
    await api
      .delete(`/orders/cancelOrdem/${this.state.orderServiceToDel}`)
      .then((response) => {
        this.success("Sucesso", response.data.message);
        this.setState({ loadingDelOrder: false });
        this.setState({ modalDelOrderService: false });
        this.finders();
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ loadingDelOrder: false });
      });
  };

  sendWithdraw = async () => {
    if (this.state.description === "") {
      this.warning("Atenção", "A descrição da transação está em branco");
      return false;
    }
    if (this.state.value === 0) {
      this.warning("Atenção", "O valor da transação está definido como 0");
      return false;
    }
    this.setState({ loading: true });
    const idCaixa = await sessionStorage.getItem("caixaId");
    await api
      .put(`/cashier/withdraw/${idCaixa}`, {
        withdraw: this.state.value,
        description: this.state.description,
      })
      .then((response) => {
        this.success("Sucesso", response.data.message);
        this.setState({ description: "" });
        this.setState({ value: 0 });
        this.setState({ loading: false });
        this.setState({ modalRetirar: false });
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ loading: false });
        this.setState({ modalRetirar: false });
      });
  };

  sendDelMoviment = async () => {
    this.setState({ loading: true });
    await api
      .delete(`/cashier/delMoviment/${this.state.idMoviment}`)
      .then((response) => {
        this.success("Sucesso", response.data.message);
        this.setState({ modalDelMoviment: false });
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ modalDelMoviment: false });
        this.setState({ loading: false });
      });
  };

  finishedSale = async () => {
    const idCaixa = await sessionStorage.getItem("caixaId");
    this.setState({ loadingFinish: true });
    await api
      .put(`/cashier/closeSale/${this.state.idSale}`, {
        caixa: idCaixa,
      })
      .then((response) => {
        this.setState({ modalFinish: false });
        this.success("Sucesso", response.data.message);
        this.setState({ loadingFinish: false });
        this.handleCloseModalEndSale();
        this.finders();
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ loadingFinish: false });
        this.setState({ modalFinish: false });
      });
  };

  finishedService = async () => {
    const idCaixa = await sessionStorage.getItem("caixaId");
    this.setState({ loadingFinishService: true });
    await api
      .put(`/cashier/closeService/${this.state.idService}`, {
        caixa: idCaixa,
      })
      .then((response) => {
        this.setState({ modalFinishService: false });
        this.success("Sucesso", response.data.message);
        this.setState({ loadingFinishService: false });
        this.handleCloseModalEndService();
        this.finders();
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ loadingFinishService: false });
        this.setState({ modalFinishService: false });
      });
  };

  sendCloseCaixa = async () => {
    this.setState({ loading: true });
    const idCaixa = await sessionStorage.getItem("caixaId");
    await api
      .put(`/cashier/close/${idCaixa}`)
      .then((response) => {
        this.setState({ valueOpenedAct: response.data.valueOpenedAct });
        this.setState({ calcDebits: response.data.calcDebits });
        this.setState({ calcCredits: response.data.calcCredits });
        this.setState({ result: response.data.valueFechamento });
        this.setState({ loading: false });
        this.setState({ modalSendCloseCaixa: false });
        this.setState({ disabledButton: true });
        this.success("Sucesso", "Caixa encerrado com sucesso");
        this.setState({ modalInfo2: true });
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ loading: false });
      });
  };

  finders = async () => {
    this.setState({ spinner: true });
    await api
      .get("/cashier/listSales")
      .then((response) => {
        this.setState({ sales: response.data.sales });
        this.setState({ services: response.data.services });
        this.setState({ spinner: false });
      })
      .catch((error) => {
        this.erro("Erro", error.message);
        this.setState({ spinner: false });
      });
  };

  FindClients = async () => {
    this.setState({ spinner: true });
    await api
      .get("/orders/findClientes")
      .then((response) => {
        this.setState({ clientes: response.data.clients });
        this.setState({ spinner: false });
      })
      .catch((error) => {
        this.setState({ spinner: false });
        this.erro("Erro", error.message);
      });
  };

  findAddress = async () => {
    this.setState({ spinner: true });
    await api
      .get("/orders/findAllAddress")
      .then((response) => {
        this.setState({ enderecos: response.data.address });
        this.setState({ spinner: false });
      })
      .catch((error) => {
        this.setState({ spinner: false });
        this.erro("Erro", error.message);
      });
  };

  findDados = async () => {
    this.setState({ spinner: true });
    await api
      .get("/organization/find")
      .then((response) => {
        this.setState({ dados: response.data.empresa });
        this.setState({ spinner: false });
      })
      .catch((error) => {
        this.erro("Erro", error.message);
        this.setState({ spinner: false });
      });
  };

  handlePaymentsSale = async (id) => {
    await api
      .post("/orders/findPayForm", {
        order: id,
      })
      .then((response) => {
        this.setState({ pagamentos: response.data.pagamentos });
        this.setState({ idSale: id });
        this.setState({ modalPaymentSale: true });
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
      });
  };

  handlePaymentsOrder = async (id) => {
    await api
      .post("/orders/findPayFormOrder", {
        order: id,
      })
      .then((response) => {
        this.setState({ pagamentoServicos: response.data.pagamentos });
        this.setState({ idService: id });
        this.setState({ modalPaymentOrder: true });
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
      });
  };

  handleDelPaymentSale = async () => {
    this.setState({ loadingDelPay: true });
    const result = await this.state.sales.find(
      (obj) => obj._id === this.state.idSale
    );
    await this.setState({ saleToPay: result });
    await api
      .delete(`/payments/delAllPaymentSale/${this.state.idSale}`)
      .then((response) => {
        this.success("Sucesso", response.data.message);
        this.setState({ modalPaymentSale: false });
        this.setState({ loadingDelPay: false });
        this.setState({ showPayModule: true });
        this.setState({ modalNewPaySale: true });
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ loadingDelPay: false });
      });
  };

  handleDelPaymentOrder = async () => {
    this.setState({ loadingDelPay: true });
    const result = await this.state.services.find(
      (obj) => obj._id === this.state.idService
    );
    await this.setState({ orderToPay: result });
    await api
      .delete(`/payments/delAllPaymentOrder/${this.state.idService}`)
      .then((response) => {
        this.success("Sucesso", response.data.message);
        this.setState({ modalPaymentOrder: false });
        this.setState({ loadingDelPay: false });
        this.setState({ showPayModule: true });
        this.setState({ modalNewPayOrder: true });
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ loadingDelPay: false });
      });
  };

  FindPaymentSale = async () => {
    this.setState({ spinner: true });
    await api
      .post("/orders/findPayForm", {
        order: this.state.idSale,
      })
      .then((response) => {
        this.setState({ pagamentos: response.data.pagamentos });
        this.setState({ modalFinish: true });
        this.setState({ spinner: false });
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ spinner: false });
      });
  };

  FindPaymentService = async () => {
    this.setState({ spinner: true });
    await api
      .post("/orders/findPayFormOrder", {
        order: this.state.idService,
      })
      .then((response) => {
        this.setState({ pagamentoServicos: response.data.pagamentos });
        this.setState({ modalFinishService: true });
        this.setState({ spinner: false });
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ spinner: false });
      });
  };

  handleDelMoviment = async (id) => {
    await this.setState({ idMoviment: id });
    this.setState({ modalInfo: false });
    this.setState({ modalDelMoviment: true });
  };

  handleFinishSale = async (id) => {
    const result = await this.state.sales.find((obj) => obj._id === id);
    const endereco = await this.state.enderecos.find(
      (end) => end.client._id === result.client._id
    );
    const client = await this.state.clientes.find(
      (cli) => cli._id === result.client._id
    );
    await this.setState({ addressToPrint: endereco });
    await this.setState({ clientToPrint: client });
    await this.setState({ orderToPrint: result });
    await this.setState({ idSale: id });
    await this.setState({ totalBruto: result.valueBruto });
    await this.setState({ totalLiquido: result.valueLiquido });
    this.FindPaymentSale();
  };

  handleFinishService = async (id) => {
    const result = await this.state.services.find((obj) => obj._id === id);
    const endereco = await this.state.enderecos.find(
      (end) => end.client._id === result.client._id
    );
    const client = await this.state.clientes.find(
      (cli) => cli._id === result.client._id
    );
    await this.setState({ addressToPrint: endereco });
    await this.setState({ clientToPrint: client });
    await this.setState({ serviceToPrint: result });
    await this.setState({ idService: id });
    await this.setState({ totalBruto: result.valueBruto });
    await this.setState({ totalLiquido: result.valueLiquido });
    this.FindPaymentService();
  };

  goToCaixa = () => {
    this.props.history.push("/caixa");
  };

  componentWillUnmount = () => {
    sessionStorage.removeItem("caixaId");
  };

  componentDidMount = () => {
    this.finders();
    this.FindClients();
    this.findAddress();
    this.findDados();
  };

  handleDelOrder = async (id) => {
    await this.setState({ orderToDel: id });
    this.setState({ modalDelOrder: true });
  };

  handleDelOrderService = async (id) => {
    await this.setState({ orderServiceToDel: id });
    this.setState({ modalDelOrderService: true });
  };

  handleCloseModalEndSale = async () => {
    await this.setState({ orderToPrint: {} });
    await this.setState({ clientToPrint: {} });
    await this.setState({ addressToPrint: {} });
    await this.setState({ modalFinish: false });
  };

  handleCloseModalEndService = async () => {
    await this.setState({ serviceToPrint: {} });
    await this.setState({ clientToPrint: {} });
    await this.setState({ addressToPrint: {} });
    this.setState({ modalFinishService: false });
  };

  handleModalSale = () => {
    this.setState({ modalNewPaySale: false });
    this.setState({ showPayModule: false });
  };

  handleModalOrder = () => {
    this.setState({ modalNewPayOrder: false });
    this.setState({ showPayModule: false });
  };

  handlePrintSale = async (id) => {
    const resultSale = await this.state.sales.find((obj) => obj._id === id);
    const address = await this.state.enderecos.find(
      (obj) => obj.client._id === resultSale.client._id
    );
    const client = await this.state.clientes.find(
      (obj) => obj._id === resultSale.client._id
    );
    await this.setState({ orderToPrint: resultSale });
    await this.setState({ addressToPrint: address });
    await this.setState({ clientToPrint: client });
    this.setState({ modalPrintSale: true });
  };

  handlePrintOrder = async (id) => {
    const resultSale = await this.state.services.find((obj) => obj._id === id);
    const address = await this.state.enderecos.find(
      (obj) => obj.client._id === resultSale.client._id
    );
    const client = await this.state.clientes.find(
      (obj) => obj._id === resultSale.client._id
    );
    await this.setState({ serviceToPrint: resultSale });
    await this.setState({ addressToPrint: address });
    await this.setState({ clientToPrint: client });
    this.setState({ modalPrintOrder: true });
  };

  replaceValue = (value) => {
    let casas = Math.pow(10, 2);
    return Math.floor(value * casas) / casas;
  };

  render() {
    const columnSales = [
      {
        title: "Nº",
        dataIndex: "number",
        key: "number",
        align: "center",
        width: "5%",
      },
      {
        title: "Cliente",
        dataIndex: "client.name",
        key: "client.name",
      },
      {
        title: "Vendedor",
        dataIndex: "funcionario.name",
        key: "funcionario.name",
      },
      {
        title: "Data",
        dataIndex: "createDate",
        key: "createDate",
        width: "9%",
        align: "center",
      },
      {
        title: "Valor",
        dataIndex: "valueLiquido",
        key: "valueLiquido",
        width: "15%",
        render: (value) => (
          <Statistic
            value={value}
            valueStyle={{ fontSize: 15 }}
            prefix="R$"
            precision={2}
          />
        ),
        align: "right",
      },
      {
        title: "Ações",
        dataIndex: "_id",
        key: "_id",
        render: (id) => (
          <>
            <Tooltip placement="top" title="Imprimir">
              <Button
                shape="circle"
                icon="printer"
                type="dashed"
                size="small"
                style={{ marginRight: 5 }}
                onClick={() => this.handlePrintSale(id)}
              />
            </Tooltip>
            <Tooltip placement="top" title="Pagamentos">
              <Button
                shape="circle"
                icon="barcode"
                type="default"
                size="small"
                style={{ marginRight: 5 }}
                onClick={() => this.handlePaymentsSale(id)}
              />
            </Tooltip>
            <Tooltip placement="top" title="Excluir">
              <Button
                shape="circle"
                icon="close"
                type="danger"
                size="small"
                style={{ marginRight: 5 }}
                onClick={() => this.handleDelOrder(id)}
              />
            </Tooltip>
            <Tooltip placement="top" title="Finalizar">
              <Button
                shape="circle"
                icon="check"
                type="primary"
                size="small"
                onClick={() => this.handleFinishSale(id)}
              />
            </Tooltip>
          </>
        ),
        width: "12%",
        align: "center",
      },
    ];

    const columnServices = [
      {
        title: "Nº",
        dataIndex: "number",
        key: "number",
        align: "center",
        width: "5%",
      },
      {
        title: "Cliente",
        dataIndex: "client.name",
        key: "client.name",
      },
      {
        title: "Vendedor",
        dataIndex: "funcionario.name",
        key: "funcionario.name",
      },
      {
        title: "Veículo",
        dataIndex: "veicles.model",
        key: "veicles.model",
      },
      {
        title: "Data",
        dataIndex: "createDate",
        key: "createDate",
        width: "9%",
        align: "center",
      },
      {
        title: "Valor",
        dataIndex: "valueLiquido",
        key: "valueLiquido",
        width: "15%",
        align: "right",
        render: (value) => (
          <Statistic
            value={value}
            valueStyle={{ fontSize: 15 }}
            prefix="R$"
            precision={2}
          />
        ),
      },
      {
        title: "Ações",
        dataIndex: "_id",
        key: "_id",
        render: (id) => (
          <>
            <Tooltip placement="top" title="Imprimir">
              <Button
                shape="circle"
                icon="printer"
                type="dashed"
                size="small"
                style={{ marginRight: 5 }}
                onClick={() => this.handlePrintOrder(id)}
              />
            </Tooltip>
            <Tooltip placement="top" title="Pagamentos">
              <Button
                shape="circle"
                icon="barcode"
                type="default"
                size="small"
                style={{ marginRight: 5 }}
                onClick={() => this.handlePaymentsOrder(id)}
              />
            </Tooltip>
            <Tooltip placement="top" title="Excluir">
              <Button
                shape="circle"
                icon="close"
                type="danger"
                size="small"
                style={{ marginRight: 5 }}
                onClick={() => this.handleDelOrderService(id)}
              />
            </Tooltip>
            <Tooltip placement="top" title="Finalizar">
              <Button
                icon="check"
                type="primary"
                size="small"
                shape="circle"
                onClick={() => this.handleFinishService(id)}
              />
            </Tooltip>
          </>
        ),
        width: "12%",
        align: "center",
      },
    ];

    const columnsPayment = [
      {
        title: "Titulo",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Valor (R$)",
        dataIndex: "value",
        key: "value",
        width: "20%",
        render: (value) => (
          <Statistic
            value={value}
            valueStyle={{ fontSize: 15 }}
            prefix="R$"
            precision={2}
          />
        ),
        align: "right",
      },
      {
        title: "Vencimento",
        dataIndex: "datePay",
        key: "datePay",
        width: "12%",
        align: "center",
      },
      {
        title: "Status",
        dataIndex: "statusPay",
        key: "statusPay",
        width: "20%",
        render: (value) => (
          <>
            {value === "automatic" && (
              <Button
                type="link"
                size="small"
                style={{
                  width: "100%",
                  backgroundColor: "#03a9f4",
                  color: "#222",
                }}
              >
                Crédito
              </Button>
            )}
            {value === "pay" && (
              <Button
                type="link"
                size="small"
                style={{
                  width: "100%",
                  backgroundColor: "#4caf50",
                  color: "#FFF",
                }}
              >
                Pago
              </Button>
            )}
            {value === "wait" && (
              <Button
                type="link"
                size="small"
                style={{
                  width: "100%",
                  backgroundColor: "#ffeb3b",
                  color: "#222",
                }}
              >
                Aguardando
              </Button>
            )}
          </>
        ),
        align: "center",
      },
    ];

    const columnsPaymentService = [
      {
        title: "Titulo",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Valor (R$)",
        dataIndex: "value",
        key: "value",
        width: "20%",
        render: (value) => (
          <Statistic
            value={value}
            valueStyle={{ fontSize: 15.5 }}
            prefix="R$"
            precision={2}
          />
        ),
        align: "right",
      },
      {
        title: "Vencimento",
        dataIndex: "datePay",
        key: "datePay",
        width: "12%",
      },
      {
        title: "Status",
        dataIndex: "statusPay",
        key: "statusPay",
        width: "20%",
        render: (value) => (
          <>
            {value === "automatic" && (
              <Button
                type="link"
                size="small"
                style={{
                  width: "100%",
                  backgroundColor: "#03a9f4",
                  color: "#222",
                }}
              >
                Crédito
              </Button>
            )}
            {value === "pay" && (
              <Button
                type="link"
                size="small"
                style={{
                  width: "100%",
                  backgroundColor: "#4caf50",
                  color: "#FFF",
                }}
              >
                Pago
              </Button>
            )}
            {value === "wait" && (
              <Button
                type="link"
                size="small"
                style={{
                  width: "100%",
                  backgroundColor: "#ffeb3b",
                  color: "#222",
                }}
              >
                Aguardando
              </Button>
            )}
          </>
        ),
        align: "right",
      },
    ];

    const columnsMoviments = [
      {
        title: "Descrição",
        dataIndex: "description",
        key: "description",
        width: "60%",
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
        width: "20%",
        align: "center",
      },
      {
        title: "Valor (R$)",
        dataIndex: "value",
        key: "value",
        width: "12%",
        render: (value) => (
          <Statistic
            value={value}
            valueStyle={{ fontSize: 15.5 }}
            prefix="R$"
            precision={2}
          />
        ),
        align: "right",
      },
      {
        title: "Ações",
        dataIndex: "_id",
        key: "_id",
        width: "6%",
        render: (mov) => (
          <Tooltip placement="top" title="Excluir">
            <Button
              shape="circle"
              icon="close"
              type="danger"
              size="small"
              style={{ marginRight: 10 }}
              onClick={() => this.handleDelMoviment(mov)}
            />
          </Tooltip>
        ),
        align: "center",
      },
    ];

    const dataResumeSale = [
      {
        key: "1",
        info: "TOTAL BRUTO",
        value: `R$ ${this.replaceValue(this.state.totalBruto)}`,
      },
      {
        key: "2",
        info: "DESCONTO",
        value: `% ${this.replaceValue(this.state.orderToPrint.desconto)}`,
      },
      {
        key: "3",
        info: "TOTAL A PAGAR",
        value: `R$ ${this.replaceValue(this.state.totalLiquido)}`,
      },
    ];

    const columnsResumeSale = [
      {
        title: "Informações",
        dataIndex: "info",
        key: "info",
        width: "70%",
      },
      {
        title: "Valor",
        dataIndex: "value",
        key: "value",
        align: "right",
      },
    ];

    const dataResumeOrder = [
      {
        key: "1",
        info: "TOTAL BRUTO",
        value: `R$ ${this.replaceValue(this.state.totalBruto)}`,
      },
      {
        key: "2",
        info: "DESCONTO",
        value: `% ${this.replaceValue(this.state.serviceToPrint.desconto)}`,
      },
      {
        key: "3",
        info: "TOTAL A PAGAR",
        value: `R$ ${this.replaceValue(this.state.totalLiquido)}`,
      },
    ];

    const columnsResumeOrder = [
      {
        title: "Informações",
        dataIndex: "info",
        key: "info",
        width: "70%",
      },
      {
        title: "Valor",
        dataIndex: "value",
        key: "value",
        align: "right",
      },
    ];

    const columns2 = [
      {
        title: "Qtd",
        dataIndex: "quantity",
        key: "quantity",
        width: "6%",
      },
      {
        title: "Produto",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Estoque",
        dataIndex: "estoque",
        key: "estoque",
        width: "8%",
        align: "center",
      },
      {
        title: "Preço Uni",
        dataIndex: "valueUnit",
        key: "valueUnit",
        width: "12%",
        render: (value) => (
          <Statistic
            value={value}
            valueStyle={{ fontSize: 15 }}
            prefix="R$"
            precision={2}
          />
        ),
        align: "right",
      },
      {
        title: "Preço Tot",
        dataIndex: "valueTotal",
        key: "valueTotal",
        width: "12%",
        render: (value) => (
          <Statistic
            value={value}
            valueStyle={{ fontSize: 15 }}
            prefix="R$"
            precision={2}
          />
        ),
        align: "right",
      },
    ];

    const columnsService2 = [
      {
        title: "Qtd",
        dataIndex: "quantity",
        key: "quantity",
        width: "6%",
      },
      {
        title: "Serviço",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Valor Uni",
        dataIndex: "valueUnit",
        key: "valueUnit",
        render: (value) => (
          <Statistic
            value={value}
            valueStyle={{ fontSize: 15 }}
            prefix="R$"
            precision={2}
          />
        ),
        width: "12%",
        align: "right",
      },
      {
        title: "Valor Tot",
        dataIndex: "valueTotal",
        key: "valueTotal",
        render: (value) => (
          <Statistic
            value={value}
            valueStyle={{ fontSize: 15 }}
            prefix="R$"
            precision={2}
          />
        ),
        width: "12%",
        align: "right",
      },
    ];

    return (
      <>
        <Header>
          <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
            <Icon type="calculator" style={{ fontSize: 20 }} /> CAIXA ABERTO
          </p>
          <Link to="/">
            <Button type="danger" shape="circle" icon="close" size="small" />
          </Link>
        </Header>

        <Spin spinning={this.state.spinner} size="large">
          <Tabs defaultActiveKey="1" style={{ marginTop: 10 }}>
            <TabPane
              tab={
                <span>
                  <Icon type="shopping-cart" />
                  Vendas
                </span>
              }
              key="1"
            >
              <Button
                size="large"
                icon="menu-fold"
                type="primary"
                style={{ position: "absolute", right: 0, top: 0 }}
                onClick={() => this.setState({ drawer: true })}
              />
              <Table
                columns={columnSales}
                dataSource={this.state.sales}
                size="small"
                rowKey={(sal) => sal._id}
              />
            </TabPane>

            <TabPane
              tab={
                <span>
                  <Icon type="file-sync" />
                  Ordem de Serviço
                </span>
              }
              key="2"
            >
              <Button
                size="large"
                icon="menu-fold"
                type="primary"
                style={{ position: "absolute", right: 0, top: 0 }}
                onClick={() => this.setState({ drawer: true })}
              />
              <Table
                columns={columnServices}
                dataSource={this.state.services}
                size="small"
                rowKey={(ser) => ser._id}
              />
            </TabPane>
          </Tabs>
        </Spin>

        <Modal
          title="Informações"
          visible={this.state.modalInfo}
          onCancel={() => this.setState({ modalInfo: false })}
          footer={[
            <Button
              key="1"
              icon="close"
              type="danger"
              onClick={() => {
                this.setState({ modalInfo: false });
              }}
            >
              Fechar
            </Button>,
          ]}
          width="85%"
          centered
          bodyStyle={{ height: "79vh", overflow: "auto" }}
        >
          <Descriptions layout="vertical" bordered size="small">
            <Descriptions.Item
              label="Valor de Abertura"
              span={1}
            >{`R$ ${this.state.caixa.valueOpened}`}</Descriptions.Item>
            <Descriptions.Item
              label="Valor de Fechamento"
              span={1}
            >{`R$ ${this.state.caixa.valueClosed}`}</Descriptions.Item>
            <Descriptions.Item
              label="Saldo"
              span={1}
            >{`R$ ${this.state.caixa.saldo}`}</Descriptions.Item>
            <Descriptions.Item label="Data da Movimentação" span={3}>
              {this.state.caixa.movimentDate}
            </Descriptions.Item>
          </Descriptions>

          <Divider>Movimentação</Divider>

          <Table
            pagination={{ pageSize: 7 }}
            columns={columnsMoviments}
            dataSource={this.state.moviments}
            size="small"
            rowKey={(mov) => mov._id}
          />
        </Modal>

        <Modal
          title="Efetuar Depósito"
          visible={this.state.modalDeposit}
          onCancel={() => this.setState({ modalDeposit: false })}
          footer={[
            <Button
              key="1"
              icon="close"
              type="danger"
              onClick={() => {
                this.setState({ modalDeposit: false });
              }}
            >
              Cancelar
            </Button>,
            <Button
              key="2"
              icon="rise"
              type="primary"
              loading={this.state.loading}
              onClick={() => {
                this.sendDeposit();
              }}
            >
              Efetuar Depósito
            </Button>,
          ]}
          width="50%"
        >
          <label>Descrição</label>
          <TextArea
            rows={2}
            style={{ marginBottom: 10 }}
            onChange={(e) =>
              this.setState({ description: e.target.value.toUpperCase() })
            }
            value={this.state.description}
          />

          <label>Valor</label>
          <Input
            type="number"
            addonAfter="R$"
            onChange={(e) => this.setState({ value: e.target.value })}
            value={this.state.value}
          />
        </Modal>

        <Modal
          title="Efetuar Retirada"
          visible={this.state.modalRetirar}
          onCancel={() => this.setState({ modalRetirar: false })}
          footer={[
            <Button
              key="1"
              icon="close"
              type="danger"
              onClick={() => {
                this.setState({ modalRetirar: false });
              }}
            >
              Cancelar
            </Button>,
            <Button
              key="2"
              icon="fall"
              type="primary"
              loading={this.state.loading}
              onClick={() => {
                this.sendWithdraw();
              }}
            >
              Efetuar Retirada
            </Button>,
          ]}
          width="50%"
        >
          <label>Descrição</label>
          <TextArea
            rows={2}
            style={{ marginBottom: 10 }}
            onChange={(e) =>
              this.setState({ description: e.target.value.toUpperCase() })
            }
            value={this.state.description}
          />

          <label>Valor</label>
          <Input
            type="number"
            addonAfter="R$"
            onChange={(e) => this.setState({ value: e.target.value })}
            value={this.state.value}
          />
        </Modal>

        <Modal
          title="Excluir Movimentação do Caixa"
          visible={this.state.modalDelMoviment}
          onCancel={() => this.setState({ modalDelMoviment: false })}
          footer={[
            <Button
              key="1"
              icon="close"
              type="danger"
              onClick={() => {
                this.setState({ modalDelMoviment: false });
              }}
            >
              Não
            </Button>,
            <Button
              key="2"
              icon="check"
              type="primary"
              loading={this.state.loading}
              onClick={() => {
                this.sendDelMoviment();
              }}
            >
              Sim
            </Button>,
          ]}
          width="50%"
        >
          <p>Tem certeza que deseja excluir esta movimentação do caixa?</p>
        </Modal>

        <Modal
          title="Fechar o Caixa"
          visible={this.state.modalSendCloseCaixa}
          onCancel={() => this.setState({ modalSendCloseCaixa: false })}
          footer={[
            <Button
              key="1"
              icon="close"
              type="danger"
              onClick={() => {
                this.setState({ modalSendCloseCaixa: false });
              }}
            >
              Não
            </Button>,
            <Button
              key="2"
              icon="check"
              type="primary"
              loading={this.state.loading}
              onClick={() => {
                this.sendCloseCaixa();
              }}
            >
              Sim
            </Button>,
          ]}
          width="50%"
        >
          <p>
            <strong>ATENÇÃO</strong> Esta operação irá encerrar as operações
            deste caixa ativo, após esta operação não será mais possível
            realizar vendas neste caixa e nem fazer movimentações. Tem certeza
            disso?
          </p>
        </Modal>

        <Modal
          title="Informações do Caixa"
          visible={this.state.modalInfo2}
          onCancel={() => this.setState({ modalInfo2: false })}
          footer={[
            <Button
              key="1"
              icon="check"
              type="primary"
              onClick={() => {
                this.goToCaixa();
              }}
            >
              Ok
            </Button>,
          ]}
          width="85%"
          centered
          bodyStyle={{ height: "79vh", overflow: "auto" }}
        >
          <Row gutter={10} style={{ marginBottom: 15 }}>
            <Col span={12}>
              <Statistic
                title="Total de Depósitos"
                value={this.state.calcCredits}
                suffix="R$"
                prefix={<Icon type="rise" precision={2} />}
              />
            </Col>

            <Col span={12}>
              <Statistic
                title="Total de Retiradas"
                value={this.state.calcDebits}
                suffix="R$"
                prefix={<Icon type="fall" precision={2} />}
              />
            </Col>
          </Row>

          <Row gutter={10}>
            <Col span={12}>
              <Statistic
                title="Valor de Abertura"
                value={this.state.valueOpenedAct}
                suffix="R$"
                prefix={<Icon type="calculator" precision={2} />}
              />
            </Col>

            <Col span={12}>
              <Statistic
                title="Valor de Fechamento"
                value={this.state.result}
                suffix="R$"
                prefix={<Icon type="dollar" precision={2} />}
              />
            </Col>
          </Row>
        </Modal>

        <Modal
          title="Finalizar Venda"
          visible={this.state.modalFinish}
          onCancel={() => this.handleCloseModalEndSale()}
          footer={[
            <Button
              key="1"
              icon="check"
              type="primary"
              loading={this.state.loadingFinish}
              onClick={() => this.finishedSale()}
            >
              Finalizar
            </Button>,
          ]}
          width="85%"
          centered
          bodyStyle={{ height: "79vh", overflow: "auto" }}
        >
          {!!this.state.orderToPrint && (
            <>
              <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
                PRODUTOS
              </Divider>
              <Table
                pagination={false}
                columns={columns2}
                dataSource={this.state.orderToPrint.products}
                size="small"
                rowKey={(prod) => prod.product}
              />
            </>
          )}

          {!!this.state.pagamentos.length && (
            <>
              <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
                PAGAMENTOS
              </Divider>
              <Table
                pagination={false}
                columns={columnsPayment}
                dataSource={this.state.pagamentos}
                size="small"
                rowKey={(prod) => prod._id}
                style={{ marginTop: 10 }}
              />
            </>
          )}

          <Divider style={{ fontSize: 15, fontWeight: "bold" }}>RESUMO</Divider>
          <Table
            pagination={false}
            columns={columnsResumeSale}
            dataSource={dataResumeSale}
            size="small"
            showHeader={false}
          />
        </Modal>

        <Modal
          title="Finalizar Ordem de Serviço"
          visible={this.state.modalFinishService}
          onCancel={() => this.handleCloseModalEndService()}
          footer={[
            <Button
              key="1"
              icon="check"
              type="primary"
              loading={this.state.loadingFinishService}
              onClick={() => this.finishedService()}
            >
              Finalizar
            </Button>,
          ]}
          width="85%"
          centered
          bodyStyle={{ height: "79vh", overflow: "auto" }}
        >
          {!!this.state.serviceToPrint && (
            <>
              <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
                SERVIÇOS
              </Divider>
              <Table
                pagination={false}
                columns={columnsService2}
                dataSource={this.state.serviceToPrint.services}
                size="small"
                rowKey={(chave) => chave.service}
              />
            </>
          )}

          {!!this.state.pagamentoServicos.length && (
            <>
              <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
                PAGAMENTOS
              </Divider>
              <Table
                pagination={false}
                columns={columnsPaymentService}
                dataSource={this.state.pagamentoServicos}
                size="small"
                rowKey={(prod) => prod._id}
              />
            </>
          )}

          <Divider style={{ fontSize: 15, fontWeight: "bold" }}>RESUMO</Divider>
          <Table
            pagination={false}
            columns={columnsResumeOrder}
            dataSource={dataResumeOrder}
            size="small"
            showHeader={false}
          />
        </Modal>

        <Modal
          visible={this.state.modalDelOrder}
          title="Excluir Venda"
          closable={false}
          footer={[
            <Button
              key="back"
              icon="close"
              type="danger"
              onClick={() => this.setState({ modalDelOrder: false })}
            >
              Não
            </Button>,
            <Button
              key="submit"
              icon="check"
              type="primary"
              loading={this.state.loadingDelOrder}
              onClick={() => this.delOrder()}
            >
              Sim
            </Button>,
          ]}
        >
          <p>Deseja excluir esta venda?</p>
        </Modal>

        <Modal
          visible={this.state.modalDelOrderService}
          title="Excluir Ordem de Serviço"
          closable={false}
          footer={[
            <Button
              key="back"
              icon="close"
              type="danger"
              onClick={() => this.setState({ modalDelOrderService: false })}
            >
              Não
            </Button>,
            <Button
              key="submit"
              icon="check"
              type="primary"
              loading={this.state.loadingDelOrder}
              onClick={() => this.delOrderService()}
            >
              Sim
            </Button>,
          ]}
        >
          <p>Deseja excluir esta ordem de serviço?</p>
        </Modal>

        <Modal
          visible={this.state.modalPaymentSale}
          title="Pagamentos da Venda"
          onCancel={() => this.setState({ modalPaymentSale: false })}
          footer={[
            <Button
              key="back"
              icon="close"
              type="danger"
              loading={this.state.loadingDelPay}
              onClick={() => this.handleDelPaymentSale()}
            >
              Excluir Pagamentos
            </Button>,
            <Button
              key="submit"
              icon="close"
              type="primary"
              onClick={() => this.setState({ modalPaymentSale: false })}
            >
              Fechar
            </Button>,
          ]}
          width="85%"
          centered
          bodyStyle={{ height: "79vh", overflow: "auto" }}
        >
          <Table
            pagination={false}
            columns={columnsPayment}
            dataSource={this.state.pagamentos}
            size="small"
            rowKey={(prod) => prod._id}
            style={{ marginTop: 10 }}
          />
        </Modal>

        <Modal
          visible={this.state.modalPaymentOrder}
          title="Pagamentos da Ordem de Serviço"
          onCancel={() => this.setState({ modalPaymentOrder: false })}
          footer={[
            <Button
              key="back"
              icon="close"
              type="danger"
              loading={this.state.loadingDelPay}
              onClick={() => this.handleDelPaymentOrder()}
            >
              Excluir Pagamentos
            </Button>,
            <Button
              key="submit"
              icon="close"
              type="primary"
              onClick={() => this.setState({ modalPaymentOrder: false })}
            >
              Fechar
            </Button>,
          ]}
          width="85%"
          centered
          bodyStyle={{ height: "79vh", overflow: "auto" }}
        >
          <Table
            pagination={false}
            columns={columnsPaymentService}
            dataSource={this.state.pagamentoServicos}
            size="small"
            rowKey={(prod) => prod._id}
          />
        </Modal>

        <Modal
          visible={this.state.modalNewPaySale}
          title="Novo Pagamento"
          closable={false}
          footer={false}
          width="90%"
          centered
        >
          {this.state.showPayModule === true && (
            <PaymentsModuleSale
              price={this.state.saleToPay.valueLiquido}
              idSale={this.state.saleToPay._id}
              brut={this.state.saleToPay.valueBruto}
              desc={this.state.saleToPay.desconto}
              confirm={this.handleModalSale}
            />
          )}
        </Modal>

        <Modal
          visible={this.state.modalNewPayOrder}
          title="Novo Pagamento"
          closable={false}
          footer={false}
          width="90%"
          centered
        >
          {this.state.showPayModule === true && (
            <PaymentsModuleOrder
              price={this.state.orderToPay.valueLiquido}
              idSale={this.state.orderToPay._id}
              brut={this.state.orderToPay.valueBruto}
              desc={this.state.orderToPay.desconto}
              confirm={this.handleModalOrder}
            />
          )}
        </Modal>

        <Modal
          visible={this.state.modalPrintSale}
          title="Imprimir"
          onCancel={() => {
            this.setState({ modalPrintSale: false });
          }}
          footer={false}
          width="30%"
          centered
        >
          {this.state.modalPrintSale === true && (
            <PrintSale
              empresa={this.state.dados}
              cliente={this.state.clientToPrint}
              endereco={this.state.addressToPrint}
              venda={this.state.orderToPrint}
            />
          )}
        </Modal>

        <Modal
          visible={this.state.modalPrintOrder}
          title="Imprimir"
          onCancel={() => this.setState({ modalPrintOrder: false })}
          footer={false}
          width="30%"
          centered
        >
          {this.state.modalPrintOrder === true && (
            <PrintOrder
              empresa={this.state.dados}
              cliente={this.state.clientToPrint}
              endereco={this.state.addressToPrint}
              venda={this.state.serviceToPrint}
            />
          )}
        </Modal>

        <Drawer
          title="Menu"
          placement="left"
          onClose={() => this.setState({ drawer: false })}
          visible={this.state.drawer}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <Button
              disabled={this.state.disabledButton}
              icon="redo"
              type="dashed"
              size="large"
              onClick={() => this.finders()}
            >
              Atualizar Vendas
            </Button>

            <Divider />

            <Button
              disabled={this.state.disabledButton}
              icon="info-circle"
              type="ghost"
              size="large"
              loading={this.state.loadingInfo}
              onClick={() => {
                this.findCaixa();
              }}
            >
              Informações do Caixa
            </Button>

            <Divider />

            <Button
              disabled={this.state.disabledButton}
              icon="rise"
              type="default"
              size="large"
              onClick={() => {
                this.setState({ modalDeposit: true });
              }}
              style={{ marginBottom: 10 }}
            >
              Efetuar Depósito
            </Button>

            <Button
              disabled={this.state.disabledButton}
              icon="fall"
              type="danger"
              size="large"
              onClick={() => {
                this.setState({ modalRetirar: true });
              }}
            >
              Efeturar Retirada
            </Button>

            <Divider />

            <Button
              disabled={this.state.disabledButton}
              icon="calculator"
              type="primary"
              size="large"
              onClick={() => {
                this.setState({ modalSendCloseCaixa: true });
              }}
            >
              Fechar o Caixa
            </Button>
          </div>
        </Drawer>
      </>
    );
  }
}
