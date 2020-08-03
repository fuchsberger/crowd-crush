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

    this.prepareSimulation()

    this.player = new Player(this.video.youtubeID, (event, data) => this.pushEvent(event, data))

    const hook = this

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
    const old_time = this.player.time
    this.get_data()
    if(this.player.time == 0 && old_time != 0) this.prepareSimulation()
    this.render_canvas()
  },

  get_data() {
    const d = this.el.dataset
    this.mode = d.mode
    this.futureAgents = JSON.parse(d.futureAgents)
    this.showGoals = JSON.parse(d.showGoals)
    this.selected = JSON.parse(d.selected)
    this.goals = JSON.parse(d.goals)
    this.positions = JSON.parse(d.positions)
    this.video = JSON.parse(d.video)
  },

  render_canvas(){
    // draw background
    if(this.mode == 'comparison'){
      this.context.fillStyle = "white"
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }
    else this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // draw markers, obstacles and goal lines.
    if(this.mode == 'obstacles') this.draw_obstacles()
    if(this.mode == 'markers' || this.mode == 'comparison') this.draw_agents()
    if(this.mode == 'simulation' || this.mode == 'comparison') this.draw_synth_agents()
  },

  draw_agents() {
    const {context, canvas, showGoals, goals, mode, selected, positions} = this

    for (const id in positions) {

      const pos = positions[id]
      if(!pos) continue;

      if (mode == "comparison") context.fillStyle = "black"
      else context.fillStyle = selected == parseInt(id) ? COLORS.CYAN : COLORS.GREEN

      context.beginPath()
      context.arc(canvas.width * pos.x, canvas.height * pos.y, 5, 0, 2 * Math.PI)
      context.fill()
    }

    if(showGoals){
      context.strokeStyle = COLORS.PURPLE
      context.lineWidth = 1;

      for (const id in positions) {
        if(!positions[id]) continue
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

    const time = this.player.time
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

    if(showGoals){
      context.strokeStyle = COLORS.PURPLE
      context.lineWidth = 1;

      for(let i = 0; i < this.simulator.agents.length; i++){

        const position = this.simulator.getAgentPosition(i)

        // ignore goals for agents at final destination (outside screen)
        if(position.x == -666 && position.y == -666) continue;

        const goal = this.simulator.getGoal(i)

        context.beginPath()
        context.moveTo(position.x, position.y)
        context.lineTo(goal.x, goal.y)
        context.stroke()
      }
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
  }
}
