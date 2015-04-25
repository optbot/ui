(function() {
  'use strict';

  var path = require('path');
  var express = require('express');

  express.response.renderPartial = function(filePath, context, options) {
    // While rendering a partial:
    // - Look in the partials directory.
    // - Temporarily remove the layout.

    // TODO: Consider reading the partialsDir from the exphbs property.
    var partial = path.normalize(path.join('partials/', filePath));
    var prevLayout = context.layout;
    context.layout = null;
    this.req.res.render(partial, context, options);
    context.layout = prevLayout;
  };
})();
