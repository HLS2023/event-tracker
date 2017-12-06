A "design document" for your project in the form of a Markdown file called DESIGN.md that discusses, technically,
how you implemented your project and why you made the design decisions you did.
Your design document should be at least several paragraphs in length.
Whereas your documentation is meant to be a user’s manual,
consider your design document your opportunity to give the staff a technical tour of your project underneath its hood.


DESIGN

We implemented this project via code garnered from several GitHub repositories and tutorials for how to build a chatbot,
the Facebook Messenger and Google Calendar APIs, and some hardcoding and coding from scratch on our parts.
The code is entirely in JavaScript; we chose early on to standardize the code that we would be coding in because,
after parsing through several tutorials and different GitHub repositories (not to mention the APIs themselves!)
we decided it would be best to focus on JavaScript, to make it easier for ourselves.
In addition, we had heard from several people about the BeautifulSoup Python library, which we tried implementing early on to no great success.
(Essentially we discoverd that relevant event information could not just be pulled from HTML on House Calendar websites, but rather from Google Calendar objects.
For whatever reason, the OAuth for accessing even public Google Calendar objects did not work in our original Python code, so we switched to node.js and it seemed great!)
In summary, it was just easier to focus on one language.

THE GOOGLE CALENDAR EVENTS
We scrutinized all twelve House websites on their House events or HoCo events Google Calendars.
A few Houses restrict access to their events Calendars to members of the House, with House-specific logins.
Other Houses don't have very many events at all besides entryway study breaks or language tables.
We ultimately picked one House from each "neighborhood," and ended with Pforzheimer House from the Quad, Adams from Harvard Square, Mather from River East, and Kirkland from River West.


THE FACEBOOK EVENTS


THE CHATBOT
The chatbot's code is the result of several different tutorials and our tweaking of them to make it work.
We primarily used Facebook's API