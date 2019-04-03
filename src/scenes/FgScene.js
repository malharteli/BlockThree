import Player from "../entity/Player";
import Ground from "../entity/Ground";
import Enemy from "../entity/Enemy";
import Gun from "../entity/Gun";
import Laser from "../entity/Laser";

export default class FgScene extends Phaser.Scene {
  constructor() {
    super("FgScene");
    this.collectGun = this.collectGun.bind(this);
    this.fireLaser = this.fireLaser.bind(this);
    this.hit = this.hit.bind(this);
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITES HERE >>
    this.load.spritesheet("josh", "assets/spriteSheets/josh.png", {
      frameWidth: 340,
      frameHeight: 460
    });
    this.load.spritesheet("brandon", "assets/sprites/brandon.png", {
      frameWidth: 340,
      frameHeight: 460
    });
    this.load.image("ground", "assets/sprites/ground.png");
    this.load.image("gun", "assets/sprites/gun.png");
    this.load.image("laserBolt", "assets/sprites/laserBolt.png");
    // Preload Sounds
    // << LOAD SOUNDS HERE >>
    this.load.audio('jump', 'assets/audio/jump.wav')
    this.load.audio('laser', 'assets/audio/laser.wav')
  }

  create() {
    // Create game entities
    // << CREATE GAME ENTITIES HERE >>
    this.player = new Player(this, 20, 400, "josh").setScale(0.25);
    this.enemy = new Enemy(this, 600, 400, "brandon").setScale(0.25);
    this.gun = new Gun(this, 300, 400, "gun").setScale(0.25);
    this.createAnimations();
    // Create sounds

    // << CREATE SOUNDS HERE >>

    // Create collisions for all entities
    // << CREATE COLLISIONS HERE >>
    this.groundGroup = this.physics.add.staticGroup({ classType: Ground });
    this.lasers = this.physics.add.group({
      classType: Laser,
      runChildUpdate: true,
      allowGravity: false,
      maxSize: 10
    });
    this.physics.add.collider(this.player, this.groundGroup);
    this.physics.add.collider(this.enemy, this.groundGroup);
    this.physics.add.collider(this.gun, this.groundGroup);
    this.physics.add.collider(this.player, this.enemy);
    this.createGround(160, 540);
    this.createGround(600, 540);
    this.physics.add.overlap(
      this.player,
      this.gun,
      this.collectGun,
      null,
      this
    );
    this.physics.add.overlap(this.lasers, this.enemy, this.hit, null, this);

    this.jumpSound = this.sound.add('jump')
    this.laserSound = this.sound.add('laser')
    this.laserSound.volume = 0.5

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  collectGun(player, gun) {
    gun.disableBody(true, true);
    this.player.armed = true;
  }

  createGround(x, y) {
    this.groundGroup.create(x, y, "ground");
  }

  createAnimations() {
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("josh", { start: 17, end: 20 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "jump",
      frames: [{ key: "josh", frame: 17 }],
      frameRate: 20
    });
    this.anims.create({
      key: "idleUnarmed",
      frames: [{ key: "josh", frame: 11 }],
      frameRate: 10
    });
    this.anims.create({
      key: "idleArmed",
      frames: [{ key: "josh", frame: 6 }],
      frameRate: 10
    });
    this.anims.create({
      key: "idleArmed",
      frames: [{ key: "josh", frame: 6 }],
      frameRate: 10
    });
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
    this.player.update(this.cursors, this.jumpSound);

    this.gun.update(time, this.player, this.cursors, this.fireLaser, this.laserSound);
  }

  fireLaser(x, y, left) {
    const offsetX = 56;
    const offsetY = 14;
    const laserX =
      this.player.x + (this.player.facingLeft ? -offsetX : offsetX);
    const laserY = this.player.y + offsetY;

    let laser = this.lasers.getFirstDead()
    if (!laser) {
      const laser = new Laser(
        this,
        laserX,
        laserY,
        "laserBolt",
        this.player.facingLeft
      ).setScale(0.25);
      this.lasers.add(laser);
    }

    laser.reset(laserX, laserY, this.player.facingLeft)
  }

  hit(enemy, laser) {
    laser.setActive(false);
    laser.setVisible(false);
  }
}
