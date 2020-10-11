import { Simulator, RVOMath, Vector2 } from '../rvo'
import Player from '../components/player'

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

    this.player = new Player(this.video.youtubeID, (event, data) => this.pushEvent(event, data))
    if (this.mode == "comparison" || this.mode == 'sim') this.prepareSimulation()

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
    const old_mode = this.mode

    // if mode changes reload all data, otherwise only positions
    this.get_data()

    if ((this.mode != old_mode || this.player.time == 0) && (this.mode == "comparison" || this.mode == 'sim')) {
      this.prepareSimulation()
      this.render_canvas()
    }

    this.render_canvas()
  },

  get_data() {
    const d = this.el.dataset
    if (!this.player || this.player.time == 0) {
      this.agents = JSON.parse(d.agents)
      this.globalGoals = []
    }
    this.gridSize = JSON.parse(d.gridSize)
    this.gridVectors = JSON.parse(d.gridVectors)
    this.flipped = JSON.parse(d.flipped)
    this.mode = d.mode
    this.showGrid = JSON.parse(d.showGrid)
    this.showGoals = JSON.parse(d.showGoals)
    this.selected = JSON.parse(d.selected)
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
    }
    else context.clearRect(0, 0, canvas.width, canvas.height)


    if(this.showGrid) this.draw_grid()

    // draw correct elements
    switch (mode) {
      case 'obstacles':
        this.draw_obstacles();
        break

      case 'markers':
        this.draw_agents();
        break

      case 'sim':
        this.draw_synth_agents()
        break

      case 'comparison':
        this.draw_agents()
        this.draw_synth_agents()
    }

    // draw border and center line
    context.strokeStyle = 'black'
    context.lineWidth = 1;
    context.beginPath()
    context.moveTo(0, 0)
    context.lineTo(canvas.width, 0)
    context.lineTo(canvas.width, canvas.height)
    context.lineTo(0, canvas.height)
    context.lineTo(0, 0)
    if (mode == 'comparison') {
      context.moveTo(canvas.width / 2, 0)
      context.lineTo(canvas.width / 2, canvas.height)
    }
    context.stroke()
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

  draw_grid() {
    this.context.lineWidth = 0.5;
    this.context.strokeStyle = COLORS.GREEN
    // this.context.beginPath()

    // // draw horizontal lines
    // for (let y = 0; y < this.gridVectors.length; y++) {
    //   this.context.moveTo(0, y * this.gridSize)
    //   this.context.lineTo(this.canvas.width, y * this.gridSize)
    // }

    // // draw vertical lines
    // for (let x = 0; x < this.gridVectors[0].length; x++) {
    //   this.context.moveTo(x * this.gridSize, 0)
    //   this.context.lineTo(x * this.gridSize, this.canvas.width)
    // }
    // this.context.stroke()

    // draw avg vectors
    this.context.lineWidth = 1
    this.context.beginPath()
    for (let y = 0; y < this.gridVectors.length; y ++) {
      for (let x = 0; x < this.gridVectors[0].length; x ++) {
        let centerX = x * this.gridSize + this.gridSize / 2
        let centerY = y * this.gridSize + this.gridSize / 2

        if (this.gridVectors[y][x][0] != 0 && this.gridVectors[y][x][1] != 0) {
          this.drawArrow(
            centerX, centerY,
            centerX + this.gridVectors[y][x][0] * 5, centerY + this.gridVectors[y][x][1] * 5
          )

          // draw arrows for comparison view
          if (this.mode == "comparison") this.drawArrow(
            canvas.width / 2 + centerX,
            centerY,
            canvas.width / 2 + centerX + this.gridVectors[y][x][0] * 5,
            centerY + this.gridVectors[y][x][1] * 5
          )
        }
      }
    }
    this.context.stroke()
  },

  drawArrow(fromx, fromy, tox, toy) {
    let context = this.context
    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
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

    const {agents, context, mode, player, simulator, showGoals} = this

    const time = player.time
    const lastTime = simulator.getGlobalTime()

    let time_step = time - lastTime
    simulator.setTimeStep(time_step)

    context.fillStyle = mode == 'comparison' ? 'black' : COLORS.GREEN
    context.lineWidth = 0.5;

    time_step *= 1000

    // add new agents
    for (let i = 0; i < agents.length; i++){
      if (agents[i].time <= time) {
        const id = simulator.addAgent(new Vector2(agents[i].x, agents[i].y))
        simulator.setAgentGoal(id, agents[i].goal_x, agents[i].goal_y)
        // this.globalGoals.push([agents[i].goal_x, agents[i].goal_y])

        agents.splice(i, 1)
        i--
      }
    }

    for (let i = 0; i < simulator.getNumAgents(); i++){

      // draw agent
      const position = simulator.getAgentPosition(i)

      // ignore agents that are done and left canvas
      if (position.x == -666 && position.y == -666) continue;

      context.beginPath()
      context.arc(position.x, position.y, 5, 0, 2 * Math.PI )
      context.fill()

      // update agent goal
      this.update_agent_vector(i, time_step)
    }

    if(showGoals){
      context.strokeStyle = COLORS.PURPLE
      context.lineWidth = 1;
      context.beginPath()
      for(let i = 0; i < simulator.getNumAgents(); i++){
        const position = simulator.getAgentPosition(i)
        const goal = simulator.getGoal(i)

        context.moveTo(position.x, position.y)
        context.lineTo(goal.x, goal.y)
      }
      context.stroke()
    }

    // run at the end to allow goals of new agents to be set.
    simulator.run()
  },

  update_agent_vector(id, time_step) {
    // get agent position and goal
    const position = this.simulator.getAgentPosition(id)
    const goal = this.simulator.getGoal(id)

    // let globalX = this.globalGoals[id][0]
    // let globalY = this.globalGoals[id][1]

    // get local vector
    const c = this.mode == "comparison"
    const x =  c ? parseInt((position.x - this.canvas.width/2) / this.gridSize) : parseInt(position.x / this.gridSize)
    const y = parseInt(position.y / this.gridSize)

    let local_goal = new Vector2(position.x, position.y)

    if (x >= 0 && x < this.gridVectors[0].length && y >= 0 && y < this.gridVectors.length) {
      local_goal = local_goal.plus(new Vector2(this.gridVectors[y][x][0], this.gridVectors[y][x][1]))
    }

    // agent has reached destination
    // const goal = new Vector2(globalX, globalY)
    if (RVOMath.absSq(goal.minus(position)) < 8) {

      // if inside frame, simply stop (stand there)
      this.simulator.setAgentPrefVelocity(id, 0, 0)

      // if agent at the border, teleport away
      const x_low = this.mode == "comparison" ? this.canvas.width / 2 : 0
      if (position.x <= x_low + 15 || position.x >= this.canvas.width - 15 || position.y <= 15 || position.y >= this.canvas.height - 15) {

        this.simulator.setAgentPosition(id, -666, -666)
        this.simulator.setAgentGoal(id, -666, -666)
        this.simulator.setAgentPrefVelocity(id, 0, 0)
        return
      }
    } else {


      if (position.distance(goal) < position.distance(local_goal)) {
        // if global goal is close than use global
        local_goal = goal
      } else if (position.distance(local_goal) > 10) {
        // if there is a strong local drag exclusively use local
        local_goal = local_goal
      } else if (position.distance(local_goal) == 0) {
        // if there is no local goal stand idle
        local_goal = local_goal
      } else {
        // combine local and global goal
        let scalefactor = position.distance(local_goal) / position.distance(goal)

        if (scalefactor >= 1) local_goal = goal
        else local_goal = goal.scale(scalefactor).plus(local_goal.scale(1-scalefactor))
      }

      // normalize agent's prefered velocity
      const v = RVOMath.normalize(local_goal.minus(position))
      this.simulator.setAgentPrefVelocity(id, v.x * time_step, v.y * time_step)
    }
  },

  prepareSimulation() {
    const { canvas, el, avg_velocity, video } = this

    this.simulator = new Simulator()

    const data = el.dataset
    const minDist = JSON.parse(data.minDistance) * Math.min(VIDEO_X, VIDEO_Y)

    let c = this.mode == 'comparison'
    this.simulator.setAgentDefaults(
      100,  // maxNeighbors
      avg_velocity * 1.2, // maxSpeed
      c ? minDist * 10 : minDist * 20, // neighborDist
      c ? minDist : minDist * 2, // radius
      3000, // time horizon
      3000, // time horizon obstacles
      avg_velocity, // velocityX
      avg_velocity, // velocityY
    )

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

