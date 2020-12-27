var socket = io("https://foxpad-server.herokuapp.com/");
var userID;

var firebaseConfig = {
    apiKey: "AIzaSyCJZD_0zuI8kHlqImclGj3KULVm5BgExP8",
    authDomain: "foxpad-44db4.web.app",
    projectId: "foxpad-44db4",
    appId: "1:528233734401:web:0a043b110a7808ea7f7b00",
};

// Initialize Firebases
firebase.initializeApp(firebaseConfig);

function onSignIn(googleUser) {
    // console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
            // Sign in with credential from the Google user.
            firebase.auth().signInWithCredential(credential).then(execute).catch(function (error) {
                console.log(error);
            });
        } else {
            console.log('User already signed-in Firebase.');
            execute();
        }
    });
}

function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
                // We don't need to reauth the Firebase connection.
                return true;
            }
        }
    }
    return false;
}

function execute() {
    firebase.auth().currentUser.getIdToken(true).then(function (idToken) {
        console.log("User signed in.");
        socket.emit("login", idToken);
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log(user);
                window.location = 'home.html';
            }
        });
    }).catch(function (error) {
        console.log(error);
    });
}