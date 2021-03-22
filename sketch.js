/*
ShipS Online v0.1 BETA >> v0.2 BETA
-Ships
-Smrt igraca ali spectate
-Game Over / "Plavi" je pobjedio

ShipS Online v0.2 BETA >> v1.0
-Imena?
-Laseri piju piju
-Random Ships size
-LeaderBoards
*/


let player;
let others = [];
let ships = [];
let stars = [];

let width = 1920;
let height = 1080;
let canvasW = innerWidth;
let canvasH = innerHeight;
let p5canvas;

let create = false;
let join = false;
let input = "";
let roomID;

let ingame = false;
let online = 0;

let socket;

function resizeC() {
    canvasW = innerWidth;
    canvasH = innerHeight;

    let RATIO = 16 / 9;
    if (canvasH < canvasW / RATIO) {
        canvasW = canvasH * RATIO;
    }else {
        canvasH = canvasW / RATIO;
    }

    p5canvas.canvas.style.width = ''+canvasW+'px';
    p5canvas.canvas.style.height = ''+canvasH+'px';
}

function windowResized() {
    resizeC();
}

function setup() {
    p5canvas = createCanvas(width, height);
    resizeC();

    player = new Player({r:random(50,255),g:random(50,255),b:random(50,255)});
    
    noSmooth();
    for (let i = 0; i < 300; i++) {
        stars.push(new Star());
    }

    new Sockets();
}
  
function draw() {
    background(35);
    noSmooth();

    for (const star of stars) {
        star.display();
        if (star.y > height+star.r) {
            star.r = random(1, 6);
            star.speed = star.r/6;
            star.x = random(0, width);
            star.y = -star.r;
        }
    }

    if (!ingame) {
        if (create) {
            new CreateRoom();
        }else if (join) {
            new JoinRoom(input);
        }else {
            new MainMenu(input);
        }
    }else if (ingame) {
        for (const ship of ships) {
            ship.display(); 
        }
    
        for (const other of others) {
            other.display();
        }
    
        player.display(mouseX,mouseY);
        socket.emit('updatePlayer', player);

        push();

        textSize(50);
        textAlign(CENTER);
        stroke(0);
        fill(255);
        strokeWeight(5);
        text(`Room: ${roomID}`, width/2, height-30);

        pop();
    }
}

function mousePressed() {
    if (create) {
        if (isMouseInsideText("Back", 110 , height-30)) {
            create = false;
        }else if (isMouseInsideText("Create", width/2 , height/2+200)) {
            socket.emit('newPlayer', player, parseInt(input));
        }
    }else if (join) {
        if (isMouseInsideText("Back", 110 , height-30)) {
            join = false;
        }else if (isMouseInsideText("Join", width/2 , height/2+200)) {
            socket.emit('newPlayer', player, input);
        }
    }else {
        if (isMouseInsideText("Create Room", width/2, height/2)) {
            input = '';
            create = true;
        }else if (isMouseInsideText("Join Room", width/2, height/2+150)) {
            input = '';
            join = true;
        }
    }
}

function keyPressed() {
    if (keyCode === ESCAPE) {
        if (create) create = false;
        else if (join) join = false;
    }
    if (keyCode === ENTER) {
        if (create) socket.emit('newPlayer', player, parseInt(input));
        else if (join) socket.emit('newPlayer', player, input);
    }
    if (keyCode === BACKSPACE) {
        input = input.slice(0,-1);
    }
}

function keyTyped() {
    if (create && !Number.isNaN(parseInt(key))) {
        input += key;
    }else if (join && input.length < 6 && ((key.match(/[a-zA-Z]/g) && key.match(/[a-zA-Z]/g).length === 1) || !Number.isNaN(parseInt(key)))) {
        input += key.toUpperCase();
    }
}

function isMouseInsideText(message, messageX, messageY) {
    push();

    textSize(75);
    const messageWidth = textWidth(message);
    const messageTop = messageY - textAscent();
    const messageBottom = messageY + textDescent();
    pop();
  
    return mouseX > messageX - messageWidth/2  && mouseX < messageX + messageWidth/2 &&
      mouseY > messageTop && mouseY < messageBottom;
}