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

function createMap(){
    var nyc = {lat: 40.70, lng: -73.985}
    const map = new google.maps.Map(
    document.getElementById('map'),
    {center: nyc, zoom: 10,
    styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]}
    );
    var marker = new google.maps.Marker({position: nyc, map: map});

    var contentString = '<h3>New York City</h3>'+
      "<p style = 'font-size: 12px'>I grew up in NYC and love the "+
      'commotion of the city. I attended elementary and middle school in my '+
      'small neighborhood in Queens. I later attended high school '+
      'in the city, first at Hunter College High School, and then '+
      'at Trinity School. One of my favorite things to do is to go '+
      'out and explore various restaurants and bakeries!</p>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker.addListener('mouseover', function() {
        infowindow.open(map, marker);
    });
    marker.addListener('mouseout', function() {
        timeoutID = setTimeout(function() {
            infowindow.close();
        }, 200);
    });
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
            const lst = document.getElementById('commentList');
            var currEmail = currentUser[1];
            var num = 0;
            var likesCounter = 0;
            var likeElement;
            var dislikeElement;
            lst.innerHTML="";
            
            comments.forEach((c) => {
                if (c.email == currEmail){
                    console.log("name: "+c.name);
                    lst.appendChild(createDeleteCheckBox(c.name, c.date, c.comment, num, c.id, likesCounter));
                    num++;
                } else{
                    lst.appendChild(createCommentElement(c.name, c.date, c.comment, c.id, likesCounter));
                }
                var requestPost = new Request('/likes?commentId=' + c.id, {method: 'GET'});
                fetch(requestPost).then(response => response.json()).then((likeStats) => {
                    console.log("likestats: "+likeStats);
                    likeElement = document.getElementById("like"+c.id);
                    console.log("likeel id:" +likeElement.id);
                    dislikeElement = document.getElementById("dislike"+c.id);
                    likeElement.innerText = likeStats[0];
                    dislikeElement.innerText = likeStats[1];
                })
            //    getLikes(c.id);
                likesCounter++;
            })
            document.getElementsByName("commentForm")[0].reset();
            document.getElementsByName("commentForm")[1].reset();
    })
  });
}

function createDeleteCheckBox(name, date, comment, num, commentId, likesCounter){
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
    liElement.appendChild(createLikesIcons(commentId));
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
                document.getElementById("logout").style.display='block';
                document.getElementById("changeName").style.display='block';
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
        return this.getComments();
    })
}

//takes user to login page
function login(){
    fetch("/login").then(response => response.json()).then((info) => {
        console.log(info.url);
        window.location.replace(info.url);
    })

}

function showNameForm(){
    var changeNameButton = document.getElementById("changeName");
    var changeNameForm = document.getElementById("nameChange");
    var commentSect = document.getElementById("commentSection");

    changeNameButton.style.display = 'none';
    changeNameForm.style.display = 'block';
    commentSect.style.display = 'none';
}

function createName(e){
    e.preventDefault();
    var name = document.getElementById("name").value;
    console.log("created name: "+name);
    const requestPost = new Request("/userInfo?name=" + name, {method:'POST'});
    fetch(requestPost).then((response) => {
        if (!response.ok) {
            alert("Name already exists. Please pick another.");
        } else{
            return this.loginInfo();
        }
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

function filterComments(filter){
    const requestPost = new Request('/updateComments?filter=' + filter.value, {method: 'POST'});
    fetch(requestPost).then(response => response.text()).then(text =>{
        if (text!= null){
            getComments();
        }
    });
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

function postLikes(likeElement, likeType){
    var commentId = likeElement.parentNode.parentNode.id;
    
    const requestPost = new Request('/likes?commentId=' + commentId+'&likeType='+likeType, {method: 'POST'});
    fetch(requestPost).then((response) => {
        if (!response.ok) {throw Error(response.statusText);}
        return this.getLikes(commentId);
        console.log("comment id of like el: "+commentId);
    }) 
}

function getLikes(commentId){
    const requestPost = new Request('/likes?commentId=' + commentId, {method: 'GET'});
    fetch(requestPost).then(response => response.json()).then((likeStats) => {
        console.log("likestats: "+likeStats);
        var likeElement = document.getElementById("like"+commentId);
        var dislikeElement = document.getElementById("dislike"+commentId);
        likeElement.innerText = likeStats[0];
        dislikeElement.innerText = likeStats[1];
    })
}

function createLikesIcons(commentId){
    const liElement = document.createElement('li');
    const likeElement = document.createElement('i');
    var dislikeElement = createDislikesIcon(commentId);

    likeElement.className = "fa fa-thumbs-o-up";
    likeElement.style.fontSize="20px";
    likeElement.style.paddingRight="10px";
    likeElement.style.color = "green";
    likeElement.id = "like"+commentId;
    likeElement.innerText = "0";
    likeElement.onclick = function() {postLikes(likeElement, "like")};

    liElement.style.paddingBottom="30px";
    liElement.appendChild(likeElement);
    liElement.appendChild(dislikeElement);

    return liElement;
}

function createDislikesIcon(commentId){
    const dislikeElement = document.createElement('i');

    dislikeElement.className = "fa fa-thumbs-o-down";
    dislikeElement.style.fontSize="20px";
    dislikeElement.style.color="red";
    dislikeElement.innerText = "0";
    dislikeElement.id = "dislike"+commentId;
    dislikeElement.onclick = function() {postLikes(dislikeElement, "dislike")};

    return dislikeElement; 
}

function createCommentElement(name, date, comment, commentId, likesCounter){
    const liElement = document.createElement('li');
    liElement.id = commentId;
    liElement.appendChild(createNameDateElement(name, date));
    liElement.appendChild(createListElement(comment));
    liElement.appendChild(createLikesIcons(commentId));
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

