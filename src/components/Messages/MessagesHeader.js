import React from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';
import HeaderSubHeader from 'semantic-ui-react/dist/commonjs/elements/Header/HeaderSubheader';

export default class MessagesHeader extends React.Component {
    render() {
        return (
            <Segment clearing>
                {/* Segmen Title */}
                <Header fluid='true' as='h2' floated='left' style={{marginBottom:'0'}}>
                    <span>
                        Channel
                        <Icon name={'code branch'} color='black' />
                    </span>
                    <HeaderSubHeader>2 Users</HeaderSubHeader>
                </Header>

                {/* Channel Search Input */}
                <Header floated='right'>
                    <Input 
                        size='mini'
                        icon='search'
                        name='searchTerm'
                        placeHolder='Search Messages'
                    />
                </Header>
            </Segment>
        )
    }
}