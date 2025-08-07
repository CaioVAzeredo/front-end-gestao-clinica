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
  margin-bottom: 16px;
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
  margin-bottom: 16px;
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
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [perfil, setPerfil] = useState("funcionario");

  // Endereço
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [cep, setCep] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const camposPreenchidos = [
      nome, email, senha, telefone, cpf, dataNascimento, perfil,
      logradouro, numero, cidade, uf, cep
    ].every(Boolean); // verifica se todos têm valor

    if (camposPreenchidos) {
      const agora = new Date().toISOString();

      const funcionario = {
        nome,
        telefone,
        email,
        cpf,
        dataNascimento,
        senhaHash: senha,
        perfil,
        ativo: true,
        dataCriacao: agora,
        ultimaAtualizacao: agora,
        enderecoId: 0,
        endereco: {
          idEndereco: 0,
          logradouro,
          numero,
          complemento,
          cidade,
          uf,
          cep,
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
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.");
    }
  };

  const voltarLogin = () => {
    navigate("/");
  };

  return (
    <Container>
      <Card>
        <Titulo>Registro</Titulo>
        <Subtitulo>Crie sua conta para acessar o sistema</Subtitulo>

        <form onSubmit={handleSubmit}>
          <Label htmlFor="nome">Nome completo</Label>
          <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />

          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <Label htmlFor="senha">Senha</Label>
          <Input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />

          <Label htmlFor="telefone">Telefone</Label>
          <Input id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />

          <Label htmlFor="cpf">CPF</Label>
          <Input id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} required />

          <Label htmlFor="dataNascimento">Data de Nascimento</Label>
          <Input id="dataNascimento" type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} required />

          <Label htmlFor="perfil">Perfil</Label>
          <Select id="perfil" value={perfil} onChange={(e) => setPerfil(e.target.value)} required>
            <option value="funcionario">Funcionário</option>
            <option value="admin">Administrador</option>
          </Select>

          {/* Endereço */}
          <h1>Endereco</h1>
          <Label htmlFor="logradouro">Logradouro</Label>
          <Input id="logradouro" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} required />

          <Label htmlFor="numero">Número</Label>
          <Input id="numero" value={numero} onChange={(e) => setNumero(e.target.value)} required />

          <Label htmlFor="complemento">Complemento</Label>
          <Input id="complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} />

          <Label htmlFor="cidade">Cidade</Label>
          <Input id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} required />

          <Label htmlFor="uf">UF</Label>
          <Input id="uf" value={uf} onChange={(e) => setUf(e.target.value)} required />

          <Label htmlFor="cep">CEP</Label>
          <Input id="cep" value={cep} onChange={(e) => setCep(e.target.value)} required />

          <Botao type="submit">Cadastrar</Botao>
        </form>

        <p>
          Já tem uma conta? <LinkLogin onClick={voltarLogin}>Fazer login</LinkLogin>
        </p>
      </Card>
    </Container>
  );
}

export default Registro;
