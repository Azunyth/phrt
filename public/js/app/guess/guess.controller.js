angular.module('guess')
    .controller('GuessCtrl', ['$scope', 'Guess', function($scope, Guess) {

        //TODO: Factorize this shitty code

        $scope.tagsFilled = Guess.tagsFilled;
        $scope.actressesFilled = Guess.actressesFilled;

        $scope.deleteTag = function(idx) {
            Guess.deleteTag(idx);
            $scope.tags = (Guess.tagsFilled.length > 0) ? Guess.tagsFilled.join(',') : "";
        }

        $scope.$watch('tags', function(newValue, oldValue) {
            if(newValue) {
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

    }]);
