import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import ModalCadastrarCliente from "../../components/ModalCadastrarCliente";
import ModalAtualizarCliente from "../../components/ModalAtualizarCliente";
const REACT_APP_PORT = process.env.REACT_APP_PORT;

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

  @media (max-width: 768px) {
    table {
      border: 0;
    }

    table thead {
      display: none;
    }

    table tbody tr {
      display: block;
      margin-bottom: 15px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 10px;
    }

    table tbody td {
      display: flex;
      justify-content: space-between;
      padding: 8px 5px;
      font-size: 14px;
      border: none;
      word-break: break-word;
    }

    table tbody td::before {
      content: attr(data-label);
      font-weight: bold;
      flex: 1;
      text-align: left;
    }

    table tbody td[data-label="Ações"] {
      flex-direction: column;
      gap: 8px;
    }

    table tbody td[data-label="Ações"] button {
      width: 100%;
    }
  }
`;

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showModalCadastrar, setShowModalCadastrar] = useState(false);
  const [showModalAtualizar, setShowModalAtualizar] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  const fetchClientes = async () => {
    try {
      const response = await axios.get(`http://localhost:${REACT_APP_PORT}/api/clientes`);

      // 🔧 Normalização do payload (mantém compatível com vários formatos)
      const toList = (payload) =>
        Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
          ? payload
          : (payload?.data?.$values ?? payload?.$values ?? []);

      setClientes(toList(response.data));
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleNovo = () => setShowModalCadastrar(true);

  const handleEditar = (cliente) => {
    setClienteEditando(cliente);
    setShowModalAtualizar(true);
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      setExcluindo(true);
      try {
        await axios.delete(`http://localhost:${REACT_APP_PORT}/api/clientes/${id}`);
        // Recarrega a lista
        await fetchClientes();
        // Ajusta a página se necessário (ex.: se a página atual ficar vazia)
        const totalPagesAtualizado = Math.ceil((clientes.length - 1) / rowsPerPage);
        if (page > totalPagesAtualizado) {
          setPage(Math.max(1, totalPagesAtualizado));
        }
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
        alert("Erro ao excluir cliente. Verifique se o ID existe ou tente novamente.");
      } finally {
        setExcluindo(false);
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

        <div className="paginacao">
          <span>
            {startIndex + 1}-{Math.min(startIndex + rowsPerPage, clientes.length)} de {clientes.length}
          </span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
          >
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <button disabled={page === 1 || excluindo} onClick={() => setPage(1)}>
            {"<<"}
          </button>
          <button disabled={page === 1 || excluindo} onClick={() => setPage((p) => p - 1)}>
            {"<"}
          </button>
          <button disabled={page === totalPages || excluindo} onClick={() => setPage((p) => p + 1)}>
            {">"}
          </button>
          <button disabled={page === totalPages || excluindo} onClick={() => setPage(totalPages)}>
            {">>"}
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
            {paginatedClientes.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "10px", fontStyle: "italic", color: "#777" }}>
                  Nenhum cliente encontrado
                </td>
              </tr>
            ) : (
              paginatedClientes.map((cliente) => (
                <tr key={cliente.idCliente}>
                  <td data-label="Cliente">{cliente.nome}</td>
                  <td data-label="Contato">
                    {cliente.telefone}
                    <br />
                    {cliente.email}
                  </td>
                  <td data-label="Status">{cliente.ativo ? "Ativo" : "Inativo"}</td>
                  <td data-label="Ações">
                    <button
                      type="button"
                      className="btn btn-editar"
                      onClick={() => handleEditar(cliente)}
                      disabled={excluindo}
                    >
                      Atualizar
                    </button>
                    <button
                      type="button"
                      className="btn btn-excluir"
                      onClick={() => handleExcluir(cliente.idCliente)}
                      disabled={excluindo}
                    >
                      {excluindo ? "Excluindo..." : "Excluir"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModalCadastrar && (
        <ModalCadastrarCliente onClose={() => setShowModalCadastrar(false)} onSalvou={fetchClientes} />
      )}

      {showModalAtualizar && (
        <ModalAtualizarCliente
          cliente={clienteEditando}
          onClose={() => {
            setShowModalAtualizar(false);
            setClienteEditando(null);
          }}
          onSalvou={fetchClientes}
        />
      )}
    </Container>
  );
}

export default Clientes;
