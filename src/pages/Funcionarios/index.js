import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import ModalCadastrarFuncionario from "../../components/ModalCadastrarFuncionario";
import ModalAtualizarFuncionario from "../../components/ModalAtualizarFuncionario";

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

function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showModalCadastrar, setShowModalCadastrar] = useState(false);
  const [showModalAtualizar, setShowModalAtualizar] = useState(false);
  const [funcionarioEditando, setFuncionarioEditando] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  /*const fetchFuncionarios = async () => {
    try {
      const response = await axios.get(`http://localhost:${REACT_APP_PORT}/api/funcionarios`);
      setFuncionarios(response.data?.$values || []);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
    }
  };*/

  const fetchFuncionarios = async () => {
  try {
    const response = await axios.get(`http://localhost:${REACT_APP_PORT}/api/funcionarios`);
    console.log("Resposta da API:", response.data);

    // Ajuste a atribuição conforme o formato real da resposta
    if (Array.isArray(response.data)) {
      setFuncionarios(response.data);
    } else if (response.data && Array.isArray(response.data.$values)) {
      setFuncionarios(response.data.$values);
    } else {
      setFuncionarios([]);
      console.warn("Formato da resposta inesperado:", response.data);
    }
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error);
  }
};

  const handleTogglePerfil = async (func) => {
    const novoPerfil = func.perfil === "admin" ? "funcionario" : "admin";
    const funcionarioAtualizado = { ...func, perfil: novoPerfil };

    try {
      await axios.put(`http://localhost:${REACT_APP_PORT}/api/funcionarios/${func.idFuncionario}`, funcionarioAtualizado);
      fetchFuncionarios();
    } catch (error) {
      console.error("Erro ao atualizar perfil do funcionário:", error);
      alert("Erro ao mudar o perfil.");
    }
  };

  const handleToggleStatus = async (func) => {
    const novoStatus = !func.ativo;
    const funcionarioAtualizado = { ...func, ativo: novoStatus };

    try {
      await axios.put(`http://localhost:${REACT_APP_PORT}/api/funcionarios/${func.idFuncionario}`, funcionarioAtualizado);
      fetchFuncionarios();
    } catch (error) {
      console.error("Erro ao atualizar status do funcionário:", error);
      alert("Erro ao atualizar o status.");
    }
  };

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const handleNovo = () => setShowModalCadastrar(true);

  const handleEditar = (funcionario) => {
    setFuncionarioEditando(funcionario);
    setShowModalAtualizar(true);
  };


  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este funcionario?")) {
      setExcluindo(true);
      try {
        await axios.delete(`http://localhost:${REACT_APP_PORT}/api/funcionarios/${id}`);
        // Recarrega a lista
        await fetchFuncionarios();
        // Ajusta a página se necessário (ex.: se a página atual ficar vazia)
        const totalPagesAtualizado = Math.ceil((funcionarios.length - 1) / rowsPerPage);
        if (page > totalPagesAtualizado) {
          setPage(Math.max(1, totalPagesAtualizado));
        }
      } catch (error) {
        console.error("Erro ao excluir o funcionário:", error);
        alert("Erro ao excluir o funcionário. Verifique se o ID existe ou tente novamente.");
      } finally {
        setExcluindo(false);
      }
    }
  };


  const startIndex = (page - 1) * rowsPerPage;
  const paginated = funcionarios.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(funcionarios.length / rowsPerPage);

  return (
    <Container>
      <div className="conteudo">
        <div className="topo">
          <button className="btn btn-novo" onClick={handleNovo}>
            + Novo Funcionário
          </button>
        </div>

        <div className="paginacao">
          <span>
            {startIndex + 1}-{Math.min(startIndex + rowsPerPage, funcionarios.length)} de {funcionarios.length}
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
          <button disabled={page === 1} onClick={() => setPage(1)}>
            {"<<"}
          </button>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            {"<"}
          </button>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            {">"}
          </button>
          <button disabled={page === totalPages} onClick={() => setPage(totalPages)}>
            {">>"}
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Contato</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((func) => (
              <tr key={func.idFuncionario}>
                <td data-label="Nome">{func.nome}</td>
                <td data-label="CPF">{func.cpf}</td>
                <td data-label="Contato">
                  {func.telefone}<br />
                  {func.email}
                </td>
                <td data-label="Perfil">{func.perfil}</td>
                <td data-label="Status">{func.ativo ? "Ativo" : "Inativo"}</td>
                <td data-label="Ações">
                  <button 
                    className="btn btn-editar" 
                    onClick={() => handleEditar(func)}
                  >
                    Atualizar
                  </button>
                  <button 
                    className="btn btn-excluir" 
                    onClick={() => handleExcluir(func.idFuncionario)}
                  >
                    Excluir
                  </button>
                  <button
                    className="btn"
                    style={{ backgroundColor: func.ativo ? "#6c757d" : "#28a745", color: "#fff", marginTop: "6px" }}
                    onClick={() => handleToggleStatus(func)}
                  >
                    {func.ativo ? "Inativar" : "Ativar"}
                  </button>
                  <button
                    className="btn"
                    style={{ backgroundColor: "#007bff", color: "#fff", marginTop: "6px" }}
                    onClick={() => handleTogglePerfil(func)}
                  >
                    Mudar Perfil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="paginacao">
          <span>
            {startIndex + 1}-{Math.min(startIndex + rowsPerPage, funcionarios.length)} de {funcionarios.length}
          </span>
          <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}>
            {[5, 10, 25, 50].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
          <button disabled={page === 1} onClick={() => setPage(1)}>{"<<"}</button>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>{"<"}</button>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>{">"}</button>
          <button disabled={page === totalPages} onClick={() => setPage(totalPages)}>{">>"}</button>
        </div>
      </div>

      {showModalCadastrar && (
        <ModalCadastrarFuncionario onClose={() => setShowModalCadastrar(false)} onSalvou={fetchFuncionarios} />
      )}

      {showModalAtualizar && (
        <ModalAtualizarFuncionario
          funcionario={funcionarioEditando}
          onClose={() => {
            setShowModalAtualizar(false);
            setFuncionarioEditando(null);
          }}
          onSalvou={fetchFuncionarios}
        />
      )}
    </Container>
  );
}

export default Funcionarios;
