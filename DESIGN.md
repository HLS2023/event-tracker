A "design document" for your project in the form of a Markdown file called DESIGN.md that discusses, technically,
how you implemented your project and why you made the design decisions you did.
Your design document should be at least several paragraphs in length.
Whereas your documentation is meant to be a user’s manual,
consider your design document your opportunity to give the staff a technical tour of your project underneath its hood.

#DESIGN

We implemented this project via code garnered from several GitHub repositories and tutorials for how to build a chatbot,
the Facebook Messenger and Google Calendar APIs, and some hardcoding and coding from scratch on our parts.
The code is entirely in JavaScript; we chose early on to standardize the code that we would be coding in because,
after parsing through several tutorials and different GitHub repositories (not to mention the APIs themselves!)

*Why JavaScript and node.js? Why not Python?*

*   We had heard from several people about the BeautifulSoup Python library, which we tried implementing early on to no great success. Essentially we discoverd that relevant event information could not just be pulled from HTML on House Calendar websites, but rather from Google Calendar objects.
*   Furthermore, for whatever reason, the OAuth for accessing even public Google Calendar objects did not work in our original Python code -- we suspect that the Google Calendar Python quickstart was broken, since it kept trying to open a Google Account login page inside of the command line in the IDE, with many of its authorization buttons mistakenly disabled.
*   So we switched to `node.js` and it worked great!

Ultimately, we decided it would be best to focus on JavaScript, to make our code internally consistent and easier to use/debug/read as we worked across multiple APIS.

##THE GOOGLE CALENDAR EVENTS

1. We scrutinized all twelve House websites on their House events or HoCo events Google Calendars. A few Houses restrict access to their events Calendars to members of the House, with House-specific logins. Other Houses don't have very many events at all besides entryway study breaks or language tables. We ultimately picked one House from each "neighborhood," and ended with Pforzheimer House from the Quad, Adams from Harvard Square, Mather from River East, and Kirkland from River West.
2. Pforzheimer House had several well-maintained public calendars to choose from, sorted by venue, with a high level of detail in each event summary -- we considered this the "gold standard" for House calendars and selected Pfoho's `Igloo` calendar to work with.
3. Adams House had a fair number of calendar events in their one calendar, but had many more recurring events hard-coded elsewhere in their website that we figured we could manually input to supplement.
4. Kirkland House also had a fair number of calendar events in their one calendar, but limited to a small number of social spaces.
5. Mather House we chose because Leverett and Dunster calendars were not publicly accessible; Mather's calendars are mostly populated with recurring events.
6. We obtained the public calendar IDs of Pforzheimer's Igloo calendar and the calendars of Adams, Kirkland, and Mather for use in our `gcal.js` file.

##THE FACEBOOK EVENTS
We looked at well-known venues around campus and tried to find those that had Facebook pages with events.
Cambridge Queen's Head and Cabot Cafe were two notable venues which had public Facebook events on their pages, though the events seemed to stop running before Reading Period began.
We used an HTTP get request on the Facebook developers' platform tester to query events from these pages.

##PASSING EVENTS INTO THE CHATBOT
We were unable to figure this out for either Google Calendar events or Facebook events.

1. Google Calendar events: for whatever reason, stitching the code from the `gcal.js` file into the one `index.js` file made the Google Calendar and Facebook Messenger authorizations incompatible. We suspect that the authorization processes may have tried to overwrite each other's cookies.
2. Google Calendar events: next, we tried passing the `allevents` array from the `gcal.js` file across to the `index.js` file, but this also didn't work. We suspect that the authorization performed in `gcal.js` has to be done with the filling of `allevents` or that the asynchronous function required inside of the `listEvents(auth)` function was preventing the non-empty `allevents` array from passing.
3. Facebook events: we got Facebook events (i.e. their names, start times, and end times) in the `json_test/` directory to pass and be printed in the console logs. However, in the Messenger chatbot in `index.js`, the Facebook event names, start times, and end times, were not returned in the `response` of the `payload`.
4. Facebook events: in the end, we decided that having a working chatbot with hardcoded events was our priority for our GOOD goal. It seemed that we couldn't even get the Messenger chatbot to deploy properly and respond to messages if the events passed in broke the `payload`.
4. In the end, we decided to hardcode events (with names, start times, and end times that we would copy/paste from the `cabcaf.json` and `queenshead.json` objects) as responses to the button requests in our working Messenger chatbot.

##HEROKU, GIT AND WEB IMPLEMENTATION
Our chatbot is hosted via Heroku, a cloud-based server. We have a project, harvard-event-tracker, in a Heroku account,
and it is connected to Messenger via several tokens garnered from the Facebook API, such as VERIFICATION_TOKEN and VERIFY_TOKEN (which can be found in our Heroku project's environment variables.)
These serve to associate the app with a specific and private number. We also connected our code in the folder /harvard-event-tracker
to a Git repository, and every time we changed the code, we would commit the changes and push them, which instantaneously would effect changes in Heroku, allowing us to see how the bot was changing.

##THE CHATBOT
The chatbot's code is the result of several different tutorials and our tweaking of them to make it work.
We primarily used Facebook's API, along with a tutorial (links at the bottom of our `index.js` file.)
The main thing the tutorials did was to help us create the app's main design in `index.js`, which is a file that handles the user's messages and its response to them.
We had planned to pass in information from the JSON files we had garnered from Facebook and GCal, and indeed they did run in the console logs (you can see for yourself) but we could not ultimately figure out why they were not passing through to the app itself. We chose to hard-code information into the bot, taken from our JSON files, in the absence of the information passing through.

##FUTURE DIRECTIONS, PATCHES

There are a number of features we could see our chatbot including in the future, for a better user experience catering to Harvard undergraduates.

1. As a first patch, our priority would definitely be to successfully pass Google Calendar events from the source code in our `gcal.js` into `index.js`, either by stitching the code into one `.js` file or by passing some other object containing the data. This would enable the responses on our Messenger chatbot to be dynamically updated from the public Google Calendars. We would most likely need a better understanding of Google Calendar and Facebook Messenger authentication processes.
2. Then, our next patch would also be to pass Facebook events with brand new events queries on an HTTP request every time someone presses the button on Messenger requesting this information.
3. The other feature we thought would be nice but wasn't part of any of our project goals was to be able to broadcast events (updated dynamically) automatically every Friday.

We also hope that we can use what we learned from our project to convince House administration and popular student venues to publish more of their events in public Facebook page events and public Google Calendars.
From our project, we discovered the status quo: only one house (i.e. Pforzheimer House!) maintains recurring and individual events daily with detailed descriptions split by multiple venues on public Google Calendars (disclaimer: we are both residents of Pfoho), and Cambridge Queen's Head and Cabot Cafe are the only student venues which publicize their events on publicly-accessible Facebook pages.
It'd be nice if students could get this information from all parts of social life in the Houses and beyond! Hopefully this would improve students' social lives on weekends.