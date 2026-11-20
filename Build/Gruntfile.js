
module.exports = function(grunt) {
    require('jit-grunt')(grunt);

    var fs = require('fs');
    var path = require('path');

    // Ensure build outputs are owned by www-data:www-data.
    // Runs on every Gruntfile load (before any task such as `grunt less`,
    // `grunt terser`, `npm run build`) AND again at process exit so the
    // freshly written files end up www-data:www-data even when Grunt runs
    // as root (a root write would otherwise leave them root:root).
    // When running as root the ownership is fixed automatically; when
    // running unprivileged it only warns, so local builds never fail.
    var outputFiles = [
        'Resources/Public/Css/allStyles.css',
        'Resources/Public/Css/webStyles.css',
        'Resources/Public/Css/rte.css',
        'Resources/Public/JavaScript/allScripts.js',
        'Resources/Public/JavaScript/webScripts.js'
    ].map(function (rel) { return path.resolve(__dirname, '..', rel); });

    var TARGET_UID = 33; // www-data
    var TARGET_GID = 33; // www-data

    function canChown() {
        try { return process.geteuid() === 0; } catch (e) { return false; }
    }

    function ensureOwnership() {
        var privileged = canChown();
        outputFiles.forEach(function (p) {
            if (!fs.existsSync(p)) {
                return;
            }
            var st = fs.statSync(p);
            if (st.uid === TARGET_UID && st.gid === TARGET_GID) {
                return;
            }
            var rel = path.relative(path.resolve(__dirname, '..'), p);
            if (privileged) {
                try {
                    fs.chownSync(p, TARGET_UID, TARGET_GID);
                    grunt.log.ok('chown www-data:www-data ' + rel);
                } catch (e) {
                    grunt.log.warn('chown failed for ' + rel + ': ' + e.message);
                }
            } else {
                grunt.log.warn(rel + ' not owned by www-data (uid ' + st.uid + ') - unprivileged, skipping chown.');
            }
        });
    }

    ensureOwnership();
    process.on('exit', ensureOwnership);

    grunt.initConfig({
        less: {
            development: {
                options: {
                    sourceMap: true,
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "Resources/Public/Css/allStyles.css" : "Resources/Private/Less/all.less",
                    "Resources/Public/Css/webStyles.css" : "Resources/Private/Less/website.less",
                    "Resources/Public/Css/rte.css" : "Resources/Private/Less/rte.less",
                }
            }
        },
        terser: {
            development: {
                options: {
                    compress: false,
                },
                files: {
                    "Resources/Public/JavaScript/allScripts.js" : [
                        'Resources/Private/JavaScript/js.cookie.js',
                        'Resources/Private/JavaScript/dfgviewerSru.js',
                        'Resources/Private/JavaScript/dfgviewerScripts.js',
                    ],
                    "Resources/Public/JavaScript/webScripts.js" : [
                        'Resources/Public/JavaScript/Highlight/highlight.pack.js',
                        'Resources/Private/JavaScript/websiteScripts.js',
                    ],
                }
            }
        },
        watch: {
            styles: {
                files: ['Resources/Private/Less/**/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false
                }
            },
            js: {
                files: ['Resources/Private/JavaScript/*.js'],
                tasks: ['terser'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.file.setBase('../')
    grunt.registerTask('default', ['less','terser','watch']);
    grunt.registerTask('docker', ['less', 'terser']);
};
