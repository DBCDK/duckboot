# Duckboot
Duckboot is an example client/gui for library recommenders. 
A user can build a profile by searching library posts and liking/disliking them. Based on these likes/dislikes recommendations can be given. 
It is possible to configure 


# Requirements/features

## Search
* Search library posts
* Like/dislike posts
* Add frontpage image if valid token to openplatform is available in profile.

## Profile
* Create profile
* View profile
* Change profile

## Recommendations
* Configure recommender buttons and views
* View recommendations
* View recommendations as json
* View requests as json

## data
All data for profiles is stored in localstorage.

#Development
For rapid development [create-react-app](https://github.com/facebookincubator/create-react-app) is used.
This is only needed for development.
To start ti the application in development mode run `npm run start`

#deploy
run `npm run build`. Frontend Application is added to the deploy folder. 
 
# Start application
start the application with `node src/server/index.js`

# Environment Variables
- `PORT`: `8080`
- `OP_CLIENT`: `Open platform client ID`
- `OP_SECRET`: `Open platform client Secret`
- `AUTH_URI`: `E.g. https://auth.dbc.dk`
- `OP_URI`: `E.g. https://openplatform.dbc.dk/v1`