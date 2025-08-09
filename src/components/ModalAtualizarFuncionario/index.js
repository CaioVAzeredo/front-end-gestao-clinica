// src/components/ModalAtualizarFuncionario.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
const REACT_APP_PORT = process.env.REACT_APP_PORT;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex; justify-content: center; align-items: center;
  z-index: 999; padding: 20px;
`;

const ModalContent = styled.div`
  background: #fff; padding: 20px; border-radius: 8px; width: 450px;
  max-height: 80vh; overflow-y: auto; box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  position: relative;

  h2 { margin-bottom: 20px; }

  .close-button {
    position: absolute; top: 10px; right: 10px;
    background: transparent; border: none; font-size: 20px;
    cursor: pointer; color: #444;
  }

  label { display: block; font-size: 14px; margin-bottom: 5px; margin-top: 10px; }

  input, select {
    width: 100%; padding: 8px; margin-bottom: 5px;
    border-radius: 4px; border: 1px solid #ccc;
  }

  .erro {
    color: red;
    font-size: 12px;
    margin-top: -4px;
    margin-bottom: 6px;
  }

  .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }

  button.cancelar { background: #aaa; }
  button { background: #009688; color: #fff; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; }
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

  useEffect(() => {
  if (funcionarioProp) {
    setFuncionario({
      idFuncionario: funcionarioProp.idFuncionario ?? null,
      senhaHash: funcionarioProp.senhaHash ?? "", // ← agora vem do JSON
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
        cep: funcionarioProp.endereco?.cep ?? ""
      }
    });
  }
}, [funcionarioProp]);


  function validar() {
    const novosErros = {};
    if (!funcionario.nome?.trim()) {
      novosErros.nome = "O nome é obrigatório.";
    }
    if (!funcionario.senhaHash?.trim()) {
      novosErros.senhaHash = "A senha é obrigatória.";
    } else if (funcionario.senhaHash.trim().length < 0) {
      novosErros.senhaHash = "A senha deve ter pelo menos 6 caracteres.";
    }
    if (!funcionario.email?.trim()) {
      novosErros.email = "O e-mail é obrigatório.";
    }
    if (!funcionario.cpf?.trim()) {
      novosErros.cpf = "O CPF é obrigatório.";
    }
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

      // envia senha obrigatória + restante do payload no padrão do backend
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
      onClose();
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

  return (
    <ModalOverlay onMouseDown={(e) => e.target === e.currentTarget && !salvando && onClose()}>
      <ModalContent onMouseDown={(e) => e.stopPropagation()}>
        <button type="button" className="close-button" onClick={onClose} disabled={salvando}>×</button>
        <h2>Atualizar Funcionário</h2>

        <form onSubmit={atualizarFuncionario}>
          <label>Nome</label>
          <input
            value={funcionario.nome}
            onChange={(e) => setFuncionario({ ...funcionario, nome: e.target.value })}
          />
          {erros.nome && <div className="erro">{erros.nome}</div>}

          <label>Telefone</label>
          <input
            value={funcionario.telefone}
            onChange={(e) => setFuncionario({ ...funcionario, telefone: e.target.value })}
          />

          <label>E-mail</label>
          <input
            type="email"
            value={funcionario.email}
            onChange={(e) => setFuncionario({ ...funcionario, email: e.target.value })}
          />
          {erros.email && <div className="erro">{erros.email}</div>}

          <label>CPF</label>
          <input
            value={funcionario.cpf}
            onChange={(e) => setFuncionario({ ...funcionario, cpf: e.target.value })}
          />
          {erros.cpf && <div className="erro">{erros.cpf}</div>}

          <label>Data de Nascimento</label>
          <input
            type="date"
            value={funcionario.dataNascimento}
            onChange={(e) => setFuncionario({ ...funcionario, dataNascimento: e.target.value })}
          />

          <label>Senha</label>
          <input
            type="text" // agora aparece visível
            value={funcionario.senhaHash}
            onChange={(e) => setFuncionario({ ...funcionario, senhaHash: e.target.value })}
          />
          {erros.senhaHash && <div className="erro">{erros.senhaHash}</div>}


          <label>Status</label>
          <select
            value={String(funcionario.ativo)}
            onChange={(e) => setFuncionario({ ...funcionario, ativo: e.target.value === "true" })}
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>

          <label>Perfil</label>
          <select
            value={funcionario.perfil}
            onChange={(e) => setFuncionario({ ...funcionario, perfil: e.target.value })}
          >
            <option value="admin">Administrador</option>
            <option value="funcionario">Funcionário</option>
          </select>

          <h3>Endereço</h3>
          <label>Logradouro</label>
          <input
            name="logradouro"
            value={funcionario.endereco.logradouro}
            onChange={handleEnderecoChange}
          />
          <label>Número</label>
          <input
            name="numero"
            value={funcionario.endereco.numero}
            onChange={handleEnderecoChange}
          />
          <label>Complemento</label>
          <input
            name="complemento"
            value={funcionario.endereco.complemento}
            onChange={handleEnderecoChange}
          />
          <label>Cidade</label>
          <input
            name="cidade"
            value={funcionario.endereco.cidade}
            onChange={handleEnderecoChange}
          />
          <label>UF</label>
          <input
            name="uf"
            value={funcionario.endereco.uf}
            onChange={handleEnderecoChange}
          />
          <label>CEP</label>
          <input
            name="cep"
            value={funcionario.endereco.cep}
            onChange={handleEnderecoChange}
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
