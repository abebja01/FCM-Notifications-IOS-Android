var firebase = require('firebase-admin');
var API_KEY = "<API KEY>"; // Your Firebase Cloud Messaging Server API key

// Fetch the service account key JSON file contents
var serviceAccount =  require ("../path to/ serviceAcc.json")
// Initialize the app with a service account, granting admin privileges
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "<database_url>"
});
ref = firebase.database().ref();

// The topic name can be optionally prefixed with "/topics/".




function listenForNotificationRequests() {
  // mobileNotificationReuqest is an example, you can have many of these and change the database reference according to your needs
  var requests = ref.child('mobileNotificationRequest');
  requests.on('child_added', function(requestSnapshot) {

 
      
    var request = requestSnapshot.val();
    console.log(request);
    sendNotificationToUser(
      request.alertTitle, 
      request.alertBody,
      function() {
        requestSnapshot.ref.remove();
      }
    );
  }, function(error) {
    console.error(error);
  });
};

function sendNotificationToUser(alertTitle, alertBody, onSuccess) {
  // the topic that is going to be listened to by the FCM in both your app versions in  IOS and Android
    var topic = 'mobileNotification';
 
    var message = {
        notification: {
            title: alertTitle,
            body: alertBody
          },
      topic: topic
    };
    

    firebase.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
      onSuccess()
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
  
}

// start listening
listenForNotificationRequests();