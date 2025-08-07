import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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
  max-width: 400px;
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


const Rodape = styled.p`
  font-size: 13px;
  color: #666;
  text-align: center;
`;

const LinkContato = styled.span`
  color: #3bbca7;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

function Login({ setToken }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5239/api/Auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario: email,
                    senha: senha
                }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("authToken", data.token);
                setToken(data.token);
                navigate("/pag-base");
            } else {
                alert("Usuário ou senha inválidos.");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            alert("Erro de conexão com o servidor.");
        }
    };

    const handleContato = () => {
        navigate("/registro");
    };

    return (
        <Container>
            <Card>
                <Titulo>Login</Titulo>
                <Subtitulo>Faça login para acessar sua conta</Subtitulo>

                <form onSubmit={handleSubmit}>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Label htmlFor="senha">Senha</Label>
                    <Input
                        id="senha"
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />

                    <Botao type="submit">Entrar</Botao>
                </form>

                <Rodape>
                    Não tem uma conta?{" "}
                    <LinkContato onClick={handleContato}>Criar conta</LinkContato>
                </Rodape>
            </Card>
        </Container>
    );
}

export default Login;
