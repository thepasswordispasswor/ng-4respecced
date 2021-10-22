function getGSAmount() {
  let galaxies = player.galaxies + player.replicanti.galaxies + player.dilation.freeGalaxies;
  let y = 1.5
  if (player.challenges.includes("postc1")) y += Math.max(0, 0.05*(galaxies - 10)) + 0.005 * Math.pow(Math.max(0, galaxies-30) , 2);
  if (player.challenges.includes("postcngm3_4")) y += Math.max(0, 0.05*galaxies) + 0.0005 * Math.pow(Math.max(0, galaxies - 50) , 3);
  if (!player.galacticSacrifice.upgrades.includes(52)){
    if (y>100) y = Math.pow(316.22*y,1/3)
    else if (y>10) y = Math.pow(10*y , .5)
  } else if (y >100){
    y = Math.pow(1e4*y , 1/3)
  }
  let z = 1
  //if (player.challenges.length >17) {
  //  z = 0.06*player.challenges.length
  //  z += galaxies/100
  //  z *= Math.log(galaxies+3)
  //
  //}
  let ret = Decimal.max(Decimal.pow(galaxies, y).times(Decimal.pow(Math.max(0,(player.resets - (player.currentChallenge=="challenge4"?2:4))),z)), 0);
  ret = ret.times(1 + player.eightAmount/50)
  if (player.galacticSacrifice.upgrades.includes(32)) {
    ret = ret.times(galUpgrade32());
  }
  if (player.galacticSacrifice.upgrades.includes(41)) {
    ret = ret.times(galUpgrade41());
  }
  if (player.infinityUpgrades.includes("galPointMult")) {
    ret = ret.times(getPost01Mult())
  }
  if (player.achievements.includes('r37')) {
    ret = ret.times(thatsFastReward());
  }
  if (player.achievements.includes("r62")) ret = ret.times(Math.max(1, player.infinityPoints.log10()))
  return ret.floor();
}

function totalEc(){
  let x=0
  for(i=0; i<=12;i++){
    x += ECTimesCompleted("eterc"+i)
    
  }
  return x
}



function thatsFastReward () {
  if (player.bestInfinityTime >= 18000) {
    return Math.max(180000 / player.bestInfinityTime, 1);
  } else {
    return 10 * (1 + Math.pow(Math.log10(18000 / player.bestInfinityTime), 2));
  }
}

function getPost01Mult() {
  let ret=getInfinitied();
  if (player.timestudy.studies.includes(31)) ret = ret.pow(4);
  return ret;
}

function decreaseDimCosts () {
  if (player.galacticSacrifice.upgrades.includes(11)) {
    let upg = galUpgrade11();
    TIER_NAMES.forEach(function(name) {
        if (name !== null) player[name+"Cost"] = player[name+"Cost"].div(upg)
    });
    if (player.achievements.includes('r48')) player.tickSpeedCost = player.tickSpeedCost.div(upg)
  } else if (player.achievements.includes('r21') && !player.galacticSacrifice.upgrades.includes(11)) {
    TIER_NAMES.forEach(function(name)  {
        if (name !== null) player[name+"Cost"] = player[name+"Cost"].div(10)
    });
    if (player.achievements.includes('r48')) player.tickSpeedCost = player.tickSpeedCost.div(10)
  }
}

let galUpgrade11 = function () {
  let x = player.infinitied;
  let y;
  let z = 10
  if (player.challenges.length > 14) z -= (player.challenges.length-8)/4
  if (player.challenges.length > 20) z += 0.085*player.challenges.length-1.5
  
  if (player.infinityUpgrades.includes("postinfi61")){
    z -= 1.1
  }else if (z<6) z = Math.pow(1296*z,.2)
  
  
  if (x <= 0) {
    y = 2;
  } else if (x < 5) {
    y = x + 2;
  } else if (x < 100) {
    y = Math.pow(x + 5, .5) + 4;
  } else {
    y = Math.pow(Math.log(x), Math.log(x) / z) + 14;
  }
  if (y>1000) y = Math.pow(1000*y,.5)
  if (y>1e4)  y = Math.pow(1e8*y,1/3)
  return Decimal.pow(10, y).min(Decimal.pow(10,20000));
}

let galUpgrade12 = function () {
  let ret=2 * Math.pow(1 + Math.max(0,(Date.now() - player.galacticSacrifice.last)) / 60000, 0.5);
  if(player.galacticSacrifice.upgrades.includes(42)){
	  ret = Decimal.pow(ret, Math.min(2, Math.pow(ret, 1/3)))
  }
  return ret;
}

let galUpgrade13 = function () {
	if(player.currentChallenge == "postcngm3_4")return new Decimal(1);
  let base = player.galacticSacrifice.galaxyPoints.div(5).plus(1).pow(3);
  let exp = 1;
  if (player.infinityUpgrades.includes("postinfi62")) {
    if (player.currentEternityChall === "") {
      exp = Math.pow(Math.log(player.resets+3),2);
    } else {
      exp = Math.pow(Math.log(player.resets+3),0.5);
    }
  }
  return base.pow(exp);
}

let galUpgrade14 = function () {
  let base = new Decimal(2);
  let exp = player.tickspeedBoosts;
  return base.pow(exp);
}


let galUpgrade15 = function () {
  return new Decimal(player.infinitied).pow(1.5).add(10);
}

let galUpgrade23 = function () {
	if(player.currentChallenge == "postcngm3_4")return 2;
  return Math.max(2 + player.galacticSacrifice.galaxyPoints.log(10)*1.5, 2);
}

let galUpgrade24 = function () {
  return Decimal.pow(productAllTotalBought(),0.1).mul(2);
}

let galUpgrade31 = function () {
  return 1.05 + .02 * player.extraDimPowerIncrease;
}

let galUpgrade32 = function () {
  let x = (player.totalmoney || player.money);
  if (!player.break && player.eternities === 0) {
    x = x.min(Number.MAX_VALUE);
  }
  return x.pow(0.003).add(1);
}

let galUpgrade33 = function () {
	if(player.currentChallenge == "postcngm3_4")return 2;
  return Math.max(2 + player.galacticSacrifice.galaxyPoints.log(10)*0.5, 2)
}

let galUpgrade35 = function () {
		let r = new Decimal(1)
		for (var d = 1; d < 9; d++) {
			r = r.times(player["timeDimension" + d].bought + player["timeDimension" + d].boughtAntimatter + 1)
		}
		if(player.challenges.includes("postcngm4r_2"))return r.pow(10)
		return r.pow(0.1)
}

let galUpgrade41 = function () {
  return new Decimal(player.tickspeedBoosts).pow(2).max(1)
}

let galUpgrade43 = function () {
	if(player.currentChallenge == "postcngm3_4")return new Decimal(1);
  return new Decimal(player.galacticSacrifice.galaxyPoints.add(10).log10()).pow(50)
}

let galUpgrade44 = function () {
  return 0.06*(1-Math.pow(0.9915,player.galaxies));
}

let galUpgrade45 = function () {
	if(player.currentChallenge == "postcngm3_4")return new Decimal(1);
  return new Decimal(player.galacticSacrifice.galaxyPoints.add(10).log10()).pow(2)
}

let galUpgrade51 = function () {
	if(player.currentChallenge == "postcngm3_4")return new Decimal(1);
  let x = player.galacticSacrifice.galaxyPoints.pow(.001)
  if (x.log10()>20) return Decimal.pow(10,Math.pow(20*x.log10(),.5))
  return x
}

function galacticSacrifice() {
    let gsAmount = getGSAmount();
    if (gsAmount.lt(1)) return false
    player.galaxies = -1
    player.galacticSacrifice.galaxyPoints = player.galacticSacrifice.galaxyPoints.plus(gsAmount);
    player.galacticSacrifice.times++;
    player.galacticSacrifice.last = Date.now();
    galaxyReset()
}

function GSUnlocked() {
    return player.galacticSacrifice && player.galacticSacrifice.times > 0;
}

function galacticUpgradeSpanDisplay () {
  if(player.infinitied<=0 && player.eternities<=0)document.getElementById('galaxy11').innerHTML = "Normal and Time dimensions are 99% cheaper when buying with antimatter.<br>Cost: 1 GP";
  else if(player.eternities<=0)document.getElementById('galaxy11').innerHTML = "Normal and Time dimensions are cheaper based on your infinitied stat when buying with antimatter.<br>Currently: "+shortenDimensions(galUpgrade11())+"x<br>Cost: 1 GP";
  else document.getElementById('galaxy11').innerHTML = "Normal and Time dimensions are cheaper based on your infinitied stat in this eternity when buying with antimatter.<br>Currently: "+shortenDimensions(galUpgrade11())+"x<br>Cost: 1 GP";
  document.getElementById("galaxy12").innerHTML="Normal and Time Dimensions gain a multiplier based on time spent in this Galactic Sacrifice.<br>Currently: "+ galUpgrade12().toFixed(2)+"x<br>Cost: 3 GP"
  document.getElementById("galaxy13").innerHTML="Normal and Time Dimensions gain a multiplier based on your Galaxy points.<br>Currently: "+ formatValue(player.options.notation, galUpgrade13(), 2, 2)+"x<br>Cost: 20 GP"
  document.getElementById("galaxy14").innerHTML="Time Dimensions gain a multiplier based on your tickspeed boosts.<br>Currently: "+ formatValue(player.options.notation, galUpgrade14(), 2, 2)+"x<br>Cost: "+shortenCosts(galUpgradeCosts[14])+" GP"
  if(player.eternities<=0)document.getElementById("galaxy15").innerHTML="Normal and Time Dimensions gain a multiplier based on your infinities.<br>Currently: "+ formatValue(player.options.notation, galUpgrade15(), 2, 2)+"x<br>Cost: 1 GP"
  else document.getElementById("galaxy15").innerHTML="Normal and Time Dimensions gain a multiplier based on your infinitied stat in this eternity.<br>Currently: "+ formatValue(player.options.notation, galUpgrade15(), 2, 2)+"x<br>Cost: 1 GP"
  document.getElementById("galaxy21").innerHTML="Reduce the Dimension Boost cost multiplier to 10.<br>Cost: 1 GP";
  document.getElementById('galspan23').innerHTML = (galUpgrade23()/2).toFixed(2);
  document.getElementById('galspan24').innerHTML = formatValue(player.options.notation, galUpgrade24(), 2,2);
  document.getElementById("galcost24").innerHTML = shortenCosts(galUpgradeCosts[24]);
  document.getElementById("galcost25").innerHTML = shortenCosts(galUpgradeCosts[25]);
  document.getElementById('galspan31').innerHTML = galUpgrade31().toFixed(2);
  document.getElementById('galspan32').innerHTML = formatValue(player.options.notation, galUpgrade32(), 2, 2);
  document.getElementById('galspan33').innerHTML = (galUpgrade33()/2).toFixed(2);
  document.getElementById("galcost33").innerHTML = shortenCosts(galUpgradeCosts[33]);
  document.getElementById("galcost34").innerHTML = shortenCosts(galUpgradeCosts[34]);
  document.getElementById("galspan35").innerHTML = formatValue(player.options.notation, galUpgrade35(), 2,2);
  document.getElementById("galcost35").innerHTML = shortenCosts(galUpgradeCosts[35]);
  document.getElementById("galspan41").innerHTML = formatValue(player.options.notation, galUpgrade41(), 2,2);
  document.getElementById("galspan43").innerHTML = formatValue(player.options.notation, galUpgrade43(), 2,2);
  document.getElementById("galspan44").innerHTML = "exponent ^"+getDilationPower().toFixed(4)+" -> ^"+(getDilationPower()+galUpgrade44()).toFixed(4);
  if(player.galacticSacrifice.upgrades.includes(44))document.getElementById("galspan44").innerHTML = "exponent ^"+getDilationPower().toFixed(4);
  document.getElementById("galspan45").innerHTML = formatValue(player.options.notation, galUpgrade45(), 2,2);
  document.getElementById("galcost41").innerHTML = shortenCosts(galUpgradeCosts[41]);
  document.getElementById("galcost42").innerHTML = shortenCosts(galUpgradeCosts[42]);
  document.getElementById("galcost43").innerHTML = shortenCosts(galUpgradeCosts[43]);
  document.getElementById("galcost44").innerHTML = shortenCosts(galUpgradeCosts[44]);
  document.getElementById("galcost45").innerHTML = shortenCosts(galUpgradeCosts[45]);
  document.getElementById("galspan51").innerHTML = formatValue(player.options.notation, galUpgrade51(), 2,2);
  document.getElementById("galcost51").innerHTML = shortenCosts(new Decimal("1e5500"));
  document.getElementById("galcost52").innerHTML = shortenCosts(new Decimal("1e8000"));
  document.getElementById("galcost53").innerHTML = shortenCosts(new Decimal("1e25000"));

}

function newGalacticDataOnInfinity () {
  if (player.achievements.includes('r33')) {
    return {
      galaxyPoints: player.galacticSacrifice.galaxyPoints.plus(getGSAmount()),
      last: Date.now(),
      times: player.galacticSacrifice.times,
      upgrades: player.galacticSacrifice.upgrades
    }
  } else {
    return {
      galaxyPoints: new Decimal(0),
      last: Date.now(),
      times: 0,
      upgrades: []
    }
  }
}

let galUpgradeCosts = {
  11: 1,
  12: 3,
  13: 20,
  14: 1e3,
  15: 1,
  21: 1,
  22: 5,
  23: 100,
  24: 1e3,
  25: 1e3,
  31: 2,
  32: 8,
  33: 5e3,
  34: 1e4,
  35: 2e3,
  41: 1e12,
  42: 1e15,
  43: 1e16,
  44: 1e18,
  45: 1e25,
  51: new Decimal("1e5500"),
  52: new Decimal("1e8000"),
  53: new Decimal("1e25000")
}

function canBuyGalUpgrade(num) {
    return !player.galacticSacrifice.upgrades.includes(num) &&
    player.galacticSacrifice.galaxyPoints.gte(galUpgradeCosts[num]) &&
    (Math.floor(num / 10) === 1 || player.galacticSacrifice.upgrades.includes(num - 10));
}

function galacticUpgradeButtonTypeDisplay () {
  for (let i = 1; i <= 5; i++) {
    for (let j = 1; j <= 5; j++) {
      let e = document.getElementById('galaxy' + i + j);
	  if(!e)continue;
      let num = +(i + '' + j);
      if (player.galacticSacrifice.upgrades.includes(num)) {
        e.className = 'infinistorebtnbought'
      } else if (canBuyGalUpgrade(num)) {
        e.className = 'infinistorebtn' + Math.min(j,4);
      } else {
        e.className = 'infinistorebtnlocked'
      }
	  if(i==1&&j==5){
		  e.style.display = player.infinityUpgrades.includes("dimMult")?'':'none';
	  }
	  if(i==2&&j==4){
		  e.style.display = player.infinityUpgrades.includes("18Mult")?'':'none';
	  }
	  if(i==2&&j==5){
		  e.style.display = player.infinityUpgrades.includes("27Mult")?'':'none';
	  }
	  if(i==3&&j==4){
		  e.style.display = player.infinityUpgrades.includes("36Mult")?'':'none';
	  }
	  if(i==3&&j==5){
		  e.style.display = player.infinityUpgrades.includes("45Mult")?'':'none';
	  }
    }
  }
}

function buyGalaxyUpgrade (i) {
  if (!canBuyGalUpgrade(i)) {
    return false;
  } else {
    player.galacticSacrifice.upgrades.push(i);
    player.galacticSacrifice.galaxyPoints = player.galacticSacrifice.galaxyPoints.minus(galUpgradeCosts[i]);
    if (i == 11) {
      TIER_NAMES.forEach(function(name) {
          if (name !== null) player[name+"Cost"] = player[name+"Cost"].div(100)
      })
    }
    if (i == 41) {
      for (n=1;n<9;n++) {
        var dim = player["infinityDimension"+n]
        dim.power = Decimal.pow(getInfBuy10Mult(n), dim.baseAmount/10)
      }
    }
    return true;
  }
}
