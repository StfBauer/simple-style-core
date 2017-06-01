module.exports = (() => {

    // base path of app
    var basepath = 'app',
        tempdir = '.tmp',
        coreBasePath = 'ssg-core-engine',
        appdir = process.cwd() + '/' + basepath;

    var config = {
        server: {
            notify: false,
            port: 9000,
            server: {
                baseDir: [basepath, tempdir, 'node_modules'],
                routes: {
                    '/bower_components': 'bower_components',
                    '/.tmp': '/',
                    '/node_modules': '/'
                }
            },
            https: true,
            directory: true
        },
        tsconfig: 'tsconfig.json',
        ssgCoreTemp: './ssg-core-tmp',
        // core settings
        styles: '/styles/',
        scripts: '/script/',
        documentation: {
            path: '/_documentation/ssg.doc.js'
        },
        ssg: {
            path: basepath + '/_patterns/**/*.hbs',
            config: basepath + '/_config/pattern.conf.json',
            partials: [
                basepath + '_patterns/**/*.hbs',
                basepath + '_core/**/_*.hbs'
            ],
            templates: [
                basepath + '_patterns/**/[^_]*.hbs'
            ],
            namespace: 'ssg.templates'
        },
        watches: {
            styles: basepath + '/styles/**/*.scss',
            scripts: basepath + '/scripts/**/*.ts',
            ssg: [
                basepath + '/_patterns/**/[^_]*.hbs'
            ],
            documentation: basepath + '/_documentation/**/*.md'
        },
        watchesCore: {
            styles: coreBasePath + '/styles/**/*.scss',
            scripts: coreBasePath + '/scripts/**/*.ts'
        },
        target: {
            styles: tempdir + '/styles/',
            scripts: tempdir + '/scripts/'
        }
    }

    return config;

})();