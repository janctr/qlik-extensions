define([
  "client.property-panel/components/components",
  "client.property-panel/component-utils",
], function (components, componentUtils) {
  return function () {
    if (!components.hasComponent("About")) {
      let copyright =
        "" +
        '<div style="padding:4px;">' +
        "Copyright Jan, no changes allowed, free to use" +
        "</div>" +
        "";

      let html = copyright;

      let aboutComponent = {
        template: html,
        controller: [
          "$scope",
          function (scope) {
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
                return "About" === description;
              });
          },
        ],
      };
      return components.addComponent("About", aboutComponent), aboutComponent;
    }
  };
});
