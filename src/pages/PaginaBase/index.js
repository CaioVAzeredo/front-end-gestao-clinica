import { useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import DashBoard from "../Dashboard";
import Agenda from "../Agenda";
import Clientes from "../Clientes";
import Servicos from "../Servicos";
import Relatorios from "../Relatorios";
import Configuracoes from "../Configuracoes";
import img from "../../assets/imagens/logo.png";

const PagBase = styled.section`
  display: flex;

  .menu-lateral {
    height: 100vh;
    width: 20vw;
  }

  .menu-lateral ul {
    padding: 20px;
    border-top: 1px solid black;
    list-style: none;
  }

  .menu-lateral h2 {
    padding-left: 20px;
    margin-bottom: 22px;
  }

  .minhas-tarefas {
    width: 100vw;
    border-left: 1px solid black;
  }

  .filtro-menu-lateral {
    background: none;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
    font-weight: bold;
    color: #888;
    border-bottom: 2px solid transparent;
    transition: 0.3s;
    display: block;
    width: 100%;
    text-align: left;
  }

  .filtro-menu-lateral:hover {
    color: #000;
  }

  .filtro-menu-lateral.ativo {
    color: #000;
    background-color: #f0f0f0;
    border-radius: 5px;
  }

  h2 {
    margin-left: 16px;
  }

  h2 img {
    width: 200px;
    margin-left: 15px;
    margin-bottom: -20px;
  }

  h1 {
    font-size: 35px;
  }
`;

function PaginaBase() {
  const [filtro, setFiltro] = useState("dashboard");
  const [pagina, setPagina] = useState("dashboard");
  const [titulo, setTitulo] = useState("Dashboard");

  const paginas = {
    dashboard: <DashBoard setPagina={setPagina} setTitulo={setTitulo} setFiltro={setFiltro} />,
    clientes: <Clientes />,
    agenda: <Agenda />,
    servicos: <Servicos />,
    relatorios: <Relatorios />,
    configuracoes: <Configuracoes />,
  };

  const menuItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "agenda", label: "Agenda" },
    { key: "clientes", label: "Clientes" },
    { key: "servicos", label: "Serviços" },
    { key: "relatorios", label: "Relatórios" },
    { key: "configuracoes", label: "Configurações" },
  ];

  return (
    <PagBase>
      <section className="menu-lateral">
        <h2>
          <img src={img} alt="logo" />
        </h2>
        <ul>
          {menuItems.map((item) => (
            <li key={item.key}>
              <button
                className={`filtro-menu-lateral ${filtro === item.key ? "ativo" : ""}`}
                onClick={() => {
                  setTitulo(item.label);
                  setFiltro(item.key);
                  setPagina(item.key);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </section>
      <div className="minhas-tarefas">
        <main>
          <Header titulo={titulo} setPagina={setPagina} setTitulo={setTitulo} setFiltro={setFiltro} />
          {paginas[pagina]}
        </main>
      </div>
    </PagBase>
  );
}

export default PaginaBase;
