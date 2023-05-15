/*!
* Start Bootstrap - Small Business v5.0.6 (https://startbootstrap.com/template/small-business)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-small-business/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

var checker = document.getElementById('checkme');
var sendbtn = document.getElementById('sendNewSms');
// when unchecked or checked, run the function
checker.onchange = function(){
if(this.checked){
   sendbtn.disabled = false;
} else {
   sendbtn.disabled = true;
}

}