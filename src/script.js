const mask = document.querySelector('.mask');

document.addEventListener('pointermove', (pos) => updateMousePos(pos));

function updateMousePos(pos){
    let x = parseInt(pos.clientX / window.innerWidth * 100);
    let y = parseInt(pos.clientY / window.innerHeight * 100);

    mask.style.setProperty('--mouse-x', x + '%');
    mask.style.setProperty('--mouse-y', y + '%'); 
}
window.addEventListener('resize', updateDivPos);
window.addEventListener('load', updateDivPos);
window.addEventListener('scroll', updateDivPos);

function updateDivPos() {
    const scrollPosition = window.scrollY; // Current vertical scroll position
    mask.style.setProperty('top', `${scrollPosition}px`);
}


const toggleButton = document.getElementById('toggleButton');
const pictureContainer = document.getElementById('pictureContainerUJ');

toggleButton.addEventListener('click', () => {
  // Toggle between 'collapsed' and 'expanded' classes
  pictureContainer.classList.toggle('collapsed');
  pictureContainer.classList.toggle('expanded');

  // Update button text
  if (pictureContainer.classList.contains('expanded')) {
    toggleButton.innerHTML = '&#x25B2;'; 
  } else {
    toggleButton.innerHTML = '&#x25BC;';
  }
});

function redirectToWebsite(url) {
  window.location.href = url; // Replace with your URL
}