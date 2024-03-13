# cis4301_group12
The semester group project for CIS4301

# Project Setup
## Using Docker to Set up Instance
1. `docker build --tag=[image_name]:[version.minor_version] .` (do not forget the dot at the end)

2. `docker container run --name=[container_name] --net=host -it [image_name]:[version.minor_version]`

## Using Windows, Mac, or Linux
1. Install git
2. Install NodeJS
   
3. `git clone https://github.com/kasinsparks/group12-crud`
4. `cd group12-crud`
5. `cd frontend`
6. `npm install`
7. `cd ..`
8. `cd backend`
9. `npm install`
10. `cd ..`

# Running The Program
0. Change into the main directory (group12-crud)
1. `cd backend`
2. `npm start`
   
3. In a separate terminal, change into the main directory (group12-crud) and run the following commands
4. `cd frontend`
5. `npm start`


* Connect to the site using localhost:3000
* (backend site address is localhost:8000)

# Setup The Connecting Details to The Database
1. Create a file called dbConfig.js in the backend directory. (If file does not already exist) (DO NOT Check in this file into git!)
2. Copy the following into dbConfig.js

   ```
   const config = {
       user          : "",
       password      : "",
       connectString : "oracle.cise.ufl.edu:1521/orcl"
   };

   module.exports = config;
   ```

3. Enter your username and password inside the empty quotes for the CISE Oracle database session.

NOTE: You must connect to the UF network via VPN to access the database.

# Contributing
*A preferred method to make contributions is fork, feature-branch, and PR. This method is the most common across open-source projects on GitHub.*

*The contributing procedure below is from the [Jellyfin project](https://github.com/jellyfin), but slightly modified to the needs of this repo. https://jellyfin.org/docs/general/contributing/development#how-should-you-make-changes*

## Set up your copy of the repo

1. Fork the project on GitHub.
2. Clone the fork to your local machine

    `git clone git@github.com:yourusername/group12-crud.git`

    `cd group12-crud`

3. Add the "upstream" remote
    
    `git remote add upstream git@github.com:kasinsparks/group12-crud.git`

## Making changes

1. Rebase your local branch against upstream main so you are working off the latest changes:

    `git fetch --all`

    `git rebase upstream/main`

2. Create a local feature branch off of main to make your changes:

    `git checkout -b my-feature main`

3. Make your changes and commits to this local feature branch.

4. Repeat step 1 on you local feature branch once you are done with your feature. This will ensure you do not have any conflicts with other work since you started.

5. Push your local feature branch to your GitHub fork:
    `git push --set-upstream origin my-feature`

6. On GitHub, create a new PR against the upstream main branch.

7. Keep your local branches up-to-date through GitHub or by the following:

    `git fetch --all`

    `git checkout main`

    `git rebase upstream/main`

    `git push -u origin main`

8. Delete your local feature branch iff you no longer need it:

    `git branch -d my-feature`

### Optional

* Before submitting a PR, squash "junk" commits together to keep the overall history clean. A single commit should cover a single significant change: avoid squashing all your changes together, especially for large PRs that touch many files, but also don't leave "fixed this", "whoops typo" commits in your branch history as this is needless clutter in the final history of the project.
