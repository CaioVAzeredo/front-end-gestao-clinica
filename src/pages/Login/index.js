import { useNavigate } from "react-router-dom";
import Formulario from "../../components/Formulario";
import Campo from "../../components/Campo";
import Button from "../../components/Button";

import { useState } from "react";

function Login() {
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulação de login (pode adicionar validação básica se quiser)
        if (login && senha) {
            // Simples redirecionamento (sem salvar token)
            navigate("/pag-base");
        } else {
            alert("Por favor, preencha todos os campos.");
        }
    };

    const registrar = () => {
        navigate("/registro");
    };

    return (
        <div className="login">
            <Formulario onSubmit={handleSubmit} titulo="LOGIN" botaoVoltar={false}>
                <p>Entre com seu email e senha para acessar sua conta</p>

                <Campo
                    placeholder="E-mail"
                    type="text"
                    valor={login}
                    required
                    onChange={(valor) => setLogin(valor)}
                />

                <Campo
                    placeholder="Senha"
                    type="password"
                    valor={senha}
                    required
                    onChange={(valor) => setSenha(valor)}
                />

                <Button info="Entrar" />

                <p>
                    Não tem conta ainda?{" "}
                    <span onClick={registrar} style={{ color: "#007bff", cursor: "pointer", fontWeight: "bold" }}>
                        Registre-se
                    </span>
                </p>
            </Formulario>
        </div>
    );
}

export default Login;