function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];

        }

    });
    return target;
};

module.exports = function(grunt) {
    grunt.initConfig({
               watch : {
            js : {
                files : 'assets/js/**/*.js',
                tasks : ['build-js'],
            },
            sass : {
                files :['assets/sass/**/*.sass', 'assets/sass/**/*.scss'],
                tasks : ['build-sass'],
            }
        },
        browserSync : {
            dev : {
                bsFiles : {
                    src : [
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
                    watchTask : true,
                    notify : true,
                    logLevel : 'silent',
                    ghostMode : {
                        clicks : true,
                        scroll : true,
                        links : true,
                        forms : true
                    }
                }
            }
        },
    }); 

    /*
     * Load npm grunt tasks
     */
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-php');

    /*
     * Insert config vars into the grunt config
     */
    grunt.config('uglify',{
        'main-js':{
            files : {
                'web/js/script.js': [
                    /* Jquery js
                     *
                     * Install via composer
                     * $ composer require bower-asset/jquery
                     */
                    'vendor/bower/jquery/dist/jquery.js',

                    /* Bootsrtap js
                     *
                     * Install via composer
                     * $ composer require bower-asset/bootstrap-sass
                     */
                    'vendor/bower/bootstrap-sass/javascripts/bootstrap/affix.js',
                    'vendor/bower/bootstrap-sass/javascripts/bootstrap/alert.js',
                    'vendor/bower/bootstrap-sass/javascripts/bootstrap/button.js',
                    'vendor/bower/bootstrap-sass/javascripts/bootstrap/carousel.js',
                    'vendor/bower/bootstrap-sass/javascripts/bootstrap/collapse.js',
                    'vendor/bower/bootstrap-sass/javascripts/bootstrap/dropdown.js',
                    'vendor/bower/bootstrap-sass/javascripts/bootstrap/modal.js',
                    'vendor/bower/bootstrap-sass/javascripts/bootstrap/popover.js',
                    'vendor/bower/bootstrap-sass/javascripts/bootstrap/scrollspy.js',
                    'vendor/bower/bootstrap-sass/javascripts/bootstrap/tab.js',
                    'vendor/bower/bootstrap-sass/javascripts/bootstrap/tooltip.js',
                    'vendor/bower/bootstrap-sass/javascripts/bootstrap/transition.js',

                    /* Yii js 
                     * 
                     * To be used in your yii app
                     */
                    'vendor/yiisoft.yii2.assets/yii.js',

                    /* Yii form js 
                     * 
                     * To be used in your yii app
                     * when you are useing forms
                     */
                    'vendor/yiisoft.yii2.assets/yii.activeForm.js',
                    'vendor/yiisoft.yii2.assets/yii.validation.js',

                    /* Yii pjax js
                     *
                     * Handels the yii ajax forms
                     */
                    'vendor/bower/yii2-pjax/jquery.pjax.js',

                    /* Yii captcha js 
                     * 
                     * To be used in your yii app
                     * when you are useing yiis captcha
                     */
                    'vendor/yiisoft.yii2.assets/yii.captcha.js',

                    /* Yii gridview js
                     *
                     * To be used in your yii app
                     * when you are useing the gridview widget
                     */
                    'vendor/yiisoft.yii2.assets/yii.gridView.js',

                    /* Other Files
                     * Include all files in assets/js
                     */
                    'assets/js/*.js'
                ],
            }
        }
    });
    grunt.config('sass', {
        'main-sass':{
            files:{
                'web/css/styles.css':'assets/sass/*.scss'
            }
        }
    });

    /*
     * Add the pedefined config for development to each of
     * the sass tasks in the sass config and runs the task
     */
    grunt.registerTask('build-sass', function () {
        var newconfig = {};
        var sassdevconfig = {
            options: {
                //style: 'expanded',
                style: 'compressed',
                update: true
            }
        };
        var gruntsassconfig = grunt.config.get('sass');
        Object.keys(gruntsassconfig).forEach(function(key,index) {
            newconfig[key] = extend({}, gruntsassconfig[key] ,sassdevconfig);
        });
        grunt.config('sass', newconfig)
        grunt.task.run('sass');

        //console.log(JSON.stringify(grunt.config.get('sass'), null, 2));
    });

    /*
     * Runs the task concat
     */
    grunt.registerTask('build-js', function () {
        var newconfig = {};
        var jsdevconfig = {
            options: {
                sourceMap:true
            }
        };
        var gruntjsconfig = grunt.config.get('uglify');
        Object.keys(gruntjsconfig).forEach(function(key,index) {
            newconfig[key] = extend({}, gruntjsconfig[key] ,jsdevconfig);
        });
        grunt.config('uglify', newconfig)
        grunt.task.run('uglify');
        //console.log(JSON.stringify(grunt.config.get('uglify'), null, 2));
    });

    grunt.registerTask('brserve', [
        'browserSync:dev',
        'build-sass',
        'build-js',
        'watch'
    ]);

   grunt.registerTask('default', ['brserve']); 
};
