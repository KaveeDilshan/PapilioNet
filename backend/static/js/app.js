document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('image-upload');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/classify', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('result').innerHTML = `
                <p><strong>Class:</strong> ${result.class}</p>
                <p><strong>Confidence:</strong> ${(result.confidence * 100).toFixed(2)}%</p>
            `;
        } else {
            document.getElementById('result').innerHTML = `<p>Error: ${result.error}</p>`;
        }
    } catch (error) {
        document.getElementById('result').innerHTML = `<p>Failed to classify image. Try again.</p>`;
    }
});
