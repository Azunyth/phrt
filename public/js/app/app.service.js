angular.module('app')
    .factory('Guess', ['$http', function($http) {
        return {
            tagsFilled : [],
            actressesFilled : [],

            deleteTag: function(idx) {
                this.tagsFilled.splice(idx, 1);
            },
            deleteActress: function(idx) {
                this.actressesFilled.splice(idx, 1);
            },
            parseTags : function(tags) {
                var self = this;
                self.tagsFilled.length = 0;
                tags.split(',').forEach(function(e) {
                    if(e) {
                        self.tagsFilled.push(e.trim());
                    }
                });
            },
            parseActresses : function(actresses) {
                var self = this;
                self.actressesFilled.length = 0;
                actresses.split(',').forEach(function(e) {
                    if(e) {
                        self.actressesFilled.push(e.trim());
                    }
                });
            }
        }

    }])
