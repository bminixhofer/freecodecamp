module.exports.Dungeon = class Dungeon {
  	constructor() {
      this.map = null;
      this.mapSize = 64;
      this.rooms = [];
    }
    checkAccess() {
 			var firstTilePos = {}
      for(var i = 0; i < this.map.length; i++) {
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

      for(var i = 0; i < this.map.length; i++) {
      	for(var j = 0; j < this.map[i].length; j++) {
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
      for (var x = 0; x < this.mapSize; x++) {
          this.map[x] = [];
          for (var y = 0; y < this.mapSize; y++) {
              this.map[x][y] = 0;
          }
      }

      var room_count = Helpers.getRandom(10, 20);
      var min_size = 5;
      var max_size = 15;

			this.rooms = [];
      for (var i = 0; i < room_count; i++) {
          var room = {};

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

      for (i = 0; i < room_count; i++) {
          var roomA = this.rooms[i];
          var roomB = this.findClosestRoom(roomA);

          var pointA = {
              x: Helpers.getRandom(roomA.x, roomA.x + roomA.w),
              y: Helpers.getRandom(roomA.y, roomA.y + roomA.h)
          };
          var pointB = {
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

      for (i = 0; i < room_count; i++) {
          var room = this.rooms[i];
          for(var x = room.x; x < room.x + room.w; x++) {
              for (var y = room.y; y < room.y + room.h; y++) {
                  this.map[x][y] = 1;
              }
          }
      }

      for (var x = 0; x < this.mapSize; x++) {
          for (var y = 0; y < this.mapSize; y++) {
              if (this.map[x][y] == 1) {
                  for (var xx = x - 1; xx <= x + 1; xx++) {
                      for (var yy = y - 1; yy <= y + 1; yy++) {
                          if (this.map[xx][yy] == 0) this.map[xx][yy] = 2;
                      }
                  }
              }
          }
      }

      if(this.checkAccess()) {
      	return this.map;
      }
      this.generate();
    }
    findClosestRoom(room) {
        var mid = {
            x: room.x + (room.w / 2),
            y: room.y + (room.h / 2)
        };
        var closest = null;
        var closest_distance = 1000;
        for (var i = 0; i < this.rooms.length; i++) {
            var check = this.rooms[i];
            if (check == room) continue;
            var check_mid = {
                x: check.x + (check.w / 2),
                y: check.y + (check.h / 2)
            };
            var distance = Math.min(Math.abs(mid.x - check_mid.x) - (room.w / 2) - (check.w / 2), Math.abs(mid.y - check_mid.y) - (room.h / 2) - (check.h / 2));
            if (distance < closest_distance) {
                closest_distance = distance;
                closest = check;
            }
        }
        return closest;
    }
    squashRooms() {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < this.rooms.length; j++) {
                var room = this.rooms[j];
                while (true) {
                    var old_position = {
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
        for (var i = 0; i < this.rooms.length; i++) {
            if (i == ignore) continue;
            var check = this.rooms[i];
            if (!((room.x + room.w < check.x) || (room.x > check.x + check.w) || (room.y + room.h < check.y) || (room.y > check.y + check.h))) return true;
        }

        return false;
    }
}

module.exports.renderer = {
    canvas: null,
    ctx: null,
    scale: 0,
    initialize: function (dungeon, canvasNode) {
        this.canvas = canvasNode;
        this.dungeon = dungeon;
        this.ctx = this.canvas.getContext('2d');
    },
    update: function () {
        if(!this.canvas) return;
        this.scale = Math.ceil(this.canvas.height / this.dungeon.mapSize);
        for (var y = 0; y < this.dungeon.mapSize; y++) {
            for (var x = 0; x < this.dungeon.mapSize; x++) {
                var tile = this.dungeon.map[x][y];
                if (tile == 0) this.ctx.fillStyle = '#351330';
                else if (tile == 1) this.ctx.fillStyle = '#64908A';
                else if(tile === 2) this.ctx.fillStyle = '#424254';
                else this.ctx.fillStyle = 'red';
                this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
            }
        }
    }
};

var Helpers = {
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
