(function(global) {

function main() {
  var d = global.document;
  var box = global.b = d.getElementById('box1');

  ResizeMonitor2.addTarget(box, function(ev) {
    console.log(ev);
  });
}

global.addEventListener('load', main);

})(this);
