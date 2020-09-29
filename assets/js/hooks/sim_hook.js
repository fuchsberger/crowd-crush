import { Simulator, RVOMath, Vector2 } from '../rvo'
import Player from '../components/player'

const SIM_RIGHT = false

const VIDEO_X = 1920
const VIDEO_Y = 1080

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
    this.pushEvent("resize", {width: window.innerWidth, height: window.innerHeight})

    this.player = new Player(this.video.youtubeID, (event, data) => this.pushEvent(event, data))
    this.prepareSimulation()

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
    if(!this.simulator || (this.player.time == 0 && old_time != 0)) this.prepareSimulation()
    this.render_canvas()
  },

  get_data() {
    const d = this.el.dataset
    this.flipped = JSON.parse(d.flipped)
    this.mode = d.mode
    this.futureAgents = JSON.parse(d.futureAgents)
    this.showGoals = JSON.parse(d.showGoals)
    this.selected = JSON.parse(d.selected)
    this.goals = JSON.parse(d.goals)
    this.positions = JSON.parse(d.positions)
    this.avg_velocity = JSON.parse(d.velocity)
    this.video = JSON.parse(d.video)
  },

  render_canvas(){
    const {canvas, context, mode} = this

    // draw background
    if(mode == 'comparison'){
      context.fillStyle = "white"
      context.fillRect(0, 0, canvas.width, canvas.height)

      // draw line in center
      context.strokeStyle = 'black'
      context.lineWidth = 1;
      context.beginPath()
      context.moveTo(canvas.width/2, 0)
      context.lineTo(canvas.width/2, canvas.height)
      context.stroke()
    }
    else context.clearRect(0, 0, canvas.width, canvas.height)

    // draw markers, obstacles and goal lines.
    if(mode == 'obstacles') this.draw_obstacles()
    if(mode == 'markers' || mode == 'comparison') this.draw_agents()
    if(this.simulator && (mode == 'simulation' || mode == 'comparison')) this.draw_synth_agents()
  },

  draw_agents() {
    const {context, showGoals, goals, mode, selected, positions} = this

    for (const id in positions) {
      const pos = positions[id]
      if(!pos) continue;

      if (mode == "comparison") context.fillStyle = "black"
      else context.fillStyle = selected == parseInt(id) ? COLORS.CYAN : COLORS.GREEN

      context.beginPath()
      context.arc(pos[0], pos[1], 5, 0, 2 * Math.PI)
      context.fill()
    }

    if(showGoals){
      context.strokeStyle = COLORS.PURPLE
      context.lineWidth = 1;

      for (const id in positions) {
        if(!positions[id]) continue
        context.beginPath()
        context.moveTo(positions[id][0], positions[id][1])
        context.lineTo(goals[id][0], goals[id][1])
        context.stroke()
      }
    }
  },

  draw_obstacles() {

    const { canvas, context, mode } = this
    const factor = mode == 'comparison' ? 0.5 : 1
    const left = mode == 'comparison' ? 0.5 * canvas.width : 0

    context.strokeStyle = context.fillStyle = COLORS.RED
    context.lineWidth = 3;

    for (const o of this.video.obstacles){
      context.strokeStyle = context.fillStyle = o.id == this.selected ? COLORS.CYAN : COLORS.RED
      context.beginPath()
      context.moveTo(left + o.a_x * factor * canvas.width, o.a_y * canvas.height)
      context.lineTo(left + o.b_x * factor * canvas.width, o.b_y * canvas.height)
      context.stroke()
    }
  },

  draw_synth_agents() {

    const {canvas, context, flipped, futureAgents, mode, player, simulator, showGoals} = this

    const time = player.time
    const lastTime = simulator.getGlobalTime()

    let time_step = time - lastTime
    simulator.setTimeStep(time_step)
    simulator.run()

    context.fillStyle = mode == 'comparison' ? 'black' : COLORS.GREEN
    context.lineWidth = 0.5;

    time_step *= 1000


    // add new agents
    for(let i = 0; i < futureAgents.length; i++){
      const agent = futureAgents[i]
      if(agent.time > lastTime && agent.time <= time){
        // time to add next agent to simulation
        var x = canvas.width / 2, goal_x = canvas.width / 2

        if (flipped) {
          x -= agent.x
          goal_x -= agent.goal_y
        } else {
          x += agent.x
          goal_x += agent.goal_y
        }

        const position = new Vector2(x, agent.y)

        const id = simulator.addAgent(position)
        simulator.setAgentGoal(id, goal_x, agent.goal_y)

        // normalize agent's prefered velocity
        const v = RVOMath.normalize(simulator.getGoal(id).minus(position))
        simulator.setAgentPrefVelocity(id, v.x * time_step, v.y * time_step)
      }
    }

    // go through all agents and draw their positions / update finished agents
    for(let i = 0; i < simulator.agents.length; i++){

      const position = simulator.getAgentPosition(i)

      // normalize agent's prefered velocity
      const v = RVOMath.normalize(simulator.getGoal(i).minus(position))
      simulator.setAgentPrefVelocity(i, v.x * time_step, v.y * time_step)

      // ignore agents at final destination (outside screen)
      if(position.x == -666 && position.y == -666) continue

      // check if agent has left frame
      if(position.x < 12 || position.y < 15 || position.x > canvas.width - 10 || position.y > canvas.height - 10){

        // stop moving agent and teleport them to final destination (outside screen)
        simulator.setAgentPrefVelocity(i, 0, 0)
        simulator.setAgentPosition(i, -666, -666)
        simulator.setAgentGoal(i, -666, -666)
        continue
      }

      // agent has reached destination but it is inside frame (just stand there)
      const goal = simulator.getGoal(i)
      if (RVOMath.absSq(goal.minus(position)) < RVOMath.RVO_EPSILON) {
        simulator.setAgentPrefVelocity(i, 0, 0)
        continue
      }

      context.beginPath()
      context.arc(position.x, position.y, 5, 0, 2 * Math.PI )
      context.fill()
    }

    if(showGoals){
      context.strokeStyle = COLORS.PURPLE
      context.lineWidth = 1;

      for(let i = 0; i < simulator.agents.length; i++){

        const position = simulator.getAgentPosition(i)

        // ignore goals for agents at final destination (outside screen)
        if(position.x == -666 && position.y == -666) continue;

        const goal = simulator.getGoal(i)

        context.beginPath()
        context.moveTo(position.x, position.y)
        context.lineTo(goal.x, goal.y)
        context.stroke()
      }
    }
  },

  prepareSimulation() {

    const {canvas, el, goals, flipped, positions, avg_velocity, video} = this

    this.simulator = new Simulator()

    const data = el.dataset
    const minDist = JSON.parse(data.minDistance) * Math.min(VIDEO_X, VIDEO_Y)

    this.simulator.setAgentDefaults(
      100,  // maxNeighbors
      avg_velocity, // maxSpeed
      minDist * 3, // neighborDist
      minDist * 0.8, // radius
      600, // time horizon
      600, // time horizon obstacles
      avg_velocity, // velocityX
      avg_velocity, // velocityY
    )

    // add agents to simulation
    for (const i in positions) {

      // ignore agents that are not present at start
      if (!positions[i]) continue;

      var x = canvas.width / 2, goal_x = canvas.width / 2

      if (flipped) {
        x -= positions[i][0]
        goal_x -= goals[i][0]
      } else {
        x += positions[i][0]
        goal_x += goals[i][0]
      }

      const position = new Vector2(x, positions[i][1])
      const id = this.simulator.addAgent(position)
      this.simulator.setAgentGoal(id, goal_x, goals[i][1])

      // normalize agent's prefered velocity
      const v = RVOMath.normalize(this.simulator.getGoal(id).minus(position))
      this.simulator.setAgentPrefVelocity(id, v.x, v.y)
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

