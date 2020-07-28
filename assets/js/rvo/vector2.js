export default class Vector2 {

  constructor(x, y){
    this.x = x
    this.y = y
  }

  plus (vector) { return new Vector2(this.x + vector.x, this.y + vector.y) }
  minus (vector) { return new Vector2(this.x - vector.x, this.y - vector.y) }
  multiply (vector) { return new Vector2(this.x * vector.x, this.y * vector.y) }
  scale (k) { return new Vector2(this.x * k, this.y * k) }
}
