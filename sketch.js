var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg;

var trex_collided;

var pulo;
var checkpoint;
var morte;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  
  trex_collided = loadImage("trex_collided.png")

  groundImage = loadImage("ground2.png");
 
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")

  morte = loadSound("die.mp3");
  checkpoint = loadSound("checkpoint.mp3");
  pulo = loadSound("jump.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-72,width,2);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
    gameOver = createSprite(width/2,height/2 -50,);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  //criar grupos de obstáculos e nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  score = 0;

  trex.setCollider("circle", 0, 0, 40,);
  trex.debug = false;
}

function draw() {
  background(180);
  //exibindo pontuação
  text("Pontuação: "+ score, 500,50);
  
  if(gameState === PLAY){
     gameOver.visible = false
    restart.visible = false
    //mover o solo
    ground.velocityX = -(4+3*score/500)
    //pontuação
    score = score + Math.round(getFrameRate()/60);
    
    if(score > 0 && score%500 == 0){
      checkpoint.play()
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //pular quando a tecla espaço for pressionada
    if(touches.length>0 || keyDown("space")&& trex.y >= height-175) {
        trex.velocityY = -9;
        pulo.play();
        touches = [];      
      }
  
    
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no chão
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        morte.play()
    }
  }
   else if (gameState === END) {
      ground.velocityX = 0;

      gameOver.visible = true;
      restart.visible = true;

      ground.velocityX = 0;
      trex.velocityY = 0;

      //mudar a animação do trex 
      trex.changeAnimation("collided", trex_collided);

      //definir tempo de vida aos objetos do jogo para que nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);


     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
    }
  
 
  //impedir que o trex caia
  trex.collide(invisibleGround);
  
  if(touches.length>0 || mousePressedOver(restart)){
    reset();
    touches = [];
  }
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-85,20,30);
   obstacle.velocityX = -(6+score/500);
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribua dimensão e tempo de vida aos obstáculos              
    obstacle.scale = 0.5;
    obstacle.lifetime =300;
   
   //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
   if (frameCount % 60 === 0) {
     cloud = createSprite(width+20,height-100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribua tempo de vida à variável
    cloud.lifetime = 460;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvens ao grupo
   cloudsGroup.add(cloud);
    }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
  trex.changeAnimation("running", trex_running);
}