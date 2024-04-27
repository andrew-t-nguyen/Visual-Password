const apiKey = 'mF88iVH3Bsq9ImugwzwN2no2lLAN68mdzDkzdtSaCmfUMLvuaJw7waj9';

async function fetchRandomImages() {
  const decryptedPicturePassword = document.getElementById('decryptedPicturePassword').value.split(',');
  const randomImageId = decryptedPicturePassword[Math.floor(Math.random() * decryptedPicturePassword.length)];

  const imageElements = document.querySelectorAll('.logIn-picContainer img');
  const randomPage = Math.floor(Math.random() * 500) + 1;
  const url = `https://api.pexels.com/v1/curated/?page=${randomPage}&per_page=8`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': apiKey
      }
    });
    const data = await response.json();
    const pictures = data.photos;

    const randomIndex = Math.floor(Math.random() * 9);
    const randomImageElement = imageElements[randomIndex];
    const randomImageResponse = await fetch(`https://api.pexels.com/v1/photos/${randomImageId}`, {
      headers: {
        'Authorization': apiKey
      }
    });
    const randomImageData = await randomImageResponse.json();
    randomImageElement.src = randomImageData.src.large;
    randomImageElement.setAttribute('data-id', randomImageId);

    let index = 0;
    for (let i = 0; i < 9; i++) {
      if (i === randomIndex) continue;
      imageElements[i].src = pictures[index].src.large;
      imageElements[i].setAttribute('data-id', pictures[index].id);
      index++;
    }
  } catch (error) {
    console.error('Error fetching random images:', error);
  }
}

function selectImage(element) {
  const selectedImageId = element.getAttribute('data-id');
  document.getElementById('selectedImageId').value = selectedImageId;
}

fetchRandomImages();