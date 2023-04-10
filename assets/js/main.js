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
const sections = document.querySelectorAll('section[id]')

window.addEventListener('scroll', scrollActive)

function scrollActive() {
    const scrolY = window.pageYOffset


    sections.forEach(current => {
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50
        var sectionId = current.getAttribute('id')

        if (scrolY > sectionTop && scrolY <= sectionTop + sectionHeight) {
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
    contactProject = document.getElementById('contact-project');

const sendEmail = (e) => {
    e.preventDefault()
    if (!(contactName.value === '' ||
            contactEmail.value === '' ||
            contactProject.value === '')) {
        // serviceID - templateID - #form - publicKey
        emailjs.sendForm('service_b7m8f6q', 'template_nxe53la', '#contact-form', 'vO_KhRCIOrb5_IrnA')
            .then(() => {
                alert("Ma'lumotlar yuborildi")
            }, (error) => {
                alert('OOPS! SOMETHING HAS FAILED...', error)
            })
        contactName.value = ''
        contactEmail.value = ''
        contactProject.value = ''
    }
}
contactForm.addEventListener('submit', sendEmail)