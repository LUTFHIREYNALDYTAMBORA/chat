import React from 'react';
import fire from '../../Firebase';
import { Grid, GridColumn, GridRow, Header, HeaderContent, Icon, Dropdown, Image } from 'semantic-ui-react';

class UserPanel extends React.Component {
    state = {
        user: this.props.currentUser
    }

    // componentDidMount() {
    //     this.setState({ user: this.props.currentUser });
    // }

    dropdownOption = () => [
        {
            key: 'user',
            text: <span>Sign in as <strong>{this.state.user.displayName}</strong></span>,
            disable: true
        },
        {
            key: 'avatar',
            text: <span>Change Avatar</span>
        },
        {
            key: 'signout',
            text: <span onClick={this._handleSignOut} >Sign Out</span>
        }
    ];

    _handleSignOut = () => {
        fire
            .auth()
            .signOut()
            .then(() => console.log('sign out!'))
    }

    render() {
        const { user } = this.state;

        // console.log(this.props.currentUser);
        return(
            <Grid style={{background:'#4c34c3'}}>
                <GridColumn>
                    <GridRow style={{padding:'1.2rem'}}>
                        
                        {/* App Header  */}
                        <Header inverted as='h2'>
                            <Icon name='envelope outline'/>
                            <HeaderContent>DevChat</HeaderContent>
                        </Header>

                        {/* User DropDown */}
                        <Header style={{padding:'0.25rem'}} as='h5' inverted >
                        <Dropdown 
                            trigger={ <span>
                                        <Image src={user.photoURL} spaced='right' avatar />
                                        {user.displayName}
                                    </span> } 
                            options={this.dropdownOption()} 
                            />
                        </Header>
                    </GridRow>
                </GridColumn>
            </Grid>
        )
    }
}

export default UserPanel;