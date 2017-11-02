# CS 4288: Web-based System Architecture 
## Programming Assignment 4

## Overview

For this assignment you are to begin building out the server-side of your application.  If done properly, this should blend seamlessly with the React-based SPA client developed in Assignment #3.  Listed below are the requirements for the specific enhancements you need to make and how they will be graded.  Follow the directions closely!


### Enhancements

## Add Mongo and Mongoose (10pts - I've done some of it for you!)

* I would recommend using Docker and Kitematic to easily install MongoDB on your laptop..

* Enhance your index.js so that when you start it running, it connects to your Mongo instance.  This needs to be configurable, since we will need your application to connect to our Mongo instance when we test it.  Your connection should connect to a database named the same as your VUNetID, for example mongodb://localhost:33701/heminggs.  You should not need anything more than a simple connection, so don't worry about any advanced configuration parameters.

* This same connection string can be found in the testing material in ***test/api/data.json***.  Make sure to set it here too.

## Mongoose Schemas (20pts each)

Develop Mongoose schemas for Users and Games.  You know most of the fields that should be included in each of these schemas.  Think of what else is necessary.  In class we will explore the initial stages of support for Users.  Expand on this and leverage this knowledge to complete the Games schema.

* Schema for User (see in class discussion)

* Schema for Game (see in class discussion)


## Server-Side Workflow Support (70 points)

There are a number of things that need to get upgraded throughout the application.  You need to support CRUD actions for users and games.  This means that a user should be able to register, log in and out, view profiles and modify their profile (eventually).  A user should also be able to create a new game, and mark a game as either deleted or completed (these are both valid choices - though we have no UI that can support this yet).

* The login page itself doesn't need to change, but the server side now needs to properly support user login and password verification. (10pts)
    * This route is outlined in ***src/server/api/v1/session.js*** at POST _/v1/session_.
    
* The logout action in the client also needs to send a request to the server.  We don't yet have anything on the client to do this, so add it. (10pts)
    * This route is outlined in ***src/server/api/v1/session.js*** at DELETE _/v1/session_.


* The registration page itself doesn't need to change, but the server side now need to properly support creation of documents in the Users collection in the database. (10pts)
    * This route is outlined in ***src/server/api/v1/user.js*** at POST _/v1/user_.

* The profile page should perform the same AJAX query as before, but now the data must come from the database. (10pts)
    * This route is outlined in ***src/server/api/v1/user.js*** at GET _/v1/user/:username_.
    
* Any edits to the user's profile need to synchronized with the server.  We do not yet have any client capability to do this (look for it in Assignment #5).  But, we can prepare the server to handle this.  (10pts)
    * This route is outlined in ***src/server/api/v1/user.js*** at PUT _/v1/user_.


* The game creation page itself does not need to change, but the server-side needs to properly support game creation in the Games collection. (10pts).  
    * This route is outlined in ***src/server/api/v1/game.js*** at POST _/v1/game_.

* The review games page should allow the user to see details about completed games as stored in the database. (10pts)
    * This route is outlined in ***src/server/api/v1/game.js*** at GET _/v1/game/:id_.
    

## General Server-Side Requirements

* All data must be stored into the MongoDB

* All server-side routines interacting with the DB must have good error management and reporting

* All data being stored into the databse must be validated and cleansed of any possible script injections
 

## Testing Code - Useful, but different

* Travis-CI is not required for this assignment, but I have provided some testing code to help in your development.
* To use the testing code:
    * Start your server
    * Make sure the mongoDB connection URL in ***test/api/data.json*** is correct
    * Run ```npm test``` from your command line
    * 28 different tests are run against the Session and User APIs.  Sadly, no tests for Game have been developed yet.