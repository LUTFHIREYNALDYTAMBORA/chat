import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon, GridColumn, FormInput } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import fire from '../../Firebase';
import * as md5 from 'md5'
// import md5 from 'md5';

export default class Register extends React.Component {

    state = {
        username : '',
        email : '',
        password : '',
        passwordConfirmation : '',
        errors : [],
        loading : false,
        usersRef: fire.database().ref('users')
    }

    _handleChange = e => {
        this.setState({[e.target.name]: e.target.value}); 
        console.log(e.target.value);
    }

    _handleSubmit = e => {
        e.preventDefault();
        
        if(this.isFormValid()) {
            this.setState({ errors : [], loading : true });

            fire
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(createdUser => {
                console.log(createdUser);
                createdUser.user.updateProfile({
                    displayName: this.state.username,
                    photoURL: `https://gravatar.com/avatar/${md5(createdUser.user)} ? d=identicon`
                })
                .then(() => {
                    this.saveUser(createdUser).then(() => {
                        console.log('save user');
                    })
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ errors: this.state.errors.concat(err), loading: false });
                })
            })
            .catch(err => {
                console.error(err);
                this.setState({ errors: this.state.errors.concat(err), loading: false });
            });
        } 
    }

    saveUser = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        });
    }

    _handleInputError = (errors, inputName) => {
        return  errors.some(error => 
                    error.message.toLowerCase().includes(inputName)
                ) ? 'error' : ''
    }

    isFormValid = () => {
        let errors = [];
        let error;

        if(this.isFormEmpty(this.state)) {
            error = { message : 'Fill in All Fields' };
            this.setState({ errors : errors.concat(error) });
            return false;
        } else if (!this.isPasswordValid(this.state)) {
            error = { message : 'Password is Invalid' };
            this.setState({ errors : errors.concat(error) });
            return false;
        } else {
            return true;
        }
    }

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }

    isPasswordValid = ({ password, passwordConfirmation }) => {
        if ( password.length < 6 || passwordConfirmation.length < 6 ) {
            return false;
        } else if ( password !== passwordConfirmation ) {
            return false;
        } else {
            return true;
        }
    }

    displayErrors = errors => 
        errors.map((error, i) => 
            <p key={i}> {error.message} </p>);

    render() {
        const { username, email, password, passwordConfirmation, errors, loading } = this.state;

        return(
            <Grid textAlign='center' verticalAlign='middle' className='app'>
                <GridColumn style={{ maxWidth:450 }}>
                    <Header as='h1' icon color='orange' textAlign='center'>
                        <Icon name='puzzle piece' color='orange' />
                        Register for DevChat
                    </Header>
                    <Form onSubmit={this._handleSubmit} size='large'>
                        <Segment stacked>
                            <FormInput 
                                fluid name='username' 
                                icon='user' 
                                iconPosition='left' 
                                placeholder='User Name' 
                                type='text' 
                                value={this.state.name}
                                onChange={this._handleChange} />
                            <FormInput 
                                fluid name='email' 
                                icon='mail' 
                                iconPosition='left' 
                                placeholder='Email Address' 
                                type='email' 
                                value={this.state.email}
                                className={this._handleInputError(errors, 'email')}
                                onChange={this._handleChange} />
                            <FormInput 
                                fluid name='password' 
                                icon='lock' 
                                iconPosition='left' 
                                placeholder='Password' 
                                type='password' 
                                value={this.state.password}
                                className={this._handleInputError(errors, 'password')}
                                onChange={this._handleChange} />
                            <FormInput 
                                fluid name='passwordConfirmation' 
                                icon='repeat' 
                                iconPosition='left' 
                                placeholder='Password Confirmation' 
                                type='password'
                                value={this.state.passwordConfirmation} 
                                className={this._handleInputError(errors, 'password')}
                                onChange={this._handleChange} />
                            <Button disabled={loading} className={loading? 'loading' : ''} color='orange' fluid size='large' >Register</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>
                        Already a user? <Link to='/login'>Login</Link> 
                    </Message>
                </GridColumn>
            </Grid>
        )
    }
}