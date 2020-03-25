import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const Nav = styled.nav`
  background: #1F211F;
  padding: 0.5rem;
  display: flex;
`;

const StyledNavLink = styled(NavLink)`
  padding: 1rem;
  text-decoration: none;
  color: #d3d3d3;
  border-radius: 0.2rem;

  &:hover {
    background: #343634;
  }
`;

export default {
  Nav,
  StyledNavLink,
}