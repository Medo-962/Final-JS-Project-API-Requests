import { ChangeBTNs,setTheUserInfo,DoLogin,DoRegister,
    LogOut,GetPosts,scrroling,userInfoControler,showImage
    ,DoCreate,appendAlert,CommentBtnChange} from "./app.js";



GetPosts();
scrroling();
ChangeBTNs();
window.LogOut=LogOut;
window.DoRegister=DoRegister;
window.DoLogin=DoLogin;
setTheUserInfo();
let theToggler=localStorage.getItem('isLoggedToggle');
userInfoControler(JSON.parse(theToggler));
DoCreate();
appendAlert();
CommentBtnChange();
showImage();