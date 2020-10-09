import React from 'react';
import { Segment, Icon, Button, Input, ButtonGroup } from 'semantic-ui-react';
import fire from '../../Firebase';
import FileModal from './FileModal';

export default class MessageForm extends React.Component {
    state = {
        message: '',
        loading: false,
        user: this.props.currentUser,
        channel: this.props.currentChannel,
        errors: [],
        modal: false
    }

    

    createMessage = () => {
        const message = {
            timestamp: fire.database.ServerValue.TIMESTAMP,
            content: this.state.message,
            user : {
                id: this.state.user.uid, 
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            }
        };
        return message;
    }

    _handleOpenModal = () => {
        this.setState({
            modal: true
        })
    }

    _handleCloseModal = () => {
        this.setState({
            modal: false
        })
    }

    _handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    _handleSendMessage = () => {
        const { messagesRef } = this.props;
        const { message, channel } = this.state;

        if ( message ) {
            this.setState({ loading: true });
            messagesRef 
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState ({ loading: false, message: '', errors: [] })
                })
                .catch(err => {
                    console.error(err);
                    errors: this.state.errors.concat(err)
                })
        } else {
            this.setState({
                errors: this.state.errors.concat({ message: 'Add a Message' })
            })
        }
    }

    _handleUploadFile = (file, metadata) => {
        console.log(file, metadata);
    }

    render() {
        const { errors, message, loading, modal } = this.state;

        return (
            <Segment>
                <Input 
                    fluid
                    name='message'
                    onChange={this._handleChange}
                    value={message}
                    style={{ marginBottom:'0.7em' }}
                    label={<Button icon={'add'} />}
                    labelPosition='left'
                    className= { 
                        errors.some(error => error.message.includes('message')) ? 'error' : ''
                    }
                    placeholder='Write Your Massage'
                  
                />
                <ButtonGroup icon widths='2'>
                    <Button 
                        onClick={this._handleSendMessage}
                        color='orange'
                        content='Add Reply'
                        labelPosition='left'
                        icon='edit'
                        disabled={loading}
                    />
                    <Button 
                        color='teal'
                        content='Upload Media'
                        labelPosition='right'
                        icon='cloud upload'
                        onClick={this._handleOpenModal}
                    />
                    <FileModal 
                        modal= {modal}
                        _handleCloseModal= {this._handleCloseModal}
                        _handleUploadFile= {this._handleUploadFile}
                    />
                </ButtonGroup>
            </Segment>
        )
    }
}