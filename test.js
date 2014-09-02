(function(global) {

function runTest() {
  var m, d;
  var f1, f2, f3, f4, f5;

  console.log('runTest');

  m = global.ResizeMonitor;
  d = global.document;

  m.startMonitor(d.getElementById('box1'), f1 = function() {
    console.log('box1', arguments);
  });
  m.startMonitor(d.getElementById('box2'), f2 = function() {
    console.log('box2', arguments);
  });
  m.startMonitor(d.getElementById('box3'), f3 = function() {
    console.log('box3', arguments);
  });
  m.startMonitor(d.getElementById('box4'), f4 = function() {
    console.log('box4', arguments);
  });
  m.startMonitor(d.getElementById('box5'), f5 = function() {
    console.log('box5', arguments);
  });

  m.startMonitor(function() {
    console.log('root', arguments);
  });
}

global.addEventListener('load', runTest);
})(window);
