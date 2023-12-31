//jshint: "esversion": 8
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@5/+esm';

import {
  Node,
} from './Node.js';

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
  Level
} from './Level.js';

import {
  unit,
  noderadius
} from './constants.js';


const addnodeinfo = (node, text, offset = noderadius + 30) => {
  d3.select("#levelinfo").append("text")
    .text(text)
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .attr("font-size", 20)
    .attr("x", node.x)
    .attr("y", node.y + offset);
};

export class MyAndLevel extends Level {
  constructor() {
    const omega1 = 1 + Math.random();

    const nodes = [
      new InputNode(() => 1),
      new InputNode(() => 0),
    
      new Node(),
    
      new OutputNode()
    ];
    
    //output from console
    nodes[0].x = 130;
    nodes[0].y = 100;
    nodes[1].x = 130;
    nodes[1].y = 500;
    nodes[2].x = 700;
    nodes[2].y = 300;
    nodes[3].x = 1000;
    nodes[3].y = 300;
    
    nodes[0].addChild(nodes[2], 1);
    nodes[1].addChild(nodes[2], 1);
    nodes[2].addChild(nodes[3], 1); 
    
    nodes[2].outedges[0].adjustable = false;
    nodes[0].adjustable = false; 
    nodes[1].adjustable = false; 

    const trainXs = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1]
    ];
    const trainYs = trainXs.map(p => [(p[0] * p[1])]);

    const nw = new Network(
      nodes,
      [nodes[0], nodes[1]], //input nodes
      [nodes[3]] //output nodes
    );

    super("Aufgabe 1: Logisches UND",
      nw,
      ["Eingang 1", "Eingang 2"], trainXs, //temperatures are internally divided by 10.
      ["UND"], trainYs,
      "The inputs of this network are either 0 or 1. The output on the right should be 1 only if both inputs are 1. Otherwise, it should be 0."
    );

    this.animatestep = function() {
      nodes[0].format = v => Math.round(v);
      nodes[1].format = v => Math.round(v);
      nodes[0].setUserParameter(Math.min(1, Math.max(0, Math.round(nodes[0].getActivation()))));
      nodes[1].setUserParameter(Math.min(1, Math.max(0, Math.round(nodes[1].getActivation()))));
      
      nodes[3].target = (nodes[0].getActivation() * nodes[1].getActivation());
    };

  }
}


export class TutorialLevelA extends Level {
  constructor() {
    const omega1 = 1 + Math.random();

    const nodes = [
      new InputNode(() => 0.5 + 0.5 * Math.sin(omega1 * Date.now() / 1000) * Math.exp(-0.1 * (Date.now() - this.t0) / 1000)),
      new OutputNode()
    ];
    nodes[0].x = 200;
    nodes[0].y = 500;
    nodes[0].allownegative = true;
    nodes[1].x = 800;
    nodes[1].y = 550;
    nodes[0].addChild(nodes[1], 1);

    const f = c => ((c * 2));
    const trainXs = [1, 2, 3];
    const trainYs = trainXs.map(f);

    super("A simple Network: Double its input!",
      new Network(
        nodes,
        [nodes[0]], //input nodes
        [nodes[1]] //output nodes
      ),
      ["input"], trainXs.map(x => [x]), //temperatures are internally divided by 10.
      ["desired output"], trainYs.map(x => [x]),
      "This is a minimalistic neural Network. Can you adjust the network such that it doubles the input?"
    );

    this.animatestep = function() {
      nodes[1].target = f(nodes[0].getActivation());
    };

    this.onenter = function() {
      addnodeinfo(nodes[0], "You can adjust the input of the network.");
      addnodeinfo(nodes[1], "The output of the neural network.");

      d3.select("#levelinfo").append("text")
        .text("Adjust the multiplication factor along the connection.")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .attr("font-size", 20)
        .attr("x", (nodes[0].x + nodes[1].x) / 2)
        .attr("y", (nodes[0].y + nodes[1].y) / 2 - 100);

      document.querySelector(".trainingdata").classList.remove("visible");
    };

    this.onleave = function() {
      document.querySelector(".trainingdata").classList.add("visible");
    };
  }
}

export class TutorialLevelB extends Level {
  constructor() {
    const omega1 = 1 + Math.random();

    const nodes = [
      new InputNode(() => 0.5 + 2 * Math.sin(omega1 * Date.now() / 1000) * Math.exp(-0.1 * (Date.now() - this.t0) / 1000)),
      new Node(),
      new OutputNode()
    ];
    nodes[0].allownegative = true;
    nodes[0].x = 200;
    nodes[0].y = 500;
    nodes[1].x = 500;
    nodes[1].y = 550;
    nodes[1].adjustable = false;

    nodes[2].x = 800;
    nodes[2].y = 500;
    nodes[0].addChild(nodes[1], -2);
    nodes[1].addChild(nodes[2], 1);
    nodes[1].outedges[0].adjustable = false;

    const f = c => Math.max(0, (c * 1));
    const trainXs = [-2, -1, 0, 1, 2, 3];
    const trainYs = trainXs.map(f);

    super("Propagate only positive values!",
      new Network(
        nodes,
        [nodes[0]], //input nodes
        [nodes[2]] //output nodes
      ),
      ["input"], trainXs.map(x => [x]), //temperatures are internally divided by 10.
      ["output"], trainYs.map(x => [x]),
      "Can you modify this network such that it outputs its positive input or zero if the input was negative? It should predict the data of the training table below."
    );


    this.animatestep = function() {
      nodes[2].target = f(nodes[0].getActivation());
    };

    this.onenter = function() {
      addnodeinfo(nodes[1], `Internal nodes ignore negative inputs.`);
    };

  }
}

export class TutorialLevelC extends Level {
  constructor() {
    const omega1 = 1 + Math.random();

    const nodes = [
      new InputNode(() => -0.2 + 1 * Math.sin(omega1 * Date.now() / 1000) * Math.exp(-0.1 * (Date.now() - this.t0) / 1000)),
      new Node(),
      new OutputNode()
    ];
    nodes[0].allownegative = true;
    nodes[0].x = 200;
    nodes[0].y = 500;
    nodes[1].x = 500;
    nodes[1].y = 550;
    nodes[1].adjustable = true;
    nodes[2].x = 800;
    nodes[2].y = 500;
    nodes[0].addChild(nodes[1], 1);
    nodes[1].addChild(nodes[2], 1);

    nodes[0].outedges[0].adjustable = false;
    nodes[1].outedges[0].adjustable = false;

    nodes[1].bias = 1;

    const f = c => Math.max(0, (c - 1));
    const trainXs = [-2, -1, 0, 1, 2, 3];
    const trainYs = trainXs.map(f);

    super("Internal nodes with bias",
      new Network(
        nodes,
        [nodes[0]], //input nodes
        [nodes[2]] //output nodes
      ),
      ["input"], trainXs.map(x => [x]), //temperatures are internally divided by 10.
      ["output"], trainYs.map(x => [x]),
      "Can you modify the parameter of this network such that it outputs by how much the input is greater than 1. If the input is smaller than 1 it should output zero."
    );


    this.animatestep = function() {
      nodes[2].target = f(nodes[0].getActivation());
    };

    this.onenter = function() {
      addnodeinfo(nodes[1], `An adjustable bias is added to the input of an internal node.`);
    };


  }
}

export class WeatherLevel extends Level {
  constructor() {
    const omega1 = 1 + Math.random();

    const nodes = [
      new InputNode(() => 0.5 + 0.5 * Math.sin(omega1 * Date.now() / 1000) * Math.exp(-0.3 * (Date.now() - this.t0) / 1000)),
      new InputNode(() => 1),

      new Node(),
      new Node(),

      new OutputNode()
    ];

    for (let i in [2, 3]) {
      nodes[[2, 3][i]].bias = 2 * (Math.random() - 0.5);
    }

    //output from console
    nodes[0].x = 200;
    nodes[0].y = 400;
    nodes[1].x = 200;
    nodes[1].y = 600;
    nodes[2].x = 509;
    nodes[2].y = 300;
    nodes[3].x = 500;
    nodes[3].y = 700;
    nodes[4].x = 800;
    nodes[4].y = 500;

    nodes[0].addChild(nodes[2], 1);
    nodes[0].addChild(nodes[3], 1);
    nodes[1].addChild(nodes[2], 1);
    nodes[1].addChild(nodes[3], 1);
    nodes[2].addChild(nodes[4], 1);
    nodes[3].addChild(nodes[4], 1);

    const nw = new Network(
      nodes,
      [nodes[0], nodes[1]], //input nodes
      [nodes[4]] //output nodes
    );

    const trainingdata = [{
        cloudiness: 0,
        inside: 0,
      },
      {
        cloudiness: 0.5,
        inside: 0,
      },
      {
        cloudiness: 1,
        inside: 0,
      },
      {
        cloudiness: 1,
        inside: 1,
      },
      {
        cloudiness: 0.5,
        inside: 1,
      },
      {
        cloudiness: 0,
        inside: 1,
      }
    ];
    const formula = (c, i) => (i == 1) ? (2.1 - 0.1 * c) : (2.5 - 1.2 * c);

    //nodes[0].format = cls => `cloudiness: ${cls.toFixed(1)}`;
    //nodes[1].format = v => Math.round(v) == 1 ? '1 (inside)' : '0 (outside)';
    nodes[1].format = v => v.toFixed(0);
    nodes[4].format = temp => `${(temp*10).toFixed(0)}°C`;
    super("Can you predict the temperature given the cloudiness and the fact of being inside?", nw,
      ["cloudiness", "inside?"], trainingdata.map(td => [td.cloudiness, td.inside]),
      ["temperature"], trainingdata.map(td => [formula(td.cloudiness, td.inside)]),
      "Outside (insideness = 0), the temperature depends on the amount of clouds: The higher the cloudiness, the lower the temperature. Inside (insideness = 1), the temperature is almost constant 20°C."
    );

    this.animatestep = function() {
      //TODO add some nicer visualization for inside, cloudiness, and temperature.

      nodes[0].setUserParameter(Math.min(1, Math.max(0, (nodes[0].getActivation()))));
      //round input
      nodes[1].setUserParameter(Math.min(1, Math.max(0, Math.round(nodes[1].getActivation()))));

      nodes[4].target = formula(nodes[0].getActivation(), nodes[1].getActivation());
    };

    this.onenter = function() {
      addnodeinfo(nodes[0], `amount of clouds`, -noderadius - 20);
      addnodeinfo(nodes[1], `inside/outside`);
      addnodeinfo(nodes[4], `predicted temperature`);
    };
  }

}


export class FahrenheitLevel extends Level {
  constructor() {
    const omega1 = 1 + Math.random();

    const nodes = [
      new InputNode(() => 0.5 + 0.5 * Math.sin(omega1 * Date.now() / 1000) * Math.exp(-0.3 * (Date.now() - this.t0) / 1000)),
      new Node(), //TODO: No ReLu Nodes here!
      new OutputNode()
    ];

    for (let i in [1]) {
      nodes[[1][i]].bias = 1 + 2 * (Math.random());
    }

    nodes[0].x = 200;
    nodes[0].y = 500;
    nodes[0].allownegative = false;
    nodes[1].x = 500;
    nodes[1].y = 550;
    nodes[2].x = 800;
    nodes[2].y = 500;

    nodes[0].addChild(nodes[1], 1);
    nodes[1].addChild(nodes[2], 1);
    nodes[1].outedges[0].adjustable = false;

    const c2f = c => ((c * 1.8) + 32);
    const trainXs = [0, 10, 20, 30];
    const trainYs = trainXs.map(c2f);

    nodes[0].format = temp => `${(temp*10).toFixed(0)}°C`;
    nodes[1].format = temp => `${(temp*10).toFixed(0)}`;
    nodes[2].format = temp => `${(temp*10).toFixed(0)}°F`;
    super("Convert Celsius to Fahrenheit.",
      new Network(
        nodes,
        [nodes[0]], //input nodes
        [nodes[2]] //output nodes
      ),
      ["Celsius"], trainXs.map(v => [v / 10]), //temperatures are internally divided by 10.
      ["Fahrenheit"], trainYs.map(v => [v / 10]),
      "Given a positive temperature in Celsius (left, yellow slider), the temperature in Fahrenheit is to be computed (output of the network on the right side). Adjust the parameters (blue and white sliders) of the network such that it computes the target value for each input. All values of the table below should be obtained."
    );
    this.animatestep = function() {
      nodes[2].target = c2f(nodes[0].getActivation() * 10) / 10;
    };

  }
}


export class SumLevel extends Level {
  constructor() {
    const omega1 = 1 + Math.random();
    const omega2 = 1 + Math.random();

    const nodes = [
      new InputNode(() => 0.5 + 0.5 * Math.sin(omega1 * Date.now() / 1000) * Math.exp(-0.3 * (Date.now() - this.t0) / 1000)),
      new InputNode(() => 0.5 + 0.5 * Math.sin(omega2 * Date.now() / 1000) * Math.exp(-0.3 * (Date.now() - this.t0) / 1000)),
      new OutputNode()
    ];

    nodes[2].bias = 0;

    nodes[0].x = 200;
    nodes[0].y = 300;
    nodes[0].allownegative = true;
    nodes[1].x = 200;
    nodes[1].y = 700;
    nodes[1].allownegative = true;

    nodes[2].x = 800;
    nodes[2].y = 500;

    nodes[0].addChild(nodes[2], 1);
    nodes[1].addChild(nodes[2], -1);


    const c2f = c => ((c * 1.8) + 32);
    const trainXs = [
      [0, 0],
      [0, 1],
      [2, 1],
      [3, 1],
      [4, 2],
      [0, 2]
    ];
    const trainYs = trainXs.map(p => [p[0] + p[1]]);

    super("The sum of the input activations.",
      new Network(
        nodes,
        [nodes[0], nodes[1]], //input nodes
        [nodes[2]] //output nodes
      ),
      ["summand 1", "summand 2"], trainXs, //temperatures are internally divided by 10.
      ["sum"], trainYs,
      "Adjust the parameters of the network such that the output on the right equals the sum of the two inputs. The predictions of the network should be correct for all the values in the training table below."
    );
    this.animatestep = function() {
      nodes[2].target = (nodes[0].getActivation()) + (nodes[1].getActivation());
    };

  }
}


export class AndLevel extends Level {
  constructor() {
    const omega1 = 1 + Math.random();
    const omega2 = 1 + Math.random();

    const nodes = [
      new InputNode(() => 1),
      new InputNode(() => 1),

      new Node(),

      new OutputNode()
    ];

    for (let i in [2]) {
      nodes[[2][i]].bias = 2 * (Math.random());
    }


    nodes[0].x = 200;
    nodes[0].y = 350;
    nodes[1].x = 200;
    nodes[1].y = 650;
    nodes[2].x = 500;
    nodes[2].y = 500;

    nodes[3].x = 800;
    nodes[3].y = 500;

    nodes[0].addChild(nodes[2], 1);
    //nodes[0].addChild(nodes[3], 1);
    nodes[1].addChild(nodes[2], -0.2);


    nodes[2].addChild(nodes[3], 1);
    //nodes[1].addChild(nodes[3], 1);

    const nw = new Network(
      nodes,
      [nodes[0], nodes[1]], //input nodes
      [nodes[3]] //output nodes
    );
    const trainXs = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1]
    ];
    const trainYs = trainXs.map(p => [(p[0] * p[1])]);

    super("Are both inputs set to 1?",
      nw,
      ["bit 1", "bit 2"], trainXs, //temperatures are internally divided by 10.
      ["AND"], trainYs,
      "The inputs of this network are either 0 or 1. The output on the right should be 1 only if both inputs are 1. Otherwise, it should be 0."
    );
    this.animatestep = function() {
      nodes[0].format = v => Math.round(v);
      nodes[1].format = v => Math.round(v);
      nodes[0].setUserParameter(Math.min(1, Math.max(0, Math.round(nodes[0].getActivation()))));
      nodes[1].setUserParameter(Math.min(1, Math.max(0, Math.round(nodes[1].getActivation()))));

      nodes[3].target = (nodes[0].getActivation() * nodes[1].getActivation());
    };

  }
}

export class MaxLevel extends Level {
  constructor() {
    const omega1 = 1 + Math.random();
    const omega2 = 1 + Math.random();

    const nodes = [
      new InputNode(() => 1.5 + 1 * Math.sin(omega1 * Date.now() / 1000) * Math.exp(-0.3 * (Date.now() - this.t0) / 1000)),
      new InputNode(() => 1 + 1 * Math.sin(omega2 * Date.now() / 1000) * Math.exp(-0.3 * (Date.now() - this.t0) / 1000)),

      new Node(),

      new OutputNode()
    ];

    for (let i in [2]) {
      nodes[[2][i]].bias = 2 * (Math.random() - 0.5);
    }


    nodes[0].x = 200;
    nodes[0].y = 350;
    nodes[1].x = 200;
    nodes[1].y = 650;
    nodes[2].x = 500;
    nodes[2].y = 400;

    nodes[3].x = 800;
    nodes[3].y = 500;

    nodes[0].addChild(nodes[2], 1);
    //nodes[0].addChild(nodes[3], 1);
    nodes[1].addChild(nodes[2], -0.2);


    nodes[2].addChild(nodes[3], 1);
    nodes[1].addChild(nodes[3], 1);

    const nw = new Network(
      nodes,
      [nodes[0], nodes[1]], //input nodes
      [nodes[3]] //output nodes
    );
    const trainXs = [0, 0, 0, 0, 0, 0, 0].map(v => [Math.random(), Math.random()]);
    const trainYs = trainXs.map(p => [Math.max(p[0], p[1])]);

    super("Compute the maximum of the input activations.",
      nw,
      ["input 1", "input 2"], trainXs, //temperatures are internally divided by 10.
      ["maximum"], trainYs,
      "The output on the right should be the maximum of the input. Hint: max(a, b) = max(0, a-b) + b. Remember that the internal node ignores its input if it is negative."
    );
    this.animatestep = function() {
      nodes[3].target = Math.max(nodes[0].getActivation(), nodes[1].getActivation());
    };

  }
}



export class XorLevel extends Level {
  constructor() {
    const omega1 = 1 + Math.random();
    const omega2 = 1 + Math.random();

    const nodes = [
      new InputNode(() => 0.5 + 0.5 * Math.sin(omega1 * Date.now() / 1000) * Math.exp(-0.3 * (Date.now() - this.t0) / 1000)),
      new InputNode(() => 0.5 + 0.5 * Math.sin(omega2 * Date.now() / 1000) * Math.exp(-0.3 * (Date.now() - this.t0) / 1000)),

      new Node(),
      new Node(),
      new Node(),

      new OutputNode()
    ];

    for (let i in [2, 3, 4]) {
      nodes[[2, 3, 4][i]].bias = 2 * (Math.random() - 0.5);
    }


    nodes[0].x = 200;
    nodes[0].y = 400;
    nodes[1].x = 200;
    nodes[1].y = 600;
    nodes[2].x = 500;
    nodes[2].y = 300;
    nodes[3].x = 500;
    nodes[3].y = 500;
    nodes[4].x = 500;
    nodes[4].y = 700;
    nodes[5].x = 800;
    nodes[5].y = 500;

    nodes[0].addChild(nodes[2], 1);
    nodes[0].addChild(nodes[3], 1);
    nodes[0].addChild(nodes[4], 1);
    nodes[1].addChild(nodes[2], 1);
    nodes[1].addChild(nodes[3], 1);
    nodes[1].addChild(nodes[4], 1);

    nodes[2].addChild(nodes[5], 1);
    nodes[3].addChild(nodes[5], 1);
    nodes[4].addChild(nodes[5], 1);

    const nw = new Network(
      nodes,
      [nodes[0], nodes[1]], //input nodes
      [nodes[5]] //output nodes
    );
    const trainXs = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1]
    ];
    const trainYs = [
      [0],
      [1],
      [1],
      [0]
    ];

    super("Compute the XOR of the input bits.",
      nw,
      ["bit 1", "bit 2"], trainXs, //temperatures are internally divided by 10.
      ["XOR"], trainYs,
      "Assume that the network only takes 0 and 1 as input. The output of the network should be 1 if exactly one input is set to 1. Otherwise (both inputs equal) the output should be 0."
    );
    this.animatestep = function() {
      //round input
      nodes[0].format = v => Math.round(v);
      nodes[1].format = v => Math.round(v);
      nodes[0].setUserParameter(Math.min(1, Math.max(0, Math.round(nodes[0].getActivation()))));
      nodes[1].setUserParameter(Math.min(1, Math.max(0, Math.round(nodes[1].getActivation()))));
      nodes[5].target = ((nodes[0].getActivation() + nodes[1].getActivation()) | 0) % 2;
    };

  }
}


export class AvgLevel extends Level {
  constructor() {
    const omega1 = 1 + Math.random();
    const omega2 = 1 + Math.random();
    const omega3 = 1 + Math.random();

    const nodes = [
      new InputNode(() => 0.5 + 0.5 * Math.sin(omega1 * Date.now() / 1000) * Math.exp(-0.3 * (Date.now() - this.t0) / 1000)),
      new InputNode(() => 0.5 + 0.5 * Math.sin(omega2 * Date.now() / 1000) * Math.exp(-0.3 * (Date.now() - this.t0) / 1000)),
      new InputNode(() => 0.5 + 0.5 * Math.sin(omega2 * Date.now() / 1000) * Math.exp(-0.3 * (Date.now() - this.t0) / 1000)),

      //new Node(),

      new OutputNode()
    ];


    //output from console
    nodes[0].x = 200;
    nodes[0].y = 300;
    nodes[0].allownegative = true;
    nodes[1].x = 200;
    nodes[1].y = 500;
    nodes[1].allownegative = true;
    nodes[2].x = 200;
    nodes[2].y = 700;
    nodes[2].allownegative = true;

    nodes[3].x = 800;
    nodes[3].y = 500;
    //nodes[4].x = 800;
    //nodes[4].y = 500;

    nodes[0].addChild(nodes[3], 1);
    nodes[1].addChild(nodes[3], 1);
    nodes[2].addChild(nodes[3], 1);
    //nodes[3].addChild(nodes[4], 1);

    const nw = new Network(
      nodes,
      [nodes[0], nodes[1], nodes[2]], //input nodes
      [nodes[3]] //output nodes
    );
    const trainXs = [0, 0, 0, 0, 0, 0, 0].map(v => [Math.random(), Math.random(), Math.random()]);
    const trainYs = trainXs.map(p => [(p[0] + p[1] + p[2]) / 3]);

    super("The average of the input values.",
      nw,
      ["number 1", "number 2", "number 3"], trainXs, //temperatures are internally divided by 10.
      ["average"], trainYs,
      "Given three inputs, can you adjust the weights such that the output always equals to the average of the input activations? In particular, the network should produce correct outputs for all values in the table below."
    );
    this.animatestep = function() {
      nodes[3].target = (nodes[0].getActivation() + nodes[1].getActivation() + nodes[2].getActivation()) / 3;
    };

  }
}
