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
    flex-wrap: wrap;
    gap: 10px;
  }

  .search-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .search-input {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 250px;
  }

  .search-clear {
    background: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    color: #666;
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

  .btn-filtro {
    background: #6c757d;
    color: white;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .filtro-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    z-index: 1000;
    padding-top: 100px;
  }

  .filtro-modal-content {
    background: white;
    border-radius: 8px;
    padding: 20px;
    width: 400px;
    max-width: 90%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .filtro-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .filtro-modal-title {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
  }

  .filtro-modal-close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #666;
  }

  .filtro-group {
    margin-bottom: 15px;
  }

  .filtro-label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #333;
  }

  .filtro-select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
  }

  .filtro-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }

  .btn-aplicar {
    background: #00a884;
    color: white;
  }

  .btn-limpar {
    background: #6c757d;
    color: white;
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
    position: relative;
    cursor: pointer;
  }

  table th:hover {
    background: #e9e9e9;
  }

  .sort-indicator {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
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

    .topo {
      flex-direction: column;
      align-items: stretch;
    }

    .search-container {
      width: 100%;
    }

    .search-input {
      flex: 1;
    }

    .filtro-modal-content {
      margin: 20px;
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
      margin-right: 0 !important;
    }
  }
`;

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showModalCadastrar, setShowModalCadastrar] = useState(false);
  const [showModalAtualizar, setShowModalAtualizar] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState({ campo: null, direcao: 'asc' });
  const [filtroUF, setFiltroUF] = useState("");
  const [filtroCidade, setFiltroCidade] = useState("");
  const [ufsDisponiveis, setUfsDisponiveis] = useState([]);
  const [cidadesDisponiveis, setCidadesDisponiveis] = useState([]);
  const [showFiltrosModal, setShowFiltrosModal] = useState(false);
  const [filtroTempUF, setFiltroTempUF] = useState("");
  const [filtroTempCidade, setFiltroTempCidade] = useState("");

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

      const clientesData = toList(response.data);
      setClientes(clientesData);
      setClientesFiltrados(clientesData);
      
      // Extrair UFs e cidades únicas
      const ufs = [...new Set(clientesData.map(c => c.endereco?.uf).filter(Boolean))].sort();
      const cidades = [...new Set(clientesData.map(c => c.endereco?.cidade).filter(Boolean))].sort();
      
      setUfsDisponiveis(ufs);
      setCidadesDisponiveis(cidades);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  // Função para filtrar clientes
  const filtrarClientes = () => {
    let resultados = [...clientes];
    
    // Filtro de busca
    if (termoBusca) {
      const termoLower = termoBusca.toLowerCase();
      resultados = resultados.filter(cliente => 
        cliente.nome.toLowerCase().includes(termoLower) ||
        cliente.cpf.includes(termoBusca) ||
        cliente.email.toLowerCase().includes(termoLower)
      );
    }
    
    // Filtro por UF
    if (filtroUF) {
      resultados = resultados.filter(cliente => 
        cliente.endereco?.uf === filtroUF
      );
    }
    
    // Filtro por Cidade
    if (filtroCidade) {
      resultados = resultados.filter(cliente => 
        cliente.endereco?.cidade === filtroCidade
      );
    }
    
    // Ordenação
    if (ordenacao.campo) {
      resultados.sort((a, b) => {
        let valorA, valorB;
        
        switch (ordenacao.campo) {
          case 'nome':
            valorA = a.nome || '';
            valorB = b.nome || '';
            break;
          case 'telefone':
            valorA = a.telefone || '';
            valorB = b.telefone || '';
            break;
          case 'email':
            valorA = a.email || '';
            valorB = b.email || '';
            break;
          case 'status':
            valorA = a.ativo ? 'Ativo' : 'Inativo';
            valorB = b.ativo ? 'Ativo' : 'Inativo';
            break;
          default:
            return 0;
        }
        
        if (ordenacao.direcao === 'asc') {
          return valorA.localeCompare(valorB);
        } else {
          return valorB.localeCompare(valorA);
        }
      });
    }
    
    setClientesFiltrados(resultados);
  };

  // Atualizar filtros quando os dados mudarem
  useEffect(() => {
    filtrarClientes();
    setPage(1); // Resetar para a primeira página ao filtrar
  }, [termoBusca, filtroUF, filtroCidade, ordenacao, clientes]);

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleOrdenar = (campo) => {
    setOrdenacao(prev => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleNovo = () => setShowModalCadastrar(true);

  const handleAbrirFiltros = () => {
    setFiltroTempUF(filtroUF);
    setFiltroTempCidade(filtroCidade);
    setShowFiltrosModal(true);
  };

  const handleAplicarFiltros = () => {
    setFiltroUF(filtroTempUF);
    setFiltroCidade(filtroTempCidade);
    setShowFiltrosModal(false);
  };

  const handleLimparFiltros = () => {
    setFiltroTempUF("");
    setFiltroTempCidade("");
    setFiltroUF("");
    setFiltroCidade("");
    setOrdenacao({ campo: null, direcao: 'asc' });
    setShowFiltrosModal(false);
  };

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
        const totalPagesAtualizado = Math.ceil((clientesFiltrados.length - 1) / rowsPerPage);
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

  const handleLimparBusca = () => {
    setTermoBusca("");
  };

  const startIndex = (page - 1) * rowsPerPage;
  const paginatedClientes = clientesFiltrados.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(clientesFiltrados.length / rowsPerPage);

  // Função para obter o indicador de ordenação
  const getSortIndicator = (campo) => {
    if (ordenacao.campo === campo) {
      return ordenacao.direcao === 'asc' ? '▲' : '▼';
    }
    return '↕';
  };

  return (
    <Container>
      <div className="conteudo">
        <div className="topo">
          <button className="btn btn-novo" onClick={handleNovo}>
            + Novo Cliente
          </button>
          
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou e-mail..."
              className="search-input"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
            {termoBusca && (
              <button className="search-clear" onClick={handleLimparBusca}>
                ✕
              </button>
            )}
            <button className="btn btn-filtro" onClick={handleAbrirFiltros}>
              <span>🔍</span>
              Filtrar
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th onClick={() => handleOrdenar('nome')}>
                Cliente
                <span className="sort-indicator">{getSortIndicator('nome')}</span>
              </th>
              <th onClick={() => handleOrdenar('telefone')}>
                Telefone
                <span className="sort-indicator">{getSortIndicator('telefone')}</span>
              </th>
              <th onClick={() => handleOrdenar('email')}>
                E-mail
                <span className="sort-indicator">{getSortIndicator('email')}</span>
              </th>
              <th>Endereço</th>
              <th onClick={() => handleOrdenar('status')}>
                Status
                <span className="sort-indicator">{getSortIndicator('status')}</span>
              </th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedClientes.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "10px", fontStyle: "italic", color: "#777" }}>
                  Nenhum cliente encontrado
                </td>
              </tr>
            ) : (
              paginatedClientes.map((cliente) => (
                <tr key={cliente.idCliente}>
                  <td data-label="Cliente">{cliente.nome}</td>
                  <td data-label="Telefone">{cliente.telefone}</td>
                  <td data-label="E-mail">{cliente.email}</td>
                  <td data-label="Endereço">
                    {cliente.endereco?.cidade} - {cliente.endereco?.uf}
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

        <div className="paginacao">
          <span>
            {startIndex + 1}-{Math.min(startIndex + rowsPerPage, clientesFiltrados.length)} de {clientesFiltrados.length}
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
      </div>

      {/* Modal de Filtros */}
      {showFiltrosModal && (
        <div className="filtro-modal-overlay" onClick={() => setShowFiltrosModal(false)}>
          <div className="filtro-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="filtro-modal-header">
              <h3 className="filtro-modal-title">Filtros</h3>
              <button className="filtro-modal-close" onClick={() => setShowFiltrosModal(false)}>
                ×
              </button>
            </div>
            
            <div className="filtro-group">
              <label className="filtro-label">UF</label>
              <select
                className="filtro-select"
                value={filtroTempUF}
                onChange={(e) => setFiltroTempUF(e.target.value)}
              >
                <option value="">Todas</option>
                {ufsDisponiveis.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>
            
            <div className="filtro-group">
              <label className="filtro-label">Cidade</label>
              <select
                className="filtro-select"
                value={filtroTempCidade}
                onChange={(e) => setFiltroTempCidade(e.target.value)}
              >
                <option value="">Todas</option>
                {cidadesDisponiveis.map(cidade => (
                  <option key={cidade} value={cidade}>{cidade}</option>
                ))}
              </select>
            </div>
            
            <div className="filtro-actions">
              <button className="btn btn-limpar" onClick={handleLimparFiltros}>
                Limpar
              </button>
              <button className="btn btn-aplicar" onClick={handleAplicarFiltros}>
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

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