define( ["qlik", "jquery", "./properties", "text!./template.html", "text!./infoIconStyle.css"],
	function ( qlik, $, props, template, iconCss) {
		"use strict";
		$("<style>").html(iconCss).appendTo("head");
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
				const myInfoIcon = $element.find(".infoIcon");
				if(layout.iconprops.colorStr) {
					myInfoIcon.css('color', layout.iconprops.colorStr);
				}
				if(layout.iconprops.opacity) {
					myInfoIcon.css('opacity', layout.iconprops.opacity);
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
			}]
		};

		return extObj;

	} );

