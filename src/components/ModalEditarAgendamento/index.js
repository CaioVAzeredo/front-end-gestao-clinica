import React, { useState, useEffect } from "react";
import styled from "styled-components";

// Reutilizando os estilos do componente ModalNovoAtendimento para consistência
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
    border: 1px solid #9e9e9e; /* Cor da borda alterada */
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

  .field-row {
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

function ModalEditarAgendamento({ open, initialData, servicos = [], funcionarios = [], onClose, onSubmit }) {
  const [form, setForm] = useState(initialData || {});
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setErros({});
      setIsOpen(true);
    }
  }, [initialData]);

  if (!open) {
    return null;
  }

  function validar() {
    const novosErros = {};
    if (!form.clienteId) novosErros.clienteId = "O cliente é obrigatório.";
    if (!form.servicoId) novosErros.servicoId = "Selecione um serviço.";
    if (!form.funcionarioId) novosErros.funcionarioId = "Selecione um funcionário.";
    if (!form.dataHoraInicio) novosErros.dataHoraInicio = "Informe a data e hora do atendimento.";
    if (!form.duracaoAtendimento || Number(form.duracaoAtendimento) <= 0) {
      novosErros.duracaoAtendimento = "A duração deve ser maior que zero.";
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setSalvando(true);
    try {
      const body = {
        ...form,
        clienteId: Number(form.clienteId),
        servicoId: Number(form.servicoId),
        funcionarioId: Number(form.funcionarioId),
        duracaoAtendimento: Number(form.duracaoAtendimento),
      };
      
      await onSubmit(body);
      
      handleClose();

    } catch (error) {
      console.error("Erro ao salvar o agendamento", error);
      alert(`Erro ao salvar: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  };

  function handleClose() {
    setIsOpen(false);
    setTimeout(onClose, 400);
  }

  const onOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <ModalOverlay onMouseDown={onOverlayClick} isOpen={isOpen}>
      <ModalContent onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button type="button" className="close-button" onClick={handleClose} disabled={salvando}>
          ×
        </button>
        <h2 id="modal-title">Editar Agendamento #{initialData?.id}</h2>

        <form onSubmit={handleSubmit}>
          
          <div className="field-row">
            <div>
              <label>Cliente</label>
              <input type="text" value={initialData?.clienteNome || ""} readOnly disabled />
              {erros.clienteId && <div className="erro">{erros.clienteId}</div>}
            </div>
            <div>
              <label htmlFor="funcionarioId">Funcionário</label>
              <select name="funcionarioId" id="funcionarioId" value={form.funcionarioId ?? ""} onChange={handleChange} disabled={salvando}>
                <option value="">Selecione...</option>
                {funcionarios.map((f) => (
                  <option key={f.idFuncionario || f.id} value={f.idFuncionario || f.id}>
                    {f.nome || "Funcionário"}
                  </option>
                ))}
              </select>
              {erros.funcionarioId && <div className="erro">{erros.funcionarioId}</div>}
            </div>
          </div>
          
          <label htmlFor="servicoId">Serviço</label>
          <select name="servicoId" id="servicoId" value={form.servicoId ?? ""} onChange={handleChange} disabled={salvando}>
            <option value="">Selecione...</option>
            {servicos.map((s) => (
              <option key={s.idServico || s.id} value={s.idServico || s.id}>
                {s.nomeServico || s.nome || "Serviço"}
              </option>
            ))}
          </select>
          {erros.servicoId && <div className="erro">{erros.servicoId}</div>}

          <div className="field-row">
            <div>
              <label htmlFor="dataHoraInicio">Data e Hora de Início</label>
              <input 
                id="dataHoraInicio"
                type="datetime-local" 
                name="dataHoraInicio" 
                value={form.dataHoraInicio || ""} 
                onChange={handleChange} 
                disabled={salvando} 
              />
              {erros.dataHoraInicio && <div className="erro">{erros.dataHoraInicio}</div>}
            </div>
            <div>
              <label htmlFor="duracaoAtendimento">Duração (minutos)</label>
              <input 
                id="duracaoAtendimento"
                type="number" 
                name="duracaoAtendimento" 
                value={form.duracaoAtendimento ?? ""} 
                onChange={handleChange} 
                min="1" 
                disabled={salvando} 
              />
              {erros.duracaoAtendimento && <div className="erro">{erros.duracaoAtendimento}</div>}
            </div>
          </div>
          
          <label htmlFor="statusAgenda">Status</label>
          <select id="statusAgenda" name="statusAgenda" value={form.statusAgenda || "HorarioMarcado"} onChange={handleChange} disabled={salvando}>
            <option value="HorarioMarcado">Horário Marcado</option>
            <option value="Cancelado">Cancelado</option>
            <option value="Concluido">Concluído</option>
            <option value="Pendente">Pendente</option>
          </select>
          
          <label htmlFor="observacoes">Observações</label>
          <textarea id="observacoes" name="observacoes" rows="3" value={form.observacoes || ""} onChange={handleChange} disabled={salvando} />

          <div className="modal-actions">
            <button type="button" className="cancelar" onClick={handleClose} disabled={salvando}>
              Cancelar
            </button>
            <button type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default ModalEditarAgendamento;