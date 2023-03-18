const boxes = document.querySelector('.boxes'),
    wrapper = document.querySelector('.wrapper'),
    box = document.querySelectorAll('.box'),
    width = document.querySelector('.shortcontainer').offsetWidth,
    parent = document.querySelector('.dots');

var offset = 1,
    defaultWidth = (width / 2) - (box[0].offsetWidth / 2),
    boxesWidth = box[0].offsetWidth + 30

box.forEach(item => {
    const div = document.createElement('div');
    div.className = 'dot';
    parent.append(div);
})

const dot = document.querySelectorAll('.dot');

function refresh() {
    boxes.style.paddingLeft = defaultWidth + "px";
    boxes.style.transform = `translateX(-${boxesWidth * offset}px)`;
    dot[offset].classList.add('active');
    box[offset].classList.add('activeBox');
}

refresh();

dot.forEach((item, ind) => {
    item.addEventListener('click', () => {
        dot.forEach(d => d.classList.remove('active'));
        box.forEach(b => b.classList.remove('activeBox'));
        offset = ind;
        refresh();

    })

})