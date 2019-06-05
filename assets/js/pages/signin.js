import { connect } from 'react-redux';
import { Link } from "react-router-dom"
import { Alert, Button, Card, CardBody, Label } from 'reactstrap'
import { AvForm, AvField, AvInput } from 'availity-reactstrap-validation'

import { Container } from 'semantic-ui-react'
import { Icon } from '../components'
import { Utils, Validate } from '../utils'
import { sessionOperations as Session } from '../modules/session'

const SignIn = ({ error, location, history, signIn }) => {
  if (!error && location.state && location.state.error)
    error = location.state.error

  const from = location.state && location.state.from;

  return (
    <Container text textAlign='center'>
      <h3 className="text-center">Sign In</h3>

      <Card color="light" className="text-center mb-1 align-middle mx-auto"
      style={{ maxWidth: "300px"}}>
        <CardBody>
          { error &&
            <Alert color="danger">
              <Icon fa exclamation-circle className="mr-2" />
              {error}
            </Alert>
          }
          <AvForm onValidSubmit={(e, values) =>
            signIn(history.push, values, from)}>
            <AvField
              name="email"
              type="text"
              placeholder="Email"
              style={Utils.styleInputIcon('user')}
              validate={Validate.EMAIL}
            />
            <AvField
              name="password"
              placeholder="Password"
              style={Utils.styleInputIcon('lock')}
              type="password"
              validate={Validate.PASSWORD}
            />

            <Label className="mb-1" check>
              <AvInput className="mr-1" name="remember" type="checkbox" />
              Remember Me?
            </Label>

            <p className="mb-0">
              <Button color="primary">Submit</Button>
              <Link to="/" color="link">Cancel</Link>
            </p>
          </AvForm>
        </CardBody>
      </Card>
      <p className="text-center mb-0">
        <Link to='/sign_up'>Need an Account?</Link><br />
        <Link to='/reset'>Forgot your password?</Link>
      </p>
    </Container>
  );
};

// connect and import from redux store; make dispatched actions available
const mapStateToProps = ({ session }) => ({ error: session.error });
const mapDispatchToProps = { signIn: Session.signIn };
export default connect( mapStateToProps, mapDispatchToProps )(SignIn);
