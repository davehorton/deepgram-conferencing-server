import React, { Component } from 'react';
import axios from 'axios';
import DeleteTranscriptionForm from './forms/DeleteTranscriptionForm';
import { datetime, formatTimeDuration, timeDifference } from '../util/date-format';
import Main from '../styles/Main';
import H1 from '../styles/H1';
import A from '../styles/A';
import Table from '../styles/Table';
import Menu from '../styles/Menu';
import Select from '../styles/Select';
import styled from 'styled-components';

const Header = styled.header`
  @media (max-width: 700px) {
    padding: 0.5rem;
  }
`;

class Transcriptions extends Component {
  constructor() {
    super();
    this.state = {
      confInfo: {},
      transcriptions: [],
      rowHighlighted: null,
      modalDisplayed: '',
      transcriptionBeingModified: null,
    }
    this.closeAllMenus = this.closeAllMenus.bind(this);
    this.cancelForm = this.cancelForm.bind(this);
    this.refreshAfterSave = this.refreshAfterSave.bind(this);
    this.sortReverse = this.sortReverse.bind(this);
  }
  toggleTransMenu(id, e) {
    e.stopPropagation();
    this.setState(state => ({
      transcriptions: state.transcriptions.map(t => {
        if (t.id === id) {
          return {
            ...t,
            showMenu: !t.showMenu,
          }
        } else {
          return {
            ...t,
            showMenu: false,
          }
        }
      }),
      rowHighlighted: state.rowHighlighted === id ? null : id,
    }));
  }
  closeAllMenus(e) {
    const menusClosed = this.state.transcriptions.map(t => ({
      ...t,
      showMenu: false,
    }));
    this.setState(state => ({ transcriptions: menusClosed }));
  }
  deleteTranscription(trans, e) {
    e.stopPropagation();
    this.setState(state => ({
      modalDisplayed: 'deleteTranscription',
      transcriptionBeingModified: trans,
      transcriptions: state.transcriptions.map(t => ({
        ...t,
        showMenu: false,
      }))
    }));
  }
  cancelForm() {
    this.setState({
      modalDisplayed: '',
      transcriptionBeingModified: null,
    })
  }
  async refreshAfterSave() {
    const confId = this.props.match.params.id;
    const transcriptions = await axios.get(`/api/conf/${confId}/trans`)
    this.setState({
      transcriptions: transcriptions.data,
      modalDisplayed: '',
      transcriptionBeingModified: null,
    })
  }
  sortReverse() {
    const transcriptions = this.state.transcriptions;
    const reversed = [];
    for (let i = transcriptions.length - 1; i >= 0; i--) {
      reversed.push(transcriptions[i])
    }
    this.setState({
      transcriptions: reversed,
    })
  }
  async componentDidMount() {
    window.addEventListener('click', () => {
      this.setState({
        modalDisplayed: '',
        rowHighlighted: null,
      });
      this.closeAllMenus();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        this.setState({
          modalDisplayed: '',
          rowHighlighted: null,
        });
        this.closeAllMenus();
      }
    });
    const confId = this.props.match.params.id;
    const confInfo = await axios.get(`/api/conf/${confId}`);
    const transcriptions = await axios.get(`/api/conf/${confId}/trans`)
    this.setState({
      confInfo: confInfo.data,
      transcriptions: transcriptions.data,
    });
  }
  render() {
    return (
      <Main>
        <Header>
          <A href='/'>&lt; Back to Conferences</A>
          {
            this.state.modalDisplayed === 'deleteTranscription'
              ? <DeleteTranscriptionForm
                  transcription={this.state.transcriptionBeingModified}
                  conference={this.state.confInfo}
                  cancel={this.cancelForm}
                  complete={this.refreshAfterSave}
                />
              : null
          }
          <H1>
            Conference
            {' '}
            {this.state.confInfo.meeting_pin}:
            {' '}
            {this.state.confInfo.description}
          </H1>
          <Select.Container>
            <Select.Label htmlFor="sort">Sort</Select.Label>
            <Select.Select id="sort" name="sort" onChange={this.sortReverse}>
              <option value="newestFirst">Newest First</option>
              <option value="oldestFirst">Oldest First</option>
            </Select.Select>
          </Select.Container>
        </Header>
        {
          this.state.transcriptions.length
            ? <Table.Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th center colSpan="2">Transcriptions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <tbody>
                  {
                    this.state.transcriptions.map(t => (
                      <Table.Tr
                        key={t.id}
                        forceHighlight={this.state.rowHighlighted === t.id}
                        allowHighlight={!this.state.rowHighlighted}
                      >
                        <Table.Td grow>
                          <Table.A href={`/conf/${this.props.match.params.id}/trans/${t.id}`}>
                            {datetime(t.time_start)}
                            {
                              t.time_end
                                ? ` (${formatTimeDuration(timeDifference(t.time_start, t.time_end))})`
                                : <Table.Span blue>In Progress</Table.Span>
                            }
                          </Table.A>
                        </Table.Td>
                        <Table.Td>
                          <Table.Button
                            onClick={this.toggleTransMenu.bind(this, t.id)}
                            disabled={this.state.modalDisplayed}
                          >
                            &#9776;
                          </Table.Button>
                          {
                            t.showMenu
                              ? <Menu.Menu>
                                  <Menu.Link as="a" href={`/conf/${this.props.match.params.id}/trans/${t.id}`}>
                                    View transcription
                                  </Menu.Link>
                                  <Menu.Link
                                    onClick={this.deleteTranscription.bind(this, t)}
                                    disabled={this.state.modalDisplayed}
                                  >
                                    Delete Transcription
                                  </Menu.Link>
                                </Menu.Menu>
                              : null
                          }
                        </Table.Td>
                      </Table.Tr>
                    ))
                  }
                </tbody>
              </Table.Table>
            : <h3>
                There are no transcriptions for this conference
              </h3>
          }
      </Main>
    );
  }
}

export default Transcriptions;
