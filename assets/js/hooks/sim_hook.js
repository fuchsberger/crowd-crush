import { Simulator, RVOMath, Vector2 } from '../rvo'
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

    this.canvas = document.getElementById('canvas')
    this.context = canvas.getContext('2d')

    this.get_data()
    resize(this.video.aspectratio, this.canvas)

    // this.prepareSimulation()

    this.player = new Player(this.video.youtubeID, (event, data) => this.pushEvent(event, data))

    const hook = this

    document.getElementById('start').addEventListener('click', () => hook.prepareSimulation())

    window.addEventListener('keydown', e => {
      switch(e.keyCode){
        case 65: hook.player.backward(); break;          // A
        case 68: hook.player.forward(); break;           // D
        case 83: hook.pushEvent("deselect"); break; // S
        case 88: hook.pushEvent("toggle-cancel"); break; // S
      }
    })

    this.render_canvas()
  },

  updated() {
    this.get_data()
    this.render_canvas()
  },

  get_data() {
    const d = this.el.dataset

    this.futureAgents = JSON.parse(d.futureAgents)
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
    const { canvas, context } = this

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

    for (const id in this.positions) {

      const pos = this.positions[id]
      if(!pos) continue;

      if (this.showVideo) ctx.fillStyle = this.selected == parseInt(id) ? COLORS.CYAN : COLORS.GREEN
      else ctx.fillStyle = "black"

      ctx.beginPath()
      ctx.arc(
        this.canvas.width * pos.x,
        this.canvas.height * pos.y,
        5,  // radius
        0,
        2 * Math.PI
      )
      ctx.fill()
    }
  },

  draw_goals(){
    const { canvas, context, simulator, simMode, positions, goals } = this
    context.strokeStyle = COLORS.PURPLE
    context.lineWidth = 1;

    if(simMode){
      for(const agent of simulator.agents){

        // ignore goals for agents at final destination (outside screen)
        if(agent.position.x == -666 && agent.position.y == -666) continue;

        const goal = simulator.getGoal(agent.id)

        context.beginPath()
        context.moveTo(agent.position.x, agent.position.y)
        context.lineTo(goal.x, goal.y)
        context.stroke()
      }
    } else {

      // console.log("ANN", positions["1"].x * canvas.width)
      for(const id in positions){
        if(!positions[id]) continue;

        context.beginPath()
        context.moveTo(positions[id].x * canvas.width, positions[id].y * canvas.height)
        context.lineTo(goals[id].x * canvas.width, goals[id].y * canvas.height)
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

    const time = this.player.getTime()
    const lastTime = this.simulator.getGlobalTime()

    this.simulator.setTimeStep(time - lastTime)
    this.simulator.run()

    this.context.fillStyle = this.showVideo ? COLORS.GREEN : "black"
    this.lineWidth = 0.5;

    // add new agents
    for(let i = 0; i < this.futureAgents.length; i++){
      const agent = this.futureAgents[i]
      if(agent.time > lastTime && agent.time <= time){
        // time to add next agent to simulation

        const position = new Vector2(agent.x * canvas.width, agent.y * canvas.height)

        const id = this.simulator.addAgent(position)
        this.simulator.setAgentGoal(id, agent.goal_x * canvas.width, agent.goal_y * canvas.height)

        // normalize agent's prefered velocity
        const v = RVOMath.normalize(this.simulator.getGoal(id).minus(position))

        this.simulator.setAgentPrefVelocity(id, v.x * this.video.velocity, v.y * this.video.velocity)
      }
    }

    // go through all agents and draw their positions / update finished agents
    for(let i = 0; i < this.simulator.agents.length; i++){

      const position = this.simulator.getAgentPosition(i)

      // ignore agents at final destination (outside screen)
      if(position.x == -666 && position.y == -666) continue

      // check if agent has left frame
      if(position.x < 12 || position.y < 15 || position.x > canvas.width - 10 || position.y > canvas.height - 10){

        // stop moving agent and teleport them to final destination (outside screen)
        this.simulator.setAgentPrefVelocity(i, 0, 0)
        this.simulator.setAgentPosition(i, -666, -666)
        this.simulator.setAgentGoal(i, -666, -666)
        continue
      }

      // agent has reached destination but it is inside frame (just stand there)
      const goal = this.simulator.getGoal(i)
      if (RVOMath.absSq(goal.minus(position)) < RVOMath.RVO_EPSILON) {
        this.simulator.setAgentPrefVelocity(i, 0, 0)
        continue
      }

      this.context.beginPath()
      this.context.arc(position.x, position.y, 5, 0, 2 * Math.PI )
      this.context.fill()
    }
  },

  prepareSimulation() {

    const {canvas, goals, positions, video} = this

    this.simulator = new Simulator(video)

    // add agents to simulation
    for (const i in positions) {

      // ignore agents that are not present at start
      if(!positions[i]) continue;

      const id = this.simulator.addAgent(new Vector2(
        positions[i].x * canvas.width,
        positions[i].y * canvas.height
      ))

      this.simulator.setAgentGoal(
        id,
        goals[i].x * canvas.width,
        goals[i].y * canvas.height
      )

      // normalize agent's prefered velocity
      let v = RVOMath.normalize(this.simulator.getGoal(id).minus(this.simulator.getAgentPosition(id)))

      this.simulator.setAgentPrefVelocity(id, v.x * this.video.velocity, v.y * this.video.velocity)
    }

    // add obstacles to simulation
    for (const o of video.obstacles) {
      this.simulator.addObstacle([
        new Vector2(o.a_x * canvas.width, o.a_y * canvas.height),
        new Vector2(o.b_x * canvas.width, o.b_y * canvas.height)
      ])
    }

    this.simulator.processObstacles()

    // this.simulator = simulator

    // this.pushEvent("toggle-video")
    this.pushEvent("toggle-sim")
    // this.player._player.play()
  }
}
