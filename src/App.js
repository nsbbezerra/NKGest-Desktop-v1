import React from "react";
import { LocaleProvider } from "antd";
import ptBr from "antd/es/locale-provider/pt_BR";
import "antd/dist/antd.css";
import Layout from "./layout/index";
import { MemoryRouter, Switch } from "react-router-dom";
import "./styles/style.css";

class App extends React.Component {
  render() {
    return (
      <MemoryRouter>
        <Switch>
          <LocaleProvider locale={ptBr}>
            <Layout />
          </LocaleProvider>
        </Switch>
      </MemoryRouter>
    );
  }
}

export default App;
