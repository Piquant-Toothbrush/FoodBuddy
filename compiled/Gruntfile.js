'use strict';

module.exports = function (a) {

  a.initConfig({
    shell: {
      addAndDeploy: {
        command: function command(b) {
          return ['npm run front-end', 'git add .', 'git commit -m' + b, 'git push heroku master -f'].join('&&');
        }
      }

    }
  });

  a.loadNpmTasks('grunt-shell');

  //grunt shell:addAndDeploy:Message_Here

  a.registerTask('testGrunt', function () {});
};
//
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL0dydW50ZmlsZS5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwiZ3J1bnQiLCJpbml0Q29uZmlnIiwic2hlbGwiLCJhZGRBbmREZXBsb3kiLCJjb21tYW5kIiwibWVzcyIsImpvaW4iLCJsb2FkTnBtVGFza3MiLCJyZWdpc3RlclRhc2siXSwibWFwcGluZ3MiOiI7O0FBQUFBLE9BQU9DLE9BQVAsR0FBaUIsVUFBU0MsQ0FBVCxFQUFnQjs7QUFFL0JBLElBQU1DLFVBQU4sQ0FBaUI7QUFDZkMsV0FBTztBQUNMQyxvQkFBYztBQUNaQyxpQkFBUztBQUFBLGlCQUFRLENBQUMsbUJBQUQsRUFBc0IsV0FBdEIsRUFBbUMsa0JBQWtCQyxDQUFyRCxFQUEyRCwyQkFBM0QsRUFBd0ZDLElBQXhGLENBQTZGLElBQTdGLENBQVI7QUFBQTtBQURHOztBQURUO0FBRFEsR0FBakI7O0FBU0FOLElBQU1PLFlBQU4sQ0FBbUIsYUFBbkI7O0FBR0E7O0FBRUFQLElBQU1RLFlBQU4sQ0FBbUIsV0FBbkIsRUFBZ0MsWUFBTSxDQUVyQyxDQUZEO0FBS0QsQ0FyQkQ7QUFzQkEiLCJmaWxlIjoiR3J1bnRmaWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihncnVudCkge1xyXG5cclxuICBncnVudC5pbml0Q29uZmlnKHtcclxuICAgIHNoZWxsOiB7XHJcbiAgICAgIGFkZEFuZERlcGxveToge1xyXG4gICAgICAgIGNvbW1hbmQ6IG1lc3MgPT4gWyducG0gcnVuIGZyb250LWVuZCcsICdnaXQgYWRkIC4nLCAnZ2l0IGNvbW1pdCAtbScgKyBtZXNzLCAnZ2l0IHB1c2ggaGVyb2t1IG1hc3RlciAtZiddLmpvaW4oJyYmJylcclxuICAgICAgfSxcclxuICAgICAgXHJcbiAgICB9LFxyXG4gIH0pO1xyXG5cclxuICBncnVudC5sb2FkTnBtVGFza3MoJ2dydW50LXNoZWxsJylcclxuICBcclxuXHJcbiAgLy9ncnVudCBzaGVsbDphZGRBbmREZXBsb3k6TWVzc2FnZV9IZXJlXHJcblxyXG4gIGdydW50LnJlZ2lzdGVyVGFzaygndGVzdEdydW50JywgKCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ3Rlc3RpbmcgZ3J1bnQhJylcclxuICB9KVxyXG5cclxuXHJcbn1cclxuLy8iXX0=