
canvas = document.getElementById("mcanvas");
ctx = canvas.getContext("2d");

var bg = new Image();
bg.src = "../Images/LightSand.png";

var crab = [];
crab.push(new Image());
crab.push(new Image());
crab.push(new Image());
crab[0].src = "../Images/crabOne.png";
crab[1].src = "../Images/crabTwo.png";
crab[2].src = "../Images/crabOne.png";
var left = false, right = false;

var dasong = new Audio();
dasong.src = "../Sounds/Sound.mp3";
dasong.addEventListener("canplaythrough", function() {
    dasong.play();
}, false);
dasong.addEventListener("ended", function() {
    dasong.play();
}, false);
    dasong.play();

var grantim = new Image();
grantim.src = "../Images/GrantCrabRun.png";

function toRadians(num) {
    return num * (3.14 / 180);
}

function IsColliding(x, y, xtwo, ytwo, rad) {
    var dx = x - xtwo;
    var dy = y - ytwo;
    var dis = Math.sqrt(dx * dx + dy * dy);
    if (dis < rad) {
        return true;
    } 
    return false;
}

document.onkeydown = function(e) {
    if (e.keyCode == 65) {
        left = true;
    }
    if (e.keyCode == 68) {
        right = true;
    }
}

document.onkeyup = function(e) {
    if (e.keyCode == 65) {
        left = false;
    }
    if (e.keyCode == 68) {
        right = false;
    }
}

canvas.ontouchstart = function(e) {
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var touch = e.touches[0];
    var tx = touch.clientX - rect.left;
    if (tx < canvas.width / 2) {
        left = true;
    } else {
        right = true;
    }
}

canvas.ontouchmove = function(e) {
     e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    var touch = e.touches[0];
    var tx = touch.clientX - rect.left;
    if (tx < canvas.width / 2) {
        left = true;
    } else {
        right = true;
    }
}

canvas.ontouchend = function(e) {
    left = false;
    right = false;
}

class Player {
    x;
    y;
    w;
    h;
    rot;
    frame;
    maxFrame;
    iter;
    time;
    constructor() {
        this.x = 450;
        this.y = 550;
        this.w = 100;
        this.h = 100;
        this.frame = 0;
        this.maxFrame = 2;
        this.iter = 0;
        this.time = 5;
        this.rot = toRadians(180);
    }
    Reset() {
        this.x = 450;
    }
    Update() {
        this.rot = toRadians(180);
        var xvel = 0.0;
        if (left) {
            xvel -= 10.0;
            this.rot = toRadians(90);
        }
        if (right) {
            xvel += 10.0;
            this.rot = toRadians(270); 
        }
        this.x += xvel;
        if (this.x < 50) {
            this.x = 50.0;
        }
        if (this.x > 950) {
            this.x = 950;
        }
        this.iter++;
        if (this.iter > this.time) {
            this.frame++;
            if (this.frame >= this.maxFrame) {
                this.frame = 0;
            }
            this.iter = 0;
        }
    }
    Render() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.drawImage(crab[this.frame], -(this.w / 2), -(this.h / 2), this.w, this.h);
        ctx.restore();
    }
}

class Enemy {
    x;
    y;
    w;
    h;
    frame;
    maxFrame;
    iter;
    time;
    constructor() {
        this.x = 450;
        this.y = 50;
        this.w = 100;
        this.h = 100;
        this.frame = 0;
        this.maxFrame = 2;
        this.iter = 0;
        this.time = 5;
        this.rot = 0.0;
    }
    Reset() {
        this.x = 450;
    }
    Update(xdir) {
        if (xdir < this.x) {
            this.x -= 10.0;
        } else if(xdir > this.x + 20) {
            this.x += 10.0;
        } else {
            this.x += 0.0;
        }
        
        this.iter++;
        if (this.iter > this.time) {
            this.frame++;
            if (this.frame >= this.maxFrame) {
                this.frame = 0;
            }
            this.iter = 0;
        }
    }
    Render() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(toRadians(this.rot));
        ctx.drawImage(crab[this.frame], -(this.w / 2), -(this.h / 2), this.w, this.h);
        ctx.restore();
    }
}

class Grant {
    x;
    y;
    w;
    h;
    velx;
    vely;
    frame;
    maxFrame;
    iter;
    time;
    constructor() {
        this.Reset();
    }
    Reset() {
        this.x = 500;
        this.y = 300;
        this.w = 100;
        this.h = 100;
        this.velx = -10.0 + Math.random() * 20;
        this.vely = -10.0;
        this.frame = 0;
        this.maxFrame = 10;
        this.iter = 0;
        this.time = 2;
    }
    Update(px, py, ex, ey) {
        this.x += this.velx;
        if (this.x < 50) {
            this.x = 50;
            this.velx = -this.velx;
        }
        if (this.x > 950) {
            this.x = 950;
            this.velx = -this.velx;
        }
        
        this.iter++;
        if (this.iter > this.time) {
            this.frame++;
            if (this.frame >= this.maxFrame) {
                this.frame = 0;
            }
            this.iter = 0;
        }
        this.y += this.vely;
        if (IsColliding(px, py, this.x, this.y, 75.0)) {
            this.y = 450;
            this.vely = -this.vely;
            this.velx = (-10.0 + Math.random() * 20.0);
        } 
        if (IsColliding(ex, ey, this.x, this.y, 75.0)) {
            this.y = 150;
            this.vely = -this.vely;
            this.velx = (-10.0 + Math.random() * 20.0);
        }
    }
    Render() {
        ctx.drawImage(grantim, this.frame * (grantim.width / this.maxFrame), 0, (grantim.width / this.maxFrame), grantim.height, this.x - (this.w / 2), this.y - (this.h / 2), this.w, this.h);
    }
}

var player = new Player();
var grant = new Grant();
var en = new Enemy();

var giter = 0, gtime = 90;

function Render() {
    ctx.clearRect(0, 0, 1000, 600);
    ctx.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, 1000, 600);
    player.Render();
    en.Render();
    grant.Render();
}

function Update() {
    player.Update();
    en.Update(grant.x);
    grant.Update(player.x, player.y, en.x, en.y);
    if (grant.y < 0 || grant.y > 600) {
        giter++;
        if (giter > gtime) {
            grant.Reset();
            player.Reset();
            en.Reset();
            giter = 0;
        }
    }
    Render();
}

setInterval(Update, 1000 / 30);