import styled, { css } from 'styled-components';

const Container = styled.div`
  max-height: 8rem;
  overflow-x: hidden;
  border: 1px solid #bbb;
  @media (max-width: 700px) {
    width: 100%;
  }
`;

const Table = styled.table`
  border-collapse: collapse;
  text-align: left;
  @media (max-width: 700px) {
    width: 100%;
  }
`;

const thtd = css`
  padding: 0.25rem 0.5rem;
  &:first-child {
    padding-left: 0.75rem;
  }
  &:last-child {
    padding-right: 1rem;
  }
`;

const Th = styled.th`
  ${thtd}
  font-weight: normal;
  position: sticky;
  top: 0;
  background: #eee;
  box-shadow: 0 1px 0 #bbb
  white-space: nowrap;
`;

const Tr = styled.tr`
  border-bottom: 1px solid #bbb;
  &:last-of-type {
    border: 0;
  }
`;

const Td = styled.td`
  ${thtd}
  &:nth-child(3),
  &:nth-child(4),
  &:nth-child(5) {
    text-align: right;
  }
`;

export default {
  Container,
  Table,
  Th,
  Tr,
  Td,
};
