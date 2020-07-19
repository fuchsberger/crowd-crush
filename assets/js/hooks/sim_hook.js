import RVO from 'rvo-js'
import Player from '../components/player'
import { resize } from '../helpers/canvas'

const COLORS = {
  CYAN: "rgba(0, 255, 208, 1)",
  GREEN: "rgba(0, 255, 0, 1)"
}

window.Obstacle = () => { }

export default {
  mounted() {

    let canvas = document.getElementById('canvas')
    let context = canvas.getContext('2d')

    this.get_data()
    // this.prepareSimulation()

    const player = new Player(this.video.youtubeID, (event, data) => this.pushEvent(event, data))



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
    const {canvas, context, settingsModal, showSettings, video} = this

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
      this.showVideo ? this.draw_agents() : this.draw_synth_agents()
    }
  },

  draw_agents() {
    const ctx = this.context

    for (const agent of this.positions) {
      if (this.showOverlay) ctx.fillStyle = "black";
      else ctx.fillStyle = this.selected == agent[0] ? COLORS.CYAN : COLORS.GREEN

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

  draw_obstacles() {
    const { canvas, context } = this

    context.strokeStyle = context.fillStyle = "rgba(255,0,0,0.5)"
    context.lineWidth = 3;

    for (const o of this.obstacles){

      if (o.length == 1) {
        // draw single dot
        context.beginPath()
        context.arc(o[0].x * canvas.width, o[0].y * canvas.height, 3, 0, 2 * Math.PI, true)
        context.fill()

      } else if (o.length == 2) {
        // draw line
        context.beginPath()
        context.moveTo(o[0].x * canvas.width, o[0].y * canvas.height)
        context.lineTo(o[1].x * canvas.width, o[1].y * canvas.height)
        context.stroke()

      } else {
        // draw polygon
        context.beginPath()
        context.moveTo(o[0].x * canvas.width, o[0].y * canvas.height)
        for (var j = 1; j < o.length; j++) {
          context.lineTo(o[j].x * canvas.width, o[j].y * canvas.height)
        }
        context.closePath()
        context.fill()
      }
    }
  },

  draw_synth_agents() {

    const { context, simulator } = this

    context.fillStyle = "black"

    for (let i = 0; i < simulator.getNumAgents(); ++i) {

      const pos = simulator.getAgentPosition(i)
      context.beginPath()
      context.arc(
        pos.x,
        pos.y,
        5,  // radius
        0,
        2 * Math.PI
      )
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
      // reset simulation
      this.prepareSimulation()
    }
  },

  prepareSimulation() {
    const simulator = new RVO.Simulator()
    window.agentTree = []
    simulator.setTimeStep(0.25)

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
    for (const o of this.obstacles) {
      const obst = []
      for (let j = 0; j < o.length; j++) {
        obst.push(new RVO.Vector2(
          o[j].x * this.canvas.width,
          o[j].y * this.canvas.height
        ))
      }
      simulator.addObstacle(obst)
    }

    simulator.processObstacles()

    this.simulator = simulator
  }
}

