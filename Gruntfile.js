module.exports = function(grunt) {

  grunt.initConfig({
    shell: {
      addAndDeploy: {
        command: mess => ['npm run front-end', 'git add .', 'git commit -m' + mess, 'git push heroku master -f'].join('&&')
      },
      
    },
  });

  grunt.loadNpmTasks('grunt-shell')
  

  //grunt shell:addAndDeploy:Message_Here

  grunt.registerTask('testGrunt', () => {
    console.log('testing grunt!')
  })


}
//