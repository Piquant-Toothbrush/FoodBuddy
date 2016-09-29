'use strict';

module.exports = function (a) {

  a.initConfig({
    shell: {
      addAndDeploy: {
        command: function command(b) {
          return ['babel . --out-dir compiled --presets=es2015,react,minify-es2015 --ignore=node_modules,compiled --source-maps inline', 'git add .', 'git commit -m' + b, 'git push heroku master -f'].join('&&');
        }
      }
    }
  });

  a.loadNpmTasks('grunt-shell');

  //grunt shell:addAndDeploy:Message_Here

  a.registerTask('testGrunt', function () {});
};
//
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL0dydW50ZmlsZS5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwiZ3J1bnQiLCJpbml0Q29uZmlnIiwic2hlbGwiLCJhZGRBbmREZXBsb3kiLCJjb21tYW5kIiwibWVzcyIsImpvaW4iLCJsb2FkTnBtVGFza3MiLCJyZWdpc3RlclRhc2siXSwibWFwcGluZ3MiOiI7O0FBQUFBLE9BQU9DLE9BQVAsR0FBaUIsVUFBU0MsQ0FBVCxFQUFnQjs7QUFFL0JBLElBQU1DLFVBQU4sQ0FBaUI7QUFDZkMsV0FBTztBQUNMQyxvQkFBYztBQUNaQyxpQkFBUztBQUFBLGlCQUFRLENBQUMscUhBQUQsRUFBd0gsV0FBeEgsRUFBcUksa0JBQWtCQyxDQUF2SixFQUE2SiwyQkFBN0osRUFBMExDLElBQTFMLENBQStMLElBQS9MLENBQVI7QUFBQTtBQURHO0FBRFQ7QUFEUSxHQUFqQjs7QUFRQU4sSUFBTU8sWUFBTixDQUFtQixhQUFuQjs7QUFHQTs7QUFFQVAsSUFBTVEsWUFBTixDQUFtQixXQUFuQixFQUFnQyxZQUFNLENBRXJDLENBRkQ7QUFLRCxDQXBCRDtBQXFCQSIsImZpbGUiOiJHcnVudGZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGdydW50KSB7XHJcblxyXG4gIGdydW50LmluaXRDb25maWcoe1xyXG4gICAgc2hlbGw6IHtcclxuICAgICAgYWRkQW5kRGVwbG95OiB7XHJcbiAgICAgICAgY29tbWFuZDogbWVzcyA9PiBbJ2JhYmVsIC4gLS1vdXQtZGlyIGNvbXBpbGVkIC0tcHJlc2V0cz1lczIwMTUscmVhY3QsbWluaWZ5LWVzMjAxNSAtLWlnbm9yZT1ub2RlX21vZHVsZXMsY29tcGlsZWQgLS1zb3VyY2UtbWFwcyBpbmxpbmUnLCAnZ2l0IGFkZCAuJywgJ2dpdCBjb21taXQgLW0nICsgbWVzcywgJ2dpdCBwdXNoIGhlcm9rdSBtYXN0ZXIgLWYnXS5qb2luKCcmJicpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfSk7XHJcblxyXG4gIGdydW50LmxvYWROcG1UYXNrcygnZ3J1bnQtc2hlbGwnKVxyXG4gIFxyXG5cclxuICAvL2dydW50IHNoZWxsOmFkZEFuZERlcGxveTpNZXNzYWdlX0hlcmVcclxuXHJcbiAgZ3J1bnQucmVnaXN0ZXJUYXNrKCd0ZXN0R3J1bnQnLCAoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygndGVzdGluZyBncnVudCEnKVxyXG4gIH0pXHJcblxyXG5cclxufVxyXG4vLyJdfQ==