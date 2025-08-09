// src/components/Relatorios/index.js
import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";

// Estilos
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

  .filters {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    align-items: center;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .filter-label {
    font-size: 14px;
    font-weight: 500;
    color: #555;
  }

  .filter-input {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
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
    transition: background-color 0.3s;
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

    .filters {
      flex-direction: column;
      align-items: stretch;
    }

    .filter-group {
      width: 100%;
    }

    .filter-input {
      width: 100%;
    }

    .tabs {
      overflow-x: auto;
      flex-wrap: nowrap;
    }

    .tab {
      flex-shrink: 0;
    }

    .grid {
      grid-template-columns: 1fr;
    }

    .card {
      padding: 15px;
    }

    .kpi {
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .kpi .value {
      font-size: 18px;
    }

    .list-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }

    .actions {
      justify-content: center;
    }

    button {
      width: 100%;
      justify-content: center;
    }
  }

  @media print {
    .tabs,
    .actions,
    button,
    .filters {
      display: none !important;
    }

    .header h2 {
      font-size: 24px;
    }

    .date-display {
      font-size: 14px;
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

  // Estados para o novo filtro de período
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

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

      // Define o período inicial como o mês atual
      const hoje = new Date();
      const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0];
      const ultimoDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).toISOString().split('T')[0];
      setDataInicio(primeiroDiaDoMes);
      setDataFim(ultimoDiaDoMes);
    } catch (e) {
      console.error("Erro na busca inicial de dados:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const processAndFilterData = useCallback(() => {
    if (loading || !allData.agendamentos.length || !dataInicio || !dataFim) {
      return;
    }

    const { agendamentos, clientes, servicos, funcionarios } = allData;
    const inicioFiltro = new Date(dataInicio);
    const fimFiltro = new Date(dataFim);
    fimFiltro.setHours(23, 59, 59, 999); // Inclui o dia final inteiro

    // DEBUG: Mostrar dados brutos
    console.log("=== DEBUG RELATÓRIOS ===");
    console.log("Dados brutos de agendamentos:", agendamentos);
    console.log("Dados brutos de serviços:", servicos);

    // Mapeamento para acesso rápido com validação de preços
    const servicosMap = servicos.reduce((map, srv) => {
      // DEBUG: Verificar cada serviço
      console.log(`Processando serviço ID ${srv.idServico}:`, srv);
      
      // Garantir que o preço seja um número válido
      const precoNumerico = parseFloat(srv.preco);
      const preco = !isNaN(precoNumerico) ? precoNumerico : 0;
      
      console.log(`Preço do serviço ${srv.idServico}:`, preco);
      
      return { ...map, [srv.idServico]: { ...srv, preco } };
    }, {});
    
    console.log("Mapa de serviços criado:", servicosMap);

    const funcionariosMap = funcionarios.reduce((map, func) => ({ ...map, [func.idFuncionario]: func }), {});

    // Filtra agendamentos com base no novo período
    const agendamentosFiltrados = agendamentos.filter((ag) => {
      const dataAg = new Date(ag.dataHoraInicio);
      return dataAg >= inicioFiltro && dataAg <= fimFiltro;
    });

    console.log("Agendamentos filtrados por período:", agendamentosFiltrados);

    // --- Indicadores de Atendimento ---
    const totalAtendimentos = agendamentosFiltrados.length;
    const compareceram = agendamentosFiltrados.filter((a) => a.statusAgenda === "HorarioMarcado").length;
    const cancelados = agendamentosFiltrados.filter((a) => a.statusAgenda === "Cancelado").length;
    const taxaComparecimento = totalAtendimentos ? ((compareceram / totalAtendimentos) * 100).toFixed(1) : "0.0";
    const taxaCancelamento = totalAtendimentos ? ((cancelados / totalAtendimentos) * 100).toFixed(1) : "0.0";

    // --- Indicadores Financeiros (COM DEBUG) ---
    const servicoContagem = {};
    const servicoReceita = {};
    const funcionarioContagem = {};
    const funcionarioReceita = {};
    let receitaTotal = 0;

    console.log("=== INICIANDO CÁLCULO FINANCEIRO ===");
    
    agendamentosFiltrados.forEach((ag, index) => {
      // DEBUG: Mostrar cada agendamento processado
      console.log(`Processando agendamento ${index + 1}:`, ag);
      
      // Verificar se o agendamento tem serviço ID
      if (!ag.servicoId) {
        console.warn(`Agendamento ${ag.idAgendamento} não possui servicoId`);
        return;
      }

      // Obter preço do serviço com verificação robusta
      const servico = servicosMap[ag.servicoId];
      
      if (!servico) {
        console.warn(`Serviço com ID ${ag.servicoId} não encontrado no mapa de serviços`);
        return;
      }

      const preco = servico && typeof servico.preco === 'number' && !isNaN(servico.preco) 
        ? servico.preco 
        : 0;
      
      console.log(`Agendamento ${ag.idAgendamento} - Serviço ${ag.servicoId} - Preço: R$ ${preco.toFixed(2)}`);
      
      // Acumular receita total com verificação
      receitaTotal += preco;
      console.log(`Receita total acumulada: R$ ${receitaTotal.toFixed(2)}`);
      
      // Contar atendimentos e receitas por serviço
      if (ag.servicoId) {
        servicoContagem[ag.servicoId] = (servicoContagem[ag.servicoId] || 0) + 1;
        servicoReceita[ag.servicoId] = (servicoReceita[ag.servicoId] || 0) + preco;
        console.log(`Serviço ${ag.servicoId} - Contagem: ${servicoContagem[ag.servicoId]}, Receita: R$ ${servicoReceita[ag.servicoId].toFixed(2)}`);
      }
      
      // Contar atendimentos e receitas por funcionário
      if (ag.funcionarioId) {
        funcionarioContagem[ag.funcionarioId] = (funcionarioContagem[ag.funcionarioId] || 0) + 1;
        funcionarioReceita[ag.funcionarioId] = (funcionarioReceita[ag.funcionarioId] || 0) + preco;
        console.log(`Funcionário ${ag.funcionarioId} - Contagem: ${funcionarioContagem[ag.funcionarioId]}, Receita: R$ ${funcionarioReceita[ag.funcionarioId].toFixed(2)}`);
      }
    });

    console.log("=== RESULTADOS FINANCEIROS ===");
    console.log("Receita Total Final: R$", receitaTotal);
    console.log("Serviço Contagem:", servicoContagem);
    console.log("Serviço Receita:", servicoReceita);
    console.log("Funcionário Contagem:", funcionarioContagem);
    console.log("Funcionário Receita:", funcionarioReceita);

    // Calcular ticket médio com proteção contra divisão por zero
    const ticketMedio = totalAtendimentos > 0 ? (receitaTotal / totalAtendimentos) : 0;
    console.log("Ticket Médio: R$", ticketMedio);

    // --- Indicadores de Clientes ---
    const totalClientes = clientes.length;
    const clientesAtivos = clientes.filter((c) => c.ativo).length;
    const clientesInativos = totalClientes - clientesAtivos;
    const novosClientes = clientes.filter((c) => {
      const dataCriacao = new Date(c.dataCriacao);
      return dataCriacao >= inicioFiltro && dataCriacao <= fimFiltro;
    }).length;

    // --- Gráficos (dados reais) ---
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const atendimentosPorDia = diasSemana.map((dia, index) => {
      const count = agendamentosFiltrados.filter((ag) => new Date(ag.dataHoraInicio).getDay() === index).length;
      return { dia, count };
    });
    const maxAtendimentos = Math.max(...atendimentosPorDia.map((d) => d.count), 1);
    
    // Dados para o gráfico de clientes (ativos/inativos)
    const clientesPorStatus = [
      { status: "Ativos", count: clientesAtivos, color: "#00a884" },
      { status: "Inativos", count: clientesInativos, color: "#6c757d" }
    ];
    const maxClientesStatus = Math.max(clientesAtivos, clientesInativos, 1);

    // --- Atualização do Estado do Relatório ---
    const dadosRelatorio = {
      totalAtendimentos,
      taxaComparecimento,
      taxaCancelamento,
      receita: receitaTotal,
      ticketMedio,
      totalClientes,
      clientesAtivos,
      clientesInativos,
      novosClientes,
      servicos: [...servicos].sort((a, b) => (servicoContagem[b.idServico] || 0) - (servicoContagem[a.idServico] || 0)).slice(0, 5),
      servicoContagem,
      servicoReceita,
      funcionarios: [...funcionarios].sort((a, b) => (funcionarioContagem[b.idFuncionario] || 0) - (funcionarioContagem[a.idFuncionario] || 0)).slice(0, 5),
      funcionarioContagem,
      funcionarioReceita,
      atendimentosPorDia,
      maxAtendimentos,
      clientesPorStatus,
      maxClientesStatus
    };

    console.log("=== RELATÓRIO FINAL ===");
    console.log("Dados do relatório:", dadosRelatorio);

    setRelatorio(dadosRelatorio);
  }, [allData, dataInicio, dataFim, loading]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    processAndFilterData();
  }, [allData, dataInicio, dataFim, processAndFilterData]);

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
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="filters">
        <div className="filter-group">
          <span className="filter-label">Data de Início</span>
          <input type="date" className="filter-input" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        </div>
        <div className="filter-group">
          <span className="filter-label">Data de Fim</span>
          <input type="date" className="filter-input" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        </div>
      </div>

      <div className="tabs">
        <div className={`tab ${activeTab === "atendimento" ? "active" : ""}`} onClick={() => setActiveTab("atendimento")}>
          Atendimento
        </div>
        <div className={`tab ${activeTab === "financeiro" ? "active" : ""}`} onClick={() => setActiveTab("financeiro")}>
          Financeiro
        </div>
        <div className={`tab ${activeTab === "cliente" ? "active" : ""}`} onClick={() => setActiveTab("cliente")}>
          Cliente
        </div>
        <div className={`tab ${activeTab === "servicos" ? "active" : ""}`} onClick={() => setActiveTab("servicos")}>
          Serviços
        </div>
        <div className={`tab ${activeTab === "funcionarios" ? "active" : ""}`} onClick={() => setActiveTab("funcionarios")}>
          Funcionários
        </div>
      </div>

      {/* Aba Atendimento */}
      <div className={`tab-content ${activeTab === "atendimento" ? "active" : ""}`}>
        <div className="grid">
          <div className="card">
            <div className="card-title">Atendimentos</div>
            <div className="kpi">
              <span className="label">Total</span>
              <span className="value">{relatorio.totalAtendimentos}</span>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Taxas</div>
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
              {relatorio.atendimentosPorDia.map((dia, index) => (
                <div 
                  key={index} 
                  className="chart-bar" 
                  style={{ 
                    height: `${(relatorio.maxAtendimentos > 0 ? (dia.count / relatorio.maxAtendimentos) : 0) * 150}px`,
                    backgroundColor: "#00a884",
                    transition: 'height 0.5s ease'
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

      {/* Aba Financeiro */}
      <div className={`tab-content ${activeTab === "financeiro" ? "active" : ""}`}>
        <div className="grid">
          <div className="card">
            <div className="card-title">Receita Total</div>
            <div className="kpi">
              <span className="label">Período Selecionado</span>
              <span className="value">R$ {relatorio.receita.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Indicadores Financeiros</div>
            <div className="kpi">
              <span className="label">Ticket Médio</span>
              <span className="value">R$ {relatorio.ticketMedio.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Aba Cliente */}
      <div className={`tab-content ${activeTab === "cliente" ? "active" : ""}`}>
        <div className="grid">
          <div className="card">
            <div className="card-title">Clientes</div>
            <div className="kpi">
              <span className="label">Total Cadastrados</span>
              <span className="value">{relatorio.totalClientes}</span>
            </div>
            <div className="kpi">
              <span className="label">Ativos</span>
              <span className="value">{relatorio.clientesAtivos}</span>
            </div>
            <div className="kpi">
              <span className="label">Inativos</span>
              <span className="value">{relatorio.clientesInativos}</span>
            </div>
            <div className="kpi">
              <span className="label">Novos (no período)</span>
              <span className="value">{relatorio.novosClientes}</span>
            </div>
          </div>
          <div className="card">
            <div className="card-title">Distribuição de Clientes</div>
            <div className="chart-container">
              {relatorio.clientesPorStatus.map((item, index) => (
                <div 
                  key={index} 
                  className="chart-bar" 
                  style={{ 
                    height: `${(relatorio.maxClientesStatus > 0 ? (item.count / relatorio.maxClientesStatus) : 0) * 150}px`,
                    backgroundColor: item.color,
                    transition: 'height 0.5s ease'
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

      {/* Aba Serviços */}
      <div className={`tab-content ${activeTab === "servicos" ? "active" : ""}`}>
        <div className="grid">
          <div className="card">
            <div className="card-title">Serviços Mais Populares</div>
            <div className="services-list">
              {relatorio.servicos.map((servico, index) => (
                <div key={servico.idServico} className="list-item">
                  <span>
                    {index + 1}. {servico.nomeServico}
                  </span>
                  <span>{relatorio.servicoContagem[servico.idServico] || 0} atendimentos</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-title">Receita por Serviço</div>
            <div className="services-list">
              {relatorio.servicos.map((servico, index) => (
                <div key={servico.idServico} className="list-item">
                  <span>
                    {index + 1}. {servico.nomeServico}
                  </span>
                  <span>R$ {(relatorio.servicoReceita[servico.idServico] || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Aba Funcionários */}
      <div className={`tab-content ${activeTab === "funcionarios" ? "active" : ""}`}>
        <div className="grid">
          <div className="card">
            <div className="card-title">Funcionários Mais Produtivos</div>
            <div className="professionals-list">
              {relatorio.funcionarios.map((funcionario, index) => (
                <div key={funcionario.idFuncionario} className="list-item">
                  <span>
                    {index + 1}. {funcionario.nome}
                  </span>
                  <span>{relatorio.funcionarioContagem[funcionario.idFuncionario] || 0} atendimentos</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-title">Receita por Funcionário</div>
            <div className="professionals-list">
              {relatorio.funcionarios.map((funcionario, index) => (
                <div key={funcionario.idFuncionario} className="list-item">
                  <span>
                    {index + 1}. {funcionario.nome}
                  </span>
                  <span>R$ {(relatorio.funcionarioReceita[funcionario.idFuncionario] || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="actions">
        <button onClick={handlePrint}>
          <span>🖨️</span> Imprimir Relatório
        </button>
      </div>
    </Container>
  );
}

export default Relatorios;