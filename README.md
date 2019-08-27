:tokyo_tower: :statue_of_liberty: :mount_fuji: :bridge_at_night: :ship: :car: :sailboat: :steam_locomotive: :airplane:
# TRVLR
:jp: :us: :it: :uk: :es: :gb: :fr: :de: :cn:

##DC-Backend-Project

###Created by: Ian Miller, Nathan Evans, and Anthony Pellingra
---
  
####**Project Overview**

*A social travel app to make planning trips with friends easier. We store user data after registration and give the user a session cookie. Afterwards they can customize a trip they would like to go on, and allow other users to attend the new trip.*

####**Our Project Goals- Backend**

- [x] Allow our site to create users.
- [x] Allow each user to create a trip.
- [x] Allow users to join other users trips.
- [x] Store user profile pictures and main trip picture in database.
- [x] Used a join table to accommodate a many to many relationship.
- [x] Site implements authentication and validation.


####**Our Site Features- Frontend**

* Users have a timeline feature to show trips they have attended/created.
* Set a carousel on the landing page to show recently made trips by other users. 
* Added hover features to navbar, about us icons, and footer

####**Database Formatting**

#####Users Table

| First Name | Last Name | Email | Phone | Password | Picture |
|:----------:|:--------:|:----:|:----:|:-------:|:------:|
| Users | Name | username@me.com | 1234567890 | b-crypt | File/Path/to/profile/pic/storage|

#####Trips Table

| Name of Trip | City| Country | Start Date | End Date | Users (id) | Trip Description | Picture |
|:------------:|:---:|:-------:|:----------:|:--------:|:----:|:----------------:|:-------:|
| Traveling Abroad | Paris | France | 08-23-2019 | 09-06-2019| 1 | Going to the Eiffel Tower| File/path/to trip/image/storage|

#####Attendees Table

*This table controls our many to many relationship by storing which user(id) is attending which trip(id).*

| User(id) | Trip(id) |
|:--------:|:--------:|
| (id)-user1 | (id)-trip3|

*In this example the user from the above user table is deciding to attend a trip created by another user.*




