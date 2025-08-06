import React, { useEffect, useState } from "react";
import styled from "styled-components";
const REACT_APP_PORT = process.env.REACT_APP_PORT;

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .card {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }

  .title {
    font-size: 18px;
    font-weight: bold;
  }

  .value {
    font-size: 28px;
    font-weight: bold;
    margin-top: 5px;
  }

  .positive {
    color: green;
    font-size: 14px;
  }

  .list {
    margin-top: 10px;
  }

  .list-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .actions {
    margin-top: 20px;
    display: flex;
    gap: 10px;
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

function Dashboard() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    const fetchDados = async () => {
      const agendamentos = await fetch(`http://localhost:${REACT_APP_PORT}/api/agendamentos`).then(res => res.json());
      const clientes = await fetch(`http://localhost:${REACT_APP_PORT}/api/clientes`).then(res => res.json());
      const servicos = await fetch(`http://localhost:${REACT_APP_PORT}/api/servicos`).then(res => res.json());

      const consultasHoje = agendamentos.data.$values.filter(a => new Date(a.dataHoraInicio).toDateString() === new Date().toDateString()).length;
      const clientesNovos = clientes.data.$values.filter(c => new Date(c.dataCriacao) >= new Date(new Date().setDate(new Date().getDate() - 7))).length;
      const taxaOcupacao = "85"; // calculo real depende da agenda completa
      const receitaMes = agendamentos.data.$values.reduce((acc, ag) => acc + (ag.servico?.preco || 0), 0);

      setDados({
        consultasHoje,
        clientesNovos,
        taxaOcupacao,
        receitaMes,
        proximos: agendamentos.data.$values.slice(0, 5)
      });
    };

    fetchDados();
  }, []);

  if (!dados) return <p>Carregando...</p>;

  return (
    <Container>
      <div className="grid">
        <div className="card">
          <div className="title">Consultas Hoje</div>
          <div className="value">{dados.consultasHoje}</div>
          <div className="positive">+15% vs ontem</div>
        </div>
        <div className="card">
          <div className="title">Clientes Novos</div>
          <div className="value">{dados.clientesNovos}</div>
          <div className="positive">+3 esta semana</div>
        </div>
        <div className="card">
          <div className="title">Taxa de Ocupação</div>
          <div className="value">{dados.taxaOcupacao}%</div>
          <div className="positive">+5% vs mês passado</div>
        </div>
        <div className="card">
          <div className="title">Receita do Mês</div>
          <div className="value">R$ {dados.receitaMes.toLocaleString()}</div>
          <div className="positive">+12% vs mês anterior</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="title">Próximos Agendamentos</div>
        <div className="list">
          {dados.proximos.map((ag, i) => (
            <div key={i} className="list-item">
              <span>{new Date(ag.dataHoraInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span>{ag.cliente?.nome}</span>
              <span>{ag.servico?.nomeServico}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="actions">
        <button>Nova Consulta</button>
        <button>Cadastrar Cliente</button>
        <button>Ver Relatórios</button>
      </div>
    </Container>
  );
}

export default Dashboard;
