
app.controller("LibraryController", ['$scope', "$http","LibraryMaterialInfoService", "CategoryInfoService", "$sce", "$route", "FavoritesLibraryService", "LibraryMaterialService","LibraryBiamaService", "$window", "jQuery" ,function($scope, $http, LibraryMaterialInfoService, CategoryInfoService, $sce, $route, FavoritesLibraryService, LibraryMaterialService, LibraryBiamaService, $window){

	/* hide footer of index page because of click in buttons footer reload page */
	jQuery("#footerMain").hide();
	jQuery("#headerMain").hide();
	jQuery("#searchMain").hide();
	jQuery("#userDetailsMain").hide();
	jQuery("#divControllerMain").removeClass("divController")
	
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
		$scope.namePage='library';
		$scope.nameclick='library';
		$scope.showSearch = false;
		$scope.userDetails = false;
		$scope.loading = true;
		$scope.category = '';
		$scope.materialInfo = null;
		$scope.favoriteMaterial = false;
		$scope.locationMaterial = false;
		$scope.zoomInMaterial = false;
		$scope.pathURL='https://www.google.com/maps/';
		$scope.clickAddFavoriteMaterial=false;
		$scope.categories=[];
		$scope.resultSearch= [];
		$scope.loadingSearch = false;
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
	/* get information of materials to display materials */
	$scope.getAllRequests = function() {
		$scope.getMaterialInfo = LibraryMaterialInfoService.getMaterial(function(infoMaterial){});
		$scope.getCategoryInfo = CategoryInfoService.getCategory(function(infoCategory){});
		$scope.getMyFavorites = FavoritesLibraryService.getMyFavorites($scope.idUserLoggerIn,function(infoFavorites){});
	
		/* get information of material and of library - when i do get library */
		$scope.getMaterialInfo.then(function(result) {
			$scope.loading = false;
			var data=result.data.materialsCategories;
			$scope.materialsCategories=data;
			for(var index=0; index<$scope.materialsCategories.length; ++index){
				if(index<7){
					$scope.categories.push($scope.materialsCategories[index])
				} else {
					break;
				}
			}
		});

		/* get category of material */
		$scope.getCategoryInfo.then(function(result) {
			$scope.loading = false;
			var data=result.data.categoryDetails;
			$scope.categoryDetails=data;
		});

		/* get favorites material */
		$scope.getMyFavorites.then(function(result) {
			var data=result.data.favoriteDetails;
			$scope.favoriteDetails=data;
		});
	}
	
	/* redirect to homepage with arrow */
	$scope.goToHomePage = function() {
		if($scope.idUserLoggerIn !== undefined) {
			/* go to library categories */
			if($scope.showCategory){
				if(!$scope.isMobileView) {
					location.href = '/BiAMa/library?userName=' + $scope.idUserLoggerIn + '&redirect';
				} else {
					location.href = '/BiAMa/libraryMobile?userName=' + $scope.idUserLoggerIn;
				}
			} else {
				/* go to homepage */
				location.href = '?userName=' + $scope.idUserLoggerIn;
			}
		} else {
			
			if($scope.showCategory){
				location.href = '?userName=anonymous' + '&redirect';
			} else {
				location.href = '?username=' + 'anonymous';
			}
		}
	}

	/* open categories of library */
	$scope.openCategory = function(category) {
		$scope.showCategory = true;
		$scope.category = category;

		$scope.materialOfCategory=[];
		for(var index=0; index<$scope.categoryDetails.length; ++index) {
			if($scope.categoryDetails[index].category===category) {
				$scope.materialOfCategory.push($scope.categoryDetails[index]);
			}
		}
	}

	/* open details material */
	$scope.openDetailsMaterial = function(material) {
		for(var index=0; index<$scope.categoryDetails.length; ++index) {
			if($scope.categoryDetails[index].id === material.id){
				for(var indexFav=0; indexFav<$scope.favoriteDetails.length; ++indexFav) {
					if($scope.favoriteDetails[indexFav].material_id == material.id) {
						$scope.materialInfo={
							'idMaterial': $scope.categoryDetails[index].id,
							'image': $scope.categoryDetails[index].name,
							'category': $scope.categoryDetails[index].category,
							'description': $scope.categoryDetails[index].description,
							'isFavorite': true
						}
						break;
					} else {
						$scope.materialInfo={
							'idMaterial': $scope.categoryDetails[index].id,
							'image': $scope.categoryDetails[index].name,
							'category': $scope.categoryDetails[index].category,
							'description': $scope.categoryDetails[index].description,
							'isFavorite': false
						}
					}
				}
				if($scope.favoriteDetails.length === 0) {
					$scope.materialInfo={
						'idMaterial': $scope.categoryDetails[index].id,
						'image': $scope.categoryDetails[index].name,
						'category': $scope.categoryDetails[index].category,
						'description': $scope.categoryDetails[index].description,
						'isFavorite': false
					}
				}
				$scope.showMaterialDetails=true;
				break;
			}
		}
	}
	
	/* click on button of favorite material */
	$scope.clickFavorite = function(favoriteMaterial) {
		$scope.idFavoriteMaterial=0;
		
		for(var index=0; index<$scope.favoriteDetails.length; ++index) {
			
			if($scope.favoriteDetails[index].material_id===favoriteMaterial.idMaterial){
				$scope.favAlreadyExists=true;
			} else {
				$scope.favAlreadyExists=false;
			}
			if(index===$scope.favoriteDetails.length-1){
				$scope.idFavoriteMaterial=$scope.favoriteDetails[index].id_favorite+1;
			}
		}

		if($scope.materialInfo.isFavorite) {
			if($scope.confirmSession){
				$scope.materialInfo.isFavorite=false;
				/* update table of favorites to remove this favorite material */
				var data = {
					idFavorite: $scope.idFavoriteMaterial,
					idUser: -1,
					idMaterial: -1,
					idQuestion: -1
				};
				$scope.clickAddFavoriteMaterial=false;
				$http.post('/deleteFavoriteQuestion', data);
			}  else if(!$scope.confirmSession) {
				$scope.clickAddFavoriteMaterial=true;
			}

		} else {
			$scope.materialInfo.isFavorite=true;
			if($scope.confirmSession){
				if(!$scope.favAlreadyExists){
					var data = {
						idFavorite: $scope.idFavoriteMaterial,
						idUser: $scope.idUserLoggerIn,
						idMaterial: favoriteMaterial.idMaterial,
						idQuestion: -1
					};
					$scope.favoriteAlreadyExists=false;
					$http.post('/insertFavoriteQuestion', data);
				} else {
					$scope.favoriteAlreadyExists=true;
					setTimeout(function () {
						$scope.$apply(function(){
							$scope.showMaterialDetails=false;
						$scope.showCategory=false;
						});
					}, 2000);
				}
				
				$scope.clickAddFavoriteMaterial=false;
			} else if(!$scope.confirmSession) {
				$scope.clickAddFavoriteMaterial=true;
			}
		}
	}

	/* click on button of zoom in to zoom material */
	$scope.clickZoomIn = function(material) {
		if($scope.zoomInMaterial){
			$scope.zoomInMaterial = false;
		}else {
			$scope.zoomInMaterial = true;
			//ir buscar a imagem do material que se quer fazer zoom 
		}
	}

	/* click on button of location to locate material */
	$scope.clickLocation = function(material) {
		for(var index=0; index<$scope.materialsCategories.length; ++index) {
			if($scope.materialsCategories[index].material_id === material.idMaterial){
					$scope.locationsURL= $sce.trustAsResourceUrl($scope.pathURL + $scope.materialsCategories[index].location);
					$scope.descriptionLocation=$scope.materialsCategories[index].locationDescription;
					$scope.loading=false;
					break;
			}
		}
		if($scope.locationMaterial){
			$scope.locationMaterial = false;
		}else {
				$scope.locationMaterial = true;
		}
	}

	/* select school to open map of location on screen */
	$scope.selectSchool = function (locationSchool) {
		for(var index=0; index <$scope.materialsCategories.length; ++index) {
			if($scope.materialsCategories[index].locationDescription === locationSchool){
					$scope.locationsURL= $sce.trustAsResourceUrl($scope.pathURL + $scope.materialsCategories[index].location)
					$scope.descriptionLocation = $scope.materialsCategories[index].locationDescription;
					break;
			}
		}
	}

	/* close zoom in of material that are opened */
	$scope.closeZoomInMaterial = function() {
		$scope.zoomInMaterial = false;
	}

	/* resize iframe to screen size */
	$scope.expandIframe = function(){
		if($scope.zoomInIFrame){
			$scope.zoomInIFrame = false;
		}else {
			$scope.zoomInIFrame = true;
		}
	}

	$scope.reloadPage = function() {
		$route.reload();
	}

	/* get schools to show schools on options of material location */
	$scope.getSchools = function () {
		$scope.getSchoolsOfMaterial();
		if($scope.showSchools){
			$scope.showSchools = false;
		}else {
			$scope.showSchools = true;
		}
	}

	/* get schools of material is located */
	$scope.getSchoolsOfMaterial = function() {
		/* get schools of material */
		$scope.loadingSchool=true;
        var materialId = $scope.materialInfo.idMaterial;
        var getSchoolOfMaterial = LibraryMaterialInfoService.getSchoolOfMaterial(materialId, function(infoSchool){});
        getSchoolOfMaterial.then(function(result) {
			
            $scope.loadingSchool = false;
            var data=result.data.materialSchools;
            $scope.schools=data;
        });
	}
	/* -------------- END DESKTOP & MOBILE -------------- */

	/* -------------- INIT MOBILE -------------- */
	/* open material of small search result */
	$scope.openMaterial = function(material) {
		$scope.showDetailsOfMaterial=true;
		$scope.showMaterials=false;
		$scope.openedMaterial=material;
		$scope.miniSearchResults=false;
	}

	/* close material that are opened */
	$scope.closeMaterial = function(){
		$scope.miniSearchResults=false;
		$scope.showDetailsOfMaterial=false;
		$scope.zoomInMaterial=false;
		
		$scope.showCategory=false;
		$scope.showMaterialDetails=false;
		$scope.miniSearchResults=false;
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
		$scope.showCategory=false;
		$scope.showMaterialDetails=false;
	}

	/* action of click button "Ok" present on small search line */
	$scope.initMiniSearch = function() {
		$scope.resultSearch=[];
		var inputMiniValue = jQuery("#miniSearch").val(); 		
		var inputMini = inputMiniValue.toLowerCase();

		$scope.loadingSearch = true;
		$scope.showCategory = true;

		$scope.getMaterials = LibraryMaterialService.getMaterialComparation(function(infoMaterial){});
		$scope.getMaterials.then(function(result) {
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
				} else {
					$scope.showInitSearch=false;
					$scope.showSearch=false;
					$scope.miniSearchResults = true;
					$scope.noResultsOnSearch=false;
					$scope.showResultsOfMiniSearch=true;
					$scope.showCategory=true;
					$scope.showMaterialDetails=false;
				}
			}
			$scope.loadingSearch = false;
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

		$scope.getAllUsers = LibraryBiamaService.getUsers(function(users){});
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

	/* init LibraryController  */
	$scope.viewType();
	$scope.initData();
	$scope.getAllRequests();
    $scope.validateUserLoggedIn();

}])

app.factory("LibraryMaterialInfoService", function($q, $http, $timeout){
	
	var getSchoolOfMaterial = function(data) {
		var deferred = $q.defer();
	
		$http.get('/materialSchool', {params: {'data': data}}).then(successCallback, errorCallback);

		function successCallback(response){
			//success code
			$timeout(function() {
                deferred.resolve(response);
           }, 2000);
		}
		function errorCallback(error){
			//error code
			deferred.reject(status);
		}
	
		return deferred.promise;
	};
	  
	var getMaterial = function() {
		var deferred = $q.defer();

		$http.get('/materialsCategories').then(successCallback, errorCallback);

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
		getSchoolOfMaterial: getSchoolOfMaterial,
		getMaterial: getMaterial
	  };
});

app.factory("CategoryInfoService", function($q, $http, $timeout){
    
	var getCategory = function() {
		var deferred = $q.defer();

		$http.get('/categories').then(successCallback, errorCallback);

        function successCallback(response){
            //success code
			$timeout(function() {
                deferred.resolve(response);
           }, 2000); 
        }
        function errorCallback(error){
			//error code
			deferred.reject(status);
        }
	
		return deferred.promise;
	  };
	
	  return {
		getCategory: getCategory
	  };
});

app.factory("FavoritesLibraryService", function($q, $http, $timeout){
    
	var getMyFavorites = function(data) {
		var deferred = $q.defer();

		$http.get('/favorites', {params: {'data': data}}).then(successCallback, errorCallback);

		function successCallback(response){
			//success code
			$timeout(function() {
                deferred.resolve(response);
           }, 3000); 
		}
		function errorCallback(error){
			//error code
			deferred.reject(status);
		}
	
		return deferred.promise;
	  };

	  return {
			getMyFavorites: getMyFavorites
	  };
});

app.factory("LibraryMaterialService", function($q, $http, $timeout){
	var getMaterialComparation = function() {
		var deferred = $q.defer();

		$http.get('/compareMaterials').then(successCallback, errorCallback);

        function successCallback(response){
            //success code
			$timeout(function() {
                deferred.resolve(response);
           }, 3000); 
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

app.factory("LibraryBiamaService", function($q, $http, $timeout){
    
	var getUsers = function() {
		var deferred = $q.defer();

		$http.get('/users').then(successCallback, errorCallback);

        function successCallback(response){
            //success code
            $timeout(function() {
                deferred.resolve(response);
            }, 2000); 
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