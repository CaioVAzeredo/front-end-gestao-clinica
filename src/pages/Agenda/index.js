import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
const REACT_APP_PORT = process.env.REACT_APP_PORT;

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;

  .topo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .agenda {
    display: grid;
    grid-template-columns: 100px repeat(4, 1fr);
    gap: 8px;
    background: #fff;
  }

  .hora, .col-header {
    font-weight: bold;
    text-align: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }

  .slot {
    min-height: 60px;
    border: 1px solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .slot.disponivel {
    background: #f9f9f9;
    color: #888;
  }

  .slot.ocupado {
    background: #e3f2fd;
    color: #0d47a1;
    flex-direction: column;
  }

  .resumo {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-top: 30px;
  }

  .card {
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 5px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .card strong {
    font-size: 20px;
    margin-bottom: 5px;
  }
`;

function Agenda() {
  const [agendamentos, setAgendamentos] = useState([]);

  const fetchAgendamentos = async () => {
    try {
      const response = await axios.get(`http://localhost:${REACT_APP_PORT}/api/agendamentos`);
      setAgendamentos(response.data.data.$values);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
    }
  };

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const horas = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00"
  ];

  const medicos = ["Dr. Silva", "Dr. Costa", "Dra. Lima", "Dr. Rocha"];

  const getAgendamento = (hora, medico) => {
    return agendamentos.find((a) => {
      const agendamentoHora = new Date(a.dataHoraInicio).toLocaleTimeString("pt-BR", {hour: "2-digit", minute: "2-digit"});
      return agendamentoHora === hora && a.funcionario?.nome === medico;
    });
  };

  return (
    <Container>
      <div className="topo">
        <h3>segunda-feira, 28 de julho de 2025</h3>
        <button style={{padding:"8px 12px", background:"#009688", color:"#fff", border:"none", borderRadius:"5px"}}>
          + Agendar
        </button>
      </div>

      <div className="agenda">
        <div></div>
        {medicos.map((m) => (
          <div key={m} className="col-header">{m}</div>
        ))}
        {horas.map((h) => (
          <React.Fragment key={h}>
            <div className="hora">{h}</div>
            {medicos.map((m) => {
              const ag = getAgendamento(h, m);
              return (
                <div key={`${h}-${m}`} className={`slot ${ag ? "ocupado" : "disponivel"}`}>
                  {ag ? (
                    <>
                      <span><strong>{ag.cliente?.nome}</strong></span>
                      <span>{ag.servico?.nomeServico}</span>
                    </>
                  ) : (
                    <span>Disponível</span>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className="resumo">
        <div className="card">
          <strong>12</strong>
          Consultas Hoje
        </div>
        <div className="card">
          <strong>85%</strong>
          Taxa de Ocupação
        </div>
        <div className="card">
          <strong>R$ 2.150</strong>
          Receita do Dia
        </div>
        <div className="card">
          <strong>2</strong>
          Cancelamentos
        </div>
      </div>
    </Container>
  );
}

export default Agenda;
