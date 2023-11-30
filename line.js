class Line{

    constructor(x,y) {
        this.x0 = start.x;
        this.y0 = start.y;
        this.x1 = end.x;
        this.y1 = end.y; // プロパティの定義
        
  
        //アニメーションの定義。
        this.selectAnimate = gsap.to(this.states, {
          duration: 0.4,
          // delay:'random(0,0.4)',
          scale:'random(0.8,1.2)',
          repeat: 1,
          paused:true,//自動再生しない
          yoyo:true,
          ease: "power3.out",
        });
      }
    
}