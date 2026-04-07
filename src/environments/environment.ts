// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBase: 'http://localhost:3001/v1',
  salt: 'dlnv-salt',
  wsBase: 'wss://ltp.dailytrades.in/ws/',
  SITE_KEY_V2: '6LfdsPwrAAAAAAcS0ENANf3Yl-IicNwU1s5Y0VAD',
  SITE_KEY_V3: '6LeJr_wrAAAAAMLEylNmrmI6hmFGD-6B9gNdrdAX',
  environment: '',
   chatServer: 'https://chat.qa.dailytrades.in',
   traderSiteUrl:'http://localhost:4000',
};

// export const environment = {
//   production: true,
//   apiBase: 'https://adviser.qa.dailytrades.in/v1',
//    chatServer: 'https://chat.qa.dailytrades.in',
//   salt: 'dlnv-salt',
//   wsBase: 'wss://ltp.dailytrades.in/ws/',
//   SITE_KEY_V2: '6LfdsPwrAAAAAAcS0ENANf3Yl-IicNwU1s5Y0VAD',
//   SITE_KEY_V3: '6LeJr_wrAAAAAMLEylNmrmI6hmFGD-6B9gNdrdAX',
//   environment: 'dev',
//   traderSiteUrl:'https://qa.dailytrades.in',
// };


// export const environment = {
//   production: true,
//   apiBase: 'https://advisor.dailytrades.in/v1',
//   salt: 'dlnv-salt'
// };




/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
