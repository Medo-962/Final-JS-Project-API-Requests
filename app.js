import axios from "./node_modules/axios/dist/esm/axios.js";

import * as boot from "./node_modules/@popperjs/core/dist/esm/index.js";

/* 

1-you can log in(by including username and a password)+(it does show the create post button and you pfp + name);

2-you can register(by including name, username,password and pfp)+(its also show the create button and name +pfp)

3-you can logout (remove the authentication from you to comment,create posts )+(hide create post,Comment buttons and you name+pfp)

4-adding a custom alert to notify the user of what happens 

5-no hard code of any thing all of the infos are from the api

6-I handle the count of visible posts by using Pagination concept so I achieve the infinte scroll concept

*/

//Global Vars

let PageCounter = 1;
let lastPage = 1;

//Images show

//Get the posts
document.addEventListener("DOMContentLoaded", () => {
    function GetPosts(Clear = true, ThePage = 1) {
        let post = document.getElementById(`posts`);
        if (Clear == true) {
            post.innerHTML = ``;
        }

        axios
            .get(
                `https://tarmeezacademy.com/api/v1/posts?limit=5&page=${ThePage}`
            )
            .then((result) => {
                console.log(result);

                lastPage = result.data.meta.last_page;

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
                            "./Imgs/Posts-Pics/1200px-HD_transparent_picture.png";
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
    window.GetPosts = GetPosts;
});

//Pagination function
window.addEventListener("scroll", function () {
    const totalHeight = document.documentElement.scrollHeight;

    const scrollPosition = window.scrollY + window.innerHeight;

    const offset = 0.8;
    let loader = document.getElementById("TheLoader");
    if (scrollPosition >= totalHeight - offset && PageCounter <= lastPage) {
        console.log("You are near the end of the page!");
        PageCounter++;
        GetPosts(false, PageCounter);
        loader.style.display = "flex";
    }
    else {
        loader.style.display = "none";
    }
    if(loader.style.display=="flex"){
        this.setTimeout(()=>{
        loader.style.display="none";
        },1000);
    }
});

//Craete A New Post
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

//here I grab the post modal to edit it then make it the edit modal so I can reuse it without coping
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

//showing the logged in user info or removing

function CommentBtnChange(CommentIdChanger) {
    const UserToken = localStorage.getItem("token");

    let CommentBtn = document.getElementById(`CommentBTN${CommentIdChanger}`);

    if (UserToken == null) {
        CommentBtn.style.display = "none";
    } else {
        CommentBtn.style.display = "block";
    }
}

function CommentInPost(current) {
    window.location = `post.html?postId=${current}`;
}
window.CommentInPost = CommentInPost;

function TakeToOwnProfile(){
    let user = JSON.parse(localStorage.getItem("username"));
    window.location = `profile.html?UserID=${user.id}`;
}
window.TakeToOwnProfile=TakeToOwnProfile;

function TakeToProfile(CurrentuserId) {
    window.location = `profile.html?UserID=${CurrentuserId}`;
}
window.TakeToProfile = TakeToProfile;