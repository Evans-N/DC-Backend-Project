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