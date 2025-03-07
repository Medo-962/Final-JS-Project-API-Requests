import axios from "./node_modules/axios/dist/esm/axios.js";

const urlParams = new URLSearchParams(window.location.search);

const id = urlParams.get("postId");

console.log(id);

let post = document.getElementById(`posts`);

/*  */

/*  */

function getPost() {
    post.innerHTML = ``;
    axios
        .get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
        .then((result) => {
            console.log(result);
            let getcomments = result.data.data.comments;
            let comments = "";
            for (const comment of getcomments) {
                let CommentPfP = comment.author.profile_image;
                if (CommentPfP && Object.keys(CommentPfP).length === 0) {
                    CommentPfP = "./Imgs/pfp/person-placeholder-300x300.jpeg";
                }
                comments += `<li class="cmntLstBrdr list-group-item list-group-item-action bg-dark text-bg-dark border rounded mb-2">
                    <div class="mb-3">

                        <img 
                        src="${CommentPfP}"
                        alt="pfp"
                        id="TheUserPfP"
                        class="thepfp border border-2 me-2"
                        onclick="showImage(this.src)"
                        /> 
                        
                        <a id="TheMainUserName" class="navbar-brand" href="#" style="font-weight: 900;">${comment.author.username}</a>
                    </div>
                    ${comment.body}
                    
                </li>`;
            }

            let response = result.data.data;
            document.getElementById("AuthorName").innerHTML =
                response.author.username + "'s";

            let Tags = "";

            // for (let tag of response.tags) {
            // Tags += `<button class="btn btn-secondary rounded-pill btn-sm"> Mother ${tag}</button> `;
            // }

            /* this is a check for the user image below*/
            let PfP = response.author.profile_image;
            if (PfP && Object.keys(PfP).length === 0) {
                PfP = "./Imgs/pfp/person-placeholder-300x300.jpeg";
            }

            /* this is a check for the post image below*/
            let POstPic = response.image;
            if (POstPic && Object.keys(POstPic).length === 0) {
                POstPic = "./Imgs/Posts-Pics/1200px-HD_transparent_picture.png";
            }
            let ThePostTitle = response.title;
            if (response.title == null) {
                ThePostTitle = "No Title";
            }
            post.innerHTML += `
                <div class="card mt-5 offset-md-2 col-md-8 text-bg-dark shadow">
                    <div class="card-header" style="background: #323232">
                    <img src="${PfP}" alt="pfp" class="thepfp border border-2" onclick="showImage(this.src)"/>
                    <b>${response.author.username}</b>
                </div>
    
                <div class="card-body" style="background: #282828;">
                    
                    <img src="${POstPic}" class="w-100 rounded-1" height="310px" alt="" onclick="showImage(this.src)"/>
                    
                    <small class="text-secondary">${response.created_at}</small>
                    
                    <h3>${ThePostTitle}</h3>
                    
                    <p class="card-text mt-2">
                    ${response.body}
                    </p>
                    
                    <hr>
                    
                    <p>(${response.comments_count}) comments</p>
                    <div class="list-group  mt-3 mb-3">
                    ${comments}
                    </div>

                    <form id="commentForm" style="display: flex; align-items:center">
                    <input type="text" id="CommentSpace" class="bg-dark text-light border rounded-3 ps-3" style="width: 90%; 
                    border-color: #5e5e5e !important; height: 37px;" placeholder="add a comment">

                    <button type="button" id="CommentButton${response.id}" class="btn btn-secondary ms-3" 
                    onclick="addComment(${response.id})">Add</button>
                    </form>
                    <span class="ms-4" id="tags">
                ${Tags} 
                
                </span>
                </div>
            </div>
            `;
        })
        .catch((err) => {
            console.error("Error:" + err);
        });
}

getPost();

function addComment() {
    let token = localStorage.getItem("token");
    let CmntContent = document.getElementById("CommentSpace").value;
    axios
        .post(
            `https://tarmeezacademy.com/api/v1/posts/${id}/comments`,
            {
                body: CmntContent,
            },
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        )
        .then(() => {
            getPost();
            appendAlert("Your comment has been added successfully", "success");
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
window.addComment = addComment;

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



function TakeToOwnProfile(){
    let user = JSON.parse(localStorage.getItem("username"));
    window.location = `profile.html?UserID=${user.id}`;
}
window.TakeToOwnProfile=TakeToOwnProfile;

//todo:
/* 
const input= document.getElementById('CommentSpace');

document.addEventListener('DOMContentLoaded',()=>{

    input.addEventListener('keydown',(e)=>{
        if (e.key == 'Enter') {
            
            addComment(); // Call your custom function
        }
    })
})

 */
