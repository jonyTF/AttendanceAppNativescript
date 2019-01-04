const InitViewModel = require('./init-view-model');
const frameModule = require('ui/frame');

exports.onNavigatingTo = function(args) {
    const page = args.object;
    page.bindingContext = new InitViewModel();

    if (global.authenticated) {
        const navigationEntry = {
            moduleName: 'home/home-page',
            clearHistory: true,
        };
        frameModule.topmost().navigate(navigationEntry);
    }
};