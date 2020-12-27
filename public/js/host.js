var socket = io("https://foxpad-server.herokuapp.com/");
var showChat = false;
var videoID;
var videoTitle;
var player;
var uuid;

// host is logged in
socket.emit("host");

// listeners
socket.on("video id", (id) => {
    console.log("id is set");
    videoID = id;
});
socket.on("get seconds", () => {
    socket.emit("send seconds", player.getCurrentTime());
});

// YT API logic 
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

document.getElementById("start").onclick = function () {
    if (videoID == null) {
        socket.emit("get videoID");
        socket.on("get videoID", (id) => {
            videoID = id;
        });
    }
    document.getElementById("start-content").style.display = "block";
    document.getElementById("title").innerHTML = videoTitle;
    document.getElementById("thumbnail").src = "https://img.youtube.com/vi/" + videoID  + "/hqdefault.jpg";
    document.getElementById("buttons").style.display = "none";

    socket.emit("session-data", videoID);
    socket.on("uuid", (data) => {
        uuid = data;
        document.getElementById("link").value = "https://foxpad-44db4.web.app/listener?dc=" + uuid;
    });
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: videoID,
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerStateChange(event) {
    if (event.data == -1) {
        console.log("unstarted");
    }
    else if (event.data == 0) {
        console.log("ended");
        socket.emit("stop", uuid);
    }
    else if (event.data == 1) {
        console.log("playing", uuid);
        socket.emit("play", uuid);
    }
    else if (event.data == 2) {
        console.log("paused", uuid);
        socket.emit("pause", uuid);
    }
    else if (event.data == 3) {
        console.log("buffering")
    }
    else if (event.data == 5) {
        console.log("cued");
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

// YT Auth
function loadClient() {
    gapi.client.setApiKey("AIzaSyAu9ZAeh_h1uerucOZPmWoBi7AX5A1piok");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function () {
            console.log("GAPI client loaded for API");
        },
            function (err) {
                console.error("Error loading GAPI client for API", err);
            });
}

function execute() {
    query = document.getElementById("query").value;
    return gapi.client.youtube.search.list({
        "part": "snippet",
        "maxResults": 1,
        "q": query,
        "type": "video",
        "videoEmbeddable": "true"
    })
        .then(function (response) {
            // videoID = response["result"]["items"][0]["id"]["playlistId"];
            videoID = response["result"]["items"][0]["id"]["videoId"];
            videoTitle = response["result"]["items"][0]["snippet"]["title"];
            document.getElementById("start").style.display = "inline-block";
        },
            function (err) { console.error("Execute error", err); });
}

gapi.load("client:auth2", function () {
    gapi.auth2.init({
        client_id: "991473044430-fvc30otq36q5000ndil1vr5cg30cnj1c.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/youtube.force-ssl"
    });
});

// logic to get videoID from a YT url
function getID() {
    url = document.getElementById("url").value;
    console.log(parseURL(url));
}

function parseURL(url) {
    var parser = document.createElement('a'),
        searchObject = {},
        queries, split, i;
    // Let the browser do the work
    parser.href = url;
    // Convert query string to object
    queries = parser.search.replace(/^\?/, '').split('&');
    for (i = 0; i < queries.length; i++) {
        split = queries[i].split('=');
        searchObject[split[0]] = split[1];
    }
    // videoID = searchObject["v"];
    // videoID = searchObject["list"];
    document.getElementById("start").style.display = "inline-block";
    console.log(videoID);
    // socket.emit("video id", videoID);
    return {
        protocol: parser.protocol,
        host: parser.host,
        hostname: parser.hostname,
        port: parser.port,
        pathname: parser.pathname,
        search: parser.search,
        searchObject: searchObject,
        hash: parser.hash
    };
}

function myFunction() {
    var copyText = document.getElementById("link");
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
}