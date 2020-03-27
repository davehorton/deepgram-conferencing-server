import styled from 'styled-components';
import DefaultTable from '../styles/Table';

const Table = styled(DefaultTable.Table)`
  width: 100%;
  margin: 0;
  table-layout: auto;
  border: none;
`;

const DateLineTr = styled.tr``;

const TheadTr = styled.tr`
  background: #333;
  @media (max-width: 700px) {
    display: flex;
    justify-content: space-around;
  }
`;

const Tr = styled.tr`
  position: relative;
  border-top: 1px solid #ccc;
  ${DateLineTr} + & {
    border-top: none;
  }
  @media (max-width: 700px) {
    display: flex;
    flex-direction: column;
  }
`;

const Th = styled(DefaultTable.Th)`
  color: #fff;
  padding: 0 0.5rem;
  &:first-child,
  &:last-child {
    width: unset;
  }
  &:nth-child(4) {
    text-align: right;
  }
  @media (max-width: 700px) {
    padding: 0;
    font-size: 0.9rem;
  }
`;

const Td = styled(DefaultTable.Td)`
  padding: 0.5rem;
  &:first-child,
  &:nth-child(2) {
    width: 6rem;
    color: #777;
  }
  &:nth-child(4),
  &:nth-child(5) {
    text-align: right
    color: #777;
  }
  @media (max-width: 700px) {
    &:first-child {
      padding-bottom: 0;
    }
    &:nth-child(2) {
      position: absolute;
      top: 0;
      left: 4rem;
    }
    &:nth-child(3) {
      padding-bottom: 1rem;
    }
    &:nth-child(4) {
      position: absolute;
      top: 0;
      right: 5rem;
    }
    &:nth-child(5) {
      position: absolute;
      top: 0;
      right: 0;
      width: 5rem;
    }
  }
`;

const NoResultsTd = styled.td`
  padding: 4rem;
  text-align: center;
`;

const DateLineTd = styled(Td)`
  text-align: center;
  padding: 0.5rem 0;
  color: #777;
  &:after {
    content: '';
    box-sizing: border-box;
    border-left: 0.5rem solid #fff;
    border-right: 0.5rem solid #fff;
    width: 100%;
    height: 1px;
    background: #aaa;
    position: absolute;
    top: 49%;
    left: 0;
    z-index: -1;
  }
`;

const DateLineDate = styled.span`
  padding: 0.5rem;
  background: #fff;
`;

export  default {
  Table,
  DateLineTr,
  TheadTr,
  Tr,
  Th,
  Td,
  NoResultsTd,
  DateLineTd,
  DateLineDate,
};
