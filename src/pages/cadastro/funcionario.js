import React, { useState } from "react";
import {
  Icon,
  Row,
  Col,
  Input,
  Button,
  Divider,
  Select,
  Switch,
  Card,
  Modal,
  Layout,
} from "antd";
import InputMask from "react-input-mask";
import { Header } from "../../styles/styles";
import { Link } from "react-router-dom";
import api from "../../config/axios";

const { Option } = Select;

function Funcionarios() {
  const [loading, setLoading] = useState(false);

  const [admin, setAdmin] = useState(false);
  const [sales, setSales] = useState(false);
  const [comissioned, setComissioned] = useState(false);
  const [caixa, setCaixa] = useState(false);
  const [cargoNome, setCargoNome] = useState("");
  const [nome, setNome] = useState("");
  const [sexo, setSexo] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [celUm, setCelUm] = useState("");
  const [celDois, setCelDois] = useState("");
  const [email, setEmail] = useState("");
  const [admissao, setAdmissao] = useState("");
  const [comissao, setComissao] = useState(0);
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

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

  async function RegisterFuncionario() {
    if (nome === "") {
      warning("Atenção", "O nome está em branco");
      return false;
    }
    if (sexo === "") {
      warning("Atenção", "O campo SEXO está sem seleção");
      return false;
    }
    if (dataNasc === "") {
      warning("Atenção", "A data de nascimento está em branco");
      return false;
    }
    if (celUm === "") {
      warning(
        "Atenção",
        "O funcionário deve ter pelo menos um número de telefone cadastrado, Preencha o campo CELULAR 1"
      );
      return false;
    }

    setLoading(true);

    await api
      .post("/register/funcionarios", {
        name: nome,
        gender: sexo,
        dateBirth: dataNasc,
        celOne: celUm,
        celTwo: celDois,
        email: email,
        admin: admin,
        sales: sales,
        caixa: caixa,
        admission: admissao,
        comission: comissao,
        comissioned: comissioned,
        user: usuario,
        password: senha,
        cargo: cargoNome,
      })
      .then((response) => {
        success("Sucesso", response.data.message);
        setNome("");
        setEmail("");
        setSexo("");
        setDataNasc("");
        setComissioned(false);
        setCelDois("");
        setCelUm("");
        setAdmin(false);
        setSales(false);
        setCaixa(false);
        setAdmissao("");
        setComissao("");
        setUsuario("");
        setSenha("");
        setCargoNome("");
        setLoading(false);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoading(false);
      });
  }

  function handleSalesAdmin() {
    if (admin === true) {
      setAdmin(false);
    }
    if (caixa === true) {
      setCaixa(false);
    }
    setSales(!sales);
  }

  function handleAdmin() {
    if (sales === true) {
      setSales(false);
    }
    if (caixa === true) {
      setCaixa(false);
    }
    setAdmin(!admin);
  }

  function handleCaixa() {
    if (admin === true) {
      setAdmin(false);
    }
    if (sales === true) {
      setSales(false);
    }
    setCaixa(!caixa);
  }

  return (
    <>
      <Header>
        <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
          <Icon type="idcard" style={{ fontSize: 20 }} /> CADASTRO DE
          FUNCIONÁRIOS
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
        <Row gutter={10} style={{ marginBottom: 7 }}>
          <Col span={16}>
            <label>
              Nome do funcionário<span style={{ color: "red" }}>*</span>
            </label>
            <Input
              type="text"
              onChange={(e) => setNome(e.target.value.toUpperCase())}
              value={nome}
            />
          </Col>

          <Col span={4}>
            <label>
              Sexo<span style={{ color: "red" }}>*</span>
            </label>
            <Select
              value={sexo}
              style={{ width: "100%" }}
              onChange={(value) => setSexo(value)}
            >
              <Option value="masc">Masculino</Option>
              <Option value="fem">Feminino</Option>
            </Select>
          </Col>

          <Col span={4}>
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

          <Col span={8}>
            <label>Email</label>
            <Input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </Col>
        </Row>

        <Row gutter={10} style={{ marginBottom: 7 }}>
          <Col span={18}>
            <Card
              size="small"
              title="Permissões"
              headStyle={{ fontWeight: "bold" }}
            >
              <Row gutter={10}>
                <Col span={8}>
                  <label>Função administrativa?</label>
                  <div style={{ width: "100%" }}>
                    <Switch
                      checkedChildren={<Icon type="check" />}
                      unCheckedChildren={<Icon type="close" />}
                      checked={admin}
                      onChange={() => handleAdmin()}
                    />
                  </div>
                </Col>

                <Col span={8}>
                  <label>Vendas?</label>
                  <div style={{ width: "100%" }}>
                    <Switch
                      checkedChildren={<Icon type="check" />}
                      unCheckedChildren={<Icon type="close" />}
                      checked={sales}
                      onChange={() => handleSalesAdmin()}
                    />
                  </div>
                </Col>

                <Col span={8}>
                  <label>Financeiro e Caixa?</label>
                  <div style={{ width: "100%" }}>
                    <Switch
                      checkedChildren={<Icon type="check" />}
                      unCheckedChildren={<Icon type="close" />}
                      checked={caixa}
                      onChange={() => handleCaixa()}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={6}>
            <label>
              Cargo<span style={{ color: "red" }}>*</span>
            </label>
            <Select
              value={cargoNome}
              style={{ width: "100%" }}
              onChange={(value) => setCargoNome(value)}
            >
              <Option key={1} value="Administrador">
                Administrador(a)
              </Option>
              <Option key={2} value="Diretor">
                Diretor(a)
              </Option>
              <Option key={3} value="Gerente">
                Gerente
              </Option>
              <Option key={4} value="Caixa">
                Caixa
              </Option>
              <Option key={5} value="Vendedor">
                Vendedor(a)
              </Option>
              <Option key={6} value="Auxiliar de Almoxarifado">
                Auxiliar de Almoxarifado
              </Option>
              <Option key={7} value="Zelador">
                Zelador(a)
              </Option>
              <Option key={8} value="Conferente">
                Conferente
              </Option>
              <Option key={9} value="Mecânico">
                Mecânico
              </Option>
              <Option key={10} value="Auxiliar de Mecânico">
                Auxiliar de Mecânico
              </Option>
            </Select>

            <label>
              Admissão<span style={{ color: "red" }}>*</span>
            </label>
            <InputMask
              mask={"99/99/9999"}
              className="ant-input"
              onChange={(e) => setAdmissao(e.target.value)}
              value={admissao}
            />
          </Col>
        </Row>

        {admin === true && (
          <>
            <Row gutter={10} style={{ marginTop: 7 }}>
              <Col span={12}>
                <label>Usuário</label>
                <Input
                  type="text"
                  onChange={(e) => setUsuario(e.target.value)}
                  value={usuario}
                />
              </Col>

              <Col span={12}>
                <label>Senha administrativa</label>
                <Input.Password
                  onChange={(e) => setSenha(e.target.value)}
                  value={senha}
                />
              </Col>
            </Row>
          </>
        )}

        {caixa === true && (
          <>
            <Row gutter={10} style={{ marginTop: 7 }}>
              <Col span={12}>
                <label>Usuário</label>
                <Input
                  type="text"
                  onChange={(e) => setUsuario(e.target.value)}
                  value={usuario}
                />
              </Col>

              <Col span={12}>
                <label>Senha</label>
                <Input.Password
                  onChange={(e) => setSenha(e.target.value)}
                  value={senha}
                />
              </Col>
            </Row>
          </>
        )}

        {sales === true && (
          <>
            <Row gutter={10} style={{ marginTop: 7 }}>
              <Col span={8}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                  }}
                >
                  <label>Comissionado?</label>
                  <Switch
                    checkedChildren={<Icon type="check" />}
                    unCheckedChildren={<Icon type="close" />}
                    checked={comissioned}
                    onChange={(value) => setComissioned(value)}
                    style={{ marginLeft: 10, marginTop: -2.5 }}
                  />
                </div>

                <Input
                  type="number"
                  addonAfter="%"
                  disabled={!comissioned}
                  onChange={(e) => setComissao(e.target.value)}
                  value={comissao}
                />
              </Col>

              <Col span={8}>
                <label>Usuário</label>
                <Input
                  type="text"
                  onChange={(e) => setUsuario(e.target.value)}
                  value={usuario}
                />
              </Col>

              <Col span={8}>
                <label>Senha</label>
                <Input.Password
                  onChange={(e) => setSenha(e.target.value)}
                  value={senha}
                />
              </Col>
            </Row>
          </>
        )}

        <Divider />

        <Button
          type="primary"
          icon="save"
          size="large"
          loading={loading}
          onClick={() => RegisterFuncionario()}
        >
          Cadastrar Funcionário
        </Button>
      </div>
    </>
  );
}

export default Funcionarios;
