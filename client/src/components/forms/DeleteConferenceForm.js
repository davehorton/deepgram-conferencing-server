import React, { Component } from 'react';
import axios from 'axios';
import Modal from '../../styles/Modal';
import Button, { ButtonContainer } from '../../styles/Button';
import ErrorMessage from '../../styles/ErrorMessage';
import TableDescriptive from '../../styles/TableDescriptive';

class DeleteConferenceForm extends Component {
  constructor() {
    super();
    this.state = {
      errorMessage: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.stopPropagation = this.stopPropagation.bind(this);
  }
  stopPropagation(e) {
    e.stopPropagation();
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  async handleSubmit(e) {
    e.preventDefault();
    await axios.delete(`/api/conf/${this.props.conf.id}`);
    this.props.complete();
  }
  handleCancel() {
    this.props.cancel();
  }
  render() {
    return (
      <Modal.Background>
        <Modal.Foreground onClick={this.stopPropagation}>
          <Modal.Header>Delete Conference</Modal.Header>
          <form onSubmit={this.handleSubmit}>
            <TableDescriptive.Table>
              <tbody>
                <tr>
                  <TableDescriptive.LightTd>Meeting PIN:</TableDescriptive.LightTd>
                  <td>{this.props.conf.meeting_pin}</td>
                </tr>
                <tr>
                  <TableDescriptive.LightTd>Description:</TableDescriptive.LightTd>
                  <td>{this.props.conf.description}</td>
                </tr>
              </tbody>
            </TableDescriptive.Table>
            <ErrorMessage>WARNING: This will permanently delete all transcriptions and recordings associated with this conference.</ErrorMessage>
            <ButtonContainer style={{marginTop: '0.7rem'}}>
              <Button gray onClick={this.handleCancel}>Cancel</Button>
              <Button danger>Delete</Button>
            </ButtonContainer>
          </form>
        </Modal.Foreground>
      </Modal.Background>
    );
  }
}

export default DeleteConferenceForm;
