import RVO from 'rvo-js'
import Player from '../components/player'
import { resize } from '../helpers/canvas'

const COLORS = {
  CYAN: "rgba(0, 255, 208, 1)",
  GREEN: "rgba(0, 255, 0, 1)",
  RED: "rgba(255, 17, 0, 1)",
  PURPLE: "rgba(255, 0, 255, 0.7)"
}

window.Obstacle = () => { }

export default {
  mounted() {

    let canvas = document.getElementById('canvas')
    let context = canvas.getContext('2d')

    this.get_data()

    const player = new Player(this.video.youtubeID, (event, data) => this.pushEvent(event, data))

    const hook = this

    document.getElementById('start').addEventListener('click', () => hook.prepareSimulation())

    window.addEventListener('keydown', e => {
      switch(e.keyCode){
        case 65: player.backward(); break;          // A
        case 68: player.forward(); break;           // D
        case 83: hook.pushEvent("deselect"); break; // S
        case 88: hook.pushEvent("toggle-cancel"); break; // S
      }
    })

    Object.assign(this, { canvas, context, player })

    this.render_canvas()
  },

  updated() {
    this.get_data()
    this.render_canvas()
  },

  get_data() {
    const d = this.el.dataset

    this.simMode = JSON.parse(d.simMode)
    this.showGoals = JSON.parse(d.showGoals)
    this.showMarkers = JSON.parse(d.showMarkers)
    this.showObstacles = JSON.parse(d.showObstacles)
    this.showVideo = JSON.parse(d.showVideo)
    this.selected = JSON.parse(d.selected)
    this.goals = JSON.parse(d.goals)
    this.positions = JSON.parse(d.positions)
    this.video = JSON.parse(d.video)
  },

  render_canvas(){
    const {canvas, context, video} = this

    // should be done once in mount but for some reason properties don't persist there
    resize(video.aspectratio, canvas)

    // draw background
    if(this.showVideo){
      context.clearRect(0, 0, canvas.width, canvas.height)
    } else {
      context.fillStyle = "white"
      context.fillRect(0, 0, canvas.width, canvas.height)
    }

    if (this.showObstacles) this.draw_obstacles()

    if(this.showMarkers){
      this.simMode ? this.draw_synth_agents() : this.draw_agents()
    }

    if(this.showGoals) this.draw_goals()
  },

  draw_agents() {
    const ctx = this.context

    for (const agent of this.positions) {
      if (this.showVideo) ctx.fillStyle = this.selected == agent[0] ? COLORS.CYAN : COLORS.GREEN
      else ctx.fillStyle = "black"


      ctx.beginPath()
      ctx.arc(
        this.canvas.width * agent[1],
        this.canvas.height * agent[2],
        5,  // radius
        0,
        2 * Math.PI
      )
      ctx.fill()
    }
  },

  draw_goals(){
    const { canvas, context, goals, positions, simMode } = this
    context.strokeStyle = context.fillStyle = COLORS.PURPLE

    if(simMode){

      for (let i = 0; i < this.simulator.getNumAgents(); ++i) {
        const pos = this.simulator.getAgentPosition(i)
        const goal = this.simulator.getGoal(i)

        context.beginPath()
        context.moveTo(pos.x, pos.y)
        context.lineTo(goal.x, goal.y)
        context.stroke()
      }

    } else {

      for (const agent of positions) {
        const id = agent[0]
        context.beginPath()
        context.moveTo(agent[1] * canvas.width, agent[2] * canvas.height)
        context.lineTo(goals[id][0] * canvas.width, goals[id][1] * canvas.height)
        context.stroke()
      }
    }
  },

  draw_obstacles() {

    const { canvas, context } = this

    context.strokeStyle = context.fillStyle = COLORS.RED
    context.lineWidth = 3;

    for (const o of this.video.obstacles){
      context.strokeStyle = context.fillStyle = o.id == this.selected ? COLORS.CYAN : COLORS.RED
      context.beginPath()
      context.moveTo(o.a_x * canvas.width, o.a_y * canvas.height)
      context.lineTo(o.b_x * canvas.width, o.b_y * canvas.height)
      context.stroke()
    }
  },

  draw_synth_agents() {
    const { context, simulator } = this

    context.fillStyle = context.fillStyle = this.showVideo ? COLORS.GREEN : "black"
    context.lineWidth = 0.5;

    for (let i = 0; i < simulator.getNumAgents(); ++i) {

      const pos = simulator.getAgentPosition(i)
      context.beginPath()
      context.arc(pos.x, pos.y, 5, 0, 2 * Math.PI )
      context.fill()

      if (RVO.RVOMath.absSq(simulator.getGoal(i).minus(simulator.getAgentPosition(i))) < RVO.RVOMath.RVO_EPSILON) {
        // Agent is within one radius of its goal, set preferred velocity to zero
        simulator.setAgentPrefVelocity(i, 0.0, 0.0)

        // remove agent from simulation

        simulator.agents.splice(i, 1)
        i--

      } else {
        // Agent is far away from its goal
        // set preferred velocity as unit vector towards agent's goal.
        let v = RVO.RVOMath.normalize(simulator.getGoal(i).minus(simulator.getAgentPosition(i)))
        simulator.setAgentPrefVelocity(i, v.x, v.y)
      }
    }

    simulator.run()

    if (simulator.reachedGoal()) {
      // reset simulation and switch back to annotation mode
      this.prepareSimulation()
    }
  },

  prepareSimulation() {

    const simulator = new RVO.Simulator()
    window.agentTree = []
    simulator.setTimeStep(0.2)

    simulator.setAgentDefaults(
      this.video.neighbor_dist, // neighbor distance (min = radius * radius)
      this.video.max_neighbors, // max neighbors
      this.video.time_horizon, // time horizon
      this.video.time_horizon_obst, // time horizon obstacles
      this.video.radius, // agent radius
      this.video.max_speed, // max speed
      this.video.velocity, // default velocity for x
      this.video.velocity, // default velocity for y
    )

    // add agents to simulation
    const agents = this.positions
    const w = canvas.width
    const h = canvas.height

    for (let i = 0; i < agents.length; i++) {
      const id = agents[i][0]
      simulator.addAgent()
      simulator.setAgentPosition(i, agents[i][1] * w, agents[i][2] * h)
      simulator.setAgentGoal(i, this.goals[id][0] * w, this.goals[id][1] * h)
    }

    // add obstacles to simulation
    for (const o of this.video.obstacles) {
      simulator.addObstacle([
        new RVO.Vector2(o.a_x * w, o.a_y * h),
        new RVO.Vector2(o.b_x * w, o.b_y * h)
      ])
    }

    simulator.processObstacles()

    this.simulator = simulator

    this.pushEvent("toggle-video")
    this.pushEvent("toggle-sim")
    this.player._player.play()
  }
}

