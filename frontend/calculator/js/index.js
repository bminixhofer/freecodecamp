//simple calculator using pure.css and math.js

var app = angular.module("ElectronicCalc" , []);

app.controller("CalcCtrl", function() {
  this.result = "";
  this.buttons = ["CE", "DEL", "/", "x", "-", "+", "1", "2", "3", "4", "5", ".", "6", "7", "8", "9", "0", "="];
  var properties = this;
  this.add = function(target) {
    var repeat = false;
    switch(target) {
        case "DEL": do {
          repeat = (properties.result[properties.result.length - 1] !== " ") ? false : true;
          properties.result = properties.result.slice(0, properties.result.length - 1);
        } while(repeat); properties.result = properties.result.trim(); break;
        case "CE": properties.result = ""; break;
        case "=": properties.result = String(Math.round(math.eval(properties.result.replace("x", "*")) * 10000) / 10000); break;
        case "/": (properties.result !== "") ? properties.result += " / " : ""; break; 
        case "x": (properties.result.length !== "") ? properties.result += " x " : ""; break; 
        case "-": (properties.result.length !== "") ? properties.result += " - " : ""; break; 
        case "+": (properties.result.length !== "") ? properties.result += " + " : ""; break; 
        default: properties.result += target; 
     }
    if(properties.result.length > 20) {
      properties.result = properties.result.slice(0, 20);
    }
  };
});