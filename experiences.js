"use strict";

const savedUser = localStorage.getItem('resortify_member');
if (savedUser) {
    try {
        const userData = JSON.parse(savedUser);
        const subHeader = document.getElementById('sub-header-text');
        subHeader.innerHTML = `Welcome back, <strong>${userData.name}</strong>. Share your latest journey with us.`;

      
        if (document.getElementById('user-name')) document.getElementById('user-name').value = userData.name;
        if (document.getElementById('user-email')) document.getElementById('user-email').value = userData.email;
    } catch (e) {
        console.error("Error parsing user data", e);
    }
}
document.addEventListener('DOMContentLoaded', () => {

    
    const circles = document.querySelectorAll('.circle');
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
     
        const mainContainer = document.getElementById('main-container');
        const progressBar = document.createElement('div');
        progressBar.id = 'progress-bar';
        mainContainer.appendChild(progressBar);

        const inputsToTrack = document.querySelectorAll('input:not([type="radio"]), textarea');

        inputsToTrack.forEach(input => {
            input.addEventListener('input', () => {
                let filled = 0;
                inputsToTrack.forEach(i => { if (i.value.trim() !== "") filled++; });
                const progress = (filled / inputsToTrack.length) * 100;
                progressBar.style.width = `${progress}%`;
            });
        });
        circles.forEach((circle, index) => {
            const factor = (index + 1) * 20;
            const moveX = (mouseX - window.innerWidth / 2) / factor;
            const moveY = (mouseY - window.innerHeight / 2) / factor;
            circle.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

   
    const starLabels = document.querySelectorAll('.stars label');
    const ratingDesc = document.getElementById('rating-desc');
    const ratingLevels = {
        'star1': 'Room for improvement',
        'star2': 'Average stay',
        'star3': 'Memorable experience',
        'star4': 'Exceptional service',
        'star5': 'Absolute perfection'
    };

    starLabels.forEach(label => {
    
        label.addEventListener('mouseenter', () => {
            const id = label.getAttribute('for');
            ratingDesc.innerText = ratingLevels[id];
            highlightStars(id);
        });

       
        label.addEventListener('mouseleave', () => {
            const checked = document.querySelector('input[name="star"]:checked');
            ratingDesc.innerText = checked ? ratingLevels[checked.id] : 'Rate your experience';
            resetHighlights();
        });
    });

    function highlightStars(id) {
        let matchFound = false;
        starLabels.forEach(l => {
            l.classList.add('hovered');
            if (l.getAttribute('for') === id) matchFound = true;
          
        });
    }

    function resetHighlights() {
        starLabels.forEach(l => l.classList.remove('hovered'));
    }

    const inputs = document.querySelectorAll('input:not([type="radio"]), textarea');

    inputs.forEach(input => {
        const line = input.nextElementSibling; 

        input.addEventListener('focus', () => {
            line.style.transition = "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
            line.style.width = "100%";
            line.style.background = "#ad8b3a";
            line.style.height = "2px";
        });

        input.addEventListener('blur', () => {
            if (input.value.trim() === "") {
                line.style.width = "100%";
                line.style.background = "rgba(255,255,255,0.2)";
                line.style.height = "1px";
            }
        });
    });

    const experienceForm = document.getElementById('experience-form');
    const postBtn = document.getElementById('post-btn');

    experienceForm.addEventListener('submit', (e) => {
        e.preventDefault();

        postBtn.style.pointerEvents = "none";
        postBtn.innerHTML = `<span>POSTING...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>`;
        postBtn.style.background = "#444";

      
        const postStory = new Promise((resolve) => {
            setTimeout(() => {
                resolve("Success");
            }, 2500);
        });

        postStory.then(() => {

const userName = document.getElementById('user-name').value;
const userEmail = document.getElementById('user-email').value;


localStorage.setItem('resortify_member', JSON.stringify({
    name: userName,
    email: userEmail
}));
            triggerSuccessUI();
        });
    });

    function triggerSuccessUI() {
        const mainContainer = document.getElementById('main-container');

    
        mainContainer.style.transition = "opacity 0.8s ease";
        mainContainer.style.opacity = "0";

        setTimeout(() => {
            mainContainer.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <i class="fa-solid fa-feather" style="font-size: 3rem; color: #ad8b3a; margin-bottom: 25px;"></i>
                    <h1 style="font-family: 'Playfair Display';">The Legacy Continues</h1>
                    <p style="color: #888; margin-bottom: 40px; letter-spacing: 1px;">
                        Your breath-taking moments have been archived in our records.
                    </p>
                    <button onclick="window.location.href='index.html'" 
                            style="padding: 15px 40px; background: transparent; border: 1px solid #ad8b3a; color: #ad8b3a; cursor: pointer; letter-spacing: 2px;">
                        RETURN TO REVERY
                    </button>
                </div>
            `;
            mainContainer.style.opacity = "1";
        }, 800);
    }
});
