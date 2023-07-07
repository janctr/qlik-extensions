define( ["qlik", "jquery", "./properties", "text!./template.html", "text!./modalLayer.html", "text!./infoIconStyle.css", "text!./tooltipAndModalStyle.css"],
	function ( qlik, $, props, template, modalLayer, iconCss, tooltipModalCss) {
		"use strict";
		$("<style>").html(iconCss).appendTo("head");
		$("<style>").html(tooltipModalCss).appendTo("head");
		//let propsCache;
		/*function getMasterObjects() {
			return new Promise(function (res, rej) {
				qlik.currApp().getAppObjectList('masterobject', function (reply) {
					res(reply.qItems.map(
						({ qInfo: { qId }, qMeta: { title } }) => ({ label: title, value: qId })
					));
				});
			});
		*/
		/*async function getProperties() {
			const model = await qlik.currApp().getList('MasterObject');
			let masterOpts = model.layout.qAppObjectList.qItems.map(({ qInfo: { qId }, qMeta: { title } }) => ({ label: title, value: qId }));
			for(const option of masterOpts) {
				let myOption = $('<option></option>').text(option.label);
				myOption.attr('value', option.value);
				$('.container-dropdown > select').append(myOption);
			}
		}
		*/

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

		let extObj =  {
			template: template,
			support: {
				//snapshot: true,
				//export: true,
				//exportData: false
			},
			
			definition: props,
			
			paint: function ($element, layout) {
				console.log('$element', $element);
				const myInfoIcon = $element.find(".infoIcon");
				if(layout.iconprops.colorStr) {
					myInfoIcon.css('color', layout.iconprops.colorStr);
				}
				if(layout.iconprops.opacity) {
					myInfoIcon.css('opacity', layout.iconprops.opacity);
				}
				if(layout.iconprops.topOffset || layout.iconprops.topOffset === 0) {
					myInfoIcon.parent().css('top', layout.iconprops.topOffset + 'px');
				}
				if(layout.iconprops.rightOffset || layout.iconprops.rightOffset === 0){
					myInfoIcon.parent().css('right', layout.iconprops.rightOffset + 'px');
				}

				let backendApi = this.backendApi;
				this.backendApi.getProperties().then(function(reply) {
					reply.onChangeHandler = function() {
						handleCustomDropdownProps(reply, 'containerprops.masterItem', '.container-dropdown > select', backendApi);
					}
					backendApi.setProperties(reply);
				});

				let nextContainerObject = this.$scope.getContainerProps(layout);
				if(nextContainerObject.objectId !== this.$scope.containerId) {
					this.$scope.container = nextContainerObject;
					this.$scope.containerId = nextContainerObject.objectId;
				}
				console.log('localId: ', this.$scope.localId);
				if(this.$scope.containerId) {
					qlik.currApp().getObject(
						$('#' + this.$scope.localId), this.$scope.containerId
					);
				}

				if(layout.tooltipprops?.type === 'tip' || layout.tooltipprops?.type === 'both') {
					let tooltipClass = $element.find('.tooltipContainer-tooltip');
					let tooltipTextClass = tooltipClass.find('.tooltipContainer-tooltiptext');
					if(layout.tooltipprops?.type === 'tip') {
						myInfoIcon.off('click');
						myInfoIcon.removeClass('infoIconModal');
					}

					if(!layout.tooltipprops?.tipText) {
						tooltipTextClass.html('&nbsp;&nbsp;');
					}else {
						tooltipTextClass.html(layout.tooltipprops?.tipText);
					}

					tooltipClass.removeClass();
					tooltipTextClass.removeClass();
					tooltipClass.addClass('tooltipContainer-tooltip');
					tooltipTextClass.addClass('tooltipContainer-tooltiptext');
					switch(layout.tooltipprops?.tipPos) {
						case 'u': 
							tooltipClass.addClass('tooltipContainer-tooltip-top');
							tooltipTextClass.addClass('tooltipContainer-tooltiptext-top');
							break;
						case 'd':
							tooltipClass.addClass('tooltipContainer-tooltip-bottom');
							tooltipTextClass.addClass('tooltipContainer-tooltiptext-bottom');
							break;
						case 'l': 
							tooltipClass.addClass('tooltipContainer-tooltip-left');
							tooltipTextClass.addClass('tooltipContainer-tooltiptext-left');
							break;
						default:
							tooltipClass.addClass('tooltipContainer-tooltip-right');
							tooltipTextClass.addClass('tooltipContainer-tooltiptext-right');
							break;

					}
					setTooltipOverflow();
					$element.find('.tooltipContainer-tooltip').hover(function() {
						toggleHoverButtonZIndex($element, false);
						toggleExtensionZIndex($element, true);
					}, function() {
						toggleHoverButtonZIndex($element, true);
						toggleExtensionZIndex($element, false);
					});
				}
				if(layout.tooltipprops?.type === 'modal' || layout.tooltipprops?.type === 'both') {
					let $modal = $('#modal' + this.$scope.localId);
					if($modal.is(':empty')) {
						this.$scope.attachModal();
						$modal = $modal = $('#modal' + this.$scope.localId);
						console.log('$modal', $modal);
					}
					if(layout.tooltipprops?.type === 'modal') {
						myInfoIcon.off('hover');
					}
					myInfoIcon.addClass('infoIconModal');
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
					myInfoIcon.on('click', function() {
						console.log('click test');
						$modal.show();
					});
				}

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

