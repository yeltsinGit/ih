var directModule = angular.module('starter.directives', []);

directModule.directive("ihBesttvPlayer",function($http, $q){
	function _loadScripts () {
		var deferred = $q.defer();
		$http({
			method: 'JSONP',
			url: 'http://admin.brightcove.com/js/BrightcoveExperiences.js',
			dataType: 'script',
			headers: {
				'Content-type': 'application/x-javascript'
			}
		}).success(function(data){
			console.log('get succeded. Data is: ');
			console.log(data);
			deferred.resolve();
		}).error(function (err) {
			console.log('fail: error is: ' + err);
			deferred.reject();
		});

		return deferred.promise;
	}

	_loadScripts().finally(function ($window) {
		console.log('in finally');
		brightcove.createExperiences();
	
		var player, APIModules, videoPlayer;
		$window.onTemplateLoad = function (experienceID){
			player = brightcove.api.getExperience(experienceID);
			APIModules = brightcove.api.modules.APIModules;
		};
	 
		$window.onTemplateReady = function (evt){
			videoPlayer = player.getModule(APIModules.VIDEO_PLAYER);
			videoPlayer.play();
		};
	});

	return {
		restrict: 'E',
		templateUrl: 'templates/besttv-player.html',
		scope: {
			vid: '@vid',
			width: '@width',
			height: '@height'
		}
	};
});

directModule.directive('ihPie', function ($compile, $timeout, $ihCache) {
	return {
		restrict: 'E',
		templateUrl: 'templates/pie.html',
		link: function($scope, element, attrs) {
			$scope.title = 'Menu';
			$scope.selectedSlice = 0;
			$scope.shouldShowPie = true;
			$scope.sliceAnimState = 'show';
			$scope.slices = [
				{ index: 1, title: 'Favorites', icon: 'star' },
				{ index: 2, title: 'RSS', icon: 'radio-waves' },
				{ index: 3, title: 'Search', icon: 'ios7-search-strong' },
				{ index: 4, title: 'Categories', icon: 'android-sort' },
				{ index: 5, title: 'Opinions', icon: 'person-stalker' },
				{ index: 6, title: 'Horoscope', icon: 'aperture' },
				{ index: 7, title: 'Weather', icon: 'ios7-partlysunny' },
				{ index: 8, title: 'Share', icon: 'android-share' }
			];
			$scope.onSliceClick = function ($event, $index) {
				var el = angular.element($event.target);
				if (el) {
					if ($ihCache.get('isLastSliceClicked')) {
						$ihCache.put('isLastSliceClicked', false);
						return;
					}

					$scope.title = $scope.slices[$index].title;
					$scope.selectedSlice = $index + 1; // starting from 1		
				}
			};

			/* hack: on last slice wrapper click, trigger first slice click */
			$scope.onSliceWrapperClick = function ($event, $index) {
				var el = angular.element($event.target),
					isLastSliceClicked = el.attr('class').indexOf('ihPieSliceInner-8_8') !== -1,
					isIconClicked = el.attr('class').indexOf('icon') !== -1;

				if (isLastSliceClicked) {
					$ihCache.put('isLastSliceClicked', true);
				}
				if ($index == 7 && !isIconClicked) {
					$timeout(function() {
						angular.element(document.querySelector('.ihPieSliceInner-1_8')).triggerHandler('click');
					}, 0);
				}
			};

			// var markup = "<input type='text' ng=model='sampleData'/> {{sampleData}} <br/>";
			// angular.element(element).html($compile(markup)(scope));
			// console.log($compile(markup)(scope));

			$scope.$on('$destroy', function() {
				$scope.modal.remove();
			});
			$scope.$on('modal.hidden', function() {
				$scope.sliceAnimState = 'hide';
				$scope.selectedSlice = 0;
				$timeout(function() {
					$scope.shouldShowPie = false;
				}, 200, false);
			});
			$scope.$on('modal.removed', function() {
				console.log('in modal.removed');
			});
			$scope.$on('modal.shown', function() {
				$scope.shouldShowPie = true;
				$scope.sliceAnimState = 'show';
				$scope.title = 'Menu';
			});
		}
	};
});

directModule.directive('ihSplashScreen', function ($ihREST, $timeout, $state, $ihUtil, $ihCache, $ihHomepageSrvc) {
	return {
		restrict: 'E',
		template: '<div class="ihSplash" ng-show="showLoading === true"><i class="icon ion-loading-c"></i></div>',
		link: function($scope, element, attrs) {
			var state = $state,
				$el = angular.element(element),
				articlesCache = $ihCache.get('articlesObj');

			$scope.showLoading = true;
			$ihREST.loadHomepageData().then(function (data) {
				var articles = $ihHomepageSrvc.buildArticlesObj(data);

				// cash articles object to prevent page reload
				if (!articlesCache || shouldRefreshCache) {
					$ihCache.put('splashShown', true);
					$ihCache.put('articlesObj', articles);
				}

				var $splash = angular.element($el.children()[0]);
				$splash.addClass('ihOpacity0');
				$scope.$broadcast('ihSplashScreenShown');

				/* Dismiss splash after 500ms */
				$timeout(function () {
					$scope.showLoading = false;
				}, 300);
			}, function () {
				$ihCache.put('splashShown', false);
				$scope.showLoading = false;

				state.go('app.error');
			});
		}
	};
});