document.addEventListener('DOMContentLoaded', function() {
    const addOptionBtn = document.getElementById('add-option');
    const optionsContainer = document.querySelector('.options-container');
    
    const MAX_IMAGES = 4;
    
    function checkImageLimit() {
        const currentImages = document.querySelectorAll('.option-card').length;
        
        if (currentImages >= MAX_IMAGES) {
            addOptionBtn.classList.add('disabled');
            
            if (!document.querySelector('.limit-reached')) {
                const limitMsg = document.createElement('div');
                limitMsg.classList.add('limit-reached');
                limitMsg.textContent = 'Maximum of 4 images reached';
                addOptionBtn.appendChild(limitMsg);
            }
            return true;
        } else {
            addOptionBtn.classList.remove('disabled');
            const limitMsg = addOptionBtn.querySelector('.limit-reached');
            if (limitMsg) {
                addOptionBtn.removeChild(limitMsg);
            }
            return false;
        }
    }
    
    function createOptionCard() {
        if (checkImageLimit()) {
            return;
        }
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.classList.add('file-input');
        document.body.appendChild(fileInput);
        
        fileInput.click();
        
        fileInput.addEventListener('change', function(e) {
            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const newCard = document.createElement('div');
                    newCard.classList.add('option-card');
                    
                    newCard.innerHTML = `
                        <div class="image-container">
                            <img src="${e.target.result}" alt="Selected image">
                            <button type="button" class="delete-btn">&times;</button>
                        </div>
                        <input type="text" class="option-label" placeholder="Label (optional)">
                    `;
                    
                    optionsContainer.insertBefore(newCard, addOptionBtn);
                    
                    const deleteBtn = newCard.querySelector('.delete-btn');
                    deleteBtn.addEventListener('click', function() {
                        newCard.remove();
                        checkImageLimit(); 
                    });
                    
                    // Check if limit is reached after adding
                    checkImageLimit();
                };
                
                reader.readAsDataURL(fileInput.files[0]);
                
                // Remove the file input from the DOM
                document.body.removeChild(fileInput);
            }
        });
    }
    
    // Add event listener to the add option button
    addOptionBtn.addEventListener('click', function() {
        if (!addOptionBtn.classList.contains('disabled')) {
            createOptionCard();
        }
    });
    
    // Form submission
    const form = document.getElementById('answer-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect all option data
        const options = [];
        document.querySelectorAll('.option-card').forEach(card => {
            const imgSrc = card.querySelector('img').src;
            const label = card.querySelector('.option-label').value;
            
            options.push({
                image: imgSrc,
                label: label
            });
        });
        
        if (options.length === 0) {
            alert('Please select at least one image before submitting.');
            return;
        }
        
        // Here you would typically send this data to a server
        console.log('Form submitted with options:', options);
        alert('Form submitted successfully with ' + options.length + ' image(s)!');
    });
});