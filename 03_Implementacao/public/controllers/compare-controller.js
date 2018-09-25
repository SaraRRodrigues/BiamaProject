app.controller("CompareController", ['$scope',"CompareMyMaterialService", "UserCompareService", "CompareMaterialService", "$http","$window", "jQuery", function($scope, CompareMyMaterialService,UserCompareService, CompareMaterialService, $http, $window){
    
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
		$scope.namePage='compare';
		$scope.showMaterialsCompare=false;
		$scope.searchToCompare=true;
		$scope.materialToCompare=[];
		$scope.loading = true;
		$scope.doLogin=false;
		$scope.compareMaterials=[];
		$scope.showInputToCompare=true;
	
		$scope.resultSearch = [];
		$scope.showDetailsOfMaterial=false;
		$scope.miniSearchResults=false;
		$scope.showLabelCompare=true;
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

		if($scope.idUserLoggerIn !== "" && $scope.idUserLoggerIn !== undefined && $scope.idUserLoggerIn !== "undefined" && $scope.idUserLoggerIn !== 'anonymous&redirect'  && $scope.idUserLoggerIn !== 'anonymous' ) {
			$scope.confirmSession=true;
		} else {
			$scope.loading = true;
			$scope.confirmSession=false;
		}
	}

	/* -------------- INIT DESKTOP & MOBILE -------------- */
	/* get information of materials to display when compare materials */
	$scope.getAllRequests = function() {
		var getMaterialsToCompare = CompareMyMaterialService.getMaterialComparation(function(infoMaterial){});
		getMaterialsToCompare.then(function(result) {
			$scope.loading = false;
			var data=result.data.comparationDetails;
			$scope.materialComparation=data;
	
			for(var index=0; index<$scope.materialComparation.length; ++index) {
				$scope.compareMaterials.push($scope.materialComparation[index].type + '-' +  $scope.materialComparation[index].color)
			}
	
			jQuery( function() {
				var availableTags = $scope.compareMaterials;
				jQuery( "#tags" ).autocomplete({
					source: availableTags
				});
			});
				
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
	
	/* user select material on search to compare */
	$scope.selectedMaterial = function() {

        $scope.showMaterial=true;
        var valueSearchMaterial=jQuery( "#tags" ).val();
        var result=valueSearchMaterial.split('-');

		if(result[0] !== '') {
			var type=result[0];
			var color=result[1];
	
			for(var index=0; index<$scope.materialComparation.length; ++index) {
				if($scope.materialComparation[index].type === type && $scope.materialComparation[index].color === color) {
					var result = {
						'image': $scope.materialComparation[index].name,
						'code': $scope.materialComparation[index].code,
						'category': $scope.materialComparation[index].category,
						'text': $scope.materialComparation[index].description
					}
					$scope.materialToCompare.push(result);
					$scope.compareMaterialNotExists=false;
					break;
				} else {
					$scope.compareMaterialNotExists=true;
				}
			}
			if($scope.materialToCompare.length > 0) {
				$scope.showMaterialsCompare=true;
			} else {
				$scope.showMaterialsCompare=false;
			}
		} else {
			$scope.emptySearch=true;
		}
    }
    /* -------------- END DESKTOP & MOBILE -------------- */
	
	/* -------------- INIT MOBILE -------------- */
	/* open material of small search result */
	$scope.openMaterial = function(material) {
		$scope.miniSearchResults=false;
		$scope.showDetailsOfMaterial=true;
		$scope.showMaterials=false;
		$scope.openedMaterial=material;
		
		$scope.showMaterialsCompare=false;
		$scope.showInputToCompare=false;
		$scope.showLabelCompare=false;
	}

	/* close material that are opened */
	$scope.closeMaterial = function(){
		$scope.miniSearchResults=false;
		$scope.showDetailsOfMaterial=false;
		$scope.showMaterialsCompare=true;
		$scope.showLabelCompare=true;
		
		$scope.showMaterialsCompare=false;
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
		$scope.showInputToCompare=true;
		$scope.showDetailsOfMaterial=false;
		$scope.showLabelCompare=true;
	}

	/* action of click button "Ok" present on small search line */
    $scope.initMiniSearch = function() {

		$scope.resultSearch=[];
		var inputMiniValue = jQuery("#miniSearch").val(); 		
		var inputMini = inputMiniValue.toLowerCase();

		var getMaterials = CompareMaterialService.getMaterialComparation(function(infoMaterial){});
		getMaterials.then(function(result) {
			$scope.loading = false;
			var data=result.data.comparationDetails;
			$scope.materialsToSearch = data;

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
					$scope.search=true;
				} else {
					$scope.showInitSearch=false;
					$scope.showSearch=true;
					$scope.miniSearchResults = true;
					$scope.noResultsOnSearch=false;
					$scope.showResultsOfMiniSearch=true;
				}
				
				$scope.userDetails = false;
			}
		});
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

		$scope.users = 'loadUser';
		
		$scope.getAllUsers = UserCompareService.getUsers(function(users){});
		$scope.getAllUsers.then(function(usersDB) {
			$scope.users = usersDB.data.users;
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
        });
    }
	
	/* routes of click on links page */
	$scope.getRequest = function(buttonClick) {
		if($scope.isMobileView) {
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
		} else {
			if(buttonClick === 'biamaPage') {
				$window.location.href = '/BiAMa/biamaPage?userName=' + $scope.idUserLoggerIn + '&redirect';
			}
	
			if(buttonClick === 'whereWeAre') {
				$window.location.href =  '/BiAMa/whereWeAre?userName=' + $scope.idUserLoggerIn + '&redirect';
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
		}
		
		if(buttonClick === 'notification') {
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
	
	/* init CompareController  */
	$scope.viewType();
	$scope.initData();
	$scope.getAllRequests();
	$scope.validateUserLoggedIn();
    
}])
app.factory("CompareMyMaterialService", function($q, $http, $timeout){
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

app.factory("UserCompareService", function($q, $http, $timeout){
    
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

	return {
		getUsers: getUsers
	};
});

app.factory("CompareMaterialService", function($q, $http, $timeout){
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