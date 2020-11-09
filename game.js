(function () {
    var CSS = {
        arena: {
            width: 900,
            height: 600,
            background: 'black',
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: '999',
            transform: 'translate(-50%, -50%)'
        },
        ball: {
            width: 15,
            height: 15,
            position: 'absolute',
            top: 0,
            left: 200,
            background: '#ffff',
            
        },
        line: {
            width: 0,
            height: 600,
            borderLeft: '2px dashed #fff',
            position: 'absolute',
            top: 0,
            left: '50%'
        },
        stick: {
            width: 12,
            height: 85,
            position: 'absolute',
            background: 'white'
        },
        stick1: {
            left: 0,
            top:0            
        },
        stick2: {
            right:0,
            top:200
        },

        scoreBoard: {
            position:'absolute',
            fontSize: 50,
            color: 'white'
        },
        
        scoreBoard1: {           
            left: 375,                                   
        },
        scoreBoard2: {             
            left: 500,                        
        }
    };

    var CONSTS = {
        gameSpeed: 20,
        scoreControl:0,
        score1: 0,
        score2: 0,
        stick1Speed: 0,
        stick2Speed: 0,
        ballTopSpeed: 0,
        ballLeftSpeed: 0
    };

    function start() {
        draw();
        setEvents();
        movePaddles();
        roll();
        loop();
    }
    // Html elemanlarının çizimi.
    function draw() {
        $('<div/>', {id: 'pong-game'}).css(CSS.arena).appendTo('body');

        $('<div/>', {id: 'pong-line'}).css(CSS.line).appendTo('#pong-game');
        $('<div/>', {id: 'pong-ball'}).css(CSS.ball).appendTo('#pong-game');

        $('<div/>', {id: 'stick-1'}).css($.extend(CSS.stick1, CSS.stick)).appendTo('#pong-game');
        $('<div/>', {id: 'stick-2'}).css($.extend(CSS.stick2, CSS.stick)).appendTo('#pong-game');

        $('<span/>', {id:'scoreBoard-1',title:'0'}).css($.extend(CSS.scoreBoard1, CSS.scoreBoard)).appendTo('#pong-game');
        $('<span/>', {id:'scoreBoard-2',title:'0'}).css($.extend(CSS.scoreBoard2, CSS.scoreBoard)).appendTo('#pong-game');
    }
    
    // Ekran uzunluğunun, stick tarafından tamamen kullanması hızının bazen değişmesi gerekiyor.
    function changeSpeedLeft(){
        if(CSS.stick1.top + CSS.stick1.height + CONSTS.stick1Speed >= 600) {
            CONSTS.stick1Speed = CSS.stick1.top + CSS.stick1.height + CONSTS.stick1Speed - 600;            
        }
        else if (CSS.stick1.top + CONSTS.stick1Speed<0){
            CONSTS.stick1Speed = CSS.stick1.top;
        }
    }

    function changeSpeedRight(){
        if(CSS.stick2.top + CSS.stick2.height + CONSTS.stick2Speed >= 600) {
            CONSTS.stick2Speed = CSS.stick2.top + CSS.stick2.height + CONSTS.stick2Speed - 600;          
        }
        else if (CSS.stick2.top + CONSTS.stick2Speed<0){
            CONSTS.stick2Speed = CSS.stick2.top;
        }
    }
    // Stick hareketleri sağlayan fonksiyon
    function changePositionLeft(){
        CSS.stick1.top += CONSTS.stick1Speed;
        $('#stick-1').css('top', CSS.stick1.top);      
    }

    function changePositionRight(){
        CSS.stick2.top += CONSTS.stick2Speed;
        $('#stick-2').css('top', CSS.stick2.top);  
    }
        

    var pressedKeys = []

    var KEY = {
        UP: 38,
        DOWN: 40,
        W: 87,
        S: 83,
        Space:32,
       }
    
    // klavye olayları dinleniyor.
    function setEvents() {
        
        $(document).on('keydown', function (e) {
            
            pressedKeys[e.which] = true;
            movePaddles();
        });
        
             
        $(document).on('keyup', function (e) {
            pressedKeys[e.which] = false;
            movePaddles();            
        });
        
    }

    // Tuşlara basıldığında gerçekleşecek aksiyonlar
    function movePaddles() {                
        if (pressedKeys[KEY.UP] && CSS.stick2.top>0 ) { // arrow-up        
            CONSTS.stick2Speed = -30;
            changeSpeedRight();
            changePositionRight();
        }
        if (pressedKeys[KEY.DOWN]&& CSS.stick2.top<600-CSS.stick2.height) { // arrow-down        
            CONSTS.stick2Speed = 30;
            changeSpeedRight();
            changePositionRight();
        }
           if (pressedKeys[KEY.W] && CSS.stick1.top>0) { // w
            CONSTS.stick1Speed = -30;
            changeSpeedLeft();                
            changePositionLeft(); 
        }
        if (pressedKeys[KEY.S]&& CSS.stick1.top<600-CSS.stick1.height) { // s
            CONSTS.stick1Speed = 30;
            changeSpeedLeft();                
            changePositionLeft(); 
        }
        if(pressedKeys[KEY.Space]){  // space
            $('<div/>', {id: 'pong-ball2'}).css(CSS.ball).appendTo('#pong-game');
        }
       }
    

    function loop() {
        window.pongLoop = setInterval(function () {
            
            CSS.ball.top += CONSTS.ballTopSpeed;
            CSS.ball.left += CONSTS.ballLeftSpeed;
            
            // Top üst ve aşağı bloklarla çarpması haline alcağı aksiyon
            if (CSS.ball.top <= 0 ||
                CSS.ball.top >= CSS.arena.height - CSS.ball.height) {
                CONSTS.ballTopSpeed = CONSTS.ballTopSpeed * -1;
            }
            

            $('#pong-ball').css({top: CSS.ball.top,left: CSS.ball.left});

            //Soldaki stick ve ball kontrolu
            if (CSS.ball.left <= CSS.stick.width) {      
                CONSTS.scoreControl=1;                          
                CSS.ball.top > CSS.stick1.top && CSS.ball.top < CSS.stick1.top + CSS.stick.height && (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1) || roll();
                
            }
            
            //Sağdaki stick ve ball kontrolu
            if (CSS.ball.left >= CSS.arena.width - CSS.ball.width - CSS.stick.width) {
                CONSTS.scoreControl=2;             
                CSS.ball.top > CSS.stick2.top && CSS.ball.top < CSS.stick2.top + CSS.stick.height && (CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1) || roll();                 
            }
            
        }, CONSTS.gameSpeed);
    }

    function roll() {
        document.getElementById("scoreBoard-2").innerHTML = CONSTS.score2;  
        document.getElementById("scoreBoard-1").innerHTML = CONSTS.score1; 
        if(CONSTS.scoreControl===1){
            CONSTS.score2 = CONSTS.score2  + 1;
            document.getElementById("scoreBoard-2").innerHTML = CONSTS.score2;                 
        }
        if(CONSTS.scoreControl===2){            
            CONSTS.score1 = CONSTS.score1 + 1;
            document.getElementById("scoreBoard-1").innerHTML = CONSTS.score1 ;                
        }

        isFinish();

        CSS.ball.top = 350;
        CSS.ball.left = 450;
        
        var side = -1;
        var vertical = -1 

        if (Math.random() < 0.5) {
            side = 1;
        }

        if (Math.random() < 0.5) {
            vertical = 1;
        }

        CONSTS.ballTopSpeed = vertical * (Math.random() * -2 - 3);
        CONSTS.ballLeftSpeed = side * (Math.random() * 2 + 3);        
    }

    function isFinish(){
        if(CONSTS.score1 === 5){ 
            //clearInterval(window.pongLoop);  
            alert("1. oyuncu kazandı");
            storageSave();
            zeroPoint(); 
            redirect();    
        }
        if(CONSTS.score2===5){
            //clearInterval(window.pongLoop);
            alert("2. oyuncu kazandı");
            storageSave();
            zeroPoint(); 
            redirect(); 
        }
    }
    function zeroPoint(){
        CONSTS.score1 = 0; 
        CONSTS.score2 = 0;
        $("#scoreBoard-2").text(CONSTS.score2);
        $("#scoreBoard-1").text(CONSTS.score1);

        
    }

    function redirect(){
        setTimeout($(location).attr('href', 'http://corporate.lcwaikiki.com/hakkimizda'),3000)
    }

    function storageSave(){
        // score1 , score2
        localStorage.setItem("ilkOyuncu",CONSTS.score1);
        localStorage.setItem("ikinciOyuncu",CONSTS.score2);
    }

    start();
})();