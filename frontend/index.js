const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');

// Redirect to auth page if not logged in
if (!token) {
    window.location.href = 'auth.html';
}

// Function to upload file
function uploadFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const cancelBtn = document.getElementById('cancel-btn');

    xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_URL}/upload`, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.addEventListener('progress', function (e) {
        if (e.lengthComputable) {
            const percent = (e.loaded / e.total) * 100;
            progressBar.style.width = percent + '%';
            progressBar.textContent = Math.round(percent) + '%';
            progressContainer.style.display = 'block';
            cancelBtn.style.display = 'block';  // Show the cancel button during upload
        }
    });

    xhr.onload = function () {
        // Log the raw response to the console
        console.log('Server response:', xhr.responseText);

        let response;
        try {
            // Check if the response is JSON or plain text
            response = JSON.parse(xhr.responseText);
        } catch (e) {
            // If JSON parsing fails, assume it's plain text
            response = xhr.responseText;
        }

        if (xhr.status >= 200 && xhr.status < 400) {
            if (typeof response === 'object' && response.url) {
                alert('File uploaded successfully');
            } else {
                // Handle plain text response
                alert('File uploaded successfully');
            }

            // Hide the progress bar after successful upload
            document.getElementById('progress-container').style.display = 'none';
            document.getElementById('progress-bar').style.width = '0%';  // Reset the progress bar
            document.getElementById('progress-bar').textContent = '0%';  // Reset progress text
            cancelBtn.style.display = 'none';  // Hide the cancel button

            fetchFiles();  // Refresh file list after upload
        } else {
            alert('Error uploading file.');
            document.getElementById('progress-container').style.display = 'none';  // Hide progress bar on error
            cancelBtn.style.display = 'none';  // Hide the cancel button
        }
    };

    xhr.onerror = function () {
        alert('Error uploading file.');
        progressContainer.style.display = 'none';  // Hide the progress bar
        cancelBtn.style.display = 'none';  // Hide the cancel button
    };

    xhr.send(formData);
}

// Function to cancel upload
function cancelUpload() {
    if (xhr) {
        xhr.abort();
        alert('Upload canceled.');
        document.getElementById('progress-container').style.display = 'none';  // Hide the progress bar
        document.getElementById('progress-bar').style.width = '0%';  // Reset the progress bar
        document.getElementById('progress-bar').textContent = '0%';  // Reset the progress text
        document.getElementById('cancel-btn').style.display = 'none';  // Hide the cancel button
    }
}

// Function to fetch uploaded files
function fetchFiles(sortOption = 'date-desc') {
    fetch(`${API_URL}/files`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            const fileList = document.getElementById('file-list');
            fileList.innerHTML = ''; // Clear any existing list items

            // Sort files based on the selected option
            data.sort((a, b) => {
                switch (sortOption) {
                    case 'name-asc':
                        return a.key.localeCompare(b.key);
                    case 'name-desc':
                        return b.key.localeCompare(a.key);
                    case 'date-asc':
                        return new Date(a.uploadDate) - new Date(b.uploadDate);
                    case 'date-desc':
                        return new Date(b.uploadDate) - new Date(a.uploadDate);
                    default:
                        return 0;
                }
            });

            data.forEach(file => {
                const li = document.createElement('li');

                // Create View button
                const viewBtn = document.createElement('button');
                viewBtn.textContent = 'View';
                viewBtn.onclick = function () {
                    openOverlay(file);
                };
                viewBtn.style.width = 'min-content';

                li.appendChild(document.createTextNode(file.originalName || 'Unknown'));
                li.appendChild(viewBtn);
                fileList.appendChild(li);
            });
        })
        .catch(err => {
            console.error('Error fetching file list:', err);
            alert('Failed to load files');
        });
}

// Function to sort files based on selected option
function sortFiles() {
    const sortOption = document.getElementById('sort-options').value;
    fetchFiles(sortOption);  // Fetch files with the selected sorting option
}

// Function to delete a file
function deleteFile(fileKey) {
    if (confirm(`Are you sure you want to delete ${fileKey}?`)) {
        fetch(`${API_URL}/files/${fileKey}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,  // Ensure token is passed
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (response.ok) {
                    alert('File deleted successfully');
                    fetchFiles();  // Refresh file list
                } else {
                    alert('Failed to delete file');
                }
            })
            .catch(err => {
                console.error('Error deleting file:', err);
                alert('Error deleting file');
            });
    }
}
//Fetch storage data
function updateStorageBar() {
    fetch(`${API_URL}/storage`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            const storageBar = document.getElementById('storage-bar');
            const storageText = document.getElementById('storage-number');
            const usedPercentage = data.usedStoragePercentage.toFixed(2);
            storageBar.style.width = `${usedPercentage}%`;
            storageText.textContent = `${usedPercentage}% used`;
        })
        .catch(error => console.error('Error fetching storage data:', error));
}

//File filter function
function filterFiles() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const fileList = document.getElementById('file-list');
    const files = fileList.getElementsByTagName('li');

    for (let i = 0; i < files.length; i++) {
        const fileName = files[i].textContent.toLowerCase();
        if (fileName.includes(searchInput)) {
            files[i].style.display = "";
        } else {
            files[i].style.display = "none";
        }
    }
}

// Function to open the overlay sidebar
function openOverlay(file) {
    // Handle missing or undefined uploadDate and size
    const uploadDate = file.uploadDate ? new Date(file.uploadDate).toLocaleDateString() : 'Unknown';
    const size = file.fileSize ? file.fileSize : 'Unknown';
    const sizeInMB = (size / (1024 * 1024)).toFixed(2);

    document.getElementById('overlay-sidebar').style.width = '400px';
    document.getElementById('file-name').textContent = file.originalName;
    document.getElementById('file-details').textContent = `Uploaded on: ${uploadDate} | Size: ${sizeInMB} MB`;

    const filePreview = document.getElementById('file-preview');

    // Determine if the file is previewable in an iframe
    const previewableTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];

    if (previewableTypes.includes(file.mimeType)) {
        filePreview.src = file.fileUrl;
        filePreview.style.display = 'block';

    } else {
        filePreview.style.display = 'none';

    }

    const downloadBtn = document.getElementById('download-btn');
    downloadBtn.onclick = function () {
        window.location.href = `${API_URL}/files/download/${file.key}`;
    };

    const deleteBtn = document.getElementById('delete-btn');
    deleteBtn.onclick = function () {
        deleteFile(file.key);
        closeOverlay();
    };
}

// Function to log out
document.getElementById('logoutLink').onclick = function () {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('token');
        window.location.href = 'auth.html';
    }
};

// Function to close the overlay sidebar
function closeOverlay() {
    document.getElementById('overlay-sidebar').style.width = '0';
}

// Call updateStorageBar on page load
document.addEventListener('DOMContentLoaded', updateStorageBar);

// Fetch files on page load
document.addEventListener('DOMContentLoaded', fetchFiles);

// Fetch files with default sorting on page load
document.addEventListener('DOMContentLoaded', () => fetchFiles('date-desc'));