import React, { Component } from "react";
import {
  Table,
  Button,
  Tooltip,
  Row,
  Col,
  Modal,
  Input,
  Spin,
  Statistic,
} from "antd";
import { withRouter } from "react-router-dom";
import api from "../../config/axios";

class OpenCaixa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      spinner: false,
      modalOpenCaixa: false,
      caixas: [],
      value: 0,
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

  findCaixas = async () => {
    this.setState({ spinner: true });

    await api
      .get("/cashier/listOpen")
      .then((response) => {
        this.setState({ caixas: response.data.caixas });
        this.setState({ spinner: false });
      })
      .catch((error) => {
        this.erro("Erro", error.message);
        this.setState({ spinner: false });
      });
  };

  sendOpenCashier = async () => {
    const idFunc = await sessionStorage.getItem("id");
    this.setState({ loading: true });

    await api
      .post("/cashier/open", {
        funcionario: idFunc,
        valueOpened: this.state.value,
      })
      .then((response) => {
        this.success("Sucesso", response.data.message);
        this.setState({ modalOpenCaixa: false });
        this.setState({ loading: false });
        this.findCaixas();
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ loading: false });
        this.setState({ modalOpenCaixa: false });
      });
  };

  goToCashier = () => {
    this.props.history.push("/movimentCaixa");
  };

  admin = async () => {
    const idVend = await sessionStorage.getItem("id");
    await this.setState({ idFunc: idVend });
  };

  componentDidMount = () => {
    this.findCaixas();
  };

  handleAutenticate = async (id) => {
    const result = await sessionStorage.getItem("caixaId");
    if (result) {
      await sessionStorage.removeItem("caixaId");
    }
    await sessionStorage.setItem("caixaId", id);
    this.goToCashier();
  };

  render() {
    const columns = [
      {
        title: "Funcionário",
        dataIndex: "funcionario.name",
        key: "funcionario.name",
      },
      {
        title: "Valor Inicial (R$)",
        dataIndex: "valueOpened",
        key: "valueOpened",
        align: "center",
        render: (value) => (
          <Statistic
            value={value}
            valueStyle={{ fontSize: 15.5 }}
            prefix="R$"
            precision={2}
          />
        ),
      },
      {
        title: "Data Abertura",
        dataIndex: "movimentDate",
        key: "movimentDate",
        align: "center",
      },
      {
        title: "Ações",
        dataIndex: "_id",
        key: "_id",
        render: (id) => (
          <>
            <Tooltip placement="top" title="Movimentar Caixa">
              <Button
                icon="dollar"
                size="small"
                style={{ marginRight: 5 }}
                type="primary"
                onClick={() => this.handleAutenticate(id)}
              >
                Movimentar Caixa
              </Button>
            </Tooltip>
          </>
        ),
        width: "10%",
        align: "center",
      },
    ];

    return (
      <>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Button
              icon="check"
              type="primary"
              onClick={() => this.setState({ modalOpenCaixa: true })}
            >
              Abrir Caixa
            </Button>
          </div>
        </div>

        <Spin spinning={this.state.spinner} size="large">
          <Table
            columns={columns}
            dataSource={this.state.caixas}
            size="small"
            style={{ marginTop: 15 }}
            rowKey={(cashier) => cashier._id}
          />
        </Spin>

        <Modal
          visible={this.state.modalOpenCaixa}
          title="Abrir Caixa"
          onCancel={() => this.setState({ modalOpenCaixa: false })}
          footer={[
            <Button
              key="back"
              icon="close"
              type="danger"
              onClick={() => this.setState({ modalOpenCaixa: false })}
            >
              Cancelar
            </Button>,
            <Button
              key="submit"
              icon="check"
              type="primary"
              loading={this.state.loading}
              onClick={() => this.sendOpenCashier()}
            >
              Abrir
            </Button>,
          ]}
          width="25%"
        >
          <Row>
            <Col span={24}>
              <label>Valor Inicial</label>
              <Input
                type="number"
                addonAfter="R$"
                onChange={(e) => this.setState({ value: e.target.value })}
                value={this.state.value}
              />
            </Col>
          </Row>
        </Modal>
      </>
    );
  }
}

export default withRouter(OpenCaixa);
