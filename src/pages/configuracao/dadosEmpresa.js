import React, { useState, useEffect, useMemo } from "react";
import {
  Icon,
  Button,
  Row,
  Col,
  Input,
  Card,
  Modal,
  Spin,
  Divider,
  Select,
  Checkbox,
} from "antd";
import { Header } from "../../styles/styles";
import { Link } from "react-router-dom";
import InputMask from "react-input-mask";
import api from "../../config/axios";
import findCep from "cep-promise";
import "./style.css";

const { Option } = Select;

function DadosEmpresa() {
  const [dados, setDados] = useState({});
  const [spinner, setSpinner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalLogo, setModalLogo] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [check, setCheck] = useState(false);
  const [checkMun, setCheckMun] = useState(false);

  const [idDados, setIdDados] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [inscEstadual, setInscEstadual] = useState("");
  const [razao, setRazao] = useState("");
  const [phoneComercial, setPhoneComercial] = useState("");
  const [celUm, setCelUm] = useState("");
  const [celDois, setCelDois] = useState("");
  const [inscMunicipal, setInscMunicipal] = useState("");
  const [servicoEmail, setServicoEmail] = useState("");
  const [passwordEmail, setPasswordEmail] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [ibgeCode, setIbgeCode] = useState("");
  const [simplesOptant, setSimplesOptant] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoId, setLogoId] = useState("");

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

  const preview = useMemo(() => {
    return logo ? URL.createObjectURL(logo) : null;
  }, [logo]);

  async function handleCep(numCep) {
    await setCep(numCep);

    const meuCep = `${numCep}`;
    let semCaracter = meuCep.replace("-", "");

    await findCep(semCaracter)
      .then((response) => {
        setCidade(response.city);
        setEstado(response.state);
      })
      .catch((error) => {
        return;
      });
  }

  function handleInscricaoEstadual(e) {
    if (e.target.checked === true) {
      setInscEstadual(e.target.value);
      setCheck(true);
    }
    if (e.target.checked === false) {
      setInscEstadual("");
      setCheck(false);
    }
  }

  function handleInscricaoMun(e) {
    if (e.target.checked === true) {
      setInscMunicipal(e.target.value);
      setCheckMun(true);
    }
    if (e.target.checked === false) {
      setInscMunicipal("");
      setCheckMun(false);
    }
  }

  async function findDados() {
    setSpinner(true);
    await api
      .get("/organization/find")
      .then((response) => {
        setDados(response.data.empresa);
        handleUpdateDados(response.data.empresa);
        setSpinner(false);
      })
      .catch((error) => {
        erro("Erro", error.message);
        setSpinner(false);
      });
  }

  async function sendDados() {
    if (logo === null) {
      warning("Atenção", "Selecione uma Logo para esta empresa");
      return false;
    }
    if (nome === "") {
      warning("Atenção", "O Nome Fantasia está em branco");
      return false;
    }
    if (email === "") {
      warning("Atenção", "O Email está em branco");
      return false;
    }
    if (cnpj === "") {
      warning("Atenção", "O CNPJ está em branco");
      return false;
    }
    if (inscEstadual === "") {
      warning("Atenção", "A Inscrição Estadual está em branco");
      return false;
    }
    if (inscMunicipal === "") {
      warning("Atenção", "A Inscrição Municipal está em branco");
      return false;
    }
    if (phoneComercial === "") {
      warning("Atenção", "Digite o Telefone Comercial");
      return false;
    }
    if (celUm === "") {
      warning("Atenção", "Preencha o pelo menos o primeiro campo de Celular");
      return false;
    }
    if (razao === "") {
      warning("Atenção", "A Razão Social está em branco");
      return false;
    }
    if (cnpj === "") {
      warning("Atenção", "O CNPJ está em branco");
      return false;
    }
    if (rua === "") {
      warning("Atenção", "A Rua/Avenida está em branco");
      return false;
    }
    if (numero === "") {
      warning("Atenção", "O número está em branco");
      return false;
    }
    if (bairro === "") {
      warning("Atenção", "O Bairro está em branco");
      return false;
    }
    if (cep === "") {
      warning("Atenção", "O CEP está em branco");
      return false;
    }
    if (cidade === "") {
      warning("Atenção", "A cidade está em branco");
      return false;
    }
    if (estado === "") {
      warning("Atenção", "O estado está em branco");
      return false;
    }
    if (ibgeCode === "") {
      warning(
        "Atenção",
        "Digite o Código do IBGE para sua cidade está em branco"
      );
      return false;
    }
    if (servicoEmail === "") {
      warning(
        "Atenção",
        "Forneça o serviço de Email da sua empresa ex: Gmail, Hotmail, etc..."
      );
      return false;
    }
    if (passwordEmail === "") {
      warning(
        "Atenção",
        "Para o serviço de envio de email através do sistema é importante fornecer a senha do Email da empresa"
      );
      return false;
    }
    const data = new FormData();
    data.append("logo", logo);
    data.append("name", nome);
    data.append("cnpj", cnpj);
    data.append("email", email);
    data.append("socialName", razao);
    data.append("stateRegistration", inscEstadual);
    data.append("municipalRegistration", inscMunicipal);
    data.append("phoneComercial", phoneComercial);
    data.append("celOne", celUm);
    data.append("celTwo", celDois);
    data.append("passwordEmail", passwordEmail);
    data.append("serviceEmail", servicoEmail);
    data.append("taxRegime", simplesOptant);
    data.append("street", rua);
    data.append("number", numero);
    data.append("comp", complemento);
    data.append("bairro", bairro);
    data.append("cep", cep);
    data.append("city", cidade);
    data.append("state", estado);
    data.append("ibgeCode", ibgeCode);
    setLoading(true);
    await api
      .post("/organization/create", data)
      .then((response) => {
        success("Sucesso", "Cadastrado com sucesso");
        setDados(response.data.empresa);
        setLoading(false);
      })
      .catch((error) => {
        erro("Erro", error.message);
        setLoading(false);
      });
  }

  async function handleUpdateDados(id) {
    await setIdDados(id._id);
    await setCelDois(id.celTwo);
    await setCelUm(id.celOne);
    await setCnpj(id.cnpj);
    await setEmail(id.email);
    await setInscEstadual(id.stateRegistration);
    await setInscMunicipal(id.municipalRegistration);
    await setNome(id.name);
    await setPhoneComercial(id.phoneComercial);
    await setRazao(id.socialName);
    await setServicoEmail(id.serviceEmail);
    await setRua(id.street);
    await setNumero(id.number);
    await setComplemento(id.comp);
    await setBairro(id.bairro);
    await setCep(id.cep);
    await setCidade(id.city);
    await setEstado(id.state);
    await setIbgeCode(id.ibgeCode);
    await setSimplesOptant(id.taxRegime);
  }

  async function sendUpdateDados() {
    setLoading(true);
    await api
      .put(`/organization/edit/${idDados}`, {
        name: nome,
        cnpj: cnpj,
        email: email,
        socialName: razao,
        stateRegistration: inscEstadual,
        municipalRegistration: inscMunicipal,
        phoneComercial: phoneComercial,
        celOne: celUm,
        celTwo: celDois,
        passwordEmail: passwordEmail,
        serviceEmail: servicoEmail,
        taxRegime: simplesOptant,
        street: rua,
        number: numero,
        comp: complemento,
        bairro: bairro,
        cep: cep,
        city: cidade,
        state: estado,
        ibgeCode: ibgeCode,
      })
      .then((response) => {
        findDados();
        setLoading(false);
        success("Sucesso", response.data.message);
      })
      .catch((error) => {
        erro("Erro", error.message);
        setLoading(false);
      });
  }

  function handleUpdateLogo(id) {
    setLogoId(id);
    setModalLogo(true);
  }

  async function updateLogo() {
    const data = new FormData();
    await data.append("logo", logo);
    await data.append("id", logoId);
    setLoadingLogo(true);
    await api
      .post("/organization/changeLogo", data)
      .then((response) => {
        success("Sucesso", response.data.message);
        setLoadingLogo(false);
        setModalLogo(false);
        findDados();
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setModalLogo(false);
      });
  }

  useEffect(() => {
    findDados();
  }, []);

  return (
    <>
      <Header>
        <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
          <Icon type="shop" style={{ fontSize: 20 }} /> DADOS DA EMPRESA
        </p>
        <Link to="/">
          <Button type="danger" shape="circle" icon="close" size="small" />
        </Link>
      </Header>

      <div
        style={{
          paddingTop: 15,
          paddingBottom: 15,
          paddingLeft: 30,
          paddingRight: 30,
          overflowX: "hidden",
        }}
      >
        <Spin spinning={spinner} size="large">
          {!dados && (
            <>
              <Row gutter={10}>
                <Col span={4}>
                  <label
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    Logo
                  </label>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      flexDirection: "column",
                    }}
                  >
                    <label
                      id="thumbnail"
                      style={{ backgroundImage: `url(${preview})` }}
                    >
                      <input
                        type="file"
                        onChange={(event) => setLogo(event.target.files[0])}
                      />
                      {!logo && <Icon type="camera" style={{ fontSize: 50 }} />}
                    </label>
                  </div>
                </Col>

                <Col span={20}>
                  <Row style={{ marginBottom: 7 }} gutter={10}>
                    <Col span={24}>
                      <label>
                        Nome fantasia<span style={{ color: "red" }}>*</span>
                      </label>
                      <Input
                        type="text"
                        onChange={(e) => setNome(e.target.value.toUpperCase())}
                        value={nome}
                      />
                    </Col>
                  </Row>

                  <Row gutter={10}>
                    <Col span={12}>
                      <label>
                        Razão social<span style={{ color: "red" }}>*</span>
                      </label>
                      <Input
                        type="text"
                        onChange={(e) => setRazao(e.target.value.toUpperCase())}
                        value={razao}
                      />
                    </Col>

                    <Col span={6}>
                      <label>
                        CNPJ<span style={{ color: "red" }}>*</span>
                      </label>
                      <InputMask
                        mask={"99.999.999/9999-99"}
                        className="ant-input"
                        onChange={(e) => setCnpj(e.target.value)}
                        value={cnpj}
                      />
                    </Col>

                    <Col span={6}>
                      <label>
                        Inscrição estadual
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <Input
                        type="text"
                        onChange={(e) => setInscEstadual(e.target.value)}
                        value={inscEstadual}
                        addonAfter={
                          <Checkbox
                            value="Isento"
                            onChange={(value) => handleInscricaoEstadual(value)}
                            checked={check}
                          >
                            Isento
                          </Checkbox>
                        }
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row style={{ marginBottom: 7 }} gutter={10}>
                <Col span={8}>
                  <label>
                    Telefone comercial<span style={{ color: "red" }}>*</span>
                  </label>
                  <InputMask
                    mask={"99 9999-9999"}
                    className="ant-input"
                    onChange={(e) => setPhoneComercial(e.target.value)}
                    value={phoneComercial}
                  />
                </Col>

                <Col span={8}>
                  <label>
                    Telefone celular 1<span style={{ color: "red" }}>*</span>
                  </label>
                  <InputMask
                    mask={"99 99999-9999"}
                    className="ant-input"
                    onChange={(e) => setCelUm(e.target.value)}
                    value={celUm}
                  />
                </Col>

                <Col span={8}>
                  <label>
                    Telefone celular 2<span style={{ color: "red" }}>*</span>
                  </label>
                  <InputMask
                    mask={"99 99999-9999"}
                    className="ant-input"
                    onChange={(e) => setCelDois(e.target.value)}
                    value={celDois}
                  />
                </Col>
              </Row>

              <Row gutter={10}>
                <Col span={8}>
                  <label>
                    Inscrição municipal<span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    onChange={(e) => setInscMunicipal(e.target.value)}
                    value={inscMunicipal}
                    addonAfter={
                      <Checkbox
                        value="Isento"
                        onChange={(value) => handleInscricaoMun(value)}
                        checked={checkMun}
                      >
                        Isento
                      </Checkbox>
                    }
                  />
                </Col>

                <Col span={8}>
                  <label style={{ display: "block", width: "100%" }}>
                    Regime Tributário
                  </label>
                  <Select
                    value={simplesOptant}
                    style={{ width: "100%" }}
                    onChange={(value) => setSimplesOptant(value)}
                  >
                    <Option value="MEI">
                      MEI - Microempreendedor Individual
                    </Option>
                    <Option value="SimplesNacional">Simples Nacional</Option>
                    <Option value="LucroPresumido">Lucro Presumido</Option>
                    <Option value="LucroReal">Lucro Real</Option>
                    <Option value="Isento">Isento</Option>
                  </Select>
                </Col>
              </Row>

              <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
                ENDEREÇO
              </Divider>

              <Row style={{ overflow: "hidden" }} gutter={10}>
                <Col span={18}>
                  <label>
                    Rua<span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    type="text"
                    onChange={(e) => setRua(e.target.value.toUpperCase())}
                    value={rua}
                  />
                </Col>

                <Col span={6}>
                  <label>
                    Número<span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    type="number"
                    onChange={(e) => setNumero(e.target.value.toUpperCase())}
                    value={numero}
                  />
                </Col>
              </Row>

              <Row style={{ marginTop: 7, overflow: "hidden" }} gutter={10}>
                <Col span={12}>
                  <label>Complemento</label>
                  <Input
                    type="text"
                    onChange={(e) =>
                      setComplemento(e.target.value.toUpperCase())
                    }
                    value={complemento}
                  />
                </Col>

                <Col span={12}>
                  <label>
                    Bairro<span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    type="text"
                    onChange={(e) => setBairro(e.target.value.toUpperCase())}
                    value={bairro}
                  />
                </Col>
              </Row>

              <Row style={{ marginTop: 7, overflow: "hidden" }} gutter={10}>
                <Col span={5}>
                  <label>
                    CEP<span style={{ color: "red" }}>*</span>
                  </label>
                  <InputMask
                    mask={"99999-999"}
                    className="ant-input"
                    onChange={(e) => handleCep(e.target.value)}
                    value={cep}
                  />
                </Col>

                <Col span={10}>
                  <label>
                    Cidade<span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    type="text"
                    onChange={(e) => setCidade(e.target.value.toUpperCase())}
                    value={cidade}
                  />
                </Col>

                <Col span={5}>
                  <label>
                    UF<span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    value={estado}
                    style={{ width: "100%" }}
                    onChange={(value) => setEstado(value)}
                  >
                    <Option value="AC">AC</Option>
                    <Option value="AL">AL</Option>
                    <Option value="AP">AP</Option>
                    <Option value="AM">AM</Option>
                    <Option value="BA">BA</Option>
                    <Option value="CE">CE</Option>
                    <Option value="DF">DF</Option>
                    <Option value="ES">ES</Option>
                    <Option value="GO">GO</Option>
                    <Option value="MA">MA</Option>
                    <Option value="MT">MT</Option>
                    <Option value="MS">MS</Option>
                    <Option value="MG">MG</Option>
                    <Option value="PA">PA</Option>
                    <Option value="PB">PB</Option>
                    <Option value="PR">PR</Option>
                    <Option value="PE">PE</Option>
                    <Option value="PI">PI</Option>
                    <Option value="RJ">RJ</Option>
                    <Option value="RN">RN</Option>
                    <Option value="RS">RS</Option>
                    <Option value="RO">RO</Option>
                    <Option value="RR">RR</Option>
                    <Option value="SC">SC</Option>
                    <Option value="SP">SP</Option>
                    <Option value="SE">SE</Option>
                    <Option value="TO">TO</Option>
                  </Select>
                </Col>

                <Col span={4}>
                  <label>
                    Cod. IBGE<span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    type="text"
                    onChange={(e) => setIbgeCode(e.target.value)}
                    value={ibgeCode}
                  />
                </Col>
              </Row>

              <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
                SERVIÇO DE EMAIL
              </Divider>

              <Row gutter={10} style={{ marginBottom: 7 }}>
                <Col span={8}>
                  <label>
                    Email<span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    type="text"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </Col>

                <Col span={8}>
                  <label>
                    Serviço de Email<span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    type="text"
                    onChange={(e) => setServicoEmail(e.target.value)}
                    value={servicoEmail}
                  />
                </Col>

                <Col span={8}>
                  <label>
                    Senha do Email<span style={{ color: "red" }}>*</span>
                  </label>
                  <Input.Password
                    type="text"
                    onChange={(e) => setPasswordEmail(e.target.value)}
                    value={passwordEmail}
                  />
                </Col>
              </Row>

              <Divider />

              <Button
                loading={loading}
                type="primary"
                size="large"
                icon="save"
                onClick={() => sendDados()}
              >
                Salvar
              </Button>
            </>
          )}

          {dados && (
            <>
              <Row>
                <Col span={4} style={{ paddingRight: 5 }}>
                  <label>Logo</label>
                  <Card
                    style={{ width: "100%" }}
                    cover={<img alt="logo" src={dados.logo_url} />}
                    bodyStyle={{ padding: 0 }}
                  ></Card>
                </Col>

                <Col span={20} style={{ paddingLeft: 5 }}>
                  <Row style={{ marginBottom: 7 }} gutter={10}>
                    <Col span={24}>
                      <label>Nome fantasia</label>
                      <Input
                        type="text"
                        onChange={(e) => setNome(e.target.value.toUpperCase())}
                        value={nome}
                      />
                    </Col>
                  </Row>

                  <Row style={{ marginBottom: 7 }} gutter={10}>
                    <Col span={8}>
                      <label>CNPJ</label>
                      <InputMask
                        mask={"99.999.999/9999-99"}
                        className="ant-input"
                        onChange={(e) => setCnpj(e.target.value)}
                        value={cnpj}
                      />
                    </Col>

                    <Col span={8}>
                      <label>Razão social</label>
                      <Input
                        type="text"
                        onChange={(e) => setRazao(e.target.value.toUpperCase())}
                        value={razao}
                      />
                    </Col>

                    <Col span={8}>
                      <label>Inscrição estadual</label>
                      <Input
                        type="text"
                        onChange={(e) => setInscEstadual(e.target.value)}
                        value={inscEstadual}
                      />
                    </Col>
                  </Row>

                  <Row style={{ marginBottom: 7 }} gutter={10}>
                    <Col span={8}>
                      <label>Telefone comercial</label>
                      <InputMask
                        mask={"99 9999-9999"}
                        className="ant-input"
                        onChange={(e) => setPhoneComercial(e.target.value)}
                        value={phoneComercial}
                      />
                    </Col>

                    <Col span={8}>
                      <label>Telefone celular 1</label>
                      <InputMask
                        mask={"99 99999-9999"}
                        className="ant-input"
                        onChange={(e) => setCelUm(e.target.value)}
                        value={celUm}
                      />
                    </Col>

                    <Col span={8}>
                      <label>Telefone celular 2</label>
                      <InputMask
                        mask={"99 99999-9999"}
                        className="ant-input"
                        onChange={(e) => setCelDois(e.target.value)}
                        value={celDois}
                      />
                    </Col>
                  </Row>

                  <Row gutter={10}>
                    <Col span={12}>
                      <label>Inscrição municipal</label>
                      <Input
                        onChange={(e) => setInscMunicipal(e.target.value)}
                        value={inscMunicipal}
                      />
                    </Col>

                    <Col span={12}>
                      <label style={{ display: "block", width: "100%" }}>
                        Regime Tributário
                      </label>
                      <Select
                        value={simplesOptant}
                        style={{ width: "100%" }}
                        onChange={(value) => setSimplesOptant(value)}
                      >
                        <Option value="MEI">
                          MEI - Microempreendedor Individual
                        </Option>
                        <Option value="SimplesNacional">
                          Simples Nacional
                        </Option>
                        <Option value="LucroPresumido">Lucro Presumido</Option>
                        <Option value="LucroReal">Lucro Real</Option>
                        <Option value="Isento">Isento</Option>
                      </Select>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
                ENDEREÇO
              </Divider>

              <Row style={{ overflow: "hidden" }} gutter={10}>
                <Col span={18}>
                  <label>
                    Rua<span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    type="text"
                    onChange={(e) => setRua(e.target.value.toUpperCase())}
                    value={rua}
                  />
                </Col>

                <Col span={6}>
                  <label>
                    Número<span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    type="number"
                    onChange={(e) => setNumero(e.target.value.toUpperCase())}
                    value={numero}
                  />
                </Col>
              </Row>

              <Row style={{ marginTop: 7, overflow: "hidden" }} gutter={10}>
                <Col span={12}>
                  <label>Complemento</label>
                  <Input
                    type="text"
                    onChange={(e) =>
                      setComplemento(e.target.value.toUpperCase())
                    }
                    value={complemento}
                  />
                </Col>

                <Col span={12}>
                  <label>
                    Bairro<span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    type="text"
                    onChange={(e) => setBairro(e.target.value.toUpperCase())}
                    value={bairro}
                  />
                </Col>
              </Row>

              <Row style={{ marginTop: 7, overflow: "hidden" }} gutter={10}>
                <Col span={5}>
                  <label>
                    CEP<span style={{ color: "red" }}>*</span>
                  </label>
                  <InputMask
                    mask={"99999-999"}
                    className="ant-input"
                    onChange={(e) => handleCep(e.target.value)}
                    value={cep}
                  />
                </Col>

                <Col span={10}>
                  <label>
                    Cidade<span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    type="text"
                    onChange={(e) => setCidade(e.target.value.toUpperCase())}
                    value={cidade}
                  />
                </Col>

                <Col span={5}>
                  <label>
                    UF<span style={{ color: "red" }}>*</span>
                  </label>
                  <Select
                    value={estado}
                    style={{ width: "100%" }}
                    onChange={(value) => setEstado(value)}
                  >
                    <Option value="AC">AC</Option>
                    <Option value="AL">AL</Option>
                    <Option value="AP">AP</Option>
                    <Option value="AM">AM</Option>
                    <Option value="BA">BA</Option>
                    <Option value="CE">CE</Option>
                    <Option value="DF">DF</Option>
                    <Option value="ES">ES</Option>
                    <Option value="GO">GO</Option>
                    <Option value="MA">MA</Option>
                    <Option value="MT">MT</Option>
                    <Option value="MS">MS</Option>
                    <Option value="MG">MG</Option>
                    <Option value="PA">PA</Option>
                    <Option value="PB">PB</Option>
                    <Option value="PR">PR</Option>
                    <Option value="PE">PE</Option>
                    <Option value="PI">PI</Option>
                    <Option value="RJ">RJ</Option>
                    <Option value="RN">RN</Option>
                    <Option value="RS">RS</Option>
                    <Option value="RO">RO</Option>
                    <Option value="RR">RR</Option>
                    <Option value="SC">SC</Option>
                    <Option value="SP">SP</Option>
                    <Option value="SE">SE</Option>
                    <Option value="TO">TO</Option>
                  </Select>
                </Col>

                <Col span={4}>
                  <label>
                    Cod. IBGE<span style={{ color: "red" }}>*</span>
                  </label>
                  <Input
                    type="text"
                    onChange={(e) => setIbgeCode(e.target.value)}
                    value={ibgeCode}
                  />
                </Col>
              </Row>

              <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
                SERVIÇO DE EMAIL
              </Divider>

              <Row gutter={10} style={{ marginBottom: 7 }}>
                <Col span={8}>
                  <label>Email</label>
                  <Input
                    type="text"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </Col>

                <Col span={8}>
                  <label>Serviço de Email</label>
                  <Input
                    type="text"
                    onChange={(e) => setServicoEmail(e.target.value)}
                    value={servicoEmail}
                  />
                </Col>

                <Col span={8}>
                  <label>Senha do Email</label>
                  <Input.Password
                    type="text"
                    onChange={(e) => setPasswordEmail(e.target.value)}
                    value={passwordEmail}
                  />
                </Col>
              </Row>

              <Divider />

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                  marginBottom: 5,
                }}
              >
                <Button
                  type="default"
                  size="large"
                  icon="camera"
                  style={{ marginRight: 15 }}
                  onClick={() => handleUpdateLogo(dados._id)}
                >
                  Alterar Logo
                </Button>

                <Button
                  type="primary"
                  size="large"
                  icon="save"
                  onClick={() => sendUpdateDados()}
                >
                  Salvar Informações
                </Button>
              </div>
            </>
          )}
        </Spin>

        <Modal
          title="Alterar Logo"
          visible={modalLogo}
          onCancel={() => setModalLogo(false)}
          footer={[
            <Button
              key="back"
              icon="close"
              type="danger"
              onClick={() => setModalLogo(false)}
            >
              Cancelar
            </Button>,
            <Button
              key="submit"
              icon="save"
              type="primary"
              loading={loadingLogo}
              onClick={() => updateLogo()}
            >
              Salvar
            </Button>,
          ]}
          width="50%"
        >
          <Row>
            <Col span={12}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <label>Logo Atual</label>
                {dados && <img src={dados.logo_url} style={{ height: 120 }} />}
              </div>
            </Col>

            <Col span={12}>
              <label
                style={{ display: "block", width: "100%", textAlign: "center" }}
              >
                Nova Logo
              </label>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  flexDirection: "column",
                }}
              >
                <label
                  id="thumbnail"
                  style={{ backgroundImage: `url(${preview})` }}
                >
                  <input
                    type="file"
                    onChange={(event) => setLogo(event.target.files[0])}
                  />
                  {!logo && <Icon type="camera" style={{ fontSize: 50 }} />}
                </label>
              </div>
            </Col>
          </Row>
        </Modal>
      </div>
    </>
  );
}

export default DadosEmpresa;
