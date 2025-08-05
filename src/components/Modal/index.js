import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Campo from '../Campo';
import Formulario from '../Formulario';
import Button from '../Button';

// Animação de entrada
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Fundo escuro do modal (overlay)
const ModalOverlay = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

// Estilizando o formulário dentro do modal
// Vamos sobrescrever estilos do Formulario apenas quando estiver dentro do modal
const ModalForm = styled(Formulario)`
  && {
    background-color: ${(props) => (props.theme === 'escuro' ? '#1b1b1b' : '#fff')};
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    border-radius: 1rem;
    animation: ${fadeIn} 0.3s ease-in-out;

    .divBotao .btnX {
      background-color: ${(props) => (props.theme === 'escuro' ? 'white' : '#b6b4b4')};
      color: ${(props) => (props.theme === 'escuro' ? 'black' : 'white')};
    }

    .campo input {
      background-color: ${(props) => (props.theme === 'escuro' ? '#dddcdc' : 'white')};
    }

    h1 {
      color: ${(props) => (props.theme === 'escuro' ? '#fff' : '#000')};
    }

    a, p, label {
      color: ${(props) => (props.theme === 'escuro' ? '#ddd' : '#555')};
    }
  }
`;

function Modal({ setUsuario, estadoModal, Nome, Email }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  // Detecta se o modo escuro está ativo (baseado na classe do body ou localStorage)
  const [tema, setTema] = useState('claro');

  useEffect(() => {
    setNome(Nome);
    setEmail(Email);
  }, [Nome, Email]);

  // Verifica se o body tem a classe "escuro" (ou pode vir de um contexto/state global)
  useEffect(() => {
    const html = document.documentElement;
    const observer = new MutationObserver(() => {
      setTema(html.classList.contains('escuro') ? 'escuro' : 'claro');
    });

    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const atualizarUsuario = async (credenciais) => {
    const { nome, email } = credenciais;
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch('http://localhost:3000/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: nome,
          email: email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Usuário atualizado!!');
        setUsuario(data);
        estadoModal();
      } else {
        alert('Erro ao atualizar: ' + data.message);
      }
    } catch (erro) {
      console.error('Erro ao atualizar usuário:', erro);
      alert('Erro na conexão.');
    }
  };

  return (
    <ModalOverlay onClick={estadoModal}>
      <div onClick={(e) => e.stopPropagation()}>
        {/* Impede que o clique dentro do formulário feche o modal */}
        <ModalForm
          theme={tema}
          onSubmit={() => atualizarUsuario({ nome, email })}
          titulo="Atualizar usuário"
          estadoModal={estadoModal}
          botaoFecharModal={true}
        >
          <Campo
            placeholder="Nome"
            type="text"
            valor={nome}
            onChange={(valor) => setNome(valor)}
          />
          <Campo
            placeholder="E-mail"
            type="email"
            valor={email}
            onChange={(valor) => setEmail(valor)}
          />
          <Button info="Atualizar" />
        </ModalForm>
      </div>
    </ModalOverlay>
  );
}

export default Modal;