import React, { Component } from 'react';
import axios from 'axios';
import AddEditConferenceForm from './forms/AddEditConferenceForm';
import DeleteConferenceForm from './forms/DeleteConferenceForm';
import Main from '../styles/Main';
import H1 from '../styles/H1';
import Button from '../styles/Button';
import Table from '../styles/Table';
import Menu from '../styles/Menu';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2.4rem;
  & > h1 {
    margin: 0
  }
  @media (max-width: 700px) {
    padding: 0.5rem;
  }
`;

class Conferences extends Component {
  constructor() {
    super();
    this.state = {
      conferences: [],
      rowHighlighted: null,
      modalDisplayed: '',
      confBeingModified: null,
    };
    this.closeAllMenus = this.closeAllMenus.bind(this);
    this.addConference = this.addConference.bind(this);
    this.cancelForm = this.cancelForm.bind(this);
    this.refreshAfterSave = this.refreshAfterSave.bind(this);
  }
  toggleConfMenu(id, e) {
    e.stopPropagation();
    this.setState(state => ({
      conferences: state.conferences.map(c => {
        if (c.id === id) {
          return {
            ...c,
            showMenu: !c.showMenu,
          }
        } else {
          return {
            ...c,
            showMenu: false,
          }
        }
      }),
      rowHighlighted: state.rowHighlighted === id ? null : id,
    }));
  }
  closeAllMenus(e) {
    const menusClosed = this.state.conferences.map(c => ({
      ...c,
      showMenu: false,
    }));
    this.setState(state => ({ conferences: menusClosed }));
  }
  addConference(e) {
    e.stopPropagation();
    const confWithClosedMenus = this.state.conferences.map(c => ({
      ...c,
      showMenu: false,
    }))
    this.setState({
      modalDisplayed: 'addEditConference',
      conferences: confWithClosedMenus,
      confBeingModified: null,
    })
  }
  editConference(conf, e) {
    e.stopPropagation();
    const confWithClosedMenus = this.state.conferences.map(c => ({
      ...c,
      showMenu: false,
    }))
    this.setState({
      modalDisplayed: 'addEditConference',
      conferences: confWithClosedMenus,
      confBeingModified: conf,
    });
  }
  deleteConference(conf, e) {
    e.stopPropagation();
    const confWithClosedMenus = this.state.conferences.map(c => ({
      ...c,
      showMenu: false,
    }))
    this.setState({
      modalDisplayed: 'deleteConference',
      conferences: confWithClosedMenus,
      confBeingModified: conf,
    });
  }
  cancelForm() {
    this.setState({
      modalDisplayed: '',
      confBeingModified: null,
    })
  }
  async refreshAfterSave() {
    const conferencesResults = await axios.get('/api/conf');
    this.setState({
      conferences: conferencesResults.data,
      modalDisplayed: '',
      confBeingModified: null,
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
    const conferencesResults = await axios.get('/api/conf');
    this.setState({ conferences: conferencesResults.data });
  }
  render() {
    return (
      <Main>
        {
          this.state.modalDisplayed === 'addEditConference'
            ? <AddEditConferenceForm
                conf={this.state.confBeingModified}
                cancel={this.cancelForm}
                complete={this.refreshAfterSave}
              />
            : null
        }
        {
          this.state.modalDisplayed === 'deleteConference'
            ? <DeleteConferenceForm
                conf={this.state.confBeingModified}
                cancel={this.cancelForm}
                complete={this.refreshAfterSave}
              />
            : null
        }
        <HeaderWrapper>
          <H1>Conferences</H1>
          <Button
            onClick={this.addConference}
            disabled={this.state.modalDisplayed}
          >
            +
          </Button>
        </HeaderWrapper>
        <Table.Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Pin</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <tbody>
            {
              this.state.conferences.map(c => (
                <Table.Tr
                  key={c.id}
                  forceHighlight={this.state.rowHighlighted === c.id}
                  allowHighlight={!this.state.rowHighlighted}
                >
                  <Table.Td>
                    <Table.A href={`/conf/${c.id}`}>{c.meeting_pin}</Table.A>
                  </Table.Td>
                  <Table.Td grow>
                    <Table.A href={`/conf/${c.id}`}>
                      {c.description || <span>&nbsp;</span>}
                      {c.freeswitch_ip &&
                        <Table.Span blue title="There is currently an active call on this conference">
                          (Active)
                        </Table.Span>
                      }
                    </Table.A>
                  </Table.Td>
                  <Table.Td>
                    <Table.Button
                      onClick={this.toggleConfMenu.bind(this, c.id)}
                      disabled={this.state.modalDisplayed}
                      forceHighlight={this.state.rowHighlighted === c.id}
                      allowHighlight={!this.state.rowHighlighted}
                    >
                      &#9776;
                    </Table.Button>
                    {
                      c.showMenu
                        ? <Menu.Menu>
                            <Menu.Link as="a" href={`/conf/${c.id}`}>
                              View Transcriptions
                            </Menu.Link>
                            <Menu.Link
                              onClick={this.editConference.bind(this, c)}
                              disabled={this.state.modalDisplayed}
                            >
                              Edit Conference
                            </Menu.Link>
                            <Menu.Link
                              onClick={this.deleteConference.bind(this, c)}
                              disabled={this.state.modalDisplayed}
                            >
                              Delete Conference
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
      </Main>
    );
  }
}

export default Conferences;
