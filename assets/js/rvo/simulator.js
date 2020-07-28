import { Agent, KdTree, RVOMath, Vector2 } from './'

export default class Simulator {

  constructor(){
    this.agents = [] // Agent[]
    this.obstacles = [] // Obstacle[]
    this.goals = [] // Vector2
    this.kdTree = new KdTree()
    this.kdTree.simulator = this
    this.timeStep = 0.25
    this.defaultAgent // Agent
    this.time = 0.0
  }

  getAgentOrcaLines (i){ return this.agents[i].orcaLines }
  getAgentPosition (i){ return this.agents[i].position }
  getAgentPrefVelocity (i){ return this.agents[i].prefVelocity }
  getAgentRadius (i){ return this.agents[i].radius }
  getAgentVelocity (i){ return this.agents[i].velocity }
  getGlobalTime () { return this.time }
  getNumAgents () { return this.agents.length }
  getTimeStep () { return this.timeStep }

  setAgentPrefVelocity (i, vx, vy) { this.agents[i].prefVelocity = new Vector2(vx, vy) }
  setAgentPosition (i, x, y) { this.agents[i].position = new Vector2(x, y) }
  setAgentGoal (i, x, y) { this.goals[i] = new Vector2(x, y) }
  setTimeStep (timeStep) { this.timeStep = timeStep }

  addAgent (position) {

    if (!this.defaultAgent) throw new Error("no default agent")
    if (!position) position = new Vector2(0, 0)

    var agent = new Agent()

    agent.position = position
    agent.maxNeighbors = this.defaultAgent.maxNeighbors
    agent.maxSpeed = this.defaultAgent.maxSpeed
    agent.neighborDist = this.defaultAgent.neighborDist
    agent.radius = this.defaultAgent.radius
    agent.timeHorizon = this.defaultAgent.timeHorizon
    agent.timeHorizonObst = this.defaultAgent.timeHorizonObst
    agent.velocity = this.defaultAgent.velocity
    agent.simulator = this
    agent.id = this.agents.length

    this.agents.push(agent)
    this.goals.push(position)

    return this.agents.length - 1
  }

  //  /** float */ neighborDist, /** int */ maxNeighbors, /** float */ timeHorizon, /** float */ timeHorizonObst, /** float */ radius, /** float*/ maxSpeed, /** Vector2 */ velocity)
  setAgentDefaults (neighborDist, maxNeighbors, timeHorizon, timeHorizonObst, radius, maxSpeed, velocityX, velocityY) {

    if (!this.defaultAgent) this.defaultAgent = new Agent()

    this.defaultAgent.maxNeighbors = maxNeighbors
    this.defaultAgent.maxSpeed = maxSpeed
    this.defaultAgent.neighborDist = neighborDist
    this.defaultAgent.radius = radius
    this.defaultAgent.timeHorizon = timeHorizon
    this.defaultAgent.timeHorizonObst = timeHorizonObst
    this.defaultAgent.velocity = new Vector2(velocityX, velocityY)
    this.defaultAgent.simulator = this
  }

  run () {
    this.kdTree.buildAgentTree()

    for (var i = 0; i < this.getNumAgents(); i++) {
      this.agents[i].computeNeighbors()
      this.agents[i].computeNewVelocity()
      this.agents[i].update()
    }

    this.time += this.timeStep
  }

  reachedGoal () {
    for (var i = 0; i < this.getNumAgents(); ++i) {
      if (RVOMath.absSq(this.goals[i].minus(this.getAgentPosition(i))) > RVOMath.RVO_EPSILON) {
        return false
      }
    }
    return true
  }

  addGoals (goals) { this.goals = goals }

  getGoal (goalNo) {  return this.goals[goalNo] }

  addObstacle ( /** IList<Vector2> */ vertices) {

    if (vertices.length < 2) return -1

    var obstacleNo = this.obstacles.length

    for (var i = 0; i < vertices.length; ++i) {
      var obstacle = new Obstacle()
      obstacle.point = vertices[i]
      if (i != 0) {
        obstacle.prevObstacle = this.obstacles[this.obstacles.length - 1]
        obstacle.prevObstacle.nextObstacle = obstacle
      }
      if (i == vertices.length - 1) {
        obstacle.nextObstacle = this.obstacles[obstacleNo]
        obstacle.nextObstacle.prevObstacle = obstacle
      }
      obstacle.unitDir = RVOMath.normalize(vertices[(i == vertices.length - 1 ? 0 : i + 1)].minus(vertices[i]))

      if (vertices.length == 2) obstacle.isConvex = true
      else {
        obstacle.isConvex = (RVOMath.leftOf(vertices[(i == 0 ? vertices.length - 1 : i - 1)], vertices[i], vertices[(i == vertices.length - 1 ? 0 : i + 1)]) >= 0)
      }

      obstacle.id = this.obstacles.length

      this.obstacles.push(obstacle)
    }

    return obstacleNo
  }

  processObstacles () { return this.kdTree.buildObstacleTree() }

  queryVisibility (p1, p2, radius) { return this.kdTree.queryVisibility(p1, p2, radius) }

  getObstacles () { return this.obstacles }
}
