var state = "large";
var quotes = [["Whatever the mind of man can conceive and believe, it can achieve.", "Napoleon Hill"], ["Strive not to be a success, but rather to be of value.", "Albert Einstein"], ["Two roads diverged in a wood, and I—I took the one less traveled by, And that has made all the difference.", "Robert Frost"], ["I attribute my success to this: I never gave or took any excuse.", "Florence Nightingale"], [" You miss 100% of the shots you don’t take.", "Wayne Gretzky"], [" I’ve missed more than 9000 shots in my career. I’ve lost almost 300 games. 26 times I’ve been trusted to take the game winning shot and missed. I’ve failed over and over and over again in my life. And that is why I succeed.", "Michael Jordan"], ["Life is what happens to you while you’re busy making other plans. ", "John Lennon"]];

function randomize(arr) {
  return arr[Math.floor(Math.random() * arr.length)]; 
};

window.onload = function() {
  var buttonClassName = document.querySelector(".button-main").className;
  var quoteClassName = document.querySelector(".quote-main").className;
  window.onresize = function() {
    if(window.innerHeight < 800 && state === "large") {
      var currentButtonClassName = document.querySelector(".button-main").className;
      var currentQuoteClassName = document.querySelector(".quote-main").className;
      currentButtonClassName = currentButtonClassName.replace(/\bbutton-main-large\b/,"");
      if(currentQuoteClassName.indexOf("col-xs-9 quote-small") === -1) {
        currentQuoteClassName = currentQuoteClassName.replace(/\btext-center\b/,"") + " col-xs-9 quote-small";
      }
      document.querySelector(".button-main").className = currentButtonClassName;
      document.querySelector(".quote-main").className = currentQuoteClassName;
      state = "small";
    }
    else if(window.innerHeight > 800 && state === "small") {
      document.querySelector(".button-main").className = buttonClassName;
      document.querySelector(".quote-main").className = quoteClassName;
      state = "large";
    }
    console.log(state);
  };
  
  document.querySelector(".button-main").onclick = function() {
    var current = randomize(quotes);   
    document.querySelector(".quote-main").innerHTML = current[0] + "<br>-<a target='_blank'  href=https://www.wikipedia.org/wiki/" + current[1].replace(" ", "_") + ">" + current[1] + "</a>";
  };
  document.querySelector(".button-main").onclick();
  window.onresize();
};