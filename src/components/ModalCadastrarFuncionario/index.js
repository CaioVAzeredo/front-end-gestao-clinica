import React, { useState } from "react";
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
    .form-row,
    .address-grid {
      display: block;
    }
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
    border: 1px solid #9e9e9e; /* Borda mais escura */
    font-size: 15px;
    background: #fff;
    transition: border-color 0.2s, box-shadow 0.2s;
    &:focus {
      border-color: #009688;
      box-shadow: 0 0 0 2px rgba(0, 150, 136, 0.2);
    }
  }

  textarea {
    resize: vertical;
    min-height: 70px;
    max-width: 100%;
  }

  .form-row {
    display: flex;
    gap: 16px;
    > div {
      flex: 1;
      min-width: 0;
    }
  }

  .address-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
  }
  
  .address-row {
    display: flex;
    gap: 16px;
    
    .cep-field, .cidade-field, .uf-field {
      flex: 1;
    }
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .number-field {
    max-width: 120px;
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

  .erro {
    color: #d32f2f;
    font-size: 12px;
    margin-top: -4px;
    margin-bottom: 4px;
    font-style: italic;
  }
`;

function ModalCadastrarFuncionario({ onClose, onSalvou }) {
  const [funcionario, setFuncionario] = useState({
    nome: "",
    telefone: "",
    email: "",
    cpf: "",
    perfil: "",
    senhaHash: "",
    dataNascimento: "",
    ativo: true,
    endereco: {
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
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFuncionario({ ...funcionario, [name]: value });
  };

  const handleEnderecoChange = (e) => {
    const { name, value } = e.target;
    setFuncionario((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, [name]: value }
    }));
  };

  const validar = () => {
    const novosErros = {};
    const cepSemFormatacao = funcionario.endereco.cep.replace(/\D/g, '');

    if (!funcionario.nome.trim()) novosErros.nome = "O nome é obrigatório.";
    if (!funcionario.telefone.replace(/\D/g, '').length) novosErros.telefone = "O telefone é obrigatório.";
    else if (funcionario.telefone.replace(/\D/g, '').length !== 11) novosErros.telefone = "O telefone deve ter 11 números.";
    if (!funcionario.email.trim()) novosErros.email = "O e-mail é obrigatório.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(funcionario.email)) novosErros.email = "E-mail inválido.";
    if (!funcionario.cpf.replace(/\D/g, '').length) novosErros.cpf = "O CPF é obrigatório.";
    else if (funcionario.cpf.replace(/\D/g, '').length !== 11) novosErros.cpf = "O CPF deve ter 11 números.";
    if (!funcionario.dataNascimento.trim()) novosErros.dataNascimento = "A data de nascimento é obrigatória.";
    if (!funcionario.perfil) novosErros.perfil = "O perfil é obrigatório.";
    if (!funcionario.senhaHash) novosErros.senhaHash = "A senha é obrigatória.";
    if (!funcionario.endereco.logradouro.trim()) novosErros.logradouro = "O logradouro é obrigatório.";
    if (!funcionario.endereco.numero) novosErros.numero = "O número é obrigatório.";
    if (!funcionario.endereco.cidade.trim()) novosErros.cidade = "A cidade é obrigatória.";
    if (!funcionario.endereco.uf) novosErros.uf = "O UF é obrigatório.";
    else if (!/^[A-Za-z]{2}$/.test(funcionario.endereco.uf)) novosErros.uf = "O UF deve ter exatamente 2 letras.";
    if (!cepSemFormatacao) novosErros.cep = "O CEP é obrigatório.";
    else if (cepSemFormatacao.length !== 8) novosErros.cep = "O CEP deve ter exatamente 8 números.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  async function salvarFuncionario(e) {
    e.preventDefault();
    if (!validar()) return;

    setSalvando(true);
    try {
      const dadosParaEnvio = {
        ...funcionario,
        ativo: Boolean(funcionario.ativo),
        dataNascimento: funcionario.dataNascimento
          ? new Date(funcionario.dataNascimento).toISOString()
          : null,
        endereco: {
          ...funcionario.endereco,
          cep: funcionario.endereco.cep.replace(/\D/g, '')
        }
      };
      
      const resp = await fetch(`http://localhost:${REACT_APP_PORT}/api/funcionarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaEnvio)
      });
      
      if (!resp.ok) {
        let errorMessage = `Erro HTTP ${resp.status}`;
        try {
          const errorData = await resp.json();
          errorMessage = errorData.message || errorData.title || JSON.stringify(errorData);
        } catch (e) {
          const text = await resp.text().catch(() => "");
          errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      alert("Funcionário cadastrado com sucesso!");
      if (typeof onSalvou === "function") onSalvou();
      handleClose();
    } catch (error) {
      console.error("Erro ao cadastrar funcionário", error);
      alert(`Erro ao cadastrar funcionário: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  }

  function handleClose() {
    setIsOpen(false);
    setTimeout(onClose, 400);
  }

  return (
    <ModalOverlay onClick={handleClose} isOpen={isOpen}>
      <ModalContent onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button type="button" className="close-button" onClick={handleClose} aria-label="Fechar modal">
          ×
        </button>
        <h2 id="modal-title">Cadastrar Funcionário</h2>

        <form onSubmit={salvarFuncionario}>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            name="nome"
            placeholder="Nome completo"
            value={funcionario.nome}
            onChange={handleChange}
          />
          {erros.nome && <div className="erro">{erros.nome}</div>}

          <div className="form-row">
            <div>
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                name="telefone"
                placeholder="11987654321"
                maxLength={11}
                value={funcionario.telefone}
                onChange={(e) =>
                  setFuncionario({ ...funcionario, telefone: e.target.value.replace(/\D/g, "") })
                }
              />
              {erros.telefone && <div className="erro">{erros.telefone}</div>}
            </div>
            <div>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="exemplo@email.com"
                value={funcionario.email}
                onChange={handleChange}
              />
              {erros.email && <div className="erro">{erros.email}</div>}
            </div>
          </div>

          <div className="form-row">
            <div>
              <label htmlFor="cpf">CPF</label>
              <input
                id="cpf"
                name="cpf"
                placeholder="12345678901"
                maxLength={11}
                value={funcionario.cpf}
                onChange={(e) =>
                  setFuncionario({ ...funcionario, cpf: e.target.value.replace(/\D/g, "") })
                }
              />
              {erros.cpf && <div className="erro">{erros.cpf}</div>}
            </div>
            <div>
              <label htmlFor="dataNascimento">Data de Nascimento</label>
              <input
                id="dataNascimento"
                name="dataNascimento"
                type="date"
                value={funcionario.dataNascimento}
                onChange={handleChange}
              />
              {erros.dataNascimento && <div className="erro">{erros.dataNascimento}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div>
              <label htmlFor="perfil">Perfil</label>
              <select
                id="perfil"
                name="perfil"
                value={funcionario.perfil}
                onChange={handleChange}
              >
                <option value="">Selecione um perfil</option>
                <option value="admin">Administrador</option>
                <option value="funcionario">Funcionário</option>
              </select>
              {erros.perfil && <div className="erro">{erros.perfil}</div>}
            </div>
            <div>
              <label htmlFor="senhaHash">Senha</label>
              <input
                id="senhaHash"
                name="senhaHash"
                type="password"
                placeholder="********"
                value={funcionario.senhaHash}
                onChange={handleChange}
              />
              {erros.senhaHash && <div className="erro">{erros.senhaHash}</div>}
            </div>
          </div>

          <label htmlFor="ativo">Status</label>
          <select
            id="ativo"
            name="ativo"
            value={String(funcionario.ativo)}
            onChange={(e) => setFuncionario({ ...funcionario, ativo: e.target.value === "true" })}
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>

          <h3>Endereço</h3>
          <div className="form-row">
            <div>
              <label htmlFor="logradouro">Logradouro</label>
              <input
                id="logradouro"
                name="logradouro"
                placeholder="Rua Exemplo"
                value={funcionario.endereco.logradouro}
                onChange={handleEnderecoChange}
              />
              {erros.logradouro && <div className="erro">{erros.logradouro}</div>}
            </div>
            <div className="number-field">
              <label htmlFor="numero">Número</label>
              <input
                id="numero"
                name="numero"
                placeholder="123"
                value={funcionario.endereco.numero}
                onChange={handleEnderecoChange}
              />
              {erros.numero && <div className="erro">{erros.numero}</div>}
            </div>
          </div>
          <label htmlFor="complemento">Complemento</label>
          <input
            id="complemento"
            name="complemento"
            placeholder="Apt 456 (opcional)"
            value={funcionario.endereco.complemento}
            onChange={handleEnderecoChange}
          />
          <div className="form-row">
            <div className="cep-field">
              <label htmlFor="cep">CEP</label>
              <input
                id="cep"
                name="cep"
                placeholder="12345678"
                maxLength={8}
                value={funcionario.endereco.cep}
                onChange={(e) =>
                  handleEnderecoChange({
                    target: { name: "cep", value: e.target.value.replace(/\D/g, "") }
                  })
                }
              />
              {erros.cep && <div className="erro">{erros.cep}</div>}
            </div>
            <div className="cidade-field">
              <label htmlFor="cidade">Cidade</label>
              <input
                id="cidade"
                name="cidade"
                placeholder="São Paulo"
                value={funcionario.endereco.cidade}
                onChange={handleEnderecoChange}
              />
              {erros.cidade && <div className="erro">{erros.cidade}</div>}
            </div>
            <div className="uf-field">
              <label htmlFor="uf">UF</label>
              <input
                id="uf"
                name="uf"
                placeholder="SP"
                maxLength={2}
                value={funcionario.endereco.uf}
                onChange={(e) =>
                  handleEnderecoChange({
                    target: { name: "uf", value: e.target.value.toUpperCase() }
                  })
                }
              />
              {erros.uf && <div className="erro">{erros.uf}</div>}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancelar" onClick={handleClose} disabled={salvando}>
              Cancelar
            </button>
            <button type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default ModalCadastrarFuncionario;