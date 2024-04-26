const apiKey = 'mF88iVH3Bsq9ImugwzwN2no2lLAN68mdzDkzdtSaCmfUMLvuaJw7waj9';
const perPage = 9;

async function fetchPictures() {
  const randomPage = Math.floor(Math.random() * 500) + 1; // Generate a random page number (1 to 500)
  const url = `https://api.pexels.com/v1/curated/?page=${randomPage}&per_page=${perPage}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': apiKey
      }
    });
    const data = await response.json();
    const pictures = data.photos.map(photo => {
      return {
        id: photo.id,
        src: photo.src.large
      };
    });
    return pictures; // Return the array of photos with id and src
  } catch (error) {
    console.error(`Error fetching ${perPage} pictures:`, error);
    return null;
  }
}

async function displayPictures() {
  const pictures = await fetchPictures();

  console.log(`Fetched ${perPage} pictures:`, pictures)

  if (pictures) {
    // Update the images in the container with the fetched pictures
    const imageElements = document.querySelectorAll('.signUp-picContainer img');
    pictures.forEach((picture, index) => {
      const imageElement = imageElements[index];
      imageElement.src = picture.src;
      imageElement.setAttribute('data-id', picture.id); // Set data-id attribute with picture id
    });
  } else {
    console.error(`Failed to fetch ${perPage} pictures.`);
  }
}

document.getElementById('changePicturesBtn').addEventListener('click', function(event) {
    event.preventDefault();
    displayPictures(); 
});

// Call the function once when the page loads
window.onload = displayPictures;

let selectedImageIds = []; // Store selected image IDs

// Function to handle image selection
async function handleImageSelection(event) {
  if (selectedImageIds.length >= 6) {
    console.log('Maximum limit of 6 images reached.');
    return;
  }

  const selectedImageId = event.target.getAttribute('data-id'); // Get the id of the selected image from data-id attribute

  // Check if the selected ID already exists in the array
  if (selectedImageIds.includes(selectedImageId)) {
    console.log('This image is already selected.');
    return;
  }

  selectedImageIds.push(selectedImageId); // Add the id of the selected image
  console.log('Selected image ID:', selectedImageId);

  try {
    const response = await fetch(`https://api.pexels.com/v1/photos/${selectedImageId}`, {
      headers: {
        'Authorization': apiKey
      }
    });
    const data = await response.json();
    const selectedImageSrc = data.src.large; // Get the URL of the selected image
    const visualPasswordChoiceContainer = document.querySelector('.visualPassword-choice');

    // Create a new image element
    const selectedImageElement = document.createElement('img');
    selectedImageElement.src = selectedImageSrc;
    selectedImageElement.classList.add('chosen-image'); // Add a class for styling
    selectedImageElement.setAttribute('data-id', selectedImageId); // Set data-id attribute for identification

    // Set the height and width of the selected image to match signUp-picContainer images
    const signUpPicContainerImage = document.querySelector('.signUp-picContainer img');
    selectedImageElement.height = signUpPicContainerImage.height;
    selectedImageElement.width = signUpPicContainerImage.width;

    // Remove the chosen image when clicked
    selectedImageElement.addEventListener('click', function() {
      const index = selectedImageIds.indexOf(selectedImageId);
      if (index !== -1) {
        selectedImageIds.splice(index, 1); // Remove the ID from the array
        visualPasswordChoiceContainer.removeChild(selectedImageElement); // Remove the image from the container
        updateSelectedImageIdsInput(); // Update the hidden input field
      }
    });

    // Add the selected image to the visualPassword-choice container
    visualPasswordChoiceContainer.appendChild(selectedImageElement);

    updateSelectedImageIdsInput(); // Update the hidden input field
  } catch (error) {
    console.error('Error fetching selected image:', error);
  }
}

// Function to update the value of the hidden input field
function updateSelectedImageIdsInput() {
  const selectedImageIdsInput = document.getElementById('selectedImageIdsInput');
  selectedImageIdsInput.value = selectedImageIds.join(',');
  
}

const signUpPicContainerImages = document.querySelectorAll('.signUp-picContainer img');
signUpPicContainerImages.forEach(image => {
  image.addEventListener('click', handleImageSelection);
});
  