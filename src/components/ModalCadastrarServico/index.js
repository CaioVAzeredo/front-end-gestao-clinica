import React, { useState, useEffect } from "react";
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
    font-weight: bold;
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

  textarea {
    resize: vertical;
    min-height: 70px;
    max-width: 100%;
  }

  .form-row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;

    > div {
      flex: 1;
      min-width: 0;
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

// Função para normalizar payloads de categorias
const toArray = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload?.data?.$values)) return payload.data.$values;
  if (Array.isArray(payload?.$values)) return payload.$values;
  return [];
};

// Função para buscar categorias de forma flexível
const fetchCategoriasFlex = async () => {
  const base = `http://localhost:${REACT_APP_PORT}/api`;
  const urls = [
    `${base}/categorias`,
    `${base}/Categorias`,
    `${base}/categoria`,
    `${base}/Categoria`,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const json = await res.json().catch(() => ({}));
      const arr = toArray(json);
      if (arr.length) return arr;
      if (Array.isArray(json) && json.length) return json;
    } catch {
      // Tenta a próxima rota em caso de erro
    }
  }
  return [];
};

function ModalCadastrarServico({ onClose, onSalvou }) {
  const [servico, setServico] = useState({
    nomeServico: "",
    descricao: "",
    preco: 0,
    duracaoEstimada: 0,
    ativo: true,
    categoriaId: "",
  });
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    async function buscarCategorias() {
      try {
        const lista = await fetchCategoriasFlex();
        setCategorias(lista);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        setCategorias([]);
      }
    }
    buscarCategorias();
  }, []);

  function validar() {
    const novosErros = {};
    if (!servico.nomeServico.trim()) novosErros.nomeServico = "O nome do serviço é obrigatório.";
    if (servico.preco <= 0) novosErros.preco = "O preço deve ser maior que zero.";
    if (servico.duracaoEstimada <= 0) novosErros.duracaoEstimada = "A duração estimada deve ser maior que zero.";
    if (!servico.categoriaId) novosErros.categoriaId = "A categoria é obrigatória.";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function salvarServico(e) {
    e.preventDefault();
    if (!validar()) return;

    setSalvando(true);
    try {
      const body = { ...servico, categoriaId: Number(servico.categoriaId) || servico.categoriaId };
      const resp = await fetch(`http://localhost:${REACT_APP_PORT}/api/servicos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        throw new Error(txt || `Erro HTTP ${resp.status}`);
      }
      alert("Serviço cadastrado com sucesso!");
      onSalvou?.();
      handleClose();
    } catch (error) {
      console.error("Erro ao cadastrar serviço", error);
      alert(`Erro ao cadastrar serviço: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  }

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 400);
  };

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    if (name === "preco") {
      const numericValue = value.replace(/[^0-9]/g, "");
      const floatValue = numericValue ? parseFloat(numericValue) / 100 : 0;
      setServico((prev) => ({ ...prev, [name]: floatValue }));
    } else if (name === "duracaoEstimada") {
      const numericValue = parseInt(value, 10);
      setServico((prev) => ({
        ...prev,
        [name]: isNaN(numericValue) || numericValue < 0 ? 0 : numericValue,
      }));
    } else {
      setServico((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  }

  return (
    <ModalOverlay onMouseDown={(e) => e.target === e.currentTarget && handleClose()} isOpen={isOpen}>
      <ModalContent onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button type="button" className="close-button" onClick={handleClose}>×</button>
        <h2 id="modal-title">Cadastrar Serviço</h2>

        <form onSubmit={salvarServico}>
          <label htmlFor="nomeServico">Nome do Serviço</label>
          <input id="nomeServico" name="nomeServico" value={servico.nomeServico} onChange={handleChange} />
          {erros.nomeServico && <div className="erro">{erros.nomeServico}</div>}

          <label htmlFor="descricao">Descrição</label>
          <textarea id="descricao" name="descricao" rows="3" value={servico.descricao} onChange={handleChange} />

          <div className="form-row">
            <div>
              <label htmlFor="preco">Preço</label>
              <input
                id="preco"
                name="preco"
                type="text"
                value={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(servico.preco)}
                onChange={handleChange}
              />
              {erros.preco && <div className="erro">{erros.preco}</div>}
            </div>
            <div>
              <label htmlFor="duracaoEstimada">Duração Estimada (minutos)</label>
              <input
                id="duracaoEstimada"
                name="duracaoEstimada"
                type="number"
                placeholder="0"
                value={servico.duracaoEstimada}
                onChange={handleChange}
              />
              {erros.duracaoEstimada && <div className="erro">{erros.duracaoEstimada}</div>}
            </div>
          </div>

          <label htmlFor="categoriaId">Categoria</label>
          <select id="categoriaId" name="categoriaId" value={servico.categoriaId} onChange={handleChange}>
            <option value="">Selecione uma categoria...</option>
            {categorias.map((cat) => (
              <option key={cat.idCategoria ?? cat.id} value={cat.idCategoria ?? cat.id}>
                {cat.nomeCategoria}
              </option>
            ))}
          </select>
          {erros.categoriaId && <div className="erro">{erros.categoriaId}</div>}
          
          <label htmlFor="ativo">Status</label>
          <select
            id="ativo"
            name="ativo"
            value={String(servico.ativo)}
            onChange={handleChange}
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>

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

export default ModalCadastrarServico;