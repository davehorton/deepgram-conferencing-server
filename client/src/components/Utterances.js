import React, { Component } from 'react';
import axios from 'axios';
import { datetime, timeOnly, dateOnly, timeDifference, isSameDate, formatTimeDuration, formatTimeDurationMMMSS, getTimeOffset } from '../util/date-format';
import Main from '../styles/Main';
import H1 from '../styles/H1';
import A from '../styles/A';
import Button from '../styles/Button';
import Audio from '../styles/Audio';
import TableParticipants from '../styles/TableParticipants';
import TableDescriptive from '../styles/TableDescriptive';
import TableUtter from '../styles/TableUtter';
import styled from 'styled-components';

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 1rem;
  @media (max-width: 700px) {
    padding: 0.5rem;
  }
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
      participants: [],
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

    const participants = await axios.get(`/api/trans/${transId}/participants`);
    this.setState({ participants: participants.data });

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
          <TableParticipants.Container>
            <TableParticipants.Table>
              <thead>
                <TableParticipants.Tr>
                  <TableParticipants.Th>Member ID</TableParticipants.Th>
                  <TableParticipants.Th>Calling Number</TableParticipants.Th>
                  <TableParticipants.Th>Join time</TableParticipants.Th>
                  <TableParticipants.Th>End time</TableParticipants.Th>
                  <TableParticipants.Th>Request ID</TableParticipants.Th>
                </TableParticipants.Tr>
              </thead>
              <tbody>
                {
                  this.state.participants.map(p => (
                    <TableParticipants.Tr key={p.member_id}>
                      <TableParticipants.Td>{p.member_id}</TableParticipants.Td>
                      <TableParticipants.Td>{p.calling_number}</TableParticipants.Td>
                      <TableParticipants.Td>{
                        formatTimeDurationMMMSS(
                          timeDifference(
                            this.state.transInfo.time_start,
                            p.time_start
                          )
                        )
                      }</TableParticipants.Td>
                      <TableParticipants.Td>{
                        formatTimeDurationMMMSS(
                          timeDifference(
                            this.state.transInfo.time_start,
                            p.time_end
                          )
                        )
                      }</TableParticipants.Td>
                      <TableParticipants.Td>{p.request_id}</TableParticipants.Td>
                    </TableParticipants.Tr>
                  ))
                }
              </tbody>
            </TableParticipants.Table>
          </TableParticipants.Container>
          <TableDescriptive.Table>
            <tbody>
              <tr>
                <TableDescriptive.LightTd>Conference:</TableDescriptive.LightTd>
                <td>
                  {this.state.confInfo.meeting_pin}:
                  {' '}
                  {this.state.confInfo.description}
                </td>
              </tr>
              <tr>
                <TableDescriptive.LightTd>Start Time:</TableDescriptive.LightTd>
                <td>{datetime(this.state.transInfo.time_start)}</td>
              </tr>
              <tr>
                <TableDescriptive.LightTd>End Time:</TableDescriptive.LightTd>
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
                      <TableDescriptive.LightTd>Duration:</TableDescriptive.LightTd>
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
          </TableDescriptive.Table>
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
        <TableUtter.Table>
          <thead>
            <TableUtter.TheadTr>
              <TableUtter.Th>Time</TableUtter.Th>
              <TableUtter.Th>Member ID</TableUtter.Th>
              <TableUtter.Th>Speech</TableUtter.Th>
              <TableUtter.Th>Duration</TableUtter.Th>
              <TableUtter.Th>Confidence</TableUtter.Th>
            </TableUtter.TheadTr>
          </thead>
          <tbody>
            <TableUtter.DateLineTr>
              <TableUtter.DateLineTd colSpan="5">
                <TableUtter.DateLineDate>
                  Started {dateOnly(this.state.transInfo.time_start)} at {timeOnly(this.state.transInfo.time_start)}
                </TableUtter.DateLineDate>
              </TableUtter.DateLineTd>
            </TableUtter.DateLineTr>
            {
              this.state.utterances.length
                ? null
                : <tr>
                    <TableUtter.NoResultsTd colSpan="5" noResults>
                      There were no utterances during this transcription
                    </TableUtter.NoResultsTd>
                  </tr>
            }
            {
              this.state.utterances.map(u => (
                <React.Fragment key={u.seq}>
                  {
                    this.shouldDisplayDate(u)
                      ? <TableUtter.DateLineTr>
                          <TableUtter.DateLineTd colSpan="5">
                            <TableUtter.DateLineDate>
                              {dateOnly(getTimeOffset(this.state.transInfo.time_start, u.start))}
                            </TableUtter.DateLineDate>
                          </TableUtter.DateLineTd>
                        </TableUtter.DateLineTr>
                      : null
                  }
                  <TableUtter.Tr>
                    <TableUtter.Td>
                      {formatTimeDurationMMMSS(timeDifference(this.state.transInfo.time_start,u.start_timestamp))}
                    </TableUtter.Td>
                    <TableUtter.Td>{this.memberIdAdjustment(u.member_id)}</TableUtter.Td>
                    <TableUtter.Td>{u.speech}</TableUtter.Td>
                    <TableUtter.Td>{formatTimeDuration(u.duration, 1)}</TableUtter.Td>
                    <TableUtter.Td>{
                      u.confidence
                        ? parseFloat(u.confidence).toFixed(3)
                        : null
                      }</TableUtter.Td>
                  </TableUtter.Tr>
                </React.Fragment>
              ))
            }
            <TableUtter.DateLineTr>
              <TableUtter.DateLineTd colSpan="5">
                <TableUtter.DateLineDate>
                  {
                    this.state.transInfo.time_end
                      ? `Ended ${dateOnly(this.state.transInfo.time_end)} at ${timeOnly(this.state.transInfo.time_end)}`
                      : 'Conference is still in progress'}
                </TableUtter.DateLineDate>
              </TableUtter.DateLineTd>
            </TableUtter.DateLineTr>
          </tbody>
        </TableUtter.Table>
      </Main>
    );
  }
}

export default Utterances;
