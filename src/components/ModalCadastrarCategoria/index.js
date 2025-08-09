// src/components/ModalCadastrarCategoria.jsx
import React, { useState } from "react";
import styled from "styled-components";

// Reutiliza os estilos dos modais existentes para manter o padrão
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

  input {
    width: 100%;
    padding: 8px;
    margin-bottom: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
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

const REACT_APP_PORT = process.env.REACT_APP_PORT;

function ModalCadastrarCategoria({ onClose, onSalvou }) {
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function salvarCategoria(e) {
    e.preventDefault();
    setErro("");
    if (!nomeCategoria.trim()) {
      setErro("O nome da categoria é obrigatório.");
      return;
    }

    setSalvando(true);
    try {
      const resp = await fetch(
        `http://localhost:${REACT_APP_PORT}/api/Categoria`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nomeCategoria }),
        }
      );

      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        throw new Error(txt || `Erro HTTP ${resp.status}`);
      }

      alert("Categoria adicionada com sucesso!");
      if (typeof onSalvou === "function") {
        onSalvou();
      }
      onClose();
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      alert("Erro ao adicionar categoria.");
    } finally {
      setSalvando(false);
    }
  }

  const onOverlayClick = (e) => {
    // Verifica se o clique foi na própria div de overlay e não em um de seus filhos
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onMouseDown={onOverlayClick}>
      <ModalContent onMouseDown={(e) => e.stopPropagation()}>
        <button type="button" className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Adicionar Categoria</h2>

        <form onSubmit={salvarCategoria}>
          <label>Nome da Categoria</label>
          <input
            name="nomeCategoria"
            value={nomeCategoria}
            onChange={(e) => setNomeCategoria(e.target.value)}
          />
          {erro && <div className="erro">{erro}</div>}

          <div className="modal-actions">
            <button
              type="button"
              className="cancelar"
              onClick={onClose}
              disabled={salvando}
            >
              Cancelar
            </button>
            <button type="submit" disabled={salvando}>
              {salvando ? "Adicionando..." : "Adicionar"}
            </button>
          </div>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default ModalCadastrarCategoria;