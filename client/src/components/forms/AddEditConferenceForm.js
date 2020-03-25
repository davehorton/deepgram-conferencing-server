import React, { Component } from 'react';
import axios from 'axios';
import Modal from '../../styles/Modal';
import Button, { ButtonContainer } from '../../styles/Button';
import Form from '../../styles/Form';
import ErrorMessage from '../../styles/ErrorMessage';

class AddEditConferenceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      id: null,
      meeting_pin: '',
      description: '',
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
    try {
      e.preventDefault();
      const requestBody = {
        'meeting-pin': this.state.meeting_pin,
        'description': this.state.description,
      };
      if (this.state.id) {
        await axios.put(`/api/conf/${this.state.id}`, requestBody);
      } else {
        await axios.post(`/api/conf`, requestBody);
      }
      this.props.complete();
    } catch (err) {
      this.setState({ errorMessage: err });
      console.log(JSON.stringify(err, null, 2));
      console.log(err.response);
    }
  }
  handleCancel() {
    this.props.cancel();
  }
  componentDidMount() {
    if (this.props.conf) {
      this.setState({
        title: 'Edit Conference',
        id: this.props.conf.id,
        meeting_pin: this.props.conf.meeting_pin || '',
        description: this.props.conf.description || '',
      })
    } else {
      this.setState({
        title: 'Add a Conference',
      })
    }
    document.getElementById('meeting_pin').focus();
  }
  render() {
    return (
      <Modal.Background>
        <Modal.Foreground onClick={this.stopPropagation}>
          <Modal.Header>{this.state.title}</Modal.Header>
          <form onSubmit={this.handleSubmit}>
            <table>
              <tbody>
                <Form.Row as="tr">
                  <td>
                  <Form.Label htmlFor="meeting_pin">Meeting PIN</Form.Label>
                  </td>
                  <td>
                  <Form.Input
                    id="meeting_pin"
                    name="meeting_pin"
                    type="text"
                    value={this.state.meeting_pin}
                    onChange={this.handleChange}
                  />
                  </td>
                </Form.Row>
                <Form.Row as="tr">
                  <td>
                  <Form.Label htmlFor="description">Description</Form.Label>
                  </td>
                  <td>
                  <Form.Input
                    id="description"
                    name="description"
                    type="text"
                    value={this.state.description}
                    onChange={this.handleChange}
                  />
                  </td>
                </Form.Row>
              </tbody>
            </table>
            {
              this.state.errorMessage
                ? <ErrorMessage>
                    {this.state.errorMessage.response.data}
                  </ErrorMessage>
                : null
            }
            <ButtonContainer>
              <Button
                gray
                type="button"
                onClick={this.handleCancel}
              >
                Cancel
              </Button>
              <Button>Save</Button>
            </ButtonContainer>
          </form>
        </Modal.Foreground>
      </Modal.Background>
    );
  }
}

export default AddEditConferenceForm;
