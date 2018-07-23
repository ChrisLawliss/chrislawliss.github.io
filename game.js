let badGuys = [];
let messages = ["","","","",""];

//random integer
function rI(number){
    return Math.floor((number*Math.random()));
}

//The following is bad code:
// Array.prototype.chooseRand =function(){
//     return this[rI(this.length)]
// };

chooseRand = function(array){
    return array[rI(array.length)]
};


//random integer offset
function rIO(number){
    if(Math.random() > .500){
        return (-1*rI(number))
    } else {
        return (1*rI(number))
    }
}
function messageUpdate(latestMsg){
    messages.shift();
    messages.push(latestMsg);
    $("#msg1").text(messages[4]);
    $("#msg2").text(messages[3]);
    $("#msg3").text(messages[2]);
    $("#msg4").text(messages[1]);
    $("#msg5").text(messages[0]);
}
//random integer within range
function rIR(least,most){
    return least + Math.floor((most-least)*Math.random())
}

function takeDamage(attacker,defender){
    let amt = 0;
    for(i=0;i<attacker.attack.length;i++){

        amt += attacker.attack[i]*(1-defender.defense[i])
    ;}
    return Math.floor(amt)
}

function hit(attacker,defender){
    defender.health -= takeDamage(attacker,defender);
    messageUpdate(attacker.name + " hit " + defender.name +" for " + takeDamage(attacker,defender)+ " damage.")
}

function createEnemy(healthE,armorE,defenseE,attackE){
    badGuys.push(new enemy(healthE,armorE,defenseE,attackE));
    badGuys[badGuys.length-1].expGain = Math.floor(badGuys[badGuys.length-1].health * 1.1);

}

function killcheck(){
    if(activeEnemy.health <= 0){
        activeEnemy.health = 0;
        messageUpdate('You killed ' + activeEnemy.name );
        player.exp += activeEnemy.expGain;
        lvlUp();

    }
}

function lvlUp(){
    if(player.exp >= 100){
        player.exp = player.exp % 100;
        player.lvl+=1;
        player.health = Math.floor(playerHealthStart *Math.pow(1.1,player.lvl-1))
    }
}

function creature([health,healthVar],[armor,armorVar],[physD,fireD,iceD,elecD],[physA,fireA,iceA,elecA]){
    this.health=health+rIO(healthVar);
    this.armor=armor+rIO(armorVar);
    this.attack=[physA,fireA,iceA,elecA];
    this.defense=[physD,fireD,iceD,elecD];
    this.name = chooseRand(["john","bill","craig","danny","red","brooks","blue","chris"])

}
function createBasicEnemy(){
    createEnemy([20,7],[0,0],[.20,0,0,0],[25,0,0,0]);
}


let enemy = creature;
enemy.prototype.type = 'enemy';


playerHealthStart = 20;
playerArmorStart = [20,0];
playerDefenseStart = [.3,0,0,0];
playerAttackStart = [15,0,0,0];
player = new creature([playerHealthStart,0],playerArmorStart,playerDefenseStart,playerAttackStart);
player.exp = 0;
player.lvl = 1;
player.name = "you";




createBasicEnemy();
activeEnemy = badGuys[badGuys.length-1];

function updatePage(){
    $("#enemyHealth").text(activeEnemy.health);
    $("#playerHealth").text(player.health);
    $("#experience").text(player.exp);
    $("#playerLvl").text(player.lvl);
    $("#enemyDesc").text(activeEnemy.name)
}

function vitalityCheck(){
    if(player.health <=0){
        $("body").html("<body><h1 style='text-align: center; color:red'>YOU DIED</h1></body>")
    }
}


//render
updatePage();
$("#attack").click(function(){
    if(activeEnemy.health > 0){
    hit(player,activeEnemy);
    killcheck();

    if(activeEnemy.health >0){
        hit(activeEnemy,player);
        }
        updatePage();} else {
        messageUpdate(activeEnemy.name + ' is dead already!');
    };
    vitalityCheck();
});
$("#newFight").click(function(){
    if(activeEnemy.health <= 0){
    createBasicEnemy();
    activeEnemy = badGuys[badGuys.length-1];
    updatePage();
    } else { messageUpdate('You are already in a fight!')
    }
});
$("#runAway").click(function(){
    createBasicEnemy();
    activeEnemy = badGuys[badGuys.length-1];
    player.exp = 0;
    player.health = Math.floor(playerHealthStart *Math.pow(1.1,player.lvl-1));
    updatePage();

});
console.log(badGuys);