
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
        
        // Check if response is JSON before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            showStatusMessage(`Error: Server returned ${response.status} ${response.statusText}`, "error");
            console.error("Non-JSON response:", text);
            return;
        }
        
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
            showStatusMessage(`Error: ${result.error || 'Unknown error'}`, "error");
        }
    } catch (error) {
        showStatusMessage(`Error: ${error.message}`, "error");
        console.error("Post URL error:", error);
    }
}

async function loadPosts(){
    try {
        const response = await fetch(`/api/${apiVersion}/posts`);
        
        // Check if response is JSON before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Non-JSON response from /api/posts:", text);
            showStatusMessage("Error loading posts: Server returned invalid response", "error");
            return;
        }
        
        if (response.ok) {
            const posts = await response.json();
            displayPosts(posts);
        } else {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            showStatusMessage(`Error loading posts: ${errorData.error || response.statusText}`, "error");
        }
    } catch (error) {
        showStatusMessage(`Error loading posts: ${error.message}`, "error");
        console.error("Load posts error:", error);
    }
}

function displayPreviews(previewHTML){
    const container = document.getElementById("url_previews");
    // If it looks like HTML markup, render as HTML; otherwise, set as textContent to avoid XSS
    if (/<[a-z][\s\S]*>/i.test(previewHTML)) {
        container.innerHTML = previewHTML;
    } else {
        container.textContent = previewHTML;
    }
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
                        <h6 class="card-subtitle mb-1 text-muted">Posted by ${escapeHTML(post.username)}</h6>
                        <small class="text-muted">${new Date(post.created_date).toLocaleString()}</small>
                    </div>
                    <p class="card-text">${escapeHTML(post.description)}</p>
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
        ${escapeHTML(message)}
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

// Basic HTML escaping to prevent XSS when rendering user-provided content
const escapeHTML = str => String(str).replace(/[&<>\'\"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
}[tag]));
