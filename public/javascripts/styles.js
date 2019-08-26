//Funcationality for Sticky Navbar
const nav = document.querySelector('#main');
let topOfNav = nav.offsetTop; //sets top of nav position to be relative rather than hardcoding a fixd position

function fixNav() {
  if (window.scrollY >= topOfNav) {
    document.body.style.paddingTop = nav.offsetHeight + 'px';
    document.body.classList.add('fixed-nav');
  } else {
    document.body.classList.remove('fixed-nav');
    document.body.style.paddingTop = 0;
  }
}

window.addEventListener('scroll', fixNav);

//USER UPLOAD PICS
// function previewFile(){
//     var preview = document.querySelector('img'); //selects the query named img
//     var file    = document.querySelector('input[type=file]').files[0]; //sames as here
//     var reader  = new FileReader();

//     const profilePic = `
//     SELECT picture 
//     FROM users
//     WHERE id = req.session.id
//     `
    
//     reader.onloadend = function () {
//         preview.src = reader.result;
//     }

//     if (file) {
//         reader.readAsDataURL(file); //reads the data as a URL
//     } else {
//         preview.src = "";
//     }
// }

// previewFile();  //calls the function named previewFile()
