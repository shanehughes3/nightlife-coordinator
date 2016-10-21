# Nightlife Coordinator

A single-page web app that allows users to search Yelp's API for bars in their
area, view how many users have said they will be going to each bar tonight and
say which bar/bars they will be going to.

Nightlife Coordinator was created per specs at [FreeCodeCamp].

#### Features
- Users can search the [Yelp API] for bars at a given location.
- Results are listed 15 per page.
- Users can view how many other users have said they will be at each individual
  bar tonight.
- Authenticated users can click a button to state which bar/bars they will be
  at tonight.

#### Setup
After cloning, a good `npm install` adds all dependencies. Nightlife Coordinator
is designed to interface with a remote DB host (specifically, [mLab]); however,
a local instance will work just as well (better, in fact). The following
environmental vars are required:

- For the [Yelp API]:
  - `YELP_CONSUMER_KEY`
  - `YELP_CONSUMER_SECRET`
  - `YELP_TOKEN`
  - `YELP_TOKEN_SECRET`
- For everything else:
  - `PORT` - defaults to 8080
  - `SESSION_SECRET` - defaults to "cats"
  - `MONGOLAB_URI` - the MongoDB location, including authentication and port

More fine-tuning can be accomplished in the `config.js` file.

#### Tech
Nightlife Coordinator uses a Node.js/Express/MongoDB stack. It connects to the
[Yelp API] v2.

#### License
Copyright 2016 by Shane Hughes. Nightlife Coordinator is free software; you can
redistribute it and/or modify it under the terms of the GNU General Public
License as published by the Free Software Foundation; either version 2 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

A copy of the GPLv2 can be found in the file COPYING.

[FreeCodeCamp]: <https://www.freecodecamp.com/challenges/build-a-nightlife-coordination-app>
[mLab]: <https//www.mlab.com>
[Yelp API]: <https://www.yelp.com/developers/v2/>