// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random image to the page.
 */
function addRandomImage() {

  // Pick a random number.
  let numOfImages = 7;
  let randNum = Math.floor(Math.random() * num) + 1;

  // Add corresponding image to page.
  var image = "/images/bake" + randNum + ".jpg";
  document.getElementById('image-container').src = image;
}

/**
 * Adds a back to top button 
 */


// When the user scrolls down 50px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  var topbutton = document.getElementById("top-button");
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    topbutton.style.display = "block";
  } else {
    topbutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
