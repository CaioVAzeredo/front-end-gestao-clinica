import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
  }

  .card {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }

  .kpi {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  .kpi .value {
    font-size: 22px;
    font-weight: bold;
  }

  .kpi .label {
    color: #777;
  }

  .services-list {
    margin-top: 10px;
  }

  .service-item {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .service-item span:first-child {
    font-weight: bold;
  }

  .export {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }

  button {
    background: #009688;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    color: white;
    cursor: pointer;
  }

  button:hover {
    background: #00796b;
  }
`;

function Relatorios() {
  const [dados, setDados] = useState({
    receita: 45280,
    consultas: 342,
    novosPacientes: 47,
    crescimento: 12.5,
    comparecimento: 85,
    totalAgendado: 245,
    compareceram: 208,
    faltaram: 28,
    cancelaram: 9,
    servicos: [
      { nome: "Consulta Geral", consultas: 156, receita: 15600, variacao: 12 },
      { nome: "Exames Cardiológicos", consultas: 89, receita: 26700, variacao: 8 },
      { nome: "Dermatologia", consultas: 67, receita: 13400, variacao: -3 },
      { nome: "Pediatria", consultas: 45, receita: 9000, variacao: 15 },
      { nome: "Oftalmologia", consultas: 32, receita: 9600, variacao: 5 }
    ]
  });

  const dataChart = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Receita",
        data: [32000, 38000, 35000, 42000, 39000, 45000],
        backgroundColor: "#009688"
      }
    ]
  };

  const optionsChart = {
    responsive: true,
    plugins: {
      legend: { display: false }
    }
  };

  const handleExport = () => {
    alert("Exportar relatórios...");
  };

  return (
    <Container>
      <h2>Relatórios</h2>
      <p>{new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>

      <div className="grid">
        <div className="card">
          <div className="kpi"><span className="label">Receita Total</span><span className="value">R$ {dados.receita.toLocaleString()}</span></div>
          <div className="kpi"><span className="label">Total de Consultas</span><span className="value">{dados.consultas}</span></div>
          <div className="kpi"><span className="label">Novos Pacientes</span><span className="value">{dados.novosPacientes}</span></div>
          <div className="kpi"><span className="label">Taxa de Crescimento</span><span className="value">{dados.crescimento}%</span></div>
        </div>
        <div className="card">
          <h4>Taxa de Comparecimento</h4>
          <p style={{ fontSize: "28px", fontWeight: "bold" }}>{dados.comparecimento}%</p>
          <div className="kpi"><span>Total Agendado</span><span>{dados.totalAgendado}</span></div>
          <div className="kpi"><span>Compareceram</span><span>{dados.compareceram}</span></div>
          <div className="kpi"><span>Faltaram</span><span>{dados.faltaram}</span></div>
          <div className="kpi"><span>Cancelaram</span><span>{dados.cancelaram}</span></div>
        </div>
        <div className="card">
          <h4>Receita por Período</h4>
          <Bar data={dataChart} options={optionsChart} />
        </div>
        <div className="card">
          <h4>Serviços Mais Populares</h4>
          <div className="services-list">
            {dados.servicos.map((s, i) => (
              <div key={i} className="service-item">
                <span>{i + 1}. {s.nome}</span>
                <span>{s.consultas} consultas - R$ {(s.receita/1000).toFixed(1)}k ({s.variacao >= 0 ? "+" : ""}{s.variacao}%)</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h4>Exportar Relatórios</h4>
          <div className="export">
            <button onClick={handleExport}>Exportar PDF</button>
            <button onClick={handleExport}>Exportar Excel</button>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Relatorios;
