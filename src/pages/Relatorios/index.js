import React, { useEffect, useState } from "react";
import styled from "styled-components";
const REACT_APP_PORT = process.env.REACT_APP_PORT;

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

  .services-list, .professionals-list {
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

  button.secondary {
    background: #6c757d;
  }

  button.secondary:hover {
    background: #5a6268;
  }

  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      align-items: flex-start;
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
  }

  @media print {
    .tabs, .actions, button {
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

function Relatorios() {
  const [relatorio, setRelatorio] = useState(null);
  const [activeTab, setActiveTab] = useState("atendimento");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);
      try {
        const [agResp, cliResp, srvResp, funcResp] = await Promise.all([
          fetch(`http://localhost:${REACT_APP_PORT}/api/agendamentos`).then((res) => res.json()),
          fetch(`http://localhost:${REACT_APP_PORT}/api/clientes`).then((res) => res.json()),
          fetch(`http://localhost:${REACT_APP_PORT}/api/servicos`).then((res) => res.json()),
          fetch(`http://localhost:${REACT_APP_PORT}/api/funcionarios`).then((res) => res.json())
        ]);

        // Normalização robusta para múltiplos formatos
        const toList = (payload) =>
          Array.isArray(payload?.data)
            ? payload.data
            : Array.isArray(payload)
            ? payload
            : (payload?.data?.$values ?? payload?.$values ?? []);

        const agList = toList(agResp);
        const cliList = toList(cliResp);
        const srvList = toList(srvResp);
        const funcList = toList(funcResp);

        // Criar mapas para acesso rápido
        const servicosMap = {};
        srvList.forEach(servico => {
          servicosMap[servico.idServico] = servico;
        });

        const funcionariosMap = {};
        funcList.forEach(func => {
          funcionariosMap[func.idFuncionario] = func;
        });

        // Indicadores de Atendimento
        const totalAtendimentos = agList.length;
        const atendimentosHoje = agList.filter(ag => {
          const hoje = new Date();
          const dataAg = new Date(ag.dataHoraInicio);
          return dataAg.toDateString() === hoje.toDateString();
        }).length;
        
        const atendimentosSemana = agList.filter(ag => {
          const hoje = new Date();
          const inicioSemana = new Date(hoje);
          inicioSemana.setDate(hoje.getDate() - hoje.getDay());
          const dataAg = new Date(ag.dataHoraInicio);
          return dataAg >= inicioSemana && dataAg <= hoje;
        }).length;
        
        const atendimentosMes = agList.filter(ag => {
          const hoje = new Date();
          const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
          const dataAg = new Date(ag.dataHoraInicio);
          return dataAg >= inicioMes && dataAg <= hoje;
        }).length;
        
        const compareceram = agList.filter((a) => a.statusAgenda === "HorarioMarcado").length;
        const cancelados = agList.filter((a) => a.statusAgenda === "Cancelado").length;
        const taxaComparecimento = totalAtendimentos
          ? ((compareceram / totalAtendimentos) * 100).toFixed(1)
          : "0.0";
        const taxaCancelamento = totalAtendimentos
          ? ((cancelados / totalAtendimentos) * 100).toFixed(1)
          : "0.0";

        // Indicadores Financeiros - CORRIGIDO
        let receita = 0;
        let receitaHoje = 0;
        let receitaSemana = 0;
        let receitaMes = 0;
        
        // Contadores auxiliares para serviços e funcionários
        const servicoContagem = {};
        const servicoReceita = {};
        const funcionarioContagem = {};
        const funcionarioReceita = {};
        
        const hoje = new Date();
        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - hoje.getDay());
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        
        agList.forEach(ag => {
          // Obter preço do serviço através do mapa
          const servico = servicosMap[ag.servicoId];
          const preco = servico ? parseFloat(servico.preco) || 0 : 0;
          
          // Acumular receita total
          receita += preco;
          
          // Contar atendimentos por serviço
          if (ag.servicoId) {
            servicoContagem[ag.servicoId] = (servicoContagem[ag.servicoId] || 0) + 1;
            servicoReceita[ag.servicoId] = (servicoReceita[ag.servicoId] || 0) + preco;
          }
          
          // Contar atendimentos por funcionário
          if (ag.funcionarioId) {
            funcionarioContagem[ag.funcionarioId] = (funcionarioContagem[ag.funcionarioId] || 0) + 1;
            funcionarioReceita[ag.funcionarioId] = (funcionarioReceita[ag.funcionarioId] || 0) + preco;
          }
          
          // Receita de hoje
          const dataAg = new Date(ag.dataHoraInicio);
          if(dataAg.toDateString() === hoje.toDateString()) {
            receitaHoje += preco;
          }
          
          // Receita da semana
          if(dataAg >= inicioSemana && dataAg <= hoje) {
            receitaSemana += preco;
          }
          
          // Receita do mês
          if(dataAg >= inicioMes && dataAg <= hoje) {
            receitaMes += preco;
          }
        });
        
        const ticketMedio = totalAtendimentos ? (receita / totalAtendimentos) : 0;

        // Indicadores de Clientes
        const totalClientes = cliList.length;
        const clientesAtivos = cliList.filter(c => c.ativo).length;
        const clientesInativos = totalClientes - clientesAtivos;
        const novosClientesMes = cliList.filter(c => {
          const dataCriacao = new Date(c.dataCriacao);
          const hoje = new Date();
          return dataCriacao.getMonth() === hoje.getMonth() && 
                 dataCriacao.getFullYear() === hoje.getFullYear();
        }).length;

        // Indicadores de Serviços - CORRIGIDO
        // Ordenar serviços por popularidade
        const servicosOrdenados = [...srvList].sort((a, b) => {
          const countA = servicoContagem[a.idServico] || 0;
          const countB = servicoContagem[b.idServico] || 0;
          return countB - countA;
        });
        
        // Indicadores de Funcionários - CORRIGIDO
        // Ordenar funcionários por produtividade
        const funcionariosOrdenados = [...funcList].sort((a, b) => {
          const countA = funcionarioContagem[a.idFuncionario] || 0;
          const countB = funcionarioContagem[b.idFuncionario] || 0;
          return countB - countA;
        });

        setRelatorio({
          // Atendimento
          totalAtendimentos,
          atendimentosHoje,
          atendimentosSemana,
          atendimentosMes,
          taxaComparecimento,
          taxaCancelamento,
          
          // Financeiro
          receita,
          receitaHoje,
          receitaSemana,
          receitaMes,
          ticketMedio,
          
          // Clientes
          totalClientes,
          clientesAtivos,
          clientesInativos,
          novosClientesMes,
          
          // Serviços
          servicos: servicosOrdenados.slice(0, 5),
          servicoContagem,
          servicoReceita,
          
          // Funcionários
          funcionarios: funcionariosOrdenados.slice(0, 5),
          funcionarioContagem,
          funcionarioReceita
        });
      } catch (error) {
        console.error("Erro ao buscar dados para relatórios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    alert("Funcionalidade de exportação em desenvolvimento.");
  };

  if (loading) return <Container><p>Carregando relatórios...</p></Container>;
  if (!relatorio) return <Container><p>Erro ao carregar relatórios.</p></Container>;

  // Dados para gráficos
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const atendimentosPorDia = diasSemana.map((dia, index) => {
    const count = relatorio.totalAtendimentos 
      ? Math.floor(Math.random() * 20) + 5 // Simulação de dados
      : 0;
    return { dia, count };
  });

  const maxAtendimentos = Math.max(...atendimentosPorDia.map(d => d.count), 1);

  return (
    <Container id="relatorio-container">
      <div className="header">
        <h2>Relatórios Gerenciais</h2>
        <div className="date-display">
          {new Date().toLocaleDateString("pt-BR", { 
            weekday: "long", 
            day: "2-digit", 
            month: "long", 
            year: "numeric" 
          })}
        </div>
      </div>

      <div className="tabs">
        <div 
          className={`tab ${activeTab === "atendimento" ? "active" : ""}`}
          onClick={() => setActiveTab("atendimento")}
        >
          Atendimento
        </div>
        <div 
          className={`tab ${activeTab === "financeiro" ? "active" : ""}`}
          onClick={() => setActiveTab("financeiro")}
        >
          Financeiro
        </div>
        <div 
          className={`tab ${activeTab === "cliente" ? "active" : ""}`}
          onClick={() => setActiveTab("cliente")}
        >
          Cliente
        </div>
        <div 
          className={`tab ${activeTab === "servicos" ? "active" : ""}`}
          onClick={() => setActiveTab("servicos")}
        >
          Serviços
        </div>
        <div 
          className={`tab ${activeTab === "funcionarios" ? "active" : ""}`}
          onClick={() => setActiveTab("funcionarios")}
        >
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
            <div className="kpi">
              <span className="label">Hoje</span>
              <span className="value">{relatorio.atendimentosHoje}</span>
            </div>
            <div className="kpi">
              <span className="label">Esta Semana</span>
              <span className="value">{relatorio.atendimentosSemana}</span>
            </div>
            <div className="kpi">
              <span className="label">Este Mês</span>
              <span className="value">{relatorio.atendimentosMes}</span>
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
              {atendimentosPorDia.map((dia, index) => (
                <div 
                  key={index} 
                  className="chart-bar"
                  style={{ height: `${(dia.count / maxAtendimentos) * 150}px` }}
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
              <span className="label">Total</span>
              <span className="value">R$ {relatorio.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="kpi">
              <span className="label">Hoje</span>
              <span className="value">R$ {relatorio.receitaHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="kpi">
              <span className="label">Esta Semana</span>
              <span className="value">R$ {relatorio.receitaSemana.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="kpi">
              <span className="label">Este Mês</span>
              <span className="value">R$ {relatorio.receitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
          
          <div className="card">
            <div className="card-title">Indicadores Financeiros</div>
            <div className="kpi">
              <span className="label">Ticket Médio</span>
              <span className="value">R$ {relatorio.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
              <span className="label">Novos (este mês)</span>
              <span className="value">{relatorio.novosClientesMes}</span>
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
                  <span>{index + 1}. {servico.nomeServico}</span>
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
                  <span>{index + 1}. {servico.nomeServico}</span>
                  <span>R$ {(relatorio.servicoReceita[servico.idServico] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                  <span>{index + 1}. {funcionario.nome}</span>
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
                  <span>{index + 1}. {funcionario.nome}</span>
                  <span>R$ {(relatorio.funcionarioReceita[funcionario.idFuncionario] || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="secondary" onClick={handleExport}>
          <span>📊</span> Exportar
        </button>
        <button onClick={handlePrint}>
          <span>🖨️</span> Imprimir Relatório
        </button>
      </div>
    </Container>
  );
}

export default Relatorios;