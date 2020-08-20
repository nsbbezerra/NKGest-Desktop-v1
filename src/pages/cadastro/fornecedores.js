import React, { useState } from "react";
import {
  Icon,
  Row,
  Col,
  Input,
  Select,
  Divider,
  Checkbox,
  Button,
  Modal,
} from "antd";
import { Header } from "../../styles/styles";
import InputMask from "react-input-mask";
import { Link } from "react-router-dom";
import api from "../../config/axios";
import findCep from "cep-promise";

const { TextArea } = Input;
const { Option } = Select;

function Fornecedores() {
  const [loading, setLoading] = useState(false);

  const [check, setCheck] = useState(false);
  const [checkMun, setCheckMun] = useState(false);

  const [typeClient, setTypeClient] = useState("Pessoa Física");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf_cnpj, setCpf_cnpj] = useState("");
  const [rg, setRg] = useState("");
  const [orgaoEmissor, setOrgaoEmissor] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [phoneComercial, setPhoneComercial] = useState("");
  const [celUm, setCelUm] = useState("");
  const [celDois, setCelDois] = useState("");
  const [obs, setObs] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [inscricaoEstadual, setInscricaoEstadual] = useState("");
  const [inscricaoMunicipal, setInscricaoMunicipal] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

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

  function handleInscricaoMun(e) {
    if (e.target.checked === true) {
      setInscricaoMunicipal(e.target.value);
      setCheckMun(true);
    }
    if (e.target.checked === false) {
      setInscricaoMunicipal("");
      setCheckMun(false);
    }
  }

  async function RegisterFornecedor() {
    if (typeClient === "Pessoa Física") {
      if (nome === "") {
        warning("Atenção", "O nome está em branco");
        return false;
      }
      if (email === "") {
        warning("Atenção", "O email está vazio");
        return false;
      }
      if (ativo === "") {
        warning("Atenção", "O campo SITUAÇÃO está sem seleção");
        return false;
      }
      if (cpf_cnpj === "") {
        warning("Atenção", "O CPF está em branco");
        return false;
      }
      if (rg === "") {
        warning("Atenção", "O RG está em branco");
        return false;
      }
      if (orgaoEmissor === "") {
        warning("Atenção", "O campo ÓRGÃO EMISSOR está em branco");
        return false;
      }
      if (celUm === "") {
        warning("Atenção", "Preencha o campo CELULAR 1");
        return false;
      }
      if (dataNasc === "") {
        warning("Atenção", "A data de nascimento está em branco");
        return false;
      }
    }

    if (typeClient === "Pessoa Jurídica") {
      if (nome === "") {
        warning("Atenção", "O nome fantasia está em branco");
        return false;
      }
      if (email === "") {
        warning("Atenção", "O email está vazio");
        return false;
      }
      if (ativo === "") {
        warning("Atenção", "O campo SITUAÇÃO está sem seleção");
        return false;
      }
      if (cpf_cnpj === "") {
        warning("Atenção", "O CNPJ está em branco");
        return false;
      }
      if (razaoSocial === "") {
        warning("Atenção", "O campo RAZÃO SOCIAL está em branco");
        return false;
      }
      if (phoneComercial === "") {
        warning("Atenção", "Preencha o campo TELEFONE COMERCIAL");
        return false;
      }
    }

    var Tipo = "";

    if (typeClient === "Pessoa Física") {
      Tipo = "fisic";
    } else {
      Tipo = "juridic";
    }

    await setLoading(true);

    await api
      .post("/register/fornecedores", {
        name: nome,
        cpf_cnpj: cpf_cnpj,
        rg: rg,
        emitter: orgaoEmissor,
        dateBirth: dataNasc,
        email: email,
        typeClient: Tipo,
        socialName: razaoSocial,
        stateRegistration: inscricaoEstadual,
        municipalRegistration: inscricaoMunicipal,
        manager: responsavel,
        phoneComercial: phoneComercial,
        celOne: celUm,
        celTwo: celDois,
        obs: obs,
        cep: cep,
        city: cidade,
        state: estado,
      })
      .then((response) => {
        setNome("");
        setAtivo(true);
        setTypeClient("Pessoa Física");
        setCheck(false);
        setCelDois("");
        setCelUm("");
        setCpf_cnpj("");
        setDataNasc("");
        setEmail("");
        setInscricaoEstadual("");
        setInscricaoMunicipal("");
        setObs("");
        setOrgaoEmissor("");
        setPhoneComercial("");
        setRazaoSocial("");
        setResponsavel("");
        setRg("");
        setCep("");
        setCidade("");
        setEstado("Selecione");
        setLoading(false);
        success("Sucesso", "Cadastrado com sucesso");
      })
      .catch((error) => {
        setLoading(false);
        erro("Erro", error.response.data.message);
      });
  }

  function handleInscricaoEstadual(e) {
    if (e.target.checked === true) {
      setInscricaoEstadual(e.target.value);
      setCheck(true);
    }
    if (e.target.checked === false) {
      setInscricaoEstadual("");
      setCheck(false);
    }
  }

  return (
    <div style={{ padding: 10, height: "100%", overflowY: "auto" }}>
      <Header>
        <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
          <Icon type="idcard" style={{ fontSize: 20 }} /> CADASTRO DE
          FORNECEDORES
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
        }}
      >
        {typeClient === "Pessoa Física" && (
          <>
            <Row style={{ marginBottom: 7 }} gutter={10}>
              <Col span={4}>
                <label>Tipo de cliente</label>
                <Select
                  defaultValue={typeClient}
                  style={{ width: "100%" }}
                  onChange={(value) => setTypeClient(value)}
                >
                  <Option value="Pessoa Física">Pessoa Física</Option>
                  <Option value="Pessoa Jurídica">Pessoa Jurídica</Option>
                </Select>
              </Col>

              <Col span={4}>
                <label>
                  Situação<span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  defaultValue={ativo}
                  style={{ width: "100%" }}
                  onChange={(value) => setAtivo(value)}
                >
                  <Option value={true}>Ativo</Option>
                  <Option value={false}>Bloqueado</Option>
                </Select>
              </Col>

              <Col span={10}>
                <label>
                  Nome<span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  value={nome}
                  type="text"
                  onChange={(e) => setNome(e.target.value.toUpperCase())}
                />
              </Col>

              <Col span={6}>
                <label>
                  Email<span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  value={email}
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Col>
            </Row>

            <Row style={{ marginBottom: 7 }} gutter={10}>
              <Col span={6}>
                <label>
                  CPF<span style={{ color: "red" }}>*</span>
                </label>
                <InputMask
                  mask={"999.999.999-99"}
                  className="ant-input"
                  onChange={(e) => setCpf_cnpj(e.target.value)}
                  value={cpf_cnpj}
                />
              </Col>

              <Col span={6}>
                <label>
                  RG<span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  type="number"
                  onChange={(e) => setRg(e.target.value)}
                  value={rg}
                />
              </Col>

              <Col span={6}>
                <label>
                  Órgão emissor<span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  type="text"
                  onChange={(e) =>
                    setOrgaoEmissor(e.target.value.toUpperCase())
                  }
                  value={orgaoEmissor}
                />
              </Col>

              <Col span={6}>
                <label>
                  Data de nascimento<span style={{ color: "red" }}>*</span>
                </label>
                <InputMask
                  mask={"99/99/9999"}
                  className="ant-input"
                  onChange={(e) => setDataNasc(e.target.value)}
                  value={dataNasc}
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
                <label>Telefone celular 2</label>
                <InputMask
                  mask={"99 99999-9999"}
                  className="ant-input"
                  onChange={(e) => setCelDois(e.target.value)}
                  value={celDois}
                />
              </Col>
            </Row>

            <Row style={{ marginBottom: 7 }} gutter={10}>
              <Col span={8}>
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

              <Col span={8}>
                <label>
                  Cidade<span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  type="text"
                  onChange={(e) => setCidade(e.target.value.toUpperCase())}
                  value={cidade}
                />
              </Col>

              <Col span={8}>
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
            </Row>

            <Row gutter={10}>
              <Col span={24}>
                <label>Observações</label>
                <TextArea
                  rows={4}
                  onChange={(e) => setObs(e.target.value.toUpperCase())}
                  value={obs}
                />
              </Col>
            </Row>
          </>
        )}

        {typeClient === "Pessoa Jurídica" && (
          <>
            <Row style={{ marginBottom: 7 }} gutter={10}>
              <Col span={4}>
                <label>Tipo de cliente</label>
                <Select
                  defaultValue={typeClient}
                  style={{ width: "100%" }}
                  onChange={(value) => setTypeClient(value)}
                >
                  <Option value="Pessoa Física">Pessoa Física</Option>
                  <Option value="Pessoa Jurídica">Pessoa Jurídica</Option>
                </Select>
              </Col>

              <Col span={4}>
                <label>
                  Situação<span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  defaultValue={ativo}
                  style={{ width: "100%" }}
                  onChange={(value) => setAtivo(value)}
                >
                  <Option value={true}>Ativo</Option>
                  <Option value={false}>Bloqueado</Option>
                </Select>
              </Col>

              <Col span={10}>
                <label>
                  Razão social<span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  type="text"
                  onChange={(e) => setRazaoSocial(e.target.value.toUpperCase())}
                  value={razaoSocial}
                />
              </Col>

              <Col span={6}>
                <label>
                  Email<span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </Col>
            </Row>

            <Row style={{ marginBottom: 7 }} gutter={10}>
              <Col span={8}>
                <label>
                  CNPJ<span style={{ color: "red" }}>*</span>
                </label>
                <InputMask
                  mask={"99.999.999/9999-99"}
                  className="ant-input"
                  onChange={(e) => setCpf_cnpj(e.target.value)}
                  value={cpf_cnpj}
                />
              </Col>

              <Col span={8}>
                <label>
                  Nome fantasia<span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  type="text"
                  onChange={(e) => setNome(e.target.value.toUpperCase())}
                  value={nome}
                />
              </Col>

              <Col span={8}>
                <label>Inscrição estadual</label>
                <Input
                  type="text"
                  addonAfter={
                    <Checkbox
                      value="Isento"
                      onChange={(value) => handleInscricaoEstadual(value)}
                      checked={check}
                    >
                      Isento
                    </Checkbox>
                  }
                  onChange={(e) => setInscricaoEstadual(e.target.value)}
                  value={inscricaoEstadual}
                />
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

            <Row style={{ marginBottom: 7 }} gutter={10}>
              <Col span={12}>
                <label>Inscrição municipal</label>
                <Input
                  onChange={(e) => setInscricaoMunicipal(e.target.value)}
                  value={inscricaoMunicipal}
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

              <Col span={12}>
                <label>Responsável</label>
                <Input
                  type="text"
                  onChange={(e) => setResponsavel(e.target.value.toUpperCase())}
                  value={responsavel}
                />
              </Col>
            </Row>

            <Row style={{ marginBottom: 7 }} gutter={10}>
              <Col span={8}>
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

              <Col span={8}>
                <label>
                  Cidade<span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  type="text"
                  onChange={(e) => setCidade(e.target.value.toUpperCase())}
                  value={cidade}
                />
              </Col>

              <Col span={8}>
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
            </Row>

            <Row gutter={10}>
              <Col span={24}>
                <label>Observações</label>
                <TextArea
                  rows={4}
                  onChange={(e) => setObs(e.target.value.toUpperCase())}
                  value={obs}
                />
              </Col>
            </Row>
          </>
        )}
        <Divider />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <Button
            type="primary"
            icon="save"
            size="large"
            loading={loading}
            onClick={() => RegisterFornecedor()}
          >
            Cadastrar Fornecedor
          </Button>

          <label style={{ marginLeft: 50 }}>
            <span style={{ color: "red" }}>*</span> Campo Obrigatório
          </label>
        </div>
      </div>
    </div>
  );
}

export default Fornecedores;
