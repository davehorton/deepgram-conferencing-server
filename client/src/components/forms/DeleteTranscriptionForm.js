import React, { Component } from 'react';
import axios from 'axios';
import Modal from '../../styles/Modal';
import Button, { ButtonContainer } from '../../styles/Button';
import ErrorMessage from '../../styles/ErrorMessage';
import DescriptiveTable from '../../styles/DescriptiveTable';
import { datetime } from '../../util/date-format';

class DeleteTranscriptionForm extends Component {
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
    try {
      await axios.delete(`/api/trans/${this.props.transcription.id}`);
      this.props.complete();
    } catch (err) {
      this.setState({errorMessage: err.message});
    }
  }
  handleCancel() {
    this.props.cancel();
  }
  render() {
    return (
      <Modal.Background>
        <Modal.Foreground onClick={this.stopPropagation}>
          <Modal.Header>Delete Transcription</Modal.Header>
          <form onSubmit={this.handleSubmit}>
            <DescriptiveTable.Table>
              <tbody>
                <tr>
                  <DescriptiveTable.LightTd>Conference:</DescriptiveTable.LightTd>
                  <td>{this.props.conference.meeting_pin}: {this.props.conference.description}</td>
                </tr>
                <tr>
                  <DescriptiveTable.LightTd>Start time:</DescriptiveTable.LightTd>
                  <td>{datetime(this.props.transcription.time_start)}</td>
                </tr>
                <tr>
                  <DescriptiveTable.LightTd>End time:</DescriptiveTable.LightTd>
                  <td>{datetime(this.props.transcription.time_end) || 'Still in progress'}</td>
                </tr>
              </tbody>
            </DescriptiveTable.Table>
            <ErrorMessage>
              {
                this.state.errorMessage ||
                'WARNING: This will permanently delete the transcription and recording.'
              }
            </ErrorMessage>
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

export default DeleteTranscriptionForm;
