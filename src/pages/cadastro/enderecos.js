import React, { useState, useEffect } from "react";
import {
  Icon,
  Row,
  Col,
  Input,
  Select,
  Divider,
  TreeSelect,
  Button,
  Spin,
  Modal,
} from "antd";
import { Header } from "../../styles/styles";
import InputMask from "react-input-mask";
import { Link } from "react-router-dom";
import api from "../../config/axios";
import findCep from "cep-promise";

const { Option } = Select;
const { TreeNode } = TreeSelect;

function Enderecos() {
  const [clientes, setClientes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const [idCliente, setIdCliente] = useState("");
  const [clientName, setClientName] = useState("Selecione");
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
  }, []);

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

    setLoading(true);

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
        setClientName("");
        setIdCliente("");
        setLoading(false);
        success("Sucesso", response.data.message);
      })
      .catch((error) => {
        setLoading(false);
        erro("Erro", error.response.data.message);
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

  async function setClientId(client) {
    const result = await clientes.find((obj) => obj.name === client);

    await setIdCliente(result._id);

    await setClientName(client);
  }

  return (
    <>
      <Header>
        <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
          <Icon type="environment" style={{ fontSize: 20 }} /> CADASTRO DE
          ENDEREÇOS
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
        <Spin spinning={spinner} size="large">
          <Row gutter={10}>
            <Col span={8}>
              <label>
                Cliente<span style={{ color: "red" }}>*</span>
              </label>
              <TreeSelect
                showSearch
                style={{ width: "100%" }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                placeholder="Selecione"
                treeDefaultExpandAll
                onChange={(value) => setClientId(value)}
                value={clientName}
              >
                {clientes.map((client) => (
                  <TreeNode
                    value={client.name}
                    title={client.name}
                    key={client._id}
                  />
                ))}
              </TreeSelect>
            </Col>

            <Col span={12}>
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

          <Row style={{ marginTop: 7 }} gutter={10}>
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

          <Row style={{ marginTop: 7 }} gutter={10}>
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
        </Spin>

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
            onClick={() => RegisterAddress()}
          >
            Cadastrar Endereço
          </Button>

          <label style={{ marginLeft: 50 }}>
            <span style={{ color: "red" }}>*</span> Campo Obrigatório
          </label>
        </div>
      </div>
    </>
  );
}

export default Enderecos;
