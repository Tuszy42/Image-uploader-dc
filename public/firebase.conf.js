function initFirebase(){
    if(typeof firebaseConfig === 'undefined'){
        console.error('You need to initialize the Firebase config file before using this app!');
        return;
    }
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
}

initFirebase();