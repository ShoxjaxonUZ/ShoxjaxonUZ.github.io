/*===== MENU SHOW Y HIDDEN =====*/
const navMenu = document.getElementById('nav-menu'),
    toggleMenu = document.getElementById('nav-toggle'),
    closeMenu = document.getElementById('nav-close')

// SHOW
toggleMenu.addEventListener('click', () => {
    navMenu.classList.toggle('show')
})

// HIDDEN
closeMenu.addEventListener('click', () => {
    navMenu.classList.remove('show')
})

/*===== REMOVE MENU =====*/
const navLink = document.querySelectorAll('.nav_link')

function linkAction() {
    navMenu.classList.remove('show')

}

navLink.forEach(n => n.addEventListener('click', linkAction));
/*===== SCROLL SECTIONS ACTIVE LINK =====*/
const sections = document.querySelectorAll('.section[id]')

window.addEventListener('scroll', scrollActive)

function scrollActive() {
    const scrollY = window.pageYOffset

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 5 d0
        var sectionId = current.getAttribute('id')

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav_menu a[href*=' + sectionId + ']').classList.add('active')
        } else {
            document.querySelector('.nav_menu a[href*=' + sectionId + ']').classList.remove('active')
        }
    })
}
/*=============== EMAIL JS ===============*/
const contactForm = document.getElementById('contact-form'),
    contactName = document.getElementById('contact-name'),
    contactEmail = document.getElementById('contact-email'),
    contactProject = document.getElementById('contact-project'),
    contactMessage = document.getElementById('contact-message');

const sendEmail = (e) => {
    e.preventDefault()

    // Check if the field has a value
    if (contactName.value === '' || contactEmail.value === '' || contactProject.value === '') {} else {
        // serviceID - templateID - #form - publicKey
        emailjs.sendForm('service_fc6djwu', 'template_xub82fo', '#contact-form', 'Kd0z8Sd8XvIgJX0rk')

        // To clear the input field
        contactName.value = ''
        contactEmail.value = ''
        contactProject.value = ''
        contactMessage.value = ''
    }
}
contactForm.addEventListener('submit', sendEmail)
contactForm.addEventListener('submit', sendEmail)