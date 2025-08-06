import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  height: 100vh;

  .conteudo {
    flex: 1;
    padding: 20px;
  }

  .topo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
  }

  table th,
  table td {
    padding: 12px;
    border-bottom: 1px solid #eee;
    text-align: left;
  }

  table th {
    background: #f5f5f5;
  }

  .btn {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .btn-novo {
    background: #00a884;
    color: white;
  }

  .btn-editar {
    background: #ffc107;
    margin-right: 8px;
    color: #000;
  }

  .btn-excluir {
    background: #dc3545;
    color: white;
  }

  .paginacao {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
    gap: 10px;
  }

  .paginacao select,
  .paginacao button {
    padding: 5px 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
    cursor: pointer;
  }

  .paginacao span {
    font-size: 14px;
  }
`;

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchClientes = async () => {
    try {
      const response = await axios.get("http://localhost:5239/api/clientes");
      setClientes(response.data.data.$values);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleNovo = () => alert("Abrir modal para criar novo cliente");
  const handleEditar = (cliente) => alert(`Editar cliente: ${cliente.nome}`);
  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir?")) {
      try {
        await axios.delete(`http://localhost:5239/api/clientes/${id}`);
        fetchClientes();
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
      }
    }
  };

  const startIndex = (page - 1) * rowsPerPage;
  const paginatedClientes = clientes.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(clientes.length / rowsPerPage);

  return (
    <Container>
      <div className="conteudo">
        <div className="topo">
          <button className="btn btn-novo" onClick={handleNovo}>
            + Novo Cliente
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Contato</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedClientes.map((cliente) => (
              <tr key={cliente.idCliente}>
                <td>{cliente.nome}</td>
                <td>
                  {cliente.telefone}
                  <br />
                  {cliente.email}
                </td>
                <td>{cliente.ativo ? "Ativo" : "Inativo"}</td>
                <td>
                  <button className="btn btn-editar" onClick={() => handleEditar(cliente)}>
                    Atualizar
                  </button>
                  <button className="btn btn-excluir" onClick={() => handleExcluir(cliente.idCliente)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="paginacao">
          <span>
            {startIndex + 1}-{Math.min(startIndex + rowsPerPage, clientes.length)} de {clientes.length}
          </span>
          <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}>
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <button disabled={page === 1} onClick={() => setPage(1)}>{"<<"}</button>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>{"<"}</button>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>{">"}</button>
          <button disabled={page === totalPages} onClick={() => setPage(totalPages)}>{">>"}</button>
        </div>
      </div>
    </Container>
  );
}

export default Clientes;