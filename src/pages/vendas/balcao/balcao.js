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
  InputNumber,
  Modal,
  Popconfirm,
  Statistic,
  Descriptions,
  Tooltip,
  Spin,
  DatePicker,
  Select,
  Drawer,
  Radio,
} from "antd";
import { Header } from "../../../styles/styles";
import { Link } from "react-router-dom";
import api from "../../../config/axios";
import "../../../styles/style.css";
import useEventListener from "@use-it/event-listener";
import ModulePayment from "../../../components/payments";
import ModulePrintSale from "../../../templates/printSale";
import moment from "moment";
import InputMask from "react-input-mask";

const { TreeNode } = TreeSelect;
const { TextArea } = Input;
const { Option } = Select;

export default function BalcaoVendas() {
  const [spinner, setSpinner] = useState(false);
  const [modalSendSell, setModalSendSell] = useState(false);
  const [loadingSell, setLoadingSell] = useState(false);
  const [modalAuth, setModalAuth] = useState(false);
  const [modalFinished, setModalFinished] = useState(false);
  const [loadingAutenticate, setLoadingAutenticate] = useState(false);
  const [loadingOrcament, setLoadingOrcament] = useState(false);
  const [modalOrcament, setModalOrcament] = useState(false);
  const [modalOrcamentPrint, setModalOrcamentPrint] = useState(false);
  const [modalDelSale, setModalDelSale] = useState(false);
  const [modalHandleProducts, setModalHandleProducts] = useState(false);
  const [modalHandleClients, setModalHandleClients] = useState(false);
  const [modalPrint, setModalPrint] = useState(false);
  const [modalSearch, setModalSearch] = useState(false);
  const [modalOrcamentSearch, setModalOrcamentSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalHandleSaveOrcament, setModalHandleSaveOrcament] = useState(false);
  const [modalDesc, setModalDesc] = useState(false);

  const [clients, setClients] = useState([]);
  const [address, setAddress] = useState([]);
  const [products, setProducts] = useState([]);
  const [orcamentSearch, setOrcamentSearch] = useState([]);
  const [productsHandle, setProductsHandle] = useState([]);
  const [productSale, setProductSale] = useState([]);
  const [paymentsSale, setPaymentsSale] = useState([]);
  const [orderFim, setOrderFim] = useState({});
  const [dados, setDados] = useState({});
  const [idVendedor, setIdVendedor] = useState("");
  const [nameVendedor, setNameVendedor] = useState("");
  const [clientCPF, setClientCPF] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientId, setClientId] = useState("");
  const [phoneClient, setPhoneClient] = useState("");
  const [clientAddress, setClientAddress] = useState({});
  const [clientObj, setClientObj] = useState({});
  const [addressObj, setAddressObj] = useState({});
  const [clientsHandle, setClientsHandle] = useState([]);

  const [quantity, setQuantity] = useState(1);
  const [totalLiquid, setTotalLiquid] = useState(0);
  const [totalBruto, setTotalBruto] = useState(0);
  const [desconto, setDesconto] = useState(0);
  const [descontoValue, setDescontoValue] = useState(0);

  const [idFinishedSale, setIdFinishedSale] = useState("");
  const [desc, setDesc] = useState(0);
  const [liquid, setLiquid] = useState(0);
  const [brut, setBrut] = useState(0);

  const [userFunc, setUserFunc] = useState("");
  const [passFunc, setPassFunc] = useState("");
  const [colorDesc, setColorDesc] = useState("#4caf50");

  const [observation, setObservation] = useState("");
  const [modalObservation, setModalObservation] = useState(false);
  const [codeBar, setCodeBar] = useState("");
  const [idAddress, setIdAddress] = useState("");
  const [finderProduct, setFinderProduct] = useState("");
  const [dateSale, setDateSale] = useState("");

  const [searchType, setSearchType] = useState(null);
  const [clienteSearch, setClienteSearch] = useState("");
  const [clientNameSearch, setClientNameSearch] = useState("");
  const [mes2, setMes2] = useState("");
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [numberSale, setNumberSale] = useState("");

  const [blockOrcaButtom, setBlockOrcaButtom] = useState(true);
  const [idOrcamentSave, setIdOrcamentSave] = useState("");

  const [menuGeral, setMenuGeral] = useState(false);
  const [findClient, setFindClient] = useState("");
  const [referenced, setReferenced] = useState("");
  const [handleDocument, setHandleDocument] = useState("");
  const [typeDocument, setTypeDocument] = useState("cpf");
  const [sku, setSku] = useState("");

  useEffect(() => {
    console.log(dateSale);
  }, [dateSale]);

  async function allClear() {
    await setProductSale([]);
    await setClientCPF("");
    await setClientName("");
    await setClientId("");
    await setPhoneClient("");
    await setClientAddress({});
    await setQuantity(1);
    await setTotalLiquid(0);
    await setTotalBruto(0);
    await setDesconto(0);
    await setIdFinishedSale("");
    await setDesc(0);
    await setLiquid(0);
    await setBrut(0);
    await setPaymentsSale([]);
    await setOrderFim({});
    await setObservation("");
    await setFinderProduct("");
    await setDateSale(moment().format());
    await setSearchType(null);
    await setClienteSearch("");
    await setClientNameSearch("");
    await setMes2("");
    await setDia("");
    await setMes("");
    await setAno("");
    await setNumberSale("");
    await setBlockOrcaButtom(true);
  }

  async function sendFinder() {
    if (searchType === null) {
      warning("Atenção", "Selecione uma opção de busca");
      return false;
    }
    setLoading(true);
    await api
      .post("/orders/findOrcaments", {
        type: searchType,
        cliente: clienteSearch,
        data: `${dia}/${mes}/${ano}`,
        mes: mes2,
        ano: ano,
        numberSale: numberSale,
      })
      .then((response) => {
        setOrcamentSearch(response.data.order);
        setLoading(false);
        setModalSearch(false);
        setModalOrcamentSearch(true);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoading(false);
        setModalSearch(false);
      });
  }

  async function handleClienteSearch(value) {
    const result = await clients.find((obj) => obj.name === value);
    await setClienteSearch(result._id);
    await setClientNameSearch(result.name);
  }

  function handler({ key }) {
    if (key === "F2") {
      setModalHandleProducts(true);
      document.getElementById("quantity").focus();
    }
    if (key === "F3") {
      setModalHandleClients(true);
      document.getElementById("input-client").focus();
    }
    if (key === "F6") {
      if (modalHandleProducts === false) {
        return false;
      }
      document.getElementById("quantity").focus();
      document.getElementById("quantity").select();
    }
    if (key === "F7") {
      if (modalHandleProducts === false) {
        return false;
      }
      document.getElementById("barcode").focus();
    }
    if (key === "F5") {
      if (modalHandleProducts === false) {
        return false;
      }
      document.getElementById("sku").focus();
    }
    if (key === "F8") {
      if (modalHandleProducts === false) {
        return false;
      }
      document.getElementById("products").focus();
    }
    if (key === "F9") {
      handleSaveSellInfo();
    }
    if (key === "F10") {
      setModalDesc(true);
      document.getElementById("desconto").focus();
    }
    if (key === "F4") {
      setModalDelSale(true);
    }
    if (key === "F11") {
      finalizeOrcament();
    }
    if (key === "F12") {
      setMenuGeral(!menuGeral);
    }
  }

  useEventListener("keydown", handler);

  function handleCloseModalOcaPrint() {
    allClear();
    setModalOrcamentPrint(false);
    findProducts();
    setDateSale(moment().format());
  }

  async function SaveWithOrcament() {
    if (clientId === "") {
      warningWar("Atenção", "Não existe um cliente selecionado");
      return false;
    }
    if (idAddress === "") {
      stoped();
      return false;
    }
    if (idVendedor === "") {
      warningWar("Atenção", "Não existe um vendedor selecionado.");
      return false;
    }
    if (!productSale.length) {
      warningWar("Atenção", "Não existe produtos para concluir a venda");
      return false;
    }
    setLoadingOrcament(true);
    await api
      .post("/orders/createOrcamentSale", {
        client: clientId,
        funcionario: idVendedor,
        products: productSale,
        desconto: desconto,
        valueLiquido: totalLiquid,
        valueBruto: totalBruto,
        obs: observation,
        address: idAddress,
        data: dateSale,
        descontoValue: descontoValue,
      })
      .then((response) => {
        setOrderFim(response.data.orcamento);
        setLoadingOrcament(false);
        setModalOrcamentPrint(true);
        setModalOrcament(false);
      })
      .catch((error) => {
        setLoadingOrcament(false);
        erro("Erro", error.response.data.message);
        setModalOrcament(false);
      });
  }

  function handleDelSale() {
    setModalDelSale(false);
    allClear();
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

  async function handleFinished() {
    setModalFinished(false);
    await allClear();
    await findProducts();
    setDateSale(moment().format());
  }

  async function findProducts() {
    setSpinner(true);
    await api
      .get("/orders/findAllProducts")
      .then((response) => {
        setProducts(response.data.products);
        setSpinner(false);
        setMenuGeral(false);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setSpinner(false);
      });
  }

  async function SaveSell() {
    if (clientId === "") {
      warningWar("Atenção", "Não existe um cliente selecionado");
      return false;
    }
    if (idAddress === "") {
      stoped();
      return false;
    }
    if (idVendedor === "") {
      warningWar("Atenção", "Não existe um vendedor selecionado");
      return false;
    }
    if (!productSale.length) {
      warningWar("Atenção", "Não existe produtos para concluir a venda.");
      return false;
    }
    if (!totalLiquid) {
      warningWar("Atenção", "O campo: TOTAL LÍQUIDO está vazio");
      return false;
    }
    setLoadingSell(true);
    await api
      .post("/orders/createSale", {
        client: clientId,
        funcionario: idVendedor,
        products: productSale,
        statuSales: "sale",
        desconto: desconto,
        valueLiquido: totalLiquid,
        valueBruto: totalBruto,
        obs: observation,
        address: idAddress,
        data: dateSale,
        descontoValue: descontoValue,
        refOrderService: referenced,
      })
      .then((response) => {
        setDesc(response.data.ordem.desconto);
        setLiquid(response.data.ordem.valueLiquido);
        setBrut(response.data.ordem.valueBruto);
        setIdFinishedSale(response.data.ordem._id);
        setOrderFim(response.data.ordem);
        setModalSendSell(true);
        setLoadingSell(false);
        if (response.data.message) {
          info(response.data.message);
        }
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoadingSell(false);
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

  function warning() {
    Modal.warning({
      title: "Produto Indisponível",
      content: (
        <div>
          <p>{`Este produto não tem a quantidade pedida no estoque`}</p>
        </div>
      ),
      onOk() {},
    });
  }

  function stoped() {
    Modal.error({
      title: "Operação não realizada",
      content: (
        <div>
          <p>{`Esta venda não pode ser finalizada pois o cliente não possui um endereço cadastrado.`}</p>
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

  function handleSaveSellInfo() {
    if (desconto > 20) {
      setModalAuth(true);
      return false;
    }
    SaveSell();
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
        SaveSell();
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoadingAutenticate(false);
      });
  }

  async function finders() {
    setSpinner(true);
    await api
      .get("/orders/listsSale")
      .then((response) => {
        setClients(response.data.clients);
        setAddress(response.data.address);
        setProducts(response.data.products);
        setSpinner(false);
      })
      .catch((error) => {
        erro("Erro", error.message);
        setSpinner(false);
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

  async function admin() {
    const name = await sessionStorage.getItem("name");
    const idVend = await sessionStorage.getItem("id");
    await setIdVendedor(idVend);
    await setNameVendedor(name);
  }

  useEffect(() => {
    admin();
    findDados();
    finders();
    setDateSale(moment().format());
  }, []);

  useEffect(() => {
    if (productSale.length) {
      var valores = productSale.filter((valor) => {
        return valor.valueTotal;
      });

      var calculo = valores.reduce((sum, valor) => {
        return sum + valor.valueTotal;
      }, 0);

      setTotalLiquid(parseFloat(calculo));
      setTotalBruto(parseFloat(calculo));
      setDesconto(0);
    } else {
      setTotalLiquid(0);
      setTotalBruto(0);
    }
  }, [productSale]);

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
      await setClientsHandle(clients);
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

  async function handleClient(value) {
    const clientInfo = await clients.find((obj) => obj.name === value);
    const clientAddress = await address.find(
      (obj) => obj.client._id === clientInfo._id
    );
    if (clientAddress) {
      await setClientAddress(clientAddress);
      await setIdAddress(clientAddress._id);
    } else {
      await setIdAddress("");
      await setClientAddress({});
    }
    setClientName(clientInfo.name);
    setClientId(clientInfo._id);
    setPhoneClient(clientInfo.phoneComercial);
    setClientCPF(clientInfo.cpf_cnpj);
    setClientObj(clientInfo);
    setAddressObj(clientAddress);
    setModalHandleClients(false);
  }

  async function handleProduto(value) {
    const productInfo = await products.find((obj) => obj._id === value);
    const filtro = await productSale.find((obj) => obj.product === value);
    if (filtro) {
      warningWar("Atenção", "Este produto já foi adicionado");
      return false;
    }
    if (quantity > productInfo.estoqueAct) {
      warning();
      return false;
    }
    const total = (await productInfo.valueSale) * quantity;
    const info = await {
      quantity: quantity,
      product: productInfo._id,
      name: productInfo.codiname,
      unidade: productInfo.unMedida,
      valueUnit: productInfo.valueSale,
      valueTotal: total,
      code: productInfo.code,
      estoque: productInfo.estoqueAct,
      valueDesconto: 0,
    };
    await setProductSale([...productSale, info]);
    await setQuantity(1);
  }

  async function delItem(id) {
    if (blockOrcaButtom === false) {
      warningWar(
        "Atenção",
        "Não é possível excluir um produto de um orçamento já salvo"
      );
      return false;
    }
    const dataSource = await [...productSale];
    setProductSale(dataSource.filter((item) => item.product !== id));
  }

  function handleDesconto() {
    setDesconto(0);
    setTotalLiquid(totalBruto);
    setModalAuth(false);
  }

  useEffect(() => {
    handleBarcode(codeBar);
    handleCodeSemGtin(codeBar);
  }, [codeBar]);

  async function handleCodeSemGtin(code) {
    const productInfoCode = await products.find((obj) => obj.code === code);
    if (productInfoCode) {
      await setProductsHandle([productInfoCode]);
      await setCodeBar("");
      await setQuantity(1);
    }
  }

  async function handleBarcode(code) {
    const productInfo = await products.find(
      (obj) => obj.codeUniversal === code
    );
    if (productInfo) {
      await setProductsHandle([productInfo]);
      await setCodeBar("");
      await setQuantity(1);
    }
  }

  useEffect(() => {
    finderProductsBySource(finderProduct);
  }, [finderProduct]);

  useEffect(() => {
    finderProductsBySku(sku);
  }, [sku]);

  useEffect(() => {
    setProductsHandle(products);
  }, [modalHandleProducts]);

  async function finderProductsBySku(text) {
    if (text === "") {
      await setProductsHandle(products);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await products.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          if (frase.sku) {
            return resultadoAnterior && frase.sku.includes(termoBuscado);
          }
        }, true);
      });
      await setProductsHandle(frasesFiltradas);
    }
  }

  async function finderProductsBySource(text) {
    if (text === "") {
      await setProductsHandle(products);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await products.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.codiname.includes(termoBuscado);
        }, true);
      });
      await setProductsHandle(frasesFiltradas);
    }
  }

  function handleConfirm() {
    setModalSendSell(false);
    FindPayments();
  }

  function handleToPrint() {
    setModalPrint(true);
    setModalOrcamentPrint(false);
    setModalFinished(false);
  }

  function handleClosePrintModal() {
    allClear();
    setModalPrint(false);
    findProducts();
    setDateSale(moment().format());
  }

  async function handleToOrcament(id) {
    const result = await orcamentSearch.find((obj) => obj._id === id);
    const clienToSearch = await clients.find(
      (obj) => obj._id === result.client._id
    );
    const addressSearch = await address.find(
      (obj) => obj.client._id === result.client._id
    );
    await setProductSale(result.products);
    if (addressSearch) {
      await setClientAddress(addressSearch);
      await setIdAddress(addressSearch._id);
    } else {
      await setIdAddress("");
      await setClientAddress({});
    }
    await setClientName(clienToSearch.name);
    await setClientId(clienToSearch._id);
    await setPhoneClient(clienToSearch.phoneComercial);
    await setClientCPF(clienToSearch.cpf_cnpj);
    await setClientObj(clienToSearch);
    await setAddressObj(addressSearch);
    await setTotalBruto(result.valueBruto);
    await setTotalLiquid(result.valueLiquido);
    await setDesconto(result.desconto);
    await setBlockOrcaButtom(false);
    await setIdOrcamentSave(result._id);
    await setModalOrcamentSearch(false);
  }

  async function updateOrcament() {
    setLoadingOrcament(true);
    api
      .put(`/orders/changeOrcamentBalcao/${idOrcamentSave}`, {
        products: productSale,
        totalBrut: totalBruto,
        totalLiquid: totalLiquid,
        desc: desconto,
        obs: observation,
      })
      .then((response) => {
        setModalHandleSaveOrcament(false);
        success("Sucesso", response.data.message);
        setLoadingOrcament(false);
        allClear();
        findProducts();
        setDateSale(moment().format());
        setBlockOrcaButtom(true);
      })
      .catch((error) => {
        setModalHandleSaveOrcament(false);
        erro("Erro", error.response.data.message);
        setLoadingOrcament(false);
      });
  }

  async function finalizeOrcament() {
    setLoadingSell(true);
    api
      .put(`/orders/completeOrcamentBalcao/${idOrcamentSave}`, {
        products: productSale,
        totalBrut: totalBruto,
        totalLiquid: totalLiquid,
        desc: desconto,
        obs: observation,
      })
      .then((response) => {
        setModalHandleSaveOrcament(false);
        setDesc(response.data.ordem.desconto);
        setLiquid(response.data.ordem.valueLiquido);
        setBrut(response.data.ordem.valueBruto);
        setIdFinishedSale(response.data.ordem._id);
        setOrderFim(response.data.ordem);
        setModalSendSell(true);
        setLoadingSell(false);
      })
      .catch((error) => {
        setModalHandleSaveOrcament(false);
        erro("Erro", error.response.data.message);
        setLoadingSell(false);
      });
  }

  function replaceValue(value) {
    let casas = Math.pow(10, 2);
    return Math.floor(value * casas) / casas;
  }

  async function calculateDesc() {
    let itensNumber = productSale.length;
    var totalLiquido = [];
    for (let index = 0; index < itensNumber; index++) {
      let calc = productSale[index].valueTotal * (desconto / 100);
      productSale[index].valueDesconto = calc;
    }
    for (let index = 0; index < itensNumber; index++) {
      let calc =
        productSale[index].valueTotal - productSale[index].valueDesconto;
      totalLiquido.push(calc);
    }
    let totalDescontosArray = totalLiquido.reduce(function (total, numero) {
      return total + numero;
    }, 0);
    setTotalLiquid(totalDescontosArray);
    setDescontoValue(totalBruto - totalDescontosArray);
  }

  function handleModalSearch() {
    setMenuGeral(false);
    setModalSearch(true);
  }

  function handleModalSaveOrcament() {
    setMenuGeral(false);
    setModalHandleSaveOrcament(true);
  }

  function handleModalOrcament() {
    setMenuGeral(false);
    setModalOrcament(true);
  }

  function handleModalDelSale() {
    setMenuGeral(false);
    setModalDelSale(true);
  }

  const DataAtual = new Date();
  const Ano = DataAtual.getFullYear();

  const columns = [
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
    {
      title: "Ações",
      dataIndex: "product",
      key: "product",
      width: "6%",
      render: (id) => (
        <>
          <Popconfirm
            title="Deseja remover este item?"
            okText="Sim"
            cancelText="Não"
            onConfirm={() => delItem(id)}
          >
            <Icon type="close" style={{ color: "red" }} />
          </Popconfirm>
        </>
      ),
      align: "center",
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

  const dataResume = [
    {
      key: "1",
      info: "TOTAL BRUTO",
      value: `${replaceValue(brut).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}`,
    },
    {
      key: "2",
      info: "DESCONTO",
      value: `${replaceValue(desc)} %`,
    },
    {
      key: "3",
      info: "TOTAL A PAGAR",
      value: `${replaceValue(liquid).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}`,
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
      dataIndex: "codiname",
      key: "codiname",
      width: "58%",
      ellipsis: true,
    },
    {
      title: "Un.",
      dataIndex: "unMedida",
      key: "unMedida",
      width: "10%",
      align: "center",
    },
    {
      title: "Estoque",
      dataIndex: "estoqueAct",
      key: "estoqueAct",
      align: "center",
      width: "10%",
    },
    {
      title: "Preço",
      dataIndex: "valueSale",
      key: "valueSale",
      width: "13%",
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
              onClick={() => handleProduto(id)}
            />
          </Tooltip>
        </>
      ),
      width: "8%",
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

  const columnsOrcament = [
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
          <Tooltip placement="top" title="Usar este Orçamento">
            <Button
              shape="circle"
              icon="plus"
              size="small"
              style={{ marginRight: 5 }}
              type="primary"
              onClick={() => handleToOrcament(id)}
            />
          </Tooltip>
        </>
      ),
      align: "center",
    },
  ];

  return (
    <>
      <Header>
        <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
          <Icon type="shopping" style={{ fontSize: 20 }} /> BALCÃO DE VENDAS
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <span style={{ marginRight: 50, display: "block" }}>
            Vendedor: <strong>{nameVendedor}</strong>
          </span>
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
              borderRadius: 5,
            }}
            style={{
              borderRadius: 5,
              boxShadow: "0px 0px 5px rgba(26,26,26,.1)",
              overflow: "hidden",
            }}
          >
            <Row gutter={10}>
              <Col span={24}>
                <Row gutter={10}>
                  <Col span={2}>
                    <label>O.S.</label>
                    <Input
                      size="large"
                      type="number"
                      value={referenced}
                      onChange={(text) =>
                        setReferenced(parseInt(text.target.value))
                      }
                    />
                  </Col>
                  <Col span={14}>
                    <label>Selecione o Cliente</label>
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
                  <Col span={3}>
                    <label>Data do Pedido</label>
                    <DatePicker
                      format="DD/MM/YYYY"
                      style={{ width: "100%" }}
                      showToday={false}
                      value={moment(dateSale)}
                      onChange={(value) => setDateSale(moment(value).format())}
                      size="large"
                    />
                  </Col>
                  <Col span={1}>
                    <label>(F12)</label>
                    <Tooltip title="Abrir Menu">
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
                        {clientCPF}
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
                        {clientAddress.street}, {clientAddress.number},{" "}
                        {clientAddress.city} - {clientAddress.state}
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
                        <strong>Contato:</strong> {phoneClient}
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

          <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
            PRODUTOS
          </Divider>

          <Row style={{ marginBottom: 90 }}>
            <Col span={24} style={{ overflow: "auto" }}>
              <Table
                pagination={false}
                columns={columns}
                dataSource={productSale}
                size="small"
                rowKey={(prod) => prod.product}
                rowClassName={(record) =>
                  record.estoque <= 5 ? "red-row" : ""
                }
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
                style={{ paddingRight: 10, borderRight: "1px solid lightgray" }}
              >
                <Row gutter={8}>
                  <Col span={24}>
                    <label style={{ color: "transparent" }}>
                      Total Líquido
                    </label>
                    <Button
                      onClick={() => setModalHandleProducts(true)}
                      icon="tags"
                      size="large"
                      type="primary"
                      style={{ width: "100%" }}
                    >
                      Produtos (F2)
                    </Button>
                  </Col>
                </Row>
              </Col>

              <Col span={20} style={{ paddingLeft: 10 }}>
                <Row gutter={12}>
                  <Col span={6}>
                    <label style={{ color: "#fff" }}>Total Bruto</label>
                    <Input
                      value={replaceValue(totalBruto)}
                      size="large"
                      readOnly
                      addonBefore="R$"
                    />
                  </Col>

                  <Col span={4}>
                    <label
                      style={{ color: "#fff", display: "block", width: "100%" }}
                    >
                      Desconto (F10)
                    </label>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 2,
                      }}
                    >
                      <InputNumber
                        value={replaceValue(desconto)}
                        formatter={(value) => `${value}%`}
                        onChange={(value) => setDesconto(value)}
                        style={{ width: "85%", backgroundColor: colorDesc }}
                        size="large"
                        readOnly
                      />
                      <Tooltip title="Adicionar Desconto" placement="top">
                        <Button
                          icon="plus"
                          type="primary"
                          size="large"
                          onClick={() => setModalDesc(true)}
                        />
                      </Tooltip>
                    </div>
                  </Col>

                  <Col span={6}>
                    <label style={{ color: "#fff" }}>Total Líquido</label>
                    <Input
                      id="totalLiquid"
                      value={replaceValue(totalLiquid)}
                      style={{ width: "100%" }}
                      size="large"
                      onChange={(e) => setTotalLiquid(e.target.value)}
                      addonBefore="R$"
                      readOnly
                    />
                  </Col>

                  <Col span={8}>
                    <label style={{ color: "transparent" }}>
                      Total Líquido
                    </label>
                    {blockOrcaButtom === true ? (
                      <Button
                        size="large"
                        type="primary"
                        icon="check"
                        style={{ width: "100%" }}
                        loading={loadingSell}
                        onClick={() => handleSaveSellInfo()}
                      >
                        Finalizar Venda (F9)
                      </Button>
                    ) : (
                      <Button
                        size="large"
                        type="primary"
                        icon="check"
                        style={{ width: "100%" }}
                        loading={loadingSell}
                        onClick={() => finalizeOrcament()}
                      >
                        Finalizar Orçamento (F11)
                      </Button>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>

          <Modal
            visible={modalSendSell}
            title="Adicionar Pagamento"
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
            visible={modalAuth}
            title="Senha Administrativa"
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
            visible={modalOrcamentSearch}
            title="Orçamentos"
            onCancel={() => setModalOrcamentSearch(false)}
            footer={false}
            width="85%"
            centered
            bodyStyle={{ overflow: "auto", height: "79vh" }}
          >
            <Table
              pagination={{ pageSize: 15 }}
              columns={columnsOrcament}
              dataSource={orcamentSearch}
              size="small"
              rowKey={(orca) => orca._id}
            />
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
                onClick={() => handleFinished()}
              >
                Fechar
              </Button>,
              <Button
                key="print"
                icon="printer"
                type="primary"
                onClick={() => handleToPrint()}
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
                <Icon type="check" style={{ color: "white" }} /> Processo
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
              PRODUTOS
            </Divider>

            <Table
              pagination={false}
              columns={columns2}
              dataSource={productSale}
              size="small"
              rowKey={(prod) => prod.product}
              rowClassName={(record) => (record.estoque <= 5 ? "red-row" : "")}
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
            />
          </Modal>

          <Modal
            visible={modalOrcament}
            title="Salvar Orçamento"
            closable={false}
            footer={[
              <Button
                key="back"
                icon="close"
                type="danger"
                onClick={() => setModalOrcament(false)}
              >
                Não
              </Button>,
              <Button
                key="submit"
                icon="check"
                type="primary"
                loading={loadingOrcament}
                onClick={() => SaveWithOrcament()}
              >
                Sim
              </Button>,
            ]}
          >
            <p>Deseja salvar esta venda?</p>
          </Modal>

          <Modal
            visible={modalDelSale}
            title="Cancelar Venda"
            closable={false}
            footer={[
              <Button
                key="back"
                icon="close"
                type="danger"
                onClick={() => setModalDelSale(false)}
              >
                Não
              </Button>,
              <Button
                key="submit"
                icon="check"
                type="primary"
                loading={loadingOrcament}
                onClick={() => handleDelSale()}
              >
                Sim
              </Button>,
            ]}
          >
            <p>Deseja cancelar esta venda?</p>
          </Modal>

          <Modal
            visible={modalHandleSaveOrcament}
            title="Salvar Orçamento"
            closable={false}
            footer={[
              <Button
                key="back"
                icon="close"
                type="danger"
                onClick={() => setModalHandleSaveOrcament(false)}
              >
                Não
              </Button>,
              <Button
                key="submit"
                icon="check"
                type="primary"
                loading={loadingOrcament}
                onClick={() => updateOrcament()}
              >
                Sim
              </Button>,
            ]}
          >
            <p>Deseja salvar este orçamento?</p>
          </Modal>

          <Modal
            visible={modalOrcamentPrint}
            title="Informação"
            closable={false}
            onCancel={handleCloseModalOcaPrint}
            footer={[
              <Button
                key="back"
                icon="close"
                type="danger"
                onClick={() => handleCloseModalOcaPrint()}
              >
                Fechar
              </Button>,
              <Button
                key="submit"
                icon="printer"
                type="primary"
                onClick={() => handleToPrint()}
              >
                Imprimir
              </Button>,
            ]}
          >
            <p>Venda salva com sucesso</p>
          </Modal>

          <Modal
            visible={modalObservation}
            title="Observação"
            onCancel={() => setModalObservation(false)}
            footer={[
              <Button
                key="back"
                icon="close"
                type="danger"
                onClick={() => setModalObservation(false)}
              >
                Fechar
              </Button>,
            ]}
            width="80%"
          >
            <TextArea
              rows={4}
              value={observation}
              onChange={(e) => setObservation(e.target.value.toUpperCase())}
            />
          </Modal>

          <Modal
            visible={modalHandleProducts}
            title="Produtos"
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
                  value={replaceValue(totalLiquid)}
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

                <Col span={8}>
                  <label>Código de Barras (F7)</label>
                  <Input
                    id="barcode"
                    autoFocus
                    type="text"
                    value={codeBar}
                    onChange={(e) => setCodeBar(e.target.value)}
                    addonAfter={
                      <Button
                        type="link"
                        icon="close"
                        size="small"
                        onClick={() => setCodeBar("")}
                      />
                    }
                  />
                </Col>

                <Col span={9}>
                  <label>Digite para Buscar o Produto (F8)</label>
                  <Input
                    id="products"
                    value={finderProduct}
                    onChange={(e) =>
                      setFinderProduct(e.target.value.toUpperCase())
                    }
                  />
                </Col>

                <Col span={5}>
                  <label>SKU (F5)</label>
                  <Input
                    id="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value.toUpperCase())}
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

          <Modal
            visible={modalPrint}
            title="Imprimir"
            onCancel={() => handleClosePrintModal()}
            footer={false}
            width="30%"
            centered
          >
            {modalPrint === true && <ModulePrintSale id={orderFim._id} />}
          </Modal>

          <Modal
            visible={modalDesc}
            title="Adicionar Desconto"
            onCancel={() => setModalDesc(false)}
            footer={[
              <Button
                key="back"
                icon="calculator"
                type="primary"
                size="large"
                onClick={() => calculateDesc()}
                style={{ width: "100%" }}
              >
                Calcular Desconto
              </Button>,
            ]}
            width="30%"
            centered
          >
            <Input
              type="number"
              size="large"
              value={desconto}
              onChange={(e) => setDesconto(e.target.value)}
              addonAfter="%"
              style={{ width: "100%" }}
              id="desconto"
            />

            <span
              style={{
                width: "100%",
                textAlign: "center",
                fontSize: 45,
                display: "block",
                marginTop: 10,
                marginBottom: -10,
              }}
            >
              R$ {replaceValue(totalLiquid)}
            </span>
          </Modal>

          <Modal
            visible={modalSearch}
            title="Busca Avançada"
            onCancel={() => setModalSearch(false)}
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
                onClick={() => sendFinder()}
              >
                Buscar
              </Button>,
            ]}
            width="45%"
          >
            <label>Selecione uma opção:</label>
            <Select
              value={searchType}
              style={{ width: "100%" }}
              onChange={(value) => setSearchType(value)}
            >
              <Option value={2}>Buscar por Cliente</Option>
              <Option value={3}>Buscar por Data</Option>
              <Option value={4}>Buscar por Período</Option>
              <Option value={5}>Buscar por Número da Venda</Option>
            </Select>

            {searchType === 2 && (
              <>
                <Divider>Selecione o Cliente</Divider>
                <TreeSelect
                  showSearch
                  style={{ width: "100%", marginBottom: 20 }}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  value={clientNameSearch}
                  treeDefaultExpandAll
                  onChange={(value) => handleClienteSearch(value)}
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

          <Drawer
            title="Menu"
            placement="left"
            onClose={() => setMenuGeral(false)}
            visible={menuGeral}
          >
            <Divider style={{ fontSize: 12, fontWeight: 600 }}>
              INFORMAÇÕES
            </Divider>
            <Button
              onClick={() => findProducts()}
              type="default"
              icon="sync"
              style={{ width: "100%", overflow: "hidden" }}
              size="large"
            >
              Atualizar
            </Button>
            <Divider style={{ fontSize: 12, fontWeight: 600 }}>
              ORÇAMENTOS
            </Divider>
            <Button
              onClick={() => handleModalSearch()}
              type="default"
              icon="file-text"
              style={{ width: "100%", overflow: "hidden", marginBottom: 10 }}
              size="large"
            >
              Buscar Orçamentos
            </Button>
            <Button
              onClick={() => handleModalSaveOrcament()}
              type="default"
              icon="save"
              style={{
                width: "100%",
                overflow: "hidden",
              }}
              size="large"
              disabled={blockOrcaButtom}
            >
              Salvar Orçamento
            </Button>
            <Divider style={{ fontSize: 12, fontWeight: 600 }}>
              VENDA ATUAL
            </Divider>
            <Button
              onClick={() => handleModalOrcament()}
              type="default"
              icon="save"
              style={{
                width: "100%",
                overflow: "hidden",
                marginBottom: 10,
              }}
              size="large"
              disabled={!blockOrcaButtom}
            >
              Salvar Como
            </Button>
            <Button
              onClick={() => {}}
              type="default"
              icon="printer"
              style={{
                width: "100%",
                overflow: "hidden",
                marginBottom: 10,
              }}
              size="large"
            >
              Imprimir
            </Button>
            <Button
              onClick={() => handleModalDelSale()}
              type="danger"
              icon="close"
              style={{ width: "100%" }}
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
