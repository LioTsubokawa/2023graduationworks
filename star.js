class Star {

    // コンストラクタ
    constructor(x,y,img) {
      this.x = x;
      this.y = y;
      this.img = img; // プロパティの定義
      //アニメーション用のプロパティ
      this.states = {
        // alpha:0,
        scale:1,
      };

      //アニメーションの定義。
      this.selectAnimate = gsap.to(this.states, {
        duration: 0.4,
        // delay:'random(0,0.4)',
        scale:'random(0.8,1.2)',
        repeat: 1,
        paused:true,//自動再生しない
        yoyo:true,
      });
    }

    select(){
        this.selectAnimate.play();
    }
  
    // メソッドの定義
    update() {
    }
  
    // メソッドの定義（クラスの外に同名の関数等があっても OK）
    draw() {
        const width = this.img.width * 0.14
        const height = this.img.height * 0.14

        push();
        // tint(255,this.states.alpha);
        imageMode(CENTER);
        image(
            this.img,
            this.x, 
            this.y, 
            width *this.states.scale,
            height *this.states.scale,
        );
        pop();
    }
}