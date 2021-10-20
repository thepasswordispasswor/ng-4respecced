function getDilationStart(){
	let ret=1;
	if (player.infinityUpgrades.includes("timeMult"))ret=ret+Math.log10(timeMultNum);
	if (player.infinityUpgrades.includes("timeMult2"))ret=ret+Math.log10(timeMultNum2);
	if (player.challenges.includes("postc4")) {
		for (var i=0; i < player.challenges.length; i++)if (player.challenges[i].includes("post"))ret=ret+Math.log10(2)
	}
	if (player.currentChallenge == "postc4") ret=ret*(player.chall2Pow+0.01)*(player.chall2Pow+0.01);
	return ret;
}
function getDilationStart2(){
	let ret=25;
	if (player.infinityUpgrades.includes("timeMult"))ret=ret+Math.log10(timeMultNum);
	if (player.infinityUpgrades.includes("timeMult2"))ret=ret+Math.log10(timeMultNum2);
	return ret;
}
function getDilationStart3(){
	let ret=35;
	if (player.achievements.includes("r51"))ret=ret+10;
	if (player.infinityUpgrades.includes("timeMult"))ret=ret+Math.log10(timeMultNum);
	if (player.infinityUpgrades.includes("timeMult2"))ret=ret+Math.log10(timeMultNum2);
	return ret;
}
function getDilationStart4(){
	let ret=Math.log10(2)*1024;
	if (player.infinityUpgrades.includes("timeMult"))ret=ret+Math.log10(timeMultNum);
	if (player.infinityUpgrades.includes("timeMult2"))ret=ret+Math.log10(timeMultNum2);
	return ret;
}