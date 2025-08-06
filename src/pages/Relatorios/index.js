import React, { useEffect, useState } from "react";
import styled from "styled-components";
const REACT_APP_PORT = process.env.REACT_APP_PORT;

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
  const [relatorio, setRelatorio] = useState(null);

  useEffect(() => {
    const fetchDados = async () => {
      // Aqui você vai chamar sua API real
      const agendamentos = await fetch(`http://localhost:${REACT_APP_PORT}/api/agendamentos`)
        .then((res) => res.json());
      const clientes = await fetch(`http://localhost:${REACT_APP_PORT}/api/clientes`)
        .then((res) => res.json());
      const servicos = await fetch(`http://localhost:${REACT_APP_PORT}/api/servicos`)
        .then((res) => res.json());

      const totalConsultas = agendamentos.data.$values.length;
      const totalClientes = clientes.data.$values.length;
      const listaServicos = servicos.data.$values;

      const receita = agendamentos.data.$values.reduce((acc, ag) => acc + (ag.servico?.preco || 0), 0);
      const compareceram = agendamentos.data.$values.filter((a) => a.statusAgenda === "HorarioMarcado").length;
      const taxaComparecimento = ((compareceram / totalConsultas) * 100).toFixed(1);

      setRelatorio({
        totalConsultas,
        totalClientes,
        receita,
        taxaComparecimento,
        servicos: listaServicos
      });
    };

    fetchDados();
  }, []);

  const handleExport = () => alert("Exportar relatórios...");

  if (!relatorio) return <p>Carregando...</p>;

  return (
    <Container>
      <h2>Relatórios</h2>
      <p>{new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>

      <div className="grid">
        <div className="card">
          <div className="kpi"><span className="label">Receita Total</span><span className="value">R$ {relatorio.receita.toLocaleString()}</span></div>
          <div className="kpi"><span className="label">Total de Consultas</span><span className="value">{relatorio.totalConsultas}</span></div>
          <div className="kpi"><span className="label">Total de Pacientes</span><span className="value">{relatorio.totalClientes}</span></div>
          <div className="kpi"><span className="label">Taxa de Comparecimento</span><span className="value">{relatorio.taxaComparecimento}%</span></div>
        </div>

        <div className="card">
          <h4>Serviços Mais Populares</h4>
          <div className="services-list">
            {relatorio.servicos.map((s, i) => (
              <div key={s.idServico} className="service-item">
                <span>{i + 1}. {s.nomeServico}</span>
                <span>R$ {s.preco.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Container>
  );
}

export default Relatorios;
