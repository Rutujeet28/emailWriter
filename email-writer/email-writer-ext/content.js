// Email Writer Extension - Content Script
// This script runs on Gmail pages to add AI reply generation functionality
console.log("Email Writer Extension - Content Script Loaded");

/**
 * Creates the AI Reply button element with Gmail's styling
 * @returns {HTMLElement} The configured button element
 */
function createAIButton() {
   const button = document.createElement('div');
   // Apply Gmail's button styling classes
   button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
   button.style.marginRight = '8px';
   button.innerHTML = 'AI Reply';
   button.setAttribute('role','button');
   button.setAttribute('data-tooltip','Generate AI Reply');
   return button;
}

/**
 * Extracts the email content from the current Gmail view
 * Tries multiple selectors to find the email body content
 * @returns {string} The extracted email content or empty string if not found
 */
function getEmailContent() {
    // Array of CSS selectors to try for finding email content
    const selectors = [
        '.h7',           // Gmail's email body selector
        '.a3s.aiL',      // Alternative email content selector
        '.gmail_quote',  // Quoted email content
        '[role="presentation"]' // Generic presentation role
    ];
    
    // Try each selector until content is found
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
        return '';
    }
}

/**
 * Finds the compose toolbar where the AI button should be injected
 * Tries multiple selectors to locate the toolbar
 * @returns {HTMLElement|null} The toolbar element or null if not found
 */
function findComposeToolbar() {
    // Array of CSS selectors to try for finding the compose toolbar
    const selectors = [
        '.btC',          // Gmail's compose toolbar selector
        '.aDh',          // Alternative toolbar selector
        '[role="toolbar"]', // Generic toolbar role
        '.gU.Up'         // Another Gmail toolbar selector
    ];
    
    // Try each selector until toolbar is found
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
        return null;
    }
}

/**
 * Injects the AI Reply button into the Gmail compose interface
 * Handles button creation, event listeners, and API communication
 */
function injectButton() {
    // Remove any existing AI button to prevent duplicates
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) existingButton.remove();

    // Find the compose toolbar
    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("Toolbar not found");
        return;
    }

    console.log("Toolbar found, creating AI button");
    const button = createAIButton();
    button.classList.add('ai-reply-button');

    // Add click event listener for AI reply generation
    button.addEventListener('click', async () => {
        try {
            // Update button state to show loading
            button.innerHTML = 'Generating...';
            button.disabled = true;

            // Extract email content from the current view
            const emailContent = getEmailContent();
            
            // Make API request to the backend service
            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: "professional" // Default to professional tone
                })
            });

            // Check if the API request was successful
            if (!response.ok) {
                throw new Error('API Request Failed');
            }

            // Get the generated reply text
            const generatedReply = await response.text();
            
            // Find the compose text box to insert the generated reply
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

            if (composeBox) {
                // Focus the compose box and insert the generated text
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            } else {
                console.error('Compose box was not found');
            }
        } catch (error) {
            // Handle errors and show user feedback
            console.error(error);
            alert('Failed to generate reply');
        } finally {
            // Reset button state
            button.innerHTML = 'AI Reply';
            button.disabled =  false;
        }
    });

    // Insert the button at the beginning of the toolbar
    toolbar.insertBefore(button, toolbar.firstChild);
}

/**
 * MutationObserver to watch for changes in the DOM
 * Detects when compose windows are opened and injects the AI button
 */
const observer = new MutationObserver((mutations) => {
    for(const mutation of mutations) {
        // Get all added nodes from the mutation
        const addedNodes = Array.from(mutation.addedNodes);
        
        // Check if any of the added nodes contain compose elements
        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE && 
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );

        // If compose elements are detected, inject the AI button
        if (hasComposeElements) {
            console.log("Compose Window Detected");
            // Small delay to ensure DOM is fully rendered
            setTimeout(injectButton, 500);
        }
    }
});

// Start observing the document body for DOM changes
observer.observe(document.body, {
    childList: true,  // Watch for child node additions/removals
    subtree: true     // Watch the entire subtree
});