import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const REACT_APP_PORT = process.env.REACT_APP_PORT;

const Container = styled.div`
  padding: 20px;
  padding-top: 100px;
  font-family: Arial, sans-serif;
  position: relative;

  h2 {
    margin-bottom: 5px;
    text-align: center;
  }

  .bemvindo {
    font-size: 50px;
    text-align: center;
    font-weight: bold;
    margin-bottom: 20px;
  }

  p.subtitulo {
    margin-bottom: 20px;
    text-align: center;
    color: #666;
  }

  .logout {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 8px 14px;
    background: #e53935;
    border: none;
    border-radius: 5px;
    color: white;
    cursor: pointer;
    font-size: 14px;
  }

  .logout:hover {
    background: #c62828;
  }

  .form-section {
    background: #fff;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  label {
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
  }

  input {
    width: 100%;
    padding: 8px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .linha {
    display: flex;
    gap: 20px;
  }

  .linha .col {
    flex: 1;
  }

  .btn-salvar {
    padding: 10px 15px;
    border: none;
    background: #009688;
    color: white;
    border-radius: 5px;
    cursor: pointer;
  }

  .btn-salvar:hover {
    background: #00796b;
  }

  @media (max-width: 768px) {
    .bemvindo {
      font-size: 32px;
    }

    .linha {
      flex-direction: column;
      gap: 10px;
    }

    input {
      font-size: 16px;
    }

    h2 {
      font-size: 24px;
    }

    p.subtitulo {
      font-size: 14px;
    }

    .logout {
      top: 10px;
      right: 10px;
      padding: 6px 12px;
      font-size: 13px;
    }
  }
`;

function ConfiguracoesConta() {
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    cpf: "",
    senha: "",
    logradouro: "",
    numero: "",
    complemento: "",
    cidade: "",
    uf: "",
    cep: ""
  });

  const [usuario, setUsuario] = useState("");
  const navigate = useNavigate();
  const funcionarioId = localStorage.getItem("funcionarioId");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token || !funcionarioId) {
      alert("Você precisa estar logado.");
      navigate("/login");
      return;
    }

    const buscarDadosFuncionario = async () => {
      try {
        const response = await fetch(`http://localhost:${REACT_APP_PORT}/api/funcionarios/${funcionarioId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setUsuario(data.nome);
          setForm({
            nome: data.nome || "",
            telefone: data.telefone || "",
            email: data.email || "",
            cpf: data.cpf || "",
            senha: data.senhaHash || "",
            logradouro: data.endereco?.logradouro || "",
            numero: data.endereco?.numero || "",
            complemento: data.endereco?.complemento || "",
            cidade: data.endereco?.cidade || "",
            uf: data.endereco?.uf || "",
            cep: data.endereco?.cep || ""
          });
        } else {
          console.error("Erro ao buscar funcionário:", data.message);
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    };

    buscarDadosFuncionario();
  }, [token, funcionarioId, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvar = () => {
    const agora = new Date().toISOString();

    const dadosAtualizados = {
      idFuncionario: parseInt(funcionarioId),
      nome: form.nome,
      telefone: form.telefone,
      email: form.email,
      cpf: form.cpf,
      senhaHash: form.senha,
      dataNascimento: agora,
      perfil: localStorage.getItem("perfil") || "funcionario",
      ativo: true,
      dataCriacao: agora,
      ultimaAtualizacao: agora,
      enderecoId: 0,
      endereco: {
        idEndereco: 0,
        logradouro: form.logradouro,
        numero: form.numero,
        complemento: form.complemento,
        cidade: form.cidade,
        uf: form.uf,
        cep: form.cep,
        dataCriacao: agora,
        ultimaAtualizacao: agora
      }
    };

    if (form.senha.trim() !== "") {
      dadosAtualizados.senhaHash = form.senha;
    }

    axios
      .put(`http://localhost:${REACT_APP_PORT}/api/funcionarios/${funcionarioId}`, dadosAtualizados, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        alert("Dados atualizados com sucesso!");
        setUsuario(form.nome); // 🔹 Atualiza imediatamente a saudação
      })
      .catch((err) => {
        console.error("Erro ao salvar:", err.response ? err.response.data : err);
        alert("Erro ao salvar os dados. Verifique os campos e tente novamente.");
      });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Container>
      <button className="logout" onClick={handleLogout}>Logout</button>
      {usuario && <div className="bemvindo">Olá, {usuario}. Seja bem-vindo!</div>}
      <h2>Configurações da Conta</h2>
      <p className="subtitulo">Atualize suas informações pessoais</p>

      <div className="form-section">
        <h3>Informações Básicas</h3>
        <div className="linha">
          <div className="col">
            <label>Nome</label>
            <input name="nome" value={form.nome} onChange={handleChange} />
          </div>
          <div className="col">
            <label>Telefone</label>
            <input name="telefone" value={form.telefone} onChange={handleChange} />
          </div>
        </div>
        <div className="linha">
          <div className="col">
            <label>E-mail</label>
            <input name="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="col">
            <label>CPF</label>
            <input name="cpf" value={form.cpf} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Endereço</h3>
        <label>Logradouro</label>
        <input name="logradouro" value={form.logradouro} onChange={handleChange} />
        <div className="linha">
          <div className="col">
            <label>Número</label>
            <input name="numero" value={form.numero} onChange={handleChange} />
          </div>
          <div className="col">
            <label>Complemento</label>
            <input name="complemento" value={form.complemento} onChange={handleChange} />
          </div>
        </div>
        <div className="linha">
          <div className="col">
            <label>Cidade</label>
            <input name="cidade" value={form.cidade} onChange={handleChange} />
          </div>
          <div className="col">
            <label>UF</label>
            <input name="uf" value={form.uf} onChange={handleChange} />
          </div>
          <div className="col">
            <label>CEP</label>
            <input name="cep" value={form.cep} onChange={handleChange} />
          </div>
        </div>
        <div className="col">
          <label>Senha</label>
          <input
            name="senha"
            type="text"
            value={form.senha}
            onChange={handleChange}
          />
        </div>
      </div>

      <button className="btn-salvar" onClick={handleSalvar}>
        Salvar Alterações
      </button>
    </Container>
  );
}

export default ConfiguracoesConta;
