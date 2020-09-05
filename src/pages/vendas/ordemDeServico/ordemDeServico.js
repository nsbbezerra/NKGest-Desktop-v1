import React, { useState, useEffect } from "react";
import {
  Icon,
  Button,
  Row,
  Col,
  Input,
  Table,
  Card,
  Divider,
  InputNumber,
  Modal,
  Spin,
  Popconfirm,
  Statistic,
  Descriptions,
  Tooltip,
  DatePicker,
  Radio,
  Drawer,
} from "antd";
import { Header } from "../../../styles/styles";
import { Link } from "react-router-dom";
import api from "../../../config/axios";
import PaymentModule from "../../../components/paymentsOrders";
import TemplatePrint from "../../../templates/printOrder";
import useEventListener from "@use-it/event-listener";
import moment from "moment";
import InputMask from "react-input-mask";

const { TextArea } = Input;

export default function OrdemDeServico() {
  const [spinner, setSpinner] = useState(false);
  const [modalSendSell, setModalSendSell] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalAuth, setModalAuth] = useState(false);
  const [loadingAutenticate, setLoadingAutenticate] = useState(false);
  const [modalFinished, setModalFinished] = useState(false);
  const [modalWait, setModalWait] = useState(false);
  const [loadingWait, setLoadingWait] = useState(false);
  const [modalPrint, setModalPrint] = useState(false);

  const [dados, setDados] = useState({});
  const [clients, setClients] = useState([]);
  const [address, setAddress] = useState([]);
  const [services, setServices] = useState([]);
  const [veicles, setVeicles] = useState([]);

  const [addressCli, setAddressCli] = useState({});
  const [veicleCli, setVeicleCli] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientCpf, setClientCpf] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [idVendedor, setIdVendedor] = useState("");
  const [nameVendedor, setNameVendedor] = useState("");
  const [clientObj, setClientObj] = useState({});

  const [quantity, setQuantity] = useState(1);
  const [serviceSell, setServiceSell] = useState([]);

  const [totalOrdem, setTotalOrdem] = useState(0);
  const [desconto, setDesconto] = useState(0);
  const [totalOrdemLiquid, setTotalOrdemLiquid] = useState(0);

  const [colorDesc, setColorDesc] = useState("#4caf50");

  const [userFunc, setUserFunc] = useState("");
  const [passFunc, setPassFunc] = useState("");

  const [ordemFim, setOrdemFim] = useState({});

  const [paymentsSale, setPaymentsSale] = useState([]);

  const [observation, setObservation] = useState("");

  const [modalHandleProducts, setModalHandleProducts] = useState(false);

  const [finderProduct, setFinderProduct] = useState("");

  const [productsHandle, setProductsHandle] = useState([]);

  const [dateOrder, setDateOrder] = useState("");

  const [modalHandleClients, setModalHandleClients] = useState(false);
  const [handleDocument, setHandleDocument] = useState("");
  const [typeDocument, setTypeDocument] = useState("cpf");
  const [findClient, setFindClient] = useState("");
  const [clientsHandle, setClientsHandle] = useState([]);
  const [menuGeral, setMenuGeral] = useState(false);

  const [modalEquipament, setModalEquipament] = useState("");
  const [equipo, setEquipo] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [serie, setSerie] = useState("");

  async function allClear() {
    setMenuGeral(false);
    await setVeicles([]);
    await setVeicleCli("");
    await setClientId("");
    await setClientName("");
    await setClientCpf("");
    await setAddressCli({});
    await setClientPhone("");
    await setServiceSell([]);
    await setTotalOrdem(0);
    await setTotalOrdemLiquid(0);
    await setDesconto(0);
    await setUserFunc("");
    await setPassFunc("");
    await setPaymentsSale([]);
    await setOrdemFim({});
    await setClientObj({});
    await setFinderProduct("");
    await setDateOrder(moment());
    setEquipo("");
    setMarca("");
    setModelo("");
    setSerie("");
  }

  function handler({ key }) {
    if (key === "F2") {
      setModalHandleProducts(true);
      document.getElementById("quantity").focus();
    }
    if (key === "F3") {
      setModalHandleClients(true);
      let inputText = document.getElementById("input-client");
      inputText.focus();
    }
    if (key === "F4") {
      allClear();
    }
    if (key === "F5") {
      setModalEquipament(true);
      document.getElementById("equipo").focus();
    }
    if (key === "F6") {
      if (modalHandleProducts === false) {
        return false;
      }
      document.getElementById("quantity").focus();
      document.getElementById("quantity").select();
    }
    if (key === "F8") {
      if (modalHandleProducts === false) {
        return false;
      }
      document.getElementById("products").focus();
    }
    if (key === "F9") {
      handleSaveOrder();
    }
    if (key === "F10") {
      document.getElementById("totalLiquid").focus();
    }
    if (key === "F12") {
      setMenuGeral(!menuGeral);
    }
  }

  useEventListener("keydown", handler);

  async function handleSendWaitOrdem() {
    if (clientId === "") {
      warningWar("Atenção", "Selecione um cliente");
      return false;
    }
    if (!totalOrdemLiquid) {
      warningWar("Atenção", "O campo: TOTAL LIQUIDO está vazio");
      return false;
    }
    if (equipo === "") {
      warningWar("Atenção", "O campo: EQUIPAMENTO está vazio");
      return false;
    }
    setLoadingWait(true);
    await api
      .post("/orders/createServiceOrca", {
        client: clientId,
        funcionario: idVendedor,
        services: serviceSell,
        desconto: desconto,
        valueLiquido: totalOrdemLiquid,
        valueBruto: totalOrdem,
        obs: observation,
        address: addressCli._id,
        equipo: equipo,
        marca: marca,
        modelo: modelo,
        referencia: serie,
      })
      .then((response) => {
        success("Sucesso", response.data.message);
        setLoadingWait(false);
        setModalWait(false);
        allClear();
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoadingWait(false);
        setModalWait(false);
      });
  }

  function handleWaitOrder() {
    if (clientId === "") {
      warningWar("Atenção", "Selecione um cliente");
      return false;
    }
    if (veicleCli === "") {
      warningWar("Atenção", "Selecione um veículo");
      return false;
    }
    setMenuGeral(false);
    setModalWait(true);
  }

  async function handleFinished() {
    setModalFinished(false);
    await allClear();
  }

  async function FindPayments() {
    await api
      .post("/orders/findPayFormOrder", {
        order: ordemFim._id,
      })
      .then((response) => {
        setPaymentsSale(response.data.pagamentos);
        setModalFinished(true);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
      });
  }

  function handleDesconto() {
    setDesconto(0);
    setTotalOrdemLiquid(totalOrdem);
    setModalAuth(false);
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
        SaveOrder();
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoadingAutenticate(false);
      });
  }

  async function SaveOrder() {
    if (clientId === "") {
      warningWar("Atenção", "Selecione um cliente");
      return false;
    }
    if (!totalOrdemLiquid) {
      warningWar("Atenção", "O campo: TOTAL LIQUIDO está vazio");
      return false;
    }
    if (equipo === "") {
      warningWar("Atenção", "O campo: EQUIPAMENTO está vazio");
      return false;
    }
    if (!idVendedor) {
      warningWar("Atenção", "Não existe um vendedor selecionado");
      return false;
    }
    setLoading(true);
    await api
      .post("/orders/createService", {
        client: clientId,
        funcionario: idVendedor,
        services: serviceSell,
        desconto: desconto,
        valueLiquido: totalOrdemLiquid,
        valueBruto: totalOrdem,
        obs: observation,
        address: addressCli._id,
        equipo: equipo,
        marca: marca,
        modelo: modelo,
        referencia: serie,
        data: dateOrder,
      })
      .then((response) => {
        setOrdemFim(response.data.ordem);
        setModalSendSell(true);
        setLoading(false);
        if (response.data.message) {
          info(response.data.message);
        }
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoading(false);
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

  function warningWar(title, message) {
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

  function handleSaveOrder() {
    if (desconto > 20) {
      setModalAuth(true);
    } else {
      SaveOrder();
    }
  }

  async function finders() {
    setMenuGeral(false);
    setSpinner(true);
    await api
      .get("/orders/listsOrderService")
      .then((response) => {
        setClients(response.data.clients);
        setAddress(response.data.address);
        setServices(response.data.services);
        setSpinner(false);
      })
      .catch((error) => {
        erro("Erro", error.message);
        setSpinner(false);
      });
  }

  async function handleClient(value) {
    const clientInfo = await clients.find((obj) => obj.name === value);
    const clientAddress = await address.find(
      (obj) => obj.client._id === clientInfo._id
    );
    if (clientAddress) {
      await setAddressCli(clientAddress);
    } else {
      await setAddressCli({});
    }
    setClientName(clientInfo.name);
    setClientId(clientInfo._id);
    setClientPhone(clientInfo.phoneComercial);
    setClientCpf(clientInfo.cpf_cnpj);
    setClientObj(clientInfo);
    setAddressCli(clientAddress);
    setModalHandleClients(false);
  }

  useEffect(() => {
    finderClientsBySource(findClient);
  }, [findClient]);

  useEffect(() => {
    setClientsHandle(clients);
  }, [modalHandleClients]);

  async function finderClientsBySource(text) {
    if (text === "") {
      await setClientsHandle(clients);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await clients.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setClientsHandle(frasesFiltradas);
    }
  }

  useEffect(() => {
    finderClientsByDocument(handleDocument);
  }, [handleDocument]);

  async function finderClientsByDocument(text) {
    if (text === "") {
      await setClientsHandle([]);
    } else {
      let termos = await text.split("_");
      let frasesFiltradas = await clients.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.cpf_cnpj.includes(termoBuscado);
        }, true);
      });
      await setClientsHandle(frasesFiltradas);
    }
  }

  async function setToTable(id) {
    const result = await services.find((obj) => obj._id === id);
    const total = result.value * quantity;
    const info = await {
      quantity: quantity,
      service: result._id,
      name: result.name,
      valueUnit: result.value,
      valueTotal: total,
    };
    await setServiceSell([...serviceSell, info]);
    await setQuantity(1);
  }

  async function delServiceTable(id) {
    const dataSource = await [...serviceSell];
    setServiceSell(dataSource.filter((item) => item.service !== id));
  }

  async function admin() {
    const name = await sessionStorage.getItem("name");
    const idVend = await sessionStorage.getItem("id");
    await setIdVendedor(idVend);
    await setNameVendedor(name);
  }

  useEffect(() => {
    admin();
    finders();
    findDados();
    setDateOrder(moment());
  }, []);

  useEffect(() => {
    if (serviceSell.length) {
      var valores = serviceSell.filter((valor) => {
        return valor.valueTotal;
      });

      var calculo = valores.reduce((sum, valor) => {
        return sum + valor.valueTotal;
      }, 0);

      setTotalOrdem(parseFloat(calculo.toFixed(2)));
      setTotalOrdemLiquid(parseFloat(calculo.toFixed(2)));
    } else {
      setTotalOrdem(0);
      setTotalOrdemLiquid(0);
    }
  }, [serviceSell]);

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
    if (totalOrdemLiquid > totalOrdem) {
      setTotalOrdemLiquid(totalOrdem);
    }
    const percent = (totalOrdemLiquid / totalOrdem) * 100;
    const sobra = 100 - percent;
    setDesconto(parseFloat(sobra.toFixed(2)));
  }, [totalOrdemLiquid]);

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

  function handleConfirm() {
    setModalSendSell(false);
    FindPayments();
  }

  function handleToPrint() {
    setModalFinished(false);
    setModalPrint(true);
  }

  function handleClosePrintModal() {
    allClear();
    finders();
    setModalPrint(false);
    setDateOrder(moment());
  }

  useEffect(() => {
    finderProductsBySource(finderProduct);
  }, [finderProduct]);

  useEffect(() => {
    setProductsHandle(services);
  }, [modalHandleProducts]);

  async function finderProductsBySource(text) {
    if (text === "") {
      await setProductsHandle(services);
    } else {
      let filtro = await services.filter((val) => val.name.includes(text));
      await setProductsHandle(filtro);
    }
  }

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
      align: "center",
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
    {
      title: "Ações",
      dataIndex: "service",
      key: "service",
      width: "6%",
      render: (id) => (
        <>
          <Popconfirm
            title="Deseja remover este item?"
            okText="Sim"
            cancelText="Não"
            onConfirm={() => delServiceTable(id)}
          >
            <Icon type="close" style={{ color: "red" }} />
          </Popconfirm>
        </>
      ),
      align: "center",
    },
  ];

  const columnsClientsHandle = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      width: "58%",
      ellipsis: true,
    },
    {
      title: "CPF / CNPJ",
      dataIndex: "cpf_cnpj",
      key: "cpf_cnpj",
      width: "15%",
      align: "center",
    },
    {
      title: "Ações",
      dataIndex: "name",
      key: "name",
      render: (id) => (
        <>
          <Tooltip placement="left" title="Usar este Cliente">
            <Button
              shape="circle"
              icon="plus"
              type="primary"
              size="small"
              onClick={() => handleClient(id)}
            />
          </Tooltip>
        </>
      ),
      width: "5%",
      align: "center",
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

  const dataResume = [
    {
      key: "1",
      info: "TOTAL BRUTO",
      value:
        JSON.stringify(ordemFim) === "{}"
          ? 0
          : ordemFim.valueBruto.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
    },
    {
      key: "2",
      info: "DESCONTO",
      value: JSON.stringify(ordemFim) === "{}" ? 0 : `% ${ordemFim.desconto}`,
    },
    {
      key: "3",
      info: "TOTAL A PAGAR",
      value:
        JSON.stringify(ordemFim) === "{}"
          ? 0
          : ordemFim.valueLiquido.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            }),
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

  const columnsProductsHandle = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      width: "80%",
      ellipsis: true,
    },
    {
      title: "Preço",
      dataIndex: "value",
      key: "value",
      width: "12%",
      render: (price) => (
        <Statistic
          value={price}
          prefix="R$"
          precision={2}
          valueStyle={{ fontSize: 15 }}
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
          <Tooltip placement="left" title="Adicionar ao Orçamento">
            <Button
              shape="circle"
              icon="plus"
              type="primary"
              size="small"
              onClick={() => setToTable(id)}
            />
          </Tooltip>
        </>
      ),
      width: "8%",
      align: "center",
    },
  ];

  return (
    <>
      <Header>
        <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
          <Icon type="shopping" style={{ fontSize: 20 }} /> ORDEM DE SERVIÇOS
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            position: "absolute",
            right: 5,
            alignItems: "center",
          }}
        >
          <p style={{ marginRight: 50, marginTop: 10 }}>
            Vendedor: <strong>{nameVendedor}</strong>
          </p>
          <Link to="/">
            <Button type="danger" shape="circle" icon="close" size="small" />
          </Link>
        </div>
      </Header>

      <Spin spinning={spinner} size="large">
        <div style={{ marginTop: 10, overflowX: "hidden" }}>
          <Card
            size="small"
            bodyStyle={{
              padding: 5,
              backgroundColor: "rgba(26,26,26,.05)",
              borderRadius: 3,
            }}
            style={{
              borderRadius: 3,
              boxShadow: "0px 0px 5px rgba(26,26,26,.1)",
            }}
          >
            <Row gutter={10}>
              <Col span={24}>
                <Row gutter={8}>
                  <Col span={7}>
                    <label>Selecione o cliente</label>
                    <Input size="large" value={clientName} readOnly />
                  </Col>
                  <Col span={4}>
                    <label style={{ color: "transparent" }}>
                      Data do Pedido
                    </label>
                    <Button
                      icon="search"
                      onClick={() => setModalHandleClients(true)}
                      size="large"
                      type="primary"
                      style={{ width: "100%" }}
                    >
                      Buscar Cliente (F3)
                    </Button>
                  </Col>
                  <Col span={7}>
                    <label>Equipamento</label>
                    <Input size="large" value={equipo} readOnly />
                  </Col>
                  <Col span={1}>
                    <label>(F5)</label>
                    <Tooltip title="Inserir Informações">
                      <Button
                        icon="edit"
                        onClick={() => setModalEquipament(!modalEquipament)}
                        size="large"
                        type="primary"
                        style={{ width: "100%" }}
                      />
                    </Tooltip>
                  </Col>
                  <Col span={4}>
                    <label>Data do Pedido</label>
                    <DatePicker
                      format="DD/MM/YYYY"
                      style={{ width: "100%" }}
                      showToday={false}
                      value={moment(dateOrder)}
                      onChange={(value) => setDateOrder(moment(value).format())}
                      size="large"
                    />
                  </Col>
                  <Col span={1}>
                    <label>(F12)</label>
                    <Tooltip title="Abir Menu">
                      <Button
                        icon="menu-fold"
                        onClick={() => setMenuGeral(!menuGeral)}
                        size="large"
                        type="primary"
                        style={{ width: "100%" }}
                      />
                    </Tooltip>
                  </Col>
                </Row>

                <Card
                  size="small"
                  bodyStyle={{ padding: 8 }}
                  style={{ borderRadius: 5, marginTop: 5 }}
                >
                  <Row gutter={8}>
                    <Col span={6}>
                      <p
                        style={{
                          fontSize: 12,
                          fontStyle: "italic",
                          marginBottom: -1,
                        }}
                      >
                        <strong>CPF / CNPJ: </strong>
                        {clientCpf}
                      </p>
                    </Col>
                    <Col span={12}>
                      <p
                        style={{
                          fontSize: 12,
                          fontStyle: "italic",
                          marginBottom: -1,
                        }}
                      >
                        <strong>Endereço: </strong>
                        {addressCli.street}, {addressCli.number},{" "}
                        {addressCli.city} - {addressCli.state}
                      </p>
                    </Col>
                    <Col span={6}>
                      <p
                        style={{
                          fontSize: 12,
                          fontStyle: "italic",
                          marginBottom: -1,
                        }}
                      >
                        <strong>Contato:</strong> {clientPhone}
                      </p>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Card>

          <Row gutter={8} style={{ marginTop: 10 }}>
            <Col span={24}>
              <label>Observações</label>
              <TextArea
                rows={2}
                value={observation}
                onChange={(e) => setObservation(e.target.value.toUpperCase())}
              />
            </Col>
          </Row>

          <Row style={{ marginTop: 10, marginBottom: 90 }}>
            <Col span={24} style={{ overflow: "auto" }}>
              <Table
                pagination={{ pageSize: 10 }}
                columns={columnsService}
                dataSource={serviceSell}
                size="small"
                rowKey={(chave) => chave.service}
              />
            </Col>
          </Row>

          <Card
            size="small"
            bodyStyle={{
              padding: 10,
              backgroundColor: "#001529",
              borderRadius: 3,
            }}
            style={{
              borderRadius: 3,
              position: "fixed",
              bottom: 20,
              marginRight: 20,
              boxShadow: "0px 0px 5px rgba(26,26,26,.1)",
              zIndex: 200,
            }}
          >
            <Row gutter={10}>
              <Col
                span={4}
                style={{ paddingRight: 5, borderRight: "1px solid lightgray" }}
              >
                <Row gutter={8}>
                  <Col span={24}>
                    <label style={{ color: "transparent" }}>
                      Total Líquido
                    </label>
                    <Button
                      onClick={() => setModalHandleProducts(true)}
                      icon="tool"
                      size="large"
                      type="primary"
                      style={{ width: "100%" }}
                    >
                      Serviços (F2)
                    </Button>
                  </Col>
                </Row>
              </Col>

              <Col span={20} style={{ paddingLeft: 5 }}>
                <Row gutter={12}>
                  <Col span={6}>
                    <label style={{ color: "#fff" }}>Total Bruto</label>
                    <Input
                      value={totalOrdem}
                      size="large"
                      readOnly
                      addonBefore="R$"
                    />
                  </Col>

                  <Col span={4}>
                    <label style={{ color: "#fff" }}>Desconto</label>
                    <InputNumber
                      value={desconto}
                      formatter={(value) => `${value}%`}
                      onChange={(value) => setDesconto(value)}
                      style={{ width: "100%", backgroundColor: colorDesc }}
                      size="large"
                      readOnly
                    />
                  </Col>

                  <Col span={6}>
                    <label style={{ color: "#fff" }}>Total Líquido (F10)</label>
                    <Input
                      id="totalLiquid"
                      value={totalOrdemLiquid}
                      style={{ width: "100%" }}
                      size="large"
                      onChange={(e) => setTotalOrdemLiquid(e.target.value)}
                      addonBefore="R$"
                    />
                  </Col>

                  <Col span={8}>
                    <label style={{ color: "transparent" }}>
                      Total Líquido
                    </label>
                    <Button
                      size="large"
                      type="primary"
                      icon="check"
                      style={{ width: "100%" }}
                      loading={loading}
                      onClick={() => handleSaveOrder()}
                    >
                      Finalizar O.S. (F9)
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>

          <Modal
            visible={modalHandleProducts}
            title="Serviços"
            onCancel={() => setModalHandleProducts(false)}
            footer={[
              <div
                key="valueSale"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <label
                  key="label"
                  style={{
                    display: "block",
                    marginTop: 3,
                    marginRight: 15,
                    fontSize: 20,
                    fontWeight: "bolder",
                  }}
                >
                  VALOR TOTAL
                </label>
                <Input
                  key="value"
                  value={totalOrdemLiquid}
                  style={{ width: 200 }}
                  readOnly
                  addonBefore="R$"
                  size="large"
                />
              </div>,
            ]}
            width="97%"
            bodyStyle={{ padding: 15, height: "78vh", overflow: "auto" }}
            centered
          >
            <Card
              size="small"
              bodyStyle={{ padding: 10 }}
              style={{ borderRadius: 5 }}
            >
              <Row gutter={8}>
                <Col span={2}>
                  <label>Quant. (F6)</label>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </Col>

                <Col span={22}>
                  <label>Digite para Buscar o Serviço (F8)</label>
                  <Input
                    id="products"
                    value={finderProduct}
                    onChange={(e) =>
                      setFinderProduct(e.target.value.toUpperCase())
                    }
                  />
                </Col>
              </Row>
            </Card>

            <Table
              pagination={{ pageSize: 7 }}
              columns={columnsProductsHandle}
              dataSource={productsHandle}
              size="small"
              rowKey={(prod) => prod._id}
              rowClassName={(record) =>
                record.estoqueAct <= 5 ? "red-row" : ""
              }
              style={{ marginTop: 10 }}
            />
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
            title="Adicionar Pagamento"
            closable={false}
            footer={false}
            width="90%"
            centered
          >
            {modalSendSell === true && (
              <PaymentModule
                price={ordemFim.valueLiquido}
                idSale={ordemFim._id}
                brut={ordemFim.valueBruto}
                desc={ordemFim.desconto}
                confirm={handleConfirm}
              />
            )}
          </Modal>

          <Modal
            visible={modalFinished}
            title="Informações da Ordem de Serviço"
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
                loading={loading}
                onClick={() => handleToPrint()}
              >
                Imprimir Ordem de Serviço
              </Button>,
            ]}
            width="80%"
            bodyStyle={{ padding: 15, height: "78vh", overflow: "auto" }}
            centered
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
                <Icon type="ckeck" style={{ color: "white" }} />
                <Icon type="ckeck" style={{ color: "white" }} /> Processo
                concluído com sucesso!
              </p>
            </Card>

            <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
              CLIENTE
            </Divider>
            <Descriptions bordered size="small">
              <Descriptions.Item span={3} label="Nome">
                {clientName}
              </Descriptions.Item>
            </Descriptions>

            <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
              SERVIÇOS
            </Divider>
            <Table
              pagination={false}
              columns={columnsService2}
              dataSource={serviceSell}
              size="small"
              rowKey={(chave) => chave.service}
            />

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

            <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
              RESUMO
            </Divider>
            <Table
              pagination={false}
              columns={columnsResume}
              dataSource={dataResume}
              size="small"
              showHeader={false}
              style={{ marginTop: 10 }}
            />
          </Modal>

          <Modal
            visible={modalWait}
            title="Salvar Ordem de Serviço"
            closable={false}
            footer={[
              <Button
                key="back"
                icon="close"
                type="danger"
                onClick={() => setModalWait(false)}
              >
                Não
              </Button>,
              <Button
                key="submit"
                icon="check"
                type="primary"
                loading={loadingWait}
                onClick={() => handleSendWaitOrdem()}
              >
                Sim
              </Button>,
            ]}
          >
            <p>
              Esta ação salvará a ordem de serviço, você ainda porderá alterar
              suas informações no menu: ORDENS SALVAS. Deseja prosseguir com a
              ação?
            </p>
          </Modal>

          <Modal
            visible={modalPrint}
            title="Imprimir"
            onCancel={() => handleClosePrintModal()}
            footer={false}
            width="30%"
            centered
          >
            {modalPrint === true && <TemplatePrint id={ordemFim._id} />}
          </Modal>

          <Modal
            visible={modalEquipament}
            title="Identificação do Equipamento"
            onCancel={() => setModalEquipament(false)}
            footer={[
              <Button
                key="back"
                icon="close"
                type="primary"
                onClick={() => setModalEquipament(false)}
              >
                Fechar
              </Button>,
            ]}
            width="80%"
            centered
          >
            <Row gutter={10}>
              <Col span={24}>
                <label>Equipamento</label>
                <Input
                  id="equipo"
                  value={equipo}
                  onChange={(e) => setEquipo(e.target.value.toUpperCase())}
                />
              </Col>
            </Row>
            <Row gutter={10} style={{ marginTop: 10 }}>
              <Col span={8}>
                <label>Marca</label>
                <Input
                  value={marca}
                  onChange={(e) => setMarca(e.target.value.toUpperCase())}
                />
              </Col>
              <Col span={8}>
                <label>Modelo</label>
                <Input
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value.toUpperCase())}
                />
              </Col>
              <Col span={8}>
                <label>Identificação</label>
                <Input
                  value={serie}
                  onChange={(e) => setSerie(e.target.value.toUpperCase())}
                />
              </Col>
            </Row>
          </Modal>

          <Modal
            visible={modalHandleClients}
            title="Buscar Clientes"
            onCancel={() => setModalHandleClients(false)}
            footer={false}
            width="97%"
            bodyStyle={{ padding: 15, height: "78vh", overflow: "auto" }}
            centered
          >
            <Card
              size="small"
              bodyStyle={{ padding: 10 }}
              style={{ borderRadius: 5 }}
            >
              <Row gutter={8}>
                <Col span={12}>
                  <label>Digite o Nome do Cliente</label>
                  <Input
                    id="input-client"
                    value={findClient}
                    onChange={(e) =>
                      setFindClient(e.target.value.toUpperCase())
                    }
                  />
                </Col>
                <Col span={12}>
                  <label>
                    Buscar por:{" "}
                    <Radio.Group
                      onChange={(e) => setTypeDocument(e.target.value)}
                      value={typeDocument}
                    >
                      <Radio value={"cpf"}>CPF</Radio>
                      <Radio value={"cnpj"}>CNPJ</Radio>
                    </Radio.Group>
                  </label>
                  {typeDocument === "cpf" ? (
                    <InputMask
                      mask={"999.999.999-99"}
                      className="ant-input"
                      onChange={(e) => setHandleDocument(e.target.value)}
                      value={handleDocument}
                    />
                  ) : (
                    <InputMask
                      mask={"99.999.999/9999-99"}
                      className="ant-input"
                      onChange={(e) => setHandleDocument(e.target.value)}
                      value={handleDocument}
                    />
                  )}
                </Col>
              </Row>
            </Card>

            <Table
              pagination={{ pageSize: 7 }}
              columns={columnsClientsHandle}
              dataSource={clientsHandle}
              size="small"
              rowKey={(prod) => prod._id}
              style={{ marginTop: 10 }}
            />
          </Modal>

          <Drawer
            title="Menu"
            placement="left"
            onClose={() => setMenuGeral(false)}
            visible={menuGeral}
          >
            <Button
              onClick={() => finders()}
              type="default"
              icon="sync"
              style={{ width: "100%" }}
              size="large"
            >
              Atualizar
            </Button>
            <Divider />
            <Button
              onClick={() => handleWaitOrder(true)}
              type="default"
              icon="save"
              style={{ width: "100%", marginTop: 5 }}
              size="large"
            >
              Salvar Orçamento
            </Button>
            <Divider />
            <Button
              onClick={() => allClear()}
              type="danger"
              icon="close"
              style={{ width: "100%", marginTop: 5 }}
              size="large"
            >
              Cancelar (F4)
            </Button>
          </Drawer>
        </div>
      </Spin>
    </>
  );
}
