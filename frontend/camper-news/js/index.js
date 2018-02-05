var app = angular.module("camperNews", []);

app.controller("NewsController", ["$http", function($http) {
  this.stories = [];
  news = this;
  $http.get("https://www.freecodecamp.com/news/hot").success(function(data) {
      data = data.map(function(value) {
        value.image = value.image || "https://i.vimeocdn.com/video/500176908_640.jpg";
        return value;
      });
      news.stories = data;
  });
}]);