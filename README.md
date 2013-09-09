# grunt-couchapp

A grunt plugin for building and installing couchapps

## Getting Started 

Install this grunt plugin next to your project's
[grunt.js gruntfile][getting_started] with: `npm install
grunt-couchapp`

Then add this line to your project's `grunt.js` gruntfile:

    grunt.loadNpmTasks('grunt-couchapp');

[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md

## Documentation

You'll want to add some configuration for the plug-in.  This plugin
provides three tasks, `mkcouchdb` to create new databases, `rmcouchdb`
to delete all data and drop an existing database, and `couchapp`,
which installs a specified couchapp into the database.

    mkcouchdb: {
        demo: {
            db: 'http://localhost:5984/grunt-couchapp-demo',
            options: {
                okay_if_exists: true
            }
        }
    },

    rmcouchdb: {
        demo: {
            db: 'http://localhost:5984/grunt-couchapp-demo',
            options: {
                okay_if_missing: true
            }
        }
    },

    couchapp: {
        demo: {
            db: 'http://localhost:5984/grunt-couchapp-demo',
            app: './demo/app.js'
        }
    }

As a stylistic note, all of the commands take the same info, so it's
possible to write in your configuration file:

    couch_config = {
        demo: {
            db: 'http://localhost:5984/grunt-couchapp-demo',
            app: './demo/app.js',
            options: {
                okay_if_missing: true,
                okay_if_exists: true
            }
        }
    }

    grunt.initConfig({
        ...            
        mkcouchdb: couch_config,
        rmcouchdb: couch_config,
        couchapp: couch_config,
        ...
    });    


Note that if you call `rmcouchdb` without a sub-argument, it will not delete any databases.

## Demo

It is possible to run the entire toolchain (drop, initialize, and
install) with the grunt.js file by calling `grunt demo`.  As long as
you have a local couchdb running in admin-party mode, and browse to
`http://localhost:5984/grunt-couchapp-demo/_design/app/index.html`
You should get back a happy message.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing
coding style. Add unit tests for any new or changed
functionality. Lint and test your code using [grunt][grunt].

## License
Copyright (c) 2012 Ken Elf Mathieu Sternberg  
Licensed under the MIT license.
