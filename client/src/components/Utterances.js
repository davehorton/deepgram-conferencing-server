import React, { Component } from 'react';
import axios from 'axios';
import { datetime, timeOnly, dateOnly, timeDifference, isSameDate, formatTimeDuration, formatTimeDurationMMMSS, getTimeOffset } from '../util/date-format';
import Main from '../styles/Main';
import H1 from '../styles/H1';
import A from '../styles/A';
import Button from '../styles/Button';
import Table from '../styles/Table';
import Audio from '../styles/Audio';
import DescriptiveTable from '../styles/DescriptiveTable';
import styled from 'styled-components';

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 1rem;
  @media (max-width: 700px) {
    padding: 0.5rem;
  }
`;

const UtterTable = {};
UtterTable.Table = styled(Table.Table)`
  width: 100%;
  margin: 0;
  table-layout: auto;
  border: none;
`;
UtterTable.DateLineTr = styled.tr``;
UtterTable.TheadTr = styled.tr`
  background: #333;
  @media (max-width: 700px) {
    display: flex;
    justify-content: space-around;
  }
`;
UtterTable.Tr = styled.tr`
  position: relative;
  border-top: 1px solid #ccc;
  ${UtterTable.DateLineTr} + & {
    border-top: none;
  }
  @media (max-width: 700px) {
    display: flex;
    flex-direction: column;
  }
`;
UtterTable.Th = styled(Table.Th)`
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
UtterTable.Td = styled(Table.Td)`
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
UtterTable.NoResultsTd = styled.td`
  padding: 4rem;
  text-align: center;
`;
UtterTable.DateLineTd = styled(UtterTable.Td)`
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
UtterTable.DateLineDate = styled.span`
  padding: 0.5rem;
  background: #fff;
`;

const AudioWrapper = styled.div`
  display: flex;
  margin: 0 0.5rem 1rem;
`;

class Utterances extends Component {
  constructor() {
    super();
    this.state = {
      confInfo: {},
      transInfo: {},
      utterances: [],
      minMemberId: 0,
    };
    this.shouldDisplayDate = this.shouldDisplayDate.bind(this);
    this.memberIdAdjustment = this.memberIdAdjustment.bind(this);
  }
  async componentDidMount() {
    const confId = this.props.match.params.confId;
    const transId = this.props.match.params.transId;

    const confInfo = await axios.get(`/api/conf/${confId}`);
    this.setState({ confInfo: confInfo.data });

    const transInfo = await axios.get(`/api/trans/${transId}`);
    this.setState({ transInfo: transInfo.data });

    const utterances = await axios.get(`/api/trans/${transId}/utter`);
    this.setState({ utterances: utterances.data });

    const minMemberId = utterances.data.reduce((acc, cur) => {
      if (acc !== 0 && !acc) return cur.member_id;
      if (cur.member_id !== 0 && !cur.member_id) return acc;
      if (cur.member_id < acc) return cur.member_id;
      return acc;
    }, '');
    this.setState({ minMemberId });

    try {
      await axios.get(`/api/audio/${this.props.match.params.transId}`);
      this.setState({ audioExists: true });
    } catch (err) {
      this.setState({ audioExists: false });
    }
  }

  shouldDisplayDate(u) {
    const time_start = this.state.transInfo.time_start;
    const utterances = this.state.utterances;
    if (!u) return false;
    const dateOfCurrentItem = getTimeOffset(
      time_start,
      u.start,
    );
    const prevUtterance = utterances.filter(ut => ut.seq === u.seq - 1)
    if (!prevUtterance[0]) return;
    const dateOfPreviousItem = getTimeOffset(
      time_start,
      prevUtterance[0] && prevUtterance[0].start,
    );

    return isSameDate(dateOfPreviousItem,dateOfCurrentItem)
      ? false
      : true
  }

  memberIdAdjustment(id) {
    return id;
    //return id - this.state.minMemberId + 1;
  }

  render() {
    return (
      <Main noPadding>
        <Header>
          <div>
            <A href={`/conf/${this.props.match.params.confId}`}>
              &lt; Back to Conference {this.state.confInfo.meeting_pin}
            </A>
            <H1>Transcription</H1>
          </div>
          <DescriptiveTable.Table>
            <tbody>
              <tr>
                <DescriptiveTable.LightTd>Conference:</DescriptiveTable.LightTd>
                <td>
                  {this.state.confInfo.meeting_pin}:
                  {' '}
                  {this.state.confInfo.description}
                </td>
              </tr>
              <tr>
                <DescriptiveTable.LightTd>Start Time:</DescriptiveTable.LightTd>
                <td>{datetime(this.state.transInfo.time_start)}</td>
              </tr>
              <tr>
                <DescriptiveTable.LightTd>End Time:</DescriptiveTable.LightTd>
                <td>
                  {
                    this.state.transInfo.time_end
                      ? datetime(this.state.transInfo.time_end)
                      : 'Currently in progress'
                  }
                </td>
              </tr>
              {
                this.state.transInfo.time_end
                  ? <tr>
                      <DescriptiveTable.LightTd>Duration:</DescriptiveTable.LightTd>
                      <td>
                        {
                          formatTimeDuration(timeDifference(
                            this.state.transInfo.time_start,
                            this.state.transInfo.time_end
                          ))
                        }
                      </td>
                    </tr>
                  : null
              }
            </tbody>
          </DescriptiveTable.Table>
        </Header>
        {
          this.state.audioExists
            ? <AudioWrapper>
                <Audio
                  controls
                  src={`/api/audio/${this.props.match.params.transId}`}
                ></Audio>
                <Button
                  as="a"
                  href={`/api/audio/${this.props.match.params.transId}`}
                >
                  Download
                </Button>
              </AudioWrapper>
            : <Header>No audio recording available for this transcription</Header>
        }
        <UtterTable.Table>
          <thead>
            <UtterTable.TheadTr>
              <UtterTable.Th>Time</UtterTable.Th>
              <UtterTable.Th>Member ID</UtterTable.Th>
              <UtterTable.Th>Speech</UtterTable.Th>
              <UtterTable.Th>Duration</UtterTable.Th>
              <UtterTable.Th>Confidence</UtterTable.Th>
            </UtterTable.TheadTr>
          </thead>
          <tbody>
            <UtterTable.DateLineTr>
              <UtterTable.DateLineTd colSpan="5">
                <UtterTable.DateLineDate>
                  Started {dateOnly(this.state.transInfo.time_start)} at {timeOnly(this.state.transInfo.time_start)}
                </UtterTable.DateLineDate>
              </UtterTable.DateLineTd>
            </UtterTable.DateLineTr>
            {
              this.state.utterances.length
                ? null
                : <tr>
                    <UtterTable.NoResultsTd colSpan="5" noResults>
                      There were no utterances during this transcription
                    </UtterTable.NoResultsTd>
                  </tr>
            }
            {
              this.state.utterances.map(u => (
                <React.Fragment key={u.seq}>
                  {
                    this.shouldDisplayDate(u)
                      ? <UtterTable.DateLineTr>
                          <UtterTable.DateLineTd colSpan="5">
                            <UtterTable.DateLineDate>
                              {dateOnly(getTimeOffset(this.state.transInfo.time_start, u.start))}
                            </UtterTable.DateLineDate>
                          </UtterTable.DateLineTd>
                        </UtterTable.DateLineTr>
                      : null
                  }
                  <UtterTable.Tr>
                    <UtterTable.Td>
                      {formatTimeDurationMMMSS(timeDifference(this.state.transInfo.time_start,u.start_timestamp))}
                    </UtterTable.Td>
                    <UtterTable.Td>{this.memberIdAdjustment(u.member_id)}</UtterTable.Td>
                    <UtterTable.Td>{u.speech}</UtterTable.Td>
                    <UtterTable.Td>{formatTimeDuration(u.duration, 1)}</UtterTable.Td>
                    <UtterTable.Td>{
                      u.confidence
                        ? parseFloat(u.confidence).toFixed(3)
                        : null
                      }</UtterTable.Td>
                  </UtterTable.Tr>
                </React.Fragment>
              ))
            }
            <UtterTable.DateLineTr>
              <UtterTable.DateLineTd colSpan="5">
                <UtterTable.DateLineDate>
                  {
                    this.state.transInfo.time_end
                      ? `Ended ${dateOnly(this.state.transInfo.time_end)} at ${timeOnly(this.state.transInfo.time_end)}`
                      : 'Conference is still in progress'}
                </UtterTable.DateLineDate>
              </UtterTable.DateLineTd>
            </UtterTable.DateLineTr>
          </tbody>
        </UtterTable.Table>
      </Main>
    );
  }
}

export default Utterances;
