import { withRouter } from 'react-router-dom'
import { Container, Label } from 'semantic-ui-react'

/**
 * Component accepts either:
 * code, heading, body        -> custom error with error code
 * code = null, heading, body -> custom error without error code
 * code                       -> default [code] error
 * no arguments               -> default 404 error
 */

const Error = ({ code = 404, heading=null, body=null, location }) => {

  if (!heading) {
    switch (code) {
      case 401:
        heading = 'Authentification required';
        break;
      case 403:
        heading = 'Forbidden';
        break;
      case 404:
        heading = 'Page Not Found';
        break;
      default:
        heading = 'Unknown Error';
    }
  }

  if (!body) {
    switch (code) {
      case 401:
        body = <p className="lead">Please login first</p>;
        break;
      case 403:
        body = <p>You do not have the necessary priviliges</p>;
        break;
      case 404:
        body = (
          <div>
            <p className="lead">
              No match for <Label><code>{ location.pathname }</code></Label>
            </p>
            <p>
              The given page doesn't exist. This could be because the url was
              manually altered in the address bar.
            </p>
          </div>
        );
        break;
      default:
        body = "No further information is provided on this error."
    }
  }

  return (
    <Container textAlign='center'>
      <h2 className="mt-4 mb-3">
        { code && <small className="text-muted"> { code } <br /></small> }
        { heading }
      </h2>
      { body }
    </Container>
  );
};

export default withRouter(Error);
