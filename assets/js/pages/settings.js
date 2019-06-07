import React, { Component } from 'react'
import { connect } from 'react-redux'
import Validator from 'simple-react-validator'
import { Container, Grid, Form, Icon, Accordion, Message } from 'semantic-ui-react'
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

    if (this.validator.allValid()) {
      this.setState({ loading: true })
      this.props.signIn(this.state, this.props.history.push)
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  render() {
    const { updateAccount, error, loading } = this.props;

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
      <Container text textAlign='center'>
        <Grid id='login-container' className='fullscreen' textAlign='center' verticalAlign='middle'>
          <Grid.Column>

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
            <Form
              loading={loading}
              onSubmit={this.handleSubmit}
            >
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
                      error={submitted && !this.validator.fieldValid('password')}
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
      </Container>
    );
  }
}
{/* <AvForm
  className={
    'pr-2 pl-2 ' + (error ? 'was-validated' : 'needs-validation')
  }
  onValidSubmit={(e, values) => updateAccount(values)}
  onInvalidSubmit={() => this.setState({ error: true })}
  className=""
>
<h3 className="text-center">Settings</h3>
<Card
  color="light"
  className="text-center mb-1 align-middle mx-auto"
  style={{ maxWidth: 600 }}
>
  <CardBody>
    <Row>
      <Col xs="12" sm="6">
        <FormText color="muted" className="mb-2">
          Please enter your current password to make changes in this
          section
        </FormText>
      </Col>
      <Col xs="12" sm="6">
        <AvField
          id="password"
          name="password"
          type="password"
          placeholder="Current Password*"
          validate={{
            required: {
              value: true,
              errorMessage: 'Required Field.'
            },
            minLength: {
              value: 8,
              errorMessage:
                'Password needs to have at least 8 characters.'
            }
          }}
        />
      </Col>
    </Row>
    <Row>

      <Col xs="12" sm="6">
        <AvField
          id="first_name"
          name="first_name"
          placeholder="First Name"
          value={user.first_name}
          validate={{
            required: {
              value: true,
              errorMessage: 'Required Field.'
            },
            minLength: {
              value: 2,
              errorMessage: 'Must contain at least 2 characters.'
            },
            maxLength: {
              value: 80,
              errorMessage: 'Can have a maximum of 80 characters.'
            }
          }}
        />

        <AvField
          id="last_name"
          name="last_name"
          placeholder="Last Name"
          value={user.last_name}
          validate={{
            required: {
              value: true,
              errorMessage: 'Required Field.'
            },
            minLength: {
              value: 2,
              errorMessage: 'Must contain at least 2 characters.'
            },
            maxLength: {
              value: 80,
              errorMessage: 'Can have a maximum of 80 characters.'
            }
          }}
        />
        <AvField
          id="email"
          name="email"
          placeholder="Email"
          value={user.email}
          validate={{
            required: {
              value: true,
              errorMessage: 'Required Field.'
            },
            email: {
              value: true,
              errorMessage: 'Does not seem to be an email address.'
            },
            maxLength: {
              value: 80,
              errorMessage: 'Name can have a maximum of 80 characters.'
            }
          }}
        />
      </Col>
      <Col xs="12" sm="6">
        <FormText color="muted" className="mb-2">
          Leave the following fields empty if you do not want to change
          your password:
        </FormText>
        <AvField
          id="new_password"
          name="new_password"
          placeholder="New Password"
          type="password"
          validate={{
            minLength: {
              value: 8,
              errorMessage:
                'Password needs to have at least 8 characters.'
            }
          }}
        />
        <AvField
          id="confirm_password"
          name="confirm_password"
          placeholder="Confirm Password"
          type="password"
          validate={{
            match: {
              value: 'new_password',
              errorMessage: 'Passwords do not match'
            }
          }}
        />
      </Col>
      </Row>
 */}

const mapStateToProps = ({ session }) => ({ error: session.error, loading: session.loading });
const mapDispatchToProps = { updateAccount: Session.updateAccount };
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
