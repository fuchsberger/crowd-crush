import { connect } from 'react-redux'
import { Button, Form, Input, FormGroup } from 'reactstrap'
import { simOperations as Sim } from '../../modules/sim'

const ControlsCoords = ({ coordSelected, update, video }) => (
  <Form inline>
    <FormGroup className="mr-2">
      <Button
        color = { coordSelected == 'm0' ? 'warning' : 'default' }
        className="mr-1"
        onClick={() => update({
          coordSelected: coordSelected == 'm0' ? null : 'm0'
        })}
      >m0</Button>
      <Button
        color = { coordSelected == 'mX' ? 'primary' : 'default' }
        className="mr-1"
        onClick={() => update({
          coordSelected: coordSelected == 'mX' ? null : 'mX'
        })}
      >mX</Button>

      <Button
        color = { coordSelected == 'mY' ? 'success' : 'default' }
        className="mr-1"
        onClick={() => update({
          coordSelected: coordSelected == 'mY' ? null : 'mY'
        })}
      >mY</Button>

      <Button
        color = { coordSelected == 'mR' ? 'danger' : 'default' }
        className="mr-2"
        onClick={() => update({
          coordSelected: coordSelected == 'mR' ? null : 'mR'
        })}
      >MR</Button>

      <Input
        className="text-center mr-2"
        id="interval-field"
        onChange={e => updateVideo({ })}
        value={video.dist_x}
      />
      <Input
        className="text-center"
        id="interval-field"
        onChange={e => updateVideo({ })}
        value={video.dist_y}
      />
    </FormGroup>
  </Form>
);


const mapStateToProps = store => ({
  coordSelected: store.sim.coordSelected,
  video: store.sim.video
});

const mapDispatchToProps = {
  update: Sim.update,
  updateVideo: Sim.updateVideo
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlsCoords);
