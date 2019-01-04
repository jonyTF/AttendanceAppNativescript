const observableModule = require("tns-core-modules/data/observable");
const firebase = require("nativescript-plugin-firebase");
const frameModule = require("ui/frame");

function InitViewModel() {
    const viewModel = observableModule.fromObject({
        firstName: '',
        lastName: '',
        onTap: function() {
            if (!this.firstName || !this.lastName) {
                alert('Please fill in all the fields.');
            } else {
                //alert('Success! firstName: ' + this.firstName + ' lastName: ' + this.lastName);
                firebase.login({
                    type: firebase.LoginType.ANONYMOUS
                }).then(user => {
                    console.log('global.uuid: ', global.uuid);
                    firebase.update(
                        '/users/' + global.uuid,
                        {name: this.firstName + ' ' + this.lastName}
                    );

                    const navigationEntry = {
                        moduleName: 'home/home-page',
                        clearHistory: true,
                    };
                    frameModule.topmost().navigate(navigationEntry);
                }).catch(error => {
                    console.log('error: ', error);
                });
            }
        },
    });

    return viewModel;
}

module.exports = InitViewModel;
