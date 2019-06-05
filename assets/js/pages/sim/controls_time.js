import { connect } from 'react-redux'
import { Icon } from '../../components'

const percentPlayed = (time, duration) => (
  duration > 0 ? Math.round(parseFloat(time / duration * 100), 2) : 0
);

const ControlsTime = ({ duration, inPercent, time }) => (
  <span className="navbar-text">
    <Icon far clock className="mr-2" />
    { inPercent
      ? <span><strong>{percentPlayed(time, duration)}</strong>%</span>
      : <span>{time}<small>/{duration || '?'}</small></span>
    }
  </span>
);

const mapStateToProps = store => ({
  duration: store.sim.duration,
  time: store.sim.time
});

export default connect(mapStateToProps)(ControlsTime);
