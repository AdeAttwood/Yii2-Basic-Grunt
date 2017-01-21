module.exports = function(grunt) {
    grunt.initConfig({
        vars:{
            changedFile : ""
        },
        pkg: grunt.file.readJSON('package.json'),
        exec: {
            test: {
                cmd: function (filename) {
                    return 'composer exec codecept run ' + filename;
                },
                stdout: true
            },
            'cu-nodev': {
                cmd: function (filename) {
                    return 'composer install --no-dev --no-scripts -d build';
                },
                stdout: true
            },
            'cu': {
                cmd: function (filename) {
                    return 'composer update';
                },
                stdout: true
            }
        },
        
        
        cssmin: {
            options:{},
                target: {
                  files :grunt.file.readJSON("assets/css.json")
                } 
            
          },
         sass: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'assets/sass',
                    src: ['*.scss', '*.sass'],
                    dest: 'assets/css',
                    ext: '.css'
                }]
            },
            prod: {
                files: [{
                    expand: false,
                    cwd: 'assets/sass',
                    src: ['*.scss', '*.sass'],
                    dest: 'assets/css',
                    ext: '.css'
                }]
            }
        },
        uglify: {
            dev: {
                options: {
                    sourceMap: true,
                    mangle: true
                },
                files: grunt.file.readJSON("assets/js.json")
            },
            prod: {
                options: {
                    sourceMap: false,
                    mangle: true
                },
                files: grunt.file.readJSON("assets/js.json")
            }
        },
         watch : {
            js : {
                files : ['assets/js/**/*.js', 'assets/js.json'],
                tasks : ['build-js'],
            },
            sass : {
                files :['assets/sass/**/*.sass', 'assets/sass/**/*.scss', 'assets/css.json'],
                tasks : ['build-css'],
            },
            tests : {
                files: ['tests/**/*.php'],
                tasks : ['exec:test:<%= vars.changedFile %>']
            }
            
        },
        browserSync : {
            dev : {
                bsFiles : {
                    src : [
                        'assets/**',
                        'config/**',
                        'commands/**',
                        'controllers/**',
                        'models/**',
                        'tests/**',
                        'views/**',
                        'web/**'
                        ]
                    
                },
                options : {
                    proxy : '192.168.0.137',
                    watchTask : true
                }
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, src: [
                        'composer.json',
                        'config/**',
                        'commands/**',
                        'components/**',
                        'controllers/**',
                        'item/**',
                        'mail/**',
                        'models/**',
                        'views/**',
                        'widgets/**',
                        'web/**',
                        'web/.htaccess',
                        '!web/assets/**',
                        'web/assets/.gitignore',
                        '!web/index-test.php',
                        '!**/*.map',
                    ], dest: 'build/'},
                // todo make dir runtime
                ],
            },
        },
        clean: {
            build: {
              src: [
                  'build/composer.json',
                  'build/composer.lock',
                  'build/vendor/bin',
                  'build/vendor/bower',
                  'build/config/env-local.php',
                  'build/**/.git',
                  'build/**/.github',
                  'build/**/.gitignore',
                  'build/**/.gitattributes',
                  'build/**/.editorconfig',
                  'build/**/composer.json',
                  'build/**/README.*',
                  'build/**/LICENSE.md',
                  'build/**/CHANGELOG.md',
                  'build/**/UPGRADE.md',
                  'build/**/readme.*',
                  'build/**/phpunit.xml*',
                  'build/**/codeception.yml',
                  'build/**/*.map',
                  'build/**/*.bat'
              ]
            },
            removeBuild: {
              src: ['build/']
            }
        },
        compress: {
            main: {
                options: {
                archive: '<%= pkg.name %>_<%= pkg.version %>.zip'
                },
                files: [
                    {expand: true, cwd: 'build/', src: ['**'], dest: ''}
                ]
           }
        }
    }); 

    /*
     * Load npm grunt tasks
     */
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-exec');
  

       /*
     * Add the pedefined config for development to each of
     * the sass tasks in the sass config and runs the task
     */
    grunt.registerTask('build-css', function () {
        grunt.config('cssmin.options', {
                sourceMap:true
        });
        grunt.task.run('sass:dev');
        grunt.task.run('cssmin');
    });

    /*
     * Runs the task uglify
     */
    grunt.registerTask('build-js', function () {
        grunt.task.run('uglify:dev');
    });

    grunt.registerTask('build-dev', [
        'build-css',
        'build-js'
    ]);

    grunt.registerTask('bs', [
        'browserSync:dev',
        'build-css',
        'build-js',
        'watch'
    ]);
        
    grunt.registerTask('build-prod', function() {
        grunt.config('cssmin.options', {
           
                sourceMap:false,
                shorthandCompacting:true,
                level:2
            
        });
        grunt.task.run('clean:removeBuild');
        grunt.task.run('sass:prod');
        grunt.task.run('cssmin');
        grunt.task.run('uglify:prod');      
        grunt.task.run('copy');
        grunt.task.run('exec:cu-nodev');
        grunt.task.run('clean:build');
        grunt.task.run('compress');
        grunt.task.run('clean:removeBuild');
    });
    
     // change config var to changed file when a file is changed
     grunt.event.on('watch', function(action, filepath) {
           grunt.config('vars.changedFile', filepath);
    });

   grunt.registerTask('default', ['bs']); 
};
