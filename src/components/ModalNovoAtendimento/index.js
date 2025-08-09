import React, { useState, useEffect } from "react";
import styled from "styled-components";
const REACT_APP_PORT = process.env.REACT_APP_PORT;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
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
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  position: relative;

  h2 { margin-bottom: 20px; }

  .close-button {
    position: absolute; top: 10px; right: 10px;
    background: transparent; border: none; font-size: 20px;
    cursor: pointer; color: #444;
  }

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

    if (!atendimento.clienteId) {
      novosErros.clienteId = "Selecione um cliente.";
    }
    if (!atendimento.funcionarioId) {
      novosErros.funcionarioId = "Selecione um funcionário.";
    }
    if (!atendimento.servicoId) {
      novosErros.servicoId = "Selecione um serviço.";
    }
    if (!atendimento.dataHoraInicio) {
      novosErros.dataHoraInicio = "Informe a data e hora do atendimento.";
    }
    if (!atendimento.duracaoAtendimento || Number(atendimento.duracaoAtendimento) <= 0) {
      novosErros.duracaoAtendimento = "Informe a duração do atendimento (minutos).";
    }
    if (!atendimento.statusAgenda) {
      novosErros.statusAgenda = "Selecione o status da agenda.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function salvarAtendimento() {
    if (!validar()) return;

    try {
      await fetch(`http://localhost:${REACT_APP_PORT}/api/agendamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(atendimento)
      });
      alert("Atendimento cadastrado com sucesso!");
      onCreate();
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar atendimento", error);
    }
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Atendimento</h2>

        <label>Cliente</label>
        <select
          value={atendimento.clienteId}
          onChange={e => setAtendimento({ ...atendimento, clienteId: e.target.value })}
        >
          <option value="">Selecione...</option>
          {clientes.map(c => (
            <option key={c.idCliente} value={c.idCliente}>{c.nome}</option>
          ))}
        </select>
        {erros.clienteId && <div className="erro">{erros.clienteId}</div>}

        <label>Funcionário</label>
        <select
          value={atendimento.funcionarioId}
          onChange={e => setAtendimento({ ...atendimento, funcionarioId: e.target.value })}
        >
          <option value="">Selecione...</option>
          {funcionarios.map(f => (
            <option key={f.idFuncionario} value={f.idFuncionario}>{f.nome}</option>
          ))}
        </select>
        {erros.funcionarioId && <div className="erro">{erros.funcionarioId}</div>}

        <label>Serviço</label>
        <select
          value={atendimento.servicoId}
          onChange={e => setAtendimento({ ...atendimento, servicoId: e.target.value })}
        >
          <option value="">Selecione...</option>
          {servicos.map(s => (
            <option key={s.idServico} value={s.idServico}>{s.nomeServico}</option>
          ))}
        </select>
        {erros.servicoId && <div className="erro">{erros.servicoId}</div>}

        <label>Data e Hora</label>
        <input
          type="datetime-local"
          value={atendimento.dataHoraInicio}
          onChange={e => setAtendimento({ ...atendimento, dataHoraInicio: e.target.value })}
        />
        {erros.dataHoraInicio && <div className="erro">{erros.dataHoraInicio}</div>}

        <label>Duração do Atendimento (minutos)</label>
        <input
          type="number"
          value={atendimento.duracaoAtendimento}
          onChange={e => setAtendimento({ ...atendimento, duracaoAtendimento: e.target.value })}
          min="1"
        />
        {erros.duracaoAtendimento && <div className="erro">{erros.duracaoAtendimento}</div>}

        <label>Observações</label>
        <textarea
          rows="3"
          value={atendimento.observacoes}
          onChange={e => setAtendimento({ ...atendimento, observacoes: e.target.value })}
        />

        <label>Status da Agenda</label>
        <select
          value={atendimento.statusAgenda}
          onChange={e => setAtendimento({ ...atendimento, statusAgenda: e.target.value })}
        >
          <option value="HorarioMarcado">Horário Marcado</option>
          <option value="Cancelado">Cancelado</option>
          <option value="Concluido">Concluído</option>
        </select>
        {erros.statusAgenda && <div className="erro">{erros.statusAgenda}</div>}

        <div className="modal-actions">
          <button className="cancelar" onClick={onClose}>Cancelar</button>
          <button onClick={salvarAtendimento}>Salvar</button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
}

export default ModalNovoAtendimento;
