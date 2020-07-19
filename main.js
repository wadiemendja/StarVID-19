var playerName = "Player :";
var playerPic = "img/player.jpg";
var giude =true;

var firebaseConfig = {
  apiKey: "AIzaSyDvdMbrCpQEX3wHoV2yq5XoM-V2fZXPQqQ",
  authDomain: "starvid-19.firebaseapp.com",
  databaseURL: "https://starvid-19.firebaseio.com",
  projectId: "starvid-19",
  storageBucket: "starvid-19.appspot.com",
  messagingSenderId: "311870930623",
  appId: "1:311870930623:web:ec323dac66ad2e8a06100a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var firebaseRef = firebase.database().ref();
var DB_best_score
        
function gamePan() {

    $("body").append(`
    <div id="wholePan">
    <audio src="sounds/bmusic.mp3" id="bmusic"></audio>
    <audio src="sounds/coin.mp3" id="coin"></audio>
      <div id="topPan">
        <div id="scorePan">
          <div id="bestScoreLab">Best score: <span id="bestScore"></span></div>
          <div id="scoreLab">Curr score:🌟<b><span id="score"></span></div></b>
        </div>
        <div id="timePan">
          <div id="fullname"></div>
          <div id="timeLab">Time: ⏱️ <span id="min">00</span>:<span id="sec">00</span></div>
        </div>
        <img src="img/sound-on.png" alt="" id="sound">
      </div>

      <div id="gamePan">
        <div id="drag">
        <img id="player">
        <img src="img/drag.png" alt="" id="dragIcon">
        </div>
      </div>
    </div> 
    `);

    var ids = 0 ; var shining=0; var score=0;
    var maxTime=20000;var minTime=8000;
    var player =document.getElementById("player");
    var bmusic = document.getElementById("bmusic");
    var oh = document.getElementById("oh");
    var coin = document.getElementById("coin");
    var crowd = document.getElementById("crowd");
    var fullName = document.getElementById("fullname");
    var scoreLab = document.getElementById("score");
    var bestScoreLab = document.getElementById("bestScore");
    var secLab = document.getElementById("sec");
    var minLab = document.getElementById("min");

    // Get the best score Firebase
    firebaseRef.once('value').then(function(snapshot){
      DB_best_score=snapshot.val().best_score;
      bestScoreLab.innerHTML=DB_best_score
    });
  
    player.src=playerPic;
    fullName.innerHTML=playerName+" ";
    $('#fullname').append(`<span id="hearts"><span id="heart1">💓</span><span id="heart2">💓</span><span id="heart3">💓</span></span>`);
    scoreLab.innerHTML+=score;

    if (giude){
      setTimeout(() => {
        $("#gamePan").append(`
          <img src="img/dragfinger.png" alt="" id="fingure">
          `);
          for (let i=0;i<2;i++){
            $("#fingure").animate({
              top:'80%'
            },1000);
            $("#fingure").animate({
              top:'95%'
            },50);
          }
          setTimeout(()=>{
            $("#fingure").remove();
          },2100);
          giude=false;
      }, 1500);
    }

    for(let i =0 ; i<7 ;i++) {
        $('#gamePan').append(`
            <img class="coronas" style="height:10%;
            width:10%;position:absolute;">
        `);
    }

    var dom = document.querySelectorAll(".coronas");
    for (let i=0 ; i<dom.length;i++) {
      dom[i].id="corona"+ids;
      dom[i].src="corona/corona"+ids+".png";
      ids++;
    }

  function animateCoronas(){
    for(let i =0 ; i<dom.length ;i++) {
      $("#corona"+i).animate({
        left:"90%"
      },Math.floor(Math.random() * (maxTime - minTime + 1) + minTime)); 
      $("#corona"+i).animate({
        left:"0%"
      },Math.floor(Math.random() * (maxTime - minTime + 1) + minTime));
    }
  }

  function randomAnimation(){
    for(let i =0 ; i<dom.length ;i++) {
      $("#corona"+i).animate({
        left:Math.floor(Math.random() * (90 - 0 + 1) + 0)+'%',
        top: Math.floor(Math.random() * (90 - 0 + 1) + 0)+'%'
      },Math.floor(Math.random() * (maxTime - minTime + 1) + minTime)); 
    }
  }

  animateCoronas();
  var level=0;
  var moveCoronas= setInterval(() => {
    if (level < 1) {
      animateCoronas();
      level++;
    }else if (level>=1 && level < 3){
      maxTime=10000;
      minTime=4000;
      level++;
      animateCoronas();
    }else if (level>=3 && level<5) {
      maxTime=8000;
      minTime=1000;
      level++;
      animateCoronas();
    }else if (level>=5 && level<7){
      maxTime=10000;
      minTime=4000;
      level++;
      randomAnimation();
    }else{
      maxTime=8000;
      minTime=1000;
      randomAnimation();
    }
  }, 0);

  $( "#drag" ).draggable({
    refreshPositions: true,
    containment: '#gamePan',
    start: function( event, ui ) {
      $("#dragIcon").hide();
    },
    stop: function( event, ui ) {
      $("#dragIcon").show();
    }
  });

  function appendingStar(){
        $('#gamePan').append(`
            <img id="star" src="img/star.gif" style="
            position:absolute;height: 10%;width: 10%;">
        `);
        try{
          document.getElementById("star").style.left=
          Math.floor(Math.random() * (90 - 0 + 1) + 0)+'%';
          document.getElementById("star").style.top=
          Math.floor(Math.random() * (65 - 0 + 1) + 0)+'%';
        }catch(err){}
  }

  appendingStar();

  let throwStar =setInterval(() => {
    try {
      if (collision($("#star"),$("#player"))) {
        score++;
        scoreLab.innerHTML=score;
        var scoreFont = document.getElementById("score").style.fontSize;
        $("#score").animate({
          fontSize:"200%"
        });
        $("#score").animate({
          fontSize:"100%"
        });
        coin.play();
        var appendAgain=setTimeout(() => {
          appendingStar();
        }, 1000);
        $("#star").remove();
      }
    }
    catch(err) {}        
  }, 200);

  let check=true;
  function danger(){
    if (check){
      check=false;
      setInterval(() => {
          if (shining<3){
            player.style.borderColor="red";
            player.style.borderWidth=shining+"px";
            shining++;
          }
          else shining=0;
      }, 100);
    }
  }

  function collision($div1, $div2) {
    var x1 = $div1.offset().left;
    var y1 = $div1.offset().top;
    var h1 = $div1.outerHeight(true);
    var w1 = $div1.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = $div2.offset().left;
    var y2 = $div2.offset().top;
    var h2 = $div2.outerHeight(true);
    var w2 = $div2.outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;
      
    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
  }

  let heartCount=3;
  var I1=setInterval(() => {
    $(".coronas").each(function(){
      try {
        if(collision($(this), $('#player'))) {
          danger();
          $("#heart"+heartCount).animate({
            fontSize:"200%"
          });
          $("#heart"+heartCount).animate({
            fontSize:"100%"
          });
          $("#heart"+heartCount).fadeTo("slow",0.7);
          heartCount--;
          oh.play();
          if (heartCount==0) {
            clearInterval(timeInterval);
            clearInterval(moveCoronas);
            clearInterval(throwStar);
            clearInterval(I1);
            crowd.play();
            endPan(score);
            return;
          }
        }
      }catch(err) {}
    });
  }, 200);

  let sec =0; let min=0;
  var timeInterval = setInterval(() => {
    if (sec<10)secLab.innerHTML='0'+sec;
    else secLab.innerHTML=sec;
    sec++;
    if (sec==59){
      min++;
      if(min<10)minLab.innerHTML='0'+min;
      else minLab.innerHTML=min;
      sec=0;
    }
  }, 999);

  let soundOffOn=true;
  $("#sound").click(function(){
    if (soundOffOn) {
    document.getElementById("sound").src="img/sound-off.png";
    bmusic.pause();
    soundOffOn=false ;
    }else {
    document.getElementById("sound").src="img/sound-on.png";
    bmusic.play();
    soundOffOn=true;
    }
  });
  
}

function endPan(fscore){
  
    $("#wholePan").remove();
    $("body").append(`
      <div id="endPan">
        <div id="arrow">⬆</div>
        <div id="innerPan">
          <div id="ad"><p>Ad</p></div>
          <div id="bigStar">🌟</div>
          <div id="fscoreLab">
          🌟 You Scored <span id="fscore"></span> 🌟
          </div>
          <button id="playAgain"> Play Again </button>
          <button id="share"> Share </button>
        </div>
      </div>
    `);

    if (fscore > DB_best_score)
    firebaseRef.update({best_score:fscore});

    $("#playAgain").on("click",function(){
      $("#endPan").remove();
      gamePan();
    });

    // share button 
    $("#share").on("click",function(){
      FB.ui({
        display: 'popup',
        method: 'share',
        href: location.href,
      }, function(response){});
      console.log(location.href)
    });

    setTimeout(() => {
      $("#fscoreLab").animate({
        fontSize:"150%"
      });
    }, 200);

    $("#bigStar").animate({
      fontSize:"400%"
    });

    // animating final score 
    document.getElementById("fscore").innerHTML=0;
        let plus=0;
        var fscoreAnimation =setInterval(() => {
            document.getElementById("fscore").innerHTML= plus;
            if (plus==fscore) clearInterval(fscoreAnimation);
            else plus++;
        },100);
}

// staring the game
gamePan();
document.getElementById("sound").click();
