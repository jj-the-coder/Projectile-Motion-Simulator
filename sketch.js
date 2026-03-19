var v0;
var angle;
var h;
var x = 0;
var y;
var t = 0;
var paused;
var pausedStart;
var maxHeight;
var trailX;
var trailY;
var trailTime = 0;
var maxDistance

function setup() {
  // Create UI elements and adjust program settings
  createCanvas(1000, 600);
  vSlider = createSlider(1, 50, 10, 1);
  aSlider = createSlider(1, 90, 30, 1);
  hSlider = createSlider(0, 10, 0, 1);
  pauseBox = createCheckbox();
  angleMode(DEGREES);
  frameRate(240);
}

function draw() {
  // Basic elements, always update each frame
  background(220);
  line(60, 450, 1000, 450);
  textSize(15);
  text("To pause, click the checkbox.", 780, 525);
  textSize(10);
  v0 = vSlider.value();
  text("Velocity: " + v0 + " m/s", 328, 590);
  angle = aSlider.value();
  text("Angle: " + angle + "°", 477, 590);
  h = hSlider.value();
  text("Height: " + h + "m", 605, 590);

  // Determine max height and distance based 
  // on set velocity, angle, and height.
  // Uses basic kinematics formulas
  var heightTime = (v0 * sin(angle)) / 4.905 / 2;
  maxHeight = v0 * sin(angle) * heightTime - 4.905 * pow(heightTime, 2) + h;
  var distanceTime = (-(v0 * sin(angle)) - sqrt(pow((v0 * sin(angle)), 2) - 4 * -4.905 * h)) / 2 / -4.905
  maxDistance = v0 * cos(angle) * distanceTime;
  textSize(13);
  text("Maximum Height: ~" + round(maxHeight, 3) + "m", 417, 535);
  text("Maximum Distance: ~" + round(maxDistance, 3) + "m", 410, 555);
  textSize(10);

  if (pauseBox.checked()) {
    // Calculate x and y position each frame
    x = 3 * v0 * cos(angle) * t + 75;
    y = -6 * (h + v0 * sin(angle) * t - 4.905 * pow(t, 2));
    
    // Check if ball is under the ground. If so, adjust to 
    // when it WOULD HAVE hit the ground. 
    if (y <= 0) {
      paused = false;
      circle(x, y + 450, 10);
      line(75, 475, x, 475);
      line(50, 450, 50, y + 450);
      text(round((x - 75) / 3, 3) + "m", (x - 75) / 2 + 50, 490);
      text(round(y / -6, 3) + "m", 5, y / 2 + 450);
      textSize(13);
      text("Time elapsed: ~" + round(t, 3) + "s", 430, 515);
      textSize(20);
      text("PAUSED", 835, 555);
      textSize(10);
    } else {
      var newTime =
        (-v0 * sin(angle) - sqrt(pow(v0 * sin(angle), 2) + 4 * 4.905 * h)) /
        -9.81;
      var newX = 3 * v0 * cos(angle) * newTime + 75;
      circle(newX, 450, 10);
      line(75, 475, newX, 475);
      text(round((newX - 75) / 3, 3) + "m", (newX - 75) / 2 + 50, 490);
      text("0m", 15, 450);
      textSize(13);
      text("Time elapsed: ~" + round(newTime, 3) + "s", 430, 515);
      textSize(10);
      textSize(20);
      text("PAUSED", 835, 555);
      textSize(10);
    }
    
  // If ball is on the ground, pause animation for 1 second, then replay.
  } else if (paused) {
    circle(x, y + 450, 10);
    line(75, 475, x, 475);
    text(round((x - 75) / 3, 3) + "m", (x - 75) / 2 + 50, 490);
    text("0m", 15, 450);
    textSize(13);
    text("Time elapsed: ~" + round(t, 3) + "s", 430, 515);
    textSize(10);
    if (millis() - pausedStart > 1000) {
      t = 0;
      paused = false;
    }
    
  // If no reason to be paused, continue animating the next frame.
  } else {
    t = t + deltaTime / 1000;
    x = 3 * v0 * cos(angle) * t + 75;
    y = -6 * (h + v0 * sin(angle) * t - 4.905 * pow(t, 2));
    
    // Checks if ball is under the ground. If so, that frame becomes the last
    // one in the animation, then sets pause to true.
    if (y <= 0) {
      circle(x, y + 450, 10);
      line(75, 475, x, 475);
      line(50, 450, 50, y + 450);
      text(round((x - 75) / 3, 3) + "m", (x - 75) / 2 + 50, 490);
      text(round(y / -6, 3) + "m", 5, y / 2 + 450);
      textSize(13);
      text("Time elapsed: ~" + round(t, 3) + "s", 430, 515);
      textSize(10);
    } else {
      circle(x, y + 450, 10);
      line(75, 475, x, 475);
      text(round((x - 75) / 3, 3) + "m", (x - 75) / 2 + 50, 490);
      text("0m", 15, 450);
      textSize(13);
      text("Time elapsed: ~" + round(t, 3) + "s", 430, 515);
      textSize(10);
      pausedStart = millis();
      paused = true;
    }
  }

  // Resets trailTime variable
  trailTime = 0;

  // Creates the ball path.
  for (var i = 0; i < 50; i++) {
    trailY = -6 * (h + v0 * sin(angle) * trailTime - 4.905 * pow(trailTime, 2));
    trailX = 3 * v0 * cos(angle) * trailTime;
    if (trailY <= 0) {
      strokeWeight(3);
      point(trailX + 75, trailY + 450);
      strokeWeight(1);
      trailTime = trailTime + 0.2;
    } else {
      break;
    }
  }
}