import React from 'react';
import { Menu } from 'semantic-ui-react';
import UserPanel from './UserPanel';
import Channels from './Channels';

export default class SidePanel extends React.Component {
    render() {
        const { currentUser } = this.props;

        return(
            <Menu
                size='large'
                inverted
                fixed='left'
                vertical
                style={{background:'rgb(76, 52, 195)', fontSize:'1.2rem'}}
            >
                <UserPanel currentUser={currentUser} />
                <Channels currentUser={currentUser} />
            </Menu>
        )
    }
}