/*
define(["qlik", "jquery",
    "client.property-panel/components/components",
    "client.property-panel/component-utils",
  ], function (qlik, $, components, componentUtils) {
    
    async function getProperties(data) {
      const model = await qlik.currApp().getList('MasterObject');
      let masterOpts = model.layout.qAppObjectList.qItems.map(({ qInfo: { qId }, qMeta: { title } }) => ({ label: title, value: qId }));
      const noOption = $('<option></option>').text('No master item');
      noOption.attr('value', '');
      $('.container-dropdown > select').append(noOption);
      for(const option of masterOpts) {
        let myOption = $('<option></option>').text(option.label);
        myOption.attr('value', option.value);
        $('.container-dropdown > select').append(myOption);
      }
      if(data['containerprops']) {
        $('.container-dropdown > select').val(data['containerprops']['masterItem']);
      }
    }


    return function () {
      if (!components.hasComponent("Container")) {
        let dropdown = `<h4 style="padding: 8px 10px;">Master Item</h4><div class="container-dropdown" style="padding: 8px 10px;">
            <select class="lui-select">
            </select>
          </div>`;
        let html = dropdown;
        let containerComponent = {
          template: html,
          controller: [
            "$scope",
            function (scope) {
              //console.log('scope.args', scope.args);
              let data = function () {
                return scope.data;
              };
              componentUtils.defineLabel(
                scope,
                scope.definition,
                data,
                scope.args.handler
              ),
                componentUtils.defineVisible(scope, scope.args.handler),
                componentUtils.defineReadOnly(scope, scope.args.handler),
                componentUtils.defineChange(scope, scope.args.handler),
                componentUtils.defineValue(scope, scope.definition, data),
                (scope.getDescription = function (description) {
                  return "Container" === description;
                });
              getProperties(scope.data);
              if(typeof(scope.args.properties.onChangeHandler) === 'function') {
                scope.args.properties.onChangeHandler();
              }
            },
          ],
        };
        return components.addComponent("Container", containerComponent), containerComponent;
      }
    };
  });
*/
define(['qlik', 'qvangular'], function(qlik, qv) {
  let Promise = qv.getService('$q');

  return function() {
    return new Promise(function(resolve, reject) {
      let app = qlik.currApp();
      app.getList('masterobject').then(function(model) {
        app.destroySessionObject(model.layout.qInfo.qId);
        if(!model.layout.qAppObjectList.qItems) {
          return resolve({value: '', label: 'None'})
        }
        let masterOpts = model.layout.qAppObjectList.qItems.map(({ qInfo: { qId }, qMeta: { title } }) => ({ label: title, value: qId }));
        return resolve(masterOpts);
      });
    });
  };
});