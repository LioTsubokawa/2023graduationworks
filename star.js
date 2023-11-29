class MyCircle {

    // コンストラクタ
    constructor() {
      this.x = 0; // プロパティの定義
    }
  
    // メソッドの定義
    update() {
      this.x += 5;
      if (this.x >= width) {
        this.x = 0;
      }
    }
  
    // メソッドの定義（クラスの外に同名の関数等があっても OK）
    draw() {
      circle(this.x, height / 2, 50);
    }
  }