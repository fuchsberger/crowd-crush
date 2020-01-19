import { connect } from 'react-redux'
import CSVReader from 'react-csv-reader'
import { Button, Form, Navbar } from 'reactstrap'
import { Icon } from '../../components'
import { simOperations as Sim, simSelectors } from '../../modules/sim'

const percent = (time, duration) => {
  if(time == null || !duration) return '?';
  return Math.round(parseFloat(time / duration * 100), 2);
}

const ControlBar = ({ duration, play, pause, running, stop, time, update }) => {

  const loadFile = ( markers ) => {

    // sort csv file markers by agent and then time
    markers = markers.sort((a,b) => {

      // first sort by agent
      if (a[0] > b[0]) return 1;
      else if (a[0] < b[0]) return -1;

      // then sort by time
      if (a[0] < b[0]) return -1;
      else if (a[0] > b[0]) return 1

      // nothing to split them
      else return 0;
    })

    // convert abs coordinates to relative and update state
    update({ markers2: simSelectors.convertToRel( markers )})
  }

  return (
  <Navbar color="dark" dark fixed="bottom" expand="md" className='text-center'>
    <Form inline className="mr-auto">
      { running
        ? <Button className="mr-1" onClick={() => pause()}>
            <Icon fa pause />
          </Button>
        : <Button className="mr-1" onClick={() => play()}>
            <Icon fa play />
          </Button>
      }
      <Button className="mr-1" onClick={() => stop()}><Icon fa stop /></Button>
    </Form>
    <span className="navbar-text">
      <Icon far clock className="mr-2" />
      {time}<small>/{duration || '?'}</small>
      &nbsp;| <strong>{percent(time, duration)}</strong>%
    </span>
    <Form inline>
      <CSVReader
        cssClass="form-control-file form-control-sm text-light"
        onFileLoaded={loadFile}
        parserOptions={{
          dynamicTyping: true,
          fastMode: false,
          skipEmptyLines: true
        }}
      />
    </Form>
  </Navbar>
  );
}

const mapStateToProps = store => ({
  duration: simSelectors.video_duration(store),
  running: state.sim.running,
  time: state.sim.time
});

const mapDispatchToProps = {
  play: Sim.play,
  pause: Sim.pause,
  stop: Sim.stop,
  update: Sim.update
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlBar);
