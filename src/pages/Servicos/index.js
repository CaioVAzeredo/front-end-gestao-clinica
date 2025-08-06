import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
const REACT_APP_PORT = process.env.REACT_APP_PORT;

const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 10px;
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

  th,
  td {
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #eee;
    white-space: normal;      /* Permite quebra de linha */
    word-wrap: break-word;    /* Quebra palavras longas */
    overflow-wrap: break-word;
    max-width: 220px;         /* Limita a largura da célula */
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
  padding: 5px 0;    /* menor padding */
  white-space: normal; /* permitir quebra normal, mas sem verticalizar */
}


.acoes-menu {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.acoes-opcoes {
  position: fixed;    /* ao invés de absolute */
  top: var(--pos-top);  /* calculado dinamicamente */
  left: var(--pos-left);
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  z-index: 9999;  /* garantir que fica na frente */
  min-width: 160px;
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
  padding: 0;
  width: 36px;
  height: 36px;
  border: none;
  background: #009688;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.btn-mais:hover {
  background: #00796b;
}

  /* --- RESPONSIVIDADE --- */
  @media (max-width: 768px) {
    table thead {
      display: none;
    }

    table,
    tbody,
    tr,
    td {
      display: block;
      width: 100%;
    }

    tr {
      margin-bottom: 15px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 10px;
    }

td {
  border: none;
  display: flex;
  flex-direction: row;  /* impede texto ficar vertical */
  justify-content: space-between;
  padding: 8px 5px;
  font-size: 14px;
  word-break: break-word;
  white-space: normal;
}

td::before {
  content: attr(data-label);
  font-weight: bold;
  text-align: left;
  margin-right: 10px;
}



    td[data-label=""] {
      justify-content: flex-end;
    }

.acoes-opcoes {
  position: fixed;    /* ao invés de absolute */
  top: var(--pos-top);  /* calculado dinamicamente */
  left: var(--pos-left);
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border-radius: 5px;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  z-index: 9999;  /* garantir que fica na frente */
  min-width: 160px;
}

  }
`;

function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [menuAtivo, setMenuAtivo] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:${REACT_APP_PORT}/api/servicos`)
      .then((response) => {
        setServicos(response.data.data.$values);
      })
      .catch((error) => console.error("Erro ao carregar serviços:", error));
  }, []);

const handleMenuToggle = (index, event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const menuWidth = 160; // largura mínima definida no CSS do menu
  const spaceRight = window.innerWidth - rect.right;

  let left;
  // se não houver espaço à direita, abre deslocado para a esquerda
  if (spaceRight < menuWidth) {
    left = rect.right - menuWidth;
  } else {
    left = rect.left;
  }

  document.documentElement.style.setProperty('--pos-top', `${rect.bottom + window.scrollY}px`);
  document.documentElement.style.setProperty('--pos-left', `${left + window.scrollX}px`);
  setMenuAtivo(menuAtivo === index ? null : index);
};



  const handleEditarServico = (servico) =>
    alert(`Editar serviço: ${servico.nomeServico}`);
  const handleRemoverServico = (servico) =>
    alert(`Remover serviço: ${servico.nomeServico}`);
  const handleEditarCategoria = (servico) =>
    alert(`Editar categoria: ${servico.categoria.nomeCategoria}`);
  const handleRemoverCategoria = (servico) =>
    alert(`Remover categoria: ${servico.categoria.nomeCategoria}`);
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
              <td data-label="Categoria" className="categoria">
                <span style={{ color: "#009688" }}>●</span>{" "}
                {servico.categoria.nomeCategoria}
              </td>
              <td data-label="Serviço">{servico.nomeServico}</td>
              <td data-label="Duração">{servico.duracaoEstimada}m</td>
              <td data-label="Preço">R$ {servico.preco.toFixed(2)}</td>
              <td data-label="">
                <div className="acoes-menu">
                  <button
                    className="btn-mais"
                    onClick={(e) => handleMenuToggle(index, e)}>
                    ⋮
                  </button>

                  {menuAtivo === index && (
                    <div className="acoes-opcoes">
                      <button onClick={() => handleEditarServico(servico)}>
                        Editar serviço
                      </button>
                      <button onClick={() => handleRemoverServico(servico)}>
                        Remover serviço
                      </button>
                      <button onClick={() => handleEditarCategoria(servico)}>
                        Editar categoria
                      </button>
                      <button onClick={() => handleRemoverCategoria(servico)}>
                        Remover categoria
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cadastrados">
        Serviços cadastrados: {servicos.length}
      </div>
    </Container>
  );
}

export default Servicos;
