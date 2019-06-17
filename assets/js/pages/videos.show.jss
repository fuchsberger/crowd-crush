import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import { simOperations as Sim, simSelectors } from '../modules/sim'
import { ControlBar } from './video'
import { Markers } from './sim'
import Error from './error'

class VideoShowView extends React.Component {

  componentDidMount() {
    if(this.props.ready)
      this.props.joinSimulation( this.props.match.params.id, { abs: true } );
  }

  componentDidUpdate(pProps){
    if(!pProps.ready && this.props.ready)
      this.props.joinSimulation( this.props.match.params.id, { abs: true } );
  }

  componentWillUnmount() {
    this.props.leaveSimulation();
  }

  render() {
    const { duration, error } = this.props;

    // if video not yet loaded, show loading screen
    if ( !duration ) return <Loading />;

    if ( error ) return (
      <Error
        heading="Video not found."
        body = {
          <div>
            <p>Perhaps the video was deleted or the url was manually altered in
            the address bar.</p>
            <p><Link to='/videos'>Go back</Link> to video list.</p>
          </div>
        }
      />
    );

    return (
      <Container>
        <div className='video-wrapper left bg-light'>
          <Markers comparisonMode />
        </div>
        <div className='video-wrapper right bg-light'>
          <Markers comparisonMode right />
        </div>
        <ControlBar />
      </Container>
    );
  }
}

const mapStateToProps = ( state )  => ({
  duration: state.sim.duration,
  error: state.sim.error,
  ready: !!state.session.socket
});

const mapDispatchToProps = {
  joinSimulation: Sim.join,
  leaveSimulation: Sim.leave
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoShowView);
