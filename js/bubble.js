/* jshint esversion: 6 */

let getAccelInfo = null;
let bubble = $("#bubble");
const spiritbalancer = $(".spiritbalancer");

// change the frequency of the accelerometer polling here in ms
const frequency = {frequency : 100};

// get widths of screen objects
let boxBound = spiritbalancer.width();
let bubBound = bubble.width();
let maxX = boxBound - bubBound;

// setup direction object
let direction = {x:0, y:0};

// NOTE: this function courtesy of https://github.com/apache/cordova-docs/blob/master/www/docs/en/1.7.0/cordova/accelerometer/accelerometer.md
function onLoad(){
  $(document).on("deviceready", deviceReady);
}

function deviceReady(){

  // clicking on 'open spirit level' hides the page, shows the spirit level and starts the accelerometer
  $("#p1").click(()=>{
    $("#pageone").hide();
    $("#pagetwo").show();
    startAccel();
  });

  // clicking on 'leave spirit level' hides the page, shows the front page and stops the accelerometer
  $("#p2").click(()=>{
    stopAccel();
    $("#pagetwo").hide();
    $("#pageone").show();
  });

}
// NOTE: this function courtesy of https://github.com/apache/cordova-docs/blob/master/www/docs/en/1.7.0/cordova/accelerometer/accelerometer.md
function startAccel(){
  getAccelInfo = navigator.accelerometer.watchAcceleration(success, error, frequency);
}

// NOTE: this function courtesy of https://github.com/apache/cordova-docs/blob/master/www/docs/en/1.7.0/cordova/accelerometer/accelerometer.md
function stopAccel(){
  navigator.accelerometer.clearWatch(getAccelInfo);
}

// if the accelerometer plugin has loaded correctly, and is working, the coords are calculated
function success(accelerator){

  // NOTE: the accelerator x and y are flipped in the accelerometer function
  // hence the change in the x - y co-ords.
  // toFixed(2) keeps it to two decimal places.
  direction.x = +((accelerator.y).toFixed(2));
  direction.y = +((accelerator.x).toFixed(2));

  // NOTE: the accelerator x is also inverted in the plugin so had to reverse the pos and neg.
  // Math.abs changes the absolute value (+ or -) to its opposite
  if(direction.x < 0) direction.x = Math.abs(direction.x);
  else if(direction.x > 0) direction.x = -Math.abs(direction.x);

  // work out where the bubble should be (this took forever to work out)
  let calcX = +((((direction.x + 2) / 2) * ((boxBound / 2) - (bubBound / 2))).toFixed(2));
  let calcY = +((((direction.y + 2) / 2) * ((boxBound / 2) - (bubBound / 2))).toFixed(2));

  // Stop the bubble going outside the bounds of the box
  if(calcX < 0) calcX = 0;
  if(calcY < 0) calcY = 0;
  if(calcX > maxX) calcX = maxX;
  if(calcY > maxX) calcY = maxX;

  // change the top ond left positions of the bubble
  bubble.css("top", calcX + "px" ).css("left", calcY + "px" );

  // display the co-ords on screen
  $(".coords").text(`x = ${calcX} | y = ${calcY}`);

}

// if the accelerometer plugin fails, an alert shows
function error(){
  alert('Something has gone horribly wrong...');
}
