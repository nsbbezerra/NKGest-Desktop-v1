import React, { useState, useEffect } from "react";
import {
  Icon,
  Button,
  Row,
  Col,
  Input,
  Table,
  Card,
  TreeSelect,
  Divider,
  Tooltip,
  InputNumber,
  Modal,
  Select,
  Spin,
  Statistic,
  Descriptions,
  Popconfirm,
} from "antd";
import { Header } from "../../../styles/styles";
import { Link } from "react-router-dom";
import api from "../../../config/axios";
import shortId from "shortid";
import ModulePayment from "../../../components/payments";
import PrintSale from "../../../templates/printSale";

const { TreeNode } = TreeSelect;
const { Option } = Select;

export default function Orcamentos() {
  const [spinner, setSpinner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSale, setLoadingSale] = useState(false);
  const [modalSearch, setModalSearch] = useState(false);
  const [modalSell, setModalSell] = useState(false);
  const [modalSell2, setModalSell2] = useState(false);
  const [modalAuth, setModalAuth] = useState(false);
  const [loadingAutenticate, setLoadingAutenticate] = useState(false);
  const [modalSendSell, setModalSendSell] = useState(false);
  const [modalFinished, setModalFinished] = useState(false);
  const [loadingOrcament, setLoadingOrcament] = useState(false);
  const [modalPrint, setModalPrint] = useState(false);

  const [dados, setDados] = useState({});

  const [clients, setClients] = useState([]);
  const [funcs, setFuncs] = useState([]);
  const [enderecos, setEnderecos] = useState([]);

  const [searchType, setSearchType] = useState(null);
  const [funcionario, setFuncionario] = useState("");
  const [funcName, setFuncName] = useState("");
  const [cliente, setCliente] = useState("");
  const [clientName, setClientName] = useState("");
  const [mes2, setMes2] = useState("");
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [numberSale, setNumberSale] = useState("");

  const [orcaments, setOrcaments] = useState([]);
  const [ordem, setOrdem] = useState({});
  const [address, setAddress] = useState({});
  const [clientObj, setClientObj] = useState({});
  const [paymentsSale, setPaymentsSale] = useState([]);

  const [totalBruto, setTotalBruto] = useState(0);
  const [totalLiquid, setTotalLiquid] = useState(0);
  const [desconto, setDesconto] = useState(0);
  const [colorDesc, setColorDesc] = useState("#4caf50");

  const [userFunc, setUserFunc] = useState("");
  const [passFunc, setPassFunc] = useState("");

  const [idFinishedSale, setIdFinishedSale] = useState("");
  const [desc, setDesc] = useState(0);
  const [liquid, setLiquid] = useState(0);
  const [brut, setBrut] = useState(0);
  const [orderFim, setOrderFim] = useState({});
  const [productOrder, setProductOrder] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalAllOrders, setTotalAllOrders] = useState([]);
  const [totalfinishAllOrders, setTotalFinishAllOrders] = useState(0);

  const [clientToOrcament, setClientToOrcament] = useState("");
  const [clientToOrcamentName, setClientToOrcamentName] = useState("");
  const [disableConverOrca, setDisableConvertOrca] = useState(true);
  const [disableCalcOrcament, setDisableCalcOrcament] = useState(true);
  const [newProducts, setNewProducts] = useState([]);
  const [idVendedor, setIdVendedor] = useState("");
  const [observation, setObservation] = useState("");
  const [clienteNomeDesc, setClienteNomeDesc] = useState("");

  const [viewNewProducts, setViewNewProducts] = useState(false);

  var arrayAllOrders = new Array();
  var arrayNewProducts = new Array();

  async function calculatorOrcaments() {
    await selectedRowKeys.map((row) => {
      calculate(row);
    });
    await setTotalAllOrders(arrayAllOrders);
    setDisableConvertOrca(false);
  }

  async function calculate(id) {
    const result = await orcaments.find((obj) => obj._id === id);
    if (clientToOrcament === "") {
      const ender = await enderecos.find(
        (obj) => obj.client._id === result.client._id
      );
      const cli = await clients.find((obj) => obj._id === result.client._id);
      await setClientToOrcament(result.client._id);
      await setClientToOrcamentName(result.client.name);
      await setClienteNomeDesc(result.client.name);
      await setClientObj(cli);
      await setAddress(ender);
    }
    const objec = { value: result.valueLiquido };
    await arrayAllOrders.push(objec);
  }

  useEffect(() => {
    var valores = totalAllOrders.filter((valor) => {
      return valor.value;
    });
    var calculo = valores.reduce((sum, valor) => {
      return sum + valor.value;
    }, 0);
    setTotalFinishAllOrders(calculo);
  }, [totalAllOrders]);

  async function sendFinder() {
    if (searchType === null) {
      warning("Atenção", "Selecione uma opção de busca");
      return false;
    }
    setLoading(true);
    await api
      .post("/orders/findOrcaments", {
        type: searchType,
        funcionario: funcionario,
        cliente: cliente,
        data: `${dia}/${mes}/${ano}`,
        mes: mes2,
        ano: ano,
        numberSale: numberSale,
      })
      .then((response) => {
        setEnderecos(response.data.address);
        setOrcaments(response.data.order);
        setLoading(false);
        setModalSearch(false);
        setDisableCalcOrcament(false);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoading(false);
        setModalSearch(false);
      });
  }

  async function convertToSale() {
    setLoadingSale(true);
    await api
      .put(`/orders/convertToSale/${ordem._id}`, {
        products: productOrder,
        valueBruto: totalBruto,
        valueLiquido: totalLiquid,
        desconto: desconto,
        obs: observation,
      })
      .then((response) => {
        setDesc(response.data.order.desconto);
        setLiquid(response.data.order.valueLiquido);
        setBrut(response.data.order.valueBruto);
        setIdFinishedSale(response.data.order._id);
        setOrderFim(response.data.order);
        setModalSell(false);
        setModalSendSell(true);
        setLoadingSale(false);
        if (response.data.message) {
          info(response.data.message);
        }
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoadingSale(false);
      });
  }

  function info(message) {
    Modal.info({
      title: "Informação",
      content: (
        <div>
          <p>{message}</p>
        </div>
      ),
      onOk() {},
    });
  }

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

  async function FindClients() {
    setSpinner(true);
    await api
      .get("/orders/findClientes")
      .then((response) => {
        setClients(response.data.clients);
        setSpinner(false);
      })
      .catch((error) => {
        setSpinner(false);
        erro("Erro", error.message);
      });
  }

  async function handleFinished() {
    setModalFinished(false);
    await allClear();
    await setOrcaments([]);
  }

  async function allClear() {
    await setOrderFim({});
    await setTotalLiquid(0);
    await setTotalBruto(0);
    await setDesconto(0);
    await setIdFinishedSale("");
    await setDesc(0);
    await setLiquid(0);
    await setBrut(0);
    await setPaymentsSale([]);
    await setSelectedRowKeys([]);
    await setTotalAllOrders([]);
    await setTotalFinishAllOrders(0);
    await setClientToOrcament("");
    await setClientToOrcamentName("");
    await setDisableConvertOrca(true);
    await setNewProducts([]);
    await setDisableCalcOrcament(true);
    await setObservation("");
    await setViewNewProducts(false);
    await setClienteNomeDesc("");
  }

  async function FindPayments() {
    await api
      .post("/orders/findPayForm", {
        order: idFinishedSale,
      })
      .then((response) => {
        setPaymentsSale(response.data.pagamentos);
        setModalFinished(true);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
      });
  }

  async function findFunc() {
    setSpinner(true);
    await api
      .get("/admin/findFuncionariosComissioned")
      .then((response) => {
        setFuncs(response.data.funcionarios);
        setSpinner(false);
      })
      .catch((error) => {
        erro("Erro", error.message);
        setSpinner(false);
      });
  }

  useEffect(() => {
    FindClients();
    findFunc();
    findDados();
    admin();
  }, []);

  async function admin() {
    const idVend = await sessionStorage.getItem("id");
    await setIdVendedor(idVend);
  }

  useEffect(() => {
    if (totalLiquid > totalBruto) {
      setTotalLiquid(totalBruto);
    }

    const percent = (totalLiquid / totalBruto) * 100;

    const sobra = 100 - percent;

    setDesconto(parseFloat(sobra));
  }, [totalLiquid]);

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

  useEffect(() => {
    if (Number.isNaN(desconto)) {
      setDesconto(0);
    }
    if (desconto > 20) {
      setColorDesc("#f44336");
    }
    if (desconto <= 20) {
      setColorDesc("#4caf50");
    }
  }, [desconto]);

  useEffect(() => {
    if (totalLiquid > totalBruto) {
      setTotalLiquid(totalBruto);
    }

    const percent = (totalLiquid / totalBruto) * 100;

    const sobra = 100 - percent;

    setDesconto(parseFloat(sobra));
  }, [totalLiquid]);

  function handleCancel() {
    setModalSearch(false);
    setSearchType(null);
    setAno("");
    setMes("");
    setDia("");
    setFuncionario("");
    setCliente("");
    setFuncName("");
    setMes2("");
    setClientName("");
  }

  async function handleCliente(value) {
    const result = await clients.find((obj) => obj.name === value);
    await setCliente(result._id);
    await setClientName(result.name);
  }

  async function handleVendedor(value) {
    const result = await funcs.find((obj) => obj.name === value);
    await setFuncionario(result._id);
    await setFuncName(result.name);
  }

  async function handlePrintOrca(id) {
    const result = await orcaments.find((obj) => obj._id === id);
    const ender = await enderecos.find(
      (obj) => obj.client._id === result.client._id
    );
    const clienteObj = await clients.find(
      (obj) => obj._id === result.client._id
    );
    if (!ender) {
      warning(
        "Atenção",
        "O cliente não tem um endereço cadastrado, impossível imprimir"
      );
      return false;
    }
    await setAddress(ender);
    await setClientObj(clienteObj);
    await setOrderFim(result);
    setModalPrint(true);
  }

  async function handleOrder(id) {
    const result = await orcaments.find((obj) => obj._id === id);
    const ender = await enderecos.find(
      (obj) => obj.client._id === result.client._id
    );
    const clienteObj = await clients.find(
      (obj) => obj._id === result.client._id
    );
    await setOrdem(result);
    await setProductOrder(result.products);
    if (!ender) {
      await setAddress({
        street: "",
        number: "",
        comp: "",
        bairro: "",
        city: "",
        cep: "",
        state: "",
      });
    } else {
      await setAddress(ender);
    }
    await setClientObj(clienteObj);
    await setClienteNomeDesc(clienteObj.name);
    await setTotalBruto(result.valueBruto);
    await setDesconto(result.desconto);
    await setTotalLiquid(result.valueLiquido);
    await setObservation(result.obs);
    setModalSell(true);
  }

  async function convertAllinOne() {
    await selectedRowKeys.map((selec) => {
      setProductsinArray(selec);
    });
    await setNewProducts(arrayNewProducts);
    await setViewNewProducts(true);
    setModalSell2(true);
  }

  useEffect(() => {
    var valores = newProducts.filter((valor) => {
      return valor.valueTotal;
    });
    var calculo = valores.reduce((sum, valor) => {
      return sum + valor.valueTotal;
    }, 0);
    setTotalBruto(parseFloat(calculo));
    setTotalLiquid(parseFloat(calculo));
    setDesconto(0);
  }, [newProducts]);

  async function setProductsinArray(id) {
    const result = await orcaments.find((obj) => obj._id === id);
    await result.products.map((prod) => {
      inputProducts(prod);
    });
  }

  async function inputProducts(prods) {
    const info = await {
      quantity: prods.quantity,
      product: prods.product,
      name: prods.name,
      unidade: prods.unidade,
      valueUnit: parseFloat(prods.valueUnit),
      valueTotal: parseFloat(prods.valueTotal),
      code: prods.code,
      id: shortId.generate(),
    };
    await arrayNewProducts.push(info);
  }

  async function handleAutenticate() {
    setLoadingAutenticate(true);
    await api
      .post("/orders/autenticate", {
        user: userFunc,
        password: passFunc,
      })
      .then((response) => {
        setModalAuth(false);
        setLoadingAutenticate(false);
        setUserFunc("");
        setPassFunc("");
        convertToSale();
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoadingAutenticate(false);
        setDesconto(0);
      });
  }

  function handleSaveSellInfo() {
    if (desconto > 20) {
      setModalAuth(true);
      return false;
    }
    convertToSale();
  }

  function handleDesconto() {
    setDesconto(0);
    setTotalLiquid(totalBruto);
    setModalAuth(false);
  }

  function onSelectChange(selectedRowKeys) {
    setSelectedRowKeys(selectedRowKeys);
  }

  async function saveOrcamentAll() {
    setLoadingOrcament(true);
    await api
      .put("/orders/convertManyToSale", {
        ids: selectedRowKeys,
        client: clientToOrcament,
        products: newProducts,
        statuSale: "sale",
        desconto: desconto,
        valueLiquido: totalLiquid,
        valueBruto: totalBruto,
        funcionario: idVendedor,
        obs: observation,
        address: address._id,
      })
      .then((response) => {
        setclientetoprint(response.data.ordem.client);
        setDesc(response.data.ordem.desconto);
        setLiquid(response.data.ordem.valueLiquido);
        setBrut(response.data.ordem.valueBruto);
        setIdFinishedSale(response.data.ordem._id);
        setOrderFim(response.data.ordem);
        setModalSell2(false);
        setModalSendSell(true);
        setLoadingOrcament(false);
        if (response.data.message) {
          info(response.data.message);
        }
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoadingOrcament(false);
      });
  }

  async function setclientetoprint(id) {
    const result = await clients.find((obj) => obj._id === id);
    setClientName(result.name);
  }

  async function delOrder(id) {
    setSpinner(true);
    await api
      .delete(`/orders/cancelSale/${id}`)
      .then((response) => {
        success("Sucesso", response.data.message);
        allClear();
        delItem(id);
        setSpinner(false);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setSpinner(false);
      });
  }

  function handlePrint() {
    setModalFinished(false);
    setModalPrint(true);
  }

  function handleClosePrintModal() {
    allClear();
    sendFinder();
    setModalPrint(false);
  }

  async function delItem(id) {
    const dataSource = await [...orcaments];
    setOrcaments(dataSource.filter((item) => item._id !== id));
  }

  function handleConfirm() {
    setModalSendSell(false);
    FindPayments();
  }

  function replaceValue(value) {
    let casas = Math.pow(10, 2);
    return Math.floor(value * casas) / casas;
  }

  const DataAtual = new Date();
  const Ano = DataAtual.getFullYear();

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

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
  ];

  const columns = [
    {
      title: "Nº",
      dataIndex: "number",
      key: "number",
      width: "7%",
      align: "center",
    },
    {
      title: "Cliente",
      dataIndex: "client.name",
      key: "client.name",
      width: "35%",
    },
    {
      title: "Valor Bruto",
      dataIndex: "valueBruto",
      render: (value) => (
        <Statistic
          value={value}
          valueStyle={{ fontSize: 15.5 }}
          prefix="R$"
          precision={2}
        />
      ),
      key: "valueBruto",
      width: "12%",
      align: "right",
    },
    {
      title: "Desconto",
      dataIndex: "desconto",
      key: "desconto",
      render: (value) => (
        <Statistic value={value} valueStyle={{ fontSize: 15.5 }} prefix="%" />
      ),
      width: "12%",
      align: "right",
    },
    {
      title: "Valor Total",
      dataIndex: "valueLiquido",
      key: "valueLiquido",
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
      title: "Data",
      dataIndex: "createDate",
      key: "createDate",
      width: "12%",
      align: "center",
    },
    {
      title: "Ações",
      dataIndex: "_id",
      key: "_id",
      width: "9%",
      render: (id) => (
        <>
          <Tooltip placement="top" title="Visualizar">
            <Button
              shape="circle"
              icon="printer"
              size="small"
              style={{ marginRight: 5 }}
              type="default"
              onClick={() => handlePrintOrca(id)}
            />
          </Tooltip>
          <Tooltip placement="top" title="Visualizar">
            <Button
              shape="circle"
              icon="search"
              size="small"
              style={{ marginRight: 5 }}
              type="primary"
              onClick={() => handleOrder(id)}
            />
          </Tooltip>
          <Tooltip placement="top" title="Excluir">
            <Popconfirm
              title="Deseja excluir esta venda?"
              okText="Sim"
              cancelText="Não"
              onConfirm={() => delOrder(id)}
            >
              <Icon type="close" style={{ color: "red" }} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
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
      title: "Unidade",
      dataIndex: "unidade",
      key: "unidade",
      width: "12%",
      align: "right",
    },
    {
      title: "Preço Uni",
      dataIndex: "valueUnit",
      key: "valueUnit",
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
      title: "Preço Tot",
      dataIndex: "valueTotal",
      key: "valueTotal",
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
  ];

  const dataResume = [
    {
      key: "1",
      info: "TOTAL BRUTO",
      value: `R$ ${replaceValue(brut)}`,
    },
    {
      key: "2",
      info: "DESCONTO",
      value: `% ${replaceValue(desc)}`,
    },
    {
      key: "3",
      info: "TOTAL A PAGAR",
      value: `R$ ${replaceValue(liquid)}`,
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

  return (
    <>
      <Header>
        <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
          <Icon type="container" style={{ fontSize: 20 }} /> ORÇAMENTO DE VENDAS
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            position: "absolute",
            right: 0,
            alignItems: "center",
          }}
        >
          <Link to="/">
            <Button type="danger" shape="circle" icon="close" size="small" />
          </Link>
        </div>
      </Header>

      <div style={{ marginTop: 10 }}>
        <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
          <Button
            type="primary"
            icon="search"
            onClick={() => setModalSearch(true)}
            style={{ marginRight: 10 }}
          >
            Busca Avançada
          </Button>
          <Button
            icon="calculator"
            type="default"
            onClick={() => calculatorOrcaments()}
            style={{ marginRight: 10 }}
            disabled={disableCalcOrcament}
          >
            Calcular Orçamentos
          </Button>
          <Button
            icon="check"
            type="dashed"
            onClick={() => convertAllinOne()}
            disabled={disableConverOrca}
          >
            Finalizar Orçamentos
          </Button>
        </div>

        <Spin spinning={spinner} size="large">
          <Table
            rowSelection={rowSelection}
            pagination={{ pageSize: 10 }}
            columns={columns}
            dataSource={orcaments}
            size="small"
            style={{ marginTop: 10, marginBottom: 10 }}
            rowKey={(orca) => orca._id}
          />

          <Descriptions layout="vertical" bordered size="small">
            <Descriptions.Item label="Valor Total" span={3}>{`R$ ${parseFloat(
              totalfinishAllOrders.toFixed(2)
            )}`}</Descriptions.Item>
          </Descriptions>
        </Spin>
      </div>

      <Modal
        visible={modalSearch}
        title="Busca Avançada"
        onCancel={() => handleCancel()}
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
            icon="search"
            type="primary"
            loading={loading}
            onClick={() => sendFinder()}
          >
            Buscar
          </Button>,
        ]}
        width="50%"
      >
        <label>Selecione uma opção:</label>
        <Select
          value={searchType}
          style={{ width: "100%" }}
          onChange={(value) => setSearchType(value)}
        >
          <Option value={1}>Buscar por Vendedor</Option>
          <Option value={2}>Buscar por Cliente</Option>
          <Option value={3}>Buscar por Data</Option>
          <Option value={4}>Buscar por Período</Option>
          <Option value={5}>Buscar por Número da Venda</Option>
        </Select>

        {searchType === 1 && (
          <>
            <Divider>Selecione o Vendedor</Divider>
            <TreeSelect
              showSearch
              style={{ width: "100%", marginBottom: 20 }}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              value={funcName}
              treeDefaultExpandAll
              onChange={(value) => handleVendedor(value)}
            >
              {funcs.map((fun) => (
                <TreeNode value={fun.name} title={fun.name} key={fun._id} />
              ))}
            </TreeSelect>
          </>
        )}

        {searchType === 2 && (
          <>
            <Divider>Selecione o Cliente</Divider>
            <TreeSelect
              showSearch
              style={{ width: "100%", marginBottom: 20 }}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              value={clientName}
              treeDefaultExpandAll
              onChange={(value) => handleCliente(value)}
            >
              {clients.map((cli) => (
                <TreeNode value={cli.name} title={cli.name} key={cli._id} />
              ))}
            </TreeSelect>
          </>
        )}

        {searchType === 3 && (
          <>
            <Divider>Selecione a Data</Divider>
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
                value={dia}
                style={{ width: 100, marginRight: 10 }}
                onChange={(value) => setDia(value)}
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
                value={mes}
                style={{ width: 150, marginRight: 10 }}
                onChange={(value) => setMes(value)}
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

        {searchType === 4 && (
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
                value={mes2}
                style={{ width: 150, marginRight: 10 }}
                onChange={(value) => setMes2(value)}
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

        {searchType === 5 && (
          <>
            <Divider>Digite o Número da Venda</Divider>
            <Input
              value={numberSale}
              onChange={(e) => setNumberSale(e.target.value)}
            />
          </>
        )}
      </Modal>

      <Modal
        visible={modalSell}
        title="Finalizar Venda"
        onCancel={() => setModalSell(false)}
        footer={false}
        width="95%"
        bodyStyle={{ padding: 3 }}
      >
        <Row gutter={8} style={{ height: "100%" }}>
          <Col span={17} style={{ height: "100%" }}>
            <Spin spinning={spinner} size="large">
              <Card size="small" style={{ height: "100%" }} bordered={false}>
                <Row gutter={8}>
                  <Col span={24}>
                    <label>Cliente</label>
                    <Input
                      type="text"
                      size="large"
                      value={clientObj.name}
                      readOnly
                    />
                  </Col>
                </Row>

                <Divider style={{ fontSize: 14, fontWeight: "bold" }}>
                  PRODUTOS
                </Divider>

                <Row>
                  <Col span={24} style={{ overflow: "auto" }}>
                    <Table
                      pagination={{ pageSize: 7 }}
                      columns={columnsProduct}
                      dataSource={ordem.products}
                      size="small"
                      rowKey={(prod) => prod.product}
                    />
                  </Col>
                </Row>
              </Card>
            </Spin>
          </Col>

          <Col
            span={7}
            style={{ height: "100%", borderLeft: "1px solid lightgray" }}
          >
            <Card size="small" style={{ height: "100%" }} bordered={false}>
              <Row gutter={8} style={{ minHeight: 240 }}>
                <Col span={24} style={{ marginBottom: -5 }}>
                  <Card
                    size="small"
                    bordered={false}
                    style={{ backgroundColor: "#f8f8f8" }}
                    title="Dados do cliente"
                    headStyle={{
                      backgroundColor: "#001529",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    <Row>
                      <Col span={24} style={{ marginBottom: -10 }}>
                        <label style={{ fontSize: 12 }}>CPF / CNPJ</label>
                        <p style={{ fontWeight: "bold", fontSize: 14 }}>
                          {clientObj.cpf_cnpj}
                        </p>
                      </Col>
                    </Row>

                    <Row gutter={8}>
                      <Col span={19} style={{ marginBottom: -10 }}>
                        <label style={{ fontSize: 12 }}>Endereço</label>
                        <p style={{ fontWeight: "bold", fontSize: 14 }}>
                          {address.street}
                        </p>
                      </Col>
                      <Col span={4} style={{ marginBottom: -10 }}>
                        <label
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "right",
                            fontSize: 12,
                          }}
                        >
                          Número
                        </label>
                        <p
                          style={{
                            fontWeight: "bold",
                            width: "100%",
                            textAlign: "right",
                            fontSize: 14,
                          }}
                        >
                          {address.number}
                        </p>
                      </Col>
                    </Row>

                    <Row gutter={8}>
                      <Col span={19} style={{ marginBottom: -10 }}>
                        <label style={{ fontSize: 12 }}>Cidade</label>
                        <p style={{ fontWeight: "bold" }}>{address.city}</p>
                      </Col>
                      <Col span={4} style={{ marginBottom: -10 }}>
                        <label
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "right",
                            fontSize: 12,
                          }}
                        >
                          UF
                        </label>
                        <p
                          style={{
                            fontWeight: "bold",
                            width: "100%",
                            textAlign: "right",
                            fontSize: 14,
                          }}
                        >
                          {address.state}
                        </p>
                      </Col>
                    </Row>

                    <Row gutter={8}>
                      <Col span={12} style={{ marginBottom: -10 }}>
                        <label style={{ fontSize: 12 }}>
                          Telefone Comercial
                        </label>
                        <p style={{ fontWeight: "bold", fontSize: 14 }}>
                          {clientObj.phoneComercial}
                        </p>
                      </Col>

                      <Col span={11} style={{ marginBottom: -10 }}>
                        <label
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "right",
                            fontSize: 12,
                          }}
                        >
                          Telefone Celular
                        </label>
                        <p
                          style={{
                            fontWeight: "bold",
                            width: "100%",
                            textAlign: "right",
                            fontSize: 14,
                          }}
                        >
                          {clientObj.celOne}
                        </p>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>

              <Divider style={{ marginBottom: -0.1 }} />

              <Row style={{ marginTop: 3 }}>
                <Col span={24}>
                  <label>Total Bruto</label>
                  <InputNumber
                    value={replaceValue(totalBruto)}
                    formatter={(value) => `R$ ${value}`}
                    style={{
                      width: "100%",
                      backgroundColor: "#001529",
                      color: "#fff",
                    }}
                    size="large"
                    readOnly
                  />
                </Col>
              </Row>

              <Row gutter={8} style={{ marginTop: 10 }}>
                <Col span={10}>
                  <label>Desconto</label>
                  <InputNumber
                    value={desconto}
                    formatter={(value) => `${value}%`}
                    onChange={(value) => setDesconto(value)}
                    style={{ width: "100%", backgroundColor: colorDesc }}
                    size="large"
                  />
                </Col>

                <Col span={14}>
                  <label>Total Líquido</label>
                  <Input
                    value={replaceValue(totalLiquid)}
                    style={{ width: "100%" }}
                    size="large"
                    onChange={(e) => setTotalLiquid(e.target.value)}
                    addonBefore="R$"
                  />
                </Col>
              </Row>

              <Row style={{ marginTop: 15 }}>
                <Col span={24}>
                  <Button
                    size="large"
                    type="primary"
                    icon="check"
                    style={{ width: "100%" }}
                    loading={loadingSale}
                    onClick={() => handleSaveSellInfo()}
                  >
                    Finalizar venda
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Modal>

      <Modal
        visible={modalSell2}
        title="Finalizar Venda"
        onCancel={() => setModalSell2(false)}
        footer={false}
        width="95%"
        bodyStyle={{ padding: 3 }}
        style={{ top: 20 }}
      >
        <Row gutter={8} style={{ height: "100%" }}>
          <Col span={17} style={{ height: "100%" }}>
            <Spin spinning={spinner} size="large">
              <Card size="small" style={{ height: "100%" }} bordered={false}>
                <Row gutter={8}>
                  <Col span={24}>
                    <label>Cliente</label>
                    <Input
                      type="text"
                      size="large"
                      value={clientToOrcamentName}
                      readOnly
                    />
                  </Col>
                </Row>

                <Divider style={{ fontSize: 14, fontWeight: "bold" }}>
                  PRODUTOS
                </Divider>

                <Row>
                  <Col span={24} style={{ overflow: "auto" }}>
                    <Table
                      pagination={{ pageSize: 7 }}
                      columns={columnsProduct}
                      dataSource={newProducts}
                      size="small"
                      rowKey={(prod) => prod.id}
                    />
                  </Col>
                </Row>
              </Card>
            </Spin>
          </Col>

          <Col
            span={7}
            style={{ height: "100%", borderLeft: "1px solid lightgray" }}
          >
            <Card size="small" style={{ height: "100%" }} bordered={false}>
              <Row gutter={8} style={{ minHeight: 240 }}>
                <Col span={24} style={{ marginBottom: -5 }}>
                  <Card
                    size="small"
                    bordered={false}
                    style={{ backgroundColor: "#f8f8f8" }}
                    title="Dados do cliente"
                    headStyle={{
                      backgroundColor: "#001529",
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    <Row>
                      <Col span={24} style={{ marginBottom: -10 }}>
                        <label style={{ fontSize: 12 }}>CPF / CNPJ</label>
                        <p style={{ fontWeight: "bold", fontSize: 14 }}>
                          {clientObj.cpf_cnpj}
                        </p>
                      </Col>
                    </Row>

                    <Row gutter={8}>
                      <Col span={19} style={{ marginBottom: -10 }}>
                        <label style={{ fontSize: 12 }}>Endereço</label>
                        <p style={{ fontWeight: "bold", fontSize: 14 }}>
                          {address.street}
                        </p>
                      </Col>
                      <Col span={4} style={{ marginBottom: -10 }}>
                        <label
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "right",
                            fontSize: 12,
                          }}
                        >
                          Número
                        </label>
                        <p
                          style={{
                            fontWeight: "bold",
                            width: "100%",
                            textAlign: "right",
                            fontSize: 14,
                          }}
                        >
                          {address.number}
                        </p>
                      </Col>
                    </Row>

                    <Row gutter={8}>
                      <Col span={19} style={{ marginBottom: -10 }}>
                        <label style={{ fontSize: 12 }}>Cidade</label>
                        <p style={{ fontWeight: "bold" }}>{address.city}</p>
                      </Col>
                      <Col span={4} style={{ marginBottom: -10 }}>
                        <label
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "right",
                            fontSize: 12,
                          }}
                        >
                          UF
                        </label>
                        <p
                          style={{
                            fontWeight: "bold",
                            width: "100%",
                            textAlign: "right",
                            fontSize: 14,
                          }}
                        >
                          {address.state}
                        </p>
                      </Col>
                    </Row>

                    <Row gutter={8}>
                      <Col span={12} style={{ marginBottom: -10 }}>
                        <label style={{ fontSize: 12 }}>
                          Telefone Comercial
                        </label>
                        <p style={{ fontWeight: "bold", fontSize: 14 }}>
                          {clientObj.phoneComercial}
                        </p>
                      </Col>

                      <Col span={11} style={{ marginBottom: -10 }}>
                        <label
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "right",
                            fontSize: 12,
                          }}
                        >
                          Telefone Celular
                        </label>
                        <p
                          style={{
                            fontWeight: "bold",
                            width: "100%",
                            textAlign: "right",
                            fontSize: 14,
                          }}
                        >
                          {clientObj.celOne}
                        </p>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>

              <Divider style={{ marginBottom: -0.1 }} />

              <Row style={{ marginTop: 3 }}>
                <Col span={24}>
                  <label>Total Bruto</label>
                  <InputNumber
                    value={replaceValue(totalBruto)}
                    formatter={(value) => `R$ ${value}`}
                    style={{
                      width: "100%",
                      backgroundColor: "#001529",
                      color: "#fff",
                    }}
                    size="large"
                    readOnly
                  />
                </Col>
              </Row>

              <Row gutter={8} style={{ marginTop: 10 }}>
                <Col span={10}>
                  <label>Desconto</label>
                  <InputNumber
                    value={desconto}
                    formatter={(value) => `${value}%`}
                    onChange={(value) => setDesconto(value)}
                    style={{ width: "100%", backgroundColor: colorDesc }}
                    size="large"
                  />
                </Col>

                <Col span={14}>
                  <label>Total Líquido</label>
                  <Input
                    value={replaceValue(totalLiquid)}
                    style={{ width: "100%" }}
                    size="large"
                    onChange={(e) => setTotalLiquid(e.target.value)}
                    addonBefore="R$"
                  />
                </Col>
              </Row>

              <Row style={{ marginTop: 15 }}>
                <Col span={24}>
                  <Button
                    size="large"
                    type="primary"
                    icon="check"
                    style={{ width: "100%" }}
                    loading={loadingOrcament}
                    onClick={() => saveOrcamentAll()}
                  >
                    Finalizar venda
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Modal>

      <Modal
        visible={modalAuth}
        title="Senha administrativa"
        closable={false}
        footer={[
          <Button
            key="back"
            icon="close"
            type="danger"
            onClick={() => handleDesconto()}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            icon="key"
            type="primary"
            loading={loadingAutenticate}
            onClick={() => handleAutenticate()}
          >
            Verificar
          </Button>,
        ]}
        width="40%"
      >
        <Row>
          <Col span={24}>
            <label>Usuário</label>
            <Input
              type="text"
              value={userFunc}
              onChange={(e) => setUserFunc(e.target.value)}
            />
          </Col>
        </Row>

        <Row style={{ marginTop: 10 }}>
          <Col span={24}>
            <label>Senha</label>
            <Input.Password
              value={passFunc}
              onChange={(e) => setPassFunc(e.target.value)}
            />
          </Col>
        </Row>

        <p
          style={{
            width: "100%",
            color: "#f44336",
            fontWeight: "bold",
            marginTop: 10,
            textAlign: "center",
          }}
        >
          A porcentagem de desconto é maior do que o permitido, por favor
          contate seu gerente para a autorização desta operação
        </p>
      </Modal>

      <Modal
        visible={modalSendSell}
        title="Finalizar Venda"
        closable={false}
        footer={false}
        width="90%"
        centered
      >
        {modalSendSell === true && (
          <ModulePayment
            price={liquid}
            idSale={idFinishedSale}
            brut={brut}
            desc={desc}
            confirm={handleConfirm}
          />
        )}
      </Modal>

      <Modal
        visible={modalFinished}
        title="Informações da Venda"
        closable={false}
        footer={[
          <Button
            key="submit"
            icon="close"
            type="danger"
            loading={loading}
            onClick={() => handleFinished()}
          >
            Fechar
          </Button>,
          <Button
            key="print"
            icon="printer"
            type="primary"
            onClick={() => handlePrint()}
          >
            Imprimir Venda
          </Button>,
        ]}
        width="80%"
        centered
        bodyStyle={{ overflow: "auto", height: "79vh" }}
      >
        <Card
          size="small"
          bodyStyle={{
            backgroundColor: "#4caf50",
            color: "#FFF",
            borderRadius: 5,
          }}
          bordered={false}
        >
          <p
            style={{
              fontSize: 17,
              fontWeight: "bold",
              width: "100%",
              textAlign: "center",
              marginBottom: -2.5,
            }}
          >
            <Icon type="check" style={{ color: "white" }} />
            Processo concluído com sucesso!
          </p>
        </Card>

        <Divider style={{ fontSize: 15, fontWeight: "bold" }}>CLIENTE</Divider>

        <Descriptions bordered size="small">
          <Descriptions.Item span={3} label="Nome">
            {clienteNomeDesc}
          </Descriptions.Item>
        </Descriptions>

        <Divider style={{ fontSize: 15, fontWeight: "bold" }}>PRODUTOS</Divider>

        {viewNewProducts === true && (
          <Table
            pagination={false}
            columns={columnsProduct}
            dataSource={newProducts}
            size="small"
            rowKey={(prod) => prod.id}
          />
        )}

        {viewNewProducts === false && (
          <Table
            pagination={false}
            columns={columnsProduct}
            dataSource={ordem.products}
            size="small"
            rowKey={(prod) => prod.product}
          />
        )}

        {!!paymentsSale.length && (
          <>
            <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
              PAGAMENTOS
            </Divider>
            <Table
              pagination={false}
              columns={columnsPayment}
              dataSource={paymentsSale}
              size="small"
              rowKey={(prod) => prod._id}
              style={{ marginTop: 10 }}
            />
          </>
        )}

        <Divider style={{ fontSize: 15, fontWeight: "bold" }}>RESUMO</Divider>
        <Table
          pagination={false}
          columns={columnsResume}
          dataSource={dataResume}
          size="small"
          showHeader={false}
        />
      </Modal>

      <Modal
        visible={modalPrint}
        title="Imprimir"
        onCancel={() => handleClosePrintModal()}
        footer={false}
        width="30%"
        centered
      >
        {modalPrint === true && <PrintSale id={orderFim._id} />}
      </Modal>
    </>
  );
}
