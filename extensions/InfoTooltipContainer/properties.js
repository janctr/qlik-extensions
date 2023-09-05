// JavaScript
define(["qlik", './container'], function (qlik, getContainerOptions) {
	'use strict';
	//Container();
	const settingsProperties = {
		type: 'items',
		label: 'Container Appearance',
		items: {
			iconAppearance: {
				label: 'Icon Appearance',
				type: 'items',
				items: {
					iconColor: {
						type: 'string',
						label: 'Icon Color',
						expression: 'optional',
						ref: 'iconprops.colorStr',
						defaultValue: '#000000'
					},
					iconOpacity: {
						type: 'number',
						component: 'slider',
						label: 'Icon Opacity',
						ref: 'iconprops.opacity',
						min: 0,
						max: 1,
						step: 0.025,
						defaultValue: 0.4
					},
					iconPosition: {
						type: 'items',
						label: 'Icon Margins',
						items: {
							top: {
								label: 'Margin Top',
								type: 'integer',
								component: 'slider',
								ref: 'iconprops.topOffset',
								min: 0,
								max: 250,
								step: 1,
								defaultValue: 0
							},
							right: {
								label: 'Margin Right',
								type: 'integer',
								component: 'slider',
								ref: 'iconprops.rightOffset',
								min: 0,
								max: 250,
								step: 1,
								defaultValue: 0
							}
						}
					},
					iconSize: {
						type: 'integer',
						component: 'slider',
						label: 'Icon Size',
						ref: 'iconprops.iconSize',
						min: 1,
						max: 100,
						step: 1,
						defaultValue: 16
					}
				}
			},
			settings: {
				uses: 'settings'
			}
		}
	}
	const tooltipProperties = {
		type: 'items',
		label: 'Tooltip Settings',
		items: {
			tooltipType: {
				type: 'string',
				label: 'Tooltip Type',
				ref: 'tooltipprops.type',
				component: 'dropdown',
				options: [{
					value: 'tip',
					label: 'Hover Tooltip'
				}, {
					value: 'modal',
					label: 'Click Modal'
				}, {
					value: 'both',
					label: 'Tooltip and Modal'
				}],
				defaultValue: 'tip'
			},
			tooltipText: {
				type: 'string',
				label: 'Tooltip Text',
				expression: 'optional',
				ref: 'tooltipprops.tipText',
				show: function(e) {
					return !e.tooltipprops || e.tooltipprops?.type === 'tip' || e.tooltipprops?.type === 'both';
				}
			},
			modalTitle: {
				type: 'string',
				label: 'Modal Title',
				expression: 'optional',
				show: function(e) {
					return e.tooltipprops?.type === 'modal' || e.tooltipprops?.type === 'both';
				},
				ref: 'tooltipprops.modalTitle'
			},
			modalText: {
				type: 'string',
				label: 'Modal Text',
				expression: 'optional',
				show: function(e) {
					return e.tooltipprops?.type === 'modal' || e.tooltipprops?.type === 'both';
				},
				ref: 'tooltipprops.modalText'
			},
			tooltipPosition: {
				type: 'string',
				label: 'Tooltip Position',
				ref: 'tooltipprops.tipPos',
				component: 'dropdown',
				options: [{
					value: 'r',
					label: 'Right'
				}, {
					value: 'l',
					label: 'Left'
				}, {
					value: 'u',
					label: 'Up'
				}, {
					value: 'd',
					label: 'Down'
				}],
				defaultValue: 'r',
				show: function(e) {
					return !e.tooltipprops || e.tooltipprops?.type === 'tip' || e.tooltipprops?.type === 'both';
				}
			}

		}
	}

	const watermarkProperties = {
		type: 'items',
		label: 'Watermark Properties',
		items: {
			watermarkEnabled: {
				type: 'boolean',
				label: 'Use Watermark',
				ref: 'watermarkprops.enabled',
				defaultValue: false
			},
			watermarkText: {
				type: 'string',
				label: 'Watermark Text',
				expression: 'optional',
				ref: 'watermarkprops.textStr',
				show: function(e) {
					return e.watermarkprops?.enabled;
				}
			},
			watermarkSize: {
				type: 'integer',
				label: 'Text Size',
				ref: 'watermarkprops.textSize',
				component: 'slider',
				min: 1,
				max: 256,
				step: 1,
				defaultValue: 24,
				show: function(e) {
					return e.watermarkprops?.enabled;
				}
			},
			watermarkColor: {
				type: 'string',
				label: 'Text Color',
				ref: 'watermarkprops.textColor',
				expression: 'optional',
				show: function(e) {
					return e.watermarkprops?.enabled;
				}
			},
			watermarkOpacity: {
				type: 'number',
				label: 'Text opacity',
				ref: 'watermarkprops.textOpacity',
				component: 'slider',
				min: 0,
				max: 1,
				step: 0.025,
				defaultValue: 0.4,
				show: function(e) {
					return e.watermarkprops?.enabled;
				}
			},
			watermarkRotationDegrees: {
				type: 'integer',
				label: 'Text Rotation',
				ref: 'watermarkprops.rotation',
				component: 'slider',
				min: -180,
				max: 180,
				step: 1,
				defaultValue: 0,
				show: function(e) {
					return e.watermarkprops?.enabled;
				}
			}
		}
	};
	
	const containerSection = {
		type: "items",
		label: "Container Content",
		items: {
		  /*
		  container: {
			component: "Container",
			translation: "Container",
		  },
		  */
		  masterItems: {
			type: "string",
			component: "dropdown",
			label: "Master Object",
			ref: "containerprops.masterItem",
			options: function() {
				return getContainerOptions().then(function (masterObjs) {
					return masterObjs;
				})
			}
		  }
		},
	};

	return {
			type: "items",
			component: "accordion",
			items: {
				appearanceProps: settingsProperties,
				tooltipProps: tooltipProperties,
				containerSection,
				watermarkProps: watermarkProperties
			}
	}

});