import React, { useState, useEffect } from "react";
import "./style.css";
import { Radio, Button, Divider, Modal } from "antd";
import Matri from "../assets/print.svg";
import Norm from "../assets/printer.svg";
import api from "../config/axios";

function PrintSaleTemplate({ id }) {
  const [modePrint, setModePrint] = useState("");

  async function findPrintMode() {
    const printMode = await localStorage.getItem("print");
    if (printMode) {
      await setModePrint(printMode);
    } else {
      return;
    }
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

  useEffect(() => {
    findPrintMode();
  }, []);

  async function print() {
    if (modePrint === "") {
      erro("Warning", "Selecione um modo de impressão");
      return false;
    }
    await api
      .post("/printer/sale", {
        id: id,
        mode: modePrint,
      })
      .then((response) => {
        handlePrint(response.data.link);
      })
      .catch((error) => {
        if (!error.response.data) {
          erro("Erro", error.response);
        } else {
          erro("Erro", error.response.data.message);
        }
      });
  }

  function handlePrint(url) {
    window.open(
      url,
      "pdfSale",
      `height=${window.screen.height}, width=${window.screen.width}`
    );
  }

  return (
    <div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <Radio.Group
          onChange={(e) => setModePrint(e.target.value)}
          value={modePrint}
        >
          <Radio.Button value="matricial" style={{ height: 100 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <img src={Matri} style={{ width: 70, height: 70 }} />
              Matricial
            </div>
          </Radio.Button>
          <Radio.Button value="normal" style={{ height: 100 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <img src={Norm} style={{ width: 70, height: 70 }} />
              Normal
            </div>
          </Radio.Button>
        </Radio.Group>
      </div>
      <Divider />
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: -3,
        }}
      >
        <Button
          type="primary"
          icon="printer"
          onClick={() => {
            print();
          }}
        >
          Imprimir
        </Button>
      </div>
    </div>
  );
}

export default PrintSaleTemplate;
