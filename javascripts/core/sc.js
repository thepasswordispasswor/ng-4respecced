function getDilationStart(){
	let ret=1;
	if (player.infinityUpgrades.includes("timeMult"))ret=ret+Math.log10(timeMultNum);
	if (player.infinityUpgrades.includes("timeMult2"))ret=ret+Math.log10(timeMultNum2);
	if (player.achievements.includes("r62"))ret = ret+Math.log10(Math.max(1, player.infinityPoints.log10()))
	if (player.challenges.includes("postc4")) {
		for (var i=0; i < player.challenges.length; i++)if (player.challenges[i].includes("post"))ret=ret+Math.log10(2)
	}
	if (player.currentChallenge == "postc4") ret=ret*Math.pow(player.chall2Pow*0.99+0.01,1.5);
	return ret;
}
function getDilationStart2(){
	let ret=25;
	if (player.infinityUpgrades.includes("timeMult"))ret=ret+Math.log10(timeMultNum);
	if (player.infinityUpgrades.includes("timeMult2"))ret=ret+Math.log10(timeMultNum2);
	if (player.challenges.includes("postc8")) {
		ret=ret+Math.log(10-player.tickspeed.log10());
	}
	if (player.achievements.includes("r75")){
		for(let i=0;i<8;i++)if (player.infDimensionsUnlocked[i])ret+=2;
	}
	if (player.currentChallenge == "postc8") ret=ret/Math.sqrt(player.matter.add(1).log10()+1);
	return ret;
}
function getDilationStart3(){
	let ret=35;
	if (player.achievements.includes("r51"))ret=ret+15;
	if (player.infinityUpgrades.includes("timeMult"))ret=ret+Math.log10(timeMultNum);
	if (player.infinityUpgrades.includes("timeMult2"))ret=ret+Math.log10(timeMultNum2);
	if (player.achievements.includes("r64"))ret = ret+6;
	if (player.currentChallenge == "postc10"){
		if(postc10Mult.lte(0))return 1e-4;
		ret=ret-1e-4;
		ret=ret*1/(1-postc10Mult.log10());
		ret=ret+1e-4;
	}
	if (player.achievements.includes("r82")) {
		for (var i=0; i < player.challenges.length; i++)if (player.challenges[i].includes("post"))ret=ret+2
	}
	if (player.challenges.includes("postc10"))ret=ret+10
	return ret;
}
function getDilationStart4(){
	let ret=Math.log10(2)*1024;
	if (player.infinityUpgrades.includes("timeMult"))ret=ret+Math.log10(timeMultNum);
	if (player.infinityUpgrades.includes("timeMult2"))ret=ret+Math.log10(timeMultNum2);
	if (player.achievements.includes("r72"))ret = ret+20
	if (player.achievements.includes("r73"))ret = ret+25
	return ret;
}

function getDilationPower(){
	let ret=0.75;
	if(player.galacticSacrifice.upgrades.includes(44)){
		ret=ret+galUpgrade44();
	}
	if(player.dilation.upgrades.includes(9)){
		ret*=1.05;
	}
	return ret;
}