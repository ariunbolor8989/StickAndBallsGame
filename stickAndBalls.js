//messages
alert(`CAUTION (if using a mobile device)!! don't drag your touch to position the stick, just tap to position the stick`);

//utilities
//1.
function randomNumber(min,max){
    return Math.random()*(max-min)+min;
}

//2.
function randomColor(){
    return `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
}

//3.
function distance(x1,y1,x2,y2){
    xdist=x1-x2;
    ydist=y1-y2;
    return Math.sqrt(xdist*xdist+ydist*ydist);
}

//4.
function radian(theta){
    return (Math.PI/180)*theta;
}

//5.
function baisedCoinToss(f){
    border=f*100;
    if((Math.random()*100)<border)
        return 1;
    else
        return 0;
}

//6.
window.addEventListener('mousemove',function(el){
    mouse.x=el.clientX;
    mouse.y=el.clientY;
});

//7.
window.addEventListener('touchmove',function(el){
    el.preventDefault;
    mouse.x=el.originalEvent.touches ? e.originalEvent.touches[0].pageX : el.pageX;
    mouse.y=el.originalEvent.touches ? e.originalEvent.touches[0].pageY : el.pageY;
});

//8.
window.addEventListener('drag',function(el){
    mouse.x=el.x;
    mouse.y=el.y;
});

//setting up the canvas
let canvas=document.querySelector('.canvas');
canvas.height=window.innerHeight-4;
canvas.width=window.innerWidth;
canvas.style.background="rgb(50,50,50)";

//important variables
mouse={
    x: 0,
    y:0
};
let c=canvas.getContext('2d');
let message=document.querySelector('#message');
let ball1Btn=document.querySelector('#ball1');
let ball2Btn=document.querySelector('#ball2');
let playBtn=document.querySelector("#play");
let replayBtn=document.querySelector("#replay");
let levelLabel=document.querySelector("#level");
let scoreLabel=document.querySelector("#score");
let maxScoreLabel=document.querySelector("#max-score");
let requestId=0;
let stickWidth=200;                                                   //changable
let stickHeight=30;                                                   //changable
let stickElevation=100;                                               //changable
let ballRadius=20;                                                    //changable
let stickColor="rgb(200,200,200)";                                    //changable
let ballColor="rgb(50,100,190)";                                      //changable
let initialVelocity=4,vdiff=2;                                        //changable
let levelStep=5;                                                      //changable
let numberOfBalls=0;                                                  
let play=0;
let gameOver=0;
let level=1;
let score=0;
let maxScore=0;

//program utilities
ball1Btn.addEventListener('click',function(el){
    message.textContent="Click to start the game";
    ball1Btn.classList.add('hide');
    ball2Btn.classList.add('hide');
    playBtn.classList.remove('hide');
    numberOfBalls=1;
    init(numberOfBalls);
    playBtn.addEventListener('click',function(el){
        play=1;
        gameOver=0;
        message.classList.add('hide');
        playBtn.classList.add('hide')
        animate();
    })
});
ball2Btn.addEventListener('click',function(el){
    message.textContent="Click to start the game";
    ball1Btn.classList.add('hide');
    ball2Btn.classList.add('hide');
    playBtn.classList.remove('hide');
    numberOfBalls=2;
    init(numberOfBalls);
    playBtn.addEventListener('click',function(el){
        play=1;
        gameOver=0;
        message.classList.add('hide');
        playBtn.classList.add('hide');
        animate();
    })
});
replayBtn.addEventListener('click',function(el){
    balls.length=0;
    init(numberOfBalls);
    play=1;
    gameOver=0;
    message.classList.add('hide');
    replayBtn.classList.add('hide');
    animate();
});

function init(num){
    level=1;
    score=0;
    let dy=initialVelocity;
    for(let i=0;i<num;i++){
        let dx=1;
        if(i==0)
            dx=-initialVelocity;
        else
            dx=initialVelocity;
        let x=stick.x+Math.floor(stickWidth/2);
        let y=stick.y-ballRadius;
        let b=new Ball(x,y,ballRadius,dx+i*vdiff,dy+i*vdiff,ballColor);
        balls.push(b);
    }
    stick.draw();
    for(let i=0;i<num;i++){
        balls[i].draw();
    }
}

function levelUp(){
    if(numberOfBalls==1 && gameOver==0){
        level+=1;
        balls[0].dx=(balls[0].dx/Math.abs(balls[0].dx))*(Math.abs(balls[0].dx)+1);
        balls[0].dy=(balls[0].dy/Math.abs(balls[0].dy))*(Math.abs(balls[0].dy)+1);
    }
    else if(numberOfBalls==2 && gameOver==0){
        level+=2;
        score+=levelStep;
        for(let i=0;i<numberOfBalls;i++){
            balls[i].dx=(balls[i].dx/Math.abs(balls[i].dx))*(Math.abs(balls[i].dx)+2);
            balls[i].dy=(balls[i].dy/Math.abs(balls[i].dy))*(Math.abs(balls[i].dy)+2);
        }
    }
    else if(numberOfBalls==2 && gameOver==1){
        level+=1;
        for(let i=0;i<numberOfBalls;i++){
            balls[i].dx=(balls[i].dx/Math.abs(balls[i].dx))*(Math.abs(balls[i].dx)+1);
            balls[i].dy=(balls[i].dy/Math.abs(balls[i].dy))*(Math.abs(balls[i].dy)+1);
        }
    }
    else
        console.log("else part");
}

function gameOverReplay(){
    c.clearRect(0,0,canvas.width,canvas.height);
    message.textContent="Game Over";
    message.classList.remove('hide');
    replayBtn.classList.remove('hide');
    maxScore=Math.max(maxScore,score);
    maxScoreLabel.textContent="Max Score : "+maxScore;
}

//game Objects required(Classes)
class Stick {
    constructor(width,height,color){
        this.y=canvas.height-height-stickElevation;
        this.x=Math.floor(randomNumber(10,canvas.width-width-10));
        this.width=width;
        this.height=height;
        this.color=color;
    }
    move(){
        if(mouse.x>=canvas.width-Math.floor(stick.width/2))
            this.x=canvas.width-stick.width;
        else if(mouse.x<=Math.floor(stick.width/2))
            this.x=0;
        else
            this.x=mouse.x-Math.floor(stick.width/2);
        this.draw();
    }
    draw(){
        c.fillStyle=this.color;
        c.fillRect(this.x,this.y,this.width,this.height);
    }
}

class Ball {
    constructor(x,y,r,dx,dy,color){
        this.x=x;
        this.y=y;
        this.r=r;
        this.dy=-dy;
        this.dx=dx;
        this.color=color;
        this.out=0;
    }
    move(){
        if(this.out==1)
            return;
        this.x+=this.dx;
        this.y+=this.dy;
        if(this.x+this.r>=canvas.width || this.x<=this.r)
            this.dx=-this.dx;
        if(this.y<=this.r)
            this.dy=-this.dy;
        if(this.y+this.r==stick.y && this.x>=stick.x && this.x<=(stick.x+stick.width)){
            this.dy=-this.dy;
            score++;
            if(score%levelStep==0)
                levelUp();
        }
        if(this.y-this.r>=canvas.height){
            gameOver++;
            this.out=1;
        }
        this.draw();
    }
    draw(){
        c.fillStyle=this.color;
        c.beginPath();
        c.arc(this.x,this.y,this.r,0,Math.PI*2,false);
        c.fill();
        c.closePath();
    }
}

//Creating the particles/objects
let stick=new Stick(stickWidth,stickHeight,stickColor);
let balls=[];

//Animate Function
function animate(){
    if(gameOver==numberOfBalls){
        window.cancelAnimationFrame(requestId);
        gameOverReplay();
        return;
    }
    else if(play){
        requestId=requestAnimationFrame(animate);
        c.clearRect(0,0,canvas.width,canvas.height);
        stick.move();
        for(let i=0;i<numberOfBalls;i++)
            balls[i].move();
        levelLabel.textContent="Level : "+level;
        scoreLabel.textContent="Score : "+score;
    }
}
