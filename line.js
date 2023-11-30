class Line{

    constructor(x0,y0,x1,y1) {
        this.states = {
            x0,
            y0,
            x1,
            y1, 
        };
        
        
  
        //アニメーションの定義。
        this.animate = gsap.from(
            this.states,
            {
                duration: 0.4,
                x1: x0,
                y1: y0,
                ease: "power3.out",
            }
        );
    }

    draw (){
        push();
        stroke(233, 232, 65);
        strokeWeight(4);
        line(this.states.x0, this.states.y0, this.states.x1,this.states.y1);
        pop();
    }
    
}