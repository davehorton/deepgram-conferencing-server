import styled from 'styled-components';

const Table = styled.table`
  margin: 1rem auto;
  border-collapse: collapse;
  text-align: left;
  width: 100%;
  table-layout: fixed;
  border-left: 1px solid #bbb;
  border-right: 1px solid #bbb;
  @media (max-width: 700px) {
    border: none;
  }
`;

const Thead = styled.thead`
  border-top: 1px solid #bbb;
  background: #eee;
`;

const Tr = styled.tr`
  border-bottom: 1px solid #bbb;
  position: relative;
  tbody > & {
    color: #00a878;
    ${props => props.forceHighlight && `
      background: #D5E2DE;
    `}
    ${props => props.allowHighlight && `
      &:hover {
        background: #D5E2DE;
      }
    `}
  }
  display: flex;
  align-items: center;
`;

const Th = styled.th`
  line-height: 3rem;
  padding: 0 1rem;
  color: #555;
  text-align: left;
  font-weight: normal;
  ${props => props.center && `
    text-align: center;
  `}
  &:first-child {
    width: 7rem;
    box-sizing: border-box;
    flex-shrink: 0;
  }
  &:last-child {
    width: 3rem;
    flex-shrink: 0;
  }
  @media (max-width: 700px) {
    padding: 0.5rem;
    height: unset;
  }
`;

const Td = styled.td`
  position: relative;
  padding: 0;
  &:first-child {
    width: 7rem;
    flex-shrink: 0;
  }
  &:last-child {
    width: 3rem;
    flex-shrink: 0;
  }
  ${props => props.grow && `
    overflow: hidden;
    flex-grow: 1;
  `}
`;

const A = styled.a`
  display: block;
  line-height: 3rem;
  padding: 0 1rem;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  @media (max-width: 700px) {
    padding-left: 0.5rem;
    padding-right: 0;
  }
`;

const Button = styled.button`
  display: block;
  height: 3rem;
  padding: 0 1rem;
  border: none;
  background: none;
  font-size: 1.2rem;
  color: inherit;
  cursor: pointer;
  &::-moz-focus-inner {
    border: 0;
  }
  ${props => props.forceHighlight && `
    background: #B9D3CB;
    color: #005D43;
  `}
  ${props => props.allowHighlight && `
    &:hover {
      background: #B9D3CB;
      color: #005D43;
    }
  `}
  &:disabled {
    color: #ccc;
  }
  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px #00a878;
  }
  @media (max-width: 700px) {
    padding: 0 0.5rem;
  }
`;

const Span = styled.span`
  ${props => props.blue && `
    color: #004ba8;
    padding: 0 0.5rem;
  `}
`;

export default {
  Table,
  Thead,
  Tr,
  Th,
  Td,
  A,
  Button,
  Span,
};
