let canvas;
let ctx;
let FlowField;
let FlowFieldAnimation;
window.onload = function() {
  canvas = document.getElementById('canvas1');
  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  FlowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
  FlowField.animate(0);
}

window.addEventListener('resize', function(){
    cancelAnimationFrame(FlowFieldAnimation);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    FlowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
    FlowField.animate(0);




});

const mouse = {

x: 0,
y: 0,
}
window.addEventListener('mousemove', function(e) {

    mouse.x = e.x;
    mouse.y = e.y;

})
class FlowFieldEffect {
#ctx;
#width;
#height;
constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#ctx.lineWidth = 1;
    this.#width = width;
    this.#height = height;
    this.lastTime = 0;
    this.interval = 1000/60;
    this.timer =0;
    this.cellSize = 20;
    this.greadient;
    this.#createGradient();
    this.#ctx.strokeStyle = this.greadient;
    this.size = 2;
    this.vr = 0.02;

} 

#createGradient(){
 this.greadient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
 this.greadient.addColorStop("0.99", "#0B0A09");
 this.greadient.addColorStop("0.75", "#0B0A09");
 this.greadient.addColorStop("0.85", "#0B0A09");
 this.greadient.addColorStop("0.40", "#E2DDD9");
 





}

#drawLine(angle, x, y) {
    const length = 50;
    this.#ctx.beginPath();
    this.#ctx.moveTo(x, y);
    this.#ctx.lineTo(x + Math.cos(angle) * 7 , y + Math.sin (angle) * 200);
    this.#ctx.stroke();




}
animate(timeStamp) {
    const deltaTime = timeStamp - this.lastTime;
    this.lastTime = timeStamp;
    if(this.timer > this.interval) {
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
        this.size += this.vr;
        if(this.size > 5 || this.size < -5) this.vr * -1; 

        for(let y = 0; y < this.#height; y += this.cellSize) {
            for(let x = 0; x < this.#width; x += this.cellSize) {
                const angle = (Math.cos(x * 0.02) + Math.sin(y * 0.02) * this.size);
                this.#drawLine(angle, x, y);

                }
            }
      
        this.timer = 0;
    } else { 
        this.timer += deltaTime;}
   
    FlowFieldAnimation=requestAnimationFrame(this.animate.bind (this));



}
}