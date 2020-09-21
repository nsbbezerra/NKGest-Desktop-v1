import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Modal,
  Select,
  Card,
  Divider,
  Row,
  Statistic,
  Descriptions,
  Icon,
} from "antd";
import api from "../../../config/axios";
import moment from "moment";

const { Option } = Select;

export default function RelatorioFinanceiro() {
  const [loading, setLoading] = useState(false);
  const [showTables, setShowTables] = useState(false);

  const [modalAdvancedFind, setModalAdvancedFind] = useState(false);
  const [typeAdvandcedFind, setTypeAdvancedFind] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [despesas, setDespesas] = useState([]);

  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");

  const [valorProdutos, setValorProdutos] = useState(0);
  const [valorServicos, setValorServicos] = useState(0);
  const [valorReceitas, setValorReceitas] = useState(0);
  const [valorDespesas, setValorDespesas] = useState(0);

  const [buttonPrint, setButtonPrint] = useState(true);

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

  async function sendAdvancedFind() {
    if (typeAdvandcedFind === "") {
      warning("Atenção", "Selecione uma opção de busca");
      return false;
    }
    setLoading(true);
    await api
      .post("/report/fluxCashier", {
        find: typeAdvandcedFind,
        mes: mes,
        ano: ano,
      })
      .then((response) => {
        setButtonPrint(false);
        setProdutos(response.data.products);
        setServicos(response.data.services);
        setReceitas(response.data.receitas);
        setDespesas(response.data.despesas);
        setValorProdutos(response.data.calcTotalProductSale);
        setValorServicos(response.data.calcTotalServices);
        setValorReceitas(response.data.calcTotalReceitas);
        setValorDespesas(response.data.calcTotalDespesas);
        setLoading(false);
        setModalAdvancedFind(false);
        setShowTables(true);
      })
      .catch((error) => {
        erro("Erro", error.response.data.message);
        setLoading(false);
      });
  }

  const columnsProducts = [
    {
      title: "Cliente",
      dataIndex: "cliente.name",
      key: "cliente.name",
    },
    {
      title: "Forma Pagamento",
      dataIndex: "title",
      key: "title",
      width: "20%",
    },
    {
      title: "Pagamento",
      dataIndex: "datePay",
      key: "datePay",
      width: "10%",
      align: "center",
      render: (valor) => <span>{moment(valor).format("DD/MM/YYYY")}</span>,
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
      width: "10%",
      align: "center",
      render: (valor) => (
        <Statistic
          valueStyle={{ fontSize: 15.5 }}
          prefix="R$"
          precision={2}
          value={valor}
        />
      ),
    },
    {
      title: "Situação",
      dataIndex: "statusPay",
      key: "statusPay",
      render: (value) => (
        <>
          {value === "pay" && (
            <Button
              size="small"
              style={{
                width: "100%",
                backgroundColor: "#4caf50",
                color: "#fff",
                fontWeight: "bold",
              }}
              type="link"
            >
              Pago
            </Button>
          )}
          {value === "wait" && (
            <Button
              size="small"
              style={{
                width: "100%",
                backgroundColor: "#ffeb3b",
                color: "#444",
                fontWeight: "bold",
              }}
              type="link"
            >
              Em Aberto
            </Button>
          )}
        </>
      ),
      width: "11%",
    },
  ];

  const columnsServices = [
    {
      title: "Cliente",
      dataIndex: "cliente.name",
      key: "cliente.name",
    },
    {
      title: "Forma Pagamento",
      dataIndex: "title",
      key: "title",
      width: "20%",
    },
    {
      title: "Pagamento",
      dataIndex: "datePay",
      key: "datePay",
      width: "10%",
      align: "center",
      render: (valor) => <span>{moment(valor).format("DD/MM/YYYY")}</span>,
    },
    {
      title: "Produtos",
      dataIndex: "valueProducts",
      key: "valueProducts",
      width: "10%",
      align: "center",
      render: (valor) => (
        <Statistic
          valueStyle={{ fontSize: 15.5 }}
          prefix="R$"
          precision={2}
          value={valor}
        />
      ),
    },
    {
      title: "Serviços",
      dataIndex: "valueServices",
      key: "valueServices",
      width: "10%",
      align: "center",
      render: (valor) => (
        <Statistic
          valueStyle={{ fontSize: 15.5 }}
          prefix="R$"
          precision={2}
          value={valor}
        />
      ),
    },
    {
      title: "Valor Total",
      dataIndex: "value",
      key: "value",
      width: "10%",
      align: "center",
      render: (valor) => (
        <Statistic
          valueStyle={{ fontSize: 15.5 }}
          prefix="R$"
          precision={2}
          value={valor}
        />
      ),
    },
    {
      title: "Situação",
      dataIndex: "statusPay",
      key: "statusPay",
      render: (value) => (
        <>
          {value === "pay" && (
            <Button
              size="small"
              style={{
                width: "100%",
                backgroundColor: "#4caf50",
                color: "#fff",
                fontWeight: "bold",
              }}
              type="link"
            >
              Pago
            </Button>
          )}
          {value === "wait" && (
            <Button
              size="small"
              style={{
                width: "100%",
                backgroundColor: "#ffeb3b",
                color: "#444",
                fontWeight: "bold",
              }}
              type="link"
            >
              Em Aberto
            </Button>
          )}
        </>
      ),
      width: "11%",
    },
  ];

  const columnsReceitas = [
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      width: "25%",
    },
    {
      title: "Forma Pagamento",
      dataIndex: "payForm.name",
      key: "payForm.name",
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
      width: "10%",
      align: "center",
      render: (valor) => (
        <Statistic
          valueStyle={{ fontSize: 15.5 }}
          prefix="R$"
          precision={2}
          value={valor}
        />
      ),
    },
    {
      title: "Vencimento",
      dataIndex: "vencimento",
      key: "vencimento",
      width: "10%",
      align: "center",
      render: (valor) => <span>{moment(valor).format("DD/MM/YYYY")}</span>,
    },
    {
      title: "Situação",
      dataIndex: "statusPay",
      key: "statusPay",
      render: (value) => (
        <>
          {value === "pay" && (
            <Button
              size="small"
              style={{
                width: "100%",
                backgroundColor: "#4caf50",
                color: "#fff",
                fontWeight: "bold",
              }}
              type="link"
            >
              Pago
            </Button>
          )}
          {value === "wait" && (
            <Button
              size="small"
              style={{
                width: "100%",
                backgroundColor: "#ffeb3b",
                color: "#444",
                fontWeight: "bold",
              }}
              type="link"
            >
              Em Aberto
            </Button>
          )}
        </>
      ),
      width: "11%",
    },
  ];

  const DataAtual = new Date();
  const Ano = DataAtual.getFullYear();

  return (
    <div style={{ height: "100%" }}>
      <div style={{ marginTop: 15, overflow: "hidden" }}>
        <div
          style={{
            marginBottom: 10,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Card size="small">
            {typeAdvandcedFind === "" && (
              <p style={{ marginBottom: -3, marginTop: -1 }}>
                Data dos Dados: <strong>-</strong>
              </p>
            )}

            {typeAdvandcedFind === 1 && (
              <p style={{ marginBottom: -3, marginTop: -1 }}>
                Data dos Dados: <strong>Mês Atual</strong>
              </p>
            )}

            {typeAdvandcedFind === 2 && (
              <p style={{ marginBottom: -3, marginTop: -1 }}>
                Período dos Dados: <strong>{`${mes} de ${ano}`}</strong>
              </p>
            )}
          </Card>

          <Row>
            <Button
              icon="search"
              type="primary"
              onClick={() => setModalAdvancedFind(true)}
            >
              Busca Avançada
            </Button>
          </Row>
        </div>

        {showTables === true && (
          <>
            <Card
              size="small"
              style={{ backgroundColor: "#001529", marginBottom: 10 }}
              bordered={false}
            >
              <Row>
                <Icon
                  type="tags"
                  style={{ fontSize: 20, color: "#fff", marginRight: 15 }}
                />
                <span
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  VENDA DE PRODUTOS
                </span>
              </Row>
            </Card>

            <Table
              columns={columnsProducts}
              dataSource={produtos}
              size="small"
              rowKey={(line) => line._id}
            />

            <Card
              size="small"
              style={{
                backgroundColor: "#001529",
                marginBottom: 10,
                marginTop: 10,
              }}
              bordered={false}
            >
              <Row>
                <Icon
                  type="tool"
                  style={{ fontSize: 20, color: "#fff", marginRight: 15 }}
                />
                <span
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  PRESTAÇÃO DE SERVIÇOS
                </span>
              </Row>
            </Card>

            <Table
              columns={columnsServices}
              dataSource={servicos}
              size="small"
              rowKey={(line) => line._id}
            />

            <Card
              size="small"
              style={{
                backgroundColor: "#001529",
                marginBottom: 10,
                marginTop: 10,
              }}
              bordered={false}
            >
              <Row>
                <Icon
                  type="rise"
                  style={{ fontSize: 20, color: "#fff", marginRight: 15 }}
                />
                <span
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  RECEITAS DIVERSAS
                </span>
              </Row>
            </Card>

            <Table
              columns={columnsReceitas}
              dataSource={receitas}
              size="small"
              rowKey={(line) => line._id}
            />

            <Card
              size="small"
              style={{
                backgroundColor: "#001529",
                marginBottom: 10,
                marginTop: 10,
              }}
              bordered={false}
            >
              <Row>
                <Icon
                  type="fall"
                  style={{ fontSize: 20, color: "#fff", marginRight: 15 }}
                />
                <span
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  DESPESAS DIVERSAS
                </span>
              </Row>
            </Card>

            <Table
              columns={columnsReceitas}
              dataSource={despesas}
              size="small"
              rowKey={(line) => line._id}
            />

            <Card
              size="small"
              style={{
                backgroundColor: "#001529",
                marginBottom: 10,
                marginTop: 10,
              }}
              bordered={false}
            >
              <Row>
                <Icon
                  type="line-chart"
                  style={{ fontSize: 20, color: "#fff", marginRight: 15 }}
                />
                <span
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  RESUMO
                </span>
              </Row>
            </Card>

            <Descriptions bordered size="small">
              <Descriptions.Item span={1} label="Total de Venda de Produtos">
                <Statistic
                  value={valorProdutos}
                  precision={2}
                  prefix="R$"
                  valueStyle={{ fontSize: 15.5 }}
                />
              </Descriptions.Item>
              <Descriptions.Item
                span={1}
                label="Total de Prestação de Serviços"
              >
                <Statistic
                  value={valorServicos}
                  precision={2}
                  prefix="R$"
                  valueStyle={{ fontSize: 15.5 }}
                />
              </Descriptions.Item>
              <Descriptions.Item span={1} label="Total das Receitas Diversas">
                <Statistic
                  value={valorReceitas}
                  precision={2}
                  prefix="R$"
                  valueStyle={{ fontSize: 15.5 }}
                />
              </Descriptions.Item>
              <Descriptions.Item span={1} label="Total das Despesas Diversas">
                <Statistic
                  value={valorDespesas}
                  precision={2}
                  prefix="R$"
                  valueStyle={{ fontSize: 15.5 }}
                />
              </Descriptions.Item>
              <Descriptions.Item span={2} label="Saldo Atual">
                <Statistic
                  value={
                    valorProdutos +
                    valorServicos +
                    valorReceitas -
                    valorDespesas
                  }
                  precision={2}
                  prefix="R$"
                  valueStyle={{ fontSize: 15.5 }}
                />
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </div>

      <Modal
        title="Busca Avançada"
        visible={modalAdvancedFind}
        onCancel={() => setModalAdvancedFind(false)}
        footer={[
          <Button
            key="back"
            icon="close"
            type="danger"
            onClick={() => setModalAdvancedFind(false)}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            icon="search"
            type="primary"
            loading={loading}
            onClick={() => sendAdvancedFind()}
          >
            Buscar
          </Button>,
        ]}
      >
        <label>Selecione uma opção:</label>
        <Select
          value={typeAdvandcedFind}
          style={{ width: "100%" }}
          onChange={(value) => setTypeAdvancedFind(value)}
        >
          <Option value={1}>Mês Atual</Option>
          <Option value={2}>Por Período</Option>
        </Select>

        {typeAdvandcedFind === 2 && (
          <>
            <Divider style={{ fontSize: 15, fontWeight: "bold" }}>
              SELECIONE O PERÍODO
            </Divider>

            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Select
                value={mes}
                style={{ width: 150, marginRight: 10 }}
                onChange={(value) => setMes(value)}
              >
                <Option value="Janeiro">Janeiro</Option>
                <Option value="Fevereiro">Fevereiro</Option>
                <Option value="Março">Março</Option>
                <Option value="Abril">Abril</Option>
                <Option value="Maio">Maio</Option>
                <Option value="Junho">Junho</Option>
                <Option value="Julho">Julho</Option>
                <Option value="Agosto">Agosto</Option>
                <Option value="Setembro">Setembro</Option>
                <Option value="Outubro">Outubro</Option>
                <Option value="Novembro">Novembro</Option>
                <Option value="Dezembro">Dezembro</Option>
              </Select>

              <Select
                value={ano}
                style={{ width: 100 }}
                onChange={(value) => setAno(value)}
              >
                <Option value={Ano - 1}>{Ano - 1}</Option>
                <Option value={Ano}>{Ano}</Option>
                <Option value={Ano + 1}>{Ano + 1}</Option>
                <Option value={Ano + 2}>{Ano + 2}</Option>
                <Option value={Ano + 3}>{Ano + 3}</Option>
              </Select>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
