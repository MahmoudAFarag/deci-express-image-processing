let selectedImage = null;

async function uploadImage() {
  const input = document.getElementById('imageUpload');
  const file = input.files?.[0];
  if (!file) {
    alert('Please select a file');
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('http://localhost:3000/api/images/upload', {
      method: 'POST',
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      alert('Image uploaded successfully');
      addImageToGallery(data.filename);
    } else {
      const errorData = await response.json();
      alert(`Error uploading image: ${errorData.error}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error uploading image');
  }
}

function addImageToGallery(filename) {
  const gallery = document.getElementById('imageGallery');
  const img = document.createElement('img');
  img.src = `../../uploads/${filename}`;
  img.onclick = () => selectImage(filename);
  gallery?.appendChild(img);
}

function selectImage(filename) {
  selectedImage = filename;
  const images = document.querySelectorAll('#imageGallery img');
  images.forEach((img) => img.classList.remove('selected'));
  const selectedImg = Array.from(images).find((img) => img.src.includes(filename));
  selectedImg?.classList.add('selected');
}

async function resizeImage() {
  if (!selectedImage) {
    alert('Please select an image from the gallery');
    return;
  }

  const width = document.getElementById('widthInput').value;
  const height = document.getElementById('heightInput').value;

  if (!width || !height) {
    alert('Please specify width and height');
    return;
  }

  const url = `http://localhost:3000/api/images/resize?filename=${selectedImage}&width=${width}&height=${height}`;
  const urlDisplay = document.getElementById('resizedImageUrl');
  if (urlDisplay) {
    urlDisplay.innerHTML = `<p>Resized image URL: <a href="${url}" target="_blank">${url}</a></p>`;
  }
}

const initialImages = ['test1.jpg', 'test2.jpg', 'test3.jpg'];
initialImages.forEach(addImageToGallery);
