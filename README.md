Documentation for your project in the form of a Markdown file called README.md. This documentation is to be a user’s manual for your project. Though the structure of your documentation is entirely up to you, it should be incredibly clear to the staff how and where, if applicable, to compile, configure, and use your project. Your documentation should be at least several paragraphs in length. It should not be necessary for us to contact you with questions regarding your project after its submission. Hold our hand with this documentation; be sure to answer in your documentation any questions that you think we might have while testing your work.

#DOCUMENTATION

##DESCRIPTION OF CONTENTS
This submission includes source code and several bootstrapped libraries primarily in JavaScript (for `node.js`) or JavaScript Object Notation (JSON) to be run on this IDE and pushed to the cloud platform Heroku.

### `/git/` DIRECTORY:
This directory  lists all the files that have been committed to git.

1. `node_modules/` directory: `node_modules/` directory: an unmodified folder we downloaded from node package manager (NPM) containing necessary libraries from node package manager NPM for using `node.js` to interact with the Facebook Messenger API.
2. `package-lock.json`: a JSON object resulting from NPM modification of the `node_modules/` directory.
3. `package.json`: a JSON object specifying the Github repository as well as Messenger chatbot-specific parameters, template obtained from the Facebook Graph API and generated via `node.js`. It lists details about our chatbot like its name and where our source code is located in git.
4. `Procfile`: a command for running our application dynos on Heroku we obtained from the Heroku tutorial. This file is necessary for Heroku's implementation of our source code, showing the `node.js` protocol that we used.
5. `.gitignore` is a set of files necessary to the chatbot that have not been committed (hence, ignored) by git.
6. `.eslintrc` is a file that standardizes the environment and some language (like jQuery) for the app.
7. `index.js`: the backbone of our messenger chatbot in a JavaScript file.
8. `cabcaf.json`: a simplified JSON object output from a Facebook developer platform tester HTTP request. We use the Harvard EvenTracker page ID, secret token, and Cabot Cafe page ID to query for public Cabot Cafe events.
9. `queenshead.json`: a simplified JSON object output, similar to `cabcaf.json` but pulling events from the Queen's Head Pub page using its page ID.
10. `gcal/` directory: see below.
11. `json_test/` directory: see below.

#### `gcal/` DIRECTORY:

1. `gcal.js`: one backend JavaScript file which pulls calendar events from public calendars on four specified Harvard House websites. Use the console logs to check that the Google Calendar API is working.
2. `client_secret.json`: an authorization file necessary for working with Google Calendar API.
3. `node_modules/` directory: an unmodified folder we downloaded from node package manager (NPM) containing necessary libraries from node package manager NPM for using `node.js` to interact with the Google Calendar API.
4. `package-lock.json`: a JSON object resulting from NPM modification of the `node_modules/` directory.

#### `json_test/` DIRECTORY:

1. `json_test.js`: one backend JavaScript file which pulls calendar events from JSON object outputs of Facebook developer platform tester HTTP requests. Use the console logs to check that the Facebook Graph API is working.
2. `cabcaf.1.json`: unmodified JSON object output from a Facebook developer platform tester HTTP request. Tests that these HTTP request output a valid JSON object with correctly formatted syntax.
3. `test.json`: generic JSON object written as a control, with its JSON syntax "known" to be correct. Use this to compare `cabcaf.1.json` in `json_test.js` results to test if `cabcaf.1.json` or other HTTP request outputs are, indeed, correct.


HOW TO RUN/TEST
All that you need to *run* the code is to run `node.index.js` in the harvard-event-tracker terminal. Hopefully, the JS code should start working. It is already online and deployed on Heroku, but it may take a while to go live because Heroku dynos fall asleep after 0.5 hours. Go on Facebook Messenger (either online at `facebook.com` or `messenger.com` or via the Messenger mobile app) and see the chatbot in action by searching Harvard EvenTracker (@cs50finalproject)! It should return responses!
However, if you'd like to test further, you will need to download the Heroku, Git and Node.JS (with node package manager NPM) CLIs into the CS50 IDE (if not already there), if you'd like. Open a terminal in the folder harvard-event-tracker and run the phrase: `npm install express request body-parser mongoose --save` to download node.js. Additionally, log into Git and Heroku (`git login`, `heroku login`). The workspace should have the word (master) at the beginning of every line, like so: `~/workspace/harvard-event-tracker/ (master) $`
