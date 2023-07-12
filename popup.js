document.addEventListener('DOMContentLoaded', function() {
  showParsedURL();
});

function showParsedURL() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    var parsedURL = parseURL(url);
    var resultElement = document.getElementById('result');
    resultElement.textContent = formatParsedURL(parsedURL);
  });
}

function parseURL(url) {
  var parser = document.createElement('a');
  parser.href = url;
  var parsedURL = {};
  parsedURL.protocol = parser.protocol;
  parsedURL.hostname = parser.hostname;
  parsedURL.port = parser.port;
  parsedURL.pathname = parser.pathname;
  parsedURL.search = parseQueryParams(parser.search);
  parsedURL.hash = parser.hash;
  return parsedURL;
}

function parseQueryParams(search) {
  var params = {};
  if (search) {
    var query = search.substring(1); // Remove the leading '?'
    var paramPairs = query.split('&');
    for (var i = 0; i < paramPairs.length; i++) {
      var pair = paramPairs[i].split('=');
      var key = decodeURIComponent(pair[0]);
      var value = decodeURIComponent(pair[1] || '');
      params[key] = value;
    }
  }
  return params;
}

function formatParsedURL(parsedURL) {
  var result = '';
  for (var key in parsedURL) {
    var value = parsedURL[key];
    if (typeof value === 'object') {
      result += key + ':\n';
      for (var subKey in value) {
        result += '  ' + subKey + ': ' + value[subKey] + '\n';
      }
    } else {
      result += key + ': ' + value + '\n';
    }
  }
  return result;
}
