import axios from "./node_modules/axios/dist/esm/axios.js";
//import {CommentBtnChange} from "./app.js";
const urlParams = new URLSearchParams(window.location.search);

const id = urlParams.get("UserID");
document.addEventListener("DOMContentLoaded", function () {
function setProfileInfo(id) {
    const Main= document.getElementById('TheMain');
    Main.innerHTML = ``;
    
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`)
    .then((response)=>{
        let data = response.data.data;
        let PfP = data.profile_image;
        if (PfP && Object.keys(PfP).length === 0) {
            PfP = "./Imgs/pfp/person-placeholder-300x300.jpeg";
        }
        let email = data.email;
        if (email==null) {
            email=``;
        }
        Main.innerHTML += `
        
                <div class="card-header" style="background: #323232">
                <b><span id="UserProfileName">${data.name}</span>'s Profile</b>
                </div>
            
                <div class="row ms-2 p-3 d-flex align-items-center justify-content-center">
                <div class="col-12 col-md-2 text-center">
                    <img
                    src="${PfP}"
                    id="pfpImage"
                    alt="pfp"
                    class="thepfp border border-2 img-fluid"
                    style="
                    width: 120px; height: 120px;
                    "
                    onclick="showImage(this.src)"
                    />
                </div>
                <div class="col-12 col-md-4 text-center text-md-start mt-3 mt-md-0">
                    <div id="NameSetter" style="font-size: larger; font-weight: 500">${data.name}</div>
                    <div id="UserNameSetter" style="font-size: larger; font-weight: 500">${data.username}</div>
                    <div id="EmailSetter" style="font-size: larger; font-weight: 500">${email}</div>
                </div>
                <div class="col-12 col-md-6 text-center text-md-start mt-3 mt-md-0">
                    <div style="font-size: x-large; font-weight: 600">
                    Posts : <span id="PostsCount">${data.posts_count}</span>
                    </div>
                    <div style="font-size: x-large; font-weight: 600">
                    Comments : <span id="CmntCount">${data.comments_count}</span>
                    </div>
                </div>
                </div>
            
        `;
        

        console.log(response);
        
        
        
        
    })
    .catch
    ((error)=>{
        console.log(error);
    })
}

setProfileInfo(id);
window.setProfileInfo = setProfileInfo;

});

function GetPosts() {
    let post = document.getElementById(`posts`);
    
        post.innerHTML = ``;
    

    axios
        .get(
            `https://tarmeezacademy.com/api/v1/users/${id}/posts`
        )
        .then((result) => {
            console.log(result);


            let response = result.data.data;

            for (let respone of response) {
                let user = JSON.parse(localStorage.getItem("username"));
                let isMyPost = user != null && user.id == respone.author.id;
                let EditBTN = ``;
                let DelBtn = ``;
                let OptBtn = ``;
                if (isMyPost) {
                    EditBTN = `<button class="btn btn-outline-secondary ms-auto mt-1" id="EditBTN${
                        respone.id
                    }" onclick="DoEdit(&quot;${encodeURIComponent(
                        JSON.stringify(respone)
                    )}&quot;)" style="float:right">edit</button>`;
                    DelBtn = `<button class="btn btn-outline-danger ms-3 mt-1" id="DelBTN${respone.id}" onclick="DoDelete(${respone.id})" style="float:right">Delete</button>`;
                    OptBtn = `<button class="btn btn-outline-primary mt-1" style="float:right" id="OptionBtn${respone.id}" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
Options
</button> `;
    }
    let Tags = "";

    for (let tag of respone.tags) {
        Tags += `<button class="btn btn-secondary rounded-pill btn-sm"> Mother ${tag}</button> `;
    }

    /* this is a check for the user image below*/
    let PfP = respone.author.profile_image;
    if (PfP && Object.keys(PfP).length === 0) {
        PfP = "./Imgs/pfp/person-placeholder-300x300.jpeg";
    }

    /* this is a check for the post image below*/
    let POstPic = respone.image;
    if (POstPic && Object.keys(POstPic).length === 0) {
        POstPic =
            "./Imgs/Posts-Pics/posts1.jpg";
    }
    let ThePostTitle = respone.title;
    if (respone.title == null) {
        ThePostTitle = "No Title";
    }

    post.innerHTML += `
                    <div class="card mt-5 offset-md-2 col-md-8 text-bg-dark shadow">
                        <div class="card-header" style="background: #323232">
                            <img src="${PfP}" alt="pfp" class="thepfp border border-2" onclick="showImage(this.src)"/>
                            <b style="cursor:pointer" onclick="TakeToProfile(${respone.author.id})">${respone.author.username}</b>
                            ${OptBtn}
                            <div class="collapse" id="collapseExample">
                                <div style="display:flex">
                                    ${EditBTN}
                                    ${DelBtn}
                                </div>
                            </div>
                        </div>

                        <div class="card-body" style="background: #282828;">

                            <img src="${POstPic}" class="w-100 rounded-1" height="310px" alt="" onclick="showImage(this.src)"/>
                            
                            <small class="text-secondary">${respone.created_at}</small>
                            
                            <h3>${ThePostTitle}</h3>
                            
                            <p class="card-text mt-2">
                            ${respone.body}
                            </p>
                            
                            <hr>
                            
                            <p>(${respone.comments_count}) comments</p>
                            
                            <button id="CommentBTN${respone.id}" class="btn btn-secondary" onclick="CommentInPost(${respone.id})">Comments</button>
                            <span class="ms-4" id="tags">
                            ${Tags} 
                        
                            </span>
                        </div>
                    </div>
`;
                CommentBtnChange(respone.id);
            }
        })
        .catch((err) => {
            console.error("Error:" + err);
        });
}
GetPosts(); 
// window.GetPosts = GetPosts;

function CommentBtnChange(CommentIdChanger) {
    const UserToken = localStorage.getItem("token");

    let CommentBtn = document.getElementById(`CommentBTN${CommentIdChanger}`);

    if (UserToken == null) {
        CommentBtn.style.display = "none";
    } else {
        CommentBtn.style.display = "block";
    }
}




function DoEdit(PostObj) {
    let post = JSON.parse(decodeURIComponent(PostObj));

    console.log(post.id);

    document.getElementById("PostModalId").innerHTML = "Edit the post";
    document.getElementById("NewPostTitle").innerHTML = "Edit the title";
    document.getElementById("NewPostBody").innerHTML = "Edit the body";
    document.getElementById("NewPostImage").innerHTML = "Edit the image";
    document.getElementById("CreateClick").innerHTML = "Edit";

    document.getElementById("post-id-input").value = post.id;

    document.getElementById("Create-post-title").innerHTML = post.title;
    document.getElementById("Create-post-body").innerHTML = post.body;
    document.getElementById("Create-Image").innerHTML = post.image;

    let ModalId = document.getElementById("NewPostModal");

    let EditModal = new bootstrap.Modal(ModalId, {});

    EditModal.toggle();
}
window.DoEdit = DoEdit;

function CreateModal() {
    document.getElementById("PostModalId").innerHTML = "Create a new post";
    document.getElementById("NewPostTitle").innerHTML = "Title:";
    document.getElementById("NewPostBody").innerHTML = "body:";
    document.getElementById("NewPostImage").innerHTML = "The post image:";
    document.getElementById("CreateClick").innerHTML = "Create";

    document.getElementById("Create-post-title").innerHTML = "";
    document.getElementById("Create-post-body").innerHTML = "";
    document.getElementById("Create-Image").innerHTML = "";

    let ModalId = document.getElementById("NewPostModal");

    let createModal = new bootstrap.Modal(ModalId, {});

    createModal.toggle();
}
window.CreateModal = CreateModal;

function DoDelete(current) {
    document.getElementById("Delete-post-id").value = current;

    let ModalId = document.getElementById("DeleteModal");

    let DeleteModal = new bootstrap.Modal(ModalId, {});

    DeleteModal.toggle();
}
window.DoDelete = DoDelete;

function DoConfirm() {
    let current = document.getElementById("Delete-post-id").value;
    let token = localStorage.getItem("token");
    axios
        .delete(`https://tarmeezacademy.com/api/v1/posts/${current}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            appendAlert("Post has been deleted successfully", "success");
            const Delete_Modal = document.getElementById("DeleteModal");

            const Delete_Instance = bootstrap.Modal.getInstance(Delete_Modal);

            Delete_Instance.hide();
            GetPosts();
        })
        .catch((err) => {
            let errors = err.response.data.errors;
            for (let ErrorKey in errors) {
                appendAlert(
                    errors[ErrorKey][errors[ErrorKey].length - 1],
                    "danger"
                );
            }
        });
}
window.DoConfirm = DoConfirm;

function DoCreate() {
    let postId = document.getElementById("post-id-input").value;
    let CreateCondetion = postId == null || postId == "";

    let PostTitle = document.getElementById("Create-post-title").value;
    let PostBody = document.getElementById("Create-post-body").value;
    let PostImage = document.getElementById("Create-Image").files[0];
    let MyAuthToken = localStorage.getItem("token");
    let Form_Data = new FormData();
    Form_Data.append("title", PostTitle);
    Form_Data.append("body", PostBody);
    Form_Data.append("image", PostImage);
    let url;
    let alertMessage = "";
    if (CreateCondetion) {
        url = `https://tarmeezacademy.com/api/v1/posts`;
        alertMessage = "Post created successfully";
    } else {
        url = `https://tarmeezacademy.com/api/v1/posts/${postId}`;
        Form_Data.append("_method", "put");
        alertMessage = "Post edited successfully";
    }
    axios
        .post(url, Form_Data, {
            headers: {
                "Content-Type": "multipart/form-data",
                authorization: `Bearer ${MyAuthToken}`,
            },
        })
        .then((response) => {
            appendAlert(alertMessage, "success");
            const CreatePost_Modal = document.getElementById("NewPostModal");

            const CreatePost_Instance =
                bootstrap.Modal.getInstance(CreatePost_Modal);

            CreatePost_Instance.hide();

            GetPosts();
        })
        .catch((err) => {
            let errors = err.response.data.errors;
            for (let ErrorKey in errors) {
                appendAlert(
                    errors[ErrorKey][errors[ErrorKey].length - 1],
                    "danger"
                );
            }
        });
}
window.DoCreate = DoCreate;

function CommentInPost(current) {
    window.location = `post.html?postId=${current}`;
}
window.CommentInPost = CommentInPost;