const menu = document.querySelector('.link');
const hamburger = document.querySelector('.hamburger')

function defined() {
    menu.style.right = '0';
    hamburger.style.opacity = '0'
}

function colose() {
    menu.style.right = '-300px';
    hamburger.style.opacity = '1'
}