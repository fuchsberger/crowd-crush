import React, { Component } from 'react'
import { connect } from 'react-redux'
// import { Link } from 'react-router-dom'
// import Icon from '../../utils/icons'

import { Container, Form } from 'semantic-ui-react'
import Validator from 'simple-react-validator'
// import { Button, Col, Container } from 'reactstrap'
// import { YOUTUBE_API_KEY } from '../config'
// import { addVideo } from '../../modules/videoList'
// import NavBot from '../../components/layout/navbot'
// import ErrorView from '../home/error'


class SimAddView extends Component {

  state = { aspectratio: '', error: null, title: '', youtubeID: null, youtube_url: '' }
  validator = new Validator({ element: false })

  onInputChange = (e, { name, value }) => this.setState({ [name]: value })

  changeURL = e => {

    const youtubeID = this.youtube_parser(e.target.value)

    this.validator.message('youtubeID', youtubeID, 'required|string|size:11', {
      messages: { default: 'Does not seem to be a a valid YouTube URL.'}
    })

    if(!youtubeID) return this.setState({ youtubeID: false, youtube_url: e.target.value})


    // validate url
    // const match = e.target.v
    console.log("SUCCESS")
    this.setState({ youtubeID, youtube_url: e.target.value})
    // const id = match && match[5].length == 11 ? match[5] : false
    // this.setState({ youtube_url: e.target.value, youtubeID: id })

    // const youtubeError = this.validator.message('youtubeID', id, 'required|min:11')

    // console.log(youtubeError)

    // if (!id) {
    //   e.target.blur();
    //   return this.setState({ youtubeID: false });
    // }

    // // check youtube data-api for title and description and update state
    // let xhr = new XMLHttpRequest();
    // xhr.open('GET', `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${YOUTUBE_API_KEY}&part=snippet,player&maxHeight=8192`)
    // xhr.setRequestHeader('Content-Type', 'application/json')
    // xhr.onload = res => {
    //   if (xhr.status === 200) {
    //     const video = JSON.parse(res.srcElement.response).items[0]
    //     // if (!res || !res.data || !res.data.items[0]) return this.reset();
    //     this.setState({
    //       aspectratio: video.player.embedWidth / video.player.embedHeight,
    //       error: null,
    //       title: video.snippet.title,
    //       youtubeID: video.id
    //     });
    //   }
    // };
    // xhr.send();


  }

  reset = () => this.setState({ aspectratio: null, title: null, youtubeID: null })

  handleSubmit = () => {

  }

  handleValidSubmit = (e, values) => {
    this.props.addVideo({ ...values, description: this.state.description });
  }

  handleInvalidSubmit = (e, errors, values) => {
    this.setState({ error: true });
  }

  youtube_parser = url => {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
  }

  render() {

    const { aspectratio, error, title, youtubeID, youtube_url } = this.state




    // const {
    //   changeURL,
    //   handleValidSubmit,
    //   handleInvalidSubmit,
    //   reset
    // } = this;

    // const youtubeError = this.validator.message('youtube_url', youtube_url, 'required|url')

    // console.log(youtube_urlhttps://www.youtube.com/watch?v=z1P5U7NlVoA)

    return (
      <Container textAlign='center'>
        <h2>Add Video</h2>

        <Form onSubmit={this.handleSubmit}>
          {this.validator.fieldValid('youtubeID')
            ? <div>
                <Form.Input
                  label='Youtube ID'
                  icon='youtube'
                  iconPosition='left'
                  readOnly
                  name='youtubeID'
                  type='text'
                  value={youtubeID}
                />
              </div>
            : <Form.Input
                error={youtube_url == '' ? false : !this.validator.fieldValid('youtubeID')}
                label={this.validator.errorMessages.youtubeID ||
                  'Please start by pasting a valid YouTube video URL...'}
                icon='youtube'
                iconPosition='left'
                name='youtube_url'
                onChange={this.changeURL}
                placeholder='paste YouTube URL'
                type='text'
                value={youtube_url}
              />
          }
        </Form>

        {/* <AvForm
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
                id="youtube_url"
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
        <NavBot /> */}
      </Container>
    );
  }
}
const mapDispatchToProps = {  }
export default connect(() => ({}), mapDispatchToProps)(SimAddView);
