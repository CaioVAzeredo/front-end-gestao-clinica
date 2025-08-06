import { useState } from "react";
import styled from "styled-components";
import { FiMenu, FiHome, FiCalendar, FiUsers, FiActivity, FiBarChart2, FiSettings } from "react-icons/fi";
import Header from "../../components/Header";
import DashBoard from "../Dashboard";
import Agenda from "../Agenda";
import Clientes from "../Clientes";
import Servicos from "../Servicos";
import Relatorios from "../Relatorios";
import Configuracoes from "../Configuracoes";

const Layout = styled.div`
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;

  .sidebar {
    width: ${(props) => (props.collapsed ? "70px" : "240px")};
    background-color: #ffffff;
    box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    transition: width 0.3s ease;
  }

  .logo {
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
  }

  .hamburger {
    font-size: 24px;
    cursor: pointer;
    color: #009688;
    margin: 15px auto;
    display: block;
  }

  .menu {
    list-style: none;
    padding: 20px 0;
    margin: 0;
    flex: 1;
  }

  .menu li {
    margin-bottom: 10px;
  }

  .menu button {
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    padding: 12px 20px;
    font-size: 16px;
    color: #444;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: background 0.2s;
  }

  .menu button:hover,
  .menu button.ativo {
    background-color: #e6f7f4;
    color: #009688;
    font-weight: bold;
    border-left: 4px solid #009688;
  }

  .menu button span {
    display: ${(props) => (props.collapsed ? "none" : "inline")};
    transition: opacity 0.3s;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #f9f9f9;
  }

  .page-content {
    padding: 20px;
    flex: 1;
    overflow-y: auto;
  }
`;

function PaginaBase() {
  const [pagina, setPagina] = useState("dashboard");
  const [titulo, setTitulo] = useState("Dashboard");
  const [filtro, setFiltro] = useState("dashboard");
  const [icone, setIcone] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const paginas = {
    dashboard: <DashBoard setPagina={setPagina} setTitulo={setTitulo} />,
    agenda: <Agenda />,
    clientes: <Clientes />,
    servicos: <Servicos />,
    relatorios: <Relatorios />,
    configuracoes: <Configuracoes />,
  };

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { key: "agenda", label: "Agenda", icon: <FiCalendar /> },
    { key: "clientes", label: "Clientes", icon: <FiUsers /> },
    { key: "servicos", label: "Serviços", icon: <FiActivity /> },
    { key: "relatorios", label: "Relatórios", icon: <FiBarChart2 /> },
    { key: "configuracoes", label: "Configurações", icon: <FiSettings /> },
  ];

  return (
    <Layout collapsed={collapsed}>
      <aside className="sidebar">
        <div className="logo">
          <FiMenu className="hamburger" onClick={() => setCollapsed(!collapsed)} />
        </div>

        <ul className="menu">
          {menuItems.map((item) => (
            <li key={item.key}>
              <button
                className={pagina === item.key ? "ativo" : ""}
                onClick={() => {
                  setPagina(item.key);
                  setTitulo(item.label);
                  setFiltro(item.key);
                  setIcone(item.key);
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="content">
        <Header
          titulo={titulo}
          setPagina={setPagina}
          setTitulo={setTitulo}
          setFiltro={setFiltro}
          setIcone={setIcone}
        />
        <div className="page-content">{paginas[pagina]}</div>
      </div>
    </Layout>
  );
}


export default PaginaBase;
