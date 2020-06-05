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
  let randNum = Math.floor(Math.random() * numOfImages) + 1;

  // Add corresponding image to page.
  var image = "/images/bake" + randNum + ".jpg";
  document.getElementById('image-container').src = image;
}

/**
 * Adds a back to top button 
 */


// When the user scrolls down 300px from the top of the document, show the button
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

function getComments() {
  fetch('/updateComments').then(response => response.json()).then((comments) => {
    const lst = document.getElementById('commentList');
    lst.innerHTML="";
    
    comments.forEach((c) => {
        lst.appendChild(createNameDateElement(c.name, c.date));
        lst.appendChild(createListElement(c.comment));
    })
    document.getElementsByName("commentForm")[0].reset();
    document.getElementsByName("commentForm")[1].reset();
  });
}

function postComment(e) {
    e.preventDefault();
    var comment = document.getElementById("comment").value;
    var name = document.getElementById("name").value;
    const requestPost = new Request('/updateComments?comment=' + comment+'&name='+name, {method: 'POST'});
    fetch(requestPost).then((response) => {
        if (!response.ok) {throw Error(response.statusText);}
        return this.getComments();
    })/*
    fetch(requestPost).then(response => response.text()).then(text =>{
    if (text!= null) getComments();
    });*/
  
}

function setMaxComments(e){
    e.preventDefault();
    var maxComments = document.getElementById("maxComments").value;
    const requestPost = new Request('/updateComments?maxComments=' + maxComments, {method: 'POST'});
    fetch(requestPost).then(response => response.text()).then(text =>{
        if (text!= null){
            getComments();
        }
    });
}

function deleteComments(e){
    e.preventDefault();
    const requestPost = new Request('/deleteComments', {method: 'POST'});
    fetch(requestPost).then((response) => {
        if (!response.ok) {throw Error(response.statusText);}
        return this.getComments();
    })
}

function createIcon(){
    const faElement = document.createElement('i');
    faElement.className = "fa fa-user";
    faElement.style.fontSize="20px";
    faElement.style.paddingRight = "10px";
    return faElement;
}

function createNameDateElement(name, date){
    const liElement = document.createElement('li');
    liElement.appendChild(createIcon());
    liElement.appendChild(createNameElement(name));
    liElement.appendChild(createDateElement(date));
    liElement.style.paddingBottom = "15px"
    return liElement;
}

function createNameElement(name){
    const nameSpan = document.createElement('span');
    nameSpan.className = "name";
    nameSpan.innerText = name;
    nameSpan.style.paddingRight = "10px;"
    return nameSpan;
}

function createDateElement(date){
    const dateSpan = document.createElement('span');
    dateSpan.className = "date";
    dateSpan.innerText = date;
    return dateSpan;
}

function createListElement(comment) {
  const liElement = document.createElement('li');
  liElement.className= "comnt";
  liElement.innerText = comment;
  return liElement;
}

