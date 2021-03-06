var servModule = angular.module('starter.services', []);

servModule.factory('$ihCONSTS', function(){
	var url = {
		webDomain: 'http://www.israelhayom.co.il/',
		apiDomain: 'http://api.app.israelhayom.co.il/',
		key: '?key=nas987nh34',
		defaultCursorOffset: 30,
		limit: '&limit=',
		offset: '&offset=',
		q: '&q=',
		lang: {
			en: '&lang=en',
			he: '&lang=he'
		},
		callback: '&callback=JSON_CALLBACK'
	};
	url.defaultLimit = '&limit=' + url.defaultCursorOffset;
	url.homepage = url.apiDomain + 'homepage/android' + url.key + url.callback;
	url.rss = url.apiDomain + 'content/newsflash' + url.key + url.callback+ url.defaultLimit;
	url.rssSingle = url.apiDomain + 'content/newsflash/';
	url.article = url.apiDomain + 'content/article/';
	url.webArticle = url.webDomain + 'article/';
	url.comments = url.apiDomain + 'comment/';
	url.categories = url.apiDomain + 'category' + url.key + url.callback;
	url.category = url.apiDomain + 'category/';
	url.opinions = url.apiDomain + 'content/opinion' + url.key + url.callback + url.defaultLimit;
	url.opinion = url.apiDomain + 'content/opinion/';
	url.webOpinion = url.webDomain + 'opinion/';
	url.search = url.apiDomain + 'search' + url.key + url.callback + url.lang.he + url.defaultLimit;
	url.weatherWeekly = url.apiDomain + 'content/weather/week' + url.key + url.callback + url.lang.he;
	url.weatherDaily = url.apiDomain + 'content/weather/day' + url.key + url.callback + url.lang.he;
	url.horoscope = url.apiDomain + 'content/horoscope/week' + url.key + url.callback + url.lang.he;

	function _getOffsetString (cursor) {
		return this.url.offset + (cursor || 0).toString();
	}

	return {
		url: url,
		imageSizes: {
			default: '125x125',
			thumbnail: 'thumbnail',
			medium: 'medium',
			large: 'large',
			fullscreen: '700x430',
			s_100x70: '100x70',
			s_125x125: '125x125',
			s_237x98: '237x98',
			s_251x170: '251x170',
			s_296x122: '296x122',
			s_270x182: '270x182',
			s_324x192: '324x294',
			s_324x294: '324x294',
			s_433x295: '433x295',
			s_490x301: '490x301',
			s_700x430: '770x319'
		},
		getOffsetString: _getOffsetString
	};
});

servModule.factory('$ihValuesSrvc', function($ihLoadMoreValues, $ihCONSTS) {
	return {
		getLoadMoreCursor: function () {
			return $ihLoadMoreValues.cursor;
		},
		incrementLoadMoreCursor: function () {
			$ihLoadMoreValues.cursor += $ihCONSTS.url.defaultCursorOffset;
		},
		resetLoadMoreCursor: function () {
			$ihLoadMoreValues.cursor = 0;
		},
		incrementLoadMoreValues: function () {
			this.incrementLoadMoreCursor();
		},
		resetLoadMoreValues: function () {
			this.resetLoadMoreCursor();
		}
	};
});

servModule.factory('$ihCache', function($cacheFactory) {
	return $cacheFactory('data');
});

servModule.factory('$ihUtil', function($ionicLoading, $ionicPopup, $ihCONSTS, $window, $timeout){
	return {
		showLoading: function () {
			$ionicLoading.show({
				template: '<i class="icon ion-loading-c"></i> טוען...'
			});
		},
		hideLoading: function () {
			$ionicLoading.hide();
		},
		delayCacheLoad: function (callback, customDelay) {
			var self = this,
				delay = (customDelay && typeof customDelay === "number") ? customDelay : 300;

			/* Show loading for customDelay or 300ms by default */
			self.showLoading();
			$timeout(function () {
				callback();
				self.hideLoading();
			}, delay);
		},
		getWindowWidth: function () { return $window.innerWidth; },
		getWindowHeight: function () { return $window.innerHeight; },
		getFromLocalStorage: function (key) {return $window.localStorage.getItem(key); },
		setToLocalStorage: function (key, value) { return $window.localStorage.setItem(key, value); },
		getObjectFromLocalStorage: function (key) { return angular.fromJson($window.localStorage.getItem(key)); },
		setObjectToLocalStorage: function (key, value) { return $window.localStorage.setItem(key, angular.toJson(value)); },
		getFromSessionStorage: function (key) { return $window.sessionStorage.getItem(key); },
		setToSessionStorage: function (key, value) { return $window.sessionStorage.setItem(key, value); },
		isMobileDevice: function () {
			return typeof cordova === 'object';
		}
	};
});

servModule.factory('$ihCordovaUtil', function($cordovaVibration, $cordovaSocialSharing){
	return {
		isMobileDevice: function () {
			return typeof cordova === 'object';
		},
		vibrate: function (timeToVibrate) {
			if (!this.isMobileDevice()) { return; }

			var vibrTime = timeToVibrate || 50;
			$cordovaVibration.vibrate(vibrTime);
		},
		shareViaTwitter: function (message, image, link) {
			if (!this.isMobileDevice()) { return; }
			return $cordovaSocialSharing.shareViaTwitter(message, image, link);
		},
		shareViaWhatsApp: function (message, image, link) {
			if (!this.isMobileDevice()) { return; }
			return $cordovaSocialSharing.shareViaWhatsApp(message, image, link);
		},
		shareViaFacebook: function (message, image, link) {
			if (!this.isMobileDevice()) { return; }
			return $cordovaSocialSharing.shareViaFacebook(message, image, link);
		},
		// access multiple numbers in a string like: '0612345678,0687654321'
		shareViaSMS: function (message, number) {
			if (!this.isMobileDevice()) { return; }
			return $cordovaSocialSharing.shareViaSMS(message, number);
		},
		// TO, CC, BCC must be an array, Files can be either null, string or array
		shareViaEmail: function (message, subject, toArr, bccArr, file) {
			if (!this.isMobileDevice()) { return; }
			return $cordovaSocialSharing.shareViaEmail(message, subject, toArr, bccArr, file);
		},
		canShareVia: function (socialType, message, image, link) {
			if (!this.isMobileDevice()) { return; }
			return $cordovaSocialSharing.canShareVia(socialType, message, image, link);
		}

	};
});

servModule.factory('$ihPopupUtil', function($ionicPopup, $ionicModal){
	return {
		showPopup: function ($scope) {
			var myPopup = $ionicPopup.show({
				template: '<input type="password" ng-model="data.wifi"><div class="ihContent">Hello</div>',
				title: 'Enter Wi-Fi Password',
				subTitle: 'Please use normal things',
				scope: $scope,
				buttons: [
					{ text: 'Cancel' },
					{
						text: '<b>Save</b>',
						type: 'button-positive',
						onTap: function(e) {
							return 'success result data' + e;
						}
					},
				]
			});
			myPopup.then(function(res) {
				console.log('Tapped!', res);
			});
		},
		showModal: function ($scope) {
			if ($scope.modal) {
				this.removeModal($scope);
			}
			var ihModal = $ionicModal.fromTemplateUrl('templates/pie_drct.html', {
				scope: $scope,
				animation: 'no-animation',
				backdropClickToClose: false,
				hardwareBackButtonClose: true
			});

			ihModal.then(function(modal) {
				$scope.modal = modal;
				$scope.modal.show();
			});
		},
		hideModal: function ($scope) {
			// if ($scope.modal) {
			// 	$scope.modal.hide();
			// }
			this.removeModal($scope);
		},
		removeModal: function ($scope) {
			if ($scope.modal) {
				$scope.modal.remove();
				delete $scope.modal;
			}
		}

	};
});

servModule.factory('$ihLoadMoreSrvc',
	function ($ihREST, $ihRSSSrvc, $ihCategorySrvc, $ihOpinionsSrvc, $ihSearchSrvc, $ihValuesSrvc, $ihCache) {
	return {
		loadMoreResults: function (page, scope, pageid) {
			var results;
			scope.isLoadingInProgress = true;

			// get cashed search query in case we are in search page
			if (page === 'search') {
				pageid = $ihCache.get('searchObj').searchQuery;
			}
			$ihValuesSrvc.incrementLoadMoreValues();
			$ihREST.loadMoreData(page, pageid, $ihValuesSrvc.getLoadMoreCursor()).then(function (data) {

				switch (page) {
					case 'rss':
						data = $ihRSSSrvc.buildRSSObj(data);
						break;
					case 'category':
						data = $ihCategorySrvc.buildCategoryObj(data);
						break;
					case 'opinions':
						data = $ihOpinionsSrvc.buildOpinionsObj(data);
						break;
					case 'search':
						data = $ihSearchSrvc.buildSearchObj(data.results);
						break;
					default:
						break;
				}

				if (page === 'search') { // search has different data structure
					var resArrName = 'results';
					results = angular.copy(scope[resArrName]);
					scope[resArrName] = results.concat(data);
				} else {
					results = angular.copy(scope[page]);
					scope[page] = results.concat(data); // merge results array with new results
				}
				scope.isLoadingInProgress = false;

				/* Check if continue to show the button */
				if (data.length !== 30) {
					scope.isLoadMoreVisible = false;
				}

			}, function () {
				scope.isLoadingInProgress = false;
				scope.isLoadMoreVisible = false;
				// TODO: display a load more error message
			});
		}
	};
});

servModule.factory('$ihHomepageSrvc', function($ihCONSTS, $ihUtil, $timeout){
	return {
		/**
		* Each image url looks like: "sites/default/files/styles/[DEFAULT]/public/images/articles/2014/05/28/14012838254935_b.jpg"
		* We need to modify the url so it will look like:
		* "http://www.israelhayom.co.il/sites/default/files/styles/237x98/public/images/articles/2014/05/28/14012838254935_b.jpg"
		* To achieve this we need to first replace the "[DEFAULT]" with relevant image size,
		* and then add http://www.israelhayom.co.il/ to the beginning of the link
		*/
		fixImagePath: function (arr, size) {
			if (!arr) return;

			var imgSize = size ? size : $ihCONSTS.imageSizes.default,
				imagePath = '';
			angular.forEach(arr, function(item) {
				for (var i = 0; i < item.images.length; i++) {
					imagePath = item.images[i].path;
					imagePath = imagePath.replace('[DEFAULT]', imgSize);
					imagePath = $ihCONSTS.url.webDomain + imagePath;

					item.images[i].path = imagePath;
				}
			});
		},
		checkFavorites: function (arr) {
			if (!arr) return;

			var favoritesObj = $ihUtil.getObjectFromLocalStorage('favoritesObj');
			angular.forEach(favoritesObj, function (item) {
				for (var i = 0; i < arr.length; i++) {
					if (item.nid === arr[i].nid) {
						arr[i].inFavorites = true;
					}
				}
			});
		},
		checkFavoritesOther: function (arr) {
			if (!arr) return;

			var self = this;
			angular.forEach(arr, function (item) {
				self.checkFavorites(item.data);
			});
		},
		/* Get only elements that contain RSS */
		filterByRSS: function (arr) {
			if (!arr) return;

			return arr.filter(function (elem) {
				return elem.type === 'newsflash';
			});
		},
		divideIntoCategories: function (arr) {
			if (!arr) return;

			var categObj = {}, finalArr = [], currItemCategory = '', videoStr = 'video', opinionsStr = 'Opinions';

			/* Retrieve all distinct categories from arr */
			angular.forEach(arr, function (item) {
				if (item.categories) {
					// check for video category and skip it
					if (item.categories[0].toLowerCase() === videoStr) {
						currItemCategory = item.categories[1] || item.categories[0];
					} else {
						currItemCategory = item.categories[0];
					}
					if (!categObj[currItemCategory]) { categObj[currItemCategory] = []; }
				}
			});

			/* Fill categories with articles */
			angular.forEach(Object.keys(categObj), function (catItem, catIndex) {
				angular.forEach(arr, function (arrItem, arrIndex) {
					// check for video category and skip it
					if (arrItem.categories[0].toLowerCase() === videoStr) {
						currItemCategory = arrItem.categories[1] || arrItem.categories[0];
					} else {
						currItemCategory = arrItem.categories[0];
					}

					if (catItem === currItemCategory) {
						categObj[catItem].push(arrItem);
					}
				});
			});

			// If we have an 'Opinions' category, delete it for now
			if (categObj[opinionsStr]) {
				delete categObj[opinionsStr];
			}

			/* Transform categorized object into array + reorder items to match source array */
			angular.forEach(Object.keys(categObj), function (catName) {
				finalArr.push({
					name: catName,
					data: categObj[catName]
				});
			});

			return finalArr;

		},
		/* delete huge raw & tokened strings for better performance */
		buildSingleArticle: function (arr) {
			if (!arr) return;

			return arr.map(function(item) {
				var el = angular.copy(item);
				delete el.content.raw;
				delete el.content.tokened;

				return el;
			});
		},
		buildArticlesObj: function (data) {
			if (!data) return;

			var articlesObj = {
				primary: this.buildSingleArticle(data.primary),
				secondary: this.buildSingleArticle(data.secondary),
				news: this.buildSingleArticle(data.news),
				other: this.buildSingleArticle(data.other)
			};

			this.fixImagePath(articlesObj.primary, $ihCONSTS.imageSizes.fullscreen);
			this.fixImagePath(articlesObj.secondary);
			this.fixImagePath(articlesObj.news);
			this.fixImagePath(articlesObj.other);
			articlesObj.rss = this.filterByRSS(data.excluded);
			articlesObj.other = this.divideIntoCategories(articlesObj.other);

			this.checkFavorites(articlesObj.secondary);
			this.checkFavorites(articlesObj.news);
			this.checkFavoritesOther(articlesObj.other);

			return articlesObj;
		},
		createKFAnimation: function(animName, contWidth) {
			var kfAnimation = document.createElement('style'),
				prefixes = ['-webkit-', '-moz-', '-ms-', '-o-', ''],
				rule = '',
				windowWidth = $ihUtil.getWindowWidth(),
				translOffset = contWidth + windowWidth;

			kfAnimation.type = 'text/css';

			angular.forEach(prefixes, function(prefix) {
				rule = document.createTextNode('@' + prefix + 'keyframes ' + animName + ' {'+
				'from { ' + prefix + 'transform: translate3d(-' + windowWidth + 'px, 0px, 0px); }'+
				'to { ' + prefix + 'transform: translate3d(' + translOffset +  'px, 0px, 0px); }'+
				'}');
				kfAnimation.appendChild(rule);
			});

			document.getElementsByTagName("head")[0].appendChild(kfAnimation);
		},
		animateRSS: function() {
			var self = this;

			$timeout(function () {
				var $rssContainer = document.querySelector('.ihRSSContainer'),
					$rssContainerWidth = $rssContainer.offsetWidth,
					$elem = angular.element($rssContainer),
					animName = 'ihMarquee',
					windowWidth = $ihUtil.getWindowWidth(),
					finalWidth = $rssContainerWidth + (2 * windowWidth), /* + 2*window width because slide offset*/
					rowReadCoeff = parseInt(windowWidth / 40, 10), /* every 50 seconds user reads a row */
					animDur = parseInt(finalWidth / windowWidth, 10) * rowReadCoeff;

				self.createKFAnimation(animName, $rssContainerWidth);
				$elem.css({
					visibility: 'visible',
					WebkitAnimation : animName + ' ' + animDur + 's linear infinite',
				});
			}, 1000);
		},
		resetRSSAnimation: function () {
			var $rssContainer = angular.element(document.querySelector('.ihRSSContainer'));
			$rssContainer.css({
				visibility: 'hidden',
				WebkitAnimation: ''
			});
		},
		initPullToRefresh: function (onRefreshCallback) {
			$timeout(function () {
				$('.ptr-wrapper').pullToRefresh({
					message: {
						pull: 'משוך לרענון...',
						release: 'חשרר לרענון...',
						loading: 'טוען...'
					},
					callback: function() {
						var def = $.Deferred();

						onRefreshCallback().then(function () {
							def.resolve();
						});

						return def.promise();
					}
				});

			}, 300, true);
		},
		clearPullToRefreshEvents: function () {
			$('.ptr-wrapper').find('.ptr-scrollable').off('touchstart touchmove touchend');
		}
	};
});

servModule.factory('$ihFavoritesSrvc', function($ihArticleSrvc){
	return {
		/* Get only elements that are in hebrew */
		removeFromFavorites: function (artCacheObj, favId) {
			if (!artCacheObj) return;
			var item;

			for (var prop in artCacheObj) {
				if (prop === 'rss') continue; // we don't want to check RSS

				if (artCacheObj[prop]) {
					for (var i = 0; i < artCacheObj[prop].length; i++) {
						item = artCacheObj[prop][i];
						if (item.nid == favId) {
							delete item.inFavorites;
						}
					}
				}
			}
		},
		setDefaultImageSize: function (favObj) {
			if (!favObj) return;

			angular.forEach(favObj, function (item) {
				if (item.images[0]) {
					item.images[0].path = $ihArticleSrvc.setDefaultImageSize(item.images[0].path);
				}
			});
		}
	};
});

servModule.factory('$ihRSSSrvc', function(){
	return {
		/* Get only elements that are in hebrew */
		buildRSSObj: function (rssArr) {
			if (!rssArr) return;
			var rssObj = [];

			angular.forEach(rssArr, function(item) {
				rssObj.push({
					text: item.content.title,
					date: item.date
				});
			});

			return rssObj;
		}
	};
});

servModule.factory('$ihCategoriesSrvc', function(){
	return {
		/* Get only elements that are in hebrew */
		filterByLangHeb: function (catObj) {
			if (!catObj) return;

			var retObj = {};

			for (var catName in catObj) {
				var catProps = catObj[catName];
				if (catProps.lang === 'he') {
					retObj[catName] = catProps;
				}
			}

			return retObj;
		},
		removeUnnecessaryCategories: function (catObj) {
			if (!catObj) return;

			var catToRemove = ['מבזקים', 'דעות', 'הורוסקופ', '[אחר]'];
			angular.forEach(catToRemove, function(item) {
				if (catObj[item]) delete catObj[item];
			});
		},
		prepareCategoriesObj: function (catObj) {
			catObj = this.filterByLangHeb(catObj);
			this.removeUnnecessaryCategories(catObj);

			return catObj;
		}
	};
});

servModule.factory('$ihCategorySrvc', function($ihCONSTS, $ihHomepageSrvc){
	return {
		/* delete huge raw & tokened strings for better performance */
		buildSingleCategory: function (arr) {
			if (!arr) return;

			return arr.map(function(item) {
				var el = angular.copy(item);
				delete el.content.raw;
				delete el.content.tokened;

				return el;
			});
		},
		buildCategoryObj: function (data) {
			if (!data) return;

			var categoryObj = data;
			$ihHomepageSrvc.fixImagePath(categoryObj);

			return categoryObj;
		}
	};
});

servModule.factory('$ihSearchSrvc', function($ihCONSTS, $ihHomepageSrvc, $ihOpinionsSrvc){
	return {
		checkForOpinions: function (arr) {
			if (!arr) return;

			angular.forEach(arr, function(item) {
				if (item.type === 'opinion') {
					item.content.intro = $ihOpinionsSrvc.fixOpinionIntro(item.content.intro);
				}
			});
		},
		buildSearchObj: function (data) {
			if (!data) return;

			var searchObj = data;
			$ihHomepageSrvc.fixImagePath(searchObj);
			this.checkForOpinions(searchObj);

			return searchObj;
		}
	};
});

servModule.factory('$ihPieSrvc',
function($ihCONSTS, $ihREST, $ihUtil, $q, $ihRSSSrvc, $ihSearchSrvc, $ihCategoriesSrvc, $ihArticleSrvc,
			$ihCategorySrvc, $ihOpinionsSrvc, $ihHoroscopeSrvc, $ihWeatherSrvc, $ihCache, $ihCordovaUtil){
	return {
		showLoading: function ($scope) {
			if ($scope.showLoading === false) { $scope.showLoading = true; }
		},
		hideLoading: function ($scope) {
			if ($scope.showLoading === true) { $scope.showLoading = false; }
		},
		showSearchInput: function ($scope) {
			if ($scope.showSearchInput === false) { $scope.showSearchInput = true; }
		},
		hideSearchInput: function ($scope) {
			if ($scope.showSearchInput === true) { $scope.showSearchInput = false; }
		},
		showShareOptions: function ($scope) {
			if ($scope.showShareOptions === false) { $scope.showShareOptions = true; }
		},
		hideShareOptions: function ($scope) {
			if ($scope.showShareOptions === true) { $scope.showShareOptions = false; }
		},
		showNoResultsMsg: function ($scope) {
			if ($scope.noResultsFlag === false) { $scope.noResultsFlag = true; }
		},
		hideNoResultsMsg: function ($scope) {
			if ($scope.noResultsFlag === true) { $scope.noResultsFlag = false; }
		},
		showConnErrorMsg: function ($scope) {
			if ($scope.connErrorFlag === false) { $scope.connErrorFlag = true; }
		},
		hideConnErrorMsg: function ($scope) {
			if ($scope.connErrorFlag === true) { $scope.connErrorFlag = false; }
		},
		showFullResult: function ($scope) {
			if ($scope.showFullResult === false) { $scope.showFullResult = true; }
		},
		hideFullResult: function ($scope) {
			if ($scope.showFullResult === true) { $scope.showFullResult = false; }
		},
		showBackLink: function ($scope) {
			if ($scope.showBackLink === false) { $scope.showBackLink = true; }
		},
		hideBackLink: function ($scope) {
			if ($scope.showBackLink === true) { $scope.showBackLink = false; }
		},
		getFavoritesData: function ($scope) {
			this.showLoading($scope);
			var favoritesCache = $ihUtil.getObjectFromLocalStorage('favoritesObj');
			$scope.noResultsFlag = favoritesCache && !Object.keys(favoritesCache).length;
			$scope.favorites = angular.copy(favoritesCache);
			this.hideLoading($scope);
		},
		getRSSData: function ($scope) {
			var self = this;

			self.showLoading($scope);
			var deferred = $q.defer();

			$ihREST.loadRSSData().then(function (data) {
				$scope.rss = $ihRSSSrvc.buildRSSObj(data);
				self.hideLoading($scope);

				deferred.resolve();
			}, function () {
				self.showConnErrorMsg($scope);
				deferred.reject();
				self.hideLoading($scope);
			});

			return deferred.promise;
		},
		getSearchData: function ($scope, query) {
			var self = this;

			self.showSearchInput($scope);
			if (!query) { return; }

			var deferred = $q.defer();
			self.showLoading($scope);
			self.hideSearchInput($scope);
			$ihREST.loadSearchResults(query).then(function (data) {

				var results = $ihSearchSrvc.buildSearchObj(data.results);
				$scope.searchResults = results;
				if ($scope.searchResults && !$scope.searchResults.length) { self.showNoResultsMsg($scope); }

				self.hideLoading($scope);
				$scope.backLinkText = 'חזרה לחיפוש';
				self.showBackLink($scope);
				deferred.resolve();
			}, function () {
				self.showConnErrorMsg($scope);
				$scope.backLinkText = 'חזרה לחיפוש';
				self.showBackLink($scope);
				deferred.reject();
				self.hideLoading($scope);
			});

			return deferred.promise;
		},
		getCategoriesData: function ($scope) {
			var self = this;

			var deferred = $q.defer();
			self.showLoading($scope);
			$ihREST.loadCategoriesData().then(function (data) {

				data = $ihCategoriesSrvc.prepareCategoriesObj(data);
				$scope.categories = angular.copy(data);

				self.hideLoading($scope);
				deferred.resolve();
			}, function () {
				self.showConnErrorMsg($scope);
				deferred.reject();
				self.hideLoading($scope);
			});

			return deferred.promise;
		},
		getOpinionsData: function ($scope) {
			var self = this;

			var deferred = $q.defer();
			self.showLoading($scope);
			$ihREST.loadOpinionsData().then(function (data) {
				var opinions = $ihOpinionsSrvc.buildOpinionsObj(data);
				$scope.opinions = opinions;

				self.hideLoading($scope);
				deferred.resolve();
			}, function () {
				self.showConnErrorMsg($scope);
				deferred.reject();
				self.hideLoading($scope);
			});

			return deferred.promise;
		},
		getHoroscopeData: function ($scope) {
			var self = this;

			var deferred = $q.defer();
			self.showLoading($scope);
			$ihREST.loadHoroscopeData().then(function (data) {

				var horObj = $ihHoroscopeSrvc.buildHoroscopeObj(data);
				if (horObj[0] && horObj[0].forecasts) {
					$scope.horoscope = angular.copy(horObj[0].forecasts); // we want results for 1 day only
				}

				self.hideLoading($scope);
				deferred.resolve();
			}, function () {
				self.showConnErrorMsg($scope);
				self.hideLoading($scope);
				deferred.reject();
			});

			return deferred.promise;
		},
		getWeatherData: function ($scope) {
			var self = this;

			var deferred = $q.defer();
			self.showLoading($scope);
			$ihREST.loadWeatherData().then(function (data) {

				$ihWeatherSrvc.prepareWeatherObj(data);
				$scope.weather = angular.copy(data[0]);

				deferred.resolve();
				self.hideLoading($scope);
			}, function () {
				self.showConnErrorMsg($scope);
				deferred.reject();
				self.hideLoading($scope);
			});

			return deferred.promise;
		},
		showFullHoroscope: function ($scope, item) {
			var self = this;

			self.clearResults($scope);
			$scope.fullResultText = item.forecast;
			$scope.backLinkText = 'חזרה להורוסקופ';
			self.showBackLink($scope);
			self.showFullResult($scope);
		},
		showShareData: function ($scope, state) {
			var self = this;
			
			if (state.current.name === 'app.articles' ||
				state.current.name === 'app.article' ||
				state.current.name === 'app.opinion') {
				self.showShareOptions($scope);
			} else {
				$scope.fullResultText = 'לא ניתן לשתף מתוך העמוד הזה. ניתן לשתף מתןך עמוד ראשי ,עמודי כתבות ודעות';
				self.showFullResult($scope);
			}
		},
		shareObject: function (state, obj, index) {
			var self = this, shareObj = {};

			if (state.current.name === 'app.articles') {
				var articlesCache = $ihCache.get('articlesObj'),
					mainArtcl = (articlesCache && articlesCache.primary && articlesCache.primary[0]) ? articlesCache.primary[0] : null;
				shareObj.link = $ihCONSTS.url.webArticle + mainArtcl.nid;
			} else if (state.current.name === 'app.article') {
				shareObj.link = $ihCONSTS.url.webArticle + state.params.articleId;
			} else if (state.current.name === 'app.opinion') {
				shareObj.link = $ihCONSTS.url.webOpinion + state.params.opinionId;
			} else {
				return;
			}

			switch (index) {
				case self.SHARE_OPTIONS.facebook:
					$ihCordovaUtil.shareViaFacebook(null, null, shareObj.link);
					break;
				case self.SHARE_OPTIONS.twitter:
					$ihCordovaUtil.shareViaTwitter(null, null, shareObj.link);
					break;
				case self.SHARE_OPTIONS.whatsApp:
					$ihCordovaUtil.shareViaWhatsApp(null, null, shareObj.link);
					break;
				case self.SHARE_OPTIONS.sms:
					$ihCordovaUtil.shareViaSMS(shareObj.link, null);
					break;
				case self.SHARE_OPTIONS.email:
					$ihCordovaUtil.shareViaEmail(shareObj.link, null, [], [], null);
					break;
				default:
					break;
			}
		},
		onShareOptionClick: function ($scope, index, state, obj) {
			var self = this;

			self.clearResults($scope);
			$scope.selectedSlice = self.SLICE_INDEXES.none;
			self.shareObject(state, obj, index);
		},
		goToCategory: function ($scope, catName) {
			var self = this;

			var deferred = $q.defer();
			self.clearResults($scope);
			self.showLoading($scope);
			$ihREST.loadCategoryData(catName).then(function (data) {

			// $scope.categoryName = catName;
			$scope.category = $ihCategorySrvc.buildCategoryObj(data);

				$scope.backLinkText = 'חזרה לקטגוריות';
				self.showBackLink($scope);
				self.hideLoading($scope);
				deferred.resolve();
			}, function () {
				self.showConnErrorMsg($scope);
				$scope.backLinkText = 'חזרה לקטגוריות';
				self.showBackLink($scope);
				self.hideLoading($scope);
				deferred.reject();
			});

			return deferred.promise;
		},
		goBack: function ($scope) {
			var self = this;

			switch ($scope.selectedSlice) {
				case self.SLICE_INDEXES.horoscope:
					self.hideBackLink($scope);
					self.hideFullResult($scope);
					self.getHoroscopeData($scope);
					break;
				case self.SLICE_INDEXES.search:
					if ($scope.searchResults && $scope.searchResults.length > 0) {
						$scope.searchResults = []; // hide search results
					} else {
						self.hideNoResultsMsg($scope);
					}
					self.hideConnErrorMsg($scope);
					self.hideBackLink($scope);
					self.showSearchInput($scope);
					break;
				case self.SLICE_INDEXES.categories:
					if ($scope.category && $scope.category.length > 0) { $scope.category = []; } // hide category results
					self.hideConnErrorMsg($scope);
					self.hideBackLink($scope);
					self.getCategoriesData($scope);
					break;
				default:
					break;
			}
		},
		clearResults: function ($scope, exceptResult) {
			if ($scope.results && $scope.results.length > 0) { $scope.results = []; }
			if ($scope.rss && $scope.rss.length > 0) { $scope.rss = []; }
			if ($scope.favorites && Object.keys($scope.favorites).length > 0) { $scope.favorites = {}; }
			if ($scope.showSearchInput && $scope.showSearchInput === true) { $scope.showSearchInput = false; }
			if ($scope.showShareOptions && $scope.showShareOptions === true) { $scope.showShareOptions = false; }
			if ($scope.showLoading && $scope.showLoading === true) { $scope.showLoading = false; }
			if ($scope.noResultsFlag && $scope.noResultsFlag === true) { $scope.noResultsFlag = false; }
			if ($scope.connErrorFlag && $scope.connErrorFlag === true) { $scope.connErrorFlag = false; }
			if ($scope.showFullResult && $scope.showFullResult === true) { $scope.showFullResult = false; }
			if ($scope.showBackLink && $scope.showBackLink === true) { $scope.showBackLink = false; }
			if ($scope.fullResultText && $scope.fullResultText.length > 0) { $scope.fullResultText = ''; }
			if ($scope.searchResults && $scope.searchResults.length > 0) { $scope.searchResults = []; }
			if ($scope.categories && Object.keys($scope.categories).length > 0) { $scope.categories = {}; }
			if ($scope.category && $scope.category.length > 0) { $scope.category = []; }
			if ($scope.opinions && $scope.opinions.length > 0) { $scope.opinions = []; }
			if ($scope.horoscope && $scope.horoscope.length > 0) { $scope.horoscope = []; }
			if ($scope.weather && $scope.weather.length > 0) { $scope.weather = []; }
		},
		SLICE_INDEXES: {
			none: 0,
			favorites: 1,
			rss: 2,
			search: 3,
			categories: 4,
			opinions: 5,
			horoscope: 6,
			weather: 7,
			share: 8
		},
		SHARE_OPTIONS: {
			facebook: 0,
			twitter: 1,
			whatsApp: 2,
			sms: 3,
			email: 4
		}
	};
});

servModule.factory('$ihWeatherSrvc', function(){
	return {
		removeUnnItems: function (arr) {
			if (!arr) return;

			angular.forEach(arr, function (item) {
				if (item.weather && item.weather.length > 1) {
					item.weather.splice(1, item.weather.length); // remove all unneccesary weather items except first
				}
			});
		},
		removeWeek7thItem: function (arr) {
			if (!arr) return;

			angular.forEach(arr, function (item) {
				if (item.weather.length == 7) {
					item.weather.splice(0, 6); // remove all unneccesary weather items except first
				}
			});
		},
		moveForeignCitiesToEnd: function (arr) {
			if (!arr) return;

			var itemsToAdd = arr.splice(0, 3);
			angular.forEach(itemsToAdd, function (item) {
				arr.push(item);
			});
		},
		prepareWeatherObj: function (arr) {
			var self = this;

			angular.forEach(arr, function (item) {
				self.moveForeignCitiesToEnd(item);
			});
			self.removeUnnItems(arr[0]); // delete day weather duplications
			self.removeWeek7thItem(arr[1]); // for good UX look we need only 6 days
		}
	};
});

servModule.factory('$ihHoroscopeSrvc', function(){
	return {
		fillHorObjDates: function (horObj, arr) {
			if (arr[0] && arr[0].forecasts)
			angular.forEach(arr[0].forecasts, function (item) {
				horObj.push({
					date: item.date,
					forecasts: []
				});
			});
		},
		fillHorObjDatesData: function (horObj, arr) {
			angular.forEach(horObj, function (horItem, horIndex) {
				angular.forEach(arr, function (arrItem, arrIndex) {
					var arrItemName = arrItem.name;
					angular.forEach(arrItem.forecasts, function (subItem, subIndex) {
						if (horObj[horIndex].date === subItem.date) {
							if (subIndex < 12)  { // we want only 12 items
								horObj[horIndex].forecasts.push({
									name: arrItemName,
									forecast: subItem.forecast,
									icon: subItem.icon
								});
							}
						}

					});
				});
			});
		},
		checkArrForUnnItems: function (arr) {
			angular.forEach(arr, function (item) {
				if (item.forecasts.length > 6) {
					item.forecasts.splice(0, 6);
				}
			});
		},
		buildHoroscopeObj: function (arr) {
			if (!arr) return [];

			var horObj = [];

			// this.checkArrForUnnItems(arr);
			this.fillHorObjDates(horObj, arr);
			this.fillHorObjDatesData(horObj, arr);

			return horObj;
		}
	};
});

servModule.factory('$ihOpinionsSrvc', function($ihCONSTS, $ihHomepageSrvc){
	return {
		fixOpinionIntro: function (introStr) {
			if (!introStr) return '';

			var openDivRegex = new RegExp(/<div>/g), closeDivRegex = new RegExp(/<\/div>/g), ellipRegex = new RegExp(/&hellip;/g),
				openStrongRegex = new RegExp(/<strong>/g), closeStrongRegex = new RegExp(/<\/strong>/g),
				openPRegex = new RegExp(/<p>/g), closePRegex = new RegExp(/<\/p>/g),
				spanWithStyleRegex = new RegExp(/<span style="(.*?)">/g),
				openSpanRegex = new RegExp(/<span>/g), closeSpanRegex = new RegExp(/<\/span>/g),
				styleRegex = new RegExp(/style="(.*?)"/g);

			return introStr.replace(openDivRegex, '').replace(closeDivRegex, '').replace(ellipRegex, '...')
						.replace(openStrongRegex, '').replace(closeStrongRegex, '')
						.replace(openPRegex, '').replace(closePRegex, '')
						.replace(spanWithStyleRegex, '')
						.replace(openSpanRegex, '').replace(closeSpanRegex, '')
						.replace(styleRegex, '');
		},
		buildOpinionsObj: function (opArr) {
			if (!opArr) return;
			var opinionsObj = [], self = this;

			angular.forEach(opArr, function(item) {
				opinionsObj.push({
					author: item.author,
					date: item.date,
					images: item.images,
					nid: item.nid,
					content: {
						title: item.content.title,
						intro: self.fixOpinionIntro(item.content.intro)
					}
				});
			});
			$ihHomepageSrvc.fixImagePath(opinionsObj);

			return opinionsObj;
		}
	};
});

servModule.factory('$ihArticleSrvc', function($ihCONSTS, $ihUtil){
	return {
		setDefaultImageSize: function (imageUrl) {
			return imageUrl.replace($ihCONSTS.imageSizes.fullscreen, $ihCONSTS.imageSizes.default);
		},
		checkFavorite: function (article) {
			if (!article) return;

			var favoritesObj = $ihUtil.getObjectFromLocalStorage('favoritesObj');
			angular.forEach(favoritesObj, function (item) {
				if (item.nid === article.nid) {
					article.inFavorites = true;
				}
			});
		},
		addImageForFavorites: function (article) {
			if (!(article && article.images)) return;

			var newImage = {};
			newImage.path = this.setDefaultImageSize(article.mainImageSrc);

			article.images.push(newImage);
		},
		fixArticleImagePath: function (arr, imgSize) {
			if (!arr) return;

			angular.forEach(arr, function(item) {
				imagePath = item.path;
				imagePath = imagePath.replace('[DEFAULT]', imgSize || $ihCONSTS.imageSizes.fullscreen);
				imagePath = $ihCONSTS.url.webDomain + imagePath;

				item.path = imagePath;
			});
		},
		buildArticleHtml: function (articleObj, raw) {
			if (!articleObj) return;

			var rawHtml = angular.copy(raw.body),
				padding = 20,
				width = $ihUtil.getWindowWidth() - padding,
				height = parseInt( width * (9/16), 10 ),
				videos = articleObj.videos,
				images = articleObj.images;

			// replace [video] tags with video player directive
			angular.forEach(videos, function (item) {
				var videoDrct = '<ih-besttv-player width="' + width + '" height="' + height + '" vid="' + item.id + '"></ih-besttv-player>';
				// rawHtml = rawHtml.replace('[video]', videoDrct);

				/* Temporary disable videos as it requires payment on mobile */
				rawHtml = rawHtml.replace('[video]', '');
			});

			var imageRegex = new RegExp(/\<img (.*?)\>/),
				imageRegexGl = new RegExp(/\<img (.*?)\>/g),
				srcRegex = new RegExp(/src="(.*?)"/),
				styleRegex = new RegExp(/style="(.*?)"/),
				imgClass= 'class="full-image"',
				path = '';

			var srcRelatRegex = new RegExp(/src="\/sites\/default\/files/g),
				srcAbsolFixed = 'http://www.israelhayom.co.il/sites/default/files/styles/700x430/public',
				srcAbsolFixedVert = 'http://www.israelhayom.co.il/sites/default/files';

			// Check if image is vertical, and modify its src
			rawHtml = rawHtml.replace(imageRegexGl, function (match, p1, offset, string) {
				var imgWidth, imgHeight, isVerticalImg = false;
				var imgStylesArr = match.match(styleRegex)[1].split(';');

				// get the width and height values
				angular.forEach(imgStylesArr, function (item) {
					if (item.indexOf('width') > -1 ) {
						imgWidth = parseInt(item.match('[0-9]+')[0], 10);
					}
					if (item.indexOf('height') > -1 ) {
						imgHeight = parseInt(item.match('[0-9]+')[0], 10);
					}
				});

				if (imgWidth && imgHeight && (imgWidth / imgHeight < 1)) { isVerticalImg = true; }
				if (isVerticalImg) {
					match = match.replace(srcRelatRegex, imgClass + ' src="' + srcAbsolFixedVert);
				} else {

				}
				match = match.replace( styleRegex, ''); //delete inline styles

				return match;
			});

			// there are sill images with relative src path. We need to replace the "src" attr with the absolute path
			rawHtml = rawHtml.replace(srcRelatRegex, imgClass + ' src="' + srcAbsolFixed);

			// remove all "target="_blank" occurences
			var blankRegex = new RegExp(/target="_blank"/g);
			rawHtml = rawHtml.replace(blankRegex, '');

			// replace all "http://www.israelhayom.co.il" with app relative paths: 
			var pathRegex = new RegExp(/http:\/\/www.israelhayom.co.il\/article/g),
				artRelPath = '#/app/articles';
			rawHtml = rawHtml.replace(pathRegex, artRelPath);

			return rawHtml;
		},
		buildArticleObj: function (data) {
			if (!data) return;

			var articleObj = {
				videos: (data.videos && data.videos.items) ? data.videos.items : '',
				author: data.author,
				categories: data.categories,
				images: data.images,
				date: data.date,
				content: {
					intro: data.content.intro,
					title: data.content.title
				},
				type: data.type,
				nid: data.nid
			};


			if (articleObj && articleObj.type === 'opinion') {
				this.fixArticleImagePath(articleObj.images, $ihCONSTS.imageSizes.default);
			} else {
				this.fixArticleImagePath(articleObj.images);
			}
			// make first image main article image, and remove it from images array
			if (articleObj.images && articleObj.images.length > 0) {
				articleObj.mainImageSrc = articleObj.images[0].path;
				articleObj.images.shift();
			}

			articleObj.content.html = this.buildArticleHtml(articleObj, data.content.raw);
			this.checkFavorite(articleObj);

			return articleObj;
		}
	};
});

servModule.factory('$ihREST', function($http, $q, $ihCONSTS){
	return {
		loadData: function (url) {
			var deferred = $q.defer();
			console.log('loadData: attempt to get JSON from server..');

			$http.jsonp(url).success(function(data){
				console.log('loadData: requesting url: ' + url + ' succeded. Data is: ');
				console.log(data);
				deferred.resolve(data);
			}).error(function () {
				console.log('loadData: requesting url: ' + url + ' failed.');
				deferred.reject();
			});

			return deferred.promise;
		},
		loadHomepageData: function(){
			return this.loadData($ihCONSTS.url.homepage);
		},
		loadRSSData: function(cursor){
			return this.loadData($ihCONSTS.url.rss + $ihCONSTS.getOffsetString(cursor));
		},
		loadRSSSingleData: function(rssId){
			return this.loadData($ihCONSTS.url.rssSingle + rssId + $ihCONSTS.url.key + $ihCONSTS.url.callback);
		},
		loadArticleData: function (artId) {
			return this.loadData($ihCONSTS.url.article + artId + $ihCONSTS.url.key + $ihCONSTS.url.callback);
		},
		loadArticleComment: function (artId) {
			return this.loadData($ihCONSTS.url.comments + artId + $ihCONSTS.url.key + $ihCONSTS.url.callback);
		},
		loadCategoriesData: function () {
			return this.loadData($ihCONSTS.url.categories);
		},
		loadCategoryData: function (catName, cursor) {
			return this.loadData($ihCONSTS.url.category + catName.toLowerCase() + $ihCONSTS.url.key +
					$ihCONSTS.url.callback + $ihCONSTS.url.defaultLimit + $ihCONSTS.getOffsetString(cursor));
		},
		loadSearchResults: function (query, cursor) {
			return this.loadData($ihCONSTS.url.search + $ihCONSTS.getOffsetString(cursor) + $ihCONSTS.url.q + query);
		},
		loadOpinionsData: function (cursor) {
			return this.loadData($ihCONSTS.url.opinions + $ihCONSTS.getOffsetString(cursor) );
		},
		loadOpinionData: function (opId) {
			return this.loadData($ihCONSTS.url.opinion + opId + $ihCONSTS.url.key + $ihCONSTS.url.callback);
		},
		loadWeatherData: function (opId) {
			var promises = [
				this.loadData($ihCONSTS.url.weatherDaily),
				this.loadData($ihCONSTS.url.weatherWeekly)
			];

			return $q.all(promises);
		},
		loadHoroscopeData: function () {
			return this.loadData($ihCONSTS.url.horoscope);
		},
		loadMoreData: function (page, pageid, cursor) {
			switch (page) {
				case 'rss':
					return this.loadRSSData(cursor);
				case 'category':
					return this.loadCategoryData(pageid, cursor);
				case 'opinions':
					return this.loadOpinionsData(cursor);
				case 'search':
					return this.loadSearchResults(pageid, cursor);
			}
		}
	};
});