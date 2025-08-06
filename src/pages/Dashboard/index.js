import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ModalCadastrarCliente from "../../components/ModalCadastrarCliente";
import ModalNovaConsulta from "../../components/ModalNovaConsulta";

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
    word-break: break-word;
  }

  .positive {
    color: green;
    font-size: 14px;
  }

  .list {
    margin-top: 10px;
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 10px;
  }

  .list-item {
    flex: 0 0 auto;
    min-width: 200px;
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: #fafafa;
    font-size: 14px;
  }

  .list-item span:first-child {
    font-weight: bold;
  }

  @media (max-width: 480px) {
    .list {
      flex-direction: column;
      overflow-x: hidden;
    }

    .list-item {
      min-width: 100%;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
      background: #fff;
    }
  }

  .actions {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  button {
    background: #009688;
    color: #fff;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    flex: 1 1 auto;
    min-width: 120px;
  }

  @media (max-width: 480px) {
    padding: 10px;

    .grid {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .card {
      padding: 15px;
    }

    .title {
      font-size: 16px;
    }

    .value {
      font-size: 22px;
    }

    .list-item {
      font-size: 12px;
    }

    button {
      width: 100%;
    }
  }
`;

function Dashboard({ setPagina, setTitulo }) {
  const [dados, setDados] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalConsulta, setShowModalConsulta] = useState(false);

  function pagRelatorios() {
    setPagina("relatorios");
    setTitulo("Relatórios");
  }

  useEffect(() => {
    const fetchDados = async () => {
      const agendamentos = await fetch(`http://localhost:${REACT_APP_PORT}/api/agendamentos`).then(res => res.json());
      const clientes = await fetch(`http://localhost:${REACT_APP_PORT}/api/clientes`).then(res => res.json());
      const servicos = await fetch(`http://localhost:${REACT_APP_PORT}/api/servicos`).then(res => res.json());

      const hoje = new Date().toDateString();

      const consultasHoje = agendamentos.data.$values.filter(
        a => new Date(a.dataHoraInicio).toDateString() === hoje
      ).length;

      const totalHorariosDisponiveisHoje = 8; 
      const taxaOcupacao = ((consultasHoje / totalHorariosDisponiveisHoje) * 100).toFixed(1);

      const clientesNovos = clientes.data.$values.filter(
        c => new Date(c.dataCriacao) >= new Date(new Date().setDate(new Date().getDate() - 7))
      ).length;

      const receitaMes = agendamentos.data.$values.reduce((acc, ag) => acc + (ag.servico?.preco || 0), 0);

      setDados({
        consultasHoje,
        clientesNovos,
        taxaOcupacao,
        receitaMes,
        proximos: agendamentos.data.$values.slice(0, 5),
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
          {dados.proximos.length === 0 ? (
            <div style={{ padding: "10px", fontStyle: "italic", color: "#777" }}>
              Nenhum agendamento encontrado
            </div>
          ) : (
            dados.proximos.map((ag, index) => {
              const hora = new Date(ag.dataHoraInicio).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              });
              const nome = ag.cliente?.nome || "Sem nome";
              const servico = ag.servico?.nomeServico || "Sem serviço";

              return (
                <div key={index} className="list-item">
                  <span>{hora}</span>
                  <span>{nome}</span>
                  <span>{servico}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="actions">
        <button onClick={() => setShowModalConsulta(true)}>Nova Consulta</button>
        <button onClick={() => setShowModal(true)}>Cadastrar Cliente</button>
        <button onClick={pagRelatorios}>Ver Relatórios</button>
      </div>

      {showModal && <ModalCadastrarCliente onClose={() => setShowModal(false)} />}
      {showModalConsulta && <ModalNovaConsulta onClose={() => setShowModalConsulta(false)} />}
    </Container>
  );
}

export default Dashboard;
