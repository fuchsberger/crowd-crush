import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, Col, FormText, Row } from 'reactstrap'
import { AvForm, AvField } from 'availity-reactstrap-validation'
import { sessionOperations as Session } from '../modules/session'
import { Loading } from '../components'

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  render() {
    const { updateAccount, user } = this.props;
    const { error } = this.state;

    if( !user ) return <Loading />;

    return (
      <AvForm
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
            <Row>
              <p className='text-center mb-0 w-100'>
                <Button color="primary">Change</Button>
                <Button color="link" tag={Link} to="/">
                  Cancel
                </Button>
              </p>
            </Row>
          </CardBody>
        </Card>
      </AvForm>
    );
  }
}
const mapStateToProps = ({ session }) => ({ user: session.user });
const mapDispatchToProps = { updateAccount: Session.updateAccount };
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
