//jshint: "esversion": 8

import {
  Node,
} from './Node.js';

import {
  updateDynamicVariables
} from './DynamicVariable.js';

import {
  InputNode
} from './InputNode.js';

import {
  OutputNode
} from './OutputNode.js';

import {
  Network
} from './Network.js';

import {
  NetworkVisualization
} from './NetworkVisualization.js';

import {
  noderadius
} from './constants.js'

d3.select("#header")
  .style("display", "flex")
d3.select("#text")
  .style("margin-left", "50px")
  .style("margin-top", "10px")
  .style("width", "70%")
  .style("font-weight", "bold")
  .style("font-family", "Arial");
d3.select("#text").append("h1")
  .attr("id", "title")
d3.select("#text").append("h3")
  .attr("id", "goal")
d3.select("#text").append("h3")
  .attr("id", "descr")
d3.select("#logo_div")
  .style("float", "left")
  .style("margin-left", "1%")
  .style("margin-top", "1%");
d3.select("#logo")
  .attr("src", "src/img/logo.png")
  .style("width","400px");
d3.select("#logo_div").append("h3")
  .style("font-weight", "normal")
  .style("font-family", "Arial")
  .text("KI-Experience - Digital Innovation Space");
d3.select("#footer")
  .style("height", "110px")
  .style("background-color", "#f1f1f1")

d3.select("#footer").append("a")
  .attr("id","previous")
  .attr("href","#")
  .style("margin-top", "8px")
  .style("margin-left", "44%")
  .style("background-color", "#0068B4")
  .style("color", "white")
  .style("border-radius", "50%")
  .style("font-weight", "bold")
  .text("<")
  
d3.select("#footer").append("a")
  .attr("id","next")
  .attr("href","#")
  .style("margin-left", "5%")
  .style("margin-top", "5px")
  .style("background-color", "#0068B4")
  .style("color", "white")
  .style("border-radius", "50%")
  .style("font-weight", "bold")
  .text(">")

d3.select("#main")
  .style("height", "95%")
  .style("display", "flex")

d3.select("svg")
  .style("width", "72%")
  
d3.select("#tablediv")
  .style("display", "flex")
  .style("flex-direction", "column")
  .style("width", "25%")
  
d3.select("#tabletop")
  .style("height", "20%")

d3.select("#table")
  .style("height", "60%")

d3.select("#tablebot")
  .style("height", "20%")
  
d3.select("#truthtable").append("tr").attr("id", "r0") 

for(let i = 0; i < 4; i++){
  switch(i){
    case 0: 
      d3.select("#truthtable").select("#r0").append("th")
        .attr("id", "r0c"+i) 
        .text("Eingang 1") 
      break;
    case 1: 
      d3.select("#truthtable").select("#r0").append("th")
        .attr("id", "r0c"+i) 
        .text("Eingang 2") 
      break;
    case 2: 
      d3.select("#truthtable").select("#r0").append("th")
        .attr("id", "r0c"+i) 
        .text("Ist") 
      break;
    case 3: 
      d3.select("#truthtable").select("#r0").append("th")
        .attr("id", "r0c"+i) 
        .text("Soll") 
      break;
  }
  d3.select("#truthtable").append("tr").attr("id", "r"+(i+1)) 
  for (let j = 0; j < 4; j++){
    d3.select("#truthtable").select("#r"+(i+1)).append("td").attr("id", "r"+(i+1)+"c"+j)   
  }
}

d3.select("#r1c0").text("0")
d3.select("#r1c1").text("0")
d3.select("#r2c0").text("1")
d3.select("#r2c1").text("0")
d3.select("#r3c0").text("0")
d3.select("#r3c1").text("1")
d3.select("#r4c0").text("1")
d3.select("#r4c1").text("1")

d3.selectAll("th")
  .style("font-family", "Arial")
  .style("font-weight", "bold")
  .style("border-bottom" ,"1px solid #ddd")
  .style("background-color", "#0068B4")
  .style("color", "white")
  .style("height", "50px")
  .style("width", "100px")
  
d3.selectAll("td")
  .style("font-family", "Arial")
  .style("border-bottom" ,"2px solid #ddd")
  .style("height", "30px")

window.addEventListener('DOMContentLoaded', (event) => {
  goBack(); 
  document.querySelector("#previous").onclick = (() => goBack());
  document.querySelector("#next").onclick = (() => goNext());
});

var id = -1; 

function goBack(){
  if (id != 0){
    id = 0; 
    const nodes = [
      new InputNode(() => 1),
      new InputNode(() => 0),
    
      new Node(),
    
      new OutputNode()
    ];
    
    let maxw = window.innerWidth;
    let maxh = window.innerHeight;

    const y = [0, 0, 0, 1]; 

    //output from console
    nodes[0].x = 0.03*maxw + noderadius;
    nodes[0].y = 0.1*maxh;
    nodes[1].x = 0.03*maxw + noderadius;
    nodes[1].y = 0.5*maxh;
    nodes[2].x = 0.35*maxw; 
    nodes[2].y = 0.3*maxh;
    nodes[3].x = 0.52*maxw;
    nodes[3].y = 0.3*maxh;
    
    nodes[0].addChild(nodes[2], 1);
    nodes[1].addChild(nodes[2], 1);
    nodes[2].addChild(nodes[3], 1); 
    
    nodes[2].outedges[0].adjustable = false;
    nodes[0].adjustable = false; 
    nodes[1].adjustable = false; 
    
    function animatestep() {
      nodes[0].format = v => Math.round(v);
      nodes[1].format = v => Math.round(v);
      nodes[0].setUserParameter(Math.min(1, Math.max(0, Math.round(nodes[0].getActivation()))));
      nodes[1].setUserParameter(Math.min(1, Math.max(0, Math.round(nodes[1].getActivation()))));
      
      nodes[3].target = (nodes[0].getActivation() * nodes[1].getActivation());
      
      let y_res = [Number((nodes[0].outedges[0].weight*0 + nodes[1].outedges[0].weight*0 + nodes[2].bias)>0), 
                   Number((nodes[0].outedges[0].weight*1 + nodes[1].outedges[0].weight*0 + nodes[2].bias)>0), 
                   Number((nodes[0].outedges[0].weight*0 + nodes[1].outedges[0].weight*1 + nodes[2].bias)>0), 
                   Number((nodes[0].outedges[0].weight*1 + nodes[1].outedges[0].weight*1 + nodes[2].bias)>0)]; 

      d3.select("#r1c2").text(y_res[0])
      d3.select("#r2c2").text(y_res[1])
      d3.select("#r3c2").text(y_res[2])
      d3.select("#r4c2").text(y_res[3])

      //format table 
      for (let i = 0; i < 4; i++){
        if (y_res[i] != y[i]){
          d3.select("#r"+(i+1)+"c2").style("color", "red");
        } else {
          d3.select("#r"+(i+1)+"c2").style("color", "green")
        }
      }
    }
    
    var nv = new NetworkVisualization(new Network(
      nodes,
      [nodes[0],nodes[1]],
      [nodes[3]]
    ), animatestep);
    
    d3.select("#text").select("#title")
      .text("Aufgabe 1: Logisches UND");
    d3.select("#text").select("#goal")
      .text("Ziel: Der Ausgang darf nur aktiv sein, wenn beide Eingänge aktiv sind.");
    d3.select("#text").select("#descr")
      .text("Stellen Sie die Eingangsgewichte und das Bias-Gewicht entsprechend ein.");
          
    d3.select("#r1c3").text("0")
    d3.select("#r2c3").text("0")
    d3.select("#r3c3").text("0")
    d3.select("#r4c3").text("1")
    
    nv.animate();
    nv.addInteraction();
  }
}

function goNext(){
  if (id != 1){
    id = 1; 
    const nodes = [
      new InputNode(() => 1),
      new InputNode(() => 0),
    
      new Node(),
    
      new OutputNode()
    ];
    
    let maxw = window.innerWidth;
    let maxh = window.innerHeight;

    const y = [0, 1, 1, 1];

    //output from console
    nodes[0].x = 0.03*maxw + noderadius;
    nodes[0].y = 0.1*maxh;
    nodes[1].x = 0.03*maxw + noderadius;
    nodes[1].y = 0.5*maxh;
    nodes[2].x = 0.35*maxw; 
    nodes[2].y = 0.3*maxh;
    nodes[3].x = 0.52*maxw;
    nodes[3].y = 0.3*maxh;
    
    nodes[0].addChild(nodes[2], 1);
    nodes[1].addChild(nodes[2], 1);
    nodes[2].addChild(nodes[3], 1); 
    
    nodes[2].outedges[0].adjustable = false;
    nodes[0].adjustable = false; 
    nodes[1].adjustable = false; 
    
    function animatestep() {
      nodes[0].format = v => Math.round(v);
      nodes[1].format = v => Math.round(v);
      nodes[0].setUserParameter(Math.min(1, Math.max(0, Math.round(nodes[0].getActivation()))));
      nodes[1].setUserParameter(Math.min(1, Math.max(0, Math.round(nodes[1].getActivation()))));
      
      nodes[3].target = (Math.min(1, Math.max(0, Math.round(nodes[0].getActivation() + nodes[1].getActivation()))));
    
      let y_res = [Number((nodes[0].outedges[0].weight*0 + nodes[1].outedges[0].weight*0 + nodes[2].bias)>0), 
                   Number((nodes[0].outedges[0].weight*1 + nodes[1].outedges[0].weight*0 + nodes[2].bias)>0), 
                   Number((nodes[0].outedges[0].weight*0 + nodes[1].outedges[0].weight*1 + nodes[2].bias)>0), 
                   Number((nodes[0].outedges[0].weight*1 + nodes[1].outedges[0].weight*1 + nodes[2].bias)>0)]; 

      d3.select("#r1c2").text(y_res[0])
      d3.select("#r2c2").text(y_res[1])
      d3.select("#r3c2").text(y_res[2])
      d3.select("#r4c2").text(y_res[3])

      //format table 
      for (let i = 0; i < 4; i++){
        if (y_res[i] != y[i]){
          d3.select("#r"+(i+1)+"c2").style("color", "red");
        } else {
          d3.select("#r"+(i+1)+"c2").style("color", "green")
        }
      }
    
    }
    
    const nv = new NetworkVisualization(new Network(
      nodes,
      [nodes[0],nodes[1]],
      [nodes[3]]
    ), animatestep);
    
    d3.select("#text").select("#title")
      .text("Aufgabe 2: Logisches ODER");
    d3.select("#text").select("#goal")
      .text("Ziel: Der Ausgang darf nur aktiv sein, wenn einer der beiden Eingänge oder beide aktiv sind.");
    d3.select("#text").select("#descr")
      .text("Stellen Sie die Eingangsgewichte und das Bias-Gewicht entsprechend ein.");
    
    d3.select("#r1c3").text("0")
    d3.select("#r2c3").text("1")
    d3.select("#r3c3").text("1")
    d3.select("#r4c3").text("1")
    
    nv.animate();
    nv.addInteraction();
  }
}




