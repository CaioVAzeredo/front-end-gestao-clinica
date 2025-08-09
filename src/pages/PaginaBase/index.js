import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiActivity,
  FiBarChart2,
  FiSettings,
  FiBriefcase,
} from "react-icons/fi";
import Header from "../../components/Header";
import DashBoard from "../Dashboard";
import Agenda from "../Agenda";
import Clientes from "../Clientes";
import Servicos from "../Servicos";
import Relatorios from "../Relatorios";
import Configuracoes from "../Configuracoes";
import Funcionarios from "../Funcionarios";
import Footer from "../../components/Footer";

const Layout = styled.div`
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
  flex-direction: column;
  position: relative; /* para ancorar o badge */
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

/* === Badge do usuário (topo direito) === */
const UserBadge = styled.div`
  position: fixed;
  top: 12px;
  right: 16px;
  z-index: 1101;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border-radius: 999px;
  padding: 6px 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
  cursor: pointer; /* para indicar que é clicável */

  &:hover {
    background: #f0f0f0;
  }

  @media (max-width: 768px) {
display: none;
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: #009688;
  color: #fff;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  flex-shrink: 0;
`;

const UserText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.1;

  .name {
    font-size: 14px;
    color: #333;
    font-weight: 700;
    max-width: 180px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .status {
    margin-top: 2px;
    font-size: 12px;
    color: #28a745;
    display: inline-flex;
    align-items: center;
    gap: 6px;

    &::before {
      content: "";
      width: 8px;
      height: 8px;
      background: #28a745;
      border-radius: 50%;
      display: inline-block;
    }
  }
`;

/* ================================ */

function PaginaBase() {
  const [pagina, setPagina] = useState("dashboard");
  const [titulo, setTitulo] = useState("Dashboard");
  const [filtro, setFiltro] = useState("dashboard");
  const [icone, setIcone] = useState("dashboard");
  const perfil = localStorage.getItem("perfil");
  const [collapsed, setCollapsed] = useState(false);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [token, setToken] = useState(null);

  const nomeUsuario =
    localStorage.getItem("nome") ||
    localStorage.getItem("usuarioNome") ||
    "Usuário";

  const getInitials = (nome) => {
    if (!nome || typeof nome !== "string") return "U";
    const parts = nome.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || "";
    const second = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + second).toUpperCase() || "U";
  };

  const iniciais = getInitials(nomeUsuario);

  useEffect(() => {
    const tokenSalvo = localStorage.getItem("authToken");
    if (tokenSalvo) setToken(tokenSalvo);
  }, []);

  const paginas = {
    dashboard: <DashBoard setPagina={setPagina} setTitulo={setTitulo} />,
    agenda: <Agenda />,
    clientes: <Clientes />,
    Funcionarios: <Funcionarios />,
    servicos: <Servicos />,
    relatorios: <Relatorios />,
    configuracoes: <Configuracoes />,
  };

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { key: "agenda", label: "Agenda", icon: <FiCalendar /> },
    { key: "clientes", label: "Clientes", icon: <FiUsers /> },
    ...(perfil === "admin"
      ? [{ key: "Funcionarios", label: "Funcionários", icon: <FiBriefcase /> }]
      : []),
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
    setShowSidebarMobile(false);
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

      {/* Badge do Usuário */}
      <UserBadge
        onClick={() => {
          setPagina("configuracoes");
          setTitulo("Configurações");
          setFiltro("configuracoes");
        }}
      >
        <Avatar>{iniciais}</Avatar>
        <UserText>
          <span className="name">{nomeUsuario}</span>
          <span className="status">online</span>
        </UserText>
      </UserBadge>

      <Main>
        <Overlay visible={showSidebarMobile} onClick={() => setShowSidebarMobile(false)} />
        <Sidebar collapsed={collapsed} visible={showSidebarMobile}>
          <Menu>
            {menuItems.map((item) => (
              <MenuItem key={item.key} collapsed={collapsed} mobileOpen={showSidebarMobile}>
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
      <Footer />
    </Layout>
  );
}

export default PaginaBase;