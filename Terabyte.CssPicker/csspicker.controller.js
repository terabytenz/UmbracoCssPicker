angular.module("umbraco").controller("Terabyte.Css.Picker",
	function($scope) {
        var cssPrefix = $scope.model.config.cssPrefix;
        var cssFile = $scope.model.config.cssFile;

        var createLink = function(id, url) {
            var link = document.createElement('link');
            link.id = id;
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = url;
            return link;
        }

        var id = cssPrefix.substring(1) + "customCss";

        if(!angular.element('link[href="'+cssFile+'"]').length) {
            link = createLink(id, cssFile);
            link.onload = function(){
                //console.log("Loaded CSS for picker");
            };
            angular.element('head').append(link);
        }

        $scope.remove = function(){
            $scope.model.value = '';
        }


		$scope.choose = function(){
			UmbClientMgr.openAngularModalWindow({
                template: '/App_Plugins/Terabyte.CssPicker/csspickermodal.html',
                dialogData: {
                    cssPrefix: cssPrefix
                },
                callback: function(data){
                    $scope.model.value = data.css;
                }}); 
		};
	});

angular.module("umbraco").controller("Terabyte.Css.Modal",
	function($scope) {
		var collectedIcons = [];
        var cssPrefix = $scope.dialogData.cssPrefix;
        var prefixLength = cssPrefix.length - 1;

        for (var i = document.styleSheets.length - 1; i >= 0; i--) {
            var classes = document.styleSheets[i].rules || document.styleSheets[i].cssRules;
            
            if (classes !== null) {
                for(var x=0;x<classes.length;x++) {
                    var cur = classes[x];
                    if(cur.selectorText && cur.selectorText.indexOf(cssPrefix) === 0) {
                        var s = cur.selectorText.substring(1);
                        var hasSpace = s.indexOf(" ");
                        if(hasSpace>0){
                            s = s.substring(0, hasSpace);
                        }
                        var hasPseudo = s.indexOf(":");
                        if(hasPseudo>0){
                            s = s.substring(0, hasPseudo);
                        }

                        if(collectedIcons.indexOf(s) < 0){
                            var newIcon = {
                                name: s.substring(prefixLength),
                                css: s
                            };
                            collectedIcons.push(newIcon);
                        }
                    }
                }
            }
        }

		$scope.loaded = true;
		$scope.icons = collectedIcons;
		if (!collectedIcons.length) {
			$scope.error = 'No classes with css prefix of "'+cssPrefix+'" were found';
		}

		$scope.submitClass = function(icon){
				$scope.submit(icon);
			};
		
	});