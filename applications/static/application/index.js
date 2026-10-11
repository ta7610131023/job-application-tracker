document.addEventListener('DOMContentLoaded', function(){
    // Use buttons to toggle between views
    document.querySelector('#applications-list').addEventListener('click', load_applications);
    document.querySelector('#add-application').addEventListener('click', add_application);
    // add-application-form behavior
    document.querySelector('#add-application-form').onsubmit = () => {
        // get the data/values entered by the user
        const company = document.querySelector('#company').value;
        const position = document.querySelector('#position').value;
        const status = document.querySelector('#status').value;
        const date_applied = document.querySelector('#date-applied').value;
        const notes = document.querySelector('#notes').value;
        const job_url = document.querySelector('#job-url').value;

        // send a POST request (the applications data) to the URL (server)
        fetch('/applications', {
            method: 'POST',
            body: JSON.stringify({
                company: company,
                position: position,
                status: status,
                date_applied: date_applied,
                notes: notes,
                job_url: job_url
            })
        })
        .then(response => response.json())
        .then(result => {
            // if application adding fails
            if (result.error)
            {
                console.log(result);
            }
            // Once the application has been added, load the applications list
            else
            {
                load_applications();
            }
        });
        // Prevent default submission
        return false;
    };


    // By default, load the applications list
    load_applications();
});

function add_application(){
    // Show add_application view and hide others
    document.querySelector('#applications-view').style.display = 'none';
    document.querySelector('#application-detail-view').style.display = 'none';
    document.querySelector('#add-application-view').style.display = 'block';

    // Clear out/initialize application fields
    document.querySelector('#company').value = '';
    document.querySelector('#position').value = '';
    document.querySelector('#status').value = '';
    document.querySelector('#date-applied').value = '';
    document.querySelector('#notes').value = '';
    document.querySelector('#job-url').value = '';
}

function load_applications(){
    // Show the applications list and hide other views
    document.querySelector('#applications-view').style.display = 'block';
    document.querySelector('#application-detail-view').style.display = 'none';
    document.querySelector('#add-application-view').style.display = 'none';

    // Clear out/initialize the content of the div to prevent redundancy 
    document.querySelector('#applications-view').innerHTML = '';
    // get the applications data from the server (js -> django -> db -> django -> js)
    fetch('/applications')
    .then(response => response.json())
    .then(apps => {
        // go through each app in the apps array
        apps.forEach(app => {
            // test (working)
            /*console.log(app.id)
            console.log(app.company)
            console.log(app.position)
            console.log(app.job_url)
            console.log(app.status)
            console.log(app.date_applied)
            console.log(app.notes)*/

            // create new html element
            const element = document.createElement('div');
            element.innerHTML = `${app.company} | ${app.position} | ${app.date_applied}`;
            // adds an event handler to run a particular function when that div(element) is clicked on
            element.addEventListener('click', () => {
                show_application(app)    
            });
            // add new element to #applications-view
            document.querySelector('#applications-view').append(element);
        })
    });
}

function show_application(app) {
    // Show the application detail and hide other views
    document.querySelector('#applications-view').style.display = 'none';
    document.querySelector('#application-detail-view').style.display = 'block';
    document.querySelector('#add-application-view').style.display = 'none';
    // Clear out/initialize the content of the div to prevent redundancy 
    document.querySelector('#application-detail-view').innerHTML = '';
    // test, work!
    // console.log(app);
    // create new html element
    const element = document.createElement('div');

    element.innerHTML = `    
        Company: <p>${app.company}</P>
        Position: <p>${app.position}</P>
        Job URL: <P><a href='${app.job_url}'>Job Posting</a></P>
        Status: <p>${app.status}</P>
        Date Applied: <p>${app.date_applied}</P>
        Note: <p>${app.notes}</P>
        <button class='btn btn-primary' id='edit-application'>Edit</button>
    `;

    // add new element to #application-detail-view
    document.querySelector('#application-detail-view').append(element);
    // attach behavior to that button
    document.querySelector('#edit-application').addEventListener('click', () => {
        edit_application(app);
    });
}

function edit_application(app){
    // reuse the application detail page, but change the content to edit-form later
    document.querySelector('#applications-view').style.display = 'none';
    document.querySelector('#application-detail-view').style.display = 'block';
    document.querySelector('#add-application-view').style.display = 'none';
    // erase old application details to display new content
    document.querySelector('#application-detail-view').innerHTML = '';
    
    // create new html element
    const element = document.createElement('div');
    
    element.innerHTML = `
        <form id="edit-application-form">
            Status: <input id='edit-status' class='form-control' required>
            Note: <textarea id='edit-notes' class='form-control'></textarea>
            <br>
            <button type='submit' class='btn btn-primary'>Update</button>
        </form>
    `;

    // add new element to #application-detail-view
    document.querySelector('#application-detail-view').append(element);
    // the default data shows in the field
    document.querySelector('#edit-status').value = app.status;
    document.querySelector('#edit-notes').value = app.notes;
    // edit-application-form behavior
    document.querySelector('#edit-application-form').onsubmit = () => {
        // define the updated data
        const edit_status = document.querySelector('#edit-status').value;
        const edit_notes = document.querySelector('#edit-notes').value;
        
        fetch(`/applications/${app.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                status: edit_status,
                notes: edit_notes
            })
        })
        .then(response => {
            if (response.status === 204) {
                // Update the existing application object
                app.status = edit_status;
                app.notes = edit_notes;
                
                // Display updated details
                show_application(app);
            }
            else {
                // Return the Promise (Django's JSON error response)
                return response.json();
            }
        })
        .then(result => {
            // Only the failed PUT returns parsed JSON
            if (result !== undefined) {
                console.log(result.error);
            }
        })
        // Catch any errors and log them to the console
        .catch(error => {
            console.log('Error:', error);
        });

        // Prevent default submission
        return false;
    }
}