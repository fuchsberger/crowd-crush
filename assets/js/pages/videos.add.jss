import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Icon from '../../utils/icons'
import { Button, Col, Container } from 'reactstrap'
import { AvForm, AvField } from 'availity-reactstrap-validation'
import TinyMCE from 'react-tinymce'
import { YOUTUBE_API_KEY, YOUTUBE_URL_REGEX, MCE_DEFAULT_CONFIG }
from '../../ducks/constants'
import { addVideo } from '../../modules/videoList'
import NavBot from '../../components/layout/navbot'
import Loading from '../../components/layout/loading'
import ErrorView from '../home/error'

class SimAddView extends React.Component {
  constructor(props) {
    super(props);

    this.changeDesc = this.changeDesc.bind(this);
    this.changeURL = this.changeURL.bind(this);
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
    this.handleInvalidSubmit = this.handleInvalidSubmit.bind(this);
    this.reset = this.reset.bind(this);

    this.state = {
      aspectratio: null,
      error: null,
      description: null,
      title: null,
      youtubeID: null
    };
  }

  componentDidUpdate() {
    if (this.props.user && !this.state.youtubeID)
      document.getElementById('youtubeURL').focus();
  }

  changeDesc(e) {
    this.setState({
      description: e.target.getContent(),
      errors: { ...this.state.errors, description: null }
    });
  }

  changeURL(e) {
    // validate url
    const match = e.target.value.match(YOUTUBE_URL_REGEX);
    const id = match && match[5].length == 11 ? match[5] : false;

    if (!id) {
      e.target.blur();
      return this.setState({ youtubeID: false });
    }

    // check youtube data-api for title and description and update state
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://www.googleapis.com/youtube/v3/videos?id=${
      id}&key=${YOUTUBE_API_KEY}&part=snippet,player&maxHeight=8192`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = res => {
      if (xhr.status === 200) {
        const video = JSON.parse(res.srcElement.response).items[0]
        // if (!res || !res.data || !res.data.items[0]) return this.reset();
        this.setState({
          aspectratio: video.player.embedWidth / video.player.embedHeight,
          description: `<p>${video.snippet.description}</p>`,
          error: null,
          title: video.snippet.title,
          youtubeID: video.id
        });
      }
    };
    xhr.send();
  }

  reset() {
    this.setState({
      aspectratio: null,
      description: null,
      title: null,
      youtubeID: null
    });
  }

  handleValidSubmit(e, values) {
    this.props.addVideo({ ...values, description: this.state.description });
  }

  handleInvalidSubmit(e, errors, values) {
    this.setState({ error: true });
  }

  render() {
    const { user } = this.props;

    if (user === null) return <Loading />;
    if (user === false) return <ErrorView code={401} />;

    const { aspectratio, description, error, title, youtubeID } = this.state;
    const {
      changeDesc,
      changeURL,
      handleValidSubmit,
      handleInvalidSubmit,
      reset
    } = this;


    return (
      <Container>
        <h2 className="text-center">Add Video</h2>
        <AvForm
          className={error ? 'was-validated' : 'needs-validation'}
          onValidSubmit={handleValidSubmit}
          onInvalidSubmit={handleInvalidSubmit}
        >
          {!youtubeID && (
            <Col md={{ size: 8, offset: 2 }} className="text-center">
              <AvField
                bsSize="lg"
                className="text-center"
                label={`Please paste a valid Youtube URL into this field (CTRL + V)`}
                id="youtubeURL"
                name="url"
                onChange={changeURL}
                onSelect={e => e.target.select()}
                placeholder="Youtube URL"
                required
                validate={{
                  required: {
                    value: true,
                    errorMessage: 'Required Field.'
                  },
                  pattern: {
                    value: YOUTUBE_URL_REGEX,
                    errorMessage: 'Not a Youtube URL'
                  }
                }}
              />
            </Col>
          )}
          {youtubeID && (
            <div>
              <AvField name="youtubeID" type="hidden" value={youtubeID} />
              <AvField name="aspectratio" type="hidden" value={aspectratio} />

              <AvField
                bsSize="lg"
                id="title"
                name="title"
                placeholder="Title"
                validate={{
                  required: {
                    value: true,
                    errorMessage: 'Required Field.'
                  },
                  minLength: {
                    value: 5,
                    errorMessage: 'Minimum 6 characters'
                  },
                  maxLength: {
                    value: 100,
                    errorMessage: 'Maximum 100 characters'
                  }
                }}
                value={title}
              />
              <TinyMCE
                config={MCE_DEFAULT_CONFIG}
                content={description}
                onChange={changeDesc}
              />
              <p className="mt-3 text-center">
                <Button className="mr-2" tag={Link} to="/videos">
                  Cancel
                </Button>
                <Button className="mr-2" onClick={reset}>
                  <Icon fa pencil-alt /> Change Video
                </Button>
                <Button color="primary" type="submit">
                  Save
                </Button>
              </p>
            </div>
          )}
        </AvForm>
        <NavBot />
      </Container>
    );
  }
}
const mapStateToProps = store => ({ user: store.session.user });
const mapDispatchToProps = { addVideo }
export default connect(mapStateToProps, mapDispatchToProps)(SimAddView);
