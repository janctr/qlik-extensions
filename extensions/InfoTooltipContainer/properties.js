// JavaScript
define(["qlik", './container'], function (qlik, Container) {
	'use strict';
	Container();
	/*
	function getMasterObjects() {
		return new Promise(function (res, rej) {
			qlik.currApp().getList('MasterObject', function (reply) {
				res(reply.qItems.map(
					({ qInfo: { qId }, qMeta: { title } }) => ({ label: title, value: qId })
				));
			});
		});
	}
	*/
	//let masterObjectPromise = getMasterObjects();
	const settingsProperties = {
		type: 'items',
		items: {
			/*
			containerObj: {
				label: 'Container',
				type: 'items',
				items: {
					masterItem: {
						type: 'string',
						label: 'Master Item',
						component: 'dropdown',
						ref: 'containerprops.masterItem',
						defaultValue: '',
						options: []
					}
				}
			},
			*/
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
					}
				}
			},
			settings: {
				uses: 'settings'
			}
		}
	}

	const containerSection = {
		type: "items",
		translation: "Container",
		items: {
		  container: {
			component: "Container",
			translation: "Container",
		  },
		},
	};

	return {
			type: "items",
			component: "accordion",
			items: {
				appearanceProps: settingsProperties,
				containerSection
			}
	}

});