app.controller("RegistUserController", ['$scope',"RegistMaterialService","UserRegistService","NotificationRegistService", "$http" ,"$sce", "$route", "$window", "jQuery", function($scope, RegistMaterialService, UserRegistService,NotificationRegistService, $http, $sce, $route, $window){
   
    /* hide footer of index page because of click in buttons footer reload page */
    jQuery("#footerMain").hide();
	jQuery("#headerMain").hide();
	jQuery("#searchMain").hide();
	jQuery("#userDetailsMain").hide();
	jQuery("#divControllerMain").removeClass("divController");
	
   	/* define view of app */
	$scope.viewType = function() {
		var window_width = $( window ).width();
		if(window_width < 1024) {
			$scope.isMobileView=true;
		} else {
			$scope.isMobileView=false;
		}
    }
	
	/* init my variables data */
	$scope.initData = function() {
		/* my current page */
		$scope.namePage='registUser';
		$scope.nameclick='registUser';
		$scope.loading = true;
        $scope.registUser=true;
        $scope.resultSearch= [];
	}

	/* verify if user is logged in */
	$scope.validateUserLoggedIn = function() {
		if(!$scope.isMobileView) {
			var splitLocation = location.href.split('=');
			var splitParams = splitLocation[1].split('&');
			$scope.idUserLoggerIn =splitParams[0];
			$scope.redirect = splitParams[1];
		
		} else {
			var splitLocation = location.href.split('=');
			$scope.idUserLoggerIn =splitLocation[1];
		}

		if($scope.idUserLoggerIn !== "" && $scope.idUserLoggerIn !== undefined && $scope.idUserLoggerIn !== "undefined" && $scope.idUserLoggerIn !== 'anonymous&redirect'  && $scope.idUserLoggerIn !== 'anonymous'  && $scope.idUserLoggerIn !== "undefined") {
			$scope.confirmSession=true;
		} else {
			$scope.loading = true;
			$scope.confirmSession=false;
		}
	}

	/* -------------- INIT DESKTOP & MOBILE -------------- */
	/* get information of my favorites, my questions and answer to display */
    $scope.getAllRequests = function() {
		var getMaterials = RegistMaterialService.getMaterialComparation(function(infoMaterial){});
		getMaterials.then(function(result) {
			$scope.loading = false;
			var data=result.data.comparationDetails;
			$scope.materialsToSearch = data;

			
			$scope.getLibraryUser = UserRegistService.getLibraryUserDetails(function(infoMyBiama){});
			$scope.getLibraryUser.then(function(result) {
				$scope.loading = false;
				var data=result.data.userLibrary;
				$scope.userLibrary=data;
			});
		});
		
		$scope.users = 'loadUser';
		$scope.getAllUsers = UserRegistService.getUsers(function(users){});
		$scope.getAllUsers.then(function(usersDB) {
			$scope.users = usersDB.data.users;
		});
	}
	
	/* redirect to homepage with arrow */
	$scope.goToHomePage = function() {
        if($scope.idUserLoggerIn !== undefined) {
			location.href = '?userName=' + $scope.idUserLoggerIn;
		} else {
			location.href = '?username=' + 'anonymous';
		}
    }

    /* validate date of birth format */
	$scope.validDateOfBirth = function(dateOfBirth) {
		var resultBirth = dateOfBirth.split("/");

		var currentDate = new Date();
		currentDate=currentDate.toLocaleDateString();
		var resultCurrentDate = currentDate.split("/");

		var calculateYear = parseInt(resultCurrentDate[2]) - parseInt(resultBirth[2]);
		if(calculateYear < 18) {
			return false;
		}
		return true;
	}

	/* validate if data not exists already */
	$scope.validDataNotEquals = function(username, password) {
		for(var index=0; index<$scope.users.length; ++index) {
			if(username === $scope.users[index].username) {
				return false;
			}
		}
		return true;
	}
    
    /* created user: insert user on database */
	$scope.insertUser = function(name, username, email, birthdate, password) {
		if(name !== undefined && password !== undefined) {
			if(name === undefined && username === undefined && email === undefined && birthdate === undefined && password === undefined) {
				$scope.emptyData=true;
			} else {
	
				if(birthdate !== undefined && birthdate !== null) {
					var idUser = $scope.users[$scope.users.length-1].id;
					$scope.insertedIdUser=idUser;
					var data = {
						'idUser': parseInt(idUser)+1,
						'name': name,
						'email': email,
						'birthdate': birthdate.toLocaleDateString(), 
						'username': username,
						'password': password,
						'image': $scope.image
					}
					if($scope.image == undefined) {
						data.image='noImage';
					}
	
					var validData = $scope.validDataNotEquals(data.username, data.password);
				
					if(validData) {
						var validBirthdate = $scope.validDateOfBirth(data.birthdate);
						if(validBirthdate){
							$http.post('/insertUserDetails', data);
							
							var dataLibraryUser = {
								'idUser': parseInt($scope.insertedIdUser)+1,
								'idLibrary': ($scope.userLibrary[$scope.userLibrary.length-1].library_id)+1
							}
	
							$http.post('/insertLibraryUser', dataLibraryUser);
	
							$window.setTimeout("location.href = ''")
						} else {
							$scope.underAge=true;
						}
					} else {
						$scope.usernameRepeated=true;
					}
				} else {
					$scope.emptyBirthdate=true;
				}
			}
		} else {
			$scope.emptyData=true;
		}
		
	}
	/* -------------- END DESKTOP & MOBILE -------------- */

    /* -------------- INIT MOBILE -------------- */
	/* open material of small search result */
	$scope.openMaterial = function(material) {
		$scope.showDetailsOfMaterial=true;
		$scope.showMaterials=false;
		$scope.openedMaterial=material;
        $scope.miniSearchResults=false;
        $scope.registUser=false;
	}
	
	/* close material that are opened */
	$scope.closeMaterial = function(){
		$scope.miniSearchResults=true;
        $scope.showDetailsOfMaterial=false;
        $scope.registUser=false;
	}

	/* open and close the small search icon */
	$scope.clickTopSearch = function() {
		if($scope.showSearch){
			$scope.showSearch = false;
		}else {
			$scope.showSearch = true;
		}
	}
	
	/* close the results of small search */
	$scope.closeMiniSearch = function() {
		$scope.miniSearchResults = false;
		$scope.search=true;
		$scope.openMaterialDetail=false; 
		$scope.showInitSearch=true;
		$scope.showSearch=false;
        $scope.enableUserIcon=false; 
        $scope.registUser=true;
	}

	/* action of click button "Ok" present on small search line */
    $scope.initMiniSearch = function() {
		$scope.resultSearch=[];
		var inputMiniValue = jQuery("#miniSearch").val(); 		
		var inputMini = inputMiniValue.toLowerCase();
		if(inputMini !== '') {
			for(var index=0; index < $scope.materialsToSearch.length; ++index) {
				var resultMaterial = {
					'name': $scope.materialsToSearch[index].name,
					'category': $scope.materialsToSearch[index].category,
					'code': $scope.materialsToSearch[index].code,
					'description': $scope.materialsToSearch[index].description
				}

				var type = ($scope.materialsToSearch[index].type);
				var color = ($scope.materialsToSearch[index].color);
				var category = ($scope.materialsToSearch[index].category);
				var description = ($scope.materialsToSearch[index].description);

				if(type !== null && color !== null && category !== null && description !== null) {
					type = ($scope.materialsToSearch[index].type).toLowerCase();
					color = ($scope.materialsToSearch[index].color).toLowerCase();
					category = ($scope.materialsToSearch[index].category).toLowerCase();
					description = ($scope.materialsToSearch[index].description).toLowerCase();

					if(type.indexOf(inputMini) !== -1) {
						$scope.resultSearch.push(resultMaterial);
					} else if(color.indexOf(inputMini) !== -1) {
						$scope.resultSearch.push(resultMaterial);
					} else if(category.indexOf(inputMini) !== -1) {
						$scope.resultSearch.push(resultMaterial);
					} else if(description.indexOf(inputMini) !== -1) {
						$scope.resultSearch.push(resultMaterial);
					}
				}
				
			}

			if($scope.resultSearch.length == 0) {
				$scope.noResultsOnSearch=true;
			} else {
				$scope.showInitSearch=false;
				$scope.showSearch=false;
				$scope.miniSearchResults = true;
				$scope.noResultsOnSearch=false;
				$scope.showResultsOfMiniSearch=true;
				$scope.registUser=false;
			}
		}
	}
    
    /* open and close the section of user details and search icon */
	$scope.clickUserDetails = function() {
		if($scope.userDetails){
			$scope.userDetails = false;
		}else {
			$scope.userDetails = true;
			$scope.showSearch = false;
		}
	}
	
	/* section of init session in user details section */
	$scope.showInitSessionDiv = function () {
		if($scope.showInitSession){
			$scope.showInitSession = false;
		}else {
			$scope.showInitSession = true;
		}
	}

	/* confirmed user logged in */
	$scope.confirmSessionAction = function (username, password) {

		for(var index=0; index<$scope.users.length; ++index){
			$scope.userName = $scope.users[index].username;
			$scope.username = $scope.users[index].username;
			$scope.userPassword = $scope.users[index].password;

			if($scope.userName !== null && $scope.userName === username){
				if($scope.userPassword !== null && $scope.userPassword === password){

					$scope.userImage = $scope.users[index].image;
					$scope.userEmail = $scope.users[index].email;
					$scope.nameUser=$scope.users[index].name;
					$scope.userBirthdate = $scope.users[index].birthdate;

					var splitDateBirth = $scope.userBirthdate.split('/');
					$scope.dayBirth = splitDateBirth[0];
					$scope.monthBirth = splitDateBirth[1];
					$scope.yearBirth = splitDateBirth[2];

					$scope.userLoggedIn=$scope.users[index].username;
					$scope.idUserLoggerIn=$scope.users[index].id;
					$scope.confirmSession = true;
					
					setTimeout(function() {
						$(".alert").fadeOut().empty();
					}, 2000);

					$scope.clickInitSession=true;

				} else {
					$scope.errorLogin = true;
				}
				break;
			} else {
				$scope.incorrectCredentials=true;
			}
		}
	}
	
	/* routes of click on links page */
	$scope.getRequest = function(buttonClick) {

		if(!$scope.isMobileView) {
			if(buttonClick === 'biamaPage') {
				$window.location.href = '/BiAMa/biamaPage?userName=' + $scope.idUserLoggerIn + '&redirect';
			}
	
			if(buttonClick === 'whereWeAre') {
				$window.location.href = '/BiAMa/whereWeAre?userName=' + $scope.idUserLoggerIn + '&redirect';
			}

			if(buttonClick === 'library') {
				$window.location.href = '/BiAMa/library?userName=' + $scope.idUserLoggerIn + '&redirect';
			}

			if(buttonClick === 'myBiama') {
				$window.location.href = '/BiAMa/myBiama?userName=' + $scope.idUserLoggerIn + '&redirect';
			}

			if(buttonClick === 'forum') {
				$window.location.href = '/BiAMa/forumPage?userName=' + $scope.idUserLoggerIn + '&redirect';
			}

			if(buttonClick === 'favorites') {
				$window.location.href = '/BiAMa/favorites?userName=' + $scope.idUserLoggerIn + '&redirect';
			}
	
			if(buttonClick == 'questions') {
				$window.location.href = '/BiAMa/myQuestions?userName=' + $scope.idUserLoggerIn + '&redirect';
			}
	
			if(buttonClick == 'world_share') {
				$window.location.href = '/BiAMa/worldShare?userName=' + $scope.idUserLoggerIn + '&redirect';
			}
	
			if(buttonClick == 'notification') {
				$window.location.href = '/BiAMa/notifications?userName=' + $scope.idUserLoggerIn + '&redirect';
			}
	
			if(buttonClick == 'perfil') {
				$window.location.href = '/BiAMa/perfilPage?userId=' + $scope.idUserLoggerIn + '&redirect';
			}
	
			if(buttonClick == 'compare') {
				$window.location.href = '/BiAMa/compare?userName=' + $scope.idUserLoggerIn + '&redirect';
			}

			if(buttonClick == 'regist') {
				$scope.regist();
				$window.location.href = '/BiAMa/registUser?userName=' + $scope.idUserLoggerIn + '&redirect';
			}
		} else {
			if(buttonClick === 'favorites') {
				$window.location.href = '/BiAMa/favoritesMobile?userName=' + $scope.idUserLoggerIn;
			}
	
			if(buttonClick == 'questions') {
				$window.location.href = '/BiAMa/myQuestionsMobile?userName=' + $scope.idUserLoggerIn;
			}
	
			if(buttonClick == 'world_share') {
				$window.location.href = '/BiAMa/worldShareMobile?userName=' + $scope.idUserLoggerIn;
			}
	
			if(buttonClick == 'notification') {
				$window.location.href = '/BiAMa/notificationsMobile?userName=' + $scope.idUserLoggerIn;
			}
	
			if(buttonClick == 'perfil') {
				$window.location.href = '/BiAMa/perfilPageMobile?userId=' + $scope.idUserLoggerIn;
			}
	
			if(buttonClick == 'compare') {
				$window.location.href = '/BiAMa/compareMobile?userName=' + $scope.idUserLoggerIn;
			}

			if(buttonClick == 'regist') {
				$scope.regist();
				$window.location.href = '/BiAMa/registUserMobile?userName=' + $scope.idUserLoggerIn;
			}
		}
		
		if(buttonClick === 'notification') {

			var getNotifications = NotificationRegistService.getMyNotifications($scope.idUserLoggerIn, function(infoNotification){});
				getNotifications.then(function(result) {
				$scope.loading = false;
				var data=result.data.notificationDetails;
				$scope.notifications=data;
				$scope.numberOfNotifications=$scope.notifications.length;
			});
			$scope.userDetails = true;
			$scope.notificationNumber=true;
		} else {
			$scope.userDetails = false;
			$scope.notificationNumber = false;
		}
		$scope.search = false;
	}

	/* logout of user details section */
	$scope.logout = function(){
		$scope.confirmSession = false;
	}

	/* regist new user on user details section */
	$scope.regist = function() {
		$scope.userDetails = false;
		$scope.registUser=true;
		$scope.search=false;
	}
	/* -------------- END MOBILE -------------- */

	/* init WhereWeAreController  */
	$scope.viewType();
	$scope.initData();
	$scope.getAllRequests();
	$scope.validateUserLoggedIn();
}])

app.factory("NotificationRegistService", function($q, $http, $timeout){
    var getMyNotifications = function(data) {
        var deferred = $q.defer();

		$http.get('/myNotifications', {params: {'data': data}}).then(successCallback, errorCallback);

       function successCallback(response){
           //success code
           deferred.resolve(response);
       }
       function errorCallback(error){
           //error code
           deferred.reject(status);
       }

        return deferred.promise;
    };


    return {
        getMyNotifications: getMyNotifications
    };
});

app.factory("RegistMaterialService", function($q, $http, $timeout){
	var getMaterialComparation = function() {
		var deferred = $q.defer();

		$http.get('/compareMaterials').then(successCallback, errorCallback);

        function successCallback(response){
            //success code
            deferred.resolve(response);
        }
        function errorCallback(error){
            //error code
            deferred.reject(status);
        }

		return deferred.promise;
	};

	return {
			getMaterialComparation: getMaterialComparation
	};
});

app.factory("UserRegistService", function($q, $http, $timeout){
    
	var getUsers = function() {
		var deferred = $q.defer();
	
		$http.get('/users').then(successCallback, errorCallback);

        function successCallback(response){
            //success code
            deferred.resolve(response);
        }
        function errorCallback(error){
            //error code
            deferred.reject(status);
        }
	
		return deferred.promise;
	};

	var getLibraryUserDetails = function() {
		
		var deferred = $q.defer();

		$http.get('/getLibraryUser').then(successCallback, errorCallback);

        function successCallback(response){
            //success code
            deferred.resolve(response);
        }
        function errorCallback(error){
            //error code
            deferred.reject(status);
        }

		return deferred.promise;
	}

	return {
		getUsers: getUsers,
		getLibraryUserDetails: getLibraryUserDetails
	};
});
