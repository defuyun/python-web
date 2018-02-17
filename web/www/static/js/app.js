(function(){
    var app = angular.module('app',['ngRoute'])

    app.config(function($routeProvider) {
        $routeProvider
        .when('/content/posts/', {
            templateUrl : '/templates/list.html',
        })
        .when('/content/posts/:page', {
            templateUrl : function(params) {
                return '/blogs/' + params.page;
            }
        })
    });

    app.controller('rootController', function($scope, $http, $location){
        console.log('init rootController');

        var vm = this;
        vm.content = null;
        
        vm.optionList = {
            activeOption : null,
            options : [],
        }

        vm.postList = {
            allPosts : {},
            years : [],
            pageNumber : 1,
            activePost : null,
        }

        vm.getBlog = function (path) {
            console.log(path);
            vm.postList.activePost = path;
            $location.path('/content/posts/' + vm.postList.activePost);
        }

        $http.get('/api/sidebar/options')
        .then(function(response) {
            vm.optionList.options = response.data['options'];
            vm.optionList.activeOption = vm.optionList.options[0];
            console.log('get ' + vm.optionList.activeOption);
        });

        $scope.$watch('vm.optionList.activeOption', function(activeOption){
            if(!canProcessOptions(activeOption)) {
                return;
            }

            $http.get('/api/content/' + getUrl(activeOption))
            .then(function(response){
                vm.content = response.data['content'];
                processOptions(activeOption);
                console.log('content: ' + vm.content);
                $location.path('/content/' + activeOption); 
            });
        },true);

        function getUrl(activeOption) {
            if(!canProcessOptions(activeOption)){
                return undefined;
            }

            if(activeOption == 'posts') {
                return activeOption + '?page=' + vm.postList.pageNumber;
            }
        }

        function processOptions(activeOption) {
            if(!canProcessOptions(activeOption)) {
                return;    
            }

            if(activeOption == 'posts') {
                vm.postList = {
                    allPosts : {},
                    years : [],
                    activePost : null,
                    pageNumber : vm.postList.pageNumber,
                }

                for(var i = 0; i < vm.content.length; i++) {
                    console.log(vm.content[i]);
                    var year = parseInt(vm.content[i].date.split('/')[2]);
                    if(vm.postList.allPosts[year] == undefined) {
                        vm.postList.allPosts[year] = [];
                        vm.postList.years.push(year);
                    }
                    vm.postList.allPosts[year].push(vm.content[i]);
                }
                vm.postList.years.sort(function(a,b) {
                    return a < b
                });
                console.log(vm.postList);
            }
        }

        function canProcessOptions(activeOption) {
            return vm.optionList.options.indexOf(activeOption) != -1;
        }

        console.log('end rootController');
    });
}());