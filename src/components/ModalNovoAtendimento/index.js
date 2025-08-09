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
    width: 95%;
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
    border: 1px solid #9e9e9e; /* Cor da borda alterada para um cinza mais escuro */
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
  }

  .form-row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;

    & > div {
      flex: 1;
      min-width: 0;
    }

    @media (max-width: 768px) {
      flex-direction: column;
    }
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

const toArray = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload?.$values)) return payload.$values;
  return [];
};

function ModalNovoAtendimento({ onClose, onSalvou }) {
  const [atendimento, setAtendimento] = useState({
    clienteId: "",
    servicoId: "",
    funcionarioId: "",
    dataHoraInicio: "",
    duracaoAtendimento: "",
    observacoes: "",
    statusAgenda: "HorarioMarcado"
  });
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const resClientes = await fetch(`http://localhost:${REACT_APP_PORT}/api/clientes`).then(r => r.json());
        const resServicos = await fetch(`http://localhost:${REACT_APP_PORT}/api/servicos`).then(r => r.json());
        const resFuncionarios = await fetch(`http://localhost:${REACT_APP_PORT}/api/funcionarios`).then(r => r.json());

        setClientes(toArray(resClientes));
        setServicos(toArray(resServicos));
        setFuncionarios(toArray(resFuncionarios));

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar os dados para o formulário. Tente novamente.");
      }
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAtendimento(prev => ({ ...prev, [name]: value }));
  };

  function validar() {
    const novosErros = {};
    if (!atendimento.clienteId) novosErros.clienteId = "Selecione um cliente.";
    if (!atendimento.funcionarioId) novosErros.funcionarioId = "Selecione um funcionário.";
    if (!atendimento.servicoId) novosErros.servicoId = "Selecione um serviço.";
    if (!atendimento.dataHoraInicio) novosErros.dataHoraInicio = "Informe a data e hora do atendimento.";
    if (!atendimento.duracaoAtendimento || Number(atendimento.duracaoAtendimento) <= 0) {
      novosErros.duracaoAtendimento = "A duração deve ser maior que zero.";
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function salvarAtendimento(e) {
    e.preventDefault();
  async function salvarAtendimento(e) {
    e.preventDefault();
    if (!validar()) return;

    setSalvando(true);
    setSalvando(true);
    try {
      const body = {
        ...atendimento,
        clienteId: Number(atendimento.clienteId),
        servicoId: Number(atendimento.servicoId),
        funcionarioId: Number(atendimento.funcionarioId),
        duracaoAtendimento: Number(atendimento.duracaoAtendimento)
      };

      const resp = await fetch(`http://localhost:${REACT_APP_PORT}/api/agendamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
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
      alert("Atendimento cadastrado com sucesso!");
      if (typeof onSalvou === "function") onSalvou();
      handleClose();
    } catch (error) {
      console.error("Erro ao cadastrar atendimento", error);
      alert(`Erro ao cadastrar atendimento: ${error.message}`);
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
        <h2 id="modal-title">Novo Agendamento</h2>

        <form onSubmit={salvarAtendimento}>
          <div className="form-row">
            <div>
              <label htmlFor="clienteId">Cliente</label>
              <select
                id="clienteId"
                name="clienteId"
                value={atendimento.clienteId}
                onChange={handleChange}
                disabled={salvando}
              >
                <option value="">Selecione...</option>
                {clientes.map(c => (
                  <option key={c.idCliente} value={c.idCliente}>
                    {c.nome}
                  </option>
                ))}
              </select>
              {erros.clienteId && <div className="erro">{erros.clienteId}</div>}
            </div>
            <div>
              <label htmlFor="funcionarioId">Funcionário</label>
              <select
                id="funcionarioId"
                name="funcionarioId"
                value={atendimento.funcionarioId}
                onChange={handleChange}
                disabled={salvando}
              >
                <option value="">Selecione...</option>
                {funcionarios.map(f => (
                  <option key={f.idFuncionario} value={f.idFuncionario}>
                    {f.nome}
                  </option>
                ))}
              </select>
              {erros.funcionarioId && <div className="erro">{erros.funcionarioId}</div>}
            </div>
          </div>

          <label htmlFor="servicoId">Serviço</label>
          <select
            id="servicoId"
            name="servicoId"
            value={atendimento.servicoId}
            onChange={handleChange}
            disabled={salvando}
          >
            <option value="">Selecione...</option>
            {servicos.map(s => (
              <option key={s.idServico} value={s.idServico}>
                {s.nomeServico}
              </option>
            ))}
          </select>
          {erros.servicoId && <div className="erro">{erros.servicoId}</div>}

          <div className="form-row">
            <div>
              <label htmlFor="dataHoraInicio">Data e Hora de Início</label>
              <input
                id="dataHoraInicio"
                name="dataHoraInicio"
                type="datetime-local"
                value={atendimento.dataHoraInicio}
                onChange={handleChange}
                disabled={salvando}
              />
              {erros.dataHoraInicio && <div className="erro">{erros.dataHoraInicio}</div>}
            </div>
            <div>
              <label htmlFor="duracaoAtendimento">Duração (minutos)</label>
              <input
                id="duracaoAtendimento"
                name="duracaoAtendimento"
                type="number"
                min="1"
                value={atendimento.duracaoAtendimento}
                onChange={handleChange}
                disabled={salvando}
              />
              {erros.duracaoAtendimento && <div className="erro">{erros.duracaoAtendimento}</div>}
            </div>
          </div>

          <label htmlFor="observacoes">Observações</label>
          <textarea
            id="observacoes"
            name="observacoes"
            rows="3"
            value={atendimento.observacoes}
            onChange={handleChange}
            disabled={salvando}
          />

          <label htmlFor="statusAgenda">Status</label>
          <select
            id="statusAgenda"
            name="statusAgenda"
            value={atendimento.statusAgenda}
            onChange={handleChange}
            disabled={salvando}
          >
            <option value="HorarioMarcado">Horário Marcado</option>
            <option value="Cancelado">Cancelado</option>
            <option value="Concluido">Concluído</option>
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

export default ModalNovoAtendimento;