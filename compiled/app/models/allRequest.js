'use strict';

var db = require('../dbConnection');

//create friendRequest model
var allRequest = db.Model.extend({
  tableName: 'allRequests',
  hasTimestamps: true
});

module.exports = allRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9tb2RlbHMvYWxsUmVxdWVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksS0FBSyxRQUFRLGlCQUFSLENBQVQ7OztBQUdBLElBQUksYUFBYSxHQUFHLEtBQUgsQ0FBUyxNQUFULENBQWdCO0FBQy9CLGFBQVcsYUFEb0I7QUFFL0IsaUJBQWU7QUFGZ0IsQ0FBaEIsQ0FBakI7O0FBS0EsT0FBTyxPQUFQLEdBQWlCLFVBQWpCIiwiZmlsZSI6ImFsbFJlcXVlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZGIgPSByZXF1aXJlKCcuLi9kYkNvbm5lY3Rpb24nKTtcblxuLy9jcmVhdGUgZnJpZW5kUmVxdWVzdCBtb2RlbFxudmFyIGFsbFJlcXVlc3QgPSBkYi5Nb2RlbC5leHRlbmQoe1xuICB0YWJsZU5hbWU6ICdhbGxSZXF1ZXN0cycsXG4gIGhhc1RpbWVzdGFtcHM6IHRydWVcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFsbFJlcXVlc3Q7XG4iXX0=