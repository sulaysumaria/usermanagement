async function homePage() {
  return new Promise(async (resolve) => {
    return resolve({
      statusCode: 200,
      body: `<html>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css" />
      </head>
      <body>
        <div class="container">
          <h1>User Management</h1>
    
          <a class="waves-effect waves-light btn modal-trigger" href="#modal1">Add User</a>
    
          <div id="modal1" class="modal">
            <div class="modal-content">
              <h4>Add a new user</h4>
              <div class="row">
                <div class="input-field col s4">
                  <input placeholder="John" id="first_name" type="text" class="validate" />
                  <label for="first_name">First Name</label>
                </div>
                <div class="input-field col s4">
                  <input id="last_name" placeholder="Doe" type="text" class="validate" />
                  <label for="last_name">Last Name</label>
                </div>
                <div class="input-field col s4">
                  <input id="email" placeholder="johndoe@example.com" type="email" class="validate" />
                  <label for="email">Email</label>
                </div>
              </div>
              <a class="waves-effect waves-light btn" id="addUserButton">Submit</a>
            </div>
          </div>
    
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
              </tr>
            </thead>
    
            <tbody id="usersData">
              <tr>
                <td colspan="3">Loading...</td>
              </tr>
            </tbody>
          </table>
        </div>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>
        <script>
          function loadUsers() {
            $('#usersData').html('<tr><td colspan="3">Loading...</td></tr>');
    
            const settings = {
              async: true,
              crossDomain: true,
              url: 'https://k4kktncmmg.execute-api.ap-south-1.amazonaws.com/dev/user',
              method: 'GET',
            };
    
            $.ajax(settings).done((response) => {
              const { users } = response;
              let usersDataHtml = '';
              for (const user of users) {
                usersDataHtml += '<tr><td>' + user.firstName + '</td><td>' + user.lastName + '</td><td>' + user.email + '</td></tr>';
              }
              $('#usersData').html(usersDataHtml);
            });
          }
    
          $(document).ready(() => {
            $('.modal').modal();
    
            $('#addUserButton').on('click', () => {
              const firstName = $('#first_name').val();
              const lastName = $('#last_name').val();
              const email = $('#email').val();
              const allValid = false;
    
              const data = {
                firstName,
                lastName,
                email,
              };
    
              $.ajax({
                type: 'POST',
                url: 'https://k4kktncmmg.execute-api.ap-south-1.amazonaws.com/dev/user',
                data: JSON.stringify(data),
                success: () => {
                  $('.modal').modal('close');
                  M.toast({ html: 'User added.' });
    
                  loadUsers();
                },
                error: (jqXhr, textStatus, errorThrown) => {
                  if (jqXhr.responseJSON.message.length) {
                    M.toast({ html: jqXhr.responseJSON.message[0] });
                  }
                },
                contentType: 'application/json',
              });
            });
    
            loadUsers();
          });
        </script>
      </body>
    </html>
    `,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  });
}

module.exports = {
  homePage,
};
