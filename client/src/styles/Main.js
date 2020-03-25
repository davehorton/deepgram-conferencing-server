import styled from 'styled-components';

const Main = styled.main`
  ${props => props.noPadding
    ? `padding: 1rem 0 4rem;`
    : `
      padding: 1rem 1rem 4rem;
      width: 600px;
      margin: auto;
    `
  };
  
  @media (max-width: 700px) {
    width: 100%;
    padding: 1rem 0 4rem;
  }
`;

export default Main;
