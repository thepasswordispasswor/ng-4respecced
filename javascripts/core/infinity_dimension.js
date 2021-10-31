//infinity dimensions


function DimensionDescription(tier) {
  var name = TIER_NAMES[tier];

  let description = shortenDimensions(player['infinityDimension'+tier].amount) + ' (' + player['infinityDimension'+tier].bought + ')';

  if (ECTimesCompleted("eterc7")) {
    if (tier < 9) {
        description += '  (+' + formatValue(player.options.notation, DimensionRateOfChange(tier), 2, 2) + '%/s)';
    }
  } else {
    if (tier < 8) {
        description += '  (+' + formatValue(player.options.notation, DimensionRateOfChange(tier), 2, 2) + '%/s)';
    }
  }

  return description;
}


function DimensionRateOfChange(tier) {
  if (tier === 8) var toGain = getTimeDimensionProduction(1).pow(ECTimesCompleted("eterc7")*0.2).minus(1).max(0)
  else var toGain = DimensionProduction(tier+1)
  var current = Decimal.max(player["infinityDimension"+tier].amount, 1);
  var change  = toGain.times(10).dividedBy(current);
  return change;
}




function updateInfinityDimensions() {
  if (document.getElementById("infinitydimensions").style.display == "block" && document.getElementById("dimensions").style.display == "block") {
    for (let tier = 1; tier <= 8; ++tier) {
        document.getElementById("infD"+tier).textContent = DISPLAY_NAMES[tier] + " Infinity Dimension x" + shortenMoney(DimensionPower(tier));
        document.getElementById("infAmount"+tier).textContent = DimensionDescription(tier);
        var name = TIER_NAMES[tier];
        if (!player.infDimensionsUnlocked[tier-1]) {
            break;
        }

        document.getElementById("infRow"+tier).style.display = "table-row";
        document.getElementById("infRow"+tier).style.visibility = "visible";
    }
  }
}

function DimensionProduction(tier) {
  if (player.currentEternityChall == "eterc10") return new Decimal(0)
  if (player.currentEternityChall == "eterc2")  return new Decimal(0)
  var dim = player["infinityDimension"+tier]
  var ret = dim.amount
  if (!(player.currentEternityChall == "eterc11"))ret = ret.times(DimensionPower(tier))
  if (player.challenges.includes("postc8")) {
  let tick = new Decimal(1000).dividedBy(new Decimal(player.tickspeed))
    if(tick.log10()>=dilationstart){
	  tick = Decimal.pow(10, Math.pow(tick.log10()/dilationstart, getDilationPower())*dilationstart)
	  if (player.dilation.active)tick = Decimal.pow(10, Math.pow(tick.log10()/dilationstart, getDilationPower())*dilationstart)
    }
    if(tick.log10()>=dilationstart4){
	  tick = Decimal.pow(10, Math.pow(tick.log10()/dilationstart4, getDilationPower())*dilationstart4)
    }
	  ret = ret.times(tick)
  }
  return ret;
}

function DimensionPower(tier) {
  var dim = player["infinityDimension"+tier]
  if (player.currentEternityChall == "eterc11") return new Decimal(1)
  var mult = dim.power

  mult = mult.times(infDimPow)

  mult = mult.times(kongAllDimMult)
  if (player.achievements.includes("r94") && tier == 1) mult = mult.times(2);
  if (player.achievements.includes("r66")) mult = mult.times(Math.max(1, Math.abs(player.tickspeed.log10()) / 29))

  if (player.timestudy.studies.includes(72) && tier == 4) {
      mult = mult.times(calcTotalSacrificeBoost().pow(0.04).max(1).min("1e30000"))
  }

  if (player.timestudy.studies.includes(82)) {
      mult = mult.times(Decimal.pow(1.0000109,Math.pow(player.resets,2)))
  }

  if (player.eternityUpgrades.includes(1)) {
      mult = mult.times(player.eternityPoints.plus(1))
  }

  if (player.eternityUpgrades.includes(2)) mult = mult.times(Decimal.pow(Math.min(player.eternities, 100000)/200 + 1, Math.log(Math.min(player.eternities, 100000)*2+1)/Math.log(4)).times(new Decimal((player.eternities-100000)/200 + 1).times(Math.log((player.eternities- 100000)*2+1)/Math.log(4)).max(1)))

  if (player.eternityUpgrades.includes(3)) mult = mult.times(Decimal.pow(2,300/Math.max(infchallengeTimes, player.achievements.includes("r112") ? 6.1 : 7.5)))

  if (player.timestudy.studies.includes(92)) mult = mult.times(Decimal.pow(2, 600/Math.max(player.bestEternity, 20)))
  if (player.timestudy.studies.includes(162)) mult = mult.times(1e234)
  if (ECTimesCompleted("eterc2") !== 0 && tier == 1) mult = mult.times(player.infinityPower.pow(4.5/(700-ECTimesCompleted("eterc2")*100)).plus(1)).times(new Decimal(player.infinityPower.plus(10).log10()).pow(1000))
  if (player.currentEternityChall == "eterc2") mult = mult.times(0)

  if (ECTimesCompleted("eterc4") !== 0) mult = mult.times(player.infinityPoints.pow(0.4 + ECTimesCompleted("eterc4")*0.2))
  
  
  
  if (mult.lt(1)) mult = new Decimal(1)

 dilationstart = getDilationStart();
    if(mult.log10()>=dilationstart){
	  mult = Decimal.pow(10, Math.pow(mult.log10()/dilationstart, getDilationPower())*dilationstart)
	  if (player.dilation.active)mult = Decimal.pow(10, Math.pow(mult.log10()/dilationstart, getDilationPower())*dilationstart)
    }
 dilationstart4 = getDilationStart4();
    if(mult.log10()>=dilationstart4){
	  mult= Decimal.pow(10, Math.pow(mult.log10()/dilationstart4, getDilationPower())*dilationstart4)
    }
  // post-dilation
  if (player.replicanti.unl && player.replicanti.amount.gt(1)) {
      var replmult = getReplMult();

      mult = mult.times(replmult)
  }
  // also post-dilation
  if (ECTimesCompleted("eterc9") !== 0) mult = mult.times(player.timeShards.pow(ECTimesCompleted("eterc9")*0.5).plus(1).min(new Decimal("1e4000")))
  if (player.achievements.includes("r75")) mult = mult.times(player.achPow);
  return mult
}

function getReplMult () {
  let replmult = Decimal.pow(Decimal.log2(Decimal.max(player.replicanti.amount,1).add(1)), Math.pow(player.galaxies, .4))

  if (player.timestudy.studies.includes(21)) replmult = replmult.plus(Decimal.pow(player.replicanti.amount, Math.pow(player.galaxies, .5)*0.05))
  if (player.timestudy.studies.includes(102)) replmult = replmult.times(Decimal.pow(5, player.replicanti.galaxies))
  return replmult;
}




function resetInfDimensions() {

  if (player.infDimensionsUnlocked[0]) {
      player.infinityPower = new Decimal(0)
  }
  if (player.infDimensionsUnlocked[7] && player.infinityDimension6.amount != 0 && ECTimesCompleted("eterc7") > 0){
      player.infinityDimension8.amount = new Decimal(player.infinityDimension8.baseAmount)
      player.infinityDimension7.amount = new Decimal(player.infinityDimension7.baseAmount)
      player.infinityDimension6.amount = new Decimal(player.infinityDimension6.baseAmount)
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[7] && player.infinityDimension6.amount != 0){
      player.infinityDimension7.amount = new Decimal(player.infinityDimension7.baseAmount)
      player.infinityDimension6.amount = new Decimal(player.infinityDimension6.baseAmount)
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[6] && player.infinityDimension6.amount != 0){
      player.infinityDimension6.amount = new Decimal(player.infinityDimension6.baseAmount)
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[5] && player.infinityDimension6.amount != 0){
      player.infinityDimension5.amount = new Decimal(player.infinityDimension5.baseAmount)
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[4] && player.infinityDimension5.amount != 0){
      player.infinityDimension4.amount = new Decimal(player.infinityDimension4.baseAmount)
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  if (player.infDimensionsUnlocked[3] && player.infinityDimension4.amount != 0){
      player.infinityDimension3.amount = new Decimal(player.infinityDimension3.baseAmount)
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  else if (player.infDimensionsUnlocked[2] && player.infinityDimension3.amount != 0){
      player.infinityDimension2.amount = new Decimal(player.infinityDimension2.baseAmount)
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }
  else if (player.infDimensionsUnlocked[1] && player.infinityDimension2.amount != 0){
      player.infinityDimension1.amount = new Decimal(player.infinityDimension1.baseAmount)
  }

}

var infCostMults = [null, 1e3, 1e6, 1e8, 1e10, 1e15, 1e20, 1e25, 1e30]
var infPowerMults = [null, 500, 300, 100, 50, 25, 10, 5, 5]
var infBaseCost = [null, 1e8, 1e9, 1e10, 1e20, 1e30, 1e70, 1e110, 1e150]

function getInfBuy10Mult (tier){
  if (player.infinityUpgrades.includes("postinfi72")&&player.galacticSacrifice.upgrades.includes(65)) return Number.MAX_VALUE
  if (player.infinityUpgrades.includes("postinfi72")) return Number.MAX_VALUE**0.2
  return infPowerMults[tier]
}

function getInfBuy10CostDiv (tier){
  let div = 1;
  if (player.infinityUpgrades.includes("postinfi53")) div = 50
  let MAX = Math.pow(infCostMults[tier],.9);
  return Math.min(div,MAX)
  
}

function buyManyInfinityDimension(tier) {
  if (player.eterc8ids <= 0 && player.currentEternityChall == "eterc8") return false
  var dim = player["infinityDimension"+tier]
  if (player.infinityPoints.lt(dim.cost)) return false
  if (!player.infDimensionsUnlocked[tier-1]) return false
  if (player.eterc8ids == 0) return false
  player.infinityPoints = player.infinityPoints.minus(dim.cost)
  dim.amount = dim.amount.plus(10);
  dim.power = dim.power.times(getInfBuy10Mult(tier))
  dim.baseAmount += 10
  dim.cost = new Decimal(infBaseCost[tier]).times(Decimal.pow(infCostMults[tier]/getInfBuy10CostDiv(tier), (dim.baseAmount/10 + 1)*(ECTimesCompleted("eterc12")?1-ECTimesCompleted("eterc12")*0.008:1)))

  if (player.currentEternityChall == "eterc8") player.eterc8ids-=1
  document.getElementById("eterc8ids").textContent = "You have "+player.eterc8ids+" purchases left."
  return true
}

function buyMaxInfDims(tier) {
  var dim = player["infinityDimension"+tier]

  if (player.infinityPoints.lt(dim.cost)) return false
  if (!player.infDimensionsUnlocked[tier-1]) return false

  let costMult = Math.pow(infCostMults[tier]/getInfBuy10CostDiv(tier), ECTimesCompleted("eterc12")?1-ECTimesCompleted("eterc12")*0.008:1);
  var toBuy = Math.floor((player.infinityPoints.log10() - dim.cost.log10()) / Math.log10(costMult))
  dim.cost = dim.cost.times(Decimal.pow(costMult, toBuy-1))
  player.infinityPoints = player.infinityPoints.minus(dim.cost)
  dim.cost = dim.cost.times(costMult)
  dim.amount = dim.amount.plus(10*toBuy);
  dim.power = dim.power.times(Decimal.pow(getInfBuy10Mult(tier), toBuy))
  dim.baseAmount += 10*toBuy
  buyManyInfinityDimension(tier)
}

function switchAutoInf(tier) {
  if (player.infDimBuyers[tier-1]) {
      player.infDimBuyers[tier-1] = false
      document.getElementById("infauto"+tier).textContent = "Auto: OFF"
  } else {
      player.infDimBuyers[tier-1] = true
      document.getElementById("infauto"+tier).textContent = "Auto: ON"
  }
}

function toggleAllInfDims() {
  if (player.infDimBuyers[0]) {
      for (var i=1; i<9; i++) {
          player.infDimBuyers[i-1] = false
          document.getElementById("infauto"+i).textContent = "Auto: OFF"
      }
  } else {
      for (var i=1; i<9; i++) {
          if (player.eternities - 10>=i) {
              player.infDimBuyers[i-1] = true
              document.getElementById("infauto"+i).textContent = "Auto: ON"
          }
      }
  }
}

function loadInfAutoBuyers() {
  for (var i=1; i<9; i++) {
      if (player.infDimBuyers[i-1]) document.getElementById("infauto"+i).textContent = "Auto: ON"
      else document.getElementById("infauto"+i).textContent = "Auto: OFF"
  }
}

var infDimPow = 1
