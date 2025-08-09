// src/components/ModalCadastrarCategoria.jsx
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
  }

  h2 {
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
    font-weight: bold;
    color: #424242;
  }

  input {
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

function ModalCadastrarCategoria({ onClose, onSalvou }) {
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 400);
  };

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
      handleClose();
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      alert(`Erro ao adicionar categoria: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ModalOverlay onMouseDown={(e) => e.target === e.currentTarget && handleClose()} isOpen={isOpen}>
      <ModalContent onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button type="button" className="close-button" onClick={handleClose}>×</button>
        <h2 id="modal-title">Adicionar Categoria</h2>

        <form onSubmit={salvarCategoria}>
          <label htmlFor="nomeCategoria">Nome da Categoria</label>
          <input
            id="nomeCategoria"
            name="nomeCategoria"
            value={nomeCategoria}
            onChange={(e) => setNomeCategoria(e.target.value)}
          />
          {erro && <div className="erro">{erro}</div>}

          <div className="modal-actions">
            <button
              type="button"
              className="cancelar"
              onClick={handleClose}
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