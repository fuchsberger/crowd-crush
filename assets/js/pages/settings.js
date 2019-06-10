import React, { Component } from 'react'
import { connect } from 'react-redux'
import Validator from 'simple-react-validator'
import { Grid, Form, Icon, Accordion, Message } from 'semantic-ui-react'
import { sessionOperations as Session } from '../modules/session'

class Settings extends Component {

  state = {
    activeIndex: -1,
    email: '',
    password: '',
    new_password: '',
    confirm_password: '',
    username: '',
    submitted: false
  }
  validator = new Validator({ element: false })

  accordeonTitle = (index, title, activeIndex) => (
    <Accordion.Title active={activeIndex === index} index={index} onClick={this.handleClick}>
      <Icon name='dropdown' />
      {title}
    </Accordion.Title>
  )

  onInputChange = (e, { name, value }) => this.setState({ [name]: value })

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex, submitted: false })
  }

  handleSubmit = () => {
    this.setState({ submitted: true })

    if (this.validator.allValid()){
      const { activeIndex, email, password, new_password, username } = this.state

      // send only relevant data to server
      let data
      switch(activeIndex){
        case 0: data = { username: username}; break;
        case 1: data = { email, password }; break;
        case 2: data = { new_password, password }
      }

      this.props.updateAccount(data)
    }
    else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  render() {
    const { error, loading } = this.props
    const {
      activeIndex,
      email,
      password,
      new_password,
      confirm_password,
      username,
      submitted
    } = this.state

    // make correct validations dependent on currently selected option
    this.validator.purgeFields();

    const usernameError = activeIndex == 0
      ? this.validator.message('username', username, 'required|alpha_num_dash|min:3|max:20')
      : false

    const emailError = activeIndex == 1
      ? this.validator.message('email', email, 'required|email')
      : false

    const newPasswordError = activeIndex == 2
      ? this.validator.message('new_password', new_password, 'required|min:6|max:100')
      : false

    const confirmPasswordError = activeIndex == 2
      ? this.validator.message('confirm_password', confirm_password, `required|in:${new_password}`)
      : false

    const passwordError = activeIndex > 0
      ? this.validator.message('password', password, 'required')
      : false

    return (
      <Grid id='login-container' verticalAlign='middle' centered padded>
        <Grid.Column textAlign='center' width={16}>

          {error
            ? <Message
                attached
                error
                header='An Error occured!'
                content={error}
              />
            : <Message
                attached
                header='Settings'
                content='What do you want to do?'
              />
          }
          <Form loading={loading} onSubmit={this.handleSubmit}>
            <Accordion fluid styled>
              {this.accordeonTitle(0, 'Change Username', activeIndex)}
              <Accordion.Content active={activeIndex === 0}>
                <Form.Input
                  error={submitted && !this.validator.fieldValid('username')}
                  label={submitted && usernameError}
                  icon='user'
                  iconPosition='left'
                  name='username'
                  onChange={this.onInputChange}
                  placeholder='New Username'
                  type='text'
                  value={username}
                />
              </Accordion.Content>

              {this.accordeonTitle(1, 'Change Email', activeIndex)}
              <Accordion.Content active={activeIndex === 1}>
                <Form.Input
                  error={submitted && !this.validator.fieldValid('email')}
                  label={submitted && emailError}
                  icon='mail'
                  iconPosition='left'
                  name='email'
                  onChange={this.onInputChange}
                  placeholder='New Email'
                  type='text'
                  value={email}
                />
              </Accordion.Content>

              {this.accordeonTitle(2, 'Change Password', activeIndex)}
              <Accordion.Content active={activeIndex === 2}>
                <Form.Input
                  error={submitted && !this.validator.fieldValid('new_password')}
                  label={submitted && newPasswordError}
                  icon='lock'
                  iconPosition='left'
                  name='new_password'
                  onChange={this.onInputChange}
                  placeholder='New password'
                  type='password'
                  value={new_password}
                />
                <Form.Input
                  error={submitted && !this.validator.fieldValid('confirm_password')}
                  label={submitted && !this.validator.fieldValid('confirm_password') && 'Passwords need to match!'}
                  icon='lock'
                  iconPosition='left'
                  name='confirm_password'
                  onChange={this.onInputChange}
                  placeholder='Confirm new password'
                  type='password'
                  value={confirm_password}
                />
              </Accordion.Content>
            </Accordion>
            {activeIndex >= 0 &&
              <Message attached='bottom'>
                {activeIndex > 0 &&
                  <Form.Input
                    error={error || (submitted && !this.validator.fieldValid('password'))}
                    label={passwordError || "Please also enter your current password:"}
                    icon='lock'
                    iconPosition='left'
                    onChange={this.onInputChange}
                    name='password'
                    placeholder='Current Password'
                    type='password'
                    value={password}
                  />
                }
                <Form.Button color='blue' type='submit'>Submit</Form.Button>
              </Message>
            }
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = ({ session }) => ({ error: session.error, loading: session.loading });
const mapDispatchToProps = { updateAccount: Session.updateAccount };
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
