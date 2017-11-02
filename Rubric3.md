## Build Process

* Must use the provided webpack/babel configuration
    * Modification is allowable, but it should still generate an SPA
    * Customizations must not alter the npm script commands for building, running or testing
* Output modules are only public/js/main.js and public/js/vendor.js
    * If additional 3rd party libraries are used they should be bundled into vendor.js not main.js


## Landing Page

* Must be one or more pure functional (stateless) react components
* Must be shown when user navigates to ***/*** or ***/index.html***
* Content of the page is anything reasonable for being a landing page


## Login Page

* Must be one or more react components
* Must be displayed at ***/login***
* Must be well organized visually.  Generally, just don't let the page look like crap. 
* Must prompt user for the following fields:
    * Username: normal text box
    * Password: text box must not display the user's actual password
* Form must have a submit button
    * Form must not use default HTML submission behavior (i.e. preventDefault)
    * Page must validate that both a username and password have been supplied before any request is sent to the server
     * Submission will be an AJAX POST sent to ***/v1/session***.  Body data will have the form:
     
        ```{ username: "foo", password: "bar" }```
     * The server will respond with either a 4XX error and an error message of the form:
     
        ```{ error: "This is an error }```
     * Or, the server will respond with a 201 with a body of the form:
     
        ```{ username: "foo", primary_email: "bar@bax.com" }```
* On successful authentication the user will be sent to ***/profile/username***.
     * Must use SPA routing and not page reloading
* On authentication failure, the user will be shown the error in a nice way (i.e. no alerts!!!)


## Register Page

* Must be one or more react components
* Must be displayed at ***/register***
* Only visible if a user is not logged in, otherwise they are redirected to ***/profile/:username***
* Must be well organized visually.  Generally, just don't let the page look like crap. 
* Must prompt user for the following fields:
    * Username: normal text box
    * First Name: normal text box
    * Last Name: normal text box
    * City: normal text box
    * Email: normal text box
    * Password: text box must not display the user's actual password
* Form must have a submit button
    * Form must not use default HTML submission behavior (i.e. preventDefault)
    * Page must validate the following before submission to server:
        * Username is 6+ chars and is only alphanumeric
        * First name, last name and city are not empty
        * Email address is of the form address@domain.tld
        * Password is 6+ chars and contains at least one of each: lower alpha, upper alpha, numeric, and symbol (!, @, #, $, % or ^)
     * Submission will be an AJAX POST sent to ***/v1/user***.  Body data will have the form:
     
     ```
         {
            username: "foo",
            first_name: "Graham",
            last_name: "Hemingway",
            city: "Nashville",
            primary_email: "foo@bar.com",
            password: "bar"
        }
     ```
     
     * The server will respond with either a 4XX error and an error message of the form:
     
        ```{ error: "This is an error }```
     * Or, the server will respond with a 201 with a body of the form:
     
        ```{ username: "foo", primary_email: "bar@bax.com" }```
* On successful registration the user will be sent to ***/login***.
     * Must use SPA routing and not page reloading
* On registration failure, the user will be shown the error in a nice way (i.e. no alerts!!!)

## Profile Page

* Must be one or more react components
* Must be displayed at ***/profile/:username***
* Must be well organized visually.  Generally, just don't let the page look like crap.
* Must fetch user information with an AJAX GET to ***/v1/user/:username***
    * Use the username parameter from the URL path
    * Returned data is of the form (see below for more detail on games data):
    
    ```
        username: "foo",
        first_name: "bar",
        last_name: "bax",
        city: "blah",
        primary_email: "here@blerg.floog",
        games: [...]

    ```
* Must display the profile information:
    * Username: normal text
    * First Name: normal text
    * Last Name: normal text
    * City: normal text
    * Email: normal text
    * Gravatar: correct gravatar icon for the provided email address
    * Games played: count of number of games the user has played
    * A table must display all games associated with the user
        * Have one row in the table for each game
        * Display the following fields for each game:
            * Status: "Active" if game is still going and "Complete" if not.
            * Start Date: Pretty print the date the game started
            * Number of moves: Number of moves so far in the game
            * Score: Overall score of the game
            * Game Type: Type of the game
        * Provide a link in each row that navigates the user to:
            * ***/game/:id*** if the game is active
            * ***/results:id*** if the game is complete
            
* If the user is logged in and looking at their own profile:
    * Display a link to start a new game.  This should navigate the user via SPA routing to ***/start***
    * Display a link to edit their profile.  This should navigate the user via SPA routing to ***/profile/:username/edit***, which for now is nothing.  It is ok if your router complains about this.


## Start Page

* Must be one or more react components
* Must be displayed at ***/start***
* Must be well organized visually.  Generally, just don't let the page look like crap.
* Page must only display if the user is logged in.  Otherwise SPA route the user to ***/login***
* The start game form must display the following information:
    * Allow the user to choose they type of game they want to play.
        * Only one game types should be able to be selected at a time
        * Choices must include:
            * klondyke
            * pyramid
            * canfield
            * golf
            * yukon
            * hearts
    * Allow users to select the number of cards to draw in a round (either Draw 1 or Draw 3)
    * Form must not use default HTML submission behavior (i.e. preventDefault)
    * Submission will be an AJAX POST sent to ***/v1/game***.  Body data will have the form:
     
        ```{ game: "klondyke", draw: 3, color: "red" }```
     * The server will respond with either a 4XX error and an error message of the form:
     
        ```{ error: "This is an error }```
     * Or, the server will respond with a 201 with a body of the form:
     
        ```{ id: "asokasdfasodfhiasdlfkjah" }```
* On successful game creation the user will be sent to ***/game/:id***.
     * Must use SPA routing and not page reloading
* On game creation failure, the user will be shown the error in a nice way (i.e. no alerts!!!)


## Game Page

* Must be one or more react components
* Must be displayed at ***/game/:id***
* If a user is not logged in, they must be redirected from game page to ***/login***
* Must be well organized visually.  Generally, just don't let the page look like crap.
* There are no additional behavior requires for this page from the last assignment
* Must fetch game information with an AJAX GET to ***/v1/game/:gameid***
    * Use the game id parameter from the URL path
    * Returned data is of the form (see below for more detail on games data):
    
    ```
    {
        active: true,
        cards_remaining: 52,
        color: "Red",
        discard: [],
        draw:[{…}],
        drawCount: "Draw 1",
        game: "klondyke",
        id: "123456",
        moves: [],
        pile1: [{…}],
        pile2: [{…}, {…}],
        pile3: [{…}, {…}, {…}],
        pile4: [{…}, {…}, {…}, {…}],
        pile5: [{…}, {…}, {…}, {…}, {…}],
        pile6: [{…}, {…}, {…}, {…}, {…}, {…}],
        pile7: [{…}, {…}, {…}, {…}, {…}, {…}, {…}],
        score: 0,
        stack1: [],
        stack2: [],
        stack3: [],
        stack4: [],
        start: 1507672720652,
        winner: ""
    }

    ```
* Must display the returned state of the game (which will always be the initial state)
    * Must dynamically render the state - this is not hardwired - each game is different
* Must visually be similar to the layout and look-and-feel as shown in the Klondyke wikipedia page

## Results Page

* Must be one or more react components
* Must be displayed at ***/game/:id***
* Must be well organized visually.  Generally, just don't let the page look like crap.
* Must fetch game information with an AJAX GET to ***/v1/game/:id***
    * Use the id parameter from the URL path
    * Returned data is of the same form as on the game page (see above)
* Must display the game information:
    * Duration: normal text
    * Number of Moves: normal text
    * Points: normal text
    * Cards Remaining: normal text
    * Able to Move: normal text
    * A table must display all moves associated with the game
        * Have one row in the table for each move
        * Display the following fields for each move:
            * Id: Monotonic (i.e. first move is 1, second is 2, etc.)
            * Duration: Amount of time elapsed since prior move
            * Player: Name of player that made the move
            * Move Details: Text describing what the details of the move 
    * There are no moves right now (hasn't been implemented), so the list of moves will be empty.  That's OK.

## Logout Page

* Must be one or more react components
* Must be mounted at ***/logout***
* Really only needed to make sure user is logged out
    * Any localStorage, sessionStorage or cookies for the user are removed
    * All visual display of user is removed (i.e. the header must revert to logged out state)
* Once user is logged out, navigate the user via SPA routing to ***/login***

## Page Header Component

* Must be developed as a stand alone react component that is reused by all other pages
* Must be displayed on every screen within the app
* Must display "Log In" and "Register" if user has not authenticated
    * Links must take you to appropriate page via SPA routing, not reloading
* Must display user's Gravatar icon once they have authenticated
    * Clicking Gravatar icon should navigate user to user's profile page
* Must display "Log Out" link once they have authenticated
    * Clicking link should navigate the use via SPA routing to ***/logout***
* Application title should be in larger font on the left - may say whatever you want
* Header component should be included by the base application component - not by each page component     


## Server-Side Algorithms

* Implement the function called _shuffleCards_
    * Function skeleton is in: _src/server/solitare.js_
    * This will be a server-side function that generates an array of randomized cards 
    * The return from this call should be a JSON array that is a randomized set of shuffled cards
    * The returned JSON array should be of the following form:

    ```
        [
            { "suit": "clubs", "value": 7 },
            { "suit": "diamonds", "value": 12 },
            { "suit": "hearts", "value": "A" },
            ...
        ]
    ```
* Implement the function called _initialState_
    * Function skeleton is in: _src/server/solitare.js_
    * This will be a server-side function that generates the initial state of a hearts game
    * The returned JSON array should be of the following form:

    ```
    {
        id: 'duwxc',
        pile1: [{ suit: 'hearts', value: 9, up: true }],
        pile2: […],
        pile3: […],
        pile4: […],
        pile5: […],
        pile6: […],
        pile7: […],
        stack1: [],
        stack2: [],
        stack3: [],
        stack4: [],
        draw: [ { suit: 'spades', value: 8, up: false },…],
        discard: []
    }
    ```


## General Client Requirements

* Must use React Router or custom code for routing mechanisms
    * If custom code is used it had better be really high-quality
    * Routing code should either be located in main.js or in a separate routes.js file
    

## All React Components

* Must use proper approach to creating components (i.e. either ES6 classes or pure functions)
* Must use props vs. this.state appropriately
* Must update state using setState() only
* Must use all appropriate lifecycle hooks
    * Event binding should generally be done in the constructor
    * Ajax requests should generally be triggered from componentDidMount()
    * Must watch and handle componentWillReceiveProps() correctly
* Do not use jQuery to manipulate or query the DOM at all.  jQuery will now only be used for the $.ajax() call.