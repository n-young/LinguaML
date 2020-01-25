//environment.js
var environments = {
    staging: {
      FIREBASE_API_KEY: 'AIzaSyBIEr3ex-v6_4BruT9eIT65uuUEjv7zhTY',
      FIREBASE_AUTH_DOMAIN: 'lingua-d94eb.firebaseapp.com',
      FIREBASE_DATABASE_URL: 'https://lingua-d94eb.firebaseio.com',
      FIREBASE_PROJECT_ID: 'lingua-d94eb',
      FIREBASE_STORAGE_BUCKET: 'lingua-d94eb.appspot.com',
      FIREBASE_MESSAGING_SENDER_ID: '109488599692',
      GOOGLE_CLOUD_VISION_API_KEY: 'AIzaSyBbGe2T2ilrNjTIfqlnocJm62eeOByKE-4'
    },
    production: {
      // Warning: This file still gets included in your native binary and is not a secure way to store secrets if you build for the app stores. Details: https://github.com/expo/expo/issues/83
    }
  };
  
  function getReleaseChannel() {
    let releaseChannel = undefined;
    if (releaseChannel === undefined) {
      return 'staging';
    } else if (releaseChannel === 'staging') {
      return 'staging';
    } else {
      return 'staging';
    }
  }
  function getEnvironment(env) {
    console.log('Release Channel: ', getReleaseChannel());
    return environments[env];
  }
  var Environment = getEnvironment(getReleaseChannel());
  export default Environment;
