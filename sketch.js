let player;
let others = [];
let ships = [];

let stars = [];
let width = 1280;
let height = 720;

let socket;
let connected = false;

function setup() {
    createCanvas(width, height);
    player = new Player({r:random(50,255),g:random(50,255),b:random(50,255)});
    player.init();
    for (let i = 0; i < 200; i++) {
        stars.push(new Star());
    }

    ship = new Ship(300,300);

    socket = io("ws://localhost:8080");

    socket.emit('newPlayer', player);

    socket.on('newPlayer', player => {
        connected = true;
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
  
function draw() {
    background(35);

    for (const star of stars) {
        star.display();
        if (star.y > height+star.r) {
            star.r = random(1, 5);
            star.speed = star.r/5;
            star.x = random(0, width);
            star.y = -star.r;
        }
    }

    if (!connected) {
        push();

        textSize(100);
        textAlign(CENTER);
        fill(255);
        stroke(0);
        strokeWeight(5);
        text('CONNECTING...', width/2, height/2);

        pop();
    }else {
        for (const ship of ships) {
            ship.display(); 
        }
    
        for (const other of others) {
            other.display();
        }
    
        player.display(mouseX,mouseY);
        socket.emit('updatePlayer', player);
    }
}