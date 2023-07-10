define( ["qlik", "jquery", "./properties", "text!./template.html", "text!./modalLayer.html", "text!./infoIconStyle.css",
			"text!./tooltipAndModalStyle.css", "text!./watermarkStyle.css"],
	function ( qlik, $, props, template, modalLayer, iconCss, tooltipModalCss, watermarkCss) {
		"use strict";
		$("<style>").html(iconCss).appendTo("head");
		$("<style>").html(tooltipModalCss).appendTo("head");
		$("<style>").html(watermarkCss).appendTo("head");
		function handleCustomDropdownProps(propsObj, propName, dropdownClass, propertiesApi) {
			let selectTag = $(dropdownClass);
			if(typeof(selectTag) !== undefined) {
				let parent;
				let child = propsObj;
				let finalKey;
				for (const key of propName.split('.')) {
					parent = child;
					if(!parent[key]) {
						parent[key] = {};
					}
					child = parent[key];
					finalKey = key;
				}
				if(!child) {
					child = '';
				}
				selectTag.val(child);
				selectTag.on('change', function(e) {
					console.log(e);
					parent[finalKey] = selectTag.val();
          			propertiesApi.setProperties(propsObj);
				});
			}
		}
		/*Extract properties related to icon style and apply to the icon's css*/
		function applyIconStyles(icon, layout) {
			//if(layout.iconprops.colorStr) {
			//	icon.css('color', layout.iconprops.colorStr);
			//}
			icon.css('color', typeof layout.iconprops?.colorStr !== 'undefined' ? layout.iconprops?.colorStr : '#000');
			if(layout.iconprops?.opacity || layout.iconprops?.opacity === 0) {
				icon.css('opacity', layout.iconprops.opacity);
			}
			if(layout.iconprops?.topOffset || layout.iconprops?.topOffset === 0) {
				icon.parent().css('top', layout.iconprops.topOffset + 'px');
			}
			if(layout.iconprops?.rightOffset || layout.iconprops?.rightOffset === 0){
				icon.parent().css('right', layout.iconprops.rightOffset + 'px');
			}
			if(layout.iconprops?.iconSize > 0) {
				icon.css('font-size', layout.iconprops.iconSize + 'px');
			}
		}

		function displayContainedObject(scope, layout) {
			/*check for changes to object reference for container */
			let nextContainerObject = scope.getContainerProps(layout);
			if(nextContainerObject.objectId !== scope.containerId) {
				scope.container = nextContainerObject;
				scope.containerId = nextContainerObject.objectId;
			}
			else if(!scope.initialDisplay) {
				return;
			}
			if(scope.containerId) {
				qlik.currApp().getObject(
					$('#' + scope.localId), scope.containerId
				).then(function(model){
					scope.initialDisplay = false;
				});
			}
		}

		function displayWatermark($element, layout) {
			let watermarkContainer = $element.find('.tooltipContainer-watermarkContainer');
			if(layout.watermarkprops?.enabled) {
				let watermarkTag = watermarkContainer.find('.tooltipContainer-watermark');
				watermarkTag.html(layout.watermarkprops.textStr || '');
				watermarkTag.css('color', layout.watermarkprops.textColor || '#000');
				watermarkTag.css('font-size', (layout.watermarkprops.textSize > 0 ? layout.watermarkprops.textSize : 24) + 'px');
				watermarkTag.css('opacity', typeof layout.watermarkprops.textOpacity !== 'undefined' ? layout.watermarkprops.textOpacity : 0.4);
				if(layout.watermarkprops?.rotation || layout.watermarkprops?.rotation === 0) {
					watermarkTag.css('transform', 'rotate(' + layout.watermarkprops.rotation + 'deg)');
				}
				watermarkContainer.show();
			}
			else {
				watermarkContainer.hide();
			}
		}

		function setTooltipOverflow() {
			$('.tooltipContainer-tooltip').parents('.qv-inner-object').css('overflow', 'visible');
		}

		function toggleHoverButtonZIndex($element, moveUp) {
			let newIdx = moveUp ? 7 : 0;
			$element.parents('.object-wrapper').find('.qv-object-nav').css('z-index', newIdx);
		}

		function toggleExtensionZIndex($element, moveUp) {
			let newIdx = moveUp ? 2 : 1;
			$element.parents('.qv-object').css('z-index', newIdx);
		}

		function applyTooltipProps(icon, $element, layout) {
			if(layout.tooltipprops?.type === 'tip' || layout.tooltipprops?.type === 'both') {
				let tooltipClass = $element.find('.tooltipContainer-tooltip');
				let tooltipTextClass = tooltipClass.find('.tooltipContainer-tooltiptext');
				//disable modal functions if tooltip only
				if(layout.tooltipprops?.type === 'tip') {
					icon.off('click');
					icon.removeClass('infoIconModal');
				}

				if(!layout.tooltipprops?.tipText) {
					tooltipTextClass.html('&nbsp;&nbsp;');
				}else {
					tooltipTextClass.html(layout.tooltipprops?.tipText);
				}
				//clear positioning classes, re-add based on props
				tooltipClass.removeClass();
				tooltipTextClass.removeClass();
				tooltipClass.addClass('tooltipContainer-tooltip');
				tooltipTextClass.addClass('tooltipContainer-tooltiptext');
				switch(layout.tooltipprops?.tipPos) {
					case 'u': 
						tooltipTextClass.addClass('tooltipContainer-tooltiptext-top');
						break;
					case 'd':
						tooltipTextClass.addClass('tooltipContainer-tooltiptext-bottom');
						break;
					case 'l': 
						tooltipTextClass.addClass('tooltipContainer-tooltiptext-left');
						break;
					default:
						tooltipTextClass.addClass('tooltipContainer-tooltiptext-right');
						break;

				}
				setTooltipOverflow();
				$element.find('.tooltipContainer-tooltip').hover(function() {
					//on hover, bring extension z-index forward, and move qlik hover button z-index back
					toggleHoverButtonZIndex($element, false);
					toggleExtensionZIndex($element, true);
				}, function() {
					toggleHoverButtonZIndex($element, true);
					toggleExtensionZIndex($element, false);
				});
			}
		}

		function applyModalProps(icon, scope, layout) {
			if(layout.tooltipprops?.type === 'modal' || layout.tooltipprops?.type === 'both') {
				let $modal = $('#modal' + scope.localId);
				if($modal.is(':empty')) {
					scope.attachModal();
					$modal = $modal = $('#modal' + scope.localId);
				}
				if(layout.tooltipprops?.type === 'modal') {
					//disable tooltip if modal only
					icon.parent().off('hover');
				}
				icon.addClass('infoIconModal');
				let titleElement = $modal.find('.lui-dialog__title');
				if(layout.tooltipprops?.modalTitle) {
					titleElement.html(layout.tooltipprops.modalTitle);
				}
				else {
					titleElement.html('');
				}
				let textElement = $modal.find('.lui-dialog__body');
				if(layout.tooltipprops?.modalText) {
					textElement.html(layout.tooltipprops?.modalText);
				}
				else {
					textElement.html('');
				}
				$modal.find('.modal-close').click(function() {
					$modal.hide();
				});
				icon.on('click', function() {
					$modal.show();
				});
			}
		}

		let extObj =  {
			template: template,
			support: {
				//snapshot: true,
				//export: true,
				//exportData: false
			},
			
			definition: props,
			
			paint: function ($element, layout) {
				const myInfoIcon = $element.find(".infoIcon");
				applyIconStyles(myInfoIcon, layout);
				let backendApi = this.backendApi;
				this.backendApi.getProperties().then(function(reply) {
					reply.onChangeHandler = function() {
						handleCustomDropdownProps(reply, 'containerprops.masterItem', '.container-dropdown > select', backendApi);
					}
					backendApi.setProperties(reply);
				});

				displayContainedObject(this.$scope, layout);
				applyTooltipProps(myInfoIcon, $element, layout);
				applyModalProps(myInfoIcon, this.$scope, layout);
				displayWatermark($element, layout);
				return qlik.Promise.resolve();
			},
			controller: ['$scope', function ( $scope) {
				//add your rendering code here
				$scope.getContainerProps = function(layout) {
					let containerObject = {};
					let objectId = layout.containerprops?.masterItem;
					if(!objectId && layout.containerprops?.objectId) {
						objectId = layout.containerprops.objectId;
					}
					if(objectId) {
						containerObject = {
							objectId: objectId,
							title: layout.containerprops.title,
							index: 1
						}
					}
					return containerObject;	
				}
				$scope.container = $scope.getContainerProps($scope.layout);
				$scope.containerId = $scope.container?.objectId;
				$scope.hasContainer = function() {
					return !!$scope.containerId;
				}
				$scope.localId = Math.floor(Math.random() * 16777215).toString(16);
				$scope.initialDisplay = true;
				console.log('container.objectId', $scope.containerId);
				console.log('$scope', $scope);
				let modalDiv = $('<div id="modal' + $scope.localId + '"></div>');
				modalDiv.html(modalLayer);
				modalDiv.addClass('infoModalLayer');
				console.log('Modal', modalDiv);
				$scope.attachModal = function() {
					$('body').append(modalDiv);
				}
				$scope.attachModal();
				$('#modal'+$scope.localId).hide();
			}]
		};

		return extObj;

	} );

