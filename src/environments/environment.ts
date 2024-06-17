// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  version: {
    major: '0',
    minor: '0',
    patch: '0',
  },
  build: {
    changeset: '0000000',
  },
  apiBaseUrl: 'http://api.raildepot.local',
  localStorageKeyPrefix: 'raildepot_',
  privacyPolicyUrl: '',
  termsOfServiceUrl: '',
  feedbackEmailAddress: '',
  revenueCatApiKey: {
    android: '',
    ios: '',
  },
  firebase: {
    apiKey: 'AIzaSyBrUNhwuMS4Lu_Ozoz9Z0dWn4PpJRQ4FZo',
    authDomain: 'raildepot-e1a29.firebaseapp.com',
    projectId: 'raildepot-e1a29',
    storageBucket: 'raildepot-e1a29.appspot.com',
    messagingSenderId: '64109759901',
    appId: '1:64109759901:web:5ab0d50bdf96cecd27f374',
    vapidKey:
      'BDs-v5en33I4GvW4p07Kj3Cndkx-znS81bmJfYvohq-h7EBhjaMvT4eA75V_-nEF42PpqKG97Q3LKtxBCS3ozjE',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
