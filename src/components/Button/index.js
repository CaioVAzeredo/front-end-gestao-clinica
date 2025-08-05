import styled from 'styled-components';

// Estilizando o botão diretamente
const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.8;
  }
`;

function Button({ onClick, info }) {
  return <StyledButton onClick={onClick}>{info}</StyledButton>;
}

export default Button;