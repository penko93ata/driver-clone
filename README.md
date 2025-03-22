# Drive Clone Tutorial

## TODO

- [x] Set up database and data model
- [x] Move folder open state to URL
- [x] Add auth
- [x] Add file uploading
- [x] Add analytics
- [x] Make sure the order is consistent
- [x] Add delete
- [x] Real homepage + onboarding
- [x] Check if user is owner before showing the folder

## Fun follow ups

### Folder deletions

Make sure to fetch all of the folders that have it as a parent and their children too

### Folder creations

Make a server action that takes a name and parentId, and creates a folder with that name and parentId (don't forget to set the ownerId to the current user)

### Folder renames???

(Optional) Make a server action that takes a name and folderId, and renames the folder with that name and folderId

### Access control (DONE)

Check if user is owner before showing the folder

### Make a "file view" page

Make a "file view" page that shows the file.

### Toasts and loading state

### Gray out a row while it's being deleted

Transition hook?
