import RVO from 'rvo-js'
import {resize} from '../helpers/canvas'

export default {
  mounted() {
    let canvas = this.el.firstElementChild
    let context = canvas.getContext("2d")

    const Simulator = RVO.Simulator
    const RVOMath = RVO.RVOMath

    const simulator = new Simulator()

    simulator.setTimeStep(0.25)
    simulator.setAgentDefaults(
      200, // neighbor distance (min = radius * radius)
      30, // max neighbors
      600, // time horizon
      600, // time horizon obstacles
      15, // agent radius
      10.0, // max speed
      2, // default velocity for x
      2, // default velocity for y
    )

    for (let i = 0; i < 10; i++) {
      const angle = i * (2 * Math.PI) / 9
      const x = Math.cos(angle) * 200
      const y = Math.sin(angle) * 200
      simulator.addAgent()
      simulator.setAgentPosition(i, x, y)
    }

    for (let i = 0; i < simulator.getNumAgents(); i++) {
      let goal = simulator.getAgentPosition(i).scale(-1)
      simulator.setAgentGoal(i, goal.x, goal.y)
    }

    let vertices = []
    simulator.addObstacle(vertices)
    simulator.processObstacles()

    console.log(simulator)

    Object.assign(this, {
      canvas: canvas,
      context,
      simulator,
      RVOMath: RVO.RVOMath,
      fps: 0,
      ups: 0
    })
  },

  updated() {
    let { canvas, context, simulator, RVOMath } = this

    // should be done in mount but for some reason doesnt work here
    resize(canvas, context)

    let halfHeight = canvas.height / 2
    let halfWidth = canvas.width / 2

    this.j++

    if (this.j % 5 === 0) {
      this.j = 0;
      let now = performance.now();
      this.ups = 1 / ((now - (this.upsNow || now)) / 5000);
      this.upsNow = now;
    }

    if (this.animationFrameRequest) {
      cancelAnimationFrame(this.animationFrameRequest)
    }

    this.animationFrameRequest = requestAnimationFrame(() => {

      this.animationFrameRequest = undefined

      // perform drawings
      for (let i = 0; i < simulator.getNumAgents(); ++i) {

        // get agent position and draw agent
        const agent_pos = simulator.getAgentPosition(i)

        context.beginPath()
        context.arc(halfWidth+agent_pos.x, halfHeight+agent_pos.y, 6, 0, 2*Math.PI)
        context.fill()

        if (RVOMath.absSq(simulator.getGoal(i).minus(simulator.getAgentPosition(i))) < RVOMath.RVO_EPSILON) {
          // Agent is within one radius of its goal, set preferred velocity to zero
          simulator.setAgentPrefVelocity(i, 0.0, 0.0)
          console.log('finish ' + i)
        } else {
          // Agent is far away from its goal, set preferred velocity as unit vector towards agent's goal.
          let v = RVOMath.normalize(simulator.getGoal(i).minus(simulator.getAgentPosition(i)))
          simulator.setAgentPrefVelocity(i, v.x, v.y)
        }
      }

      simulator.run()

      // console.log(simulator)
      if (simulator.reachedGoal()) {
        console.log('finish')
      }

      this.i++

      if (this.i % 5 === 0) {
        this.i = 0
        let now = performance.now()
        this.fps = 1 / ((now - (this.fpsNow || now)) / 5000)
        this.fpsNow = now
      }

      context.textBaseline = "top"
      context.font = "20pt monospace"
      context.fillStyle = "#f0f0f0"
      context.beginPath()
      context.rect(0, 0, 260, 80)
      context.fill()
      context.fillStyle = "black"
      context.fillText(`Client FPS: ${Math.round(this.fps)}`, 10, 10)
      context.fillText(`Server FPS: ${Math.round(this.ups)}`, 10, 40)
    })
  }
}

