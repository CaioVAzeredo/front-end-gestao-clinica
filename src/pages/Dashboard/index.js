import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ModalCadastrarCliente from "../../components/ModalCadastrarCliente";
import ModalNovoAtendimento from "../../components/ModalNovoAtendimento";

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
    min-width: 240px;
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: #fafafa;
    font-size: 14px;
  }

  .line-label {
    font-weight: bold;
  }

  .delete-btn {
    margin-top: 10px;
    align-self: center;      /* centraliza horizontalmente */
    background: #e53935;
    color: #fff;
    padding: 8px 14px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
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
  const [funcMap, setFuncMap] = useState({}); // idFuncionario -> nome
  const [showModal, setShowModal] = useState(false);
  const [showModalAtendimento, setShowModalAtendimento] = useState(false);

  function pagRelatorios() {
    setPagina("relatorios");
    setTitulo("Relatórios");
  }

  async function handleExcluirAgendamento(ag) {
    const id =
      ag?.idAgendamento ?? ag?.id ?? ag?.agendamentoId;

    if (!id) {
      alert("Não foi possível identificar o ID do agendamento.");
      return;
    }

    if (!window.confirm("Tem certeza que deseja excluir este agendamento?")) return;


    try {
      const resp = await fetch(
        `http://localhost:${REACT_APP_PORT}/api/agendamentos/${id}`,
        { method: "DELETE" }
      );

      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        throw new Error(`Falha ao excluir. Status ${resp.status}. ${txt}`);
      }

      // remove da lista local (proximos)
      setDados(prev => {
        const novosProximos = (prev?.proximos ?? []).filter(a => {
          const aid = a?.idAgendamento ?? a?.id ?? a?.agendamentoId;
          return aid !== id;
        });
        return { ...prev, proximos: novosProximos };
      });
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir o agendamento.");
    }
  }

  useEffect(() => {
    const fetchDados = async () => {
      const [agendamentos, clientes, servicos, funcionarios] = await Promise.all([
        fetch(`http://localhost:${REACT_APP_PORT}/api/agendamentos`).then(res => res.json()).catch(() => ({})),
        fetch(`http://localhost:${REACT_APP_PORT}/api/clientes`).then(res => res.json()).catch(() => ({})),
        fetch(`http://localhost:${REACT_APP_PORT}/api/servicos`).then(res => res.json()).catch(() => ({})),
        fetch(`http://localhost:${REACT_APP_PORT}/api/funcionarios`).then(res => res.json()).catch(() => ({})),
      ]);

      const listaAg = Array.isArray(agendamentos?.data)
        ? agendamentos.data
        : (agendamentos?.data?.$values ?? []);

      const listaClientes = Array.isArray(clientes?.data)
        ? clientes.data
        : (clientes?.data?.$values ?? []);

      const listaFuncs = Array.isArray(funcionarios?.data)
        ? funcionarios.data
        : (funcionarios?.data?.$values ?? []);

      // Cria mapa idFuncionario -> nome
      const mapa = {};
      for (const f of (listaFuncs ?? [])) {
        const id = f?.idFuncionario ?? f?.id ?? f?.funcionarioId;
        const nome = f?.nome ?? f?.name ?? "Sem nome";
        if (id != null) mapa[id] = nome;
      }
      setFuncMap(mapa);

      const hoje = new Date().toDateString();

      const atendimentosHoje = (listaAg ?? []).filter(
        a => new Date(a.dataHoraInicio).toDateString() === hoje
      ).length;

      const totalHorariosDisponiveisHoje = 8;
      const taxaOcupacao = ((atendimentosHoje / totalHorariosDisponiveisHoje) * 100).toFixed(1);

      const clientesNovos = (listaClientes ?? []).filter(c => {
        const dc = c?.dataCriacao ? new Date(c.dataCriacao) : null;
        const seteDiasAtras = new Date(new Date().setDate(new Date().getDate() - 7));
        return dc && dc >= seteDiasAtras;
      }).length;

      const receitaMes = (listaAg ?? []).reduce((acc, ag) => acc + (ag.servico?.preco || 0), 0);

      // Ordena agendamentos por data/hora e pega os próximos 5
      const proximos = [...(listaAg ?? [])]
        .sort((a, b) => new Date(a.dataHoraInicio) - new Date(b.dataHoraInicio))
        .slice(0, 5);

      setDados({
        atendimentosHoje,
        clientesNovos,
        taxaOcupacao,
        receitaMes,
        proximos,
      });
    };

    fetchDados();
  }, []);

  if (!dados) return <p>Carregando...</p>;

  return (
    <Container>
      <div className="grid">
        <div className="card">
          <div className="title">Atendimentos Hoje</div>
          <div className="value">{dados.atendimentosHoje}</div>
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

              const nomeCliente = ag?.cliente?.nome ?? "Sem nome";
              const nomeServico = ag?.servico?.nomeServico ?? "Sem serviço";

              // Resolve nome do funcionário (aninhado ou via mapa pelo funcionarioId)
              const funcNome =
                ag?.funcionario?.nome
                ?? (funcMap[ag?.funcionarioId] ?? "Sem funcionário");

              return (
                <div key={index} className="list-item">
                  <div>
                    <span className="line-label">hora do atendimento: </span>
                    <span>{hora}</span>
                  </div>
                  <div>
                    <span className="line-label">cliente: </span>
                    <span>{nomeCliente}</span>
                  </div>
                  <div>
                    <span className="line-label">funcionário: </span>
                    <span>{funcNome}</span>
                  </div>
                  <div>
                    <span className="line-label">serviço: </span>
                    <span>{nomeServico}</span>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => handleExcluirAgendamento(ag)}
                    title="Excluir agendamento"
                  >
                    Excluir
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="actions">
        <button onClick={() => setShowModalAtendimento(true)}>Agendar Atendimento</button>
        <button onClick={() => setShowModal(true)}>Cadastrar Cliente</button>
        <button onClick={pagRelatorios}>Ver Relatórios</button>
      </div>

      {showModal && <ModalCadastrarCliente onClose={() => setShowModal(false)} />}
      {showModalAtendimento && <ModalNovoAtendimento onClose={() => setShowModalAtendimento(false)} />}
    </Container>
  );
}

export default Dashboard;
