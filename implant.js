document.addEventListener('DOMContentLoaded', function() {
    const boxes = document.querySelectorAll('.box');
    
    function fadeInBoxes() {
        boxes.forEach((box, index) => {
            setTimeout(() => {
                box.style.opacity = '1';
            }, index * 200); // Delay each box by 200ms
        });
    }
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function checkVisibility() {
        boxes.forEach(box => {
            if (isElementInViewport(box)) {
                fadeInBoxes();
            }
        });
    }

    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Check visibility on page load
});
window.addEventListener('scroll', function() {
    var box1 = document.getElementById('box1');
    var box2 = document.getElementById('box2');
    var box3 = document.getElementById('box3');
    var box4 = document.getElementById('box4');
    var box5 = document.getElementById('box5');
    var box1Position = box1.getBoundingClientRect().top;
    var box2Position = box2.getBoundingClientRect().top;
    var box3Position = box3.getBoundingClientRect().top;
    var box4Position = box4.getBoundingClientRect().top;
    var box5Position = box5.getBoundingClientRect().top;
    var screenHeight = window.innerHeight;
    var scrollPosition = window.scrollY;

    if (box1Position <= screenHeight / 2 && box1Position + box1.clientHeight >= screenHeight / 2) {
        box1.style.transform = 'scale(1.1)'; // Adjust scale value for zoom effect
    } else {
        box1.style.transform = 'scale(1)';
    }

    if (box2Position <= screenHeight / 2 && box2Position + box2.clientHeight >= screenHeight / 2) {
        box2.style.transform = 'scale(1.1)'; // Adjust scale value for zoom effect
    } else {
        box2.style.transform = 'scale(1)';
    }
    if (box3Position <= screenHeight / 2 && box3Position + box3.clientHeight >= screenHeight / 2) {
        box3.style.transform = 'scale(1.1)'; // Adjust scale value for zoom effect
    } else {
        box3.style.transform = 'scale(1)';
    }
    if (box4Position <= screenHeight / 2 && box4Position + box4.clientHeight >= screenHeight / 2) {
        box4.style.transform = 'scale(1.1)'; // Adjust scale value for zoom effect
    } else {
        box4.style.transform = 'scale(1)';
    }
    if (box5Position <= screenHeight / 2 && box5Position + box5.clientHeight >= screenHeight / 2) {
        box5.style.transform = 'scale(1.1)'; // Adjust scale value for zoom effect
    } else {
        box5.style.transform = 'scale(1)';
    }
});


