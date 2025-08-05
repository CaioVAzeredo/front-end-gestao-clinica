import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 22px;
  }

  .btn-adicionar {
    padding: 8px 15px;
    background: #009688;
    border: none;
    border-radius: 5px;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .btn-adicionar:hover {
    background: #00796b;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
  }

  th, td {
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #f4f6f6;
    font-weight: bold;
  }

  tr:hover {
    background: #f9f9f9;
  }

  .categoria {
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: bold;
  }

  .acoes-menu {
    position: relative;
  }

  .acoes-opcoes {
    position: absolute;
    top: 30px;
    right: 0;
    background: #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    border-radius: 5px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    z-index: 10;
  }

  .acoes-opcoes button {
    background: none;
    border: none;
    padding: 5px;
    text-align: left;
    cursor: pointer;
    color: #333;
  }

  .acoes-opcoes button:hover {
    background: #f0f0f0;
  }

  .cadastrados {
    padding: 10px;
    background: #f4f6f6;
    border-radius: 5px;
    font-size: 14px;
    font-weight: bold;
    width: fit-content;
    color: #333;
  }

  .btn-mais {
    padding: 6px 10px;
    border: none;
    background: #009688;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
  }

  .btn-mais:hover {
    background: #00796b;
  }
`;

function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [menuAtivo, setMenuAtivo] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5239/api/servicos")
      .then(response => {
        setServicos(response.data.data.$values);
      })
      .catch(error => console.error("Erro ao carregar serviços:", error));
  }, []);

  const handleMenuToggle = (index) => {
    setMenuAtivo(menuAtivo === index ? null : index);
  };

  const handleEditarServico = (servico) => alert(`Editar serviço: ${servico.nomeServico}`);
  const handleRemoverServico = (servico) => alert(`Remover serviço: ${servico.nomeServico}`);
  const handleEditarCategoria = (servico) => alert(`Editar categoria: ${servico.categoria.nomeCategoria}`);
  const handleRemoverCategoria = (servico) => alert(`Remover categoria: ${servico.categoria.nomeCategoria}`);

  const handleAdicionarServico = () => {
    alert("Abrir modal para adicionar novo serviço");
  };

  return (
    <Container>
      <div className="header">
        <h2>Serviços</h2>
        <button className="btn-adicionar" onClick={handleAdicionarServico}>
          + Adicionar Serviço
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Categoria</th>
            <th>Serviço</th>
            <th>Duração</th>
            <th>Preço</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {servicos.map((servico, index) => (
            <tr key={servico.idServico}>
              <td><input type="checkbox" /></td>
              <td className="categoria">
                <span style={{color:"#009688"}}>●</span> {servico.categoria.nomeCategoria}
              </td>
              <td>{servico.nomeServico}</td>
              <td>{servico.duracaoEstimada}m</td>
              <td>R$ {servico.preco.toFixed(2)}</td>
              <td className="acoes-menu">
                <button className="btn-mais" onClick={() => handleMenuToggle(index)}>⋮</button>
                {menuAtivo === index && (
                  <div className="acoes-opcoes">
                    <button onClick={() => handleEditarServico(servico)}>Editar serviço</button>
                    <button onClick={() => handleRemoverServico(servico)}>Remover serviço</button>
                    <button onClick={() => handleEditarCategoria(servico)}>Editar categoria</button>
                    <button onClick={() => handleRemoverCategoria(servico)}>Remover categoria</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cadastrados">Serviços cadastrados: {servicos.length}</div>
    </Container>
  );
}

export default Servicos;
