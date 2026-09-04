document.addEventListener('DOMContentLoaded', function(){
    // Use buttons to toggle between views
    document.querySelector('#applications-list').addEventListener('click', load_applications);
    document.querySelector('#application-add').addEventListener('click', add_application);
    
    // By default, load the applications list
    load_applications();
});

function add_application(){
    // Show add_application view and hide other views
    document.querySelector('#applications-view').style.display = 'none';
    document.querySelector('#add-application-view').style.display = 'block';

    // Clear out composition fields
    document.querySelector('#company').value = '';
    document.querySelector('#position').value = '';
    document.querySelector('#status').value = '';
    document.querySelector('#date_applied').value = '';
    document.querySelector('#notes').value = '';
    document.querySelector('#job_url').value = '';
}

function load_applications(){
    // Show the applications list and hide other views
    document.querySelector('#applications-view').style.display = 'block';
    document.querySelector('#add-application-view').style.display = 'none';
}