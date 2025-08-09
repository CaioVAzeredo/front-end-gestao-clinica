// src/components/Relatorios/index.js
import React, { useEffect, useState, useCallback, useMemo } from "react";
import styled from "styled-components";

// Estilos (sem alterações)
const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .header h2 {
    margin: 0;
    color: #333;
  }

  .date-display {
    color: #666;
    font-size: 16px;
  }

  .tabs {
    display: flex;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .tab {
    padding: 12px 20px;
    cursor: pointer;
    background-color: #e0e0e0;
    border: 1px solid #ddd;
    border-bottom: none;
    border-radius: 5px 5px 0 0;
    margin-right: 5px;
    font-weight: 500;
    font-family: inherit;
    font-size: 16px;
    color: #333;
    transition: background-color 0.3s, color 0.3s;
  }

  .tab:hover {
    background-color: #d5d5d5;
  }

  .tab.active {
    background-color: #00a884;
    color: white;
    border-color: #00a884;
  }

  .tab-content {
    display: none;
  }

  .tab-content.active {
    display: block;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .card {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .card-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }

  .kpi {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .kpi:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .kpi .value {
    font-size: 22px;
    font-weight: bold;
    color: #00a884;
  }

  .kpi .label {
    color: #777;
    font-size: 14px;
  }

  .chart-container {
    height: 200px;
    display: flex;
    align-items: flex-end;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 15px;
  }

  .chart-bar {
    flex: 1;
    background-color: #00a884;
    text-align: center;
    color: white;
    font-size: 12px;
    position: relative;
    transition: height 0.3s ease;
  }

  .chart-bar-label {
    position: absolute;
    bottom: -20px;
    left: 0;
    right: 0;
    font-size: 12px;
    color: #666;
  }

  .chart-bar-value {
    position: absolute;
    top: -20px;
    left: 0;
    right: 0;
    font-weight: bold;
  }

  .services-list,
  .professionals-list {
    margin-top: 10px;
  }

  .list-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .list-item:last-child {
    border-bottom: none;
  }

  .list-item span:first-child {
    font-weight: 500;
  }

  .list-item span:last-child {
    font-weight: bold;
    color: #00a884;
  }

  .actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    justify-content: flex-end;
  }

  button {
    background: #00a884;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  button:hover {
    background: #00796b;
  }

  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      align-items: flex-start;
    }
    .grid {
      grid-template-columns: 1fr;
    }
  }

  @media print {
    .tabs,
    .actions {
      display: none !important;
    }
    .header h2 {
      font-size: 24px;
    }
    .card {
      box-shadow: none;
      border: 1px solid #ddd;
    }
    .tab-content.active {
      display: block !important;
    }
  }
`;

const API_BASE_URL = `http://localhost:${process.env.REACT_APP_PORT}/api`;



const maskPhoneBR = (tel = "") => {
  const d = String(tel).replace(/\D/g, "");
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
};

const maskCPF = (cpf = "") =>
  String(cpf).replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{0,2}).*/, "$1.$2.$3-$4");

function Relatorios() {
  const [allData, setAllData] = useState({
    agendamentos: [],
    clientes: [],
    servicos: [],
    funcionarios: [],
  });
  const [relatorio, setRelatorio] = useState(null);
  const [activeTab, setActiveTab] = useState("atendimento");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [agResp, cliResp, srvResp, funcResp] = await Promise.all([
        fetch(`${API_BASE_URL}/agendamentos`).then((res) => {
          if (!res.ok) throw new Error("Erro ao buscar agendamentos.");
          return res.json();
        }),
        fetch(`${API_BASE_URL}/clientes`).then((res) => {
          if (!res.ok) throw new Error("Erro ao buscar clientes.");
          return res.json();
        }),
        fetch(`${API_BASE_URL}/servicos`).then((res) => {
          if (!res.ok) throw new Error("Erro ao buscar serviços.");
          return res.json();
        }),
        fetch(`${API_BASE_URL}/funcionarios`).then((res) => {
          if (!res.ok) throw new Error("Erro ao buscar funcionários.");
          return res.json();
        }),
      ]);

      const toList = (payload) =>
        Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : payload?.$values || [];

      setAllData({
        agendamentos: toList(agResp),
        clientes: toList(cliResp),
        servicos: toList(srvResp),
        funcionarios: toList(funcResp),
      });
    } catch (e) {
      console.error("Erro na busca inicial de dados:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const servicosInfoMap = useMemo(() =>
    allData.servicos.reduce((map, srv) => {
      map[srv.idServico] = srv;
      return map;
    }, {}),
    [allData.servicos]);

  const funcionariosInfoMap = useMemo(() =>
    allData.funcionarios.reduce((map, func) => {
      map[String(func.idFuncionario)] = func; // chave sempre string
      return map;
    }, {}),
    [allData.funcionarios]);


  const processAllData = useCallback(() => {
    const { agendamentos, clientes } = allData;

    // Contagens baseadas nos agendamentos (se existir)
    const agendamentosTotais = agendamentos || [];
    const totalAtendimentos = agendamentosTotais.length;

    const compareceram = agendamentosTotais.filter((a) => a.statusAgenda === "HorarioMarcado").length;
    const cancelados = agendamentosTotais.filter((a) => a.statusAgenda === "Cancelado").length;
    const taxaComparecimento = totalAtendimentos ? ((compareceram / totalAtendimentos) * 100).toFixed(1) : "0.0";
    const taxaCancelamento = totalAtendimentos ? ((cancelados / totalAtendimentos) * 100).toFixed(1) : "0.0";

    const servicoContagem = {};
    const funcionarioContagem = {};

    agendamentosTotais.forEach((ag) => {
      const sid = ag.servicoId ?? ag.idServico ?? ag.servico?.idServico;
      if (sid != null) {
        const key = String(sid);
        servicoContagem[key] = (servicoContagem[key] || 0) + 1;
      }

      const fid = ag.funcionarioId ?? ag.idFuncionario ?? ag.funcionario?.idFuncionario;
      if (fid != null) {
        const key = String(fid);
        funcionarioContagem[key] = (funcionarioContagem[key] || 0) + 1;
      }
    });

    // Serviços populares (se houver agendamentos); senão fica vazio
    const servicosPopulares = Object.entries(servicoContagem)
      .map(([id, contagem]) => ({
        id,
        nome: servicosInfoMap[id]?.nomeServico || "Serviço Desconhecido",
        contagem,
      }))
      .sort((a, b) => b.contagem - a.contagem)
      .slice(0, 5);

    // Funcionários produtivos com fallback:
    // se não houver contagem (sem agendamentos), lista todos com contagem 0
    let funcionariosProdutivos = Object.entries(funcionarioContagem)
      .map(([id, contagem]) => ({
        id,
        nome: funcionariosInfoMap[id]?.nome || "Funcionário Desconhecido",
        contagem,
      }))
      .sort((a, b) => b.contagem - a.contagem)
      .slice(0, 5);

    if (funcionariosProdutivos.length === 0) {
      funcionariosProdutivos = (allData.funcionarios || [])
        .map((f) => ({
          id: String(f.idFuncionario),
          nome: f.nome || "Funcionário",
          contagem: 0,
        }))
        .sort((a, b) => a.nome.localeCompare(b.nome))
        .slice(0, 5);
    }

    // Indicadores de Cliente Globais
    const totalClientes = (clientes || []).length;
    const clientesAtivos = (clientes || []).filter((c) => c.ativo).length;
    const clientesInativos = totalClientes - clientesAtivos;

    // Gráfico de Ativos vs Inativos
    const clientesPorStatus = [
      { status: "Ativos", count: clientesAtivos, color: "#00a884" },
      { status: "Inativos", count: clientesInativos, color: "#6c757d" },
    ];
    const maxClientesStatus = Math.max(clientesAtivos, clientesInativos, 1);

    // Distribuição semanal (contagem por dia da semana)
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const atendimentosPorDia = diasSemana.map((_, index) => {
      const count = agendamentosTotais.filter(
        (ag) => new Date(ag.dataHoraInicio).getDay() === index
      ).length;
      return { dia: diasSemana[index], count };
    });
    const maxAtendimentos = Math.max(...atendimentosPorDia.map((d) => d.count), 1);

    setRelatorio({
      totalAtendimentos,
      taxaComparecimento,
      taxaCancelamento,
      totalClientes,
      clientesAtivos,
      clientesInativos,
      clientesPorStatus,
      maxClientesStatus,
      servicos: servicosPopulares,
      funcionarios: funcionariosProdutivos,
      atendimentosPorDia,
      maxAtendimentos,
    });
  }, [allData, servicosInfoMap, funcionariosInfoMap]);


  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    if (!loading) {
      processAllData();
    }
  }, [loading, processAllData]);

  const handlePrint = () => window.print();

  if (loading) return <Container><p>Carregando relatórios...</p></Container>;
  if (error) return <Container><p style={{ color: "red" }}>Erro ao carregar dados: {error}</p></Container>;
  if (!relatorio) return <Container><p>Nenhum dado de relatório disponível.</p></Container>;

  return (
    <Container id="relatorio-container">
      <div className="header">
        <h2>Relatórios Gerenciais</h2>
        <div className="date-display">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long", day: "2-digit", month: "long", year: "numeric",
          })}
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === "atendimento" ? "active" : ""}`} onClick={() => setActiveTab("atendimento")}>
          Atendimento
        </button>
        <button className={`tab ${activeTab === "cliente" ? "active" : ""}`} onClick={() => setActiveTab("cliente")}>
          Cliente
        </button>
        <button className={`tab ${activeTab === "servicos" ? "active" : ""}`} onClick={() => setActiveTab("servicos")}>
          Serviços
        </button>
        <button className={`tab ${activeTab === "funcionarios" ? "active" : ""}`} onClick={() => setActiveTab("funcionarios")}>
          Funcionários
        </button>
      </div>

      <div className={`tab-content ${activeTab === "atendimento" ? "active" : ""}`}>
        <div className="grid">
          <div className="card">
            <div className="card-title">Atendimentos (Geral)</div>
            <div className="kpi">
              <span className="label">Total</span>
              <span className="value">{relatorio.totalAtendimentos}</span>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Taxas (Geral)</div>
            <div className="kpi">
              <span className="label">Comparecimento</span>
              <span className="value">{relatorio.taxaComparecimento}%</span>
            </div>
            <div className="kpi">
              <span className="label">Cancelamento</span>
              <span className="value">{relatorio.taxaCancelamento}%</span>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Distribuição Semanal</div>
            <div className="chart-container">
              {relatorio.atendimentosPorDia.map((dia) => (
                <div
                  key={dia.dia}
                  className="chart-bar"
                  style={{
                    height: `${(relatorio.maxAtendimentos > 0 ? (dia.count / relatorio.maxAtendimentos) : 0) * 150}px`,
                  }}
                >
                  <div className="chart-bar-value">{dia.count}</div>
                  <div className="chart-bar-label">{dia.dia}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`tab-content ${activeTab === "cliente" ? "active" : ""}`}>
        <div className="grid">
          <div className="card">
            <div className="card-title">Base de Clientes</div>
            <div className="kpi">
              <span className="label">Total Cadastrados</span>
              <span className="value">{relatorio.totalClientes}</span>
            </div>
            <div className="kpi">
              <span className="label">Clientes Ativos</span>
              <span className="value">{relatorio.clientesAtivos}</span>
            </div>
            <div className="kpi">
              <span className="label">Clientes Inativos</span>
              <span className="value">{relatorio.clientesInativos}</span>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Distribuição de Clientes</div>
            <div className="chart-container">
              {relatorio.clientesPorStatus.map((item) => (
                <div
                  key={item.status}
                  className="chart-bar"
                  style={{
                    height: `${(relatorio.maxClientesStatus > 0 ? (item.count / relatorio.maxClientesStatus) : 0) * 150}px`,
                    backgroundColor: item.color,
                  }}
                >
                  <div className="chart-bar-value">{item.count}</div>
                  <div className="chart-bar-label">{item.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`tab-content ${activeTab === "servicos" ? "active" : ""}`}>
        <div className="grid">
          <div className="card">
            <div className="card-title">Serviços Mais Populares (Geral)</div>
            <div className="services-list">
              {relatorio.servicos.length > 0 ? relatorio.servicos.map((servico, index) => (
                <div key={servico.id} className="list-item">
                  <span>{index + 1}. {servico.nome}</span>
                  <span>{servico.contagem} atendimentos</span>
                </div>
              )) : <p>Nenhum serviço registrado.</p>}
            </div>
          </div>
        </div>
      </div>

      <div className={`tab-content ${activeTab === "funcionarios" ? "active" : ""}`}>
        <div className="grid">
          <div className="card">
            <div className="card-title">Funcionários Mais Produtivos (Geral)</div>
            <div className="professionals-list">
              {relatorio.funcionarios.length > 0 ? (
                relatorio.funcionarios.map((f, index) => {
                  const info = funcionariosInfoMap[String(f.id)] || {};
                  const nome = info.nome || "Funcionário Desconhecido";
                  const perfil = info.perfil || "—";
                  const email = info.email || "—";
                  const telefone = info.telefone ? maskPhoneBR(info.telefone) : "—";
                  const cpf = info.cpf ? maskCPF(info.cpf) : "—";

                  return (
                    <div
                      key={f.id}
                      className="list-item"
                      style={{ flexDirection: "column", alignItems: "flex-start", gap: 4 }}
                    >
                      <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                        <span>
                          {index + 1}. {nome} — {perfil}
                        </span>
                        <span>{f.contagem} atendimentos</span>
                      </div>

                      <div style={{ fontSize: 13, color: "#555" }}>
                        <div><strong>E-mail:</strong> {email}</div>
                        <div><strong>Telefone:</strong> {telefone}</div>
                        <div><strong>CPF:</strong> {cpf}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>Nenhum funcionário encontrado.</p>
              )}
            </div>
          </div>
        </div>
      </div>



      <div className="actions">
        <button onClick={handlePrint}>
          <span role="img" aria-label="Impressora">🖨️</span> Imprimir Relatório
        </button>
      </div>
    </Container>
  );
}

export default Relatorios;