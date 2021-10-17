function getDilationStart(){
	let ret=1;
	if (player.infinityUpgrades.includes("timeMult"))ret=ret+Math.log10(timeMultNum);
	if (player.infinityUpgrades.includes("timeMult2"))ret=ret+Math.log10(timeMultNum2);
	return ret;
}
function getDilationStart2(){
	let ret=25;
	if (player.infinityUpgrades.includes("timeMult"))ret=ret+Math.log10(timeMultNum)
	if (player.infinityUpgrades.includes("timeMult2"))ret=ret+Math.log10(timeMultNum2);
	return ret;
}
function getDilationStart3(){
	let ret=35;
	if (player.infinityUpgrades.includes("timeMult"))ret=ret+Math.log10(timeMultNum);
	if (player.infinityUpgrades.includes("timeMult2"))ret=ret+Math.log10(timeMultNum2);
	return ret;
}