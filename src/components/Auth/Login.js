import React from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon, GridColumn, FormInput } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import fire from '../../Firebase';
import * as md5 from 'md5'
// import md5 from 'md5';

export default class Login extends React.Component {

    state = {   
        email : '',
        password : '',
        errors : [],
        loading : false
    }

    _handleChange = e => {
        this.setState({[e.target.name]: e.target.value}); 
        console.log(e.target.value);
    }

    _handleSubmit = e => {
        e.preventDefault();
        
        if(this.isFormValid(this.state)) {
            this.setState({ errors : [], loading : true });
                fire
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signedInUser => {
                    console.log(signedInUser);
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        loading: false
                    })
                }) 
            
        } 
    }

    isFormValid = ({ email, password }) => email && password;

    _handleInputError = (errors, inputName) => {
        return  errors.some(error => 
                    error.message.toLowerCase().includes(inputName)
                ) ? 'error' : ''
    }

    displayErrors = errors => 
        errors.map((error, i) => 
            <p key={i}> {error.message} </p>);

    render() {
        const { email, password, errors, loading } = this.state;

        return(
            <Grid textAlign='center' verticalAlign='middle' className='app'>
                <GridColumn style={{ maxWidth:450 }}>
                    <Header as='h1' icon color='blue' textAlign='center'>
                        <Icon name='code branch' color='blue' />
                        Login to DevChat
                    </Header>
                    <Form onSubmit={this._handleSubmit} size='large'>
                        <Segment stacked>
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
                            <Button disabled={loading} className={loading? 'loading' : ''} color='blue' fluid size='large' >Login</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>
                        Don't have an Acount? <Link to='/register'>Register</Link> 
                    </Message>
                </GridColumn>
            </Grid>
        )
    }
}