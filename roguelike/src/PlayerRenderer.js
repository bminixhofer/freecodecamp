module.exports = {
  canvas: null,
  ctx: null,
  scale: 0,
  mapSize: 0,
  vision: 6,
  initialize: function(canvasNode, mapSize) {
    this.canvas = canvasNode;
    this.mapSize = mapSize;
    this.ctx = this.canvas.getContext('2d');
    this.scale = Math.ceil(this.canvas.height / mapSize);
  },
  update(x, y) {
    if(!this.canvas) return;
    this.ctx.fillStyle = 'black';
    for (var i = 0; i < this.mapSize; i++) {
      for (var j = 0; j < this.mapSize; j++) {
        var distance = Math.max(Math.abs(i - x),  Math.abs(j - y));
        if (distance > this.vision) {
          this.ctx.fillStyle = 'black';
          this.ctx.fillRect(i * this.scale, j * this.scale, this.scale, this.scale);
        } else {
          this.ctx.clearRect(i * this.scale, j * this.scale, this.scale, this.scale);
          this.ctx.fillStyle = `rgba(0, 0, 0, ${(distance / this.vision) + 0.2})`;
          this.ctx.fillRect(i * this.scale, j * this.scale, this.scale, this.scale);
        }
      }
    }
    this.ctx.fillStyle = '#0BA70B';
    this.ctx.fillRect(x * this.scale, y * this.scale, this.scale, this.scale);
  }
}
