import styled from 'styled-components';

// Container principal do formulário
const FormContainer = styled.form`
  background-color: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
  margin: 0 auto;

  h1 {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  h2 {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  p {
    color: #555;
    margin-bottom: 1.5rem;
  }

  a {
    color: #000;
    font-weight: bold;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

// Estilo para o botão "voltar"
const BotaoVoltar = styled.div`
  margin-left: 0;
  text-align: left;
  display: block;
  font-size: large;
  font-weight: bold;
  margin-bottom: 1.8rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

// Container dos botões (voltar e fechar)
const DivBotao = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

// Botão de fechar (X)
const BtnX = styled.div`
  width: 35px;
  background-color: #b6b4b4;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  font-weight: bold;
  color: #fff;

  &:hover {
    background-color: #adabab;
  }
`;

function Formulario({
  titulo,
  onSubmit,
  children,
  botaoVoltar = false,
  botaoFecharModal = false,
  url = null,
  estadoModal,
}) {
  const submeter = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const btnVoltar = () => {
    if (url) window.location.href = url;
  };

  console.log(botaoFecharModal);

  return (
    <FormContainer onSubmit={submeter}>
      <DivBotao>
        <div></div>
        {botaoFecharModal && <BtnX onClick={estadoModal}>x</BtnX>}
      </DivBotao>

      {botaoVoltar && <BotaoVoltar onClick={btnVoltar}>← voltar</BotaoVoltar>}

      <h1>{titulo}</h1>
      {children}
    </FormContainer>
  );
}

export default Formulario;