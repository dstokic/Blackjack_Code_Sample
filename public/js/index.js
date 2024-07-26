window.onload = async function(){
    let user = sessionStorage.getItem("user");
    //if on landing page
    if(location.href == 'http://localhost:3000/'){
        document.getElementById("userlogin").addEventListener("click", function(){
            document.getElementById("loginsignupContainer").style.display = "none";
            document.getElementById("logInDiv").style.display = "block";
        });
    
        document.getElementById("usersignup").addEventListener("click", function(){
            document.getElementById("loginsignupContainer").style.display = "none";
            document.getElementById("signUpDiv").style.display = "block";
        });

        document.getElementById("cancelLogin").addEventListener("click", function(){
            location.reload();
        });

        document.getElementById("cancelSignup").addEventListener("click", function(){
            location.reload();
        });
    
        document.getElementById("loginbutton").addEventListener("click", async function (){
            try{
                console.log("Username: " + document.getElementById("logInUsernameInput").value + " Password: " + document.getElementById("logInPasswordInput").value);
            let loginHeaders = new Headers;
            loginHeaders.append("Content-Type", "application/json");
            let userInfo = new Request('/login', {
                method: 'POST',
                headers: loginHeaders,
                body: JSON.stringify({
                    "username": document.getElementById("logInUsernameInput").value,
                    "password": document.getElementById("logInPasswordInput").value
                })
            });
            let response = await fetch(userInfo);
            if(response.ok){
                sessionStorage.setItem("user", document.getElementById("logInUsernameInput").value);
                location.replace("http://localhost:3000/home.html");
            }
            else if(response.status == 401){
                //incorrect password
                document.getElementById('loginerrorMess').textContent = "Incorrect password";
                document.getElementById("logInPasswordInput").value = "";
            }
            else if(response.status == 404){
                //could not find user
                document.getElementById('loginerrorMess').textContent = "Could not find user";
                document.getElementById("logInUsernameInput").value = "";
                document.getElementById("logInPasswordInput").value = "";
            }
            else{
                //something went wrong
                document.getElementById('loginerrorMess').textContent = "Something went wrong";
                document.getElementById("logInUsernameInput").value = "";
                document.getElementById("logInPasswordInput").value = "";
            }
            }
            catch(err){
                console.log(err);
            }
        });
    
        document.getElementById("signupbutton").addEventListener("click", async function(){
            try{
                let password = document.getElementById("signUpPasswordInput").value;
                let password1 = document.getElementById("signUpPasswordInput1").value;
                console.log("Username: " + document.getElementById("signUpUsernameInput").value + " Password: " + document.getElementById("signUpPasswordInput").value + " Password 2: " + document.getElementById("signUpPasswordInput1").value);
                if(password != password1){
                    console.log("incorrect password");
                    document.getElementById("signUpUsernameInput").value = "";
                    document.getElementById("signUpPasswordInput").value = "";
                    document.getElementById("signUpPasswordInput1").value = "";
                    let incorrectPass = document.createElement("p")
                    incorrectPass.textContent = "Incorrect password"; 
                    document.getElementById("signUpDiv").appendChild(incorrectPass);
                }
                else{
                    let signupHeaders = new Headers;
                    signupHeaders.append("Content-Type", "application/json");
                    let userInfo = new Request('/signup', {
                        method:'POST',
                        headers: signupHeaders,
                        body: JSON.stringify({
                            "username": document.getElementById("signUpUsernameInput").value,
                            "password": document.getElementById("signUpPasswordInput").value
                        })
                    });
                    let response = await fetch(userInfo);
                    if(response.ok){
                        sessionStorage.setItem("user", document.getElementById("signUpUsernameInput").value);
                        location.replace("http://localhost:3000/home.html");
                    }
                    else if(response.status == 409){
                        //incorrect password
                        document.getElementById('signuperrorMess').textContent = "Username already taken";
                    }
                    else{
                        //something went wrong
                        document.getElementById('signuperrorMess').textContent = "Something went wrong";
                    }
                    document.getElementById("signUpUsernameInput").value = "";
                    document.getElementById("signUpPasswordInput").value = "";
                    document.getElementById("signUpPasswordInput1").value = "";
                }
            }
            catch(err){
                console.log(err);
            }
        });
    }    
    else if(location.href == 'http://localhost:3000/home.html'){
        //redirect if not logged in
        if(sessionStorage.length == 0){
            location.href = "http://localhost:3000";
        }
        let tempUser = await getUser(user);
        if(tempUser.admin == true){
            document.getElementById("adminButton").style.display = "block";
        }        
        document.getElementById("userBalance").textContent = "Your balance is: " + tempUser.balance;
        document.getElementById("logoutButton").addEventListener('click', function(){
            sessionStorage.clear();
            location.href = "http://localhost:3000";
        });
    }
    else if(location.href == 'http://localhost:3000/admin.html'){
        //redirect if not logged in
        if(sessionStorage.length == 0){
            location.href = "http://localhost:3000";
        }
        let currUser = await getUser(user);
        if(currUser.admin == false){
            location.href = "http://localhost:3000/home.html"
        }
        let adminHeaders = new Headers;
        adminHeaders.append("Content-Type", "application/json");
        let userReq = new Request('/users', {
            method:'GET',
            headers: adminHeaders
        });
        let response = await fetch(userReq);
        let usersInfo = await response.json();
        console.log(usersInfo);

        //Set up table
        //https://stackoverflow.com/questions/29335369/display-array-of-objects-in-a-dynamic-table-javascript
        let html = "<table border='1|1' id='adminTbl'>";
        html+= "<th>Username</th>";
        html+= "<th>Balance</th>";
        html+= "<th>Admin</th>";
        html+= "<th colspan=2>Edit User Buttons</th>";
        for (let i = 0; i < usersInfo.length; i++) {
            html+="<tr>";
            html+="<td>" + usersInfo[i].username + "</td>";
            html+="<td>" + usersInfo[i].balance + "</td>";
            if(usersInfo[i].admin == true){
                html+="<td>Admin</td>";
            }
            else{
                html+="<td>Not an Admin</td>";
            }
            html+="<td><button class=editButtons id=editButton" + i + ">Edit</button></td>";
            html+="<td><button class=deleteButtons id=deleteButton" + i + ">Delete</button></td>";
            html+="</tr>";
        }
        html+="</table>";
        //add table to the page
        let tbl = document.getElementById('tblContainer');
        tbl.innerHTML = html;
        let tableDatas = document.getElementsByTagName('td');
        for(data of tableDatas){
            data.style.textAlign = "center";
        }
        console.log(tableDatas);
        let editButtons = document.getElementsByClassName('editButtons');
        let buttonNum;
        let adminTbl = document.getElementById('adminTbl');
        //add event listeners to hide table to all the buttons
        for(b of editButtons){
            b.addEventListener('click', async function(){
                document.getElementById("backButton").style.display = "none";
                buttonNum = this.id.slice(-1);
                buttonNum++;
                console.log(adminTbl.rows[buttonNum]);
                let tempUsername = adminTbl.rows[buttonNum].cells[0].textContent;
                console.log(tempUsername);
                let tempBal = adminTbl.rows[buttonNum].cells[1].textContent;
                let tempAdmin = adminTbl.rows[buttonNum].cells[2].textContent;
                let tempAdminBool;
                if(tempAdmin == "Admin"){
                    tempAdminBool = true;
                }
                else{
                    tempAdminBool = false;
                }
                //show edit page
                adminTbl.style.display = "none";
                document.getElementById('editArea').style.display = "block";
                document.getElementById('editUserName').placeholder = tempUsername;
                document.getElementById('editBalance').placeholder = tempBal;
                document.getElementById('editUserName').value = tempUsername;
                document.getElementById('editBalance').value = tempBal;
                document.getElementById('isAdmin').checked = tempAdminBool;
            });
        }
        let deleteButtons = document.getElementsByClassName('deleteButtons');
        for(b of deleteButtons){
            b.addEventListener('click', async function(){
                buttonNum = this.id.slice(-1);
                buttonNum++;
                let tempUsername = adminTbl.rows[buttonNum].cells[0].textContent;
                let delHeaders = new Headers;
                delHeaders.append("Content-Type", "application/json");
                let delUser = new Request(`/users/${tempUsername}`, {
                    method:'DELETE',
                    headers: delHeaders
                });
                let response = await fetch(delUser);
                if(response.ok){
                    //success
                    window.alert("User sucessfully deleted");
                    if(user == tempUsername){
                        sessionStorage.clear();
                        location.href = "http://localhost:3000";
                    }
                }
                else if(response.status == 404){
                    //could not find user
                    window.alert("Could not find user");
                }
                else{
                    //something went wrong
                    window.alert("Something went wrong");
                }
                location.reload();
            });
        }
        document.getElementById('finishEdit').addEventListener('click', async function(){
            //update user in db
            let adminHeaders = new Headers;
            adminHeaders.append("Content-Type", "application/json");
            let isAdmin = document.getElementById("isAdmin").checked;
            console.log(isAdmin);
            let updateUser = new Request(`/users`, {
                method:'PUT',
                headers: adminHeaders,
                body: JSON.stringify({
                    "oldusername": document.getElementById("editUserName").placeholder,
                    "newusername": document.getElementById("editUserName").value,
                    "balance": document.getElementById("editBalance").value,
                    "admin": isAdmin
                })
            });
            //check if logged in user is the user that name was changed and change it
            if(user == document.getElementById("editUserName").placeholder){
                user = document.getElementById("editUserName").value;
            }
            let response = await fetch(updateUser);
            if(response.ok){
                //go back to list of users
                window.alert("User sucessfully updated");
            }
            else if(response.status == 404){
                //could not find user
                window.alert("Could not find user");
            }
            else{
                //something went wrong
                window.alert("Something went wrong");
            }
            window.location.reload();
        });
        document.getElementById('cancelEdit').addEventListener('click', async function(){
            //go back to list of users
            window.location.reload();
        });
    }

    async function getUser(username){
        let homeHeaders = new Headers;
        homeHeaders.append("Content-Type", "application/json");
        let userReq = new Request(`/users/${user}`, {
            method:'GET',
            headers: homeHeaders
        });
        let response = await fetch(userReq);
        let userInfo = await response.json();
        return userInfo;
    }
}