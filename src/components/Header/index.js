import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FiSidebar } from "react-icons/fi";

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px;
  background: #fff;
  border-bottom: 1px solid #eee;
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  .menu-toggle {
    cursor: pointer;
    font-size: 24px;
    color: #009688;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 10px;

  &:hover {
    opacity: 0.8;
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #009688;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
  display: none;
  }
`;

const UserName = styled.span`
  font-size: 14px;
  font-weight: bold;
`;

const UserStatus = styled.span`
  font-size: 12px;
  color: ${props => (props.online ? 'green' : 'red')};
`;

function Header({ titulo, setPagina, setTitulo, setFiltro, setIcone, toggleSidebar }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function fetchUsuario() {
      try {
        const response = await axios.get('http://localhost:5239/api/funcionarios');
        const data = response.data.$values[0];
        setUsuario(data);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    }
    fetchUsuario();
  }, []);

  function irConfiguracoes() {
    setPagina('configuracoes');
    setTitulo('Configurações');
    setFiltro('configuracoes');
    setIcone('configuracoes');
  }

  const getInitials = (nome) => {
    if (!nome) return '';
    const partes = nome.split(' ');
    const iniciais = partes.map((parte) => parte[0]).join('');
    return iniciais.substring(0, 2).toUpperCase();
  };

  return (
    <HeaderContainer>
      <TitleSection>
        <FiSidebar className="menu-toggle" onClick={toggleSidebar} />
        <Title>Gerenciador de {titulo}</Title>
      </TitleSection>

      <HeaderRight>
        {usuario && (
          <UserInfo onClick={irConfiguracoes}>
            <Avatar>{getInitials(usuario.nome)}</Avatar>
            <UserDetails>
              <UserName>{usuario.nome}</UserName>
              <UserStatus online={usuario.ativo}>
                {usuario.ativo ? 'Online' : 'Offline'}
              </UserStatus>
            </UserDetails>
          </UserInfo>
        )}
      </HeaderRight>
    </HeaderContainer>
  );
}

export default Header;
