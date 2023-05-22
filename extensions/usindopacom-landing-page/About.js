define([
  "client.property-panel/components/components",
  "client.property-panel/component-utils",
], function (components, componentUtils) {
  return function () {
    if (!components.hasComponent("About")) {
      let copyright = `<div class="pacom-about">
          <h4>Description</h4>
          <p>
            This is a reusable and customizable landing page that links to differents apps made for the J4.
          </p>
          <h4>Copyright</h4>
          <p>This qlik extension and its content is copyright of Jan Iverson Eligio (c) 2023. All rights reserved.</p>
          <h4>Source</h4>
          <p>You can view the source code here: 
            <a href="https://github.com/janctr/qlik-extensions/tree/master/extensions/usindopacom-landing-page">repository</a>
          </p>
        </div>`;

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
