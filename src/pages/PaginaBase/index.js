import { useState } from "react";
import styled from "styled-components";
import { FiHome, FiCalendar, FiUsers, FiActivity, FiBarChart2, FiSettings } from "react-icons/fi";
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
  flex-direction: column;
`;

const Main = styled.div`
  display: flex;
  flex: 1;
  position: relative;
`;

const Sidebar = styled.aside`
  width: ${(props) => (props.collapsed ? "70px" : "240px")};
  background-color: #ffffff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    transform: ${(props) => (props.visible ? "translateX(0)" : "translateX(-100%)")};
    transition: transform 0.3s ease;
    z-index: 1000;
    width: 240px;
  }
`;

const Overlay = styled.div`
  @media (max-width: 768px) {
    display: ${(props) => (props.visible ? "block" : "none")};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999;
  }
`;

const Menu = styled.ul`
  list-style: none;
  padding: 20px 0;
  margin: 0;
  flex: 1;
`;

const MenuItem = styled.li`
  margin-bottom: 10px;

  button {
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

    &:hover,
    &.ativo {
      background-color: #e6f7f4;
      color: #009688;
      font-weight: bold;
      border-left: 4px solid #009688;
    }

    span {
      display: ${({ collapsed, mobileOpen }) =>
        collapsed && !mobileOpen ? "none" : "inline"};
      transition: opacity 0.3s;
    }
  }
`;


const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
`;

const PageContent = styled.div`
  padding: 20px;
  flex: 1;
  overflow-y: auto;
`;

function PaginaBase() {
  const [pagina, setPagina] = useState("dashboard");
  const [titulo, setTitulo] = useState("Dashboard");
  const [filtro, setFiltro] = useState("dashboard");
  const [icone, setIcone] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);

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

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setShowSidebarMobile(!showSidebarMobile);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleChangePage = (item) => {
    setPagina(item.key);
    setTitulo(item.label);
    setFiltro(item.key);
    setIcone(item.key);
    setShowSidebarMobile(false); // fecha menu no mobile
  };

  return (
    <Layout>
      <Header
        titulo={titulo}
        setPagina={setPagina}
        setTitulo={setTitulo}
        setFiltro={setFiltro}
        setIcone={setIcone}
        toggleSidebar={handleToggleSidebar}
      />

      <Main>
        <Overlay visible={showSidebarMobile} onClick={() => setShowSidebarMobile(false)} />
        <Sidebar collapsed={collapsed} visible={showSidebarMobile}>
          <Menu>
            {menuItems.map((item) => (
              <MenuItem
  key={item.key}
  collapsed={collapsed}
  mobileOpen={showSidebarMobile} // novo
>
  <button
    className={pagina === item.key ? "ativo" : ""}
    onClick={() => handleChangePage(item)}
  >
    {item.icon}
    <span>{item.label}</span>
  </button>
</MenuItem>

            ))}
          </Menu>
        </Sidebar>

        <Content>
          <PageContent>{paginas[pagina]}</PageContent>
        </Content>
      </Main>
    </Layout>
  );
}

export default PaginaBase;
