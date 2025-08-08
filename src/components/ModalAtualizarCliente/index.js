import React, { useEffect, useState } from "react";
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
  width: 450px;
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
`;

function ModalAtualizarCliente({ onClose, cliente: clienteProp, onSalvou }) {
  const [cliente, setCliente] = useState(
    clienteProp || {
      idCliente: null,
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
    }
  );
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (clienteProp) {
      setCliente({
        idCliente: clienteProp.idCliente ?? null,
        nome: clienteProp.nome ?? "",
        telefone: clienteProp.telefone ?? "",
        email: clienteProp.email ?? "",
        cpf: clienteProp.cpf ?? "",
        observacoes: clienteProp.observacoes ?? "",
        ativo: typeof clienteProp.ativo === "boolean" ? clienteProp.ativo : true,
        endereco: {
          logradouro: clienteProp.endereco?.logradouro ?? "",
          numero: clienteProp.endereco?.numero ?? "",
          complemento: clienteProp.endereco?.complemento ?? "",
          cidade: clienteProp.endereco?.cidade ?? "",
          uf: clienteProp.endereco?.uf ?? "",
          cep: clienteProp.endereco?.cep ?? ""
        }
      });
    }
  }, [clienteProp]);

  async function atualizarCliente(e) {
    e.preventDefault();
    setSalvando(true);
    try {
      const id = cliente.idCliente;
      if (!id) {
        alert("ID do cliente não informado.");
        return;
      }
      // Cria uma cópia sem idCliente para evitar alteração no backend
      const { idCliente, ...dadosAtualizacao } = cliente;

      const resp = await fetch(`http://localhost:${REACT_APP_PORT}/api/clientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAtualizacao) // Envia sem idCliente
      });
      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        throw new Error(txt || `Erro HTTP ${resp.status}`);
      }
      alert("Cliente atualizado com sucesso!");
      if (onSalvou) onSalvou();
      onClose();
    } catch (error) {
      alert(`Erro ao atualizar cliente: ${error.message}`);
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
        <button type="button" className="close-button" onClick={onClose} disabled={salvando}>
          ×
        </button>
        <h2>Atualizar Cliente</h2>

        <form onSubmit={atualizarCliente}>
          <label>Nome</label>
          <input
            value={cliente.nome}
            onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
            disabled={salvando}
          />

          <label>Telefone</label>
          <input
            value={cliente.telefone}
            onChange={(e) => setCliente({ ...cliente, telefone: e.target.value })}
            disabled={salvando}
          />

          <label>E-mail</label>
          <input
            type="email"
            value={cliente.email}
            onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
            disabled={salvando}
          />

          <label>CPF</label>
          <input
            value={cliente.cpf}
            onChange={(e) => setCliente({ ...cliente, cpf: e.target.value })}
            disabled={salvando}
          />

          <label>Observações</label>
          <textarea
            rows="3"
            value={cliente.observacoes}
            onChange={(e) => setCliente({ ...cliente, observacoes: e.target.value })}
            disabled={salvando}
          />

          <label>Status</label>
          <select
            value={String(cliente.ativo)}
            onChange={(e) => setCliente({ ...cliente, ativo: e.target.value === "true" })}
            disabled={salvando}
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
            disabled={salvando}
          />
          <label>Número</label>
          <input
            name="numero"
            value={cliente.endereco.numero}
            onChange={handleEnderecoChange}
            disabled={salvando}
          />
          <label>Complemento</label>
          <input
            name="complemento"
            value={cliente.endereco.complemento}
            onChange={handleEnderecoChange}
            disabled={salvando}
          />
          <label>Cidade</label>
          <input
            name="cidade"
            value={cliente.endereco.cidade}
            onChange={handleEnderecoChange}
            disabled={salvando}
          />
          <label>UF</label>
          <input
            name="uf"
            value={cliente.endereco.uf}
            onChange={handleEnderecoChange}
            disabled={salvando}
          />
          <label>CEP</label>
          <input
            name="cep"
            value={cliente.endereco.cep}
            onChange={handleEnderecoChange}
            disabled={salvando}
          />

          <div className="modal-actions">
            <button type="button" className="cancelar" onClick={onClose} disabled={salvando}>
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

export default ModalAtualizarCliente;