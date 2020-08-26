import React, { useState, useEffect } from "react";
import {
  Spin,
  Table,
  Button,
  Modal,
  Card,
  Select,
  Divider,
  TreeSelect,
  Statistic,
  Tooltip,
  Radio,
  Icon,
  Descriptions,
  Row,
  Col,
  Input,
  Tabs,
} from "antd";
import api from "../../../../config/axios";

const { Option } = Select;
const { TreeNode } = TreeSelect;
const { TabPane } = Tabs;

export default function Debits() {
  const [spinner, setSpinner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalSearch, setModalSearch] = useState(false);
  const [modalStatusPaymentSale, setModalStatusPaymentSale] = useState(false);
  const [modalStatusPaymentOrder, setModalStatusPaymentOrder] = useState(false);
  const [find, setFind] = useState(1);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [modalFinishPaymentVenda, setModalFinishPaymentVenda] = useState(false);
  const [modalFinishPaymentOrder, setModalFinishPaymentOrder] = useState(false);
  const [modalVerify, setModalVerify] = useState(false);

  const [clientId, setClientId] = useState(null);
  const [clientName, setClientName] = useState(null);
  const [status, setStatus] = useState(null);

  const [clients, setClients] = useState([]);
  const [pagamentosVendas, setPagamentosVendas] = useState([]);
  const [pagamentosOrdens, setPagamentosOrdens] = useState([]);
  const [resultado, setResultado] = useState(0);
  const [idPagamento, setIdPagamento] = useState(null);

  const [clienteTitulo, setClienteTitulo] = useState("");
  const [descriptionsPay, setDescriptionsPay] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [clienteTituloOrder, setClienteTituloOrder] = useState("");
  const [descriptionsPayOrder, setDescriptionsPayOrder] = useState("");
  const [dataVencimentoOrder, setDataVencimentoOrder] = useState("");
  const [idPagamentoOrder, setIdPagamentoOrder] = useState(null);
  const [statusOrder, setStatusOrder] = useState(null);

  const [totalPayVendasValue, setTotalPayVendasValue] = useState(0);
  const [totalPayOrdensValue, setTotalPayOrdensValue] = useState(0);
  const [formaPagamento, setFormaPagamento] = useState([]);

  const [paymentVenda, setPaymentVenda] = useState("");
  const [parcelasVendas, setParcelasVendas] = useState([]);
  const [maxParcelaVendas, setMaxParcelaVendas] = useState(null);
  const [statusPaymentFirst, setStatusPaymentFirst] = useState("");

  const [paymentOrder, setPaymentOrder] = useState("");
  const [parcelasOrder, setParcelasOrder] = useState([]);
  const [maxParcelaOrder, setMaxParcelaOrder] = useState(null);
  const [statusPaymentOrder, setStatusPaymentOrder] = useState("");

  const [saleToUpdate, setSaleToUpdate] = useState({});
  const [orderToUpdate, setOrderToUpdate] = useState({});

  function erro(title, message) {
    Modal.error({
      title: title,
      content: (
        <div>
          <p>{message}</p>
        </div>
      ),
      onOk() {},
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
      onOk() {},
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
      onOk() {},
    });
  }

  function info(title, message) {
    Modal.info({
      title: title,
      content: (
        <div>
          <p>{message}</p>
        </div>
      ),
      onOk() {},
    });
  }

  async function finder() {
    if (find === "") {
      warning("Atenção", "Selecione uma opção de busca");
      return false;
    }
    setLoading(true);
    setSpinner(true);
    await api
      .post("/admin/listDebitsAll", {
        find: find,
        client: clientId,
      })
      .then((response) => {
        setPagamentosVendas(response.data.produtos);
        setPagamentosOrdens(response.data.servicos);
        setResultado(response.data.resultado);
        setLoading(false);
        setModalSearch(false);
        setSpinner(false);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoading(false);
        setSpinner(false);
      });
  }

  async function findClients() {
    setSpinner(true);
    await api
      .get(`/admin/listClientes`)
      .then((response) => {
        setClients(response.data.clientes);
        setSpinner(false);
      })
      .catch((error) => {
        erro("Erro", error.message);
        setSpinner(false);
      });
  }

  function handleCancel() {
    setPaymentOrder("");
    setPaymentVenda("");
    setTotalPayOrdensValue(0);
    setTotalPayVendasValue(0);
    setMaxParcelaOrder(null);
    setMaxParcelaVendas(null);
    setModalFinishPaymentVenda(false);
    setModalFinishPaymentOrder(false);
  }

  async function findFormaPagamento() {
    setSpinner(true);

    await api
      .get("/financial/findFormaPagamento")
      .then((response) => {
        setFormaPagamento(response.data.formaPagamento);
        setSpinner(false);
      })
      .catch((error) => {
        erro("Erro", error.message);
        setSpinner(false);
      });
  }

  useEffect(() => {
    findClients();
    finder();
    findFormaPagamento();
  }, []);

  async function handleClient(value) {
    const result = await clients.find((obj) => obj.name === value);
    await setClientId(result._id);
    await setClientName(result.name);
  }

  async function handleChangeStatusSale(value) {
    await setIdPagamento(value._id);
    await setClienteTitulo(value.cliente.name);
    await setDescriptionsPay(value.title);
    await setDataVencimento(value.datePay);
    await setStatus(value.statusPay);
    setModalStatusPaymentSale(true);
  }

  async function handleChangeStatusOrder(value) {
    await setIdPagamentoOrder(value._id);
    await setClienteTituloOrder(value.cliente.name);
    await setDescriptionsPayOrder(value.title);
    await setDataVencimentoOrder(value.datePay);
    await setStatusOrder(value.statusPay);
    setModalStatusPaymentOrder(true);
  }

  async function handlePaymentVenda(value) {
    const result = await formaPagamento.find((obj) => obj._id === value);
    if (parcelasVendas.length) {
      setParcelasVendas([]);
    }
    var numberParcelaVenda = new Array();
    for (var i = 0; i < result.maxParcela; i++) {
      var model = { num: i + 1, name: `${i + 1}x` };
      await numberParcelaVenda.push(model);
    }
    if (result.accData === true) {
      await setStatusPaymentFirst("wait");
    }

    if (result.statusPay === "parc") {
      await setStatusPaymentFirst("wait");
    } else {
      await setStatusPaymentFirst("done");
      await setMaxParcelaVendas(0);
    }
    setPaymentVenda(result._id);
    setParcelasVendas(numberParcelaVenda);
  }

  async function handlePaymentOrder(value) {
    const result = await formaPagamento.find((obj) => obj._id === value);
    if (parcelasOrder.length) {
      setParcelasOrder([]);
    }
    var numberParcelaOrder = new Array();
    for (var i = 0; i < result.maxParcela; i++) {
      var model = { num: i + 1, name: `${i + 1}x` };
      await numberParcelaOrder.push(model);
    }
    if (result.accData === true) {
      await setStatusPaymentOrder("wait");
    }

    if (result.statusPay === "parc") {
      await setStatusPaymentOrder("wait");
    } else {
      await setStatusPaymentOrder("done");
      await setMaxParcelaOrder(0);
    }
    setPaymentOrder(result._id);
    setParcelasOrder(numberParcelaOrder);
  }

  async function sendUpdateStatusSale() {
    setLoadingUpdate(true);
    await api
      .put(`/payments/changePaymentSale/${idPagamento}`, {
        statusPay: status,
      })
      .then((response) => {
        success("Sucesso", response.data.message);
        setLoadingUpdate(false);
        finder();
        setModalStatusPaymentSale(false);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoadingUpdate(false);
      });
  }

  async function sendUpdateStatusOrder() {
    setLoadingUpdate(true);
    await api
      .put(`/payments/changePaymentOrder/${idPagamentoOrder}`, {
        statusPay: statusOrder,
      })
      .then((response) => {
        success("Sucesso", response.data.message);
        setLoadingUpdate(false);
        finder();
        setModalStatusPaymentOrder(false);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoadingUpdate(false);
      });
  }

  async function newPaymentSale(id) {
    const result = await pagamentosVendas.find((obj) => obj._id === id);
    await setSaleToUpdate(result);
    await setTotalPayVendasValue(result.value);
    setModalFinishPaymentVenda(true);
  }

  async function newPaymentOrder(id) {
    const result = await pagamentosOrdens.find((obj) => obj._id === id);
    await setOrderToUpdate(result);
    await setTotalPayOrdensValue(result.value);
    setModalFinishPaymentOrder(true);
  }

  async function createNewPaymentSale() {
    setLoadingUpdate(true);
    await api
      .post("/payments/newPaymentParcelVendas", {
        oldSale: saleToUpdate,
        payments: {
          paymentId: paymentVenda,
          total: totalPayVendasValue,
          parcelas: maxParcelaVendas,
          statusPayment: statusPaymentFirst,
        },
      })
      .then((response) => {
        success("Sucesso", response.data.message);
        setLoadingUpdate(false);
        setModalFinishPaymentVenda(false);
        handleCancel();
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoadingUpdate(false);
      });
  }

  async function createNewPaymentOrder() {
    setLoadingUpdate(true);
    await api
      .post("/payments/newPaymentParcelOrdens", {
        oldSale: orderToUpdate,
        payments: {
          paymentId: paymentOrder,
          total: totalPayOrdensValue,
          parcelas: maxParcelaOrder,
          statusPayment: statusPaymentOrder,
        },
      })
      .then((response) => {
        success("Sucesso", response.data.message);
        setLoadingUpdate(false);
        setModalFinishPaymentOrder(false);
        handleCancel();
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoadingUpdate(false);
      });
  }

  async function verifyPaymentSale(id) {
    setModalVerify(true);
    await api
      .post("/payments/verifyPaymentSale", {
        idPayment: id,
      })
      .then((response) => {
        info("Informação", response.data.message);
        setModalVerify(false);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setModalVerify(false);
      });
  }

  async function verifyPaymentOrder(id) {
    setModalVerify(true);
    await api
      .post("/payments/verifyPaymentOrder", {
        idPayment: id,
      })
      .then((response) => {
        info("Informação", response.data.message);
        setModalVerify(false);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setModalVerify(false);
      });
  }

  const columnsPaymentVendas = [
    {
      title: "Cliente",
      dataIndex: "cliente.name",
      key: "cliente.name",
    },
    {
      title: "Forma Pagamento",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Data Vencimento",
      dataIndex: "datePay",
      key: "datePay",
      align: "center",
      width: "15%",
    },
    {
      title: "Status Pagamento",
      dataIndex: "statusPay",
      key: "statusPay",
      render: (value, id) => (
        <>
          {id.boleto === true && (
            <>
              {value === "wait" && (
                <Tooltip
                  placement="top"
                  title="Clique para verificar pagamento"
                >
                  <Button
                    type="link"
                    size="small"
                    style={{
                      backgroundColor: "#ffeb3b",
                      color: "#444",
                      width: "100%",
                      fontWeight: "bold",
                    }}
                    onClick={() => verifyPaymentSale(id._id)}
                  >
                    Em Aberto
                  </Button>
                </Tooltip>
              )}
              {value === "pay" && (
                <Button
                  type="link"
                  size="small"
                  style={{
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    width: "100%",
                    fontWeight: "bold",
                  }}
                >
                  Pago
                </Button>
              )}
            </>
          )}
          {id.boleto === false && (
            <>
              {value === "wait" && (
                <Tooltip
                  placement="top"
                  title="Clique alterar o status do pagamento"
                >
                  <Button
                    type="link"
                    size="small"
                    style={{
                      backgroundColor: "#ffeb3b",
                      color: "#444",
                      width: "100%",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleChangeStatusSale(id)}
                  >
                    Em Aberto
                  </Button>
                </Tooltip>
              )}
              {value === "pay" && (
                <Button
                  type="link"
                  size="small"
                  style={{
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    width: "100%",
                    fontWeight: "bold",
                  }}
                >
                  Pago
                </Button>
              )}
            </>
          )}
        </>
      ),
      align: "center",
      width: "15%",
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
      render: (value) => (
        <Statistic
          value={value}
          precision={2}
          prefix="R$"
          valueStyle={{ fontSize: 15.5 }}
        />
      ),
      align: "right",
      width: "15%",
    },
    {
      title: "Ações",
      dataIndex: "_id",
      key: "_id",
      render: (id, opt) => (
        <>
          <Tooltip placement="top" title="Novo Pagamento">
            <Button
              shape="circle"
              icon="dollar"
              type="primary"
              size="small"
              style={{ marginRight: 5 }}
              onClick={() => newPaymentSale(id)}
            />
          </Tooltip>
        </>
      ),
      width: "9%",
      align: "center",
    },
  ];

  const columnsPaymentOrdens = [
    {
      title: "Cliente",
      dataIndex: "cliente.name",
      key: "cliente.name",
    },
    {
      title: "Forma Pagamento",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Data Vencimento",
      dataIndex: "datePay",
      key: "datePay",
      align: "center",
      width: "15%",
    },
    {
      title: "Status Pagamento",
      dataIndex: "statusPay",
      key: "statusPay",
      render: (value, id) => (
        <>
          {id.boleto === true && (
            <>
              {value === "wait" && (
                <Tooltip
                  placement="top"
                  title="Clique para verificar pagamento"
                >
                  <Button
                    type="link"
                    size="small"
                    style={{
                      backgroundColor: "#ffeb3b",
                      color: "#444",
                      width: "100%",
                      fontWeight: "bold",
                    }}
                    onClick={() => verifyPaymentOrder(id._id)}
                  >
                    Em Aberto
                  </Button>
                </Tooltip>
              )}
              {value === "pay" && (
                <Button
                  type="link"
                  size="small"
                  style={{
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    width: "100%",
                    fontWeight: "bold",
                  }}
                >
                  Pago
                </Button>
              )}
            </>
          )}
          {id.boleto === false && (
            <>
              {value === "wait" && (
                <Tooltip
                  placement="top"
                  title="Clique alterar o status do pagamento"
                >
                  <Button
                    type="link"
                    size="small"
                    style={{
                      backgroundColor: "#ffeb3b",
                      color: "#444",
                      width: "100%",
                      fontWeight: "bold",
                    }}
                    onClick={() => handleChangeStatusOrder(id)}
                  >
                    Em Aberto
                  </Button>
                </Tooltip>
              )}
              {value === "pay" && (
                <Button
                  type="link"
                  size="small"
                  style={{
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    width: "100%",
                    fontWeight: "bold",
                  }}
                >
                  Pago
                </Button>
              )}
            </>
          )}
        </>
      ),
      align: "center",
      width: "15%",
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
      render: (value) => (
        <Statistic
          value={value}
          precision={2}
          prefix="R$"
          valueStyle={{ fontSize: 15.5 }}
        />
      ),
      align: "right",
      width: "15%",
    },
    {
      title: "Ações",
      dataIndex: "_id",
      key: "_id",
      render: (id, opt) => (
        <>
          <Tooltip placement="top" title="Novo Pagamento">
            <Button
              shape="circle"
              icon="dollar"
              type="primary"
              size="small"
              style={{ marginRight: 5 }}
              onClick={() => newPaymentOrder(id)}
            />
          </Tooltip>
        </>
      ),
      width: "9%",
      align: "center",
    },
  ];

  return (
    <Spin spinning={spinner} size="large">
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
          {find === 1 && (
            <p style={{ marginBottom: -3, marginTop: -1 }}>
              Tipo dos dados: <strong>Todos os Débitos</strong>
            </p>
          )}
          {find === 2 && (
            <p style={{ marginBottom: -3, marginTop: -1 }}>
              Tipo dos dados:{" "}
              <strong>{`Débitos do cliente: ${clientName}`}</strong>
            </p>
          )}
        </Card>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button
            icon="reload"
            type="default"
            style={{ marginRight: 10 }}
            onClick={() => finder()}
          >
            Atualizar Dados
          </Button>

          <Button
            icon="search"
            type="primary"
            onClick={() => setModalSearch(true)}
          >
            Busca Avançada
          </Button>
        </div>
      </div>

      <Tabs defaultActiveKey="1" type="card" tabPosition="left">
        <TabPane
          tab={
            <span>
              <Icon type="shopping" />
              <span>Vendas</span>
            </span>
          }
          key="1"
        >
          <Table
            pagination={{ pageSize: 10 }}
            columns={columnsPaymentVendas}
            dataSource={pagamentosVendas}
            rowKey={(pay) => pay._id}
            size="small"
            style={{ marginBottom: 10 }}
          />

          <Descriptions bordered size="small">
            <Descriptions.Item label="TOTAL DOS DÉBITOS" span={3}>
              <Statistic
                value={resultado}
                valueStyle={{ fontSize: 15.5 }}
                prefix="R$"
                precision={2}
              />
            </Descriptions.Item>
          </Descriptions>
        </TabPane>

        <TabPane
          tab={
            <span>
              <Icon type="file-sync" />
              <span>Ordens</span>
            </span>
          }
          key="2"
        >
          <Table
            pagination={{ pageSize: 10 }}
            columns={columnsPaymentOrdens}
            dataSource={pagamentosOrdens}
            rowKey={(pay) => pay._id}
            size="small"
            style={{ marginBottom: 10 }}
          />

          <Descriptions bordered size="small">
            <Descriptions.Item label="TOTAL DOS DÉBITOS" span={3}>
              <Statistic
                value={resultado}
                valueStyle={{ fontSize: 15.5 }}
                prefix="R$"
                precision={2}
              />
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
      </Tabs>

      <Modal
        visible={modalSearch}
        onCancel={() => setModalSearch(false)}
        title="Buscar Débitos"
        footer={[
          <Button
            key="back"
            icon="close"
            type="danger"
            onClick={() => setModalSearch(false)}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            icon="search"
            type="primary"
            loading={loading}
            onClick={() => finder()}
          >
            Buscar
          </Button>,
        ]}
      >
        <label>Selecione um tipo de busca:</label>
        <Select
          value={find}
          style={{ width: "100%" }}
          onChange={(value) => setFind(value)}
        >
          <Option value={1}>Todos os Débitos</Option>
          <Option value={2}>Débitos por Cliente</Option>
        </Select>

        {find === 2 && (
          <>
            <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
              SELECIONE O CLIENTE
            </Divider>
            <TreeSelect
              showSearch
              style={{ width: "100%" }}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              value={clientName}
              treeDefaultExpandAll
              onChange={(value) => handleClient(value)}
            >
              {clients.map((client) => (
                <TreeNode
                  value={client.name}
                  title={client.name}
                  key={client._id}
                />
              ))}
            </TreeSelect>
          </>
        )}
      </Modal>

      <Modal
        visible={modalStatusPaymentSale}
        onCancel={() => setModalStatusPaymentSale(false)}
        title="Alterar Status do Pagamento de Vendas"
        footer={[
          <Button
            key="back"
            icon="close"
            type="danger"
            onClick={() => setModalStatusPaymentSale(false)}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            icon="save"
            type="primary"
            loading={loadingUpdate}
            onClick={() => sendUpdateStatusSale()}
          >
            Salvar
          </Button>,
        ]}
      >
        <Descriptions size="small" bordered>
          <Descriptions.Item label="Cliente" span={3}>
            {clienteTitulo}
          </Descriptions.Item>
          <Descriptions.Item label="Pagamento" span={3}>
            {descriptionsPay}
          </Descriptions.Item>
          <Descriptions.Item label="Vencimento" span={3}>
            {dataVencimento}
          </Descriptions.Item>
        </Descriptions>

        <Card
          style={{ marginTop: 15 }}
          size="small"
          title="Selecione uma opção"
        >
          <Radio.Group
            onChange={(e) => setStatus(e.target.value)}
            value={status}
          >
            <Radio value={"wait"}>
              <Icon type="hourglass" /> Em Aberto
            </Radio>
            <Radio value={"pay"}>
              <Icon type="check" /> Pago
            </Radio>
          </Radio.Group>
        </Card>
      </Modal>

      <Modal
        visible={modalStatusPaymentOrder}
        onCancel={() => setModalStatusPaymentOrder(false)}
        title="Alterar Status do Pagamento de Ordens de Serviço"
        footer={[
          <Button
            key="back"
            icon="close"
            type="danger"
            onClick={() => setModalStatusPaymentOrder(false)}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            icon="save"
            type="primary"
            loading={loadingUpdate}
            onClick={() => sendUpdateStatusOrder()}
          >
            Salvar
          </Button>,
        ]}
      >
        <Descriptions size="small" bordered>
          <Descriptions.Item label="Cliente" span={3}>
            {clienteTituloOrder}
          </Descriptions.Item>
          <Descriptions.Item label="Pagamento" span={3}>
            {descriptionsPayOrder}
          </Descriptions.Item>
          <Descriptions.Item label="Vencimento" span={3}>
            {dataVencimentoOrder}
          </Descriptions.Item>
        </Descriptions>

        <Card
          style={{ marginTop: 15 }}
          size="small"
          title="Selecione uma opção"
        >
          <Radio.Group
            onChange={(e) => setStatusOrder(e.target.value)}
            value={statusOrder}
          >
            <Radio value={"wait"}>
              <Icon type="hourglass" /> Em Aberto
            </Radio>
            <Radio value={"pay"}>
              <Icon type="check" /> Pago
            </Radio>
          </Radio.Group>
        </Card>
      </Modal>

      <Modal
        visible={modalFinishPaymentVenda}
        onCancel={() => handleCancel()}
        title="Finalizar Pagamentos de Vendas"
        footer={[
          <Button
            key="back"
            icon="close"
            type="danger"
            onClick={() => handleCancel()}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            icon="check"
            type="primary"
            loading={loadingUpdate}
            onClick={() => createNewPaymentSale()}
          >
            Finalizar
          </Button>,
        ]}
        width="60%"
        style={{ top: 15 }}
      >
        <Card
          size="small"
          style={{ backgroundColor: "#001529", marginBottom: 10 }}
          bordered={false}
        >
          <Row>
            <Icon
              type="shopping"
              style={{ fontSize: 20, color: "#fff", marginRight: 15 }}
            />
            <span style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              TOTAL DAS VENDAS
            </span>
          </Row>
        </Card>

        <Row gutter={10}>
          <Col span={24}>
            <label>Valor</label>
            <Input
              type="number"
              addonAfter="R$"
              size="large"
              value={totalPayVendasValue}
              onChange={(e) =>
                setTotalPayVendasValue(parseFloat(e.target.value))
              }
            />
          </Col>
        </Row>

        <Row gutter={10} style={{ marginTop: 10 }}>
          <Col span={12}>
            <label>Forma de Pagamento</label>
            <Select
              size="large"
              value={paymentVenda}
              style={{ width: "100%" }}
              onChange={(value) => handlePaymentVenda(value)}
            >
              {formaPagamento.map((forma) => (
                <Option value={forma._id} key={forma._id}>
                  {forma.name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col span={12}>
            {!!parcelasVendas.length && (
              <>
                <label>Parcelas</label>
                <Select
                  value={maxParcelaVendas}
                  size="large"
                  style={{ width: "100%" }}
                  onChange={(value) => setMaxParcelaVendas(value)}
                >
                  {parcelasVendas.map((max) => (
                    <Option value={max.num} key={max.num}>
                      {max.name}
                    </Option>
                  ))}
                </Select>
              </>
            )}
          </Col>
        </Row>
      </Modal>

      <Modal
        visible={modalFinishPaymentOrder}
        onCancel={() => handleCancel()}
        title="Finalizar Pagamentos de Ordens de Serviços"
        footer={[
          <Button
            key="back"
            icon="close"
            type="danger"
            onClick={() => handleCancel()}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            icon="check"
            type="primary"
            loading={loadingUpdate}
            onClick={() => createNewPaymentOrder()}
          >
            Finalizar
          </Button>,
        ]}
        width="60%"
        style={{ top: 15 }}
      >
        <Card
          size="small"
          style={{
            backgroundColor: "#001529",
            marginBottom: 10,
            marginTop: 15,
          }}
          bordered={false}
        >
          <Row>
            <Icon
              type="file-sync"
              style={{ fontSize: 20, color: "#fff", marginRight: 15 }}
            />
            <span style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              TOTAL DAS ORDENS DE SERVIÇO
            </span>
          </Row>
        </Card>

        <Row gutter={10}>
          <Col span={24}>
            <label>Valor</label>
            <Input
              type="number"
              addonAfter="R$"
              size="large"
              value={totalPayOrdensValue}
              onChange={(e) =>
                setTotalPayOrdensValue(parseFloat(e.target.value))
              }
            />
          </Col>
        </Row>

        <Row gutter={10} style={{ marginTop: 10 }}>
          <Col span={12}>
            <label>Forma de Pagamento</label>
            <Select
              size="large"
              value={paymentOrder}
              style={{ width: "100%" }}
              onChange={(value) => handlePaymentOrder(value)}
            >
              {formaPagamento.map((forma) => (
                <Option value={forma._id} key={forma._id}>
                  {forma.name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col span={12}>
            {!!parcelasOrder.length && (
              <>
                <label>Parcelas</label>
                <Select
                  value={maxParcelaOrder}
                  size="large"
                  style={{ width: "100%" }}
                  onChange={(value) => setMaxParcelaOrder(value)}
                >
                  {parcelasOrder.map((max) => (
                    <Option value={max.num} key={max.num}>
                      {max.name}
                    </Option>
                  ))}
                </Select>
              </>
            )}
          </Col>
        </Row>
      </Modal>

      <Modal
        visible={modalVerify}
        closable={false}
        title={false}
        footer={false}
        centered
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Icon type="loading" style={{ fontSize: 80 }} />

          <p
            style={{
              marginTop: 30,
              fontSize: 25,
              fontWeight: "bold",
              marginBottom: -10,
            }}
          >
            Verificando Pagamento...
          </p>
        </div>
      </Modal>
    </Spin>
  );
}
