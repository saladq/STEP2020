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

function getEmail(){
    fetch('/userInfo').then(response => response.json()).then((currentUser) => {
        console.log(currentUser[1]);
        return currentUser[1];
    })
}

function getComments() {
  fetch('/updateComments').then(response => response.json()).then((comments) => {
    fetch('/userInfo').then(response => response.json()).then((currentUser) => {
        console.log(currentUser[1]);
            const lst = document.getElementById('commentList');
            var currEmail = currentUser[1];
            var num = 0;
            lst.innerHTML="";
            
            comments.forEach((c) => {
                if (c.email == currEmail){
                    console.log("name: "+c.name);
                    lst.appendChild(createDeleteCheckBox(c.name, c.date, c.comment, num, c.id));
                    num++;
                } else{
                    lst.appendChild(createCommentElement(c.name, c.date, c.comment, c.id));
                }
          //      lst.appendChild(createListElement(c.comment));
            })
            document.getElementsByName("commentForm")[0].reset();
            document.getElementsByName("commentForm")[1].reset();
    })
 
  });
}

function createDeleteCheckBox(name, date, comment, num, commentId){
    var box = document.createElement('input');
    box.type = "checkbox";
    box.id = "checkbox"+num;
    box.name= "userCheckbox";
    var line = createNameDateElement(name, date);
    line.appendChild(box);
    var liElement = document.createElement('li');
    liElement.id = commentId;
    liElement.appendChild(line);
    liElement.appendChild(createListElement(comment));
    return liElement;
}

// returns an array of the ids of selected comments
function getChecked(e) {
  e.preventDefault();
  var checkboxes = document.querySelectorAll("input[type=checkbox]");
  var checked = [];

  for (var i = 0; i < checkboxes.length; i++) {
    var checkbox = checkboxes[i];
    if (checkbox.checked){
        console.log("parent id: " + checkbox.parentNode.parentNode.id);
        checked.push(checkbox.parentNode.parentNode.id);
    }
  }

  var hiddenSelectedComments = document.getElementById("selectedComments");
  hiddenSelectedComments.value = checked.join(",");
  console.log(hiddenSelectedComments.value);
  deleteComments(hiddenSelectedComments);
}

function getName(info){
    fetch('/userInfo').then(response => response.json()).then((currentUser) => {
        commentsect = document.getElementById("commentSection");
        namechange = document.getElementById("nameChange");
        if (info.logged){
            if(!currentUser[0] || currentUser[0] == false) {
            namechange.style.display='block';
            commentsect.style.display='none';
            } else{
                commentsect.style.display='block';
                namechange.style.display='none';
                createLogoutButton(info.url);
            }
            document.getElementById("displayName").innerText = currentUser[0];
        } else {
            namechange.style.display='none';
            commentsect.style.display='none';
        }
    })
}

function loginInfo(){
    fetch("/login").then(response => response.json()).then((info) => {
        this.getName(info);
        loginform = document.getElementById("loginForm");
        console.log(info);
        console.log(name);
        if (info.logged == true){
            console.log("hiding login form");
            loginform.style.display='none';
        } else {
            console.log("displaying login form");
            loginform.style.display='block';
        }
    })
}

//takes user to login page
function login(){
    fetch("/login").then(response => response.json()).then((info) => {
        console.log(info.url);
        window.location.replace(info.url);
    })

}

function createLogoutButton(url){
    var log = document.getElementById("log");
    var button = document.createElement('button');
    var a = document.createElement('a');
    var link = document.createTextNode("Logout");
    button.appendChild(link);
    button.className = "button";
    a.href = url;
    a.appendChild(button);
    log.appendChild(a);

}

function createName(e){
    e.preventDefault();
    var name = document.getElementById("name").value;
    console.log("created name: "+name);
    const requestPost = new Request("/userInfo?name=" + name, {method:'POST'});
    fetch(requestPost).then((response) => {
        if (!response.ok) {throw Error(response.statusText);}
        return this.loginInfo();
    })

}

function postComment(e) {
    e.preventDefault();
    var comment = document.getElementById("comment").value;
    var name = document.getElementById("name").value;
    const requestPost = new Request('/updateComments?comment=' + comment+'&name='+name, {method: 'POST'});
    fetch(requestPost).then((response) => {
        if (!response.ok) {throw Error(response.statusText);}
        return this.getComments();
    })
}

function sortComments(sort){
    const requestPost = new Request('/updateComments?sc=' + sort.value, {method: 'POST'});
    fetch(requestPost).then(response => response.text()).then(text =>{
        if (text!= null){
            getComments();
        }
    });
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

function deleteComments(){
    var selectedComments = document.getElementById("selectedComments").value;
    const requestPost = new Request('/deleteComments?selectedComments=' + selectedComments, {method: 'POST'});
    fetch(requestPost).then((response) => {
        if (!response.ok) {throw Error(response.statusText);}
        return this.getComments();
    })
}

function createCommentElement(name, date, comment, commentId){
    const liElement = document.createElement('li');
    liElement.id = commentId;
    liElement.appendChild(createNameDateElement(name, date));
    liElement.appendChild(createListElement(comment));
    return liElement;
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

