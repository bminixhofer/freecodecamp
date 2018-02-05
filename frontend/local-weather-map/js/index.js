var key = "2c347e40ccf20af8b36337cac5b41846";
var crd = {};

var temperature;
var area;
var wind;
var weather;

var data;

function success(pos) {
  crd = pos.coords;
};

function displayData() {
  console.log(data);
  document.querySelector("#weather").innerHTML = Math.round(((data.main.temp - 273.15)* 1.8000 + 32.00) * 10) / 10 + "° F";
  document.querySelector("#area").innerHTML = data.name + ", " + data.sys.country;
  //the openweathermap api does not supply wind.deg sometimes.
  document.querySelector("#wind").innerHTML = data.wind.speed + " knots" + ((data.wind.deg === undefined) ? "" : (", " + data.wind.deg + " degrees"));
  
  //the difference is neglectable for this app.
  if(data.weather[0].main === "Smoke" || data.weather[0].main === "Haze" || data.weather[0].main === "Mist") {
    data.weather[0].main = "Mist";
  }
  switch(data.weather[0].main) {
    case "Clear": document.querySelector("#weather-img").src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAE/ElEQVR4Xu1b/VEXMRDdrUCoQKhAqECsQKxAqECsQKxArECsQK1AqUCoQKhAqGCdhxsmZJLLJtnjcLzM+IdzIdl92Y+3m/yYFhoickBEH3T7V8z8YwlReIlNsaeIXBPRE93/mpk3l5BlSQAkVpiZF5FlkU3VAlYAVguIEFhdYI0BjzwIisgWESFdIX0NDxGZJQiqnBvMfG4R0pQFROSUiF4DACJ6y8z4/9CYAwAlV59UsFNmPqwJWQVARHaI6Gey0OEoCN4AJMoHcbeZ+XIKBAsAG0SERQJrC+sNgSAiMNFnutgZM+/VTqv0vaD8DTND9slRBUBJC3h7MK14wW4Q1FePdbHj2kk1Ko/pJtlMAMwFQu10at8LJ29WHhPNADw2EDyUbwagAgJK2q+1U/P4LiL7RPQls5bJ7OO/a7KA8IcF9C+ZebumoGaVp0SE7BIPBMUrS/4WEQRlrDEcj7oAKFjCBTOnSt0KqAHvHREh0oNQTQ0oB0v6WAqMSQZp8vl0424AVDGY4okSpKO0qxMpjizSM0C4QLzusU+1InxDmsO+3a43BMCURuqnSJ3VXFxBBsq/sLhGD8KzACAiR1G/LyfXGRGlPUC4x/MJJZoDnAUQdwAmlL8iIhCeyTpCAywIUhrkhny9BIYrABPpCX6MWGEeE0DuerqDGwAa8FA0xT5/Q0T7vS1vBRQWE9chiAkoclzKck8AQskcn/IwOSpY1XtmDnWE2apyE10A0NP/lWzQbPYlTQruUC11Lch4AQD/fhNtCEZXIzwW+e7mZNgfiBKyzdDwAiClpu4pK0O/z5l5d0j71mowt1mhY7TpFaTCniKC4Po7kWHYDYYtQERAYL5Hgg11dyrsEuQpJktgiEOXqhzd0looK0wdkf2u4yoiiMYodMJw8c2CtaWx5p6raTDGYVjiD9LoIQDIlZZTB/GNmVEE3Y4MAG4pKhWitpeIpADVQsRlDwCfmfmuuqsJVZOg5Xttrw4ALgAAfBgkJse9U/lQxBzEdXpGqHsAtShYmxvdT4SpqQvAjVEaTxVV4W9RmxysQbCGeu17gQU+VBoc3mfYAjQQLkGEii242qHF370ASKOvqUFqFVRJECrNOL25ZBsvACBYWgy5CFhItSiztzzYpgsAKmQuBw/XBIUWvBu4ngDkLlGHrtMLLBXpa8fj9HFwbgCoFeSu0vEJdBkU2dTFUZ8HvU7LXZj+3qNsiUXUuHSTjEwBIECls0Co4i/1riFXmwx3mNLA62oBBhDCFBRTACQUVbAcBNLszRIR4eTBQLsvQEoZZxYAIndAqZo+rLBmv5iyorFqevPTuvgQAFGQ+ltaJrW5mjT8GP9agcCpI7OcFK7GcDsMN8G+3ZbRDUAmPRXJj9JlxAaU0eFZTOmwLrQ4wyOnUqyIn9dgne502wVAITebGqFqFfB1nF7w+dDVQZ+vmikyt8PdIDQDMPEywz1Cl0xksQcSXs9SWgNVbr6XLGYL8NrQQ3lDujXHBBMAcygfPZ6APuD2kw8aJ9xh6AlfFQANWqj0UmZmRrlgwnEkH7rkKByQ6RLVAsD//VRWWV24+QU5wZucx/xYGuQJpMvUnK1aQBRw/onn8q1B1gxA68K1+d6vxWv7PXgxVBNoBWCmX4zUgH+QfoBFiNUCVguY50dTFuuL5yyZBeIfT5tK6VblLPOXBCDcSkNO9PuGXnpYlM3N+QNFrJ6SL3nIYQAAAABJRU5ErkJggg=="; break;
    case "Mist": document.querySelector("#weather-img").src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADCklEQVR4Xu2ZjXHTQBCFdyuAdAAVECrAqQA6IOkgVECogHSAUwG4guAKcCoAKiCpYJlP3sucZcm2NPbI1u3OaJJJdD/v7dufO6kUblo4fgkCQgGFMxAhULgAIglGCEQIFM5AhMChBWBmr0Tko4hM/MmXXIjITx5VnTXtxce/97HnIsJ8yR5FhDn4yTwzVf3TBdPBFGBmAP7cALptf2z8RlXveMHMIO1aRADdxSDkNs2zbeBBCDCzr775tP5fEfnhXsJbySDpg4i8yf6GJ/Fy7mnGAywpJr2e3uMn87zI5uHdT6rKfK22VwLM7KWIfM+8/uBeBXyrucxvRQSp54YapttApAFmBgk8qCcZ46/aFt83AYBnA9gXVb3ZJsH8/w5g6p6+VlW82Nk8/Fj7nQ9mngtVzdVX/WtvBJgZCxLz2JWqAmRQq+2pkYS9EOAS/u1o71T1clDk2eJmxl4IL/LDQlXf5nvbFwF4m7gjWZ03SW1IQpyEb76HlZywEwHuYeKJbEui46Fs8QD6/pik30R2LRzIB1V12EhAj1p8dmzeryVZQONIGq+LVgLMjOaDjJ7X4ifPzvmcvJdqL11YqgBDKr51ba8OK2pdU4DHC40MMsdoUYmbxlruZAGc7mutzBwbE2aWVDBX1ckKAbVkQWxf7tqEHBvQtv14r4G6sbNnAmryoIObnIJH+xBvZvactPnFW9hfHvOjBu94CWfa7lmlgFqJeN31SNnHC0OOyfDOEwH/POl17t+HBNJ37YyAhdaSwui974rnGF6VQwhIbWxVFvqyekrj8oQPAakuFiF/VwAHJM4GTxBARqTpoZHZeHFxSl7etFfvdyBhsdNhaCzAm3AEAR4T6epozM5ew6aqc3IAHWDXq+exEFX1AakKjAVUFxzLTrBkCwJK9n7VChdPgN8F5N/mSuLkgSqQjsIlAU9YHyGAryb0xfmX1RLI4JZ7GjmgBFdvwhgKCAUsb4XjNFioEqrTYPpIUCIHyw8jJVsQULL34zQYx+G4D4gLkagCUQUKZyBCoHAByH+ISiHqHB2IcQAAAABJRU5ErkJggg=="; break;
    case "Rain": document.querySelector("#weather-img").src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFOElEQVR4Xu1bjVEWMRDdrUCpQKgArUCoQKlAqECoQKlAqECoQKhAqECoQKhArGCdd26+2cvlLj+Xzzs+LzMMo5e/fdl92bwEpjUVEXlNRLtEtK1D4PcDET0R0R0z365p6KxuOat2pLKIwMiPRPTeGN7XCkDcENE5M+P3JKUKACLykog+EdFxoRUA4ISZ7wrbFzcbDYC6+nciAgih8hsubz68HZjtMTOfF1tT0HAUACJySERfA+NeqntfMTNcvVUUNLTFzwvv8wUzHxXYUtSkGIAe40Fsh8wMsosWDZ3Pyhu2fgcEEXGe48iUahBpEQA9bn/KzDAmu4jIHhFded5woqHjSLWvX7SDp8HrskspAD89lj9i5ovs0U0DBRVk6IdEardFRJoNgIhglcH4rmAbK2V/nxuwfX5LtbinXtZiZAGgMYvVd4x/z8xIeKoVETnzOAG7CLwLbr7KFzRsAFiISJNByAXAZ/392kmMggwSRShcK6l2dhKHuNaHB1qvxOekueUCAMJ5p4NXX31jFAx6yuGVwK4E0HZC27B111wAZB2xXyt+RATAfTH9RXemZAA05pDxuZLkYrWMS+1HRMATLmeAF20NtR0DANwrKeFJnXyNeiLi7yRvhs4YOQC0CJCZk9vWMCynDxFB/Lt8YjAMko3wSWbmANgwGMxTcgBAumo5YCvGsDmrVrOuxwO3zIy5B0sUAD2EINnBD8LAlQNmxrY4uzIaAE0ucAiBwU7S8g2tlgLXRlBEfuiCoWvwAbJLzLeTUHU8QFkUZ/w+gcPN94GZd2pPfmx/uni/Av3AeKTILa9tATAgcKC/e0XT9p189h9rWGp7PVVixfuUp9Y5YQXAgMBxNtdYj4Gi3ozs0AdjBUIDgKq5iBvr9sknqthEpv4eSJERDkiQHhwAOIMjg3JlY4x3BgU8/IaZ91ljBqvvyiUz2+1u6gWsNn5Aa9gBAL7CM9sEZywSGuoQdFw5BQA2bbxmZhsKY8ecXXsRsZrGLQDAnunIL3p+np1FmRPyPP4JAFiR438DgBYAPA7Y2B3AbIdQmD/ovxsOsP8RlZAyQ2521T3OuwQAvoS0cUnQQDJ04DJBaHuvtOIqTZzd8o2YUOA+85GZtx0A/oUH7vMheMxO9CzBQI3HEd/eYjWebk+DlgswDjwBDxaKbl1LJrqONiICYQfZrj3orcjeAoAKyArxsMkWAIHs6bl5A5Qs8Jsv7EDX2HPqkC+IoDLEBLdNrGNRpuyzs80HRVHdGQCEI8YpJ11j7EcN546IO6gKKxCQlJ0qXPp4oYYROX24h1kgc5z7e9XrqCyeM+pzrLsAULJquq9CFg89gQORbvddSOotM57Khto2dxCh/EPl7t3Qy7ChbzH7sj3AyEqdjNHLtjoXJ+bghdjE9foKBC8lb906qYG4lgMXNVqeSW8BuHu2k/3GsASA3ptXT2zoXJx42kPrfUFHqTH3ef7bBHsxO/QttvqNt6VUsnWGBBRfX/RvkCMAWGmudaG5APD3IeXqZnrxAPM4YwmBAe9ICe+FA1JQmjkJIndwlx2NyJFj07P3ABirPACiRB6QdWzfCAByVtyvuwCQi97cEqHc+dfwAOTxTjbDX3pBOGnKFJngFACAbGA0yAZvhOyBpnXVHkiFoT7jyQoONK0/sog9bdNDWDN2zivyGEDZHDDUYcwDIm17zwIxI8Z8XwAYg57fdvEA77lNzoPqGAfUXCjbV+0QsFdsWc9tvAdM/+wZblUAdCsEuyMfB1snp6Uqe7nXaUhpe/9QqqY3/AGBPWVQV2yghQAAAABJRU5ErkJggg=="; break;
    case "Clouds": document.querySelector("#weather-img").src =  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEH0lEQVR4Xu2aj1UUMRDGZypQKxArUCpQKhArECoQK1AqUCsQKkAqUCoQKhAqECoY328v4eVi9jbZC3c5bue9ezzudpPMN9/83VXZctEt118mACYGbDkCkwtsOQGmIDi5wOQCW47Ag7uAmb0SkScBzjeqet0K7tUBcAq/F5F9EdnpUfRWRH6IyC9VPV0nGNUAMLM3IvJJRPhbIrDh87qAWBoAM3sqIt+dxUsUj6+9FJFDVeXvymQpAMwMip+JCH4eyh30djTHwtf4vWMJgMESXOR5dB+u8VFVT1aFwGgAnK//FBEU8oLiX/moKsosFDM7gP4JIGDCSkAYBYCjPcqHlr/CsjmKh6i4tQCNwBnKLu5gZnwPY/iEQRVm4S4E0/PSff1GYwGA9lDYC5H8aOwhWMTMjkTkS7AmDOLTl0lCsLgO1h0PsS7+vRgA58dY38uVqsYxoPQc3fVmBhM+jLp5dhOMeFdSZ4wB4HdAfXx+ZxnLx8qaGUq8jL6/CQIqvwM4zOgLpHu52aQIADNjQ+jv5VhVCWLVxAVXQEYAGNfqDYiOkTAnBA2XeJFjmFIAOIgPVneqGmaAmiCwD2sf5CjRE0ipMveGDlUKwJ8gKJ2qKmmsuqBQjuIJ9yEjvA2+Jx7wXa9kA+CKHgDwMrh4dWQGFnRMID365utSVXdrAUAeDqN/l6dXreTQfol0Sizo7T5LGDAHgKpm3zt06Jq/Oxb8DdaktCZIJiVbiRjZVgFAyyiVLsxUJQBsBAMcADRir53JL1S1t0XPAsDRivQXUolig42aEzNbHoCMyc5C31onKhEABECMlQyE/zHAWZumZCjHL6TWmgGwxP4UVxhtrk2fA8BZnVI3pwNjj2djCpaHBCfRrIXbofxcn3APQM+Ag5tpdammblv1+RhQx2I/dYrnDHMgdAD0DDguXC3ezAh7DHNcBQv9fVZgGQo4mHDrAaCjY6Lr5cHq/DFK1LjHzMJGjiW7+kCd9anxfWdXbcBR4+A114gKpFnL7AaTjLW9NJvflwUjESAPASBsIR+t9T14EQvOASAccX1TVYaTj1aiueM1AIRFQ/URV2tImtlcwJ8AKGkdW7PmmPNELnAVB8HBEdKYTVu6J4p5XRCk6dnqNEgBVDRIbMmiJWeJrD97qON6gbgUPlHVw5LFW7/WzGB52OLPSuGgGWKKEj5d4X8eUz+GZgjlw7HY/ZPsuB1G6fCFJvChiaBa5OWm5sbgKea51p6XL3iUFw92oD6P8TtdUgORFAitMzz3fDxk3Q8N2TcSS72wkLtJq9cl32HonQq7zgn6QKPYLVpVMj4XFofRBPXkBDt3LM6MMHdO2Ao43YtZQ4fJAmBokU3+fQJgk61X4+wTA2qguMlrTAzYZOvVOPvEgBoobvIaEwM22Xo1zv4PyTG1HzrMozsAAAAASUVORK5CYII=";
  }
};

window.onload = function() {
  var weatherRequest = new XMLHttpRequest();
  weatherRequest.onreadystatechange = function() {
    if(weatherRequest.readyState === 4) {
      data = JSON.parse( weatherRequest.responseText);
      displayData();
    }
  };
  console.log(navigator.geolocation.getCurrentPosition(function(pos) { success(pos)}));
  navigator.geolocation.getCurrentPosition(function(pos) {
    success(pos);
    weatherRequest.open("GET", "http://api.openweathermap.org/data/2.5/weather?lat=" + crd.latitude + "&lon=" + crd.longitude +"&APPID=" + key);
    weatherRequest.send();
  });
  
  document.querySelector("html").onclick = function() {
    console.log("1");
    if(document.querySelector("#systemtype").innerHTML === "Celsius") {
      document.querySelector("#weather").innerHTML = Math.round((data.main.temp - 273.15) * 10) / 10 + "° C";
      document.querySelector("#systemtype").innerHTML = "Fahrenheit";
    }
    else {
      document.querySelector("#weather").innerHTML = Math.round(((data.main.temp - 273.15)* 1.8000 + 32.00) * 10) / 10 + "° F";
      document.querySelector("#systemtype").innerHTML = "Celsius";
    }    
  }
};