module.exports = function(grunt) {

  grunt.initConfig({
    shell: {
      addAndDeploy: {
        command: mess => ['babel . --out-dir compiled --presets=es2015,react,minify-es2015 --ignore=node_modules,compiled --source-maps inline', 'git add .', 'git commit -m' + mess, 'git push heroku master -f'].join('&&')
      }
    },
  });

  grunt.loadNpmTasks('grunt-shell')
  

  //grunt shell:addAndDeploy:Message_Here

  grunt.registerTask('testGrunt', () => {
    console.log('testing grunt!')
  })


}
//