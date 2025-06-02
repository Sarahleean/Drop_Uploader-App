        const uploadButton = document.getElementById('uploadButton');
        const fileInputs = document.querySelectorAll('.filesInputs');
        const textInputs = document.querySelectorAll('.textInputs');

        const serverUrl = 'https://drop-uploader-app-serverside.onrender.com';

        // Add event listeners to file inputs to display thumbnails
fileInputs.forEach((input, index) => {
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const thumbnail = document.createElement('img');
                thumbnail.src = event.target.result;
                thumbnail.style.width = '100px';
                thumbnail.style.height = '100px';
                thumbnail.style.objectFit = 'cover';
                thumbnail.style.margin = '10px';

                // Remove any existing thumbnail
                const existingThumbnail = input.nextElementSibling;
                if (existingThumbnail && existingThumbnail.tagName === 'IMG') {
                    existingThumbnail.remove();
                }

                input.parentNode.insertBefore(thumbnail, input.nextSibling);
            };
            reader.readAsDataURL(file);
        }
    });
});

        uploadButton.addEventListener('click', async () => {
            // Upload files
            for (let i = 0; i < fileInputs.length; i++) {
                const file = fileInputs[i].files[0];
                if (file) {
                    await uploadFileToServer(file, file.name);
                }
            }

            // Upload text inputs
            for (let i = 0; i < textInputs.length; i++) {
                const text = textInputs[i].value;
                if (text) {
                    await uploadTextToServer(text, `text${i + 1}`);
                }
            }
        });

        async function uploadFileToServer(file, filename) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('filename', filename);

            try {
                const response = await fetch(`${serverUrl}/upload-file`, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    console.log(`File uploaded to Dropbox`);
                } else {
                    console.error(`Error uploading file: ${response.statusText}`);
                }
            } catch (error) {
                console.error(`Error uploading file: ${error}`);
            }
        }

        async function uploadTextToServer(text, filename) {
            try {
                const response = await fetch(`${serverUrl}/upload-text`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text, filename })
                });

                if (response.ok) {
                    console.log(`Text uploaded to Dropbox`);
                } else {
                    console.error(`Error uploading text: ${response.statusText}`);
                }
            } catch (error) {
                console.error(`Error uploading text: ${error}`);
            }
        }
