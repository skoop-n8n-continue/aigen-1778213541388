/**
 * Hello World App Logic
 * Skoop Signage Platform
 */

async function loadAppData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to load app data:', error);
        return null;
    }
}

async function init() {
    const data = await loadAppData();
    if (!data) return;

    const sections = data.sections;
    const settings = sections.app_settings;
    const storefront = sections.storefront;

    // 1. Apply Styles from Data
    document.documentElement.style.setProperty('--primary-color', settings.primary_color.value);
    document.documentElement.style.setProperty('--text-color', settings.text_color.value);

    // 2. Apply Background
    const container = document.getElementById('app-container');
    if (storefront.background_image.value) {
        container.style.backgroundImage = `url(${storefront.background_image.value})`;
    }

    // 3. Populate Header & Hero
    document.querySelector('header h1').textContent = storefront.app_name.value;
    document.querySelector('.logo').src = storefront.logo.value;

    if (settings.show_logo.value === false) {
        document.querySelector('.logo').style.display = 'none';
    }

    document.querySelector('.headline').textContent = storefront.headline.value;
    document.querySelector('.subheadline').textContent = storefront.subheadline.value;

    // 4. Render Features Collection
    const features = sections.features.value;
    const featuresGrid = document.querySelector('.features-grid');

    featuresGrid.innerHTML = ''; // Clear existing content

    features.forEach((feature, index) => {
        const card = document.createElement('div');
        card.className = 'feature-card';

        // Add live preview bindings
        card.innerHTML = `
            <h3 data-bind-text="features.${index}.title">${feature.title}</h3>
            <p data-bind-text="features.${index}.description">${feature.description}</p>
        `;

        featuresGrid.appendChild(card);
    });

    // 5. Reveal the App
    // Wait a tiny bit for images to load if needed, then reveal
    setTimeout(() => {
        container.classList.add('loaded');
    }, 100);
}

// Start the application
init();
