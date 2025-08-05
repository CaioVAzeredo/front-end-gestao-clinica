import styled from 'styled-components';

// Componente estilizado para o contêiner do campo
const CampoContainer = styled.div`
  margin-bottom: 1rem;
`;

// Componente estilizado para o label
const Label = styled.label`
  display: block;
  text-align: left;
  margin-left: 0;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #333;
`;

// Componente estilizado para o input
const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }

  &::placeholder {
    color: #aaa;
  }
`;

function Campo({ placeholder, valor, onChange, type = 'text', required = false }) {
  return (
    <CampoContainer>
      <Label>{placeholder}</Label>
      <Input
        value={valor}
        type={type}
        required={required}
        placeholder={`Digite ${placeholder.toLowerCase()}...`}
        onChange={(e) => onChange(e.target.value)}
      />
    </CampoContainer>
  );
}

export default Campo;