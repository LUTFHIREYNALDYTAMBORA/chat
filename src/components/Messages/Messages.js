import React from 'react';
import firebase from '../../Firebase';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import { Segment, CommentGroup } from 'semantic-ui-react';

export default class Messages extends React.Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        messages: [],
        channel: this.props.currentChannel,
        messageLoading: true,
        user: this.props.currentUser
    }

    componentDidMount() {
        const { channel, user } = this.state;
        if ( channel && user ) {
            this.addListeners(channel.id);
        }
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
    }

    addMessageListener = channelId => {
        let loadedMessages = [];
        this.state.messagesRef.child(channelId).on('child_added', snap => {
            loadedMessages.push(snap.val());
            // console.log(loadedMessages);
            this.setState({
                messages: loadedMessages,
                messageLoading: false
            })
        })
    }

    _renderMassages = messages => (
        messages.length > 0 && messages.map(message => (
            <Message 
                key={message.timestamp}
                message={message}
                user={this.state.user}
            />
        ))
    )

    render() {
        const { messagesRef, messages, channel, user } = this.state;

        return(
            <div>
                <MessagesHeader />

                <Segment>
                    <CommentGroup className='messages'>
                        {/* Messages */}
                        { this._renderMassages(messages) }
                    </CommentGroup>
                </Segment>

                <MessageForm 
                    messagesRef = { messagesRef }
                    currentChannel= { channel }
                    currentUser = { user }

                />
            </div>
        )
    }
}