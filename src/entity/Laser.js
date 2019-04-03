import 'phaser'

export default class Laser extends Phaser.Physics.Arcade.Sprite{
  constructor(scene, x, y, spriteKey, facingLeft){
    super(scene, x, y, spriteKey, facingLeft)
    this.scene = scene
    this.scene.physics.world.enable(this)
    this.scene.add.existing(this)
    this.facingLeft = facingLeft
    this.speed = Phaser.Math.GetSpeed(800, 1)
    this.lifespan = 900
    this.body.setAllowGravity(false)
    this.reset(x, y, facingLeft)
  }

  update(time, delta){
    this.lifespan -= delta
    const moveDistance = this.speed * delta
    if (this.facingLeft){
      this.x -= moveDistance
    } else {
      this.x += moveDistance
    }

    if (this.lifespan <= 0){
      this.setActive(false)
      this.setVisible(false)
    }
  }

  reset(x, y, facingLeft){
    this.setActive(true)
    this.setVisible(true)
    this.lifespan = 900
    this.facingLeft = facingLeft
    this.setPosition(x, y)
  }
}
