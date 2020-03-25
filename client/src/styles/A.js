import styled from 'styled-components';

const A = styled.a`
  text-decoration: none;
  color: ${props => props.theme.green}
  &:hover {
    text-decoration: underline;
  }
`;

export default A;
