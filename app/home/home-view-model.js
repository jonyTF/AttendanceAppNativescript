const { Observable } = require("tns-core-modules/data/observable");
const { ObservableArray } = require("tns-core-modules/data/observable-array");
const observableModule = require("tns-core-modules/data/observable");
const firebase = require("nativescript-plugin-firebase");
const dialogs = require("tns-core-modules/ui/dialogs");

function HomeViewModel() {
    const viewModel = observableModule.fromObject({
        people: [
            {name: 'Jimmy', description: 'person'},
            {name: 'Billy', description: 'constructor'},
            {name: 'Bob', description: 'feline'}
        ],
        rooms: new ObservableArray([]),
        welcomeText: 'Welcome back!',
        updateWelcomeText: function() {
            firebase.getValue('/users/' + global.uuid)
                .then(result => {
                    this.welcomeText = 'Welcome back,\n' + result.value.name + '!';
                })
                .catch(error => {
                    console.log(error);
                });
        },
        joinRoom: function() {
            dialogs.prompt({
                title: 'Join room',
                message: 'Enter a valid room code',
                okButtonText: 'Join',
                cancelButtonText: 'Cancel',
                inputType: dialogs.inputType.text
            }).then(function(r) {
                if (r.result) {
                    console.log('Join room: ', r.text);
                    firebase.getValue('/rooms/' + r.text)
                        .then(result => {
                            if (result.value !== null) {
                                firebase.update(
                                    '/users/' + global.uuid + '/rooms/' + r.text,
                                    {owner: false}
                                ).then(() => {
                                    firebase.update(
                                        '/rooms/' + r.text + '/members',
                                        {[global.uuid]: true}
                                    ).then(() => {
                                        //alert('Successfully joined room with code "' + r.text + '"');
                                    });
                                });

                            } else {
                                alert('Room with code "' + r.text + '" does not exist!');
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            });
        },
        updateRooms: function() {
            var that = this;
            firebase.addChildEventListener(function(result) {
                if (result.type == 'ChildAdded') {
                    firebase.getValue('/rooms/' + result.key)
                        .then(result2 => {
                            that.rooms.push({
                                name: result2.value.name,
                                description: result2.value.description,
                                code: result.key,
                            });
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else if (result.type == 'ChildRemoved') {
                    //result.key is the room that was removed
                    const roomIndex = that.rooms.filter(r => r.code == result.key);
                    that.rooms.splice(roomIndex, 1);
                }
            }, '/users/' + global.uuid + '/rooms').then(
                function(listenerWrapper) {
                    global.listeners = listenerWrapper.listeners;
                }
            );
        },
    });

    return viewModel;
}

module.exports = HomeViewModel;
