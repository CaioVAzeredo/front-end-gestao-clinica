import React, { useState, useEffect } from "react";
import styled from "styled-components";

const REACT_APP_PORT = process.env.REACT_APP_PORT;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6); /* Opacidade refinada para profundidade */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 10px;
  transition: opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Animação suave */
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
`;

const ModalContent = styled.div`
  background: linear-gradient(145deg, #ffffff, #f9f9f9); /* Gradiente sutil para elegância */
  padding: 24px;
  border-radius: 16px; /* Bordas mais refinadas */
  width: 100%;
  max-width: 40vw; /* Mais compacto, evitando extensão */
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1); /* Sombras rebuscadas com camadas */
  position: relative;
  animation: fadeInScale 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  @keyframes fadeInScale {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  /* Responsividade: Empilha campos em mobile */
  @media (max-width: 768px) {
    padding: 16px;
    max-width: 95%;
    .form-row { display: block; }
  }

  h2, h3 {
    margin-bottom: 12px;
    font-family: 'Roboto', sans-serif; /* Tipografia refinada (importe via CSS) */
    font-weight: 500;
    color: #00796b; /* Cor temática */
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
    &:hover { color: #424242; transform: scale(1.1); }
  }

  label {
    display: block;
    font-size: 13px;
    margin-bottom: 4px;
    margin-top: 8px;
    font-weight: 500;
    color: #424242;
  }

  input,
  select,
  textarea {
    width: 100%;
    max-width: 300px; /* Limite para evitar inputs extensos */
    padding: 10px 12px;
    margin-bottom: 6px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    font-size: 15px;
    background: #fff;
    transition: border-color 0.2s, box-shadow 0.2s;
    &:focus { border-color: #009688; box-shadow: 0 0 0 2px rgba(0, 150, 136, 0.2); }
  }

  textarea {
    resize: vertical;
    min-height: 70px;
    max-width: 100%; /* Controle de extensão */
  }

  .form-row {
    display: flex;
    gap: 16px;
    > div { flex: 1; min-width: 0; }
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
    &:active { transform: scale(0.98); }
  }

  button.cancelar {
    background: #e0e0e0;
    color: #424242;
    &:hover { background: #bdbdbd; }
  }

  button[type="submit"] {
    background: #009688;
    color: #fff;
    &:hover { background: #00796b; }
    &:disabled { background: #80cbc4; cursor: not-allowed; }
  }

  .erro {
    color: #d32f2f;
    font-size: 12px;
    margin-top: -4px;
    margin-bottom: 4px;
    font-style: italic; /* Toque rebuscado */
  }
`;

function ModalNovoAtendimento({ onCreate, onClose }) {
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

        setClientes(resClientes?.data ?? []);
        setServicos(resServicos?.data ?? []);
        setFuncionarios(resFuncionarios ?? []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setClientes([]);
        setServicos([]);
        setFuncionarios([]);
      }
    }
    fetchData();
  }, []);

  function validar() {
    const novosErros = {};

    if (!atendimento.clienteId) novosErros.clienteId = "Selecione um cliente.";
    if (!atendimento.funcionarioId) novosErros.funcionarioId = "Selecione um funcionário.";
    if (!atendimento.servicoId) novosErros.servicoId = "Selecione um serviço.";
    if (!atendimento.dataHoraInicio) novosErros.dataHoraInicio = "Informe a data e hora do atendimento.";
    if (!atendimento.duracaoAtendimento || Number(atendimento.duracaoAtendimento) <= 0) novosErros.duracaoAtendimento = "Informe a duração do atendimento (minutos).";
    if (!atendimento.statusAgenda) novosErros.statusAgenda = "Selecione o status da agenda.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function salvarAtendimento(e) {
    e.preventDefault();
    if (!validar()) return;

    setSalvando(true);
    try {
      await fetch(`http://localhost:${REACT_APP_PORT}/api/agendamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(atendimento)
      });
      alert("Atendimento cadastrado com sucesso!");
      onCreate();
      handleClose();
    } catch (error) {
      console.error("Erro ao cadastrar atendimento", error);
      alert("Erro ao cadastrar atendimento!");
    } finally {
      setSalvando(false);
    }
  }

  function handleClose() {
    setIsOpen(false);
    setTimeout(onClose, 400); // Espera animação
  }

  return (
    <ModalOverlay onClick={handleClose} isOpen={isOpen}>
      <ModalContent onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button type="button" className="close-button" onClick={handleClose} aria-label="Fechar modal" disabled={salvando}>
          ×
        </button>
        <h2 id="modal-title">Novo Atendimento</h2>

        <form onSubmit={salvarAtendimento}>
          <div className="form-row">
            <div>
              <label htmlFor="clienteId">Cliente</label>
              <select
                id="clienteId"
                value={atendimento.clienteId}
                onChange={(e) => setAtendimento({ ...atendimento, clienteId: e.target.value })}
                disabled={salvando}
              >
                <option value="">Selecione...</option>
                {clientes.map((c) => (
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
                value={atendimento.funcionarioId}
                onChange={(e) => setAtendimento({ ...atendimento, funcionarioId: e.target.value })}
                disabled={salvando}
              >
                <option value="">Selecione...</option>
                {funcionarios.map((f) => (
                  <option key={f.idFuncionario} value={f.idFuncionario}>
                    {f.nome}
                  </option>
                ))}
              </select>
              {erros.funcionarioId && <div className="erro">{erros.funcionarioId}</div>}
            </div>
          </div>

          <div className="form-row">
            <div>
              <label htmlFor="servicoId">Serviço</label>
              <select
                id="servicoId"
                value={atendimento.servicoId}
                onChange={(e) => setAtendimento({ ...atendimento, servicoId: e.target.value })}
                disabled={salvando}
              >
                <option value="">Selecione...</option>
                {servicos.map((s) => (
                  <option key={s.idServico} value={s.idServico}>
                    {s.nomeServico}
                  </option>
                ))}
              </select>
              {erros.servicoId && <div className="erro">{erros.servicoId}</div>}
            </div>
          </div>

          <div className="form-row">
            <div>
              <label htmlFor="dataHoraInicio">Data e Hora</label>
              <input
                id="dataHoraInicio"
                type="datetime-local"
                value={atendimento.dataHoraInicio}
                onChange={(e) => setAtendimento({ ...atendimento, dataHoraInicio: e.target.value })}
                disabled={salvando}
              />
              {erros.dataHoraInicio && <div className="erro">{erros.dataHoraInicio}</div>}
            </div>
            <div>
              <label htmlFor="duracaoAtendimento">Duração (minutos)</label>
              <input
                id="duracaoAtendimento"
                type="number"
                value={atendimento.duracaoAtendimento}
                onChange={(e) => setAtendimento({ ...atendimento, duracaoAtendimento: e.target.value })}
                min="1"
                disabled={salvando}
              />
              {erros.duracaoAtendimento && <div className="erro">{erros.duracaoAtendimento}</div>}
            </div>
          </div>

          <label htmlFor="observacoes">Observações</label>
          <textarea
            id="observacoes"
            placeholder="Notas opcionais"
            value={atendimento.observacoes}
            onChange={(e) => setAtendimento({ ...atendimento, observacoes: e.target.value })}
            disabled={salvando}
          />

          <label htmlFor="statusAgenda">Status da Agenda</label>
          <select
            id="statusAgenda"
            value={atendimento.statusAgenda}
            onChange={(e) => setAtendimento({ ...atendimento, statusAgenda: e.target.value })}
            disabled={salvando}
          >
            <option value="HorarioMarcado">Horário Marcado</option>
            <option value="Cancelado">Cancelado</option>
            <option value="Concluido">Concluído</option>
          </select>
          {erros.statusAgenda && <div className="erro">{erros.statusAgenda}</div>}

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
