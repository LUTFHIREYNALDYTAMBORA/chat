import React from 'react';
import fire from '../../Firebase';
import { connect } from 'react-redux';
import { setCurrentChannel } from '../../actions';
import { Menu, Icon, Modal, ModalHeader, Form, ModalContent, FormField, Input, Button, MenuItem } from 'semantic-ui-react';

class Channels extends React.Component {
    state = {
        activeChannel: '',
        user: this.props.currentUser,
        channels : [],
        channelName: '',
        channelDetails: '',  
        channelsRef: fire.database().ref('channels'),
        modal: false,
        firstLoad: true
    }
    
    componentDidMount() {
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    removeListeners = () => {
        this.state.channelsRef.off();
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            // console.log(loadedChannels);
            this.setState({ channels: loadedChannels }, () => this.setFirstChannel())
        });
    };

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0];

        if ( this.state.firstLoad && this.state.channels.length > 0 ) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
        }
        this.setState({ firstLoad: false });
    }

    isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails;
    
    addChannel = () => {
        // console.log('add channel');
        const { channelsRef, channelName, channelDetails, user } = this.state;

        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        };

        channelsRef 
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({ channelName: '', channelDetails: '' });
                this._handleCloseModal();
                console.log('channel add');
            })
            .catch(err => {
                console.error(err);
            })
    }

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id })
    }

    changeChannel = channel => {
        this.setActiveChannel(channel);
        this.props.setCurrentChannel(channel);
    }

    _renderDisplayChannels = channels => (
        channels.length > 0 && channels.map(channel => (
            <MenuItem
                key={channel.id}
                onClick={() => this.changeChannel(channel)}
                name={channel.name}
                style={{ opacity: '0.7', display:'flex' }}
                activeChannel={channel.id === this.state.activeChannel}
            >
                <Icon name='chevron circle right' style={{ marginRight:'5px' }}/> { channel.name }
            </MenuItem>
        ))
    )

    _handleSubmit = e => {
        e.preventDefault();
        if(this.isFormValid(this.state)) {
            this.addChannel();
            // console.log('channel add');
        } 
    }


    _handleOpenModal = () => this.setState({ modal: true });

    _handleCloseModal = () => this.setState({ modal: false });

    _handleChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { channels, modal } = this.state;

        return (
            <div>
            <Menu.Menu style={{paddingBottom:'2em'}}>
                <Menu.Item>
                    <span>
                        <Icon name='exchange' /> 
                        CHANNELS
                    </span> {' '}
                    
                    ({ channels.length }) 
                    <Icon name='add' style={{cursor:'pointer'}} onClick={this._handleOpenModal} />
                </Menu.Item>

                {/* Channels */}
                {this._renderDisplayChannels(channels)}

            </Menu.Menu>

            {/* Add Channel Modal */}
            
                <Modal basic open={modal} onClose={this._handleCloseModal}>
                    <ModalHeader>Add a Channel</ModalHeader>
                    <ModalContent>
                        <Form onSubmit={this._handleSubmit} > 
                            <FormField>
                                <Input 
                                    fluid
                                    label='Name of Channel'
                                    name='channelName'
                                    onChange={this._handleChange}
                                    />
                            </FormField>
                            <FormField>
                                <Input 
                                    fluid
                                    label='About the Channel'
                                    name='channelDetails'
                                    onChange={this._handleChange}
                                    />
                            </FormField>
                        </Form>
                    </ModalContent>
                    <ModalContent>
                        <Button color='blue' inverted onClick={this._handleSubmit}>
                            <Icon name='checkmark'/> Add
                        </Button>
                        <Button color='red' inverted onClick={this._handleCloseModal}>
                            <Icon name='remove'/> Cancel
                        </Button>
                    </ModalContent>
                </Modal>
            </div>
        )
    }
}

export default connect(null, { setCurrentChannel })(Channels);