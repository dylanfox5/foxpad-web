var socket = io("https://foxpad-server.herokuapp.com/");
var showChat = false;
var videoID;
var player;
var seconds;

var uuidCurr;


// Parse the URL parameter
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
// Give the parameter a variable name
var dynamicContent = getParameterByName('dc');

$(document).ready(function () {
    console.log(dynamicContent);
    uuidCurr = dynamicContent;
    socket.emit("get-session-data", dynamicContent);
    socket.on("get-session-data", (video) => {
        videoID = video;
    });
});

// YT API logic 
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function showVideo() {
    document.getElementById("thumbnail-div").style.display = "block";
    document.getElementById("thumbnail").src = "https://img.youtube.com/vi/" + videoID  + "/hqdefault.jpg";
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: videoID,
        playerVars: {
            'controls': 0,
            'disablekb': 1,
            // 'start': Math.floor((Utimestamp - hostTimestamp) / 1000)
        },
        events: {
            'onReady': onPlayerReady,
            // 'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    socket.emit("get seconds");
    socket.on("send seconds", (data) => {
        seconds = Math.floor(data);
        player.seekTo(seconds);
        playVideo();
    });
}

function onPlayerStateChange(event) {
    if (event.data == 1) {
        socket.emit("get seconds");
        socket.on("send seconds", (data) => {
            seconds = Math.floor(data);
            console.log(seconds);
            player.seekTo(seconds);
        });
    }
}

function playVideo() {
    player.playVideo();
}
function stopVideo() {
    player.stopVideo();
}
function pauseVideo() {
    player.pauseVideo();
}

// Socket Listeners
socket.on("play", (data) => {
    console.log(data);
    if (data == uuidCurr) {
        playVideo();
    }
});
socket.on("pause", (data) => {
    console.log(data);
    if (data == uuidCurr) {
        pauseVideo();
    }
});
// socket.on("play", playVideo);
// socket.on("pause", pauseVideo);