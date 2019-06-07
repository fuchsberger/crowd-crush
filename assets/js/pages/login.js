import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom"
import { Container, Grid, Form, Icon, List, Message } from 'semantic-ui-react'
import Validator from 'simple-react-validator'
import { sessionOperations as Session } from '../modules/session'

class Login extends Component {

  state = { email: '', password: '', loading: false, submitted: false }
  validator = new Validator({ element: false })

  onInputChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = () => {
    this.setState({ submitted: true })

    if (this.validator.allValid()) {
      this.setState({ loading: true })
      this.props.signIn(this.state, this.props.history.push)
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  render(){

    const { error, location } = this.props
    const { email, password, loading, submitted } = this.state

    if (!error && location.state && location.state.error) error = location.state.error

    const emailError = this.validator.message('email', email, 'required|email')
    const passwordError = this.validator.message('password', password, 'required')

    return (
      <Container text textAlign='center'>
        <Grid id='login-container' className='fullscreen' textAlign='center' verticalAlign='middle'>
          <Grid.Column>
            {/* <Message attached warning>
              <Message.Header>This is a restricted area.</Message.Header>
              <p>Please sign in, then try again.</p>
            </Message> */}
            <Message
              attached
              header='Welcome to our site!'
              content='Please sign in to start describing videos.'
            />
            <Form
              className="attached fluid segment"
              loading={error ? false : loading}
              onSubmit={this.handleSubmit}
            >
              <Form.Input
                error={submitted && !this.validator.fieldValid('email')}
                label={emailError}
                icon='user'
                iconPosition='left'
                name='email'
                onChange={this.onInputChange}
                placeholder='Email'
                type='text'
                value={email}
              />
              <Form.Input
                error={submitted && !this.validator.fieldValid('password')}
                label={passwordError}
                icon='lock'
                iconPosition='left'
                name='password'
                onChange={this.onInputChange}
                placeholder='Password'
                type='password'
                value={password}
              />

              <Form.Button color='blue'  type='submit'>
                Sign in
              </Form.Button>

              {submitted && <Link to='/reset'>Forgot your password?</Link>}
            </Form>
            <Message attached='bottom'>
              <Icon name='help' />
              Need an account?&nbsp;<Link to='/sign_up'>Register here</Link>&nbsp;instead.
            </Message>
            <List bulleted horizontal size='tiny'>
              <List.Item>
                <Icon name='copyright outline' />&nbsp;2019 Alexander Fuchsberger
              </List.Item>
              <List.Item as={Link} to='/terms'>Terms of Use</List.Item>
            </List>
          </Grid.Column>
        </Grid>
      </Container>
    )
  }
}

// connect and import from redux store; make dispatched actions available
const mapStateToProps = ({ session }) => ({ error: session.error });
const mapDispatchToProps = { signIn: Session.signIn };
export default connect( mapStateToProps, mapDispatchToProps )(Login);
