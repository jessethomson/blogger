if(!authUser) {
	var authUser = ""
}

var app = angular.module("myApp", []);

app.value('authUser', authUser);
app.value('pageOwner', pageOwner);

app.controller("BlogCtrl", ["$scope", "$window", "$http", "authUser", "pageOwner", 
	function($scope, $window, $http, authUser, pageOwner) {

	$scope.basepath = $window.location.origin;
	$scope.authUser = authUser;
	$scope.pageOwner = pageOwner;
	// console.log($window.location.origin);
	console.log("authUser", $scope.authUser);
	console.log("pageOwner", $scope.pageOwner);

	var dateOptions = {
		year: "numeric", month: "short",
		day: "numeric", hour: "2-digit", minute: "2-digit"
	};

	$http.get($scope.basepath + "/users").then(function(response) {
		$scope.allUsers = response.data;
	}, function(error) {
		console.log(errors)
	})

	$scope.posts = $scope.pageOwner.posts;
	$scope.newComments = [];

	$scope.addPost = function() {
		if($scope.newPostTitle && $scope.newPostBody) {

			var newPost = {
				title: $scope.newPostTitle,
				body: $scope.newPostBody,
				date: new Date().toLocaleTimeString("en-US", dateOptions),
				comments: []
			}

			// console.log(newPost);
			$scope.newPostTitle = "";
			$scope.newPostBody = "";

			$http.post($scope.basepath + "/users/" + pageOwner._id + "/post", newPost).then(function(response) {
				console.log(response.data)
				$scope.posts = response.data.posts;
			}, function(error) {
				console.log(error);
			});
		}
	}

	$scope.addComment = function(postIndex) {
		console.log("postIndex", postIndex);
		if($scope.newComments[postIndex]) {

			var newComment = {
				owner: authUser.displayName,
				body:$scope.newComments[postIndex],
				date: new Date().toLocaleTimeString("en-US", dateOptions)
			}
			// $scope.posts[postIndex].comments.push(newComment);

			$scope.newComments[postIndex] = ""

			$http.post($scope.basepath + "/users/" + pageOwner._id + "/post/" + $scope.posts[postIndex]._id + "/comment", newComment).then(function(response) {
				console.log(response.data)
				$scope.posts[postIndex] = response.data;
			}, function(error) {
				console.log(error);
			});
		}
	}

}]);