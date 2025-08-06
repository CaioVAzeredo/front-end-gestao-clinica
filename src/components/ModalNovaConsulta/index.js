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
  width: 450px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
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

  input, select {
    width: 100%;
    padding: 8px;
    margin-bottom: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  textarea {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
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
`;

function ModalNovaConsulta({ onClose }) {
  const [consulta, setConsulta] = useState({
    clienteId: "",
    servicoId: "",
    funcionarioId: "", // <-- ID fixo temporário
    dataHoraInicio: "",
    duracaoAtendimento: 0,
    observacoes: "",
    statusAgenda: "HorarioMarcado"
  });

  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
const [funcionarios, setFuncionarios] = useState([]);

useEffect(() => {
  async function fetchData() {
    try {
      const resClientes = await fetch(`http://localhost:${REACT_APP_PORT}/api/clientes`).then(r => r.json());
      const resServicos = await fetch(`http://localhost:${REACT_APP_PORT}/api/servicos`).then(r => r.json());
      const resFuncionarios = await fetch(`http://localhost:${REACT_APP_PORT}/api/funcionarios`).then(r => r.json());

      setClientes(resClientes?.data?.$values ?? []);
      setServicos(resServicos?.data?.$values ?? []);
      setFuncionarios(resFuncionarios?.$values ?? []); // <- note que esse não tem `.data`
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }
  fetchData();
}, []);


  async function salvarConsulta() {
    try {
      await fetch(`http://localhost:${REACT_APP_PORT}/api/agendamentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consulta)
      });
      alert("Consulta cadastrada com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao cadastrar consulta", error);
    }
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Nova Consulta</h2>

        <label>Cliente</label>
        <select
          value={consulta.clienteId}
          onChange={e => setConsulta({ ...consulta, clienteId: e.target.value })}
        >
          <option value="">Selecione...</option>
          {clientes.map(c => (
            <option key={c.idCliente} value={c.idCliente}>{c.nome}</option>
          ))}
        </select>
<label>Funcionário</label>
<select
  value={consulta.funcionarioId}
  onChange={e => setConsulta({ ...consulta, funcionarioId: parseInt(e.target.value) })}
>
  <option value="">Selecione...</option>
  {funcionarios.map(f => (
    <option key={f.idFuncionario} value={f.idFuncionario}>
      {f.nome}
    </option>
  ))}
</select>

        <label>Serviço</label>
        <select
          value={consulta.servicoId}
          onChange={e => setConsulta({ ...consulta, servicoId: e.target.value })}
        >
          <option value="">Selecione...</option>
          {servicos.map(s => (
            <option key={s.idServico} value={s.idServico}>{s.nomeServico}</option>
          ))}
        </select>

        <label>Data e Hora</label>
        <input
          type="datetime-local"
          value={consulta.dataHoraInicio}
          onChange={e => setConsulta({ ...consulta, dataHoraInicio: e.target.value })}
        />

        <label>Duração do Atendimento (minutos)</label>
        <input
          type="number"
          value={consulta.duracaoAtendimento}
          onChange={e => setConsulta({ ...consulta, duracaoAtendimento: parseInt(e.target.value) || 0 })}
        />

        <label>Observações</label>
        <textarea
          rows="3"
          value={consulta.observacoes}
          onChange={e => setConsulta({ ...consulta, observacoes: e.target.value })}
        />

        <label>Status da Agenda</label>
        <select
          value={consulta.statusAgenda}
          onChange={e => setConsulta({ ...consulta, statusAgenda: e.target.value })}
        >
          <option value="HorarioMarcado">Horário Marcado</option>
          <option value="Cancelado">Cancelado</option>
          <option value="Concluido">Concluído</option>
        </select>

        <div className="modal-actions">
          <button className="cancelar" onClick={onClose}>Cancelar</button>
          <button onClick={salvarConsulta}>Salvar</button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
}

export default ModalNovaConsulta;
