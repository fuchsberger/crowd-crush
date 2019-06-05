import React from 'react'
import { connect } from 'react-redux'
import { simOperations as Sim, simSelectors } from '../../modules/sim'

class Coordinates extends React.Component {
  constructor(props) {
    super(props);

    const video = props.video;

    this.move_coordinate = this.move_coordinate.bind(this);
    this.renderAxisLabel = this.renderAxisLabel.bind(this);
    this.renderCoordinate = this.renderCoordinate.bind(this);

    this.state = {
      drag: null,
      dist_x: video.dist_x,
      dist_y: video.dist_y,
      m0_x: video.m0_x,
      m0_y: video.m0_y,
      mX_x: video.mX_x,
      mX_y: video.mX_y,
      mY_x: video.mY_x,
      mY_y: video.mY_y,
      mR_x: video.mR_x,
      mR_y: video.mR_y
    };
  }

  move_coordinate() {
    const { updateVideo } = this.props;
    const { mouse_X, mouse_Y } = this.props.screen;
    const { drag } = this.state;

    if (mouse_X > 0 && mouse_X < 1 && mouse_Y > 0 && mouse_Y < 1){
      let coords;
      switch (drag) {
        case 'M0': coords = { m0_x: mouse_X, m0_y: mouse_Y }; break;
        case 'MX': coords = { mX_x: mouse_X, mX_y: mouse_Y }; break;
        case 'MY': coords = { mY_x: mouse_X, mY_y: mouse_Y }; break;
        case 'MR': coords = { mR_x: mouse_X, mR_y: mouse_Y }; break;
        default: return null;
      }
      updateVideo(coords);
    }
    this.setState({ drag: null });
  }

  renderAxisLabel(key) {
    const { updateVideo } = this.props;
    const { offset_X, offset_Y, width, height } = this.props.screen;

    if (!P1.x || !P2.x) return null;

    // if two markers are given, calculate position between them
    const rel_x = P1.x + (P2.x - P1.x) * 0.5;
    const rel_y = P1.y + (P2.y - P1.y) * 0.5;
    const x = offset_X + Math.round(rel_x * (width - 2 * offset_X));
    const y = offset_Y + Math.round(rel_y * (height - 2 * offset_Y));

    return (
      <input
        key={key}
        className={`axisBox ${key}`}
        onChange={e => this.setState({ [key]: e.target.value })}
        onBlur={e => updateVideo({[key]: this.state[key]})}
        value={this.state[key] || ''}
        placeholder={key === 'dist_x' ? 'X' : 'Y'}
        style={{ left: x, top: y }}
      />
    );
  }

  renderCoordinate(key) {
    const { drag } = this.state;
    return (
      <div
        key={key}
        className={`marker coordinate` + (drag === key ? ' active' : '')}
        onMouseDown={() => this.setState({ drag: key })}
        onMouseUp={this.move_coordinate}
        style={{
          left: 100 * this.props.video[key+'_x'] + '%',
          top: 100 * this.props.video[key+'_y'] + '%'
        }}
      />
    );
  }

  render() {
    const { M0, MX, MY } = this.props.video;
    const { renderAxisLabel, renderCoordinate } = this;
    return (
      <div>
        {renderCoordinate('m0')}
        {renderCoordinate('mX')}
        {renderCoordinate('mY')}
        {renderCoordinate('mR')}
        {renderAxisLabel('dist_x')}
        {renderAxisLabel('dist_y')}
      </div>
    );
  }
}

const mapStateToProps = store => ({
  video: store.sim.video,
  // screen: simSelectors.screenData(store)
});
const mapDispatchToProps = { updateVideo: Sim.updateVideo }

export default connect(mapStateToProps, mapDispatchToProps)(Coordinates);
