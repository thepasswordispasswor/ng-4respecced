//time dimensions

function infiniteTimeStrength(){
	let strength = 0.05;
	if (player.galacticSacrifice.upgrades.includes(25)) strength *= 1.5;
	return strength;
}
function getTimeDimensionPower(tier) {
	if (tier%2 == 0 && player.currentChallenge == "postcngm4r_1") return new Decimal(0);
	if (player.currentEternityChall == "eterc11") return new Decimal(1);
	var dim = player["timeDimension"+tier];
	var ret = dim.power.pow(2)
	
	if (player.timestudy.studies.includes(11) && tier == 1) ret = ret.times(timeStudy11())
	if (player.achievements.includes("r105")){
		ret = ret.mul(player.postC3Reward.pow(infiniteTimeStrength()))
	}

	ret = ret.times(kongAllDimMult)

	if (player.timestudy.studies.includes(73) && tier == 3) ret = ret.times(timeStudy73())
	if (player.timestudy.studies.includes(93)) ret = ret.times(timeStudy93())
	if (player.timestudy.studies.includes(103)) ret = ret.times(timeStudy103())
	if (player.timestudy.studies.includes(151)) ret = ret.times(timeStudy151())
	if (player.timestudy.studies.includes(221)) ret = ret.times(timeStudy221())
	if (player.timestudy.studies.includes(227) && tier == 4) ret = ret.times(calcTotalSacrificeBoost())
	if (player.galacticSacrifice.upgrades.includes(43)) ret = ret.times(galUpgrade43())
	if (player.replicanti.unl && player.replicanti.amount.gt(1) && player.dilation.upgrades.includes(5)) {
		var replmult = getReplMult()

		ret = ret.times(replmult.pow(0.1))
	}

	ret = ret.times(0.5)
	if (ret.lt(0)) {
		ret = new Decimal(0)
	}
  
	if (player.currentChallenge != "postcngm3_3"){
		let base=2;
		if(player.challenges.includes("postcngm3_3")) base = Decimal.pow(base, Math.max(Math.sqrt(player.galacticSacrifice.galaxyPoints.max(1).log10()) / 3, 1));
		ret = ret.mul(Decimal.pow(base,Math.max(player.tdBoosts - tier + 1,0)));
	}
  
	if (player.galacticSacrifice.upgrades.includes(12) && !player.galacticSacrifice.upgrades.includes(42)) {
		ret=ret.times(galUpgrade12())
	}
	if (player.galacticSacrifice.upgrades.includes(13)) {
		ret=ret.times(galUpgrade13())
	}
	if (player.galacticSacrifice.upgrades.includes(14)) {
		ret=ret.times(galUpgrade14())
	}
	if (player.galacticSacrifice.upgrades.includes(15)) {
		ret=ret.times(galUpgrade15())
	}
	if (player.galacticSacrifice.upgrades.includes(24)) {
		ret=ret.times(galUpgrade24())
	}
	if (player.galacticSacrifice.upgrades.includes(35)) {
		ret=ret.times(galUpgrade35())
	}
	if (player.timeless.upgrades.includes(29)) {
		ret=ret.times(TLPU29())
	}
	
	if(!player.timeless.active){
		if(player.challenges.includes("postcngm4r_1") && tier%2==1)ret = ret.times(player.galacticSacrifice.galaxyPoints.add(1).pow(10));
	}
	if (player.currentEternityChall == "eterc9") ret = ret.times((Decimal.pow(Math.max(player.infinityPower.log2(), 1), 10)).max(1))
	dilationstart = getDilationStart();
	if(ret.log10()>=dilationstart){
		ret = Decimal.pow(10, Math.pow(ret.log10()/dilationstart, getDilationPower())*dilationstart)
		if (player.dilation.active)ret = Decimal.pow(10, Math.pow(ret.log10()/dilationstart, getDilationPower())*dilationstart)
	}
	dilationstart4 = getDilationStart4();
	if(ret.log10()>=dilationstart4){
		ret = Decimal.pow(10, Math.pow(ret.log10()/dilationstart4, getDilationPower())*dilationstart4)
	}
	dilationstart5 = getDilationStart5();
	if(ret.log10()>=dilationstart5){
		ret = Decimal.pow(10, Math.pow(ret.log10()/dilationstart5, getDilationPower())*dilationstart5)
	}
	if (player.galacticSacrifice.upgrades.includes(12) && player.galacticSacrifice.upgrades.includes(42)) {
		ret = ret.times(galUpgrade12())
	}
  
	if (ECTimesCompleted("eterc1") !== 0) ret = ret.times(EC1Reward())
	if (ECTimesCompleted("eterc10") !== 0) ret = ret.times(EC10Reward())
	if (player.eternityUpgrades.includes(4)) ret = ret.times(player.achPow)
	if (player.eternityUpgrades.includes(5)) ret = ret.times(Math.max(player.timestudy.theorem, 1))
	if (player.eternityUpgrades.includes(6)) ret = ret.times(player.totalTimePlayed / 10 / 60 / 60 / 24)
  	if (player.achievements.includes("r128")) ret = ret.times(Math.max(player.timestudy.studies.length, 1))
	return ret;
}


function getTimeDimensionProduction(tier) {
  if (player.currentEternityChall == "eterc10") return new Decimal(0)
  var dim = player["timeDimension"+tier]
if (player.currentEternityChall == "eterc11"&&player.timestudy.studies.includes(23)){
	  
  let tick = getDilatedTickspeed()
	  return dim.amount.times(tick)
  }
  if (player.currentEternityChall == "eterc11") return dim.amount
  var ret = dim.amount
  ret = ret.times(getTimeDimensionPower(tier))
  if (player.currentEternityChall == "eterc1") return new Decimal(0)
  if (player.timestudy.studies.includes(23)){
	  
  let tick = getDilatedTickspeed()
	  ret = ret.times(tick)
  }
  if(player.currentEternityChall == "eterc7" && tier==1)ret = ret.pow(0.1);
  return ret
}


function getTimeDimensionRateOfChange(tier) {
  let toGain = getTimeDimensionProduction(tier+1)
  if(player.currentChallenge == "postcngm4r_1")toGain = getTimeDimensionProduction(tier+2)
  var current = Decimal.max(player["timeDimension"+tier].amount, 1);
  var change  = toGain.times(10).dividedBy(current);
  return change;
}

function getTimeDimensionDescription(tier) {
  var name = TIER_NAMES[tier];

  let description = shortenDimensions(player['timeDimension'+tier].amount)+" ("+player['timeDimension'+tier].boughtAntimatter;

  if((player.achievements.includes("r63") && tier <= Math.min(player.eternities,3) + 1) || player.dilation.studies.includes(tier-3)){
	  description = description+" + "+player['timeDimension'+tier].bought;
  }
  description += ")";
  if (tier < 8) {
	  if(player.currentChallenge != "postcngm4r_1")description += '  (+' + formatValue(player.options.notation, getTimeDimensionRateOfChange(tier), 2, 2) + '%/s)';
	  else if(tier%2==1 && tier<7)description += '  (+' + formatValue(player.options.notation, getTimeDimensionRateOfChange(tier), 2, 2) + '%/s)';
  }

  return description;
}

function updateTimeDimensions() {
  if (document.getElementById("timedimensions").style.display == "block" && document.getElementById("dimensions").style.display == "block") {
    for (let tier = 1; tier <= 8; ++tier) {
      document.getElementById("timeD"+tier).textContent = DISPLAY_NAMES[tier] + " Time Dimension x" + shortenMoney(getTimeDimensionPower(tier));
      document.getElementById("timeAmount"+tier).textContent = getTimeDimensionDescription(tier);
    }
    for (let tier = 1; tier <= 8; ++tier) {
      if (tier <= player.tdBoosts + 1) {
        document.getElementById("timeRow"+tier).style.display = "table-row"
      } else {
        document.getElementById("timeRow"+tier).style.display = "none"
      }
    }
  }
}

var timeDimCostMults = [null, 3, 9, 27, 81, 243, 729, 2187, 6561]
var timeDimStartCosts = [null, 1, 5, 100, 1000, "1e2350", "1e2650", "1e3000", "1e3350"]
var timeDimCostMultsAntimatter = [null, 2, 3, 4, 5, 10, 50, 1e3, 1e5]
var timeDimStartCostsAntimatter = [null, 1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7]
function buyTimeDimension(tier) {
	if (tier > player.tdBoosts + 1)return false;

  var dim = player["timeDimension"+tier]
  if (tier > 4 && !player.dilation.studies.includes(tier-3)) return false
  if (player.eternityPoints.lt(dim.cost)) return false

  player.eternityPoints = player.eternityPoints.minus(dim.cost)
  dim.amount = dim.amount.plus(1);
  dim.bought += 1
  dim.cost = Decimal.pow(timeDimCostMults[tier], dim.bought).times(timeDimStartCosts[tier])
  if (dim.cost.gte(Number.MAX_VALUE)) {
      dim.cost = Decimal.pow(timeDimCostMults[tier]*1.5, dim.bought).times(timeDimStartCosts[tier])
  }
  if (dim.cost.gte("1e1300")) {
      dim.cost = Decimal.pow(timeDimCostMults[tier]*2.2, dim.bought).times(timeDimStartCosts[tier])
  }
  if (tier > 4) {
    dim.cost = Decimal.pow(timeDimCostMults[tier]*100, dim.bought).times(timeDimStartCosts[tier])
  }
  dim.power = dim.power.times(10)
  updateEternityUpgrades()
  return true
}

function buyTimeDimensionAntimatter(tier,notip) {
	if(player.timeless.active)return false;
	if (tier > player.tdBoosts + 1)return false;
if (player.firstBought < 1) {
		if(notip!==1)alert("You need to buy a first Normal Dimension to be able to buy Time Dimensions with Antimatter.")
		return false
	}
  var dim = player["timeDimension"+tier]
  dim.costAntimatter = Decimal.pow(timeDimCostMultsAntimatter[tier], dim.boughtAntimatter).times(timeDimStartCostsAntimatter[tier])
  if (dim.costAntimatter.gte(Number.MAX_VALUE)) {
      dim.costAntimatter = Decimal.pow(timeDimCostMultsAntimatter[tier]*1.5, dim.boughtAntimatter).times(timeDimStartCostsAntimatter[tier])
  }
  if (dim.costAntimatter.gte("1e5000")) {
      dim.costAntimatter = Decimal.pow(timeDimCostMultsAntimatter[tier]*2, dim.boughtAntimatter).times(timeDimStartCostsAntimatter[tier])
  }
  if (dim.costAntimatter.gte("1e50000")) {
      dim.costAntimatter = Decimal.pow(timeDimCostMultsAntimatter[tier]*getTDFinalScaling(tier,dim.boughtAntimatter), dim.boughtAntimatter).times(timeDimStartCostsAntimatter[tier])
  }
  if (player.currentChallenge == "postcngm3_1"){
	  dim.costAntimatter = Decimal.pow(timeDimCostMultsAntimatter[tier], (Math.pow(1.01,dim.boughtAntimatter)-1)*100).times(timeDimStartCostsAntimatter[tier])
	  if(Math.pow(1.01,dim.boughtAntimatter) >= 1e100 || dim.costAntimatter.gte("0.99e9000000000000000"))dim.costAntimatter=new Decimal("0.99e9000000000000000");
  }
  if (player.galacticSacrifice.upgrades.includes(11) && !player.galacticSacrifice.upgrades.includes(81)) dim.costAntimatter =  dim.costAntimatter.div(galUpgrade11())
  if (player.galacticSacrifice.upgrades.includes(63)) dim.costAntimatter =  dim.costAntimatter.div(galUpgrade63())
  if (player.money.lt(dim.costAntimatter)) return false

  player.money = player.money.minus(dim.costAntimatter)
  dim.amount = dim.amount.plus(1);
  dim.boughtAntimatter += 1
  dim.costAntimatter = Decimal.pow(timeDimCostMultsAntimatter[tier], dim.boughtAntimatter).times(timeDimStartCostsAntimatter[tier])
  if (dim.costAntimatter.gte(Number.MAX_VALUE)) {
      dim.costAntimatter = Decimal.pow(timeDimCostMultsAntimatter[tier]*1.5, dim.boughtAntimatter).times(timeDimStartCostsAntimatter[tier])
  }
  if (dim.costAntimatter.gte("1e5000")) {
      dim.costAntimatter = Decimal.pow(timeDimCostMultsAntimatter[tier]*2, dim.boughtAntimatter).times(timeDimStartCostsAntimatter[tier])
  }
  if (dim.costAntimatter.gte("1e50000")) {
      dim.costAntimatter = Decimal.pow(timeDimCostMultsAntimatter[tier]*getTDFinalScaling(tier,dim.boughtAntimatter), dim.boughtAntimatter).times(timeDimStartCostsAntimatter[tier])
  }
  if (player.currentChallenge == "postcngm3_1"){
	  dim.costAntimatter = Decimal.pow(timeDimCostMultsAntimatter[tier], (Math.pow(1.01,dim.boughtAntimatter)-1)*100).times(timeDimStartCostsAntimatter[tier])
	  if(Math.pow(1.01,dim.boughtAntimatter) >= 1e100 || dim.costAntimatter.gte("0.99e9000000000000000"))dim.costAntimatter=new Decimal("0.99e9000000000000000");
  }
  if (player.galacticSacrifice.upgrades.includes(11) && !player.galacticSacrifice.upgrades.includes(81)) dim.costAntimatter =  dim.costAntimatter.div(galUpgrade11())
  if (player.galacticSacrifice.upgrades.includes(63)) dim.costAntimatter =  dim.costAntimatter.div(galUpgrade63())
  dim.power = dim.power.times(Math.sqrt(1.5))
  updateEternityUpgrades()
  return true
}

function resetTimeDimensions(a) {
	if(a && player.achievements.includes("ngm4r1"))return;
  for (var i=1; i<9; i++) {
      var dim = player["timeDimension"+i]
      dim.amount = new Decimal(dim.bought)
	  dim.boughtAntimatter = 0
	  dim.costAntimatter = new Decimal(1)
	  dim.power = Decimal.pow(10, dim.bought)
  }
	player.timeShards = new Decimal(0)
}

function buyMaxTimeDimensions() {
  for(var i=1; i<9; i++) while(buyTimeDimension(i)) continue
  for(var i=1; i<9; i++) while(buyTimeDimensionAntimatter(i,1)) continue
}

function autobuyerBuyTimeDimensions(i, bulk){
	let tier=i
	if (tier > player.tdBoosts + 1)return false;
	if (player.firstBought < 1) return false;
	if (!buyTimeDimensionAntimatter(i,1))return false;
	var dim = player["timeDimension"+tier]
	if (player.money.lt(dim.costAntimatter))return false;
	let testamount = Math.min(bulk,9e15);
	bulk=Math.floor(bulk);
	let realbulk = 0
	while(testamount>=1){
		let test=dim.boughtAntimatter + testamount + realbulk
		let test2=Decimal.pow(timeDimCostMultsAntimatter[tier], test).times(timeDimStartCostsAntimatter[tier]) 
		if (test2.gte(Number.MAX_VALUE)) {
			test2 = Decimal.pow(timeDimCostMultsAntimatter[tier]*1.5, test).times(timeDimStartCostsAntimatter[tier])
		}
		if (test2.gte("1e5000")) {
			test2 = Decimal.pow(timeDimCostMultsAntimatter[tier]*2, test).times(timeDimStartCostsAntimatter[tier])
		}
  if (test2.gte("1e50000")) {
      test2 = Decimal.pow(timeDimCostMultsAntimatter[tier]*getTDFinalScaling(tier,test), test).times(timeDimStartCostsAntimatter[tier])
  }
		if (player.currentChallenge == "postcngm3_1"){
			test2 = Decimal.pow(timeDimCostMultsAntimatter[tier], (Math.pow(1.01,test)-1)*100).times(timeDimStartCostsAntimatter[tier])
			if(Math.pow(1.01,test) >= 1e100 || test2.gte("0.99e9000000000000000"))test2=new Decimal("0.99e9000000000000000");
		}
  if (player.galacticSacrifice.upgrades.includes(11) && !player.galacticSacrifice.upgrades.includes(81)) test2 =  test2.div(galUpgrade11())
  if (player.galacticSacrifice.upgrades.includes(63)) test2 =  test2.div(galUpgrade63())
		if (player.money.gte(test2))realbulk += testamount
		if(testamount==1)break;
		testamount=Math.ceil(testamount/2)
		if(realbulk>bulk)realbulk=bulk
	}
	realbulk++;
	if(realbulk>bulk)realbulk=bulk
	//console.log(i,realbulk);
	dim.power = dim.power.times(Decimal.pow(1.5,realbulk/2));
	dim.boughtAntimatter += realbulk;
	dim.amount = dim.amount.plus(realbulk);
dim.costAntimatter = Decimal.pow(timeDimCostMultsAntimatter[tier], dim.boughtAntimatter).times(timeDimStartCostsAntimatter[tier])
  if (dim.costAntimatter.gte(Number.MAX_VALUE)) {
      dim.costAntimatter = Decimal.pow(timeDimCostMultsAntimatter[tier]*1.5, dim.boughtAntimatter).times(timeDimStartCostsAntimatter[tier])
  }
  if (dim.costAntimatter.gte("1e5000")) {
      dim.costAntimatter = Decimal.pow(timeDimCostMultsAntimatter[tier]*2, dim.boughtAntimatter).times(timeDimStartCostsAntimatter[tier])
  }
  if (dim.costAntimatter.gte("1e50000")) {
      dim.costAntimatter = Decimal.pow(timeDimCostMultsAntimatter[tier]*getTDFinalScaling(tier,dim.boughtAntimatter), dim.boughtAntimatter).times(timeDimStartCostsAntimatter[tier])
  }
  if (player.currentChallenge == "postcngm3_1"){
	  dim.costAntimatter = Decimal.pow(timeDimCostMultsAntimatter[tier], (Math.pow(1.01,dim.boughtAntimatter)-1)*100).times(timeDimStartCostsAntimatter[tier])
	  if(Math.pow(1.01,dim.boughtAntimatter) >= 1e100 || dim.costAntimatter.gte("0.99e9000000000000000"))dim.costAntimatter=new Decimal("0.99e9000000000000000");
  }
  if (player.galacticSacrifice.upgrades.includes(11) && !player.galacticSacrifice.upgrades.includes(81)) dim.costAntimatter =  dim.costAntimatter.div(galUpgrade11())
  if (player.galacticSacrifice.upgrades.includes(63)) dim.costAntimatter =  dim.costAntimatter.div(galUpgrade63())
	updateEternityUpgrades()
}

function getTDFinalScaling(tier, amount){
	return Math.max(3,amount*amount*[1.7e-10,2.4e-10,3.1e-10,3.8e-10,6.25e-10,1.25e-9,2.5e-9,5e-9][tier-1]);
}
