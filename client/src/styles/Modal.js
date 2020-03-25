import styled from 'styled-components';

const Background = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1rem;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
`;

const Foreground = styled.div`
  max-width: 30rem;
  background: #fff;
  padding: 2rem;
  box-shadow: 0 0.1rem 0.25rem rgba(0,0,0,0.5);
  text-align: left;
  @media (max-width: 700px) {
    padding: 1rem;
  }
`;

const Header = styled.h2`
  margin: 0 0 0.5rem;
`;

export default {
  Background,
  Foreground,
  Header,
}