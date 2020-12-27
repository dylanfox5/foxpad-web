var socket = io("https://foxpad-server.herokuapp.com/");
var currUser;

var firebaseConfig = {
    apiKey: "AIzaSyCJZD_0zuI8kHlqImclGj3KULVm5BgExP8",
    authDomain: "foxpad-44db4.web.app",
    projectId: "foxpad-44db4",
    appId: "1:528233734401:web:0a043b110a7808ea7f7b00",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            currUser = user;
            document.getElementById("username").innerHTML = "Welcome, " + user.displayName + "!";
        }
    });
});

function signOut() {
    firebase.auth().signOut().then(function () {
        console.log('User signed out.');
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
            }
            else {
                window.location = "index.html";
            }
        });
        // window.open("login.html", '_self');
    }).catch(function (error) {
        console.log(error);
    });
}

function openHost() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log(user);
            window.location = "host.html";
        }
    });
}