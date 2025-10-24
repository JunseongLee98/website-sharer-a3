
async function previewUrl(){
    let url = document.getElementById("urlInput").value;
    
    try {
        const response = await fetch(`/api/v1/urls/preview?url=${encodeURIComponent(url)}`);
        
        if (response.ok) {
            const preview = await response.text();
            displayPreviews(preview);
        } else {
            const errorText = await response.text();
            displayPreviews(`Error: ${errorText}`);
        }
    } catch (error) {
        displayPreviews(`Error: ${error.message}`);
    }
}

function displayPreviews(previewHTML){
    document.getElementById("url_previews").innerHTML = previewHTML;
}
