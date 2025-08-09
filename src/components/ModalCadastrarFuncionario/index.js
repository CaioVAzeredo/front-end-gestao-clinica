import React, { useState } from "react";
import styled from "styled-components";
const REACT_APP_PORT = process.env.REACT_APP_PORT;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 650px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;

  h2 {
    margin-bottom: 20px;
  }

  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #444;
  }

  label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
    margin-top: 10px;
  }

  input,
  select {
    width: 100%;
    padding: 8px;
    margin-bottom: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  textarea {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    resize: vertical;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }

  button.cancelar {
    background: #aaa;
  }

  button {
    background: #009688;
    color: #fff;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .erro {
    color: red;
    font-size: 12px;
    margin-top: -4px;
    margin-bottom: 6px;
  }
`;

function ModalCadastrarFuncionario({ onClose, onSalvou }) {
    const [Funcionario, setFuncionario] = useState({
        nome: "",
        telefone: "",
        email: "",
        cpf: "",
        perfil: "",
        senha: "",
        ativo: true,
        endereco: {
            logradouro: "",
            numero: "",
            complemento: "",
            cidade: "",
            uf: "",
            cep: ""
        }
    });
    const [erros, setErros] = useState({});
    const [salvando, setSalvando] = useState(false);

    function validar() {
        const novosErros = {};

        // Nome obrigatório
        if (!Funcionario.nome.trim()) {
            novosErros.nome = "O nome é obrigatório.";
        }

        // Telefone - exatamente 11 dígitos
        if (!Funcionario.telefone) {
            novosErros.telefone = "O telefone é obrigatório.";
        } else if (Funcionario.telefone.length !== 11) {
            novosErros.telefone = "O telefone deve ter exatamente 11 números.";
        }

        // E-mail válido
        if (!Funcionario.email.trim()) {
            novosErros.email = "O e-mail é obrigatório.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Funcionario.email)) {
            novosErros.email = "E-mail inválido.";
        }

        // CPF - exatamente 11 dígitos
        if (!Funcionario.cpf) {
            novosErros.cpf = "O CPF é obrigatório.";
        } else if (Funcionario.cpf.length !== 11) {
            novosErros.cpf = "O CPF deve ter exatamente 11 números.";
        }

        // Perfil obrigatório
        if (!Funcionario.perfil) {
            novosErros.perfil = "O Perfil é obrigatório";
        }

        // Perfil obrigatório
        if (!Funcionario.senha) {
            novosErros.senha = "A senha é obrigatória";
        }

        // Logradouro obrigatório
        if (!Funcionario.endereco.logradouro.trim()) {
            novosErros.logradouro = "O logradouro é obrigatório.";
        }

        // Número - exatamente 2 caracteres
        if (!Funcionario.endereco.numero) {
            novosErros.numero = "O número é obrigatório.";
        }

        // Cidade obrigatória
        if (!Funcionario.endereco.cidade.trim()) {
            novosErros.cidade = "A cidade é obrigatória.";
        }

        // UF - exatamente 2 letras
        if (!Funcionario.endereco.uf) {
            novosErros.uf = "O UF é obrigatório.";
        } else if (!/^[A-Za-z]{2}$/.test(Funcionario.endereco.uf)) {
            novosErros.uf = "O UF deve ter exatamente 2 letras.";
        }

        // CEP - exatamente 8 números
        if (!Funcionario.endereco.cep) {
            novosErros.cep = "O CEP é obrigatório.";
        } else if (!/^\d{8}$/.test(Funcionario.endereco.cep)) {
            novosErros.cep = "O CEP deve ter exatamente 8 números.";
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    }

    async function salvarFuncionario(e) {
        e.preventDefault();
        if (!validar()) return;

        setSalvando(true);
        try {
            const resp = await fetch(`http://localhost:${REACT_APP_PORT}/api/Funcionarios`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Funcionario)
            });
            if (!resp.ok) {
                const txt = await resp.text().catch(() => "");
                throw new Error(txt || `Erro HTTP ${resp.status}`);
            }
            alert("Funcionario cadastrado com sucesso!");
            if (typeof onSalvou === "function") onSalvou();
            onClose();
        } catch (error) {
            console.error("Erro ao cadastrar Funcionario", error);
            alert("Erro ao cadastrar Funcionario!");
        } finally {
            setSalvando(false);
        }
    }

    function handleEnderecoChange(e) {
        const { name, value } = e.target;
        setFuncionario((prev) => ({
            ...prev,
            endereco: { ...prev.endereco, [name]: value }
        }));
    }

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <button type="button" className="close-button" onClick={onClose}>
                    ×
                </button>
                <h2>Cadastrar Funcionario</h2>

                <form onSubmit={salvarFuncionario}>
                    <label>Nome</label>
                    <input
                        value={Funcionario.nome}
                        onChange={(e) => setFuncionario({ ...Funcionario, nome: e.target.value })}
                    />
                    {erros.nome && <div className="erro">{erros.nome}</div>}

                    <label>Telefone</label>
                    <input
                        value={Funcionario.telefone}
                        maxLength={11}
                        onChange={(e) =>
                            setFuncionario({ ...Funcionario, telefone: e.target.value.replace(/\D/g, "") })
                        }
                    />
                    {erros.telefone && <div className="erro">{erros.telefone}</div>}

                    <label>E-mail</label>
                    <input
                        type="email"
                        value={Funcionario.email}
                        onChange={(e) => setFuncionario({ ...Funcionario, email: e.target.value })}
                    />
                    {erros.email && <div className="erro">{erros.email}</div>}

                    <label>CPF</label>
                    <input
                        value={Funcionario.cpf}
                        maxLength={11}
                        onChange={(e) =>
                            setFuncionario({ ...Funcionario, cpf: e.target.value.replace(/\D/g, "") })
                        }
                    />
                    {erros.cpf && <div className="erro">{erros.cpf}</div>}

                    <label>Senha</label>
                    <input
                        type="password"
                        value={Funcionario.senha}
                        onChange={(e) => setFuncionario({ ...Funcionario, senha: e.target.value })}
                    />
                    {erros.senha && <div className="erro">{erros.senha}</div>}

                    <label>Perfil</label>
                    <select
                        id="perfil"
                        value={Funcionario.perfil}
                        onChange={(e) => setFuncionario({ ...Funcionario, perfil: e.target.value })}
                    >
                        <option value="admin">Administrador</option>
                        <option value="funcionario">Funcionário</option>
                    </select>

                    <label>Status</label>
                    <select
                        value={String(Funcionario.ativo)}
                        onChange={(e) => setFuncionario({ ...Funcionario, ativo: e.target.value === "true" })}
                    >
                        <option value="true">Ativo</option>
                        <option value="false">Inativo</option>
                    </select>

                    <h3>Endereço</h3>
                    <label>Logradouro</label>
                    <input
                        name="logradouro"
                        value={Funcionario.endereco.logradouro}
                        onChange={handleEnderecoChange}
                    />
                    {erros.logradouro && <div className="erro">{erros.logradouro}</div>}

                    <label>Número</label>
                    <input
                        name="numero"
                        maxLength={10000}
                        value={Funcionario.endereco.numero}
                        onChange={handleEnderecoChange}
                    />
                    {erros.numero && <div className="erro">{erros.numero}</div>}

                    <label>Complemento</label>
                    <input
                        name="complemento"
                        value={Funcionario.endereco.complemento}
                        onChange={handleEnderecoChange}
                    />

                    <label>Cidade</label>
                    <input
                        name="cidade"
                        value={Funcionario.endereco.cidade}
                        onChange={handleEnderecoChange}
                    />
                    {erros.cidade && <div className="erro">{erros.cidade}</div>}

                    <label>UF</label>
                    <input
                        name="uf"
                        maxLength={2}
                        value={Funcionario.endereco.uf}
                        onChange={(e) =>
                            handleEnderecoChange({
                                target: { name: "uf", value: e.target.value.toUpperCase() }
                            })
                        }
                    />
                    {erros.uf && <div className="erro">{erros.uf}</div>}

                    <label>CEP</label>
                    <input
                        name="cep"
                        maxLength={8}
                        value={Funcionario.endereco.cep}
                        onChange={(e) =>
                            handleEnderecoChange({
                                target: { name: "cep", value: e.target.value.replace(/\D/g, "") }
                            })
                        }
                    />
                    {erros.cep && <div className="erro">{erros.cep}</div>}

                    <div className="modal-actions">
                        <button type="button" className="cancelar" onClick={onClose} disabled={salvando}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={salvando}>
                            {salvando ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </form>
            </ModalContent>
        </ModalOverlay>
    );
}

export default ModalCadastrarFuncionario;
