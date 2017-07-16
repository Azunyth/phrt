angular.module('guess')
    .controller('GuessCtrl', ['$scope', '$http', 'Guess', function($scope, $http, Guess) {

        //TODO: Factorize this shitty code

        $scope.tagsFilled = Guess.tagsFilled;
        $scope.actressesFilled = Guess.actressesFilled;
        $scope.clues = Guess.tagsClue;
        $scope.error = "";
        $scope.score = 0;

        $scope.deleteTag = function(idx) {
            Guess.deleteTag(idx);
            $scope.tags = (Guess.tagsFilled.length > 0) ? Guess.tagsFilled.join(',') : "";
        }

        $scope.$watch('tags', function(newValue, oldValue) {
            if(newValue != oldValue) {
                Guess.parseTags(newValue);
            }
        });

        $scope.deleteActress = function(idx) {
            Guess.deleteActress(idx);
            $scope.actresses = (Guess.actressesFilled.length > 0) ? Guess.actressesFilled.join(',') : "";
        }

        $scope.$watch('actresses', function(newValue, oldValue) {
            if(newValue) {
                Guess.parseActresses(newValue);
            }
        });

        $scope.closeAlert = function() {
            $scope.error = "";
        }

        $scope.getClues = function(id) {
            $http.get('/guess/clue/'+id).then(function success(response){
                if(response.data) {
                    Guess.parseClues(response.data.tags);
                    $scope.score = response.data.score;
                }
            }, function error(response) {
                $scope.error = response.data.error;
            })
        }

    }]);
