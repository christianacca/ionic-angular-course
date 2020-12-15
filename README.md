# ionic-angular-course

https://www.udemy.com/course/ionic-2-the-practical-guide-to-building-ios-android-app

## Run locally

1. `yarn`
2. set the google api key [here](./src/environments/environment.ts#L7)
3. `yarn start`

## Links

- [This deployed app](https://cc-ionic-angular-course.web.app)
- [google maps console](https://console.cloud.google.com/google/maps-apis/overview?project=cc-ionic-angular-course&folder=&organizationId=)
- [google firebase console](https://console.firebase.google.com/project/cc-ionic-angular-course/overview)

## Google api key security

The google api key has been restricted for google maps to allow only requests from domain: cc-ionic-angular-course.web.app

## Deployment (manual)

## Setup tooling

1. Install firebase cli as a global tool: `npm i firebase-tools -g`
2. Login to firebase from the root of this project directory: `firebase login`

### Deploy google functions

1. set the `private_key` value [here](./functions/ionic-app-service-account.json#L5)
2. from the root of the project run: `firebase deploy`

### Deploy SPA

1. set the google api key [here](./src/environments/environment.prod.ts#L3)
2. from the root of the project run:

```bash
yarn build --prod
firebase deploy
```
