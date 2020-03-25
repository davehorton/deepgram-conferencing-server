import styled from 'styled-components';

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.6rem;
`;

const Button = styled.button`
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.2rem;
  background: ${props => props.danger
    ? '#a93535'
    : props.gray
      ? '#aaa'
      : props => props.theme.green
  };
  color: #fff;
  font-size: 1em;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  &:hover {
    background: ${props => props.danger
      ? '#942121'
      : props.gray
        ? '#888'
        : '#1eb288'
    }
  }

  ${ButtonContainer} > & {
    margin-left: 0.5rem;
  }
`;

export default Button;
