import React, { Component } from 'react'
import { Link } from "react-router-dom"
import { Grid, Form, Icon, Input, List, Message } from 'semantic-ui-react'
import Validator from 'simple-react-validator'

class Login extends Component {

  state = { email: '', password: '', loading: false, submitted: false }
  validator = new Validator({ element: false })

  onInputChange = (e, { name, value }) => this.setState({ [name]: value })

  handleSubmit = (e) => {

    if (this.validator.allValid()) this.setState({ loading: true })
    else {
      this.validator.showMessages()
      this.setState({ submitted: true })
    }
  }

  render(){

    const { email, password, loading, submitted } = this.state
    const emailError = this.validator.message('email', email, 'required|email')
    const passwordError = this.validator.message('password', password, 'required')

    const redirect = this.props.location.state && this.props.location.state.referrer || false
    const warning = redirect ? true : false
    const header = redirect ? 'You need to sign in first.' : 'Welcome to our site!'
    const content = redirect
      ? 'Afterwards you will be redirected.'
      : 'Please sign in to start describing videos.'

    return (
      <Grid id='login-container' textAlign='center' verticalAlign='middle'>
        <Grid.Column>
          <Message attached warning={warning} header={header} content={content} />
          <Form
            acceptCharset="UTF-8"
            action="/login"
            className="attached fluid segment"
            loading={loading}
            method="post"
            onSubmit={this.handleSubmit}
          >
            <Input type='hidden' name='_utf8' value="✓" />
            <Input type='hidden' name='_csrf_token' value={window.csrfToken}/>
            { redirect && <Input type='hidden' name='redirect' value={redirect}/> }

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
    )
  }
}
export default Login;
