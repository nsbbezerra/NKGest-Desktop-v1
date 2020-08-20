import React, { useState } from "react";
import { Icon, Row, Col, Input, Button, Divider, Modal } from "antd";
import { Header } from "../../styles/styles";
import { Link } from "react-router-dom";
import api from "../../config/axios";

const { TextArea } = Input;

function Servicos() {
  const [loading, setLoading] = useState(false);

  const [servico, setServico] = useState("");
  const [preco, setPreco] = useState(0);
  const [description, setDescription] = useState("");

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

  async function RegisterService() {
    if (servico === "") {
      warning("Atenção", "O serviço está em branco");
      return false;
    }
    if (preco === 0) {
      warning(
        "Atenção",
        "O preço está definido com 0, por favor altere o valor"
      );
      return false;
    }

    setLoading(true);

    await api
      .post("/register/servicos", {
        name: servico,
        value: preco,
        description: description,
        active: true,
      })
      .then((response) => {
        success("Sucesso", response.data.message);
        setServico("");
        setPreco(0);
        setDescription("");
        setLoading(false);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoading(false);
      });
  }

  return (
    <div style={{ padding: 10, height: "100%", overflowY: "auto" }}>
      <Header>
        <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
          <Icon type="tool" style={{ fontSize: 20 }} /> CADASTRO DE SERVIÇOS
        </p>
        <Link style={{ position: "absolute", right: 0 }} to="/">
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
          <Col span={18}>
            <label>
              Nome do serviço<span style={{ color: "red" }}>*</span>
            </label>
            <Input
              type="text"
              onChange={(e) => setServico(e.target.value.toUpperCase())}
              value={servico}
            />
          </Col>

          <Col span={6}>
            <label>
              Preço do serviço<span style={{ color: "red" }}>*</span>
            </label>
            <Input
              type="number"
              addonAfter="R$"
              value={preco}
              onChange={(e) => setPreco(parseFloat(e.target.value))}
            />
          </Col>
        </Row>

        <Row gutter={10}>
          <Col span={24}>
            <label>Descrição</label>
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value.toUpperCase())}
              rows={3}
            />
          </Col>
        </Row>

        <Divider />

        <Button
          type="primary"
          icon="save"
          size="large"
          loading={loading}
          onClick={() => RegisterService()}
        >
          Cadastrar serviço
        </Button>
      </div>
    </div>
  );
}

export default Servicos;
