import styled from 'styled-components';

const Menu = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: 0 0.05rem 0.1rem 0.1rem rgba(0,0,0,0.25);
  right: 1rem;
  top: 2.5rem;
  z-index: 100;
`;

const Link = styled.button`
  padding: 0.5rem;
  border: none;
  background: none;
  color: #00a878;
  font-size: 1rem;
  text-align: left;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    background: #D5E2DE;
  }
`;

export default {
  Menu,
  Link
};
