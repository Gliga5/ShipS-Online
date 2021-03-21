class Player {
    constructor(color,x=0,y=0,id=null) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
        this.r = 25;
        this.trails = [];
    }
    init() {
        for (let i = 0; i < 7; i++) {
            this.trails.push({x: this.x, y: this.y});
        }
    }
    display(x=this.x,y=this.y) {
        push();

        this.x = x;
        this.y = y;

        if (this.x > width) this.x = width;
        else if (this.x < 0) this.x = 0;
        if (this.y > height) this.y = height;
        else if (this.y < 0) this.y = 0;

        this.trails.splice(0,0,{x: this.x, y: this.y})
        if (this.trails.length >= 9) this.trails.pop();

        for (const trail of this.trails) {
            fill(this.color.r, this.color.g, this.color.b, 60);
            strokeWeight(0);
            stroke(0);
            ellipseMode(CENTER);
            ellipse(trail.x, trail.y, this.r * 2, this.r * 2)

            fill(this.color.r, this.color.g, this.color.b);
            rectMode(CENTER);
            strokeWeight(0.5);
            rect(trail.x, trail.y, random(0, 15), random(0, 15));
        }
        
        pop();
    }
}

class Star {
    constructor() {
        this.x = random(0,width);
        this.y = random(0,height);
        this.r = random(1,5);
        this.speed = this.r/5;
    }
    display() {
        push();

        fill(235);
        noStroke();
        ellipse(this.x, this.y, this.r, this.r);

        this.y += this.speed;

        pop();
    }
}

class Ship {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.r = 42;
    }
    intersects(other) {
        var d = dist(this.x, this.y, other.x, other.y);
        
        if (d < this.r + other.r) {
            return true;
        }else {
            return false;
        }
    }
    display() {
        push();

        rectMode(CENTER);
        ellipseMode(CENTER);
        stroke(0);
        strokeWeight(3);
        fill(170);
        rect(this.x, this.y, 70, 23);
        rect(this.x, this.y, 25, 100);
        rect(this.x - 40, this.y, 20, 50);
        rect(this.x + 40, this.y, 20, 50);

        pop();
    }
}