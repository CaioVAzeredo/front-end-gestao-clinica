import React, { useState } from "react";
import styled from "styled-components";
const REACT_APP_PORT = process.env.REACT_APP_PORT;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
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
  width: 450px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
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

  input, select {
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
`;

function ModalCadastrarCliente({ onClose }) {
    const [cliente, setCliente] = useState({
        nome: "",
        telefone: "",
        email: "",
        cpf: "",
        observacoes: "",
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

    async function salvarCliente() {
        try {
            await fetch(`http://localhost:${REACT_APP_PORT}/api/clientes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cliente)
            });
            alert("Cliente cadastrado com sucesso!");
            onClose();
        } catch (error) {
            console.error("Erro ao cadastrar cliente", error);
        }
    }

    function handleEnderecoChange(e) {
        setCliente({
            ...cliente,
            endereco: { ...cliente.endereco, [e.target.name]: e.target.value }
        });
    }

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Cadastrar Cliente</h2>

                <label>Nome</label>
                <input
                    value={cliente.nome}
                    onChange={e => setCliente({ ...cliente, nome: e.target.value })}
                />

                <label>Telefone</label>
                <input
                    value={cliente.telefone}
                    onChange={e => setCliente({ ...cliente, telefone: e.target.value })}
                />

                <label>E-mail</label>
                <input
                    value={cliente.email}
                    onChange={e => setCliente({ ...cliente, email: e.target.value })}
                />

                <label>CPF</label>
                <input
                    value={cliente.cpf}
                    onChange={e => setCliente({ ...cliente, cpf: e.target.value })}
                />

                <label>Observações</label>
                <textarea
                    rows="3"
                    value={cliente.observacoes}
                    onChange={e => setCliente({ ...cliente, observacoes: e.target.value })}
                />

                <label>Status</label>
                <select
                    value={cliente.ativo}
                    onChange={e => setCliente({ ...cliente, ativo: e.target.value === "true" })}
                >
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                </select>

                <h3>Endereço</h3>
                <label>Logradouro</label>
                <input
                    name="logradouro"
                    value={cliente.endereco.logradouro}
                    onChange={handleEnderecoChange}
                />
                <label>Número</label>
                <input
                    name="numero"
                    value={cliente.endereco.numero}
                    onChange={handleEnderecoChange}
                />
                <label>Complemento</label>
                <input
                    name="complemento"
                    value={cliente.endereco.complemento}
                    onChange={handleEnderecoChange}
                />
                <label>Cidade</label>
                <input
                    name="cidade"
                    value={cliente.endereco.cidade}
                    onChange={handleEnderecoChange}
                />
                <label>UF</label>
                <input
                    name="uf"
                    value={cliente.endereco.uf}
                    onChange={handleEnderecoChange}
                />
                <label>CEP</label>
                <input
                    name="cep"
                    value={cliente.endereco.cep}
                    onChange={handleEnderecoChange}
                />

                <div className="modal-actions">
                    <button className="cancelar" onClick={onClose}>Cancelar</button>
                    <button onClick={salvarCliente}>Salvar</button>
                </div>
            </ModalContent>
        </ModalOverlay>
    );
}

export default ModalCadastrarCliente;
