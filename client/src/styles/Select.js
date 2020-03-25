import styled from 'styled-components';

const Container = styled.div`
  display: flex;
`;

const Label = styled.label`
  padding: 0.5rem 0.75rem;
  border: none;
  border-top-left-radius: 0.2rem;
  border-bottom-left-radius: 0.2rem;
  background: #333;
  color: #fff;
  cursor: pointer;

  &:hover {
    background: #555;
  }
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border: none;
  border-top-right-radius: 0.2rem;
  border-bottom-right-radius: 0.2rem;
  cursor: pointer;
  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px ${props => props.theme.green}
  }
`;

export default {
  Select,
  Label,
  Container,
};
