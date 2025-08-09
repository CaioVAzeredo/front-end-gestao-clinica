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

function ModalAtualizarFuncionario({ onClose, Funcionario: FuncionarioProp, onSalvou }) {
  const [Funcionario, setFuncionario] = useState(
    FuncionarioProp || {
      idFuncionario: null,
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
    if (FuncionarioProp) {
      setFuncionario({
        idFuncionario: FuncionarioProp.idFuncionario ?? null,
        nome: FuncionarioProp.nome ?? "",
        telefone: FuncionarioProp.telefone ?? "",
        email: FuncionarioProp.email ?? "",
        cpf: FuncionarioProp.cpf ?? "",
        observacoes: FuncionarioProp.observacoes ?? "",
        ativo: typeof FuncionarioProp.ativo === "boolean" ? FuncionarioProp.ativo : true,
        endereco: {
          logradouro: FuncionarioProp.endereco?.logradouro ?? "",
          numero: FuncionarioProp.endereco?.numero ?? "",
          complemento: FuncionarioProp.endereco?.complemento ?? "",
          cidade: FuncionarioProp.endereco?.cidade ?? "",
          uf: FuncionarioProp.endereco?.uf ?? "",
          cep: FuncionarioProp.endereco?.cep ?? ""
        }
      });
    }
  }, [FuncionarioProp]);

  async function atualizarFuncionario(e) {
    e.preventDefault();
    setSalvando(true);
    try {
      const id = Funcionario.idFuncionario;
      if (!id) {
        alert("ID do Funcionario não informado.");
        return;
      }
      // Cria uma cópia sem idFuncionario para evitar alteração no backend
      const { idFuncionario, ...dadosAtualizacao } = Funcionario;

      const resp = await fetch(`http://localhost:${REACT_APP_PORT}/api/Funcionarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAtualizacao) // Envia sem idFuncionario
      });
      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        throw new Error(txt || `Erro HTTP ${resp.status}`);
      }
      alert("Funcionario atualizado com sucesso!");
      if (onSalvou) onSalvou();
      onClose();
    } catch (error) {
      alert(`Erro ao atualizar Funcionario: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  }

  function handleEnderecoChange(e) {
    const { name, value } = e.target;
    setFuncionario((prev) => ({
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
        <h2>Atualizar Funcionario</h2>

        <form onSubmit={atualizarFuncionario}>
          <label>Nome</label>
          <input
            value={Funcionario.nome}
            onChange={(e) => setFuncionario({ ...Funcionario, nome: e.target.value })}
            disabled={salvando}
          />

          <label>Telefone</label>
          <input
            value={Funcionario.telefone}
            onChange={(e) => setFuncionario({ ...Funcionario, telefone: e.target.value })}
            disabled={salvando}
          />

          <label>E-mail</label>
          <input
            type="email"
            value={Funcionario.email}
            onChange={(e) => setFuncionario({ ...Funcionario, email: e.target.value })}
            disabled={salvando}
          />

          <label>CPF</label>
          <input
            value={Funcionario.cpf}
            onChange={(e) => setFuncionario({ ...Funcionario, cpf: e.target.value })}
            disabled={salvando}
          />

          <label>Senha</label>
          <input type="password"
            value={Funcionario.senha}
            onChange={(e) => setFuncionario({ ...Funcionario, senha: e.target.value })}
            disabled={salvando}
          />

          <label>Status</label>
          <select
            value={String(Funcionario.ativo)}
            onChange={(e) => setFuncionario({ ...Funcionario, ativo: e.target.value === "true" })}
            disabled={salvando}
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>

          <label>Perfil</label>
          <select
            id="perfil"
            value={Funcionario.perfil}
            onChange={(e) => setFuncionario({ ...Funcionario, perfil: e.target.value })}
          >
            <option value="admin">Administrador</option>
            <option value="funcionario">Funcionário</option>
          </select>

          <h3>Endereço</h3>
          <label>Logradouro</label>
          <input
            name="logradouro"
            value={Funcionario.endereco.logradouro}
            onChange={handleEnderecoChange}
            disabled={salvando}
          />
          <label>Número</label>
          <input
            name="numero"
            value={Funcionario.endereco.numero}
            onChange={handleEnderecoChange}
            disabled={salvando}
          />
          <label>Complemento</label>
          <input
            name="complemento"
            value={Funcionario.endereco.complemento}
            onChange={handleEnderecoChange}
            disabled={salvando}
          />
          <label>Cidade</label>
          <input
            name="cidade"
            value={Funcionario.endereco.cidade}
            onChange={handleEnderecoChange}
            disabled={salvando}
          />
          <label>UF</label>
          <input
            name="uf"
            value={Funcionario.endereco.uf}
            onChange={handleEnderecoChange}
            disabled={salvando}
          />
          <label>CEP</label>
          <input
            name="cep"
            value={Funcionario.endereco.cep}
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

export default ModalAtualizarFuncionario;