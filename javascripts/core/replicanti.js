function getReplicantiReplicateAmount(upgraded){
	let ret=player.replicanti.chance+1;
	if(upgraded === true)ret=ret+0.01;
	if(player.timeless.upgrades.includes(26))ret=Math.pow(ret,TLPU26());
	if(!upgraded && ret>=7.54)giveAchievement("Replicate Expertise");
	return ret;
}



function getReplMult () {
  let replmult = Decimal.pow(Decimal.log2(Decimal.max(player.replicanti.amount,1).add(1)), Math.pow(player.galaxies, .4))

  if (player.timestudy.studies.includes(21)) replmult = replmult.plus(timeStudy21())
	  
  if(player.galacticSacrifice.upgrades.includes(71)){
	  replmult = Decimal.pow(Decimal.log2(Decimal.max(player.replicanti.amount,1).add(1)), player.galaxies)

  if (player.timestudy.studies.includes(21)) replmult = replmult.times(timeStudy21())
  }
  if (player.timestudy.studies.includes(102)) replmult = replmult.times(timeStudy102())
  return replmult;
}