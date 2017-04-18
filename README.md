# Reddit Backend for ClueP Dev Challenge

## Requirements: 
Develop a simple Reddit client web UI.

The Index page should have a simple but efficient AutoComplete box which takes you to the appropriate subreddit, you must handle the case when the subreddit doesn’t exist.

Each Subreddit page should have at least the following
Jumbotron displaying the subreddit and Banner (if it exists)
A max of 25 posts with the ability to load 25 more by click on a “Load More” button.
Each Post must have a title, link to post, and a pic (if it exists)
Each Post page should have at least the following
Jumbotron displaying the subreddit
Title of post and post content
and all comments in whatever manner you may like

## Approach:
Accessed Reddit API using RESTful routing built with Koa.js libraries.
Tested during development using postman.

## Local Installation:

1. run `git clone git@github.com:wichopy/reddit-client-backend.git` at your desired location to clone repo.
2. `npm i` to get dependancies
  - `npm install -g nodemon` to run server. Use for hot reloading on changes.
3. `npm start` to run server and the api will be accessible on `localhost:3001`


