import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9fafa;
`;

const Card = styled.div`
  background: white;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 500px;
  text-align: left;

  .erro {
    color: red;
    font-size: 12px;
    margin-top: -10px;
    margin-bottom: 10px;
  }
`;

const Titulo = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 6px;
  text-align: center;
`;

const Subtitulo = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  text-align: center;
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 6px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3bbca7;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3bbca7;
  }
`;

const Botao = styled.button`
  background-color: #3bbca7;
  color: white;
  font-size: 16px;
  padding: 12px;
  width: 100%;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 8px;
  margin-bottom: 20px;

  &:hover {
    background-color: #319a88;
  }
`;

const LinkLogin = styled.span`
  color: #3bbca7;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

function Registro() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
    perfil: "funcionario",
    logradouro: "",
    numero: "",
    complemento: "",
    cidade: "",
    uf: "",
    cep: ""
  });

  const [erros, setErros] = useState({});
  const navigate = useNavigate();

  const validar = () => {
    const novosErros = {};

    if (!form.nome.trim()) novosErros.nome = "O nome é obrigatório.";
    if (!form.email.trim()) {
      novosErros.email = "O e-mail é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      novosErros.email = "E-mail inválido.";
    }
    if (!form.senha.trim()) {
      novosErros.senha = "A senha é obrigatória.";
    } 
    if (!form.telefone) {
      novosErros.telefone = "O telefone é obrigatório.";
    } else if (form.telefone.length !== 11) {
      novosErros.telefone = "O telefone deve ter exatamente 11 números.";
    }
    if (!form.cpf) {
      novosErros.cpf = "O CPF é obrigatório.";
    } else if (form.cpf.length !== 11) {
      novosErros.cpf = "O CPF deve ter exatamente 11 números.";
    }
    if (!form.dataNascimento) novosErros.dataNascimento = "A data de nascimento é obrigatória.";
    if (!form.logradouro.trim()) novosErros.logradouro = "O logradouro é obrigatório.";
    if (!form.numero) novosErros.numero = "O número é obrigatório.";
    if (!form.cidade.trim()) novosErros.cidade = "A cidade é obrigatória.";
    if (!form.uf) {
      novosErros.uf = "O UF é obrigatório.";
    } else if (!/^[A-Za-z]{2}$/.test(form.uf)) {
      novosErros.uf = "O UF deve ter exatamente 2 letras.";
    }
    if (!form.cep) {
      novosErros.cep = "O CEP é obrigatório.";
    } else if (!/^\d{8}$/.test(form.cep)) {
      novosErros.cep = "O CEP deve ter exatamente 8 números.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "telefone" || name === "cpf" || name === "cep") {
      value = value.replace(/\D/g, "");
    }
    if (name === "uf") {
      value = value.toUpperCase();
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    const agora = new Date().toISOString();
    const funcionario = {
      nome: form.nome,
      telefone: form.telefone,
      email: form.email,
      cpf: form.cpf,
      dataNascimento: form.dataNascimento,
      senhaHash: form.senha,
      perfil: form.perfil,
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

    try {
      await axios.post("http://localhost:5239/api/funcionarios", funcionario);
      alert("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar. Verifique os dados.");
    }
  };

  return (
    <Container>
      <Card>
        <Titulo>Registro</Titulo>
        <Subtitulo>Crie sua conta para acessar o sistema</Subtitulo>

        <form onSubmit={handleSubmit}>
          <Label>Nome completo</Label>
          <Input name="nome" value={form.nome} onChange={handleChange} />
          {erros.nome && <div className="erro">{erros.nome}</div>}

          <Label>E-mail</Label>
          <Input name="email" type="email" value={form.email} onChange={handleChange} />
          {erros.email && <div className="erro">{erros.email}</div>}

          <Label>Senha</Label>
          <Input name="senha" type="password" value={form.senha} onChange={handleChange} />
          {erros.senha && <div className="erro">{erros.senha}</div>}

          <Label>Telefone</Label>
          <Input name="telefone" maxLength={11} value={form.telefone} onChange={handleChange} />
          {erros.telefone && <div className="erro">{erros.telefone}</div>}

          <Label>CPF</Label>
          <Input name="cpf" maxLength={11} value={form.cpf} onChange={handleChange} />
          {erros.cpf && <div className="erro">{erros.cpf}</div>}

          <Label>Data de Nascimento</Label>
          <Input name="dataNascimento" type="date" value={form.dataNascimento} onChange={handleChange} />
          {erros.dataNascimento && <div className="erro">{erros.dataNascimento}</div>}

          <Label>Perfil</Label>
          <Select name="perfil" value={form.perfil} onChange={handleChange}>
            <option value="funcionario">Funcionário</option>
            <option value="admin">Administrador</option>
          </Select>

          <h3>Endereço</h3>
          <Label>Logradouro</Label>
          <Input name="logradouro" value={form.logradouro} onChange={handleChange} />
          {erros.logradouro && <div className="erro">{erros.logradouro}</div>}

          <Label>Número</Label>
          <Input name="numero" value={form.numero} onChange={handleChange} />
          {erros.numero && <div className="erro">{erros.numero}</div>}

          <Label>Complemento</Label>
          <Input name="complemento" value={form.complemento} onChange={handleChange} />

          <Label>Cidade</Label>
          <Input name="cidade" value={form.cidade} onChange={handleChange} />
          {erros.cidade && <div className="erro">{erros.cidade}</div>}

          <Label>UF</Label>
          <Input name="uf" maxLength={2} value={form.uf} onChange={handleChange} />
          {erros.uf && <div className="erro">{erros.uf}</div>}

          <Label>CEP</Label>
          <Input name="cep" maxLength={8} value={form.cep} onChange={handleChange} />
          {erros.cep && <div className="erro">{erros.cep}</div>}

          <Botao type="submit">Cadastrar</Botao>
        </form>

        <p>
          Já tem uma conta? <LinkLogin onClick={() => navigate("/")}>Fazer login</LinkLogin>
        </p>
      </Card>
    </Container>
  );
}

export default Registro;
