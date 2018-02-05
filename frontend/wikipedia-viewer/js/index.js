var app = angular.module("WikipediaSearch", [])

app.controller("SearchController", ["$http", "$sce", function($http, $sce) { 
  var _this = this;
  this.currentOffset = 0;
  window.onscroll = function() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      _this.currentOffset += 10;
      _this.makeWikipediaRequest(document.getElementById('search-input').value, _this.currentOffset, false);
    }
  };
  
  this.inputchange = function() {
    _this.data = [];
    _this.currentOffset = 0;
    _this.makeWikipediaRequest(document.getElementById('search-input').value, 0, true); 
  };
  
  this.makeWikipediaRequest = function(search, offset, reset) {
    var _requestThis = this;
    $http.jsonp("https://en.wikipedia.org/w/api.php?action=query&list=search&utf8=&format=json&callback=JSON_CALLBACK&sroffset=" + offset + "&srsearch=" + encodeURIComponent(search)).success(function(data) {  
      if(document.getElementById('search-input').value) {
        if(reset) {
          _this.data = [];
        }
        _this.data = _this.data.concat(data.query.search.map(function(article) {
            article.link = "https://en.wikipedia.org/wiki/" + encodeURIComponent(article.title.replace(" ", "_"));
            article.snippet = $sce.trustAsHtml(article.snippet + "...");
            return article;
          }));
        }
     });
   };
}]);