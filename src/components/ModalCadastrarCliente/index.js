import React, { useState } from "react";
import styled from "styled-components";
const REACT_APP_PORT = process.env.REACT_APP_PORT;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 650px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;

  h2 {
    margin-bottom: 20px;
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #444;
  }

  label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
    margin-top: 10px;
  }

  input,
  select {
    width: 100%;
    padding: 8px;
    margin-bottom: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  textarea {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    resize: vertical;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }

  button.cancelar {
    background: #aaa;
  }

  button {
    background: #009688;
    color: #fff;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .erro {
    color: red;
    font-size: 12px;
    margin-top: -4px;
    margin-bottom: 6px;
  }
`;

function ModalCadastrarCliente({ onClose, onSalvou }) {
  const [cliente, setCliente] = useState({
    nome: "",
    telefone: "",
    email: "",
    cpf: "",
    observacoes: "",
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

  function validar() {
    const novosErros = {};

    // Nome obrigatório
    if (!cliente.nome.trim()) {
      novosErros.nome = "O nome é obrigatório.";
    }

    // Telefone - exatamente 11 dígitos
    if (!cliente.telefone) {
      novosErros.telefone = "O telefone é obrigatório.";
    } else if (cliente.telefone.length !== 11) {
      novosErros.telefone = "O telefone deve ter exatamente 11 números.";
    }

    // E-mail válido
    if (!cliente.email.trim()) {
      novosErros.email = "O e-mail é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email)) {
      novosErros.email = "E-mail inválido.";
    }

    // CPF - exatamente 11 dígitos
    if (!cliente.cpf) {
      novosErros.cpf = "O CPF é obrigatório.";
    } else if (cliente.cpf.length !== 11) {
      novosErros.cpf = "O CPF deve ter exatamente 11 números.";
    }

    // Logradouro obrigatório
    if (!cliente.endereco.logradouro.trim()) {
      novosErros.logradouro = "O logradouro é obrigatório.";
    }

    // Número - exatamente 2 caracteres
    if (!cliente.endereco.numero) {
      novosErros.numero = "O número é obrigatório.";
    }

    // Cidade obrigatória
    if (!cliente.endereco.cidade.trim()) {
      novosErros.cidade = "A cidade é obrigatória.";
    }

    // UF - exatamente 2 letras
    if (!cliente.endereco.uf) {
      novosErros.uf = "O UF é obrigatório.";
    } else if (!/^[A-Za-z]{2}$/.test(cliente.endereco.uf)) {
      novosErros.uf = "O UF deve ter exatamente 2 letras.";
    }

    // CEP - exatamente 8 números
    if (!cliente.endereco.cep) {
      novosErros.cep = "O CEP é obrigatório.";
    } else if (!/^\d{8}$/.test(cliente.endereco.cep)) {
      novosErros.cep = "O CEP deve ter exatamente 8 números.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function salvarCliente(e) {
    e.preventDefault();
    if (!validar()) return;

    setSalvando(true);
    try {
      const resp = await fetch(`http://localhost:${REACT_APP_PORT}/api/clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente)
      });
      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        throw new Error(txt || `Erro HTTP ${resp.status}`);
      }
      alert("Cliente cadastrado com sucesso!");
      if (typeof onSalvou === "function") onSalvou();
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar cliente", error);
      alert("Erro ao cadastrar cliente!");
    } finally {
      setSalvando(false);
    }
  }

  function handleEnderecoChange(e) {
    const { name, value } = e.target;
    setCliente((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, [name]: value }
    }));
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <button type="button" className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Cadastrar Cliente</h2>

        <form onSubmit={salvarCliente}>
          <label>Nome</label>
          <input
            value={cliente.nome}
            onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
          />
          {erros.nome && <div className="erro">{erros.nome}</div>}

          <label>Telefone</label>
          <input
            value={cliente.telefone}
            maxLength={11}
            onChange={(e) =>
              setCliente({ ...cliente, telefone: e.target.value.replace(/\D/g, "") })
            }
          />
          {erros.telefone && <div className="erro">{erros.telefone}</div>}

          <label>E-mail</label>
          <input
            type="email"
            value={cliente.email}
            onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
          />
          {erros.email && <div className="erro">{erros.email}</div>}

          <label>CPF</label>
          <input
            value={cliente.cpf}
            maxLength={11}
            onChange={(e) =>
              setCliente({ ...cliente, cpf: e.target.value.replace(/\D/g, "") })
            }
          />
          {erros.cpf && <div className="erro">{erros.cpf}</div>}

          <label>Observações</label>
          <textarea
            rows="3"
            value={cliente.observacoes}
            onChange={(e) => setCliente({ ...cliente, observacoes: e.target.value })}
          />

          <label>Status</label>
          <select
            value={String(cliente.ativo)}
            onChange={(e) => setCliente({ ...cliente, ativo: e.target.value === "true" })}
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>

          <h3>Endereço</h3>
          <label>Logradouro</label>
          <input
            name="logradouro"
            value={cliente.endereco.logradouro}
            onChange={handleEnderecoChange}
          />
          {erros.logradouro && <div className="erro">{erros.logradouro}</div>}

          <label>Número</label>
          <input
            name="numero"
            maxLength={10000}
            value={cliente.endereco.numero}
            onChange={handleEnderecoChange}
          />
          {erros.numero && <div className="erro">{erros.numero}</div>}

          <label>Complemento</label>
          <input
            name="complemento"
            value={cliente.endereco.complemento}
            onChange={handleEnderecoChange}
          />

          <label>Cidade</label>
          <input
            name="cidade"
            value={cliente.endereco.cidade}
            onChange={handleEnderecoChange}
          />
          {erros.cidade && <div className="erro">{erros.cidade}</div>}

          <label>UF</label>
          <input
            name="uf"
            maxLength={2}
            value={cliente.endereco.uf}
            onChange={(e) =>
              handleEnderecoChange({
                target: { name: "uf", value: e.target.value.toUpperCase() }
              })
            }
          />
          {erros.uf && <div className="erro">{erros.uf}</div>}

          <label>CEP</label>
          <input
            name="cep"
            maxLength={8}
            value={cliente.endereco.cep}
            onChange={(e) =>
              handleEnderecoChange({
                target: { name: "cep", value: e.target.value.replace(/\D/g, "") }
              })
            }
          />
          {erros.cep && <div className="erro">{erros.cep}</div>}

          <div className="modal-actions">
            <button type="button" className="cancelar" onClick={onClose} disabled={salvando}>
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

export default ModalCadastrarCliente;
