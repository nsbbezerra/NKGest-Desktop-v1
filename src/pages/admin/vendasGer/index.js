import React, { useState, useEffect } from "react";
import {
  Icon,
  Button,
  Spin,
  Modal,
  Select,
  TreeSelect,
  Divider,
  Tabs,
  Table,
  Tooltip,
  Statistic,
  Input,
  Descriptions,
  Layout,
  Menu,
} from "antd";
import { Link } from "react-router-dom";
import { Header } from "../../../styles/styles";
import api from "../../../config/axios";
import PrintSale from "../../../templates/printSale";
import PrintOrder from "../../../templates/printOrder";

const { TreeNode } = TreeSelect;
const { Option } = Select;
const { TabPane } = Tabs;
const { Content, Sider } = Layout;

export default function GerVendas() {
  const [find, setFind] = useState(1);
  const [modalSearch, setModalSearch] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawerVendas, setDrawerVendas] = useState(false);
  const [drawerOrdens, setDrawerOrdens] = useState(false);
  const [modalDelVenda, setModalDelVenda] = useState(false);
  const [modalDelOrdem, setModalDelOrdem] = useState(false);
  const [loadingDelOrder, setLoadingDelOrder] = useState(false);
  const [loadingDelSale, setLoadingDelSale] = useState(false);
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [modalPrintSale, setModalPrintSale] = useState(false);
  const [modalPrintOrder, setModalPrintOrder] = useState(false);

  const [clientes, setClientes] = useState([]);
  const [enderecos, setEnderecos] = useState([]);
  const [number, setNumber] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientView, setClientView] = useState("");
  const [clientToPrint, setClientToPrint] = useState({});
  const [addressToPrint, setAddressToPrint] = useState({});
  const [orderToPrint, setOrderToPrint] = useState({});

  const [vendas, setVendas] = useState([]);
  const [ordens, setOrdens] = useState([]);
  const [dados, setDados] = useState({});

  const [pagamentos, setPagamentos] = useState([]);

  const [vendaToDel, setVendaToDel] = useState("");
  const [ordemToDel, setOrdemToDel] = useState("");
  const [descontoValue, setDescontoValue] = useState(0);
  const [brutoValue, setBrutoValue] = useState(0);
  const [liquidValue, setLiquidoValue] = useState(0);

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

  async function findDados() {
    setSpinner(true);
    await api
      .get("/organization/find")
      .then((response) => {
        setDados(response.data.empresa);
        setSpinner(false);
      })
      .catch((error) => {
        erro("Erro", error.message);
        setSpinner(false);
      });
  }

  async function finder() {
    setLoading(true);
    await api
      .post("/admin/findAllSalesAndOrders", {
        find: find,
        client: clientId,
        mes: mes,
        ano: ano,
        number: number,
      })
      .then((response) => {
        setVendas(response.data.vendas);
        setOrdens(response.data.ordens);
        setLoading(false);
        setModalSearch(false);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoading(false);
        setModalSearch(false);
      });
  }

  async function findAddress() {
    setSpinner(true);
    await api
      .get("/orders/findAllAddress")
      .then((response) => {
        setEnderecos(response.data.address);
        setSpinner(false);
      })
      .catch((error) => {
        setSpinner(false);
        erro("Erro", error.response.data.message);
      });
  }

  async function FindClients() {
    setSpinner(true);
    await api
      .get("/register/listClientes")
      .then((response) => {
        setClientes(response.data.clientes);
        setSpinner(false);
      })
      .catch((error) => {
        setSpinner(false);
        erro("Erro", error.message);
      });
  }

  useEffect(() => {
    FindClients();
    findAddress();
    finder();
    findDados();
  }, []);

  async function handleClient(client) {
    const result = await clientes.find((obj) => obj.name === client);
    await setClientId(result._id);
    await setClientName(client);
  }

  async function FindPaymentSale(id) {
    setSpinner(true);
    await api
      .post("/orders/findPayForm", {
        order: id,
      })
      .then((response) => {
        setPagamentos(response.data.pagamentos);
        setDrawerVendas(true);
        setSpinner(false);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setSpinner(false);
      });
  }

  async function FindPaymentService(id) {
    setSpinner(true);
    await api
      .post("/orders/findPayFormOrder", {
        order: id,
      })
      .then((response) => {
        setPagamentos(response.data.pagamentos);
        setDrawerOrdens(true);
        setSpinner(false);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setSpinner(false);
      });
  }

  async function viewInfoServicesPay(id) {
    const result = await ordens.find((obj) => obj._id === id);
    await setClientView(result.client.name);
    await setOrderToPrint(result);
    await FindPaymentService(result._id);
    await setDescontoValue(result.desconto);
    await setBrutoValue(result.valueBruto);
    await setLiquidoValue(result.valueLiquido);
  }

  async function viewInfoSalePay(id) {
    const result = await vendas.find((obj) => obj._id === id);
    await setClientView(result.client.name);
    await setOrderToPrint(result);
    await FindPaymentSale(result._id);
    await setDescontoValue(result.desconto);
    await setBrutoValue(result.valueBruto);
    await setLiquidoValue(result.valueLiquido);
  }

  async function handleDelVenda(id) {
    await setVendaToDel(id);
    setModalDelVenda(true);
  }

  async function handleDelOrdem(id) {
    await setOrdemToDel(id);
    setModalDelOrdem(true);
  }

  async function delVenda() {
    setLoadingDelSale(true);
    await api
      .delete(`/orders/cancelSale/${vendaToDel}`)
      .then((response) => {
        success("Sucesso", response.data.message);
        setLoadingDelSale(false);
        setModalDelVenda(false);
        finder();
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoadingDelSale(false);
      });
  }

  async function delOrdem() {
    setLoadingDelOrder(true);
    await api
      .delete(`/orders/cancelOrdem/${ordemToDel}`)
      .then((response) => {
        success("Sucesso", response.data.message);
        setLoadingDelOrder(false);
        setModalDelOrdem(false);
        finder();
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoadingDelOrder(false);
      });
  }

  async function handlePrintSale(id) {
    const result = await vendas.find((obj) => obj._id === id);
    const address = await enderecos.find(
      (obj) => obj.client._id === result.client._id
    );
    const client = await clientes.find((obj) => obj._id === result.client._id);
    await setOrderToPrint(result);
    await setAddressToPrint(address);
    await setClientToPrint(client);
    setModalPrintSale(true);
  }

  async function handlePrintOrder(id) {
    const result = await ordens.find((obj) => obj._id === id);
    const address = await enderecos.find(
      (obj) => obj.client._id === result.client._id
    );
    const client = await clientes.find((obj) => obj._id === result.client._id);
    await setOrderToPrint(result);
    await setAddressToPrint(address);
    await setClientToPrint(client);
    setModalPrintOrder(true);
  }

  function replaceValue(value) {
    let casas = Math.pow(10, 2);
    return Math.floor(value * casas) / casas;
  }

  const columnSalesPay = [
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
      title: "Valor Total",
      dataIndex: "valueLiquido",
      key: "valueLiquido",
      render: (valor) => (
        <Statistic
          value={valor}
          precision={2}
          prefix="R$"
          valueStyle={{ fontSize: 15.5 }}
        />
      ),
      align: "right",
    },
    {
      title: "Data",
      dataIndex: "createDate",
      key: "createDate",
      align: "center",
    },
    {
      title: "Pago?",
      dataIndex: "statusPay",
      key: "statusPay",
      render: (act) => (
        <>
          {act === "pay" && (
            <Icon
              type="check"
              style={{ color: "#4caf50", fontWeight: "bold", fontSize: 17 }}
            />
          )}
          {act === "wait" && (
            <Icon
              type="stop"
              style={{ color: "#f44336", fontWeight: "bold", fontSize: 17 }}
            />
          )}
        </>
      ),
      align: "center",
      width: "8%",
    },
    {
      title: "Ações",
      dataIndex: "_id",
      key: "_id",
      render: (id) => (
        <>
          <Tooltip placement="top" title="Imprimir">
            <Button
              style={{ marginRight: 5 }}
              icon="printer"
              type="default"
              shape="circle"
              size="small"
              onClick={() => handlePrintSale(id)}
            />
          </Tooltip>
          <Tooltip placement="top" title="Vizualizar Informações">
            <Button
              style={{ marginRight: 5 }}
              icon="zoom-in"
              type="primary"
              shape="circle"
              size="small"
              onClick={() => viewInfoSalePay(id)}
            />
          </Tooltip>
          <Tooltip placement="top" title="Cancelar Venda">
            <Button
              icon="close"
              type="danger"
              shape="circle"
              size="small"
              onClick={() => handleDelVenda(id)}
            />
          </Tooltip>
        </>
      ),
      width: "10%",
      align: "center",
    },
  ];

  const columnServicesPay = [
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
      title: "Valor Total",
      dataIndex: "valueLiquido",
      key: "valueLiquido",
      render: (valor) => (
        <Statistic
          value={valor}
          precision={2}
          prefix="R$"
          valueStyle={{ fontSize: 15.5 }}
        />
      ),
      align: "right",
    },
    {
      title: "Data",
      dataIndex: "createDate",
      key: "createDate",
      align: "center",
    },
    {
      title: "Pago?",
      dataIndex: "statusPay",
      key: "statusPay",
      render: (act) => (
        <>
          {act === "pay" && (
            <Icon
              type="check"
              style={{ color: "#4caf50", fontWeight: "bold", fontSize: 17 }}
            />
          )}
          {act === "wait" && (
            <Icon
              type="stop"
              style={{ color: "#f44336", fontWeight: "bold", fontSize: 17 }}
            />
          )}
        </>
      ),
      align: "center",
      width: "8%",
    },
    {
      title: "Ações",
      dataIndex: "_id",
      key: "_id",
      render: (id) => (
        <>
          <Tooltip placement="top" title="Imprimir">
            <Button
              style={{ marginRight: 5 }}
              icon="printer"
              type="default"
              shape="circle"
              size="small"
              onClick={() => handlePrintOrder(id)}
            />
          </Tooltip>
          <Tooltip placement="top" title="Vizualizar Informações">
            <Button
              style={{ marginRight: 5 }}
              icon="zoom-in"
              type="primary"
              shape="circle"
              size="small"
              onClick={() => viewInfoServicesPay(id)}
            />
          </Tooltip>
          <Tooltip placement="top" title="Cancelar Ordem">
            <Button
              icon="close"
              type="danger"
              shape="circle"
              size="small"
              onClick={() => handleDelOrdem(id)}
            />
          </Tooltip>
        </>
      ),
      width: "10%",
      align: "center",
    },
  ];

  const columnsProduct = [
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
      title: "Preço Uni",
      dataIndex: "valueUnit",
      key: "valueUnit",
      render: (value) => (
        <Statistic
          value={value}
          valueStyle={{ fontSize: 15.5 }}
          prefix="R$"
          precision={2}
        />
      ),
      width: "12%",
      align: "right",
    },
    {
      title: "Preço Tot",
      dataIndex: "valueTotal",
      key: "valueTotal",
      render: (value) => (
        <Statistic
          value={value}
          valueStyle={{ fontSize: 15.5 }}
          prefix="R$"
          precision={2}
        />
      ),
      width: "12%",
      align: "right",
    },
  ];

  const columnsService = [
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
          valueStyle={{ fontSize: 15.5 }}
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
          valueStyle={{ fontSize: 15.5 }}
          prefix="R$"
          precision={2}
        />
      ),
      width: "12%",
      align: "right",
    },
  ];

  const dataResume = [
    {
      key: "1",
      info: "TOTAL BRUTO",
      value: `R$ ${orderToPrint.valueBruto}`,
    },
    {
      key: "2",
      info: "DESCONTO",
      value: `% ${orderToPrint.desconto}`,
    },
    {
      key: "3",
      info: "TOTAL A PAGAR",
      value: `R$ ${orderToPrint.valueLiquido}`,
    },
  ];

  const columnsResume = [
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

  const DataAtual = new Date();
  const Ano = DataAtual.getFullYear();

  return (
    <>
      <Header style={{ marginBottom: 10 }}>
        <p
          style={{
            fontWeight: "bold",
            marginBottom: -0.01,
            fontSize: 18,
          }}
        >
          <Icon type="shopping" style={{ fontSize: 20 }} />
          GERENCIAR VENDAS / GERENCIAR ORDENS DE SERVIÇO
        </p>
        <Link to="/">
          <Button type="danger" shape="circle" icon="close" size="small" />
        </Link>
      </Header>
      <Tabs>
        <TabPane
          tab={
            <span>
              <Icon type="shopping" />
              Vendas
            </span>
          }
          key="1"
        >
          <Spin spinning={spinner} size="large">
            <Button
              style={{ position: "absolute", right: 0, top: -55 }}
              icon="search"
              type="primary"
              onClick={() => setModalSearch(true)}
            >
              Busca Avançada
            </Button>
            <Table
              columns={columnSalesPay}
              dataSource={vendas}
              size="small"
              rowKey={(cli) => cli._id}
            />
          </Spin>
        </TabPane>
        <TabPane
          tab={
            <span>
              <Icon type="file-text" />
              Ordens de Serviço
            </span>
          }
          key="2"
        >
          <Spin spinning={spinner} size="large">
            <Button
              style={{ position: "absolute", right: 0, top: -55 }}
              icon="search"
              type="primary"
              onClick={() => setModalSearch(true)}
            >
              Busca Avançada
            </Button>
            <Table
              pagination={{ pageSize: 10 }}
              columns={columnServicesPay}
              dataSource={ordens}
              size="small"
              rowKey={(cli) => cli._id}
            />
          </Spin>
        </TabPane>
      </Tabs>
      <Modal
        visible={modalSearch}
        onCancel={() => setModalSearch(false)}
        title="Buscar Vendas / Ordens de Serviço"
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
          <Option value={1}>Mês Atual</Option>
          <Option value={2}>Por Período</Option>
          <Option value={3}>Por Clientes</Option>
          <Option value={4}>Por Número da Venda / Ordem</Option>
        </Select>

        {find === 2 && (
          <>
            <Divider>Selecione o Período</Divider>
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
                value={mes}
                style={{ width: 150, marginRight: 10 }}
                onChange={(value) => setMes(value)}
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
                value={ano}
                style={{ width: 100 }}
                onChange={(value) => setAno(value)}
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

        {find === 3 && (
          <>
            <Divider>Selcione o Cliente</Divider>
            <TreeSelect
              showSearch
              style={{ width: "100%", marginBottom: 20 }}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              value={clientName}
              treeDefaultExpandAll
              onChange={(value) => handleClient(value)}
            >
              {clientes.map((client) => (
                <TreeNode
                  value={client.name}
                  title={client.name}
                  key={client._id}
                />
              ))}
            </TreeSelect>
          </>
        )}

        {find === 4 && (
          <>
            <Divider>Insira o Número da Venda / Ordem</Divider>
            <Input value={number} onChange={(e) => setNumber(e.target.value)} />
          </>
        )}
      </Modal>

      <Modal
        visible={modalDelVenda}
        title="Excluir Venda"
        closable={false}
        footer={[
          <Button
            key="back"
            icon="close"
            type="danger"
            onClick={() => setModalDelVenda(false)}
          >
            Não
          </Button>,
          <Button
            key="submit"
            icon="check"
            type="primary"
            loading={loadingDelSale}
            onClick={() => delVenda()}
          >
            Sim
          </Button>,
        ]}
      >
        <p>Deseja excluir esta venda?</p>
        <p style={{ fontStyle: "italic" }}>
          <strong>OBS:</strong> Se esta venda tiver uma nota fiscal emitida, ela
          será encaminhada automaticamente ao cancelamento.
        </p>
      </Modal>

      <Modal
        visible={modalDelOrdem}
        title="Excluir Ordem de Serviço"
        closable={false}
        footer={[
          <Button
            key="back"
            icon="close"
            type="danger"
            onClick={() => setModalDelOrdem(false)}
          >
            Não
          </Button>,
          <Button
            key="submit"
            icon="check"
            type="primary"
            loading={loadingDelOrder}
            onClick={() => delOrdem()}
          >
            Sim
          </Button>,
        ]}
      >
        <p>Deseja excluir esta ordem de serviço?</p>
        <p style={{ fontStyle: "italic" }}>
          <strong>OBS:</strong> Se esta ordem de serviço tiver uma nota fiscal
          emitida, ela será encaminhada automaticamente ao cancelamento.
        </p>
      </Modal>

      <Modal
        visible={modalPrintSale}
        title="Imprimir"
        onCancel={() => {
          setModalPrintSale(false);
        }}
        footer={false}
        width="30%"
        centered
      >
        {modalPrintSale === true && (
          <PrintSale
            empresa={dados}
            cliente={clientToPrint}
            endereco={addressToPrint}
            venda={orderToPrint}
          />
        )}
      </Modal>

      <Modal
        visible={modalPrintOrder}
        title="Imprimir"
        onCancel={() => setModalPrintOrder(false)}
        footer={false}
        width="30%"
        centered
      >
        {modalPrintOrder === true && (
          <PrintOrder
            empresa={dados}
            cliente={clientToPrint}
            endereco={addressToPrint}
            venda={orderToPrint}
          />
        )}
      </Modal>

      <Modal
        visible={drawerVendas}
        title="Informações da Venda"
        onCancel={() => setDrawerVendas(false)}
        footer={false}
        width="80%"
        centered
        bodyStyle={{ overflow: "auto", height: "87vh" }}
      >
        <Descriptions layout="vertical" bordered size="small">
          <Descriptions.Item label="Cliente" span={3}>
            {clientView}
          </Descriptions.Item>
        </Descriptions>

        <Divider>Produtos</Divider>

        <Table
          pagination={false}
          columns={columnsProduct}
          dataSource={orderToPrint.products}
          size="small"
          rowKey={(prod) => prod.product}
        />

        <Divider>Pagamentos</Divider>

        <Table
          pagination={false}
          columns={columnsPayment}
          dataSource={pagamentos}
          size="small"
          rowKey={(prod) => prod._id}
        />

        <Divider>Resumo</Divider>

        <Table
          pagination={false}
          columns={columnsResume}
          dataSource={dataResume}
          size="small"
          showHeader={false}
        />
      </Modal>

      <Modal
        visible={drawerOrdens}
        title="Informações da Ordem de Serviço"
        onCancel={() => setDrawerOrdens(false)}
        footer={false}
        width="80%"
        centered
        bodyStyle={{ overflow: "auto", height: "87vh" }}
      >
        <Descriptions layout="vertical" bordered size="small">
          <Descriptions.Item label="Cliente" span={3}>
            {clientView}
          </Descriptions.Item>
        </Descriptions>

        <Divider>Serviços</Divider>

        <Table
          pagination={false}
          columns={columnsService}
          dataSource={orderToPrint.services}
          size="small"
          rowKey={(prod) => prod.service}
        />

        <Divider>Pagamentos</Divider>

        <Table
          pagination={false}
          columns={columnsPayment}
          dataSource={pagamentos}
          size="small"
          rowKey={(prod) => prod._id}
        />

        <Divider>Resumo</Divider>

        <Table
          pagination={false}
          columns={columnsResume}
          dataSource={dataResume}
          size="small"
          showHeader={false}
        />
      </Modal>
    </>
  );
}
