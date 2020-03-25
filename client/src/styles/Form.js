import styled from 'styled-components';

const Row = styled.div`
  line-height: 200%;
  @media (max-width: 700px) {
    display: flex;
    flex-direction: column;
    line-height: 125%;
    padding-bottom: 0.5rem;
  }
`;

const Label = styled.label`
  padding-right: 0.2rem;
`;

const Input = styled.input`
  font-size: 1rem;
  padding: 0.2rem;
  border: 1px solid #bbb;
  &:focus {
    border: 1px solid ${props => props.theme.green}
    outline: none;
  }
  @media (max-width: 700px) {
    width: 100%;
  }
`;

export default {
  Row,
  Label,
  Input,
};
