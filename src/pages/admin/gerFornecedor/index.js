import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Modal,
  Spin,
  Tooltip,
  Icon,
  Row,
  Col,
} from "antd";
import { Header } from "../../../styles/styles";
import { Link } from "react-router-dom";
import api from "../../../config/axios";
import InputMask from "react-input-mask";

const { Option } = Select;

export default function GerFornecedor() {
  const [spinner, setSpinner] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fornecedores, setFornecedores] = useState([]);
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [typeClient, setTypeClient] = useState("fisic");
  const [idFornecedor, setIdFornecedor] = useState("");

  async function allClear() {
    await setName("");
    await setCnpj("");
    await setEmail("");
    await setPhone("");
    await setCity("");
    await setState("");
    await setIdFornecedor("");
    await setTypeClient("fisic");
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

  useEffect(() => {
    findFornecedor();
  }, []);

  async function findFornecedor() {
    setSpinner(true);
    await api
      .get("/stock/findFornecedores")
      .then((response) => {
        setFornecedores(response.data.fornecedores);
        setSpinner(false);
      })
      .catch((error) => {
        erro("Erro", error.message);
        setSpinner(false);
      });
  }

  async function handleFornecedor(id) {
    const result = await fornecedores.find((obj) => obj._id === id);
    await setIdFornecedor(result._id);
    await setName(result.name);
    await setCnpj(result.cpf_cnpj);
    await setEmail(result.email);
    await setPhone(result.phoneComercial);
    await setCity(result.city);
    await setState(result.state);
    await setTypeClient(result.typeClient);
    setModalEdit(true);
  }

  async function updateFornecedor() {
    setLoading(true);
    await api
      .put(`/fornecedores/change/${idFornecedor}`, {
        name: name,
        cpf_cnpj: cnpj,
        email: email,
        phoneComercial: phone,
        city: city,
        state: state,
      })
      .then((response) => {
        success("Sucesso", response.data.message);
        setLoading(false);
        setModalEdit(false);
        allClear();
        findFornecedor();
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoading(false);
      });
  }

  const columnSalesPay = [
    {
      title: "Tipo",
      dataIndex: "typeClient",
      key: "typeClient",
      render: (val) => (
        <>
          {val === "fisic" && (
            <Button type="link" style={{ width: "100%" }} size="small">
              Física
            </Button>
          )}
          {val === "juridic" && (
            <Button type="link" style={{ width: "100%" }} size="small">
              Jurídica
            </Button>
          )}
        </>
      ),
      align: "center",
      width: "7%",
    },
    {
      title: "Nome / Razão Social",
      dataIndex: "name",
      key: "name",
      width: "25%",
    },
    {
      title: "CPF / CNPJ",
      dataIndex: "cpf_cnpj",
      key: "cpf_cnpj",
      width: "15%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "15%",
    },
    {
      title: "Telefone",
      dataIndex: "phoneComercial",
      key: "phoneComercial",
      align: "center",
      width: "10%",
    },
    {
      title: "Cidade",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "UF",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Ações",
      dataIndex: "_id",
      key: "_id",
      render: (id) => (
        <>
          <Tooltip placement="top" title="Editar Informações">
            <Button
              icon="edit"
              type="primary"
              shape="circle"
              size="small"
              onClick={() => handleFornecedor(id)}
            />
          </Tooltip>
        </>
      ),
      width: "6%",
      align: "center",
    },
  ];

  return (
    <div style={{ padding: 10, height: "100%", overflowY: "auto" }}>
      <Header>
        <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
          <Icon type="idcard" style={{ fontSize: 20 }} /> GERENCIAR FORNECEDOR
        </p>
        <Link to="/">
          <Button type="danger" shape="circle" icon="close" size="small" />
        </Link>
      </Header>

      <div style={{ marginTop: 15 }}>
        <Spin spinning={spinner} size="large">
          <Table
            pagination={{ pageSize: 10 }}
            columns={columnSalesPay}
            dataSource={fornecedores}
            size="small"
            rowKey={(cli) => cli._id}
          />
        </Spin>
      </div>

      <Modal
        visible={modalEdit}
        title="Editar Informações"
        closable={false}
        footer={[
          <Button
            key="back"
            icon="close"
            type="danger"
            onClick={() => setModalEdit(false)}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            icon="save"
            type="primary"
            loading={loading}
            onClick={() => updateFornecedor()}
          >
            Salvar
          </Button>,
        ]}
        width="80%"
      >
        <Row gutter={10} style={{ marginBottom: 5 }}>
          <Col span={24}>
            <label>Nome</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.toUpperCase())}
            />
          </Col>
        </Row>

        <Row gutter={10} style={{ marginBottom: 5 }}>
          <Col span={8}>
            <label>CPF / CNPJ</label>
            {typeClient === "fisic" && (
              <InputMask
                mask={"99.999.999/9999-99"}
                className="ant-input"
                onChange={(e) => setCnpj(e.target.value)}
                value={cnpj}
              />
            )}
            {typeClient === "juridic" && (
              <InputMask
                mask={"999.999.999-99"}
                className="ant-input"
                onChange={(e) => setCnpj(e.target.value)}
                value={cnpj}
              />
            )}
          </Col>
          <Col span={8}>
            <label>Telefone</label>
            <InputMask
              mask={"99 9999-9999"}
              className="ant-input"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
            />
          </Col>
          <Col span={8}>
            <label>Email</label>
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Col>
        </Row>

        <Row gutter={10}>
          <Col span={16}>
            <label>Cidade</label>
            <Input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value.toUpperCase())}
            />
          </Col>
          <Col span={8}>
            <label>UF</label>
            <Select
              value={state}
              style={{ width: "100%" }}
              onChange={(value) => setState(value)}
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
  );
}
