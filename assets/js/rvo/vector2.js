export default function Vector2(x, y) {
  this.x = x
  this.y = y

  // added this
  this.distance = vector => {
    let diff = this.minus(vector)
    return Math.sqrt(diff.x * diff.x + diff.y * diff.y)
  }

  this.plus     = vector => new Vector2(x + vector.x, y + vector.y)
  this.minus    = vector => new Vector2(x - vector.x, y - vector.y)
  this.multiply = vector => x * vector.x + y * vector.y
  this.scale    = k => new Vector2(x * k, y * k)
}
