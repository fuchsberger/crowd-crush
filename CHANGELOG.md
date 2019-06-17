# Changelog

The versioning sheme is as following:
a.b.c

* a - major complete overhaul (likely only 0 beta, and 1 final)
* b - major updated
* c - minor updated

## 0.12.4
* video duration is now retrieved from youtube when adding and video list displays and sorts duration

## 0.12.3
* updated readme
* improved route handling and avoid unnecessary rerenders
* if visiting a protected route (login required) and not currently logged in, users will now be redirected to login form with custom message. After successful login, users will be redirected to originally requested page.
* all features in settings page (change username, password, email) now have their own event
* fixed upper/lowercase sorting bug in video list
* adding a new video also adds it to the video list for everyone

## 0.12.2
* flash messages are now displayed attached to header and use reselect for smarter DOM updates
* removed flash component
* cleaned some old unused code

## 0.12.1
* server flash messages are now integrated into react flash system

## 0.12.0
* vastly improved underlying mechanisms including authentication and channel management
* removed version from page (caused build to fail)
* added credential table and split sensitive user data from general data
* improvements to login and logout, logout now also deletes session on server
* new settings page with much improved functionality
* remove name field from user (had no purpose)
* implemented mobile menu
* improved flash message system
* implmeneted simple sortable video list view
* removed default footer (unnecessary)


### 0.11.1
* optimized css import mechanics
* improved build procedure (edeliver/distillery)
* comparison view now works with the absolute translation, left and right side are now consistant to each other.

### 0.11
* Restructured entire app once again
* Accessing a protected page anonymously now redirects you to login, once logged
  in it redirects you back to the protected page
* upgraded to phoenix 1.4 and replaced brunch with webpack
* removed tons of unnecessary featurs
* optimization of database queries
* improved error page when on a wrong video

### 0.10.3 10/17/19
* Fixed bug that stoping would not stop the animation in SbS simulation.

### 0.10.2 10/17/18
* Added interface to upload a synthetic crowd output,
  convert it to relative format, and run simulation with it
* allows to upload a csv file in SbS view which will be animated next to the original

### 0.10.1 10/17/18
* Updated Video List to account for new comparison column
* Better implementation of when to show default navBottom
* Added new side-by-side simulation (without youtube video)
* SbS view allows now for playing, pausing and stoping
* original annotation now displaying on the left during simulation
* smarter, more efficient way to display agent markers in both simulation and SbS.

## 0.10.0 10/17/18
* New Versioning Schema

## 0.9.2 07/24/18
* Combined public, private and admin channel into a single channel
* Set default values for coordinate system and removed coordinate column in video list

## 0.9.1 07/14/18
* Switched to ducks redux template

## 0.9.0 05/16/18
* Simpified REST api for user table
* Version number now visible in about page

## 0.8.0 03/14/18
* Home redirects to either About or Videos, depending if logged in or not
* Removed Register Link from topbar, made login link smaller and more mobile friendly
* Removed redux-think and lodash dependencies
* Login does not need to load page again (ajax call replacement)
* All account features (reset password,...) are now handled via a modal in navbar rather than having their own pages
* if logging out / in it will change page content accordingly, without redirecting; users can login/logout from any page
* CSRF token now accessed from html head rather than js global variable
* Dispatch / Router / Redux workflow optimization
* Interactive Display of Simulation Mode
* Reference Coordinates can now be added to simulation
* If reference coordinates are fully added, it is marked in the video list

## 0.7.0 03/14/18

* Outsourced lots of authentification related stuff to coherence-react
* replaced react-bootstrap-table with react-table for deeper functionality and performance
* implemented feature to block users
* completed mobile features for list views
* more intelligent filter searches in list views
* better performance in list views
* prettified all JS and CSS code

## 0.6.1 02/12/18

* Upgraded Icons to FontAwesome 5.0 with SVG graphics instead of web-font

## 0.6.0 02/07/18

* Major Performance and Code Improvement Overhaul
* Fixed background overlay functionality
* prepared video overlays
* removed flash alert box
* Added Bottom Bar which now also shows flash messages
* flash messages are now automatically deleted when navigating to different page
* flash messages from backend are now properly displayed at page load
* moved register form validation fully to serverside, improved validation
* fixed login form with new validation and flash system (email and remember are remembered on failed login)
* renamed loader to spinner and made it a component (from view)
* fixed confirmation email flash feedback
* created password_reset view and functionality
* created admin view
  * users can be selected and deleted
  * users can be sorted and filtered
  * when creating or deleting users, all admins will update their userlist
  * individual users can be promoted/demoted in userlist now
* Videos can now be locked by administrators which prevents editing (even by admins)
* Normal users can no longer delete videos or edit locked videos

## 0.5.9 12/01/17

* improved error page
* included seed tweak to make user admin
* added admin interface (where you can manage users)
* added functionality to promote/demote users to/from admin

## 0.5.8 11/16/17

* tiny crosshair accuracy fix

## 0.5.7 11/16/17

* Shows again the time and duration in miliseconds
* You can now move a interval forward (E) or b ackward (Q)
* if a agent is selected, you can now jump to the first marker (SHIFT + Q) or last marker (SHIFT + E)

## 0.5.6 11/16/17

* Markers (other than the currently selected one) are now not shown anymore if the current time is before the first marker or after the last marker.
* Significant performance improvements when rendering markers
* Made active keys a global component that can be plugged in any react container
* Video starts now in a ready position (has been loaded and initialized properly)

## 0.5.5 11/13/17

* Fix Timezone Issue
* Switched from id to youtube ID as url parameter
* Selecting / Deselecting now down with S key only. (also performance improvements)
* Integrated Pause fuction into play function (does now both things)
* Edit Mode Button now hidden if not authentificated

## 0.5.4 11/11/17

* add new button in video list removed for unregistered users
* performance and stability improvements in video adding/deleteing/syncing

## 0.5.3 11/09/17

* only registered users can now delete videos
* fixed some issues with changing description

## 0.5.2 11/09/17

* you can now delete multiple videos/simulations by marking them in table

## 0.5.1 11/09/17

* fixed add video issues
* added TinyMCE to add video view
* simplified router
* upon adding a video, directly redirects to simulation
* upon clicking on a row in the video list table directly redirects to simulation
* deleted edit and simulation button (no longer needed)

## 0.5.0.1 11/08/17

* added tinyMCE editor for editing / adding description
* removed edit video options (and integrated them into simulation)

## 0.5.0 11/08/17

* finished simulation gui overhaul

### 0.4.1.10 11/07/17

* finished video input form

### 0.4.1.9 11/06/17

* optimized and remade video input form

### 0.4.1.8 11/06/17

* fixed logout issue using a dedicated logout cookie and page reload00

### 0.4.1.7 11/05/17

* finshed beautiful loader
* Navbar will no longer show some items before socket has been established
* Organized simulation components and views
* Upgraded react-bootstrap-table to version 4.0
* Started switching out all react-bootstrap instances with reactstrap versions
* Removed react-bootstrap dependency

### 0.4.1.6 11/04/17

* if socket connection fails or is interrupted, temporarily logs out user
* registration process finished
* on successful login -> redirects to dashboard
* finished login functionality
* base url will show dashboard if logged in or login form if not
* users already logged in attempting to login will be redirected to dashboard
* finished logout functionality

### 0.4.1.5 11/02/17

* finished gui overhaul register page

### 0.4.1.4 11/02/17

* Switched table id fields to uuid for increased security
* implemented login functionality
* TONS of adaptions and preparations from Coherence into React

### 0.4.1.3 11/02/17

* moved and renamed login and register to /accounts and updated router paths
* simplified and improved the flash message system

### 0.4.1.2 11/02/17

* finished allowing to confirm accounts via socket

### 0.4.1.1 11/02/17

* finished gui overhaul confirm_email page
* finished allowing to send confirmation email to user via socket

### 0.4.1 11/01/17

* finished new navbar
* removed flash messages from navbar (will be separated into alerts)
* replaced all glyphicons with font-awesome icons
* attempting to change authentification to channel only
* finished gui overhaul login page
* finished client-side form validation for login page

### 0.4 - 10/30/17

* Integrate Coherence
* Temporarily disabled crowdsim features

### 0.3.1 - 10/30/17

* System upgrade to Reactstrap 5.0

### 0.3 - 10/30/17

* System Upgrade to Phoenix 1.3

### 0.2.4 - 10/26/17

* Updated Youtube API key
