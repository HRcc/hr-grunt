module.exports = function(grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        options: {
            base: 'app/**INSERTAPPNAMEHERE**/assets',
            publish: 'public/assets',

            // List of JS files to be concatnated
            js: {
                src: [
                        '<%= options.base %>/vendor/jquery/jquery.js',
                        '<%= options.base %>/vendor/bootstrap/dist/js/bootstrap.js',
                        '<%= options.base %>/js/main.js'
                    ]
            },

            // List of CSS files to be concatnated
            css: {
                src: [
                        '<%= options.base %>/temp/main.css'
                    ]
            },

            // Notification messages
            notify: {
                watch: {
                    title: 'Live Reloaded!',
                    message: 'Files were modified, recompiled and site reloaded'
                }
            }
        },

        // Task settings here

        // Files to be clean on rebuild
        clean: {
            all: {
                src: [
                    '<%= options.base %>/temp/*.*'
                ]
            }
        },

        // Concatenate multiple sets of files
        concat: {
            css: {
                files: {
                    '<%= options.base %>/temp/concat.css' : '<%= options.css.src %>'
                }
            },

            css_dev: {
                files: {
                    '<%= options.publish %>/main.min.css' : '<%= options.css.src %>'
                }
            },

            js: {
                options: {
                    block: true,
                    line: true,
                    stripBanners: true
                },
                files: {
                    '<%= options.base %>/temp/concat.js' : '<%= options.js.src %>'
                }
            },

            js_dev: {
                options: {
                    block: true,
                    line: true,
                    stripBanners: true
                },
                files: {
                    '<%= options.publish %>/main.min.js' : '<%= options.js.src %>'
                }
            }
        },

        // Settings for the Less task
        less: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    '<%= options.base %>/temp/main.css': '<%= options.base %>/less/main.less'
                }
            }
        },

        // Grunt task Uglify
        uglify: {
            options: {
                banner: ''
            },
            main_js: {
                // Source file
                src: ['<%= options.base %>/temp/concat.js'],

                // Minified new file
                dest: '<%= options.publish %>/main.min.js'
            }
        },

        // Optimize images
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: '<%= options.base %>/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%= options.poublish %>/images/'
                }]
            }
        },

        // Minify and concatenate CSS files
        cssmin: {
            minify: {
                src: '<%= options.base %>/temp/main.css',
                dest: '<%= options.publish %>/main.min.css'
            }
        },

        // Javascript linting - JS Hint
        jshint: {
            files: ['<%= options.base %>/js/main.js'],
            options: {
                // Options to override JSHint defaults
                curly: true,
                indent: 4,
                trailing: true,
                devel: true,
                globals: {
                    jQuery: true
                }
            }
        },

        // Display notifications
        notify: {
            watch: {
                options: {
                    title: '<%= options.notify.watch.title %>',
                    message: '<%= options.notify.watch.message %>'
                }
            }
        },

        // Auto adding prefixes
        autoprefixer: {
            options: {
                browsers: ['last 5 version', 'ie 8', 'ie 9']
            },

            main: {
                src: '<%= options.base %>/temp/main.css' // globbing is also possible here
            }
        },

        // Watch for files and folder changes - NO MINIFICATION
        watch: {
            less: {
                files: ['<%= options.base %>/less/*.less'],
                tasks: ['clean:all', 'less', 'concat:css_dev', 'notify:watch', 'clean:all']
            },
            uglify: {
                files: ['<%= options.base %>/js/*.js'],
                tasks: ['clean:all', 'concat:js_dev', 'clean:all']
            },
            imagemin:{
                files: ['<%= options.base %>/images/*.{png,jpg,gif}'],
                tasks: ['imagemin']
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: [
                    '<%= options.base %>/less/*.less',
                    '<%= options.base %>/js/*.js'
                ]
            }
        }

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-livereload');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-autoprefixer');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', [
                                    'clean:all',
                                    'less',
                                    'autoprefixer:main',
                                    'jshint',
                                    'concat:css',
                                    'concat:js',
                                    'uglify',
                                    'cssmin',
                                    'imagemin',
                                    'notify:watch',
                                    'clean:all'
                                ]);

    grunt.registerTask('guard', [
                                    'watch'
                                ]);

};