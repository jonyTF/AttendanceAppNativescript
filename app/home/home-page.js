/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

const HomeViewModel = require("./home-view-model");
var roomsList;

exports.onNavigatingTo = function(args) {
    const page = args.object;
    page.bindingContext = new HomeViewModel();
    page.bindingContext.updateWelcomeText();
    page.bindingContext.updateRooms();

    roomsList = page.getViewById('rooms-list');
};

exports.onItemSelected = function() {
    console.log('selected');
    if (roomsList.selectionBehavior == 'LongPress') {
        roomsList.selectionBehavior = 'Press';
    }
};

exports.onItemDeselected = function() {
    console.log('deselected');
    if (roomsList.getSelectedItems().length == 0) {
        roomsList.selectionBehavior = 'LongPress';
    }
}