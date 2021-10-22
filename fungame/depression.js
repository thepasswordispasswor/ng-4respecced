
let game = {
  costs: [new Decimal(1)],
  amounts: [new Decimal(0)],
  depression: new Decimal(1),
  prestige: [new Decimal(1)]
}



function formatValue(x, places) {
  if (x instanceof Decimal) {
    if (x.lt(1000)) return x.toFixed(0);
    else return (x.m.toFixed(places) + "e" + x.e)
  }
  const power = Math.floor(Math.log10(x))
  const matissa = x / Math.pow(10, power)
  if (x < 1000) return x.toString()
  else return ((matissa).toFixed(places) + "e" + power)
}


function insertAfter(newElement,targetElement) {
    // target is what you want it to go after. Look for this elements parent.
    const parent = targetElement.parentNode;

    // if the parents lastchild is the targetElement...
    if (parent.lastChild == targetElement) {
        // add the newElement after the target element.
        parent.appendChild(newElement);
    } else {
        // else the target has siblings, insert the new element between the target and it's next sibling.
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}



function buyStuff(id) {
  const elem = document.getElementById(id)
  var i = id-1
  
  if (game.depression.gte(game.costs[i])) {
    const next = document.getElementById(id+1)
    if (next == null) {
    const btn = document.createElement("button")
    const br = document.createElement("br")
    btn.innerHTML = "Amount: 0<br>Cost:"+formatValue(game.costs[i].times(100), 2)
    btn.id = id+1
    btn.className = "btn"
    btn.onclick = function() {buyStuff(id+1);}
    insertAfter(br, elem)
    insertAfter(btn, br)
    game.costs.push(game.costs[i].times(100))
    game.amounts.push(new Decimal(0))
    if (game.prestige[id] === undefined) game.prestige[id] = 1
    
    if (id > 4) {
      const pbtn = document.createElement("button")
      const otherbtn = document.getElementById(id-4)
      pbtn.id = id-4+"prestige"
      pbtn.className = "prestigebtn"
      pbtn.onclick = function() {prestige(parseInt(this.id));}
      insertAfter(pbtn, otherbtn)
	  var temp=i
      for (var i=1; i<game.costs.length-4; i++) document.getElementById(i+"prestige").innerHTML = "Reset to increase bonus to "+formatValue(pm(Math.max(game.costs.length-i-3, game.prestige[i-1])), 2)+"x boost."
	  i=temp
    }
  }
  game.amounts[i] = game.amounts[i].plus(1)
  game.depression = game.depression.minus(game.costs[i])
  game.costs[i] = game.costs[i].times(2)
  }
}


function hardreset() {
  game = {
    costs: [new Decimal(1)],
    amounts: [new Decimal(0)],
    depression: new Decimal(1),
    prestige: [1]
  }
}


function prestige(id) {
  console.log(id)
  game.prestige[id-1] = Math.max(game.costs.length-id-3, game.prestige[id-1])
  for (var i=2; i<=game.costs.length; i++) {
    var btn = document.getElementById(i)
    btn.parentNode.removeChild(btn)
  }
  var prestiges = document.getElementsByClassName("prestigebtn")
  while(prestiges[0]) prestiges[0].parentNode.removeChild(prestiges[0])
  const brs = document.getElementsByTagName("br")
  while(brs[0]) brs[0].parentNode.removeChild(brs[0])
  game = {
    costs: [new Decimal(1)],
    amounts: [new Decimal(0)],
    depression: new Decimal(1),
    prestige: game.prestige
  }
  for (var i=1; i<game.costs.length-4; i++) document.getElementById(i+"prestige").innerHTML = "Reset to increase bonus to "+formatValue(pm(Math.max(game.costs.length-i-3, game.prestige[i-1])), 2)+"x boost."
}


function save() {
  localStorage.setItem("funsave",JSON.stringify(game));
}

function load() {
  var save = JSON.parse(localStorage.getItem("funsave"))
  if (save) game = save
  var elem = document.getElementById("1")
  for (var i=1; i<game.costs.length; i++) {
    var btn = document.createElement("button")
    var br = document.createElement("br")
    btn.innerHTML = "Amount: 0<br>Cost:"+formatValue(game.costs[i])
    btn.id = i+1
    btn.className = "btn"
    btn.onclick = function() {buyStuff(parseInt(this.id));}
    insertAfter(br, elem)
    insertAfter(btn, br)
    elem = btn
  }
  for (var i=1; i<game.costs.length-4; i++) {
    var pbtn = document.createElement("button")
    var otherbtn = document.getElementById(i)
    pbtn.innerHTML = "Reset to increase bonus to "+formatValue(pm(Math.max(game.costs.length-i-3, game.prestige[i-1])), 2)+"x boost."
    pbtn.id = i+"prestige"
    pbtn.className = "prestigebtn"
    pbtn.onclick = function() {prestige(parseInt(this.id));}
    insertAfter(pbtn, otherbtn)
  }
  game.depression = new Decimal(game.depression)
  for (var i=0; i<Object.keys(game.amounts).length; i++) {
    game.amounts[i] = new Decimal(game.amounts[i])
  }
  for (var i=0; i<Object.keys(game.costs).length; i++) {
    game.costs[i] = new Decimal(game.costs[i])
  }
}



var cheat = false;

function pm(n){
	if(n<=1)return 1;
	if(n<=6)return 1e3**(n-1);
	return (n-2)**25;
}

setInterval(function() {
  game.depression = game.depression.plus(dilate(game.amounts[0].times(pm(game.prestige[0])/10).times(game.costs[0].pow(0.2))))
  document.getElementById("1").innerHTML = "Amount: "+formatValue(game.amounts[0], 2)+"<br>Power: "+formatValue(Decimal.mul(pm(game.prestige[0]),game.costs[0].pow(0.2)), 2)+"x<br>Cost:"+formatValue(game.costs[0], 2)
  for (var i=2; i <= game.costs.length; i++) {
    document.getElementById(i).innerHTML = "Amount: "+formatValue(game.amounts[i-1], 2)+"<br>Power: "+formatValue(Decimal.mul(pm(game.prestige[i-1]),game.costs[i-1].pow(0.2)), 2)+"x<br>Cost:"+formatValue(game.costs[i-1], 2)
    game.amounts[i-2] = game.amounts[i-2].plus(dilate(game.amounts[i-1].times(pm(game.prestige[i-1])/10).times(game.costs[i-1].pow(0.2))))
  }
  
  for (var i=0; i < game.costs.length; i++) {
    if(game.prestige[i] >= 4){
		if (game.depression.gte(game.costs[i])){
			buyStuff(i+1);
			game.depression = game.depression.add(game.costs[i].div(2))
		}
	}
  }
  
  if (cheat) {
  if (game.amounts[game.amounts.length-2] < 5) document.getElementById(game.amounts.length-1).click()
  document.getElementById(game.amounts.length).click()}
  
  document.getElementById("amount").innerHTML = formatValue(game.depression, 2)
}, 33)


setInterval(function() { save() }, 5000)



load()

function dilate(a){
	dilationstart = 1;
	dilationpower=0.75;
	if(game.prestige[0]>=5)dilationpower+=0.00;
    if(a.log10()>=dilationstart){
	  a = Decimal.pow(10, Math.pow(a.log10()/dilationstart, dilationpower)*dilationstart)
    }
	return a;
}