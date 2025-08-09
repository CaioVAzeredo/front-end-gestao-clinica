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
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

  /* ---- RESPONSIVIDADE ---- */
  @media (max-width: 768px) {
    .grid {
      display: flex;
      flex-direction: column;
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

    .service-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
    }
  }
`;

function Relatorios() {
  const [relatorio, setRelatorio] = useState(null);

  useEffect(() => {
    const fetchDados = async () => {
      const agResp = await fetch(`http://localhost:${REACT_APP_PORT}/api/agendamentos`).then((res) => res.json());
      const cliResp = await fetch(`http://localhost:${REACT_APP_PORT}/api/clientes`).then((res) => res.json());
      const srvResp = await fetch(`http://localhost:${REACT_APP_PORT}/api/servicos`).then((res) => res.json());

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

      const totalAtendimentos = agList.length;
      const totalClientes = cliList.length;
      const listaServicos = srvList;

      const receita = agList.reduce((acc, ag) => acc + (ag?.servico?.preco || 0), 0);
      const compareceram = agList.filter((a) => a.statusAgenda === "HorarioMarcado").length;
      const taxaComparecimento = totalAtendimentos
        ? ((compareceram / totalAtendimentos) * 100).toFixed(1)
        : "0.0";

      setRelatorio({
        totalAtendimentos,
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
          <div className="kpi"><span className="label">Total de Atendimentos</span><span className="value">{relatorio.totalAtendimentos}</span></div>
          <div className="kpi"><span className="label">Total de Pacientes</span><span className="value">{relatorio.totalClientes}</span></div>
          <div className="kpi"><span className="label">Taxa de Comparecimento</span><span className="value">{relatorio.taxaComparecimento}%</span></div>
        </div>

        <div className="card">
          <h4>Serviços Mais Populares</h4>
          <div className="services-list">
            {relatorio.servicos.map((s, i) => (
              <div key={s.idServico} className="service-item">
                <span>{i + 1}. {s.nomeServico}</span>
                <span>R$ {Number(s.preco).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Relatorios;
