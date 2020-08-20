import React, { useState } from "react";
import { Icon, Row, Col, Input, Select, Divider, Button, Modal } from "antd";
import { Header } from "../../styles/styles";
import InputMask from "react-input-mask";
import { Link } from "react-router-dom";
import api from "../../config/axios";
import findCep from "cep-promise";

const { TextArea } = Input;
const { Option } = Select;

function Clientes() {
  const [modalEndereco, setModalEndereco] = useState(false);
  const [idCliente, setIdCliente] = useState("");
  const [nameClient, setNameClient] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);

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

  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
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

  function handleCancel() {
    setIdCliente("");
    setNameClient("");
    setModalEndereco(false);
    info();
  }

  function info() {
    Modal.info({
      title: "Informação",
      content: (
        <div>
          <p>
            Lembre-se que os dados do <strong>endereços</strong> são dados
            importantes tanto para <strong>vendas</strong> quanto para{" "}
            <strong>ordens de serviço</strong>, entre na seção de cadastro de
            endereços para cadastrá-los para este cliente.
          </p>
        </div>
      ),
      onOk() {},
    });
  }

  async function RegisterClient() {
    if (typeClient === "Pessoa Física") {
      if (nome === "") {
        warning("Atenção", "O nome está em branco");
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
      .post("/register/clientes", {
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
      })
      .then((response) => {
        setIdCliente(response.data.clients._id);
        setNameClient(response.data.clients.name);
        setNome("");
        setAtivo(true);
        setTypeClient("Pessoa Física");
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
        setLoading(false);
        setModalEndereco(true);
      })
      .catch((error) => {
        setLoading(false);
        erro("Erro", error.response.data.message);
      });
  }

  async function RegisterAddress() {
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

    setLoadingAddress(true);

    await api
      .post("/register/enderecos", {
        client: idCliente,
        street: rua,
        number: numero,
        comp: complemento,
        bairro: bairro,
        cep: cep,
        city: cidade,
        state: estado,
      })
      .then((response) => {
        setRua("");
        setNumero("");
        setComplemento("");
        setBairro("");
        setCep("");
        setCidade("");
        setEstado("");
        setLoadingAddress(false);
        setModalEndereco(false);
        success("Sucesso", "Cadastro completado com sucesso");
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoadingAddress(false);
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

  return (
    <div style={{ padding: 10, height: "100%", overflowY: "auto" }}>
      <Header>
        <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
          <Icon type="team" style={{ fontSize: 20 }} /> CADASTRO DE CLIENTES
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
                  autoCapitalize="words"
                  value={nome}
                  type="text"
                  onChange={(e) => setNome(e.target.value.toUpperCase())}
                />
              </Col>

              <Col span={6}>
                <label>Email</label>
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
                  autoCapitalize="characters"
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

            <Row gutter={10} style={{ marginBottom: 7 }}>
              <Col span={6}>
                <label>Inscrição estadual</label>
                <Input
                  type="text"
                  onChange={(e) => setInscricaoEstadual(e.target.value)}
                  value={inscricaoEstadual}
                />
              </Col>

              <Col span={6}>
                <label>Telefone comercial</label>
                <InputMask
                  mask={"99 9999-9999"}
                  className="ant-input"
                  onChange={(e) => setPhoneComercial(e.target.value)}
                  value={phoneComercial}
                />
              </Col>

              <Col span={6}>
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

              <Col span={6}>
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
                  value={typeClient}
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
                  value={ativo}
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
                <label>Email</label>
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

            <Row gutter={10} style={{ marginBottom: 7 }}>
              <Col span={12}>
                <label>Inscrição municipal</label>
                <Input
                  onChange={(e) => setInscricaoMunicipal(e.target.value)}
                  value={inscricaoMunicipal}
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
          }}
        >
          <Button
            type="primary"
            icon="save"
            size="large"
            loading={loading}
            onClick={() => RegisterClient()}
          >
            Cadastrar Cliente
          </Button>

          <label style={{ marginLeft: 50 }}>
            <span style={{ color: "red" }}>*</span> Campo Obrigatório
          </label>
        </div>

        <Modal
          title={`Cadastrar endereço do cliente: ${nameClient}`}
          visible={modalEndereco}
          closable={false}
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
              icon="save"
              type="primary"
              loading={loadingAddress}
              onClick={() => RegisterAddress()}
            >
              Cadastrar
            </Button>,
          ]}
          width="70%"
          centered
        >
          <Row gutter={10}>
            <Col span={20}>
              <label>
                Rua<span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="text"
                onChange={(e) => setRua(e.target.value.toUpperCase())}
                value={rua}
              />
            </Col>

            <Col span={4}>
              <label>
                Número<span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="text"
                onChange={(e) => setNumero(e.target.value.toUpperCase())}
                value={numero}
              />
            </Col>
          </Row>

          <Row style={{ marginTop: 10 }} gutter={10}>
            <Col span={12}>
              <label>Complemento</label>
              <Input
                type="text"
                onChange={(e) => setComplemento(e.target.value.toUpperCase())}
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

          <Row style={{ marginTop: 10 }} gutter={10}>
            <Col span={6}>
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

            <Col span={12}>
              <label>
                Cidade<span style={{ color: "red" }}>*</span>
              </label>
              <Input
                type="text"
                onChange={(e) => setCidade(e.target.value.toUpperCase())}
                value={cidade}
              />
            </Col>

            <Col span={6}>
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
        </Modal>
      </div>
    </div>
  );
}

export default Clientes;
