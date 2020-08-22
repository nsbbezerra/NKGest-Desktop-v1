import React, { useState, useEffect } from "react";
import {
  Icon,
  Row,
  Button,
  Col,
  Input,
  Tabs,
  Select,
  Divider,
  TreeSelect,
  Spin,
  Descriptions,
  Modal,
  Card,
  Radio,
} from "antd";
import { Header } from "../../styles/styles";
import { Link } from "react-router-dom";
import api from "../../config/axios";
import PisCofinsCst from "../../data/pisCst.json";
import shortId from "shortid";
import MargeLucro from "../../data/margeLucro.json";

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;

function Produtos() {
  const [spinner, setSpinner] = useState(false);
  const [loading, setLoading] = useState(false);

  const [allFornecedores, setAllFornecedores] = useState([]);
  const [viewFornecedor, setViewFornecedor] = useState({});

  const [nome, setNome] = useState("");
  const [codeUniv, setCodeUniv] = useState("SEM GTIN");
  const [uniMedida, setUniMedida] = useState("");
  const [descricao, setDescricao] = useState("");
  const [custo, setCusto] = useState(0);
  const [despesas, setDespesas] = useState(0);
  const [venda, setVenda] = useState(0);
  const [estoqueAtual, setEstoqueAtual] = useState(0);
  const [idFornecedor, setIdFornecedor] = useState("");
  const [nomeFornecedor, setNomeFornecedor] = useState("");
  const [codeSku, setCodeSku] = useState("");

  const [icms, setIcms] = useState(0);
  const [icmsOrigem, setIcmsOrigem] = useState("");
  const [pis, setPis] = useState(0);
  const [pisCns, setPisCns] = useState("");
  const [cofins, setCofins] = useState(0);
  const [cofinsCns, setCofinsCns] = useState("");
  const [cpof, setCpof] = useState("");
  const [ncm, setNcm] = useState("");
  const [cest, setCest] = useState("");
  const [margeLucro, setMargeLucro] = useState("");
  const [margeLucroData, setMargeLucroData] = useState(MargeLucro);
  const [margeLucroValue, setMargeLucroValue] = useState(0);
  const [icmsCsosn, setIcmsCsosn] = useState("");
  const [typeCst, setTypCst] = useState("simples");
  const [icmsSt, setIcmsSt] = useState(0);
  const [icmsMVA, setIcmsMVA] = useState(0);
  const [icmsModCalc, setIcmsModCalc] = useState("");
  const [fcp, setFcp] = useState(0);
  const [fcpSt, setFcpSt] = useState(0);
  const [fcpStRet, setFcpStRet] = useState(0);
  const [ipi, setIpi] = useState(0);
  const [ipiCst, setIpiCst] = useState("");
  const [modeCalc, setModeCalc] = useState("margemBruta");
  const [pisCofins, setPisCofins] = useState(0);
  const [comission, setComission] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [margemLiquida, setMargemLiquida] = useState(0);
  const [markupDivisor, setMarkupDivisor] = useState(0);
  const [ipiCode, setIpiCode] = useState("");

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

  async function FindFornecedor() {
    setSpinner(true);

    await api
      .get("/register/listFornecedores")
      .then((response) => {
        setAllFornecedores(response.data.fornecedores);
        setSpinner(false);
      })
      .catch((error) => {
        erro("Erro", error.message);
        setSpinner(false);
      });
  }

  async function calculatePriceForSale() {
    let totalPrice = custo + despesas;
    let calcIcms = (await (icms / 100)) * totalPrice;
    let calcPis = (await (pis / 100)) * totalPrice;
    let calcCofins = (await (cofins / 100)) * totalPrice;
    let calcIpi = (await (ipi / 100)) * totalPrice;
    let calcFcp = (await (fcp / 100)) * totalPrice;
    let calcIcmsSt = (await (icmsSt / 100)) * totalPrice;
    let calcFcpSt = (await (fcpSt / 100)) * totalPrice;
    let calcFcpRet = (await (fcpStRet / 100)) * totalPrice;
    let finalPrice =
      (await totalPrice) +
      calcIcms +
      calcPis +
      calcCofins +
      calcIpi +
      calcIcmsSt +
      calcFcp +
      calcFcpSt +
      calcFcpRet;
    let calcFinal = (await finalPrice) * margeLucroValue;
    await setVenda(calcFinal);
  }

  async function RegisterProduct() {
    if (nome === "") {
      warning("Atenção", "O nome do produto está vazio");
      return false;
    }
    if (codeSku === "") {
      warning("Atenção", "O código está vazio");
      return false;
    }
    if (uniMedida === "") {
      warning("Atenção", "Não foi selecionado uma unidade de medida");
      return false;
    }
    if (custo === 0) {
      warning("Atenção", "O valor de custo do produto está definido como 0");
      return false;
    }
    if (venda === 0) {
      warning("Atenção", "O valor de venda do produto está definido como 0");
      return false;
    }
    if (estoqueAtual === 0) {
      warning("Atenção", "O valor de estoque atual está definido como 0");
      return false;
    }
    if (idFornecedor === "") {
      warning("Atenção", "Não foi selecionado um fornecedor para este produto");
      return false;
    }

    function allClear() {
      setNome("");
      setIdFornecedor("");
      setNomeFornecedor("");
      setUniMedida("");
      setDescricao("");
      setCodeUniv("SEM GTIN");
      setCusto(0);
      setDespesas(0);
      setEstoqueAtual(0);
      setMargeLucro();
      setMargeLucroValue(0);
      setVenda(0);
      setViewFornecedor({});
      setCodeSku("");
      setIcms(0);
      setPis(0);
      setCofins(0);
      setIcmsCsosn("");
      setPisCns("");
      setCofinsCns("");
      setNcm("");
      setCest("");
      setCpof("");
      setModeCalc("margemBruta");
      setTypCst("simples");
      setIcmsSt(0);
      setIcmsMVA(0);
      setIcmsModCalc("");
      setFcp(0);
      setFcpSt(0);
      setFcpStRet(0);
      setIpiCode("");
      setIpiCst("");
      setIpi(0);
      setMargemLiquida(0);
      setMarkupDivisor(0);
      setComission(0);
      setExpenses(0);
      setPisCofins(0);
    }

    setLoading(true);

    await api
      .post("/register/produtos", {
        name: nome,
        code: codeSku,
        fornecedor: idFornecedor,
        codeUniversal: codeUniv,
        unMedida: uniMedida,
        description: descricao,
        valueCusto: custo + despesas,
        valueDiversos: despesas,
        valueSale: venda,
        estoqueAct: estoqueAtual,
        active: true,
        cfop: cpof,
        ncm: ncm,
        icms: {
          rate: icms,
          csosn: icmsCsosn,
          origin: icmsOrigem,
          icmsSTRate: icmsSt,
          icmsMargemValorAddST: icmsMVA,
          icmsSTModBC: icmsModCalc,
          fcpRate: fcp,
          fcpSTRate: fcpSt,
          fcpRetRate: fcpStRet,
          ipiCst: ipiCst,
          ipiRate: ipi,
          ipiCode: ipiCode,
        },
        pis: { rate: pis, cst: pisCns },
        cofins: { rate: cofins, cst: cofinsCns },
        cest: cest,
        margeLucro: margeLucroValue,
        typeCalculate: modeCalc,
        markupFactor: {
          factor: markupDivisor,
          margeLucro: margemLiquida,
          comission: comission,
          otherExpenses: expenses,
        },
      })
      .then((response) => {
        success("Sucesso", response.data.message);
        allClear();
        setLoading(false);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoading(false);
      });
  }

  useEffect(() => {
    FindFornecedor();
  }, []);

  async function handleFornecedor(value) {
    const result = await allFornecedores.find((obj) => obj.name === value);

    await setIdFornecedor(result._id);

    await setNomeFornecedor(value);

    await setViewFornecedor(result);
  }

  function generateSku() {
    setCodeSku(shortId.generate());
  }

  async function handleMarge(marge) {
    const result = await margeLucroData.marge.find((obj) => obj.text === marge);
    await setMargeLucro(result.text);
    await setMargeLucroValue(result.value);
  }

  useEffect(() => {
    setPisCofins(pis + cofins);
  }, [pis, cofins]);

  function calculatePriceForSaleMarkup() {
    let Ctv =
      parseFloat(icms) +
      parseFloat(pisCofins) +
      parseFloat(comission) +
      parseFloat(expenses) +
      parseFloat(margemLiquida);
    let valorCusto = parseFloat(custo) + parseFloat(despesas);
    let mkd = (100 - Ctv) / 100;
    let valorVenda = valorCusto / mkd;
    let valorConverted = parseFloat(valorVenda.toFixed(2));
    setMarkupDivisor(mkd);
    setVenda(valorConverted);
  }

  return (
    <>
      <Header>
        <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
          <Icon type="tags" style={{ fontSize: 20 }} /> CADASTRO DE PRODUTOS
        </p>
        <Link to="/">
          <Button type="danger" shape="circle" icon="close" size="small" />
        </Link>
      </Header>

      <div style={{ marginTop: 10 }}>
        <Spin spinning={spinner} size="large">
          <Tabs defaultActive="1" type="card">
            <TabPane
              tab={<span>Dados</span>}
              key="1"
              style={{ paddingRight: 30, paddingLeft: 30 }}
            >
              <Row style={{ marginBottom: 7 }} gutter={10}>
                <Col span={10}>
                  <label>
                    Nome do produto<span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    type="text"
                    onChange={(e) => setNome(e.target.value.toUpperCase())}
                    value={nome}
                  />
                </Col>

                <Col span={5}>
                  <label>Código</label>
                  <Input
                    type="text"
                    readOnly
                    addonAfter={
                      <Button
                        type="link"
                        size="small"
                        onClick={() => generateSku()}
                      >
                        Gerar
                      </Button>
                    }
                    value={codeSku}
                  />
                </Col>

                <Col span={6}>
                  <label>Código de Barras</label>
                  <Input
                    type="text"
                    onChange={(e) => setCodeUniv(e.target.value)}
                    value={codeUniv}
                  />
                </Col>

                <Col span={3}>
                  <label>
                    Uni. de medida<span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    value={uniMedida}
                    style={{ width: "100%" }}
                    onChange={(value) => setUniMedida(value)}
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
                  </Select>
                </Col>
              </Row>

              <Row gutter={10}>
                <Col span={24}>
                  <label>Descrição</label>
                  <TextArea
                    rows={4}
                    onChange={(e) => setDescricao(e.target.value.toUpperCase())}
                    value={descricao}
                  />
                </Col>
              </Row>
            </TabPane>

            <TabPane
              tab={<span>Preços / Tributação</span>}
              key="2"
              style={{ paddingRight: 30, paddingLeft: 30 }}
            >
              <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
                TRIBUTAÇÃO
              </Divider>

              <Row gutter={10}>
                <Col span={24}>
                  <Card
                    title="ICMS"
                    headStyle={{
                      fontWeight: "bold",
                      backgroundColor: "#f8f8f8",
                    }}
                    size="small"
                    extra={
                      <Radio.Group
                        onChange={(e) => setTypCst(e.target.value)}
                        buttonStyle="solid"
                        value={typeCst}
                      >
                        <Radio.Button value={"simples"}>
                          Simples Nacional
                        </Radio.Button>
                        <Radio.Button value={"outros"}>Outros</Radio.Button>
                      </Radio.Group>
                    }
                  >
                    <Row gutter={10}>
                      <Col span={8}>
                        <label>
                          Alíquota ICMS<span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          type="number"
                          addonAfter="%"
                          value={icms}
                          onChange={(e) => setIcms(parseFloat(e.target.value))}
                        />
                        {typeCst !== "simples" ? (
                          <>
                            <label>
                              ICMS: CST<span style={{ color: "red" }}>*</span>
                            </label>
                            <Select
                              value={icmsCsosn}
                              style={{ width: "100%" }}
                              onChange={(value) => setIcmsCsosn(value)}
                            >
                              <Option value={"00"}>
                                00 - Tributada Integralmente
                              </Option>
                              <Option value={"10"}>
                                10 - Tributada e com cobrança do ICMS por
                                substituição tributária
                              </Option>
                              <Option value={"20"}>
                                20 - Com redução de base de cálculo
                              </Option>
                              <Option value={"30"}>
                                30 - Isenta ou não tributada e com cobrança do
                                ICMS por substituição tributária
                              </Option>
                              <Option value={"40"}>40 - Isenta</Option>
                              <Option value={"41"}>41 - Não Tributada</Option>
                              <Option value={"50"}>50 - Suspensão</Option>
                              <Option value={"51"}>51 - Diferimento</Option>
                              <Option value={"60"}>
                                60 - ICMS cobrado anteriormente por substituição
                                tributária
                              </Option>
                              <Option value={"70"}>
                                70 - Com redução de base de cálculo e cobrança
                                do ICMS por substituição tributária
                              </Option>
                              <Option value={"90"}>90 - Outros</Option>
                            </Select>
                          </>
                        ) : (
                          <>
                            <label>
                              ICMS: CSOSN{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <Select
                              value={icmsCsosn}
                              style={{ width: "100%" }}
                              onChange={(value) => setIcmsCsosn(value)}
                            >
                              <Option value={"101"}>
                                101 - Tributada pelo Simples Nacional com
                                permissão de crédito
                              </Option>
                              <Option value={"102"}>
                                102 - Tributada pelo Simples Nacional sem
                                permissão de crédito
                              </Option>
                              <Option value={"103"}>
                                103 - Isenção do ICMS no Simples Nacional para
                                faixa de receita bruta
                              </Option>
                              <Option value={"201"}>
                                201 - Tributada pelo Simples Nacional com
                                permissão de crédito e com cobrança do ICMS por
                                substituição tributária
                              </Option>
                              <Option value={"202"}>
                                202 - Tributada pelo Simples Nacional sem
                                permissão de crédito e com cobrança do ICMS por
                                substituição tributária
                              </Option>
                              <Option value={"203"}>
                                203 - Isenção do ICMS no Simples Nacional para
                                faixa de receita bruta e com cobrança do ICMS
                                por substituição tributária
                              </Option>
                              <Option value={"300"}>300 - Imune</Option>
                              <Option value={"400"}>
                                400 - Não tributada pelo Simples Nacional
                              </Option>
                              <Option value={"500"}>
                                500 - ICMS cobrado anteriormente por
                                substituição tributária (substituído) ou por
                                antecipação
                              </Option>
                              <Option value={"900"}>900 - Outros</Option>
                            </Select>
                          </>
                        )}
                        <label>
                          ICMS Origem<span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                          value={icmsOrigem}
                          style={{ width: "100%", marginBottom: 10 }}
                          onChange={(value) => setIcmsOrigem(value)}
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
                            4 - Nacional produzida através de processos
                            produtivos básicos
                          </Option>
                          <Option value={"5"}>
                            5 - Nacional com menos de 40% de conteúdo
                            estrangeiro
                          </Option>
                          <Option value={"6"}>
                            6 - Estrangeira (importação direta) sem produto
                            nacional similar
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
                          value={icmsSt}
                          onChange={(e) =>
                            setIcmsSt(parseFloat(e.target.value))
                          }
                        />
                        <label>ST Margem de Valor Adicionada</label>
                        <Input
                          type="number"
                          addonAfter="%"
                          value={icmsMVA}
                          onChange={(e) =>
                            setIcmsMVA(parseFloat(e.target.value))
                          }
                        />
                        <label>Modalidade de B.C. da ST</label>
                        <Select
                          value={icmsModCalc}
                          style={{ width: "100%", marginBottom: 10 }}
                          onChange={(value) => setIcmsModCalc(value)}
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
                          value={fcp}
                          onChange={(e) => setFcp(parseFloat(e.target.value))}
                        />
                        <label>Alíquota FCP ST</label>
                        <Input
                          type="number"
                          addonAfter="%"
                          value={fcpSt}
                          onChange={(e) => setFcpSt(parseFloat(e.target.value))}
                        />
                        <label>Alíquota FCP ST Retido</label>
                        <Input
                          type="number"
                          addonAfter="%"
                          value={fcpStRet}
                          onChange={(e) =>
                            setFcpStRet(parseFloat(e.target.value))
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
                    headStyle={{
                      fontWeight: "bold",
                      backgroundColor: "#f8f8f8",
                    }}
                    size="small"
                  >
                    <Row>
                      <Col span={12} style={{ paddingRight: 2.5 }}>
                        <label>Alíquota IPI</label>
                        <Input
                          type="number"
                          addonAfter="%"
                          value={ipi}
                          onChange={(e) => setIpi(parseFloat(e.target.value))}
                        />
                      </Col>
                      <Col span={12} style={{ paddingLeft: 2.5 }}>
                        <label>IPI Código</label>
                        <Input
                          value={ipiCode}
                          onChange={(e) => setIpiCode(e.target.value)}
                        />
                      </Col>
                    </Row>
                    <label>IPI CST</label>
                    <Select
                      value={ipiCst}
                      style={{ width: "100%" }}
                      onChange={(value) => setIpiCst(value)}
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
                    headStyle={{
                      fontWeight: "bold",
                      backgroundColor: "#f8f8f8",
                    }}
                    size="small"
                  >
                    <label>
                      Alíquota PIS<span style={{ color: "red" }}>*</span>
                    </label>
                    <Input
                      type="number"
                      addonAfter="%"
                      value={pis}
                      onChange={(e) => setPis(parseFloat(e.target.value))}
                    />
                    <label>
                      PIS: CST<span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      value={pisCns}
                      style={{ width: "100%" }}
                      onChange={(value) => setPisCns(value)}
                    >
                      {PisCofinsCst.map((list) => (
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
                    headStyle={{
                      fontWeight: "bold",
                      backgroundColor: "#f8f8f8",
                    }}
                    size="small"
                  >
                    <label>
                      Alíquota COFINS<span style={{ color: "red" }}>*</span>
                    </label>
                    <Input
                      type="number"
                      addonAfter="%"
                      value={cofins}
                      onChange={(e) => setCofins(parseFloat(e.target.value))}
                    />
                    <label>
                      COFINS: CST<span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      value={cofinsCns}
                      style={{ width: "100%" }}
                      onChange={(value) => setCofinsCns(value)}
                    >
                      {PisCofinsCst.map((list) => (
                        <Option value={list.code} key={list.code}>
                          {list.desc}
                        </Option>
                      ))}
                    </Select>
                  </Card>
                </Col>
              </Row>

              <Row gutter={10} style={{ marginTop: 10 }}>
                <Col span={8}>
                  <label>
                    CFOP<span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    type="number"
                    value={cpof}
                    onChange={(e) => setCpof(e.target.value)}
                  />
                </Col>

                <Col span={8}>
                  <label>
                    CEST<span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    value={cest}
                    onChange={(e) => setCest(e.target.value)}
                  />
                </Col>

                <Col span={8}>
                  <label>
                    NCM<span style={{ color: "red" }}>*</span>
                  </label>
                  <Input value={ncm} onChange={(e) => setNcm(e.target.value)} />
                </Col>
              </Row>

              <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
                PREÇOS
              </Divider>

              <Card
                title="CALCULADOR DE PREÇO DE VENDA"
                style={{ marginTop: 10 }}
                headStyle={{ fontWeight: "bold", backgroundColor: "#f8f8f8" }}
                size="small"
                extra={
                  <Radio.Group
                    onChange={(e) => setModeCalc(e.target.value)}
                    buttonStyle="solid"
                    value={modeCalc}
                  >
                    <Radio.Button value={"markup"}>Markup</Radio.Button>
                    <Radio.Button value={"margemBruta"}>
                      Margem Bruta
                    </Radio.Button>
                  </Radio.Group>
                }
              >
                {modeCalc === "" && (
                  <label>
                    Escolha um fator de cálculo de preço de vendas acima.
                  </label>
                )}

                {modeCalc === "margemBruta" && (
                  <>
                    <Row gutter={10}>
                      <Col span={8}>
                        <label>Valor Unitário</label>
                        <Input
                          type="number"
                          addonAfter="R$"
                          value={custo}
                          onChange={(e) => setCusto(parseFloat(e.target.value))}
                        />
                      </Col>
                      <Col span={8}>
                        <label>Valores Diversos</label>
                        <Input
                          type="number"
                          addonAfter="R$"
                          value={despesas}
                          onChange={(e) =>
                            setDespesas(parseFloat(e.target.value))
                          }
                        />
                      </Col>
                      <Col span={8}>
                        <label>Valor de Venda</label>
                        <Input
                          type="number"
                          addonAfter="R$"
                          value={venda}
                          onChange={(e) => setVenda(e.target.value)}
                        />
                      </Col>
                    </Row>
                    <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
                      CALCULAR
                    </Divider>
                    <Row gutter={10}>
                      <Col span={12}>
                        <label>
                          Selecione a Margem de Lucro
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <TreeSelect
                          showSearch
                          style={{ width: "100%" }}
                          dropdownStyle={{ maxHeight: 150, overflow: "auto" }}
                          value={margeLucro}
                          treeDefaultExpandAll
                          onChange={(value) => handleMarge(value)}
                        >
                          {MargeLucro.marge.map((marge) => (
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
                          style={{ width: "100%" }}
                          onClick={() => calculatePriceForSale()}
                        >
                          CALCULAR PREÇO DE VENDA
                        </Button>
                      </Col>
                    </Row>
                  </>
                )}

                {modeCalc === "markup" && (
                  <>
                    <Row gutter={10} style={{ marginBottom: 7 }}>
                      <Col span={8}>
                        <label>Valor Unitário</label>
                        <Input
                          type="number"
                          addonAfter="R$"
                          value={custo}
                          onChange={(e) => setCusto(parseFloat(e.target.value))}
                        />
                      </Col>
                      <Col span={8}>
                        <label>Valores Diversos</label>
                        <Input
                          type="number"
                          addonAfter="R$"
                          value={despesas}
                          onChange={(e) =>
                            setDespesas(parseFloat(e.target.value))
                          }
                        />
                      </Col>
                      <Col span={8}>
                        <label>Valor de Venda</label>
                        <Input
                          type="number"
                          addonAfter="R$"
                          value={venda}
                          onChange={(e) => setVenda(e.target.value)}
                        />
                      </Col>
                    </Row>
                    <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
                      CALCULAR
                    </Divider>
                    <Row gutter={10} style={{ marginBottom: 7 }}>
                      <Col span={4}>
                        <label>ICMS</label>
                        <Input value={icms} readOnly addonAfter="%" />
                      </Col>
                      <Col span={4}>
                        <label>PIS + COFINS</label>
                        <Input value={pisCofins} readOnly addonAfter="%" />
                      </Col>
                      <Col span={4}>
                        <label>
                          Comissão<span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          type="number"
                          value={comission}
                          onChange={(e) =>
                            setComission(parseFloat(e.target.value))
                          }
                          addonAfter="%"
                        />
                      </Col>
                      <Col span={6}>
                        <label>
                          Despesas Administrativas
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          type="number"
                          value={expenses}
                          onChange={(e) =>
                            setExpenses(parseFloat(e.target.value))
                          }
                          addonAfter="%"
                        />
                      </Col>
                      <Col span={6}>
                        <label>
                          Margem Desejada (Líquida)
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <Input
                          type="number"
                          value={margemLiquida}
                          onChange={(e) =>
                            setMargemLiquida(parseFloat(e.target.value))
                          }
                          addonAfter="%"
                        />
                      </Col>
                    </Row>
                    <Row gutter={10}>
                      <Col span={12}>
                        <label>Fator Markup Divisor</label>
                        <Input value={markupDivisor} readOnly />
                      </Col>
                      <Col span={12}>
                        <label style={{ color: "transparent" }}>
                          Nova Quantidade
                        </label>
                        <Button
                          icon="calculator"
                          type="primary"
                          style={{ width: "100%" }}
                          onClick={() => calculatePriceForSaleMarkup()}
                        >
                          CALCULAR PREÇO DE VENDA
                        </Button>
                      </Col>
                    </Row>
                  </>
                )}
              </Card>
            </TabPane>

            <TabPane
              tab={<span>Estoque / Fornecedor</span>}
              key="4"
              style={{ paddingRight: 30, paddingLeft: 30 }}
            >
              <Row gutter={10}>
                <Col span={8}>
                  <label>
                    Quantidade no Estoque
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    type="number"
                    onChange={(e) => setEstoqueAtual(e.target.value)}
                    value={estoqueAtual}
                    size="large"
                  />
                </Col>

                <Col span={16}>
                  <label>
                    Fornecedor<span style={{ color: "red" }}>*</span>
                  </label>
                  <TreeSelect
                    showSearch
                    style={{ width: "100%" }}
                    dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                    placeholder="Selecione"
                    treeDefaultExpandAll
                    value={nomeFornecedor}
                    onChange={(value) => handleFornecedor(value)}
                    size="large"
                  >
                    {allFornecedores.map((fornec) => (
                      <TreeNode
                        value={fornec.name}
                        title={fornec.name}
                        key={fornec._id}
                      />
                    ))}
                  </TreeSelect>
                </Col>
              </Row>

              <Divider />

              <Row>
                <Col span={24}>
                  <Descriptions layout="vertical" bordered size="small">
                    <Descriptions.Item label="Nome / Nome Fantasia" span={2}>
                      {viewFornecedor.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="CPF / CNPJ" span={1}>
                      {viewFornecedor.cpf_cnpj}
                    </Descriptions.Item>
                    <Descriptions.Item label="Telefone Comercial" span={1}>
                      {viewFornecedor.phoneComercial}
                    </Descriptions.Item>
                    <Descriptions.Item label="Celular 1" span={1}>
                      {viewFornecedor.celOne}
                    </Descriptions.Item>
                    <Descriptions.Item label="Celular 2" span={1}>
                      {viewFornecedor.celTwo}
                    </Descriptions.Item>
                    <Descriptions.Item label="Cidade" span={1}>
                      {viewFornecedor.city}
                    </Descriptions.Item>
                    <Descriptions.Item label="Estado" span={1}>
                      {viewFornecedor.state}
                    </Descriptions.Item>
                    <Descriptions.Item label="CEP" span={1}>
                      {viewFornecedor.cep}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>

              <Divider />

              <Button
                type="primary"
                icon="save"
                size="large"
                loading={loading}
                onClick={() => RegisterProduct()}
                style={{ marginBottom: 5 }}
              >
                Cadastrar Produto
              </Button>
            </TabPane>
          </Tabs>
        </Spin>
      </div>
    </>
  );
}

export default Produtos;
