// src/components/ModalCadastrarServico.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
const REACT_APP_PORT = process.env.REACT_APP_PORT;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex; justify-content: center; align-items: center;
  z-index: 999; padding: 20px;
`;

const ModalContent = styled.div`
  background: #fff; padding: 20px; border-radius: 8px; width: 650px;
  max-height: 80vh; overflow-y: auto; box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  position: relative;

  h2 { margin-bottom: 20px; }
  h3 { margin-top: 20px; margin-bottom: 10px; }

  .close-button { position: absolute; top: 10px; right: 10px; background: transparent; border: none; font-size: 20px; cursor: pointer; color: #444; }

  label { display: block; font-size: 14px; margin-bottom: 5px; margin-top: 10px; }

  input, select, textarea {
    width: 100%; padding: 8px; margin-bottom: 5px;
    border-radius: 4px; border: 1px solid #ccc;
  }

  textarea { resize: vertical; }

  .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }

  button.cancelar { background: #aaa; }
  button { background: #009688; color: #fff; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; }

  .erro { color: red; font-size: 12px; margin-top: -4px; margin-bottom: 6px; }
`;

function formatPriceForInput(value) {
  if (value === null || value === undefined || isNaN(value)) return "";
  return new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(value);
}

// helpers de normalização
const toArray = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload?.data?.$values)) return payload.data.$values;
  if (Array.isArray(payload?.$values)) return payload.$values;
  return [];
};

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
      // tenta próxima rota
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

  useEffect(() => {
    async function buscarCategorias() {
      try {
        const lista = await fetchCategoriasFlex();
        setCategorias(lista);
        // seta categoria padrão se houver e ainda não tiver uma selecionada
        if (lista.length && !servico.categoriaId) {
          const firstId = lista[0].idCategoria ?? lista[0].id ?? "";
          setServico((prev) => ({ ...prev, categoriaId: firstId }));
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        setCategorias([]);
      }
    }
    buscarCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // garante que categoriaId seja número, se possível
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
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar serviço", error);
      alert("Erro ao cadastrar serviço!");
    } finally {
      setSalvando(false);
    }
  }

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

  const onOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <ModalOverlay onMouseDown={onOverlayClick}>
      <ModalContent onMouseDown={(e) => e.stopPropagation()}>
        <button type="button" className="close-button" onClick={onClose}>×</button>
        <h2>Cadastrar Serviço</h2>

        <form onSubmit={salvarServico}>
          <label>Nome do Serviço</label>
          <input name="nomeServico" value={servico.nomeServico} onChange={handleChange} />
          {erros.nomeServico && <div className="erro">{erros.nomeServico}</div>}

          <label>Descrição</label>
          <textarea name="descricao" rows="3" value={servico.descricao} onChange={handleChange} />

          <label>Preço</label>
          <input
            name="preco"
            type="text"
            value={"R$ " + formatPriceForInput(servico.preco)}
            onChange={handleChange}
          />
          {erros.preco && <div className="erro">{erros.preco}</div>}

          <label>Duração Estimada (minutos)</label>
          <input
            name="duracaoEstimada"
            type="text"
            placeholder="0"
            value={servico.duracaoEstimada}
            onChange={handleChange}
          />
          {erros.duracaoEstimada && <div className="erro">{erros.duracaoEstimada}</div>}

          <label>Categoria</label>
          <select name="categoriaId" value={servico.categoriaId} onChange={handleChange}>
            <option value="">Selecione uma categoria...</option>
            {categorias.map((cat) => (
              <option key={cat.idCategoria ?? cat.id} value={cat.idCategoria ?? cat.id}>
                {cat.nomeCategoria}
              </option>
            ))}
          </select>
          {erros.categoriaId && <div className="erro">{erros.categoriaId}</div>}

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

export default ModalCadastrarServico;
