import React, { Component } from "react";
import {
  Icon,
  Button,
  Table,
  Spin,
  Modal,
  Tooltip,
  Input,
  Row,
  Col,
  Select,
  Divider,
  Statistic,
  Switch,
  TreeSelect,
  Card,
  Radio,
} from "antd";
import api from "../../../config/axios";
import Highlighter from "react-highlight-words";
import PisCofinsCst from "../../../data/pisCst.json";
import "../../../styles/style.css";
import MargeLucro from "../../../data/margeLucro.json";

const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;

export default class GerenciaProdutosChanged extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      spinner: false,
      loading: false,
      products: [],
      name: null,
      description: null,
      unMedida: null,
      codeUniversal: null,
      productId: null,
      modalProduct: false,
      cfop: "",
      ncm: "",
      cest: "",
      codeSku: "",
      codiname: "",
      valueCusto: 0,
      valueDiversos: 0,
      valueSale: 0,
      icms: 0,
      pis: 0,
      cofins: 0,
      icmsOrigem: "",
      icmsCst: "",
      pisCst: "",
      cofinsCst: "",
      listPisCofinsCst: PisCofinsCst,
      estoqueAct: 0,
      newEstoque: 0,
      margeLucro: "",
      disableCalculate: false,
      modalDelProduct: false,
      idProductToDell: "",
      loadingDel: false,
      active: null,
      margeLucroData: MargeLucro.marge,
      margeLucroValue: 0,
      frete: 0,
      icmsMargemValorAddST: 0,
      icmsSTModBC: "",
      icmsSTRate: 0,
      fcpRate: 0,
      fcpRetRate: 0,
      fcpSTRate: 0,
      modeCalc: "",
      markupFactor: 0,
      margemLiquida: 0,
      valorTotalProdutos: 0,
      icmsAliqTotal: 0,
      pisAndCofins: 0,
      comission: 0,
      adminExpenses: 0,
      unitsRef: 0,
      valueUnitRef: 0,
      valueTotalRef: 0,
      disabledCancel: false,
      otherExpensesRef: 0,
      freteRef: 0,
      ipiCst: "",
      ipiRate: 0,
      ipiCode: "",
      sku: "",
    };
  }

  allClear = () => {
    this.setState({ comission: 0 });
    this.setState({ markupFactor: 0 });
    this.setState({ margemLiquida: 0 });
    this.setState({ margeLucroValue: 0 });
    this.setState({ margeLucro: "" });
    this.setState({ newEstoque: 0 });
  };

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

  handleActive = async (id) => {
    await this.setState({ idProductToDell: id._id });
    await this.setState({ active: !id.active });
    this.sendActive();
  };

  sendActive = async () => {
    this.setState({ spinner: true });
    await api
      .put(`/stock/active/${this.state.idProductToDell}`, {
        active: this.state.active,
      })
      .then((response) => {
        this.success("Sucesso", response.data.message);
        this.setState({ spinner: false });
        this.findProducts();
      })
      .catch((error) => {
        this.erro("Erro", error.message);
        this.setState({ spinner: false });
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

  findProducts = async () => {
    this.setState({ spinner: true });
    await api
      .get("/admin/listProductsChanged")
      .then((response) => {
        this.setState({ products: response.data.produtos });
        this.setState({ spinner: false });
      })
      .catch((error) => {
        if (error.message === "Network Error") {
          this.erro("Erro", "Sem conexão com o servidor");
          this.setState({ spinner: false });
          return false;
        } else {
          this.erro("Erro", error.response.data.message);
          this.setState({ spinner: false });
        }
      });
  };

  componentDidMount = () => {
    this.findProducts();
  };

  handleEditProduct = async (id) => {
    const result = await this.state.products.find((obj) => obj._id === id);
    this.setState({ productId: result._id });
    this.setState({ name: result.name });
    this.setState({ unMedida: result.unMedida });
    this.setState({ description: result.description });
    this.setState({ codeUniversal: result.codeUniversal });
    this.setState({ cfop: result.cfop });
    this.setState({ ncm: result.ncm });
    this.setState({ cest: result.cest });
    this.setState({ codeSku: result.code });
    this.setState({ codiname: result.codiname });
    this.setState({ valueCusto: result.valueCusto });
    this.setState({ valueUnitRef: result.valueCusto });
    this.setState({ valueDiversos: result.valueDiversos });
    this.setState({ otherExpensesRef: result.valueDiversos });
    this.setState({ valueSale: result.valueSale });
    this.setState({ sku: result.sku ? result.sku : "" });
    this.setState({
      valorTotalProdutos:
        (result.valueCusto + result.valueDiversos + result.frete) *
        result.estoqueAct,
    });
    this.setState({ valueTotalRef: result.valueCusto * result.estoqueAct });
    result.frete
      ? this.setState({ frete: result.frete })
      : this.setState({ frete: 0 });
    result.frete
      ? this.setState({ freteRef: result.frete })
      : this.setState({ freteRef: 0 });
    //** ICMS */
    this.setState({ icms: result.icms.rate });
    this.setState({ icmsCst: result.icms.csosn });
    this.setState({ icmsOrigem: result.icms.origin });
    result.icms.icmsSTRate
      ? this.setState({ icmsSTRate: result.icms.icmsSTRate })
      : this.setState({ icmsSTRate: 0 });
    result.icms.icmsMargemValorAddST
      ? this.setState({
          icmsMargemValorAddST: result.icms.icmsMargemValorAddST,
        })
      : this.setState({ icmsMargemValorAddST: 0 });
    result.icms.icmsSTModBC
      ? this.setState({ icmsSTModBC: result.icms.icmsSTModBC })
      : this.setState({ icmsSTModBC: "" });
    result.icms.fcpRate
      ? this.setState({ fcpRate: result.icms.fcpRate })
      : this.setState({ fcpRate: 0 });
    result.icms.fcpSTRate
      ? this.setState({ fcpSTRate: result.icms.fcpSTRate })
      : this.setState({ fcpSTRate: 0 });
    result.icms.fcpRetRate
      ? this.setState({ fcpRetRate: result.icms.fcpRetRate })
      : this.setState({ fcpRetRate: 0 });
    this.setState({
      icmsAliqTotal:
        result.icms.rate +
        result.icms.icmsSTRate +
        result.icms.fcpRate +
        result.icms.fcpRetRate,
    });
    result.icms.ipiRate
      ? this.setState({ ipiRate: result.icms.ipiRate })
      : this.setState({ ipiRate: 0 });
    result.icms.ipiCst
      ? this.setState({ ipiCst: result.icms.ipiCst })
      : this.setState({ ipiCst: "" });
    result.icms.ipiCode
      ? this.setState({ ipiCode: result.icms.ipiCode })
      : this.setState({ ipiCode: "" });
    let rateIcmsSt;
    let rateFcp;
    let rateFcpRet;

    rateIcmsSt = result.icms.icmsSTRate ? result.icms.icmsSTRate : 0;
    rateFcp = result.icms.fcpRate ? result.icms.fcpRate : 0;
    rateFcpRet = result.icms.fcpRetRate ? result.icms.fcpRetRate : 0;

    this.setState({
      icmsAliqTotal:
        result.icms.rate +
        parseFloat(rateIcmsSt) +
        parseFloat(rateFcp) +
        parseFloat(rateFcpRet),
    });

    result.icms.ipiRate
      ? this.setState({ ipiRate: result.icms.ipiRate })
      : this.setState({ ipiRate: 0 });
    //** PIS */
    this.setState({ pisCst: result.pis.cst });
    this.setState({ pis: result.pis.rate });
    //** COFINS */
    this.setState({ cofinsCst: result.cofins.cst });
    this.setState({ cofins: result.cofins.rate });
    this.setState({ pisAndCofins: result.pis.rate + result.cofins.rate });
    //** ESTOQUE */
    this.setState({ estoqueAct: result.estoqueAct });
    this.setState({ newEstoque: result.estoqueAct });
    this.setState({ unitsRef: result.estoqueAct });
    if (!result.typeCalculate) {
      if (result.margeLucro) {
        const resultMarge = await this.state.margeLucroData.find(
          (obj) => obj.value === result.margeLucro
        );
        this.setState({ margeLucro: resultMarge.text });
        this.setState({ margeLucroValue: resultMarge.value });
        this.setState({ modeCalc: "margemBruta" });
      } else {
        this.setState({ modeCalc: "markup" });
      }
    } else {
      if (result.typeCalculate === "margemBruta") {
        this.setState({ modeCalc: result.typeCalculate });
        if (result.margeLucro) {
          const resultMarge = await this.state.margeLucroData.find(
            (obj) => obj.value === result.margeLucro
          );
          this.setState({ margeLucro: resultMarge.text });
          this.setState({ margeLucroValue: resultMarge.value });
        }
      }
      if (result.typeCalculate === "markup") {
        this.setState({ modeCalc: result.typeCalculate });
        this.setState({ markupFactor: result.markupFactor.factor });
        this.setState({ margemLiquida: result.markupFactor.margeLucro });
        this.setState({ comission: result.markupFactor.comission });
        this.setState({ adminExpenses: result.markupFactor.otherExpenses });
      }
    }
    this.setState({ modalProduct: true });
  };

  calculatePriceForSale = async () => {
    let calcIcms;
    let calcPis;
    let calcCofins;
    let calcFcp;
    let calcFcpSt;
    let calcFcpRet;
    let calcIcmsSt;
    let totalPrice =
      this.state.valueCusto + this.state.valueDiversos + this.state.frete;
    calcIcms = this.state.icms > 0 ? (this.state.icms / 100) * totalPrice : 0;
    calcPis = this.state.pis > 0 ? (this.state.pis / 100) * totalPrice : 0;
    calcCofins =
      this.state.cofins > 0 ? (this.state.cofins / 100) * totalPrice : 0;
    calcFcp =
      this.state.fcpRate > 0 ? (this.state.fcpRate / 100) * totalPrice : 0;
    calcFcpSt =
      this.state.fcpSTRate > 0 ? (this.state.fcpSTRate / 100) * totalPrice : 0;
    calcFcpRet =
      this.state.fcpRetRate > 0
        ? (this.state.fcpRetRate / 100) * totalPrice
        : 0;
    calcIcmsSt =
      this.state.icmsSTRate > 0
        ? (this.state.icmsSTRate / 100) * totalPrice
        : 0;
    let finalPrice =
      (await totalPrice) +
      calcIcms +
      calcPis +
      calcCofins +
      calcFcp +
      calcFcpSt +
      calcFcpRet +
      calcIcmsSt;
    let calcFinal = (await finalPrice) * this.state.margeLucroValue;
    let calcConverted = parseFloat(calcFinal.toFixed(2));
    await this.setState({ valueSale: calcConverted });
  };

  calculateUnitForSale = async () => {
    if (this.state.estoqueAct === this.state.newEstoque) {
      return false;
    } else {
      let priceUnit = this.state.valueCusto / this.state.newEstoque;
      let otherUnit = this.state.valueDiversos / this.state.newEstoque;
      let frete =
        this.state.frete > 0 ? this.state.frete / this.state.newEstoque : 0;
      let total = frete + priceUnit + otherUnit;
      await this.setState({ valueCusto: priceUnit });
      await this.setState({ valueDiversos: otherUnit });
      await this.setState({ frete: frete });
      await this.setState({
        valorTotalProdutos: total * this.state.newEstoque,
      });
      this.setState({ disableCalculate: true });
    }
  };

  refreshUnits = () => {
    this.setState({ valueCusto: this.state.valueUnitRef });
    this.setState({ valorTotalProdutos: this.state.valueTotalRef });
    this.setState({ estoqueAct: this.state.unitsRef });
    this.setState({ newEstoque: this.state.unitsRef });
    this.setState({ valueDiversos: this.state.otherExpensesRef });
    this.setState({ frete: this.state.freteRef });
    this.setState({ disableCalculate: false });
  };

  sendUpdateProduct = async () => {
    this.setState({ loading: true });
    await api
      .put(`/admin/changeInfoProduct/${this.state.productId}`, {
        codiname: this.state.codiname,
        name: this.state.name,
        codeUniversal: this.state.codeUniversal,
        unMedida: this.state.unMedida,
        description: this.state.description,
        cest: this.state.cest,
        ncm: this.state.ncm,
        cfop: this.state.cfop,
        code: this.state.codeSku,
        valueCusto: this.state.valueCusto,
        valueDiversos: this.state.valueDiversos,
        valueSale: this.state.valueSale,
        estoqueAct: this.state.newEstoque,
        sku: this.state.sku,
        icms: {
          rate: this.state.icms,
          origin: this.state.icmsOrigem,
          csosn: this.state.icmsCst,
          icmsSTRate: this.state.icmsSTRate,
          icmsMargemValorAddST: this.state.icmsMargemValorAddST,
          icmsSTModBC: this.state.icmsSTModBC,
          fcpRate: this.state.fcpRate,
          fcpSTRate: this.state.fcpSTRate,
          fcpRetRate: this.state.fcpRetRate,
          ipiCst: this.state.ipiCst,
          ipiRate: this.state.ipiRate,
          ipiCode: this.state.ipiCode,
        },
        pis: {
          rate: this.state.pis,
          cst: this.state.pisCst,
          origin: this.state.pisOrigem,
          baseCalc: this.state.pisBc,
          value: this.state.pisValor,
        },
        cofins: {
          rate: this.state.cofins,
          cst: this.state.cofinsCst,
          origin: this.state.cofinsOrigem,
          baseCalc: this.state.cofinsBc,
          value: this.state.cofinsValor,
        },
        margeLucro: this.state.margeLucroValue,
        markupFactor: {
          factor: this.state.markupFactor,
          margeLucro: this.state.margemLiquida,
          comission: this.state.comission,
          otherExpenses: this.state.adminExpenses,
        },
        modeCalc: this.state.modeCalc,
      })
      .then((response) => {
        this.success("Sucesso", response.data.message);
        this.setState({ loading: false });
        this.handleCloseModal();
        this.findProducts();
      })
      .catch((error) => {
        if (error.message === "Network Error") {
          this.erro("Erro", "Sem conexão com o servidor");
          this.setState({ loading: false });
          return false;
        }
        this.erro("Erro", error.response.data.message);
        this.setState({ loading: false });
      });
  };

  handleCloseModal = () => {
    this.setState({ modalProduct: false });
    this.setState({ disableCalculate: false });
    this.allClear();
  };

  handleDelProduct = async (id) => {
    await this.setState({ idProductToDell: id });
    this.setState({ modalDelProduct: true });
  };

  delProduct = async () => {
    this.setState({ loadingDel: true });
    await api
      .delete(`/xmlImport/delProduct/${this.state.idProductToDell}`)
      .then((response) => {
        this.success("Sucesso", response.data.message);
        this.setState({ loadingDel: false });
        this.setState({ modalDelProduct: false });
        this.findProducts();
      })
      .catch((error) => {
        this.erro("Erro", error.response.data.message);
        this.setState({ loadingDel: false });
        this.setState({ modalDelProduct: false });
      });
  };

  handleMarge = async (marge) => {
    const result = await this.state.margeLucroData.find(
      (obj) => obj.text === marge
    );
    await this.setState({ margeLucro: result.text });
    await this.setState({ margeLucroValue: result.value });
  };

  calculatePriceForSaleMarkup = () => {
    let Ctv =
      parseFloat(this.state.icmsAliqTotal) +
      parseFloat(this.state.pisAndCofins) +
      parseFloat(this.state.comission) +
      parseFloat(this.state.adminExpenses) +
      parseFloat(this.state.margemLiquida) +
      parseFloat(this.state.ipiRate);
    let valorCusto =
      parseFloat(this.state.valueCusto) +
      parseFloat(this.state.frete) +
      parseFloat(this.state.valueDiversos);
    let mkd = (100 - Ctv) / 100;
    let valorVenda = valorCusto / mkd;
    let valorConverted = parseFloat(valorVenda.toFixed(2));
    this.setState({ markupFactor: mkd });
    this.setState({ valueSale: valorConverted });
  };

  render() {
    const columns = [
      {
        title: "Info",
        dataIndex: "confirmStatus",
        key: "confirmStatus",
        width: "4%",
        render: (value) => (
          <>
            {value === true && (
              <Tooltip title="Aguardando Atualização" placement="right">
                <Button
                  icon="hourglass"
                  type="danger"
                  shape="circle"
                  size="small"
                />
              </Tooltip>
            )}
            {value === false && (
              <Tooltip title="Produto Atualizado" placement="right">
                <Button
                  icon="check"
                  type="primary"
                  shape="circle"
                  size="small"
                />
              </Tooltip>
            )}
          </>
        ),
        align: "center",
      },
      {
        title: "Ativo?",
        dataIndex: "active",
        key: "active _id",
        width: "4%",
        render: (active, id) => (
          <>
            <Switch
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              defaultChecked={active}
              onChange={() => this.handleActive(id)}
            />
          </>
        ),
        align: "center",
      },
      {
        title: "Fornecedor",
        dataIndex: "fornecedor.name",
        key: "fornecedor.name",
        width: "15%",
        ellipsis: true,
      },
      {
        title: "Produto",
        dataIndex: "codiname",
        key: "codiname",
        width: "25%",
        ...this.getColumnSearchProps("codiname"),
      },
      {
        title: "Estoque",
        dataIndex: "estoqueAct",
        key: "estoqueAct",
        render: (value) => (
          <Statistic
            value={value}
            valueStyle={{ fontSize: 15 }}
            precision={0}
          />
        ),
        width: "6%",
        align: "center",
      },
      {
        title: "Unid.",
        dataIndex: "unMedida",
        key: "unMedida",
        align: "center",
        width: "5%",
        ...this.getColumnSearchProps("unMedida"),
      },
      {
        title: "V. Unitário",
        dataIndex: "valueCusto",
        key: "valueCusto",
        render: (value) => (
          <>
            {value ? (
              <Statistic
                value={value}
                valueStyle={{ fontSize: 15 }}
                prefix="R$"
                precision={2}
              />
            ) : (
              <Statistic
                value={0}
                valueStyle={{ fontSize: 15 }}
                prefix="R$"
                precision={2}
              />
            )}
          </>
        ),
        width: "8%",
        align: "right",
      },
      {
        title: "Outros Val.",
        dataIndex: "valueDiversos",
        key: "valueDiversos",
        render: (value) => (
          <>
            {value ? (
              <Statistic
                value={value}
                valueStyle={{ fontSize: 15 }}
                prefix="R$"
                precision={2}
              />
            ) : (
              <Statistic
                value={0}
                valueStyle={{ fontSize: 15 }}
                prefix="R$"
                precision={2}
              />
            )}
          </>
        ),
        width: "8%",
        align: "right",
      },
      {
        title: "Frete",
        dataIndex: "frete",
        key: "frete",
        render: (value) => (
          <>
            {value ? (
              <Statistic
                value={value}
                valueStyle={{ fontSize: 15 }}
                prefix="R$"
                precision={2}
              />
            ) : (
              <Statistic
                value={0}
                valueStyle={{ fontSize: 15 }}
                prefix="R$"
                precision={2}
              />
            )}
          </>
        ),
        align: "right",
        width: "8%",
      },
      {
        title: "V. de Venda",
        dataIndex: "valueSale",
        key: "valueSale",
        render: (value) => (
          <>
            {value ? (
              <Statistic
                value={value}
                valueStyle={{ fontSize: 15 }}
                prefix="R$"
                precision={2}
              />
            ) : (
              <Statistic
                value={0}
                valueStyle={{ fontSize: 15 }}
                prefix="R$"
                precision={2}
              />
            )}
          </>
        ),
        width: "8%",
        align: "right",
      },
      {
        title: "CEST",
        dataIndex: "cest",
        key: "cest",
        align: "center",
        width: "6%",
      },
      {
        title: "CFOP",
        dataIndex: "cfop",
        key: "cfop",
        align: "center",
        width: "6%",
      },
      {
        title: "NCM",
        dataIndex: "ncm",
        key: "ncm",
        align: "center",
        width: "7%",
      },
      {
        title: "Cód. Barras",
        dataIndex: "codeUniversal",
        key: "codeUniversal",
        align: "center",
        width: "8%",
      },
      {
        title: "ICMS CST",
        dataIndex: "icms.cst",
        key: "icms.cst",
        align: "center",
        width: "5%",
      },
      {
        title: "ICMS CSOSN",
        dataIndex: "icms.csosn",
        key: "icms.csosn",
        align: "center",
        width: "6%",
      },
      {
        title: "ICMS ORI.",
        dataIndex: "icms.origin",
        key: "icms.origin",
        align: "center",
        width: "5%",
      },
      {
        title: "ICMS %",
        dataIndex: "icms.rate",
        key: "icms.rate",
        render: (value) => (
          <>
            {value ? (
              <Statistic
                value={value}
                valueStyle={{ fontSize: 15 }}
                suffix="%"
                precision={2}
              />
            ) : (
              <Statistic
                value={0}
                valueStyle={{ fontSize: 15 }}
                suffix="%"
                precision={2}
              />
            )}
          </>
        ),
        width: "6%",
        align: "center",
      },
      {
        title: "ICMS ST %",
        dataIndex: "icms.icmsSTRate",
        key: "icms.icmsSTRate",
        render: (value) => (
          <>
            {value ? (
              <Statistic
                value={value}
                valueStyle={{ fontSize: 15 }}
                suffix="%"
                precision={2}
              />
            ) : (
              <Statistic
                value={0}
                valueStyle={{ fontSize: 15 }}
                suffix="%"
                precision={2}
              />
            )}
          </>
        ),
        width: "6%",
        align: "center",
      },
      {
        title: "% MVA ST",
        dataIndex: "icms.icmsMargemValorAddST",
        key: "icms.icmsMargemValorAddST",
        render: (value) => (
          <>
            {value ? (
              <Statistic
                value={value}
                suffix="%"
                valueStyle={{ fontSize: 15 }}
                precision={2}
              />
            ) : (
              <Statistic
                value={0}
                suffix="%"
                valueStyle={{ fontSize: 15 }}
                precision={2}
              />
            )}
          </>
        ),
        width: "6%",
        align: "center",
      },
      {
        title: "ICMS ST Mod. B.C",
        dataIndex: "icms.icmsSTModBC",
        key: "icms.icmsSTModBC",
        render: (value) => (
          <>
            {value === "0" && <span>Preço tabelado ou máximo sugerido</span>}
            {value === "1" && <span>Lista Negativa (valor)</span>}
            {value === "2" && <span>Lista Positiva (valor)</span>}
            {value === "3" && <span>Lista Neutra (valor)</span>}
            {value === "4" && <span>Margem Valor Agregado (%)</span>}
            {value === "5" && <span>Pauta (valor)</span>}
          </>
        ),
        width: "12%",
        align: "center",
      },
      {
        title: "% FCP",
        dataIndex: "icms.fcpRate",
        key: "icms.fcpRate",
        render: (value) => (
          <>
            {value ? (
              <Statistic
                value={value}
                valueStyle={{ fontSize: 15 }}
                suffix="%"
                precision={2}
              />
            ) : (
              <Statistic
                value={0}
                valueStyle={{ fontSize: 15 }}
                suffix="%"
                precision={2}
              />
            )}
          </>
        ),
        width: "6%",
        align: "center",
      },
      {
        title: "% FCP ST",
        dataIndex: "icms.fcpSTRate",
        key: "icms.fcpSTRate",
        render: (value) => (
          <>
            {value ? (
              <Statistic
                value={value}
                valueStyle={{ fontSize: 15 }}
                suffix="%"
                precision={2}
              />
            ) : (
              <Statistic
                value={0}
                valueStyle={{ fontSize: 15 }}
                suffix="%"
                precision={2}
              />
            )}
          </>
        ),
        width: "6%",
        align: "center",
      },
      {
        title: "% FCP RET.",
        dataIndex: "icms.fcpRetRate",
        key: "icms.fcpRetRate",
        render: (value) => (
          <>
            {value ? (
              <Statistic
                value={value}
                valueStyle={{ fontSize: 15 }}
                suffix="%"
                precision={2}
              />
            ) : (
              <Statistic
                value={0}
                valueStyle={{ fontSize: 15 }}
                suffix="%"
                precision={2}
              />
            )}
          </>
        ),
        width: "6%",
        align: "center",
      },
      {
        title: "PIS CST",
        dataIndex: "pis.cst",
        key: "pis.cst",
        align: "center",
        width: "5%",
      },
      {
        title: "% PIS",
        dataIndex: "pis.rate",
        key: "pis.rate",
        render: (value) => (
          <>
            {value ? (
              <Statistic
                value={value}
                valueStyle={{ fontSize: 15 }}
                suffix="%"
                precision={2}
              />
            ) : (
              <Statistic
                value={0}
                valueStyle={{ fontSize: 15 }}
                suffix="%"
                precision={2}
              />
            )}
          </>
        ),
        width: "6%",
        align: "center",
      },
      {
        title: "COFINS CST",
        dataIndex: "cofins.cst",
        key: "cofins.cst",
        align: "center",
        width: "6%",
      },
      {
        title: "% COFINS",
        dataIndex: "cofins.rate",
        key: "cofins.rate",
        render: (value) => (
          <>
            {value ? (
              <Statistic
                value={value}
                valueStyle={{ fontSize: 15 }}
                suffix="%"
                precision={2}
              />
            ) : (
              <Statistic
                value={0}
                valueStyle={{ fontSize: 15 }}
                suffix="%"
                precision={2}
              />
            )}
          </>
        ),
        width: "6%",
        align: "center",
      },
      {
        title: "IPI CST",
        dataIndex: "icms.ipiCst",
        key: "icms.ipiCst",
        align: "center",
        width: "6%",
      },
      {
        title: "% IPI",
        dataIndex: "icms.ipiRate",
        key: "icms.ipiRate",
        render: (value) => (
          <>
            {value ? (
              <Statistic
                value={value}
                valueStyle={{ fontSize: 15 }}
                suffix="%"
                precision={2}
              />
            ) : (
              <Statistic
                value={0}
                valueStyle={{ fontSize: 15 }}
                suffix="%"
                precision={2}
              />
            )}
          </>
        ),
        width: "6%",
        align: "center",
      },
      {
        title: "IPI Cod.",
        dataIndex: "icms.ipiCode",
        key: "icms.ipiCode",
        align: "center",
        width: "6%",
      },
      {
        title: "Atualização",
        dataIndex: "createDate",
        key: "createDate",
        align: "center",
        width: "8%",
        ...this.getColumnSearchProps("createDate"),
      },
      {
        title: "Ações",
        dataIndex: "_id",
        key: "_id",
        render: (id) => (
          <>
            <Tooltip placement="top" title="Excluir">
              <Button
                shape="circle"
                icon="close"
                type="danger"
                size="small"
                style={{ marginRight: 5 }}
                onClick={() => this.handleDelProduct(id)}
              />
            </Tooltip>
            <Tooltip placement="top" title="Editar">
              <Button
                shape="circle"
                icon="edit"
                type="primary"
                size="small"
                onClick={() => this.handleEditProduct(id)}
              />
            </Tooltip>
          </>
        ),
        width: "3.91%",
        align: "center",
        fixed: "right",
      },
    ];

    return (
      <>
        <div>
          <Button
            icon="sync"
            type="primary"
            style={{ position: "absolute", right: 0, top: 5 }}
            onClick={() => this.findProducts()}
          >
            Atualizar Produtos
          </Button>

          <Spin spinning={this.state.spinner} size="large">
            <Table
              columns={columns}
              dataSource={this.state.products}
              size="small"
              rowKey={(prod) => prod._id}
              scroll={{ x: 4200 }}
              rowClassName={(record) =>
                record.atualized === true ? "yellow-row" : ""
              }
            />

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: "#fff9c4",
                  border: "1px solid lightgray",
                }}
              />
              <label style={{ marginLeft: 10 }}>
                Produto já cadastrado que foi atualizado
              </label>
            </div>
          </Spin>
        </div>

        <Modal
          title="Gerenciar Produto"
          visible={this.state.modalProduct}
          onCancel={() => this.handleCloseModal()}
          footer={[
            <Button
              key="back"
              icon="close"
              type="danger"
              onClick={() => this.handleCloseModal()}
            >
              Cancelar
            </Button>,
            <Button
              key="submit"
              icon="save"
              type="primary"
              loading={this.state.loading}
              onClick={() => {
                this.sendUpdateProduct();
              }}
            >
              Salvar
            </Button>,
          ]}
          width="95%"
          centered
          bodyStyle={{ height: "79vh", overflow: "auto" }}
        >
          <Row gutter={10} style={{ marginBottom: 7 }}>
            <Col span={11}>
              <label>Produto</label>
              <Input
                value={this.state.codiname}
                onChange={(e) =>
                  this.setState({ codiname: e.target.value.toUpperCase() })
                }
              />
            </Col>

            <Col span={5}>
              <label>Código</label>
              <Input value={this.state.codeSku} readOnly />
            </Col>

            <Col span={3}>
              <label>SKU</label>
              <Input
                value={this.state.sku}
                onChange={(e) =>
                  this.setState({ sku: e.target.value.toUpperCase() })
                }
              />
            </Col>

            <Col span={5}>
              <label>Código de Barras</label>
              <Input
                value={this.state.codeUniversal}
                onChange={(e) =>
                  this.setState({ codeUniversal: e.target.value })
                }
              />
            </Col>
          </Row>

          <Row gutter={10} style={{ marginBottom: 7 }}>
            <Col span={8}>
              <label>
                CFOP<span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="number"
                onChange={(e) => this.setState({ cfop: e.target.value })}
                value={this.state.cfop}
              />
            </Col>

            <Col span={8}>
              <label>
                NCM<span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="number"
                value={this.state.ncm}
                onChange={(e) => this.setState({ ncm: e.target.value })}
              />
            </Col>

            <Col span={8}>
              <label>
                CEST<span style={{ color: "red" }}>*</span>
              </label>
              <Input
                onChange={(e) => this.setState({ cest: e.target.value })}
                value={this.state.cest}
              />
            </Col>
          </Row>

          <Row gutter={10}>
            <Col span={24}>
              <label>Descrição</label>
              <TextArea
                rows={2}
                onChange={(e) =>
                  this.setState({ description: e.target.value.toUpperCase() })
                }
                value={this.state.description}
              />
            </Col>
          </Row>

          <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
            TRIBUTAÇÃO
          </Divider>

          <Row gutter={10}>
            <Col span={24}>
              <Card
                title="ICMS"
                headStyle={{ fontWeight: "bold", backgroundColor: "#f8f8f8" }}
                size="small"
              >
                <Row gutter={10}>
                  <Col span={8}>
                    <label>
                      Alíquota ICMS<span style={{ color: "red" }}>*</span>
                    </label>
                    <Input
                      type="number"
                      addonAfter="%"
                      value={this.state.icms}
                      onChange={(e) =>
                        this.setState({ icms: parseFloat(e.target.value) })
                      }
                    />

                    <label>
                      ICMS: CSOSN <span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      value={this.state.icmsCst}
                      style={{ width: "100%" }}
                      onChange={(value) => this.setState({ icmsCst: value })}
                    >
                      <Option value={"101"}>
                        101 - Tributada pelo Simples Nacional com permissão de
                        crédito
                      </Option>
                      <Option value={"102"}>
                        102 - Tributada pelo Simples Nacional sem permissão de
                        crédito
                      </Option>
                      <Option value={"103"}>
                        103 - Isenção do ICMS no Simples Nacional para faixa de
                        receita bruta
                      </Option>
                      <Option value={"201"}>
                        201 - Tributada pelo Simples Nacional com permissão de
                        crédito e com cobrança do ICMS por substituição
                        tributária
                      </Option>
                      <Option value={"202"}>
                        202 - Tributada pelo Simples Nacional sem permissão de
                        crédito e com cobrança do ICMS por substituição
                        tributária
                      </Option>
                      <Option value={"203"}>
                        203 - Isenção do ICMS no Simples Nacional para faixa de
                        receita bruta e com cobrança do ICMS por substituição
                        tributária
                      </Option>
                      <Option value={"300"}>300 - Imune</Option>
                      <Option value={"400"}>
                        400 - Não tributada pelo Simples Nacional
                      </Option>
                      <Option value={"500"}>
                        500 - ICMS cobrado anteriormente por substituição
                        tributária (substituído) ou por antecipação
                      </Option>
                      <Option value={"900"}>900 - Outros</Option>
                    </Select>

                    <label>
                      ICMS Origem<span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      value={this.state.icmsOrigem}
                      style={{ width: "100%", marginBottom: 10 }}
                      onChange={(value) => this.setState({ icmsOrigem: value })}
                    >
                      <Option value={"0"}>0 - Nacional</Option>
                      <Option value={"1"}>
                        1 - Estrangeira (importação direta)
                      </Option>
                      <Option value={"2"}>
                        2 - Estrangeira (adquirida no mercado interno)
                      </Option>
                      <Option value={"3"}>
                        3 - Nacional com mais de 40% de conteúdo estrangeiro
                      </Option>
                      <Option value={"4"}>
                        4 - Nacional produzida através de processos produtivos
                        básicos
                      </Option>
                      <Option value={"5"}>
                        5 - Nacional com menos de 40% de conteúdo estrangeiro
                      </Option>
                      <Option value={"6"}>
                        6 - Estrangeira (importação direta) sem produto nacional
                        similar
                      </Option>
                      <Option value={"7"}>
                        7 - Estrangeira (adquirida no mercado interno) sem
                        produto nacional similar
                      </Option>
                      <Option value={"8"}>
                        8 - Nacional, mercadoria ou bem com Conteúdo de
                        Importação superior a 70%;
                      </Option>
                    </Select>
                  </Col>
                  <Col span={8}>
                    <label>Alíquota Substituição Tributária</label>
                    <Input
                      type="number"
                      addonAfter="%"
                      value={this.state.icmsSTRate}
                      onChange={(e) =>
                        this.setState({ icmsSTRate: e.target.value })
                      }
                    />
                    <label>ST Margem de Valor Adicionada</label>
                    <Input
                      type="number"
                      addonAfter="%"
                      value={this.state.icmsMargemValorAddST}
                      onChange={(e) =>
                        this.setState({ icmsMargemValorAddST: e.target.value })
                      }
                    />
                    <label>Modalidade de B.C. da ST</label>
                    <Select
                      value={this.state.icmsSTModBC}
                      style={{ width: "100%", marginBottom: 10 }}
                      onChange={(value) =>
                        this.setState({ icmsSTModBC: value })
                      }
                    >
                      <Option value={"0"}>
                        Preço tabelado ou máximo sugerido
                      </Option>
                      <Option value={"1"}>Lista Negativa (valor)</Option>
                      <Option value={"2"}>Lista Positiva (valor)</Option>
                      <Option value={"3"}>Lista Neutra (valor)</Option>
                      <Option value={"4"}>Margem Valor Agregado (%)</Option>
                      <Option value={"5"}>Pauta (valor)</Option>
                    </Select>
                  </Col>
                  <Col span={8}>
                    <label>Alíquota FCP</label>
                    <Input
                      type="number"
                      addonAfter="%"
                      value={this.state.fcpRate}
                      onChange={(e) =>
                        this.setState({ fcpRate: e.target.value })
                      }
                    />
                    <label>Alíquota FCP ST</label>
                    <Input
                      type="number"
                      addonAfter="%"
                      value={this.state.fcpSTRate}
                      onChange={(e) =>
                        this.setState({ fcpSTRate: e.target.value })
                      }
                    />
                    <label>Alíquota FCP ST Retido</label>
                    <Input
                      type="number"
                      addonAfter="%"
                      value={this.state.fcpRetRate}
                      onChange={(e) =>
                        this.setState({ fcpRetRate: e.target.value })
                      }
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Row gutter={10} style={{ marginTop: 10 }}>
            <Col span={8}>
              <Card
                title="IPI"
                headStyle={{ fontWeight: "bold", backgroundColor: "#f8f8f8" }}
                size="small"
              >
                <Row>
                  <Col span={12} style={{ paddingRight: 2.5 }}>
                    <label>Alíquota IPI</label>
                    <Input
                      type="number"
                      addonAfter="%"
                      value={this.state.ipiRate}
                      onChange={(e) =>
                        this.setState({ ipiRate: e.target.value })
                      }
                    />
                  </Col>
                  <Col span={12} style={{ paddingLeft: 2.5 }}>
                    <label>Código IPI</label>
                    <Input
                      value={this.state.ipiCode}
                      onChange={(e) =>
                        this.setState({ ipiCode: e.target.value })
                      }
                    />
                  </Col>
                </Row>
                <label>IPI CST</label>
                <Select
                  value={this.state.ipiCst}
                  style={{ width: "100%" }}
                  onChange={(value) => this.setState({ ipiCst: value })}
                >
                  <Option value={""}>Nenhum</Option>
                  <Option value={"00"}>
                    00 – Entrada com Recuperação de Crédito
                  </Option>
                  <Option value={"01"}>
                    01 – Entrada Tributada com Alíquota Zero
                  </Option>
                  <Option value={"02"}>02 – Entrada Isenta</Option>
                  <Option value={"03"}>03 – Entrada Não Tributada</Option>
                  <Option value={"04"}>04 – Entrada Imune</Option>
                  <Option value={"05"}>05 – Entrada com Suspensão</Option>
                  <Option value={"49"}>49 – Outras Entradas</Option>
                  <Option value={"50"}>50 – Saída Tributada</Option>
                  <Option value={"51"}>
                    51 – Saída Tributável com Alíquota Zero
                  </Option>
                  <Option value={"52"}>52 – Saída Isenta</Option>
                  <Option value={"53"}>53 – Saída Não Tributada</Option>
                  <Option value={"54"}>54 – Saída Imune</Option>
                  <Option value={"55"}>55 – Saída com Suspensão</Option>
                  <Option value={"99"}>99 – Outras Saídas</Option>
                </Select>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title="PIS"
                headStyle={{ fontWeight: "bold", backgroundColor: "#f8f8f8" }}
                size="small"
              >
                <label>
                  Alíquota PIS<span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  type="number"
                  addonAfter="%"
                  value={this.state.pis}
                  onChange={(e) =>
                    this.setState({ pis: parseFloat(e.target.value) })
                  }
                />
                <label>
                  PIS: CST<span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  value={this.state.pisCst}
                  style={{ width: "100%" }}
                  onChange={(value) => this.setState({ pisCst: value })}
                >
                  {this.state.listPisCofinsCst.map((list) => (
                    <Option value={list.code} key={list.code}>
                      {list.desc}
                    </Option>
                  ))}
                </Select>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title="COFINS"
                headStyle={{ fontWeight: "bold", backgroundColor: "#f8f8f8" }}
                size="small"
              >
                <label>
                  Alíquota COFINS<span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  type="number"
                  addonAfter="%"
                  value={this.state.cofins}
                  onChange={(e) =>
                    this.setState({ cofins: parseFloat(e.target.value) })
                  }
                />
                <label>
                  COFINS: CST<span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  value={this.state.cofinsCst}
                  style={{ width: "100%" }}
                  onChange={(value) => this.setState({ cofinsCst: value })}
                >
                  {this.state.listPisCofinsCst.map((list) => (
                    <Option value={list.code} key={list.code}>
                      {list.desc}
                    </Option>
                  ))}
                </Select>
              </Card>
            </Col>
          </Row>

          <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
            CONVERSOR DE MEDIDAS / CALCULADOR DE PREÇOS
          </Divider>

          <Card
            title="CONVERSOR DE MEDIDAS"
            headStyle={{ fontWeight: "bold", backgroundColor: "#f8f8f8" }}
            size="small"
          >
            <Row gutter={10}>
              <Col span={6}>
                <label>Unidade de Medida</label>
                <Select
                  value={this.state.unMedida}
                  style={{ width: "100%" }}
                  onChange={(value) => this.setState({ unMedida: value })}
                  size="large"
                >
                  <Option value="KG">Quilograma</Option>
                  <Option value="GR">Grama</Option>
                  <Option value="UN">Unidade</Option>
                  <Option value="MT">Metro</Option>
                  <Option value="PC">Peça</Option>
                  <Option value="CX">Caixa</Option>
                  <Option value="DZ">Duzia</Option>
                  <Option value="EM">Embalagem</Option>
                  <Option value="FD">Fardo</Option>
                  <Option value="KT">KIT</Option>
                  <Option value="JG">Jogo</Option>
                  <Option value="PT">Pacote</Option>
                  <Option value="LATA">Lata</Option>
                  <Option value="LT">Litro</Option>
                  <Option value="SC">Saco</Option>
                  <Option value="ROLO">Rolo</Option>
                  <Option value="VD">Vidro</Option>
                  <Option value="CE">Centro</Option>
                  <Option value="CJ">Conjunto</Option>
                  <Option value="CM">Centímetro</Option>
                  <Option value="GF">Garrafa</Option>
                  <Option value="BD">Balde</Option>
                </Select>
              </Col>
              <Col span={6}>
                <label>Quantidade Cadastrada</label>
                <Input
                  type="number"
                  readOnly
                  value={this.state.estoqueAct}
                  size="large"
                  addonAfter="ITENS"
                />
              </Col>
              <Col span={6}>
                <label>
                  Nova Quantidade<span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  type="number"
                  value={this.state.newEstoque}
                  onChange={(e) =>
                    this.setState({ newEstoque: parseFloat(e.target.value) })
                  }
                  size="large"
                  addonAfter="ITENS"
                />
              </Col>
              <Col span={6}>
                <Row>
                  <Col span={20}>
                    <label style={{ color: "transparent" }}>
                      Nova Quantidade
                    </label>
                    <Button
                      icon="sync"
                      size="large"
                      type="primary"
                      style={{ width: "100%" }}
                      onClick={() => this.calculateUnitForSale()}
                      disabled={this.state.disableCalculate}
                    >
                      Atualizar Unidades
                    </Button>
                  </Col>
                  <Col span={4}>
                    <label style={{ color: "transparent" }}>N</label>
                    <Tooltip title="Resetar" placement="top">
                      <Button
                        icon="close"
                        size="large"
                        type="danger"
                        style={{ width: "100%" }}
                        onClick={() => this.refreshUnits()}
                        disabled={this.state.disabledCancel}
                      />
                    </Tooltip>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>

          <Card
            title="CALCULADOR DE PREÇO DE VENDA"
            style={{ marginTop: 10 }}
            headStyle={{ fontWeight: "bold", backgroundColor: "#f8f8f8" }}
            size="small"
            extra={
              <Radio.Group
                onChange={(e) => this.setState({ modeCalc: e.target.value })}
                buttonStyle="solid"
                value={this.state.modeCalc}
              >
                <Radio.Button value={"markup"}>Markup</Radio.Button>
                <Radio.Button value={"margemBruta"}>Margem Bruta</Radio.Button>
              </Radio.Group>
            }
          >
            {this.state.modeCalc === "" && (
              <label>
                Escolha um fator de cálculo de preço de vendas acima.
              </label>
            )}

            {this.state.modeCalc === "margemBruta" && (
              <>
                <Row gutter={10} style={{ marginBottom: 7 }}>
                  <Col span={12}>
                    <label>
                      Selecione a Margem de Lucro
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <TreeSelect
                      showSearch
                      style={{ width: "100%" }}
                      dropdownStyle={{ maxHeight: 150, overflow: "auto" }}
                      value={this.state.margeLucro}
                      treeDefaultExpandAll
                      onChange={(value) => this.handleMarge(value)}
                      size="large"
                    >
                      {this.state.margeLucroData.map((marge) => (
                        <TreeNode
                          value={marge.text}
                          title={marge.text}
                          key={marge.value}
                        />
                      ))}
                    </TreeSelect>
                  </Col>
                  <Col span={12}>
                    <label style={{ color: "transparent" }}>
                      Nova Quantidade
                    </label>
                    <Button
                      icon="calculator"
                      type="primary"
                      size="large"
                      style={{ width: "100%" }}
                      onClick={() => this.calculatePriceForSale()}
                    >
                      CALCULAR PREÇO DE VENDA
                    </Button>
                  </Col>
                </Row>
                <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
                  RESULTADO
                </Divider>
                <Row gutter={10}>
                  <Col span={4}>
                    <label>Valor Unitário</label>
                    <Input
                      type="number"
                      addonAfter="R$"
                      value={this.state.valueCusto}
                      onChange={(e) =>
                        this.setState({
                          valueCusto: parseFloat(e.target.value),
                        })
                      }
                      size="large"
                    />
                  </Col>
                  <Col span={4}>
                    <label>Valores Diversos</label>
                    <Input
                      type="number"
                      addonAfter="R$"
                      value={this.state.valueDiversos}
                      onChange={(e) =>
                        this.setState({
                          valueDiversos: parseFloat(e.target.value),
                        })
                      }
                      size="large"
                    />
                  </Col>
                  <Col span={4}>
                    <label>Frete</label>
                    <Input
                      type="number"
                      addonAfter="R$"
                      value={this.state.frete}
                      onChange={(e) =>
                        this.setState({ frete: parseFloat(e.target.value) })
                      }
                      size="large"
                    />
                  </Col>
                  <Col span={6}>
                    <label>Valor de Custo - Somatório dos Itens</label>
                    <Input
                      type="number"
                      addonAfter="R$"
                      value={this.state.valorTotalProdutos}
                      readOnly
                      size="large"
                    />
                  </Col>
                  <Col span={6}>
                    <label>Valor de Venda</label>
                    <Input
                      type="number"
                      addonAfter="R$"
                      value={this.state.valueSale}
                      onChange={(e) =>
                        this.setState({ valueSale: parseFloat(e.target.value) })
                      }
                      size="large"
                    />
                  </Col>
                </Row>
              </>
            )}

            {this.state.modeCalc === "markup" && (
              <>
                <Row gutter={10} style={{ marginBottom: 7 }}>
                  <Col span={4}>
                    <label>ICMS</label>
                    <Input
                      value={this.state.icmsAliqTotal}
                      readOnly
                      addonAfter="%"
                      size="large"
                    />
                  </Col>
                  <Col span={4}>
                    <label>PIS + COFINS</label>
                    <Input
                      value={this.state.pisAndCofins}
                      readOnly
                      addonAfter="%"
                      size="large"
                    />
                  </Col>
                  <Col span={4}>
                    <label>IPI</label>
                    <Input
                      type="number"
                      value={this.state.ipiRate}
                      readOnly
                      addonAfter="%"
                      size="large"
                    />
                  </Col>
                  <Col span={4}>
                    <label>
                      Comissão<span style={{ color: "red" }}>*</span>
                    </label>
                    <Input
                      type="number"
                      value={this.state.comission}
                      onChange={(e) =>
                        this.setState({ comission: e.target.value })
                      }
                      addonAfter="%"
                      size="large"
                    />
                  </Col>
                  <Col span={4}>
                    <label>
                      Despesas Administrativas
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <Input
                      type="number"
                      value={this.state.adminExpenses}
                      onChange={(e) =>
                        this.setState({ adminExpenses: e.target.value })
                      }
                      addonAfter="%"
                      size="large"
                    />
                  </Col>
                  <Col span={4}>
                    <label>
                      Margem Desejada (Líquida)
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <Input
                      type="number"
                      value={this.state.margemLiquida}
                      onChange={(e) =>
                        this.setState({ margemLiquida: e.target.value })
                      }
                      addonAfter="%"
                      size="large"
                    />
                  </Col>
                </Row>
                <Row gutter={10} style={{ marginBottom: 7 }}>
                  <Col span={12}>
                    <label>Fator Markup Divisor</label>
                    <Input
                      value={this.state.markupFactor}
                      readOnly
                      size="large"
                    />
                  </Col>
                  <Col span={12}>
                    <label style={{ color: "transparent" }}>
                      Nova Quantidade
                    </label>
                    <Button
                      icon="calculator"
                      type="primary"
                      size="large"
                      style={{ width: "100%" }}
                      onClick={() => this.calculatePriceForSaleMarkup()}
                    >
                      CALCULAR PREÇO DE VENDA
                    </Button>
                  </Col>
                </Row>
                <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
                  RESULTADO
                </Divider>
                <Row gutter={10}>
                  <Col span={4}>
                    <label>Valor Unitário</label>
                    <Input
                      type="number"
                      addonAfter="R$"
                      value={this.state.valueCusto}
                      onChange={(e) =>
                        this.setState({
                          valueCusto: parseFloat(e.target.value),
                        })
                      }
                      size="large"
                    />
                  </Col>
                  <Col span={4}>
                    <label>Valores Diversos</label>
                    <Input
                      type="number"
                      addonAfter="R$"
                      value={this.state.valueDiversos}
                      onChange={(e) =>
                        this.setState({
                          valueDiversos: parseFloat(e.target.value),
                        })
                      }
                      size="large"
                    />
                  </Col>
                  <Col span={4}>
                    <label>Frete</label>
                    <Input
                      type="number"
                      addonAfter="R$"
                      value={this.state.frete}
                      onChange={(e) =>
                        this.setState({ frete: parseFloat(e.target.value) })
                      }
                      size="large"
                    />
                  </Col>
                  <Col span={6}>
                    <label>Valor Atual dos Itens</label>
                    <Input
                      type="number"
                      addonAfter="R$"
                      value={this.state.valorTotalProdutos}
                      readOnly
                      size="large"
                    />
                  </Col>
                  <Col span={6}>
                    <label>Valor de Venda</label>
                    <Input
                      type="number"
                      addonAfter="R$"
                      value={this.state.valueSale}
                      onChange={(e) =>
                        this.setState({ valueSale: parseFloat(e.target.value) })
                      }
                      size="large"
                    />
                  </Col>
                </Row>
              </>
            )}
          </Card>
        </Modal>

        <Modal
          title="Excluir Produtos"
          visible={this.state.modalDelProduct}
          onCancel={() => this.setState({ modalDelProduct: false })}
          footer={[
            <Button
              key="back"
              icon="close"
              type="danger"
              onClick={() => this.setState({ modalDelProduct: false })}
            >
              Cancelar
            </Button>,
            <Button
              key="submit"
              icon="check"
              type="primary"
              loading={this.state.loadingDel}
              onClick={() => {
                this.delProduct();
              }}
            >
              Excluir
            </Button>,
          ]}
          width="60%"
        >
          <p>
            Você tem certeza que deseja excluir este produto? Lembre-se que, ao
            excluir um produto que já foi adicionado a alguma venda, pode
            impossibilitar a emissão de notas fiscais.
          </p>
        </Modal>
      </>
    );
  }
}
