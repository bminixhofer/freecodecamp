let getWeaponName = require('./WeaponNames.js');

module.exports.Dungeon = class Dungeon {
  	constructor() {
      let _this = this;
      this.Pickup = class Pickup {
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.name = getWeaponName();
          this.attack = Helpers.getRandom(10, 15);
        }
        getTaken(player) {
          _this.map[this.x][this.y] = 3;
          renderer.update();
          return {
            name: this.name,
            attack: this.attack
          }
        }
      };
      this.Enemy = class Enemy {
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.health = Helpers.getRandom(20, 30);
          this.attack = Helpers.getRandom(5, 10);
        }
        attackPlayer(player) {
          this.health -= player.weapon.attack;
          if(this.health <= 0) {
            _this.enemies = _this.enemies.filter(enemy => {
              return enemy.x !== this.x || enemy.y !== this.y;
            });
            _this.map[this.x][this.y] = 3;
            renderer.update();
          }
          return player.health - this.attack;
        }
      };

      this.map = null;
      this.enemyCount = 5;
      this.pickupCount = 2;
      this.mapSize = 64;
      this.enemies = [];
      this.pickups = [];
      this.rooms = [];
    }
    checkAccess() {
 			let firstTilePos = {}
      for(let i = 0; i < this.map.length; i++) {
      	for(var j = 0; j < this.map[i].length; j++) {
        	if(this.map[i][j] === 1) {
          	firstTilePos.x = j;
            firstTilePos.y = i;
            break;
          }
        }
        if(j < this.map[i].length - 1) {
        	break;
        }
      }
      this.floodFloor(firstTilePos.x, firstTilePos.y);

        for(let i = 0; i < this.map.length; i++) {
      	for(let j = 0; j < this.map[i].length; j++) {
      		if(this.map[i][j] === 1) {
          	return false;
          }
        }
      }
      return true;
    }
    floodFloor(x, y) {
      this.map[y][x] = 3;
      if(Helpers.isFloor(x + 1, y, this.map)) {
      	this.floodFloor(x + 1, y);
      }
      if(Helpers.isFloor(x - 1, y, this.map)) {
      	this.floodFloor(x - 1, y);
      }
      if(Helpers.isFloor(x, y + 1, this.map)) {
      	this.floodFloor(x, y + 1);
      }
      if(Helpers.isFloor(x, y - 1, this.map)) {
      	this.floodFloor(x, y - 1);
      }
    }
    generate() {
      this.map = [];
      for (let x = 0; x < this.mapSize; x++) {
          this.map[x] = [];
          for (let y = 0; y < this.mapSize; y++) {
              this.map[x][y] = 0;
          }
      }

      let room_count = Helpers.getRandom(10, 20);
      let min_size = 5;
      let max_size = 15;

			this.rooms = [];
      for (let i = 0; i < room_count; i++) {
          let room = {};

          room.x = Helpers.getRandom(1, this.mapSize - max_size - 1);
          room.y = Helpers.getRandom(1, this.mapSize - max_size - 1);
          room.w = Helpers.getRandom(min_size, max_size);
          room.h = Helpers.getRandom(min_size, max_size);

          if (this.doesCollide(room)) {
              i--;
              continue;
          }
          room.w--;
          room.h--;

          this.rooms.push(room);
      }

      this.squashRooms();

      for (let i = 0; i < room_count; i++) {
          let roomA = this.rooms[i];
          let roomB = this.findClosestRoom(roomA);

          let pointA = {
              x: Helpers.getRandom(roomA.x, roomA.x + roomA.w),
              y: Helpers.getRandom(roomA.y, roomA.y + roomA.h)
          };
          let pointB = {
              x: Helpers.getRandom(roomB.x, roomB.x + roomB.w),
              y: Helpers.getRandom(roomB.y, roomB.y + roomB.h)
          };

          while ((pointB.x != pointA.x) || (pointB.y != pointA.y)) {
              if (pointB.x != pointA.x) {
                  if (pointB.x > pointA.x) pointB.x--;
                  else pointB.x++;
              } else if (pointB.y != pointA.y) {
                  if (pointB.y > pointA.y) pointB.y--;
                  else pointB.y++;
              }

              this.map[pointB.x][pointB.y] = 1;
          }
      }

      for (let i = 0; i < room_count; i++) {
          let room = this.rooms[i];
          for(let x = room.x; x < room.x + room.w; x++) {
              for (let y = room.y; y < room.y + room.h; y++) {
                  this.map[x][y] = 1;
              }
          }
      }

      for (let x = 0; x < this.mapSize; x++) {
          for (let y = 0; y < this.mapSize; y++) {
              if (this.map[x][y] == 1) {
                  for (let xx = x - 1; xx <= x + 1; xx++) {
                      for (let yy = y - 1; yy <= y + 1; yy++) {
                          if (this.map[xx][yy] == 0) this.map[xx][yy] = 2;
                      }
                  }
              }
          }
      }

      if(this.checkAccess()) {
        this.addEnvironmentals();
        return this.map;
      }
      this.generate();
    }
    findClosestRoom(room) {
        let mid = {
            x: room.x + (room.w / 2),
            y: room.y + (room.h / 2)
        };
        let closest = null;
        let closest_distance = 1000;
        for (let i = 0; i < this.rooms.length; i++) {
            let check = this.rooms[i];
            if (check == room) continue;
            let check_mid = {
                x: check.x + (check.w / 2),
                y: check.y + (check.h / 2)
            };
            let distance = Math.min(Math.abs(mid.x - check_mid.x) - (room.w / 2) - (check.w / 2), Math.abs(mid.y - check_mid.y) - (room.h / 2) - (check.h / 2));
            if (distance < closest_distance) {
                closest_distance = distance;
                closest = check;
            }
        }
        return closest;
    }
    squashRooms() {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < this.rooms.length; j++) {
                let room = this.rooms[j];
                while (true) {
                    let old_position = {
                        x: room.x,
                        y: room.y
                    };
                    if (room.x > 1) room.x--;
                    if (room.y > 1) room.y--;
                    if ((room.x == 1) && (room.y == 1)) break;
                    if (this.doesCollide(room, j)) {
                        room.x = old_position.x;
                        room.y = old_position.y;
                        break;
                    }
                }
            }
        }
    }
    doesCollide(room, ignore) {
      for (let i = 0; i < this.rooms.length; i++) {
          if (i == ignore) continue;
          let check = this.rooms[i];
          if (!((room.x + room.w < check.x) || (room.x > check.x + check.w) || (room.y + room.h < check.y) || (room.y > check.y + check.h))) return true;
      }

      return false;
    }
    getRandomFreeSpace() {
      let x = Math.floor(Math.random() * this.mapSize);
      let y = Math.floor(Math.random() * this.mapSize);

      if(this.map[x][y] !== 3) {
        return this.getRandomFreeSpace();
      }
      return [x, y];
    }
    addEnvironmentals() {
      for(let i = 0; i < this.enemyCount; i++) {
        let [x, y] = this.getRandomFreeSpace();
        this.map[x][y] = 4;
        this.enemies.push(new this.Enemy(x, y));
      }
      for(let i = 0; i < this.pickupCount; i++) {
        let [x, y] = this.getRandomFreeSpace();
        this.map[x][y] = 5;
        this.pickups.push(new this.Pickup(x, y));
      }
    }
}

let renderer = {
    canvas: null,
    ctx: null,
    scale: 0,
    initialize: function(dungeon, canvasNode) {
        this.canvas = canvasNode;
        this.dungeon = dungeon;
        this.ctx = this.canvas.getContext('2d');
    },
    update: function() {
        if(!this.canvas) return;
        this.scale = Math.ceil(this.canvas.height / this.dungeon.mapSize);
        for (let y = 0; y < this.dungeon.mapSize; y++) {
            for (let x = 0; x < this.dungeon.mapSize; x++) {
                let tile = this.dungeon.map[x][y];
                switch (tile) {
                  case 0: this.ctx.fillStyle = '#606084'; break;
                  case 2: this.ctx.fillStyle = '#46466C'; break;
                  case 3: this.ctx.fillStyle = 'white'; break;
                  case 4: this.ctx.fillStyle = '#D1130E'; break;
                  case 5: this.ctx.fillStyle = '#EEB033'; break;
                }
                this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
            }
        }
    }
};

let Helpers = {
    getRandom: function (low, high) {
        return~~ (Math.random() * (high - low)) + low;
    },
    isFloor: function(x, y, map) {
      if(map[y] ? !isNaN(map[y][x]) : false) {
      	if(map[y][x] === 1) {
        	return true;
        }
      }
      return false;
    }
};

module.exports.renderer = renderer;
