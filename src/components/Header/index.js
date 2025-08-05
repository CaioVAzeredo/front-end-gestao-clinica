import styled from "styled-components";

const HeaderContainer = styled.div`
padding: 20px;`
function Header({ titulo, setPagina, setTitulo, setFiltro, setIcone }) {


  function paginaPerfil() {
    setPagina("perfil");
    setTitulo("Perfil");
    setFiltro("perfil");
    setIcone("perfil");
  }

  return (
    <HeaderContainer>
      <h2>Gerenciador de {titulo}</h2>
      <div>
        <img className='foto' onClick={paginaPerfil} />
      </div>
    </HeaderContainer>
  );
}

export default Header;
