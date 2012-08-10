var DEMO_COUCH_DB = 'http://localhost:5984/grunt-couchapp-demo';

module.exports = function(grunt) {
    // Project configuration.

    grunt.initConfig({

        test: {
            files: ['test/**/*.js']
        },
        lint: {
            files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js']
        },
        watch: {
            files: '<config:lint.files>',
            tasks: 'default'
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: true,
                es5: true
            },
            globals: {}
        },
        mkcouchdb: {
            demo: {
                db: DEMO_COUCH_DB
            }
        },
        rmcouchdb: {
            demo: {
                db: DEMO_COUCH_DB,
                options: {
                    okay_if_missing: true
                }
            }
        },
        couchapp: {
            demo: {
                db: DEMO_COUCH_DB,
                app: './demo/app.js'
            }
        }
    });
    
    // Load local tasks.
    grunt.loadTasks('tasks');
    
    // Default task.
    grunt.registerTask('default', 'lint test');
    grunt.registerTask('demo', 'rmcouchdb:demo mkcouchdb:demo couchapp:demo');
};
