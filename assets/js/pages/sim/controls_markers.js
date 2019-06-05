import { connect } from 'react-redux'
import { Icon } from '../../components'
import { Button, Form, Input, FormGroup, InputGroup, InputGroupAddon } from 'reactstrap'
import { keyOperations as Keys } from '../../modules/keys'
import { simOperations as Sim } from '../../modules/sim'

class ControlsMarkers extends React.Component {

  constructor(props) {
    super(props);
    this.keyDown = this.keyDown.bind(this)
    this.keyUp = this.keyUp.bind(this)
  }

  componentDidMount(){
    document.addEventListener('keydown', e => this.props.keyDown(e.keyCode));
    document.addEventListener('keyup', this.keyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyDown);
    document.removeEventListener('keyup', this.keyUp);
  }

  componentWillReceiveProps(nProps) {

    const { E, S, Q, SHIFT } = nProps.keys;
    const { agentSelected, jump, keys, selectAgent } = this.props;

    // listen for key events in order of priority (one at at time)

    // 1. if an agent is hovered, select it, otherwise deselect it
    if (!keys.S && S) return selectAgent();

    // 2. allow to jump to time of first marker for given agent
    if (agentSelected && Q && SHIFT) return jump(false, agentSelected);

    // 3. allow to jump to time of last marker for given agent
    if (agentSelected && E && SHIFT) return jump(true, agentSelected);

    // 4. allow to move forward and backward by a single interval
    if (Q && !SHIFT) return jump(false);
    if (E && !SHIFT) return jump(true);
  }

  keyDown(e){
    this.props.keyDown(e.keyCode)
  }

  keyUp(e){
    this.props.keyUp(e.keyCode)
  }

  render(){

    const {
      agentSelected,
      jump,
      jumpTime,
      keys,
      removeAgent,
      removeAllAgents,
      update
    } = this.props;

    return (
      <Form inline>
        <FormGroup className="mr-2">
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <Button onClick={() => jump(false)}><Icon fa backward /></Button>
            </InputGroupAddon>
            <Input
              className="text-center"
              id="interval-field"
              onChange={e => update({ jumpTime: parseInt(e.target.value, 10)})}
              value={jumpTime}
            />
            <InputGroupAddon addonType="append">
              <Button onClick={() => jump(true)}><Icon fa forward /></Button>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>

        <Button
          color="danger"
          className="mr-1"
          disabled={!agentSelected && !keys.CTRL}
          onClick={() =>
            key_CTRL
              ? removeAllAgents()
              : removeAgent(agentSelected)
          }
          outline
        >
          <Icon fa times className="mr-1" />
          {keys.CTRL ? <Icon fa users /> : <Icon fa user />}
        </Button>
      </Form>
    );
  }
}

const mapStateToProps = store => ({
  agentSelected: store.sim.agentSelected,
  jumpTime: store.sim.jumpTime,
  keys: store.keys
});

const mapDispatchToProps = {
  keyDown: Keys.down,
  keyUp: Keys.up,
  jump: Sim.jump,
  removeAgent: Sim.removeAgent,
  removeAllAgents: Sim.removeAllAgents,
  selectAgent: Sim.selectAgent,
  update: Sim.update
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlsMarkers);
