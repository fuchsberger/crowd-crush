const RVO = require('rvo-js/index.js')
const Simulator = RVO.Simulator
const RVOMath = RVO.RVOMath
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
    let data = this.el.dataset
    let loaded = false
    let aspectratio = JSON.parse(data.aspectratio)

    const player = new Player(data.video)

    player.player.on('playing', () => {
      if (!loaded) {
        this.pushEvent('set_duration', { duration: this.player.duration })
        this.pushEvent("control", { action: "stop" })
        loaded = true
      } else {
        this.pushEvent("control", { action: "playing" })
      }
    })

    Object.assign(this, { aspectratio, canvas, context, data, player })

    this.draw_agents()
  },

  updated() {

    const { animationFrameRequest, aspectratio, canvas, data, interval, player, simulator } = this

    // request an animation frame only when necessary, delete previous frame if in existance.
    if (animationFrameRequest) cancelAnimationFrame(animationFrameRequest)

    this.animationFrameRequest = requestAnimationFrame(() => {

      // should be done once in mount but for some reason properties don't persist there
      resize(aspectratio, canvas)

      // depending on mode draw either agents or synthetic agents
      if (data.mode == 'annotate') this.draw_agents()
      else if(simulator) this.draw_synth_agents()

      switch (this.el.dataset.action) {

        case 'play':
          if (data.mode == 'annotate') player.play()
          else this.pushEvent("control", { action: "playing" })
          break

        case 'pause':
          if (data.mode == 'annotate') player.pause()
          else if (interval) clearInterval(interval)

          this.pushEvent("ping", { action: "paused", time: player.time })
          break

        case 'stop':
          if (data.mode == 'annotate') {
            if (player.time != 0) {
              player.stop()
              this.pushEvent("ping", { action: "paused", time: 0 })
            }
          } else {
            if (interval) clearInterval(interval)
            if(data.mode == 'sim') this.pushEvent("ping", { action: "prepare_sim", time: 0 })
          }
          break

        case 'backward':
          player.backward();
          this.pushEvent("ping", { action: "paused", time: time - 1 })
          break

        case 'forward':
          player.forward();
          this.pushEvent("ping", { action: "paused", time: time + 1 })
          break

        case 'playing':
          this.pushEvent("ping", { action: "playing", time: player.time })
          break

        case 'prepare_sim':
          const simulator = new RVO.Simulator()

          simulator.setTimeStep(0.25)

          simulator.setAgentDefaults(
            300, // neighbor distance (min = radius * radius)
            30, // max neighbors
            600, // time horizon
            600, // time horizon obstacles
            15, // agent radius
            30, // max speed
            5, // default velocity for x
            5, // default velocity for y
          )

          // add agents to simulation
          const agents = JSON.parse(this.data.agents)
          const goals = JSON.parse(this.data.agentGoals)
          const w = canvas.width
          const h = canvas.height

          for (let i = 0; i < agents.length; i++) {
            const id = agents[i][0]
            simulator.addAgent()
            simulator.setAgentPosition(i, agents[i][1] * w, agents[i][2] * h)
            simulator.setAgentGoal(i, goals[id][0] * w, goals[id][1] * h)
          }

          const top = new RVO.Vector2(0.3 * w, 0)
          const top2 = new RVO.Vector2(0.32 * w, 0)
          const bot = new RVO.Vector2(0.3 * w, h)
          const bot2 = new RVO.Vector2(0.32 * w, h)

          // console.log(top)
          const vertices = [top, top2, bot2, bot]
          simulator.addObstacle(vertices)
          simulator.processObstacles()

          this.simulator = simulator

          this.pushEvent("ping", { action: "pause", time: 0 })
          break
      }
    })
  },

  draw_agents() {
    let { canvas, context, data } = this

    const agents = JSON.parse(data.agents)
    const selected = JSON.parse(data.selected)
    const show_overlay = JSON.parse(data.showOverlay)

    // background
    if (show_overlay) {
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    for (let i = 0; i < agents.length; i++) {
      if (show_overlay) context.fillStyle = "black";
      else context.fillStyle = selected == agents[i][0] ? COLORS.CYAN : COLORS.GREEN

      context.beginPath()
      context.arc(
        canvas.width * agents[i][1],
        canvas.height * agents[i][2],
        5,  // radius
        0,
        2 * Math.PI
      )
      context.fill()
    }
  },

  draw_synth_agents() {

    const { canvas, context, simulator } = this
    const w = canvas.width

    context.fillStyle = "white";
    context.fillRect(0, 0, w, canvas.height);

    context.fillStyle = "gray";
    context.fillRect(0.3 * w, 0, 0.02 * w, canvas.height);

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

      if (RVOMath.absSq(simulator.getGoal(i).minus(simulator.getAgentPosition(i))) < RVOMath.RVO_EPSILON) {
        // Agent is within one radius of its goal, set preferred velocity to zero
        simulator.setAgentPrefVelocity(i, 0.0, 0.0)

      } else {
        // Agent is far away from its goal
        // set preferred velocity as unit vector towards agent's goal.
        let v = RVOMath.normalize(simulator.getGoal(i).minus(simulator.getAgentPosition(i)))
        simulator.setAgentPrefVelocity(i, v.x, v.y)
      }
    }

    simulator.run()

    if (simulator.reachedGoal()) {
      clearInterval(this.interval)
      console.log('finish')
    }
  }
}

