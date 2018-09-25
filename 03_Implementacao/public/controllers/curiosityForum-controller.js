
app.controller("CuriosityForumController", ['$scope', "$http", "CuriositiesService","CuriositiesMaterialService","CuriositiesBiamaService", "$window", "jQuery", function($scope, $http, CuriositiesService, CuriositiesMaterialService, CuriositiesBiamaService, $window){

  /* hide footer of index page because of click in buttons footer reload page */
  jQuery("#footerMainMobile").hide();
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
    $scope.nameclick='forum'
    $scope.loading=true;
    $scope.descriptionCuriosity=[];
    $scope.showCuriosity=true;
    $scope.showBigImage=false;
    $scope.resultSearch = [];
    $scope.showDetailsOfMaterial=false;
    $scope.miniSearchResults=false;  
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
  /* get materials curiosities to display */
  $scope.getAllRequests = function() {

    var getCuriosities = CuriositiesService.getCuriosities(function(infoCuriosities){});
    getCuriosities.then(function(result) {
      $scope.loading = false;
      var data=result.data.curiosityDetails;
      for(var index=0; index<data.length; ++index){
        $scope.descriptionCuriosity.push(data[index]);
      }
    });
  }

	/* redirect to homepage with arrow */
  $scope.goToHomePage = function() {
    if($scope.idUserLoggerIn !== undefined) {
      if($scope.showCuriosityDetails || $scope.showBigImage) {
        if(!$scope.isMobileView) {
          $window.location.href = '/BiAMa/curiositiesForum?userName=' + $scope.idUserLoggerIn + '&redirect';
        } else {
          $window.location.href = '/BiAMa/curiositiesForumMobile?userName=' + $scope.idUserLoggerIn;
        }
      } else {
        if(!$scope.isMobileView) {
          location.href = '/BiAMa/forumPage?userName=' + $scope.idUserLoggerIn + '&redirect';

        } else {
          location.href = '/BiAMa/forumPageMobile?userName=' + $scope.idUserLoggerIn;

        }
      }
		} else {
      if($scope.showCuriosityDetails || $scope.showBigImage) {
				$window.location.href = '/BiAMa/curiositiesForum?userName=anonymous' + '&redirect';
      } else {
        location.href = '?username=' + 'anonymous';
      }
		}
  }

  /* open details of curiosity when clicks on material curiosity */ 
  $scope.openDetailsCuriosity = function(image) {
    for(var index=0; index<$scope.descriptionCuriosity.length; ++index) {
      if($scope.descriptionCuriosity[index].image === image){
          $scope.curiosityInfo={
            'image':$scope.descriptionCuriosity[index].image,
            'description': $scope.descriptionCuriosity[index].descriptionCuriosity,
            "curiosity": index+1
          }
          $scope.showCuriosityDetails=true;
          $scope.showCuriosity=false;
          break;
      }
    }
  }

  /* open big image of curiosity (large image size) */
  $scope.openBigImage = function(image) {
    $scope.showBigImage=true;
    $scope.showCuriosityDetails=false;
    $scope.bigImage=image;
  }

  /* close the image that are opened */
  $scope.closeCuriosityImage = function() {
    $scope.showBigImage=false;
    $scope.showCuriosityDetails=true;
  }
  /* -------------- END DESKTOP & MOBILE -------------- */

  /* -------------- INIT MOBILE -------------- */
  /* open material of small search result */
  $scope.openMaterial = function(material) {
    $scope.miniSearchResults=false;
    $scope.showDetailsOfMaterial=true;
    $scope.showMaterials=false;
    $scope.openedMaterial=material;
    $scope.showLocation=false;
    $scope.showAllQuestions=false;
    $scope.showCuriosity=false;
  }

  /* close material that are opened */
  $scope.closeMaterial = function(){
    $scope.miniSearchResults=false;
    $scope.showDetailsOfMaterial=false;
    $scope.showLocation=true;
    $scope.showForum = true;
    $scope.showAllQuestions=true;
    $scope.showQuestionDetails=false;
    $scope.showCuriosity=true;
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
    $scope.showLocation=true;
    $scope.showForum = true;
    $scope.showAllQuestions=true;
    $scope.showQuestionDetails=false;
    $scope.showCuriosity=true;
  }

  /* action of click button "Ok" present on small search line */
  $scope.initMiniSearch = function() {
    $scope.resultSearch=[];
    var inputMiniValue = jQuery("#miniSearch").val(); 	
    var inputMini = inputMiniValue.toLowerCase();
    var getMaterials = CuriositiesMaterialService.getMaterialComparation(function(infoMaterial){});
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
          } else {
            $scope.showInitSearch=false;
            $scope.miniSearchResults = true;
            $scope.showCategory=true;
            $scope.showMaterialDetails=false;
            $scope.showLocation=false;
            $scope.showForum = false;
            $scope.showAllQuestions=false;
            $scope.showQuestionDetails=false;
            $scope.showCuriosity=false;
            $scope.showSearch=false;
            $scope.noResultsOnSearch=false;
          }
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
    
    $scope.getAllUsers = CuriositiesBiamaService.getUsers(function(users){});
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
    
  /* init CuriosityForumController  */
	$scope.viewType();
	$scope.initData();
  $scope.getAllRequests();
  $scope.validateUserLoggedIn();
}])

app.factory("CuriositiesService", function($q, $http, $timeout){

  var getCuriosities = function() {
    var deferred = $q.defer();

    $http.get('/curiosities').then(successCallback, errorCallback);

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
    getCuriosities: getCuriosities
  };
});

app.factory("CuriositiesMaterialService", function($q, $http, $timeout){
  var getMaterialComparation = function() {
      var deferred = $q.defer();

      $timeout(function() {
      deferred.resolve($http.get('/compareMaterials'));
      }, 4000);

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

app.factory("CuriositiesBiamaService", function($q, $http, $timeout){
    
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