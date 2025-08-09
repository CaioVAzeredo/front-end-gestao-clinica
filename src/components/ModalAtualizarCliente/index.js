import React, { useEffect, useState } from "react";
import styled from "styled-components";

const REACT_APP_PORT = process.env.REACT_APP_PORT;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6); /* Opacidade refinada para profundidade */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 10px;
  transition: opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Animação suave */
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
`;

const ModalContent = styled.div`
  background: linear-gradient(145deg, #ffffff, #f9f9f9); /* Gradiente sutil para elegância */
  padding: 24px;
  border-radius: 16px; /* Bordas mais refinadas */
  width: 100%;
  max-width: 40vw; /* Mais compacto, evitando extensão */
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1); /* Sombras rebuscadas com camadas */
  position: relative;
  animation: fadeInScale 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  @keyframes fadeInScale {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  /* Responsividade: Empilha campos em mobile */
  @media (max-width: 768px) {
    padding: 16px;
    max-width: 95%;
    .form-row, .address-grid { display: block; }
  }

  h2, h3 {
    margin-bottom: 12px;
    font-family: 'Roboto', sans-serif; /* Tipografia refinada (importe via CSS) */
    font-weight: 500;
    color: #00796b; /* Cor temática */
  }

  .close-button {
    position: absolute;
    top: 12px;
    right: 12px;
    background: transparent;
    border: none;
    font-size: 26px;
    cursor: pointer;
    color: #757575;
    transition: color 0.2s, transform 0.2s;
    &:hover { color: #424242; transform: scale(1.1); }
  }

  label {
    display: block;
    font-size: 13px;
    margin-bottom: 4px;
    margin-top: 8px;
    font-weight: 500;
    color: #424242;
  }

  input,
  select,
  textarea {
    width: 100%;
    max-width: 300px; /* Limite para evitar inputs extensos */
    padding: 10px 12px;
    margin-bottom: 6px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    font-size: 15px;
    background: #fff;
    transition: border-color 0.2s, box-shadow 0.2s;
    &:focus { border-color: #009688; box-shadow: 0 0 0 2px rgba(0, 150, 136, 0.2); }
  }

  textarea {
    resize: vertical;
    min-height: 70px;
    max-width: 100%; /* Controle de extensão */
  }

  .form-row {
    display: flex;
    gap: 16px;
    > div { flex: 1; min-width: 0; }
  }

  .address-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    transition: background 0.2s, transform 0.1s;
    &:active { transform: scale(0.98); }
  }

  button.cancelar {
    background: #e0e0e0;
    color: #424242;
    &:hover { background: #bdbdbd; }
  }

  button[type="submit"] {
    background: #009688;
    color: #fff;
    &:hover { background: #00796b; }
    &:disabled { background: #80cbc4; cursor: not-allowed; }
  }

  .erro {
    color: #d32f2f;
    font-size: 12px;
    margin-top: -4px;
    margin-bottom: 4px;
    font-style: italic; /* Toque rebuscado */
  }
`;

function ModalAtualizarCliente({ onClose, cliente: clienteProp, onSalvou }) {
  const [cliente, setCliente] = useState({
    idCliente: null,
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
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (clienteProp) {
      setCliente({
        idCliente: clienteProp.idCliente ?? null,
        nome: clienteProp.nome ?? "",
        telefone: clienteProp.telefone ?? "",
        email: clienteProp.email ?? "",
        cpf: clienteProp.cpf ?? "",
        observacoes: clienteProp.observacoes ?? "",
        ativo: typeof clienteProp.ativo === "boolean" ? clienteProp.ativo : true,
        endereco: {
          logradouro: clienteProp.endereco?.logradouro ?? "",
          numero: clienteProp.endereco?.numero ?? "",
          complemento: clienteProp.endereco?.complemento ?? "",
          cidade: clienteProp.endereco?.cidade ?? "",
          uf: clienteProp.endereco?.uf ?? "",
          cep: clienteProp.endereco?.cep ?? ""
        }
      });
    }
  }, [clienteProp]);

  function validar() {
    const novosErros = {};

    if (!cliente.nome.trim()) novosErros.nome = "O nome é obrigatório.";
    if (!cliente.telefone) novosErros.telefone = "O telefone é obrigatório.";
    else if (cliente.telefone.length !== 11) novosErros.telefone = "O telefone deve ter exatamente 11 números.";
    if (!cliente.email.trim()) novosErros.email = "O e-mail é obrigatório.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email)) novosErros.email = "E-mail inválido.";
    if (!cliente.cpf) novosErros.cpf = "O CPF é obrigatório.";
    else if (cliente.cpf.length !== 11) novosErros.cpf = "O CPF deve ter exatamente 11 números.";
    if (!cliente.endereco.logradouro.trim()) novosErros.logradouro = "O logradouro é obrigatório.";
    if (!cliente.endereco.numero) novosErros.numero = "O número é obrigatório.";
    if (!cliente.endereco.cidade.trim()) novosErros.cidade = "A cidade é obrigatória.";
    if (!cliente.endereco.uf) novosErros.uf = "O UF é obrigatório.";
    else if (!/^[A-Za-z]{2}$/.test(cliente.endereco.uf)) novosErros.uf = "O UF deve ter exatamente 2 letras.";
    if (!cliente.endereco.cep) novosErros.cep = "O CEP é obrigatório.";
    else if (!/^\d{8}$/.test(cliente.endereco.cep)) novosErros.cep = "O CEP deve ter exatamente 8 números.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function atualizarCliente(e) {
    e.preventDefault();
    if (!validar()) return;

    setSalvando(true);
    try {
      const id = cliente.idCliente;
      if (!id) {
        alert("ID do cliente não informado.");
        return;
      }
      // Cria uma cópia sem idCliente para evitar alteração no backend
      const { idCliente, ...dadosAtualizacao } = cliente;

      const resp = await fetch(`http://localhost:${REACT_APP_PORT}/api/clientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAtualizacao) // Envia sem idCliente
      });
      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        throw new Error(txt || `Erro HTTP ${resp.status}`);
      }
      alert("Cliente atualizado com sucesso!");
      if (onSalvou) onSalvou();
      handleClose();
    } catch (error) {
      alert(`Erro ao atualizar cliente: ${error.message}`);
    } finally {
      setSalvando(false);
    }
  }

  function handleEnderecoChange(e) {
    const { name, value } = e.target;
    setCliente((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, [name]: value }
    }));
  }

  function handleClose() {
    setIsOpen(false);
    setTimeout(onClose, 400); // Espera animação
  }

  return (
    <ModalOverlay onClick={handleClose} isOpen={isOpen}>
      <ModalContent onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button type="button" className="close-button" onClick={handleClose} aria-label="Fechar modal" disabled={salvando}>
          ×
        </button>
        <h2 id="modal-title">Atualizar Cliente</h2>

        <form onSubmit={atualizarCliente}>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            placeholder="Nome completo"
            value={cliente.nome}
            onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
            disabled={salvando}
          />
          {erros.nome && <div className="erro">{erros.nome}</div>}

          <div className="form-row">
            <div>
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                placeholder="11987654321"
                value={cliente.telefone}
                maxLength={11}
                onChange={(e) => setCliente({ ...cliente, telefone: e.target.value.replace(/\D/g, "") })}
                disabled={salvando}
              />
              {erros.telefone && <div className="erro">{erros.telefone}</div>}
            </div>
            <div>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="exemplo@email.com"
                value={cliente.email}
                onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
                disabled={salvando}
              />
              {erros.email && <div className="erro">{erros.email}</div>}
            </div>
          </div>

          <div className="form-row">
            <div>
              <label htmlFor="cpf">CPF</label>
              <input
                id="cpf"
                placeholder="12345678901"
                value={cliente.cpf}
                maxLength={11}
                onChange={(e) => setCliente({ ...cliente, cpf: e.target.value.replace(/\D/g, "") })}
                disabled={salvando}
              />
              {erros.cpf && <div className="erro">{erros.cpf}</div>}
            </div>
            <div>
              <label htmlFor="ativo">Status</label>
              <select
                id="ativo"
                value={String(cliente.ativo)}
                onChange={(e) => setCliente({ ...cliente, ativo: e.target.value === "true" })}
                disabled={salvando}
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
          </div>

          <label htmlFor="observacoes">Observações</label>
          <textarea
            id="observacoes"
            placeholder="Notas opcionais"
            value={cliente.observacoes}
            onChange={(e) => setCliente({ ...cliente, observacoes: e.target.value })}
            disabled={salvando}
          />

          <h3>Endereço</h3>
          <div className="address-grid">
            <div>
              <label htmlFor="logradouro">Logradouro</label>
              <input
                id="logradouro"
                name="logradouro"
                placeholder="Rua Exemplo"
                value={cliente.endereco.logradouro}
                onChange={handleEnderecoChange}
                disabled={salvando}
              />
              {erros.logradouro && <div className="erro">{erros.logradouro}</div>}
            </div>
            <div>
              <label htmlFor="numero">Número</label>
              <input
                id="numero"
                name="numero"
                placeholder="123"
                maxLength={10}
                value={cliente.endereco.numero}
                onChange={handleEnderecoChange}
                disabled={salvando}
              />
              {erros.numero && <div className="erro">{erros.numero}</div>}
            </div>
            <div>
              <label htmlFor="complemento">Complemento</label>
              <input
                id="complemento"
                name="complemento"
                placeholder="Apt 456 (opcional)"
                value={cliente.endereco.complemento}
                onChange={handleEnderecoChange}
                disabled={salvando}
              />
            </div>
            <div>
              <label htmlFor="cidade">Cidade</label>
              <input
                id="cidade"
                name="cidade"
                placeholder="São Paulo"
                value={cliente.endereco.cidade}
                onChange={handleEnderecoChange}
                disabled={salvando}
              />
              {erros.cidade && <div className="erro">{erros.cidade}</div>}
            </div>
            <div>
              <label htmlFor="uf">UF</label>
              <input
                id="uf"
                name="uf"
                placeholder="SP"
                maxLength={2}
                value={cliente.endereco.uf}
                onChange={(e) =>
                  handleEnderecoChange({
                    target: { name: "uf", value: e.target.value.toUpperCase() }
                  })
                }
                disabled={salvando}
              />
              {erros.uf && <div className="erro">{erros.uf}</div>}
            </div>
            <div>
              <label htmlFor="cep">CEP</label>
              <input
                id="cep"
                name="cep"
                placeholder="12345678"
                maxLength={8}
                value={cliente.endereco.cep}
                onChange={(e) =>
                  handleEnderecoChange({
                    target: { name: "cep", value: e.target.value.replace(/\D/g, "") }
                  })
                }
                disabled={salvando}
              />
              {erros.cep && <div className="erro">{erros.cep}</div>}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancelar" onClick={handleClose} disabled={salvando}>
              Cancelar
            </button>
            <button type="submit" disabled={salvando}>
              {salvando ? "Atualizando..." : "Atualizar"}
            </button>
          </div>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}

export default ModalAtualizarCliente;
