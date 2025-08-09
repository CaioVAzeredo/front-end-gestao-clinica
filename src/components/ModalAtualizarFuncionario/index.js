// src/components/ModalAtualizarFuncionario.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
const REACT_APP_PORT = process.env.REACT_APP_PORT;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 10px;
  transition: opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
`;

const ModalContent = styled.div`
  background: linear-gradient(145deg, #ffffff, #f9f9f9);
  padding: 24px;
  border-radius: 16px;
  width: 40vw;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1);
  position: relative;
  animation: fadeInScale 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  @keyframes fadeInScale {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    padding: 16px;
    max-width: 95%;
  }

  h2, h3 {
    margin-bottom: 12px;
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    color: #00796b;
  }

  .close-button {
    position: absolute;
    top: 12px;
    right: 12px;
    background: transparent;
    border: none;
    font-size: 26px;
    cursor: pointer;
    color: #757575;
    transition: color 0.2s, transform 0.2s;
    &:hover {
      color: #424242;
      transform: scale(1.1);
    }
  }

  label {
    display: block;
    font-size: 13px;
    margin-bottom: 4px;
    margin-top: 8px;
    font-weight: bold; /* Títulos dos campos em negrito */
    color: #424242;
  }

  input,
  select,
  textarea {
    width: 100%;
    max-width: 100%;
    padding: 10px 12px;
    margin-bottom: 6px;
    border-radius: 8px;
    border: 1px solid #9e9e9e;
    font-size: 15px;
    background: #fff;
    transition: border-color 0.2s, box-shadow 0.2s;
    &:focus {
      border-color: #009688;
      box-shadow: 0 0 0 2px rgba(0, 150, 136, 0.2);
    }
  }

  .form-row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;

    > div {
      flex: 1;
      min-width: 0;
    }

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .number-field {
    max-width: 120px;
  }

  .erro {
    color: #d32f2f;
    font-size: 12px;
    margin-top: -4px;
    margin-bottom: 4px;
    font-style: italic;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    transition: background 0.2s, transform 0.1s;
    &:active {
      transform: scale(0.98);
    }
  }

  button.cancelar {
    background: #e0e0e0;
    color: #424242;
    &:hover {
      background: #bdbdbd;
    }
  }

  button[type="submit"] {
    background: #009688;
    color: #fff;
    &:hover {
      background: #00796b;
    }
    &:disabled {
      background: #80cbc4;
      cursor: not-allowed;
    }
  }
`;

function ModalAtualizarFuncionario({ onClose, funcionario: funcionarioProp, onSalvou }) {
  const [funcionario, setFuncionario] = useState({
    idFuncionario: null,
    senhaHash: "",
    perfil: "funcionario",
    ativo: true,
    nome: "",
    telefone: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    enderecoId: null,
    endereco: {
      idEndereco: null,
      logradouro: "",
      numero: "",
      complemento: "",
      cidade: "",
      uf: "",
      cep: ""
    }
  });

  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (funcionarioProp) {
      setFuncionario({
        idFuncionario: funcionarioProp.idFuncionario ?? null,
        senhaHash: funcionarioProp.senhaHash ?? "",
        perfil: funcionarioProp.perfil ?? "funcionario",
        ativo: funcionarioProp.ativo ?? true,
        nome: funcionarioProp.nome ?? "",
        telefone: funcionarioProp.telefone ?? "",
        email: funcionarioProp.email ?? "",
        cpf: funcionarioProp.cpf ?? "",
        dataNascimento: funcionarioProp.dataNascimento
          ? funcionarioProp.dataNascimento.split("T")[0]
          : "",
        enderecoId: funcionarioProp.enderecoId ?? null,
        endereco: {
          idEndereco: funcionarioProp.endereco?.idEndereco ?? null,
          logradouro: funcionarioProp.endereco?.logradouro ?? "",
          numero: funcionarioProp.endereco?.numero ?? "",
          complemento: funcionarioProp.endereco?.complemento ?? "",
          cidade: funcionarioProp.endereco?.cidade ?? "",
          uf: funcionarioProp.endereco?.uf ?? "",
          cep: funcionario.endereco?.cep ?? ""
        }
      });
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [funcionarioProp]);

  if (!funcionarioProp) {
    return null;
  }

  function validar() {
    const novosErros = {};
    if (!funcionario.nome?.trim()) novosErros.nome = "O nome é obrigatório.";
    if (!funcionario.senhaHash?.trim()) novosErros.senhaHash = "A senha é obrigatória.";
    if (!funcionario.email?.trim()) novosErros.email = "O e-mail é obrigatório.";
    if (!funcionario.cpf?.trim()) novosErros.cpf = "O CPF é obrigatório.";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function atualizarFuncionario(e) {
    e.preventDefault();
    if (!validar()) return;

    setSalvando(true);
    try {
      const id = funcionario.idFuncionario;
      if (!id) {
        alert("ID do funcionário não informado.");
        setSalvando(false);
        return;
      }

      const payload = {
        ...funcionario,
        senhaHash: funcionario.senhaHash.trim(),
      };

      const resp = await fetch(`http://localhost:${REACT_APP_PORT}/api/funcionarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        throw new Error(txt || `Erro HTTP ${resp.status}`);
      }

      alert("Funcionário atualizado com sucesso!");
      onSalvou?.();
      handleClose();
    } catch (error) {
      alert(`Erro ao atualizar funcionário: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  }

  function handleEnderecoChange(e) {
    const { name, value } = e.target;
    setFuncionario(prev => ({
      ...prev,
      endereco: { ...prev.endereco, [name]: value }
    }));
  }

  function handleClose() {
    setIsOpen(false);
    setTimeout(onClose, 400);
  }

  const handleFuncionarioChange = (e) => {
    const { name, value } = e.target;
    setFuncionario(prev => ({ ...prev, [name]: value }));
  };

  return (
    <ModalOverlay onMouseDown={(e) => e.target === e.currentTarget && !salvando && handleClose()} isOpen={isOpen}>
      <ModalContent onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button type="button" className="close-button" onClick={handleClose} disabled={salvando}>×</button>
        <h2 id="modal-title">Atualizar Funcionário</h2>

        <form onSubmit={atualizarFuncionario}>
          <div className="form-row">
            <div>
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                name="nome"
                value={funcionario.nome}
                onChange={handleFuncionarioChange}
              />
              {erros.nome && <div className="erro">{erros.nome}</div>}
            </div>
            <div>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                value={funcionario.email}
                onChange={handleFuncionarioChange}
              />
              {erros.email && <div className="erro">{erros.email}</div>}
            </div>
          </div>

          <div className="form-row">
            <div>
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                name="telefone"
                value={funcionario.telefone}
                onChange={handleFuncionarioChange}
              />
            </div>
            <div>
              <label htmlFor="cpf">CPF</label>
              <input
                id="cpf"
                name="cpf"
                value={funcionario.cpf}
                onChange={handleFuncionarioChange}
              />
              {erros.cpf && <div className="erro">{erros.cpf}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div>
              <label htmlFor="dataNascimento">Data de Nascimento</label>
              <input
                id="dataNascimento"
                name="dataNascimento"
                type="date"
                value={funcionario.dataNascimento}
                onChange={handleFuncionarioChange}
              />
            </div>
            <div>
              <label htmlFor="senhaHash">Senha</label>
              <input
                id="senhaHash"
                name="senhaHash"
                type="password"
                value={funcionario.senhaHash}
                onChange={handleFuncionarioChange}
              />
              {erros.senhaHash && <div className="erro">{erros.senhaHash}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div>
              <label htmlFor="perfil">Perfil</label>
              <select
                id="perfil"
                name="perfil"
                value={funcionario.perfil}
                onChange={handleFuncionarioChange}
              >
                <option value="admin">Administrador</option>
                <option value="funcionario">Funcionário</option>
              </select>
            </div>
            <div>
              <label htmlFor="ativo">Status</label>
              <select
                id="ativo"
                name="ativo"
                value={String(funcionario.ativo)}
                onChange={handleFuncionarioChange}
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
          </div>

          <h3>Endereço</h3>
          <div className="form-row">
            <div>
              <label htmlFor="logradouro">Logradouro</label>
              <input
                id="logradouro"
                name="logradouro"
                value={funcionario.endereco.logradouro}
                onChange={handleEnderecoChange}
              />
            </div>
            <div className="number-field">
              <label htmlFor="numero">Número</label>
              <input
                id="numero"
                name="numero"
                value={funcionario.endereco.numero}
                onChange={handleEnderecoChange}
              />
            </div>
          </div>
          
          <label htmlFor="complemento">Complemento</label>
          <input
            id="complemento"
            name="complemento"
            value={funcionario.endereco.complemento}
            onChange={handleEnderecoChange}
          />
          
          <div className="form-row">
            <div>
              <label htmlFor="cep">CEP</label>
              <input
                id="cep"
                name="cep"
                value={funcionario.endereco.cep}
                onChange={handleEnderecoChange}
              />
            </div>
            <div>
              <label htmlFor="cidade">Cidade</label>
              <input
                id="cidade"
                name="cidade"
                value={funcionario.endereco.cidade}
                onChange={handleEnderecoChange}
              />
            </div>
            <div style={{ maxWidth: '80px' }}>
              <label htmlFor="uf">UF</label>
              <input
                id="uf"
                name="uf"
                value={funcionario.endereco.uf}
                onChange={handleEnderecoChange}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancelar" onClick={handleClose} disabled={salvando}>
              Cancelar
            </button>
            <button type="submit" disabled={salvando}>
              {salvando ? "Atualizando..." : "Atualizar"}
            </button>
          </div>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default ModalAtualizarFuncionario;