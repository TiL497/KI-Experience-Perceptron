//jshint: "esversion": 8

import {
  Edge
} from './Edge.js';

import {
  DynamicVariable,
  updateDynamicVariables
} from './DynamicVariable.js';

export class Node {
  constructor() {
    this.dactivation = new DynamicVariable(0);
    this.sum = new DynamicVariable(0);
    this.bias_txt = "0.0"; 
    this.bias = 0;
    this.dloss = 0;
    this.outedges = [];
    this.inedges = [];
    this.adjustable = true;
  }

  addChild(other, weight, reverse = true) {
    const edge = new Edge(this, other, weight);
    this.outedges.push(edge);
    if (reverse) {
      other.inedges.push(edge);
    }
  }

  computeSum() {
    return this.sum.update(() => {
      let temp_in = 0.0; 
      let activation = this.bias;
      for (let eid in this.inedges) {
        const edge = this.inedges[eid];
        temp_in += edge.weight * edge.from.getActivation();
        activation += edge.weight * edge.from.getActivation();
      }
      let temp_bias = activation - temp_in; 
      if (temp_bias > 0){
        this.bias_txt = "+" + Math.round(temp_bias*100)/100;
      } else {
        this.bias_txt = Math.round(temp_bias*100)/100; 
      }
      return activation;
    });
  }

  getActivation() {
    //return Math.max(0, this.computeSum()); //ReLu
    return this.computeSum(); 
    //if (this.computeSum() > 0){
    //  return 1; 
    //} else {
    //  return 0; 
    //}
  }


  active() {
    return this.computeSum() >= 0;
  }

  getdActivation() {
    return this.dactivation.update(() => {
      let dactivation = 0;
      for (let eid in this.outedges) {
        const edge = this.outedges[eid];
        if (edge.to.active()) {
          dactivation += edge.weight * edge.to.getdActivation();
        }
      }
      return dactivation;
    });
  }

  getdBias() {
    return (this.active() ? this.getdActivation() : 0);
  }

  format(v) {
    return v.toFixed(2);
  }

  backup() {
    this.backupBias = this.bias;
  }

  restore() {
    this.bias = this.backupBias;
    
  }
}
