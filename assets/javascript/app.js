/* 
 Bernard Williams
 Product Feature Intake Request Tool

 */

$(document).ready(function () {




    // Get a reference to the database service
    var requests = firebase.database().ref('requests/');
    var sessionUser = sessionStorage.getItem('email');

    //Check to see if there is a logged in user otherwise dont display the full page.
    if (!sessionStorage.getItem('email')) {
        $('.panel').hide();
        console.log(sessionUser);
    } else {
        $('.panel').show();
    }


    requests.orderByChild('priority').on('value', function (snapshot) {

        $('#requestTable').empty();
        //console.log(snapshot.val());
        snapshot.forEach(function (childSnapshot) {

            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            console.log(childKey);
            console.log(childData);
            var $deleteButton = $('<i>');
            $deleteButton.addClass("fa fa-trash-o");
            $deleteButton.attr('aria-hidden', 'true');
            $deleteButton.attr('id', childKey);
            $deleteButton.on('click', deleteRequest);

            var $newRow = $('<tr>');
            var $newReqTitle = $('<td>');
            var $newReqDesc = $('<td>');
            var $newReqTargetDate = $('<td>');
            var $newReqPriority = $('<td>');
            var $newRequester = $('<td>');
            var $delBtnCell = $('<td>');


            $newReqTitle.text(childData.title);
            $newReqDesc.text(childData.description);
            $newReqPriority.text(childData.priority);
            $newRequester.text(childData.requester);
            $newReqTargetDate.text(childData.targetDate);
            //TODO Calculate the next arrival time
            //$newNextArrival.text('');
            //TODO Calculate the minutes away
            //$newMinAway.text('');

            $delBtnCell.append($deleteButton);

            $newRow.append('<td></td>');
            $newRow.append($delBtnCell);
            $newRow.append($newReqTitle);
            $newRow.append($newRequester);
            $newRow.append($newReqPriority);
            $newRow.append($newReqTargetDate);
            $newRow.append('<td></td>');

            $('#requestTable').append($newRow);
        });
    });


    function addReq() {

        console.log('---------Add Request function')
        //prepare the request object
        var newReq = {
            title: $('#title').val().trim(),
            description: $('#description').val().trim(),
            priority: $('#priority').val(),
            targetDate: $('#dateNeededBy').val().trim(),
            requester: $('#requester').val().trim(),
            userEmail: sessionStorage.getItem('email'),
            entryDate: Date.now()
        }

        //get a unique key
        // Get a key for a new Post.
        var newReqID = firebase.database().ref().child('requests').push().key;

        //add the request
        firebase.database().ref('requests/' + newReqID).set(newReq);

        console.log(newReq);
    }

    function deleteRequest() {
        //connect to the db
        console.log('Delete ID ' + $(this).attr('id'));
        //delete the train using the key from the DB
        var request = firebase.database().ref('requests/' + $(this).attr('id'));
        request.remove();

    }

    $('#submit').click(addReq);

    $('#signout').click(function () {
        console.log('Signing out');
        firebase.auth().signOut().then(function () {
            $('#user-name').text('You are now signed out... Please sign in to use the app');
            console.log('Signed Out');
            sessionStorage.clear();
        }, function (error) {
            console.error('Sign Out Error', error);
        });

    });

});

