import React, { useState, useEffect } from "react";
import {
  Icon,
  Row,
  Col,
  TreeSelect,
  Button,
  Divider,
  Card,
  Spin,
  Modal,
  Statistic,
  Tooltip,
  Input,
  Table,
} from "antd";
import { Header } from "../../../styles/styles";
import { Link } from "react-router-dom";
import api from "../../../config/axios";

const { TreeNode } = TreeSelect;

function AlterarFornecedor() {
  const [spinner, setSpinner] = useState(false);
  const [loading, setLoading] = useState(false);

  const [produtos, setProdutos] = useState([]);
  const [produtoNome, setProdutoNome] = useState("");
  const [produtoID, setProdutoID] = useState("");
  const [fornecedores, setFornecedores] = useState([]);
  const [nomeFornecedor, setNomeFornecedor] = useState("");
  const [idFornecedor, setIdFornecedor] = useState("");
  const [actualFornecer, setActualFornecer] = useState("");
  const [modalHandleProducts, setModalHandleProducts] = useState(false);
  const [productsHandle, setProductsHandle] = useState([]);
  const [finderProduct, setFinderProduct] = useState("");

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

  async function findProducts() {
    setSpinner(true);
    await api
      .get("/stock/findProdutos")
      .then((response) => {
        setProdutos(response.data.produtos);
        setSpinner(false);
      })
      .catch((error) => {
        erro("Erro", error.message);
        setSpinner(false);
      });
  }

  async function findFornecedores() {
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

  async function sendUpdateFornecer() {
    setLoading(true);

    await api
      .put(`/stock/alterarFornece/${produtoID}`, {
        fornecedor: idFornecedor,
      })
      .then((response) => {
        success("Sucesso", response.data.message);
        setActualFornecer("");
        setNomeFornecedor("");
        setProdutoNome("");
        setLoading(false);
        findProducts();
      })
      .catch((error) => {
        erro("Erro", error.message);
        setLoading(false);
      });
  }

  async function handleFornecedor(value) {
    const result = await fornecedores.find((obj) => obj.name === value);
    await setNomeFornecedor(result.name);
    await setIdFornecedor(result._id);
  }

  useEffect(() => {
    findProducts();
    findFornecedores();
  }, []);

  useEffect(() => {
    finderProductsBySource(finderProduct);
  }, [finderProduct]);

  async function finderProductsBySource(text) {
    if (text === "") {
      await setProductsHandle([]);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await produtos.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.codiname.includes(termoBuscado);
        }, true);
      });
      await setProductsHandle(frasesFiltradas);
    }
  }

  async function handleProduto(value) {
    const productInfo = await produtos.find((obj) => obj._id === value);
    await setProdutoID(productInfo._id);
    await setProdutoNome(productInfo.codiname);
    await setActualFornecer(productInfo.fornecedor.name);
  }

  return (
    <>
      <Header>
        <p style={{ fontWeight: "bold", marginBottom: -0.01, fontSize: 18 }}>
          <Icon type="idcard" style={{ fontSize: 20 }} /> ALTERAR FORNECEDOR
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
          <Row gutter={10} style={{ marginBottom: 10 }}>
            <Col span={20}>
              <label>Selecione o Produto</label>
              <Input value={produtoNome} size="large" readOnly />
            </Col>
            <Col span={4}>
              <label style={{ color: "transparent" }}>
                Selecione o produto
              </label>
              <Button
                icon="search"
                type="primary"
                size="large"
                onClick={() => setModalHandleProducts(true)}
                style={{ width: "100%" }}
              >
                Buscar
              </Button>
            </Col>
          </Row>

          <Row gutter={10}>
            <Col span={12}>
              <label>Fornecedor Atual</label>
              <Input value={actualFornecer} size="large" readOnly />
            </Col>
            <Col span={12}>
              <label>Selecione o Novo Fornecedor</label>
              <TreeSelect
                showSearch
                style={{ width: "100%", marginBottom: 20 }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                treeDefaultExpandAll
                value={nomeFornecedor}
                onChange={(value) => handleFornecedor(value)}
                size="large"
              >
                {fornecedores.map((fornecer) => (
                  <TreeNode
                    value={fornecer.name}
                    title={fornecer.name}
                    key={fornecer._id}
                  />
                ))}
              </TreeSelect>
            </Col>
          </Row>
        </Spin>

        <Divider />

        <Button
          type="primary"
          icon="save"
          size="large"
          loading={loading}
          onClick={() => sendUpdateFornecer()}
        >
          Salvar alterações
        </Button>
      </div>
      <Modal
        visible={modalHandleProducts}
        title="Produtos"
        onCancel={() => setModalHandleProducts(false)}
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
            <Col span={24}>
              <label>Digite para Buscar o Produto (F8)</label>
              <Input
                id="products"
                value={finderProduct}
                onChange={(e) => setFinderProduct(e.target.value.toUpperCase())}
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
        />
      </Modal>
    </>
  );
}

export default AlterarFornecedor;
