
async function previewUrl(){
    let url = document.getElementById("urlInput").value;
    
    if (!url) {
        showStatusMessage("Please enter a URL", "error");
        return;
    }
    
    try {
        const response = await fetch(`/api/${apiVersion}/urls/preview?url=${encodeURIComponent(url)}`);
        
        if (response.ok) {
            const preview = await response.text();
            displayPreviews(preview);
            showStatusMessage("Preview generated successfully!", "success");
        } else {
            const errorText = await response.text();
            displayPreviews(`Error: ${errorText}`);
            showStatusMessage("Error generating preview", "error");
        }
    } catch (error) {
        displayPreviews(`Error: ${error.message}`);
        showStatusMessage("Error generating preview", "error");
    }
}

async function postUrl(){
    let url = document.getElementById("urlInput").value;
    let description = document.getElementById("descriptionInput").value;
    let username = document.getElementById("usernameInput").value;
    
    if (!url || !description || !username) {
        showStatusMessage("Please fill in all fields", "error");
        return;
    }
    
    try {
        const response = await fetch(`/api/${apiVersion}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: url,
                description: description,
                username: username
            })
        });
        
        const result = await response.json();
        
        if (response.ok && result.status === "success") {
            showStatusMessage("Successfully uploaded!", "success");
            // Clear the form
            document.getElementById("urlInput").value = "";
            document.getElementById("descriptionInput").value = "";
            document.getElementById("usernameInput").value = "";
            // Refresh posts
            loadPosts();
        } else {
            showStatusMessage(`Error: ${result.error}`, "error");
        }
    } catch (error) {
        showStatusMessage(`Error: ${error.message}`, "error");
    }
}

async function loadPosts(){
    try {
        const response = await fetch(`/api/${apiVersion}/posts`);
        
        if (response.ok) {
            const posts = await response.json();
            displayPosts(posts);
        } else {
            const errorText = await response.text();
            showStatusMessage("Error loading posts", "error");
        }
    } catch (error) {
        showStatusMessage("Error loading posts", "error");
    }
}

function displayPreviews(previewHTML){
    document.getElementById("url_previews").innerHTML = previewHTML;
}

function displayPosts(posts){
    const postsContainer = document.getElementById("posts");
    
    if (posts.length === 0) {
        postsContainer.innerHTML = "<p class='text-muted'>No posts yet. Be the first to share a website!</p>";
        return;
    }
    
    let postsHTML = "";
    posts.forEach(post => {
        postsHTML += `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="card-subtitle mb-1 text-muted">Posted by ${post.username}</h6>
                        <small class="text-muted">${new Date(post.created_date).toLocaleString()}</small>
                    </div>
                    <p class="card-text">${post.description}</p>
                    ${post.htmlPreview}
                </div>
            </div>
        `;
    });
    
    postsContainer.innerHTML = postsHTML;
}

function showStatusMessage(message, type) {
    const statusDiv = document.getElementById("statusMessage");
    statusDiv.innerHTML = `<div class="alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        statusDiv.innerHTML = "";
    }, 5000);
}

// Load posts when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
});
