import 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.facingLeft = false;

    // << INITIALIZE PLAYER ATTRIBUTES HERE >>
    this.scene = scene
    this.scene.physics.world.enable(this)
    this.scene.add.existing(this)
  }

  // Check which controller button is being pushed and execute movement & animation
  update(cursors, jumpSound) {
    // << INSERT CODE HERE >>
    this.updateMovement(cursors)
    this.updateJump(cursors, jumpSound)
    this.updateInAir()
  }

  updateJump(cursors, jumpSound){
    if(cursors.up.isDown && this.body.touching.down){
      this.setVelocityY(-800)
      jumpSound.play()
    }
  }

  updateInAir(){
    if(!this.body.touching.down){
      this.play('jump')
    }
  }

  updateMovement(cursors){
    if(cursors.left.isDown){
      if (!this.facingLeft){
        this.flipX = !this.flipX;
        this.facingLeft=true
      }
      this.setVelocityX(-360)
      if (this.body.touching.down){
        this.play('run', true)
      }
    }
    else if (cursors.right.isDown){
      if (this.facingLeft){
        this.flipX = !this.flipX
        this.facingLeft = false
      }
      this.setVelocityX(360)
      if(this.body.touching.down){
        this.play('run',true)
      }
    }
    else {
      this.setVelocityX(0)
      if (this.armed){
        this.play('idleArmed')
      }else this.play('idleUnarmed')
    }
  }

}
