var rawTime = Number(document.querySelector(".session-time").innerHTML) * 60;
var currentTime = secToMinPlusSec(rawTime);
var state = "stopped";
var hovering = false;

function lowerBy1Sec() {
  if(state === "running") {
    rawTime -= 1;
    if(rawTime === 0) {
      var target = (document.querySelector(".pomodoro-state").innerHTML === "Session") ? "Break" : "Session";
      document.querySelector(".pomodoro-state").innerHTML = target;
      rawTime = Number(document.querySelector("." + target.toLowerCase() + "-time").innerHTML) * 60;
      currentTime = secToMinPlusSec(rawTime);
    }
    currentTime = secToMinPlusSec(rawTime);
    refreshValue();
  }
};

function secToMinPlusSec(value) {
  return ((value - value % 60) / 60) + " : " + ((value % 60 < 10) ? ("0" + value % 60) : value % 60);
};

function manageTime(target, step) {return function() {
    if(Number(document.querySelector(target).innerHTML) + step > 0) {
      document.querySelector(target).innerHTML = Number(document.querySelector(target).innerHTML) + step;
      if(state === "stopped") {
        rawTime = Number(document.querySelector(".session-time").innerHTML) * 60;
        currentTime = secToMinPlusSec(rawTime);
        refreshValue();
      }
    }
  }
}

function refreshValue() {
  if(!hovering) {
    document.querySelector(".pomodoro").innerHTML = currentTime;
  }
};

window.onload = function () {
  document.querySelector(".pomodoro").innerHTML = currentTime;
  
  document.querySelector(".pomodoro").onclick = function () {
    state = (state === "stopped") ? "running" : "stopped";
    if(state === "stopped") {
      document.querySelector(".pomodoro-state").innerHTML = "Session";
      rawTime = Number(document.querySelector(".session-time").innerHTML) * 60;
      currentTime = secToMinPlusSec(rawTime);
    }
  };
  
  setInterval(lowerBy1Sec, 1000);
  
  document.querySelector(".session-time-decrease").onclick = manageTime(".session-time", -1);
  document.querySelector(".session-time-increase").onclick = manageTime(".session-time", 1);
  document.querySelector(".break-time-decrease").onclick = manageTime(".break-time", -1);
  document.querySelector(".break-time-increase").onclick = manageTime(".break-time", 1);
  
  document.querySelector(".pomodoro").onmouseover = function() {
    document.querySelector(".pomodoro").innerHTML = (state === "stopped") ? "Start" : "Reset";
    hovering = true;
  };
  document.querySelector(".pomodoro").onmouseout = function() {
    document.querySelector(".pomodoro").innerHTML = currentTime;
    hovering = false;
  };
};