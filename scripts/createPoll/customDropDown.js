document.addEventListener('DOMContentLoaded', function() {
    // Dropdown options data
    const options = [
        { id: 'image-poll', label: 'Image poll', icon: 'image' },
        { id: 'multiple-choice', label: 'Multiple choice', icon: 'check-circle' },
        { id: 'meeting-poll', label: 'Meeting poll', icon: 'calendar' },
        { id: 'image-poll-2', label: 'Image poll', icon: 'image', selected: true },
        { id: 'ranking-poll', label: 'Ranking poll', icon: 'bar-chart' }
    ];

    // Icon SVG paths
    const icons = {
        'image': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>',
        'check-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        'calendar': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
        'bar-chart': '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>'
    };

    // Check icon for selected item
    const checkIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

    // DOM elements
    const dropdownButton = document.getElementById('dropdownButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const selectedOptionText = document.getElementById('selectedOptionText');
    const dropdownButtonIcon = dropdownButton.querySelector('.dropdown-button-content .dropdown-icon');

    // Find initially selected option
    let selectedOption = options.find(option => option.selected) || options[0];

    // Initialize dropdown with selected option
    updateSelectedOption(selectedOption);

    // Populate dropdown menu with options
    populateDropdownMenu();

    // Toggle dropdown on button click
    dropdownButton.addEventListener('click', function() {
        toggleDropdown();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = dropdownButton.contains(event.target) || dropdownMenu.contains(event.target);
        if (!isClickInside && dropdownMenu.classList.contains('active')) {
            closeDropdown();
        }
    });

    // Functions
    function toggleDropdown() {
        dropdownButton.classList.toggle('active');
        dropdownMenu.classList.toggle('active');
    }

    function closeDropdown() {
        dropdownButton.classList.remove('active');
        dropdownMenu.classList.remove('active');
    }

    function populateDropdownMenu() {
        // Clear existing items
        dropdownMenu.innerHTML = '';

        // Add each option to the dropdown
        options.forEach(option => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            if (option.id === selectedOption.id) {
                item.classList.add('selected');
            }

            item.innerHTML = `
                <div class="dropdown-item-icon">${icons[option.icon]}</div>
                <div class="dropdown-item-text">${option.label}</div>
                <div class="check-icon">${checkIcon}</div>
            `;

            item.addEventListener('click', function() {
                selectOption(option);
            });

            dropdownMenu.appendChild(item);
        });
    }

    function selectOption(option) {
        selectedOption = option;
        updateSelectedOption(option);
        closeDropdown();
        
        // Re-populate to update selected state
        populateDropdownMenu();
        
        // You can add a callback here if needed
        console.log('Selected:', option);
    }

    function updateSelectedOption(option) {
        selectedOptionText.textContent = option.label;
        dropdownButtonIcon.innerHTML = icons[option.icon];
    }
});