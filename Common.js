import axios from "./node_modules/axios/dist/esm/axios.js";


document.addEventListener("DOMContentLoaded", function () {
    function showImage(src) {
        let modal = document.getElementById("imageModal");
        let modalImg = document.getElementById("modalImg");
        modalImg.src = src;
        modal.style.display = "flex"; // Show the modal
    }

    window.showImage = showImage;
});

function ChangeBTNs() {
    const UserToken = localStorage.getItem("token");
    let LogBtn = document.getElementById("LoginBTN");
    let RegBtn = document.getElementById("RegisterBTN");
    let OutBtn = document.getElementById("LogOutBTN");
    let CreateBtn = document.getElementById("AddNewPost");
    let commentInput = document.getElementById("commentForm");

    if (UserToken == null) {
        if (commentInput != null) {
            commentInput.style.display = "none";
        }
        if (CreateBtn != null) {
            CreateBtn.style.display = "none";
        }
        OutBtn.style.display = "none";
        LogBtn.style.display = "inline-block";
        RegBtn.style.display = "inline-block";
    } else {
        if (commentInput != null) {
            commentInput.style.display = "flex";
        }
        if (CreateBtn != null) {
            CreateBtn.style.display = "inline-block";
        }
        OutBtn.style.display = "inline-block";
        LogBtn.style.display = "none";
        RegBtn.style.display = "none";
    }
}
ChangeBTNs();

function updateCommentButtons() {
    const userToken = localStorage.getItem("token");
    // Select all buttons whose id starts with "CommentBTN"
    const commentButtons = document.querySelectorAll('[id^="CommentBTN"]');

    commentButtons.forEach((button) => {
        // If token exists, show button; otherwise, hide it.
        button.style.display = userToken ? "block" : "none";
    });
}

//Login request
function DoLogin() {
    let usrNm = document.getElementById("UserName").value;
    let pswd = document.getElementById("Password").value;

    new Promise((resolve, reject) => {
        axios
            .post("https://tarmeezacademy.com/api/v1/login", {
                username: usrNm,
                password: pswd,
            })
            .then((response) => {
                console.log(response);

                id = response.data.user.id;

                let TheToken = response.data.token;
                let TheUser = JSON.stringify(response.data.user);

                localStorage.setItem("token", TheToken);
                localStorage.setItem("username", TheUser);

                const Login_Modal = document.getElementById("LoginModal");

                const Login_Instance = bootstrap.Modal.getInstance(Login_Modal);

                Login_Instance.hide();
                // location.reload();
                let isLogged = true;
                localStorage.removeItem("isLoggedToggle");
                localStorage.setItem("isLoggedToggle", isLogged);

                resolve();
            })
            .catch((err) => {
                let errors = err.response.data.errors;
                for (let ErrorKey in errors) {
                    appendAlert(
                        errors[ErrorKey][errors[ErrorKey].length - 1],
                        "danger"
                    );
                }
                reject();
            });
    })
        .then(() => {
            ChangeBTNs();
            appendAlert("You Logged In Successfully", "success");
            let theToggler = localStorage.getItem("isLoggedToggle");
            userInfoControler(JSON.parse(theToggler));
            setTheUserInfo();
            updateCommentButtons();
            editButtonChange();
        })
        .catch(() => {});
}
window.DoLogin = DoLogin;

function DoRegister() {
    let newName = document.getElementById("Register-name").value;

    let newUserName = document.getElementById("Register-username").value;

    let newPassword = document.getElementById("Register-Password").value;

    let UserProfilePic = document.getElementById("Register-Image").files[0];
    //console.log('Hello ',newName,newPassword,newUserName);

    let TheFormData = new FormData();
    TheFormData.append("username", newUserName);
    TheFormData.append("name", newName);
    TheFormData.append("password", newPassword);
    TheFormData.append("image", UserProfilePic);

    new Promise((resolve, reject) => {
        axios
            .post("https://tarmeezacademy.com/api/v1/register", TheFormData)
            .then((response) => {
                //console.log(response);
                
                let TheToken = response.data.token;
                let TheUser = JSON.stringify(response.data.user);
                id = response.data.user.id;
                localStorage.setItem("token", TheToken);
                localStorage.setItem("username", TheUser);
                
                const Register_Modal = document.getElementById("RegisterModal");
                
                const Register_Instance =
                    bootstrap.Modal.getInstance(Register_Modal);

                Register_Instance.hide();
                let isLogged = true;
                localStorage.removeItem("isLoggedToggle");
                localStorage.setItem("isLoggedToggle", isLogged);
                resolve();

                // location.reload();
            })
            .catch((err) => {
                let errors = err.response.data.errors;
                for (let ErrorKey in errors) {
                    appendAlert(
                        errors[ErrorKey][errors[ErrorKey].length - 1],
                        "danger"
                    );
                }
                reject();
            });
    })
        .then(() => {
            appendAlert("You have successfully registered", "success");
            let theToggler = localStorage.getItem("isLoggedToggle");
            userInfoControler(JSON.parse(theToggler));
            ChangeBTNs();
            setTheUserInfo();
            updateCommentButtons();
            editButtonChange();
        })
        .catch(() => {});
}
window.DoRegister = DoRegister;

//Logout request
function LogOut() {
    new Promise((resolve) => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        const LogOut_Modal = document.getElementById("LogOutModal");

        const LogOut_Instance = bootstrap.Modal.getInstance(LogOut_Modal);

        LogOut_Instance.hide();

        let isLogged = false;
        localStorage.removeItem("isLoggedToggle");
        localStorage.setItem("isLoggedToggle", isLogged);
        resolve();
    }).then(() => {
        ChangeBTNs();
        appendAlert("Logged Out successfully", "success");
        let theToggler = localStorage.getItem("isLoggedToggle");
        userInfoControler(JSON.parse(theToggler));
        updateCommentButtons();
        editButtonChange();
        // setTheUserInfo(false);
    });
}
window.LogOut = LogOut;

//Alert of something
function appendAlert(message, type) {
    const alertPlaceholder = document.getElementById("LoginAlert");
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible fade" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);

    setTimeout(() => {
        const alertElem = wrapper.querySelector(".alert");
        alertElem.classList.add("show");
    }, 100);

    setTimeout(() => {
        const alertElem = wrapper.querySelector(".alert");
        alertElem.classList.remove("show");
        setTimeout(() => {
            wrapper.remove();
        }, 500);
    }, 3500);
}
window.appendAlert = appendAlert;

function userInfoControler(Required) {
    let TheImage = document.getElementById("TheUserPfP");
    if (Required == true) {
        TheImage.style.display = "block";
    } else {
        let userNm = document.getElementById("TheMainUserName");
        userNm.innerHTML = "Touch";
        TheImage.style.display = "none";
    }
}

function setTheUserInfo() {
    let userpfp = document.getElementById("TheUserPfP");
    let userNm = document.getElementById("TheMainUserName");
    let UserInfos = JSON.parse(localStorage.getItem("username"));
    console.log(UserInfos);

    if (UserInfos.profile_image != null) {
        userpfp.src = UserInfos.profile_image;
    }
    else{
        userpfp.src = "./Imgs/pfp/drake1.jpg";
    }
    userNm.innerHTML = UserInfos.username;
}
let theToggler = localStorage.getItem("isLoggedToggle");
userInfoControler(JSON.parse(theToggler));
setTheUserInfo();

function editButtonChange() {
    const UserToken = localStorage.getItem("token");
    let prof = document.getElementById("profileShow");
    if (userToken != null) {
        prof.style.display = "block";
    } else {
        prof.style.display = "none";
    }
    document.querySelectorAll('[id^="OptionBtn"]').forEach((EditBtn) => {
        EditBtn.style.display = UserToken ? "block" : "none";
    });
    document.querySelectorAll('[id^="EditBTN"]').forEach((EditBtn) => {
        EditBtn.style.display = UserToken ? "block" : "none";
    });
    document.querySelectorAll('[id^="DelBTN"]').forEach((EditBtn) => {
        EditBtn.style.display = UserToken ? "block" : "none";
    });
}


