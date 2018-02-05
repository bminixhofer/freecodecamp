var client_id = "?client_id=o7zmu6ijw7k6dluwtrr7ulwxbsvu5xw&callback=?"

var streamers = ["freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "medrybw"];
var streamerInformation = [];
var displayedStreamers = [];

function toLi (streamer) {
  return '<li><img class="logo" src=' + streamer.logo + '><h3><a target="_blank" href="https://www.twitch.tv/' + streamer.name + '">' + streamer.display_name + '</a></h3><div class="status ' + ((streamer.streaming) ? 'online"' : 'offline"' ) + "></div><p>" + streamer.status + "<p></li>";
}

function sortAndAppend() {
  streamerInformation.sort(function(a, b) {
    return (a.streaming) ? -1 : 1;
  });
  streamerInformation.forEach(function(streamer, index) {
    $(".streamers ul").append(toLi(streamer));
  });
}

window.onload = function() {
    document.querySelector("input").oninput = function() {
      $(".streamers ul").empty();
      streamerInformation.filter(function(value) {
        return (document.querySelector("input").value) ? value.name.indexOf(document.querySelector("input").value.toLowerCase().trim()) >= 0 : true;
      }).forEach(function(streamer) {
        $(".streamers ul").append(toLi(streamer));
      });
    };
  
    streamers.forEach(function(streamer, index) {
          var temp = {};
          $.getJSON("https://api.twitch.tv/kraken/streams/" + streamer + client_id).success(function(obj) {
            temp.streaming = obj.stream !== null;
            temp.status = (temp.streaming) ? obj.stream.channel.status : "";
            if (temp.status.length > 30) {
              temp.status = temp.status.slice(0, 30) + "...";
            }
            $.getJSON("https://api.twitch.tv/kraken/users/" + streamer + client_id).success(function(obj) {
              temp.display_name = obj.display_name;
              temp.name = obj.name;
              temp.logo = (obj.logo) ? obj.logo : "https://i.imgur.com/kp2ptfB.png";
              temp.position = streamerInformation.length;
              streamerInformation.push(temp);
              
              if (streamerInformation.length === streamers.length) {
                sortAndAppend();
              }
            }); 
          });
        });
      }