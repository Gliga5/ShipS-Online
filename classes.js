class Sockets {
    constructor() {
        socket = io("http://fa05d83f9b7f.eu.ngrok.io");

        socket.on('invRoom' , () => {
            console.log("Invalid Room");
        });

        socket.on('newPlayer', (player,ID) => {
            roomID = ID;
            ingame = true;
            if (Array.isArray(player)) {
                for (const other of player) {
                    others.push(new Player(other.color,other.x,other.y,other.id));
                }
                return;
            }
            others.push(new Player(player.color,player.x,player.y,player.id));
        });

        socket.on('updatePlayer', player => {
            let other = others.find(e => e.id === player.id);
            if (other != null) {
                other.x = player.x;
                other.y = player.y;
            }
        });

        socket.on('delPlayer', id => {
            let other = others.find(e => e.id === id);
            if (other != null) {
                others.splice(others.indexOf(other), 1);
            }

        });

        socket.on('Ship', SHIPS => {
            ships = [];
            for (const ship of SHIPS) {
                ships.push(new Ship(ship.x,ship.y));
            }
        });
    }
}

class Player {
    constructor(color,x=0,y=0,id=null) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
        this.r = 35;
        this.trails = [];
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
            rect(trail.x, trail.y, random(0, 21), random(0, 21));
        }
        
        pop();
    }
}

class Star {
    constructor() {
        this.x = random(0,width);
        this.y = random(0,height);
        this.r = random(1,6);
        this.speed = this.r/6;
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

class MainMenu {
    constructor() {
        push();
        
        textAlign(CENTER);
        textSize(125);
        stroke(0);
        fill(255);
        strokeWeight(10);
        text("ShipS Online", width/2, 200);

        textSize(75);
        stroke(0);
        fill(255);
        strokeWeight(8);
        text("Create Room", width/2, height/2);

        textSize(75);
        stroke(0);
        fill(255);
        strokeWeight(8);
        text("Join Room", width/2, height/2+150);

        pop();
    }
}

class CreateRoom {
    constructor() {
        push();

        textSize(75);
        textAlign(CENTER);
        stroke(0);
        fill(255);
        strokeWeight(7);
        text("Back", 110 , height-30);
        text("Room size: ", width/2 , height/2-100);
        text(input, width/2 , height/2);
        text("Create", width/2 , height/2+200);

        pop();
    }
}

class JoinRoom {
    constructor(input) {
        push();

        textSize(75);
        textAlign(CENTER);
        stroke(0);
        fill(255);
        strokeWeight(7);
        text("Back", 110 , height-30);
        text("Room ID: ", width/2 , height/2-100);
        text(input, width/2 , height/2);
        text("Join", width/2 , height/2+200);
        
        pop();
    }
}
