import React, { useState, useEffect } from "react";
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

  h3 {
    margin-top: 20px;
    margin-bottom: 10px;
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
  select,
  textarea {
    width: 100%;
    padding: 8px;
    margin-bottom: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  textarea {
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

function formatPriceForInput(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return "";
  }
  return new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(value);
}

function ModalAtualizarServico({ onClose, onSalvou, servico }) {
  // CORREÇÃO: Inicializa o estado do formulário diretamente com os dados da prop
  const [servicoForm, setServicoForm] = useState(() => ({
    ...servico,
    categoriaId: servico?.categoria?.idCategoria || ""
  }));
  
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [precoInputValue, setPrecoInputValue] = useState(false);
  const [duracaoInputValue, setDuracaoInputValue] = useState(false);

  useEffect(() => {
    // CORREÇÃO: Inicializa os flags de input com base no valor inicial do serviço
    if (servico) {
      setServicoForm({
        ...servico,
        categoriaId: servico.categoria?.idCategoria || "",
      });
      setPrecoInputValue(servico.preco !== 0);
      setDuracaoInputValue(servico.duracaoEstimada !== 0);
    }
  }, [servico]);

  useEffect(() => {
    async function buscarCategorias() {
      try {
        const resp = await fetch(`http://localhost:${REACT_APP_PORT}/api/Categoria`);
        if (!resp.ok) {
          throw new Error("Erro ao buscar categorias");
        }
        const dados = await resp.json();
        if (dados && dados.data && dados.data.$values) {
          setCategorias(dados.data.$values);
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    }
    buscarCategorias();
  }, []);

  function validar() {
    const novosErros = {};
    if (!servicoForm.nomeServico?.trim()) {
      novosErros.nomeServico = "O nome do serviço é obrigatório.";
    }
    if (servicoForm.preco <= 0) {
      novosErros.preco = "O preço deve ser maior que zero.";
    }
    if (servicoForm.duracaoEstimada <= 0) {
      novosErros.duracaoEstimada = "A duração estimada deve ser maior que zero.";
    }
    if (!servicoForm.categoriaId) {
      novosErros.categoriaId = "A categoria é obrigatória.";
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function salvarServico(e) {
    e.preventDefault();
    if (!validar()) return;

    setSalvando(true);
    try {
      const dadosParaAtualizar = {
        idServico: servicoForm.idServico,
        nomeServico: servicoForm.nomeServico,
        descricao: servicoForm.descricao,
        preco: servicoForm.preco,
        duracaoEstimada: servicoForm.duracaoEstimada,
        ativo: servicoForm.ativo,
        categoriaId: servicoForm.categoriaId,
      };

      const resp = await fetch(
        `http://localhost:${REACT_APP_PORT}/api/servicos/${servicoForm.idServico}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosParaAtualizar),
        }
      );
      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        throw new Error(txt || `Erro HTTP ${resp.status}`);
      }
      alert("Serviço atualizado com sucesso!");
      if (typeof onSalvou === "function") onSalvou();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar serviço", error);
      alert("Erro ao atualizar serviço!");
    } finally {
      setSalvando(false);
    }
  }

  const handlePrecoChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const floatValue = value ? parseFloat(value) / 100 : 0;
    setServicoForm((prev) => ({ ...prev, preco: floatValue }));
  };

  const handleDuracaoChange = (e) => {
    const value = e.target.value;
    const numericValue = parseInt(value, 10);
    setServicoForm((prev) => ({
      ...prev,
      duracaoEstimada: isNaN(numericValue) || numericValue < 0 ? 0 : numericValue,
    }));
  };

  const handleOtherChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServicoForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const formatPriceDisplay = (price) => {
    if (price === 0 && !precoInputValue) {
      return "";
    }
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatDuracaoDisplay = (duracao) => {
    if (duracao === 0 && !duracaoInputValue) {
      return "";
    }
    return duracao;
  };

  const onOverlayClick = (e) => {
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
        <h2>Atualizar Serviço</h2>

        <form onSubmit={salvarServico}>
          <label>Nome do Serviço</label>
          <input
            name="nomeServico"
            value={servicoForm.nomeServico || ""}
            onChange={handleOtherChange}
          />
          {erros.nomeServico && <div className="erro">{erros.nomeServico}</div>}

          <label>Descrição</label>
          <textarea
            name="descricao"
            rows="3"
            value={servicoForm.descricao || ""}
            onChange={handleOtherChange}
          />

          <label>Preço</label>
          <input
            name="preco"
            type="text"
            value={formatPriceDisplay(servicoForm.preco)}
            onChange={handlePrecoChange}
            onFocus={() => setPrecoInputValue(true)}
            onBlur={() => {
              if (servicoForm.preco === 0) setPrecoInputValue(false);
            }}
          />
          {erros.preco && <div className="erro">{erros.preco}</div>}

          <label>Duração Estimada (minutos)</label>
          <input
            name="duracaoEstimada"
            type="number"
            min="0"
            value={formatDuracaoDisplay(servicoForm.duracaoEstimada)}
            onChange={handleDuracaoChange}
            onFocus={() => setDuracaoInputValue(true)}
            onBlur={() => {
              if (servicoForm.duracaoEstimada === 0) setDuracaoInputValue(false);
            }}
          />
          {erros.duracaoEstimada && <div className="erro">{erros.duracaoEstimada}</div>}

          <label>Categoria</label>
          <select
            name="categoriaId"
            value={servicoForm.categoriaId || ""}
            onChange={handleOtherChange}
          >
            <option value="">Selecione uma categoria...</option>
            {categorias.map((cat) => (
              <option key={cat.idCategoria} value={cat.idCategoria}>
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
              {salvando ? "Atualizando..." : "Atualizar"}
            </button>
          </div>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default ModalAtualizarServico;