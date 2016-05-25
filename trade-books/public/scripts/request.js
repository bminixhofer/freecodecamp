//simple script to make requests to the server
function request(info) {
  var xhr = new XMLHttpRequest();

  var method = info.method;
  var callback = info.callback;
  var url = info.url;
  var data = info.data;

  try {
    xhr.open(method, url);
    if(method === 'POST') {
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }
    xhr.send(method === 'POST' ? data : null);
  } catch(err) {
    callback(err);
    return;
  }

  xhr.onreadystatechange = function () {
    var DONE = 4;
    var OK = 200;
    if (xhr.readyState === DONE) {
      if (xhr.status === OK) {
        callback();
      } else {
        callback(xhr.status);
      }
    }
  };
}
