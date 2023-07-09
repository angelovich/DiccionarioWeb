const searchInput = document.getElementById('search-input'); // Obtiene el elemento de entrada de búsqueda
const searchButton = document.getElementById('search-button'); // Obtiene el botón de búsqueda
const resultsContainer = document.getElementById('results-container'); // Obtiene el contenedor de resultados
let wordBlock; // Variable para almacenar el bloque de palabras actual

let debounceTimeout;

function debounce(func, delay) {
    clearTimeout(debounceTimeout); // Cancela cualquier temporizador de retraso existente
  
    debounceTimeout = setTimeout(func, delay); // Establece un nuevo temporizador de retraso
  
    // Cuando el tiempo de retraso transcurra, se ejecutará la función `func`
  }  

function createWordBlock() {
  const wordBlock = document.createElement('div'); // Crea un nuevo elemento div para el bloque de palabras
  wordBlock.classList.add('word-block'); // Agrega la clase 'word-block' al bloque de palabras
  return wordBlock;
}

function createHeading(text) {
  const heading = document.createElement('h2'); // Crea un nuevo elemento h2 para el encabezado
  heading.textContent = text; // Establece el texto del encabezado
  return heading;
}

function createParagraph(text) {
  const paragraph = document.createElement('p'); // Crea un nuevo elemento p para el párrafo
  paragraph.textContent = text; // Establece el texto del párrafo
  return paragraph;
}

function createAudio(audioUrl) {
  const audio = document.createElement('audio'); // Crea un nuevo elemento audio para el audio
  audio.src = audioUrl; // Establece la URL del audio
  audio.controls = true; // Habilita los controles de reproducción
  return audio;
}

let isDarkTheme = false; // Variable para rastrear el estado del tema oscuro

function searchWord() {
  const searchTerm = searchInput.value.trim(); // Obtiene el término de búsqueda ingresado
  if (searchTerm === '') {
    resultsContainer.innerHTML = ''; // Limpia el contenedor de resultados si no hay término de búsqueda
    return;
  }

  // Llamar a la API para obtener los resultados en inglés
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`)
    .then(response => response.json())
    .then(data => {
      if (data.title === 'No Definitions Found') {
        resultsContainer.innerHTML = '<p>No definitions found for this word.</p>'; // Muestra un mensaje si no se encontraron definiciones
      } else {
        resultsContainer.innerHTML = ''; // Limpia el contenedor de resultados

        data.forEach(entry => {
          const { word, phonetics, meanings } = entry;

          const wordBlock = createWordBlock(); // Crea un nuevo bloque de palabras

          const heading = createHeading(word); // Crea un nuevo encabezado con la palabra
          wordBlock.appendChild(heading); // Agrega el encabezado al bloque de palabras

          if (phonetics.length > 0) {
            const { text, audio, sourceUrl } = phonetics[0];

            const pronunciationParagraph = createParagraph(`Pronunciation: ${text}`);
            if (audio) {
              const link = document.createElement('a');
              link.href = sourceUrl;
              link.target = '_blank';
              link.rel = 'noopener';
              link.textContent = text;
              pronunciationParagraph.appendChild(link);
            }

            wordBlock.appendChild(pronunciationParagraph);

            if (audio) {
              const audioElement = createAudio(audio);
              wordBlock.appendChild(audioElement);
            }
          }

          meanings.forEach(meaning => {
            const { partOfSpeech, definitions, synonyms, example } = meaning;

            const heading = createHeading(partOfSpeech);
            wordBlock.appendChild(heading);

            definitions.forEach(definition => {
              const paragraph = createParagraph(`Definition: ${definition.definition}`);
              wordBlock.appendChild(paragraph);

              if (example) {
                const exampleParagraph = createParagraph(`Example: ${example}`);
                wordBlock.appendChild(exampleParagraph);
              }

              if (synonyms && synonyms.length > 0) {
                const synonymsParagraph = createParagraph(`Synonyms: ${synonyms.join(', ')}`);
                wordBlock.appendChild(synonymsParagraph);
              }
            });
          });

          resultsContainer.appendChild(wordBlock); // Agrega el bloque de palabras al contenedor de resultados

          if (isDarkTheme) {
            wordBlock.classList.add('dark-theme1'); // Aplica la clase 'dark-theme1' si el tema oscuro está activado
          }
        });
      }
    })
    .catch(error => {
      resultsContainer.innerHTML = '<p>An error occurred while searching for the word.</p>'; // Muestra un mensaje de error si ocurre un error en la búsqueda
      console.error(error);
    });
}

searchButton.addEventListener('click', searchWord); // Escucha el evento de clic en el botón de búsqueda
searchInput.addEventListener('input', () => debounce(searchWord, 300)); // Escucha el evento de entrada en el campo de búsqueda y utiliza la función debounce para retrasar la ejecución de la búsqueda

const themeToggle = document.getElementById('theme-toggle');
const fontSelect = document.getElementById('font-select');
const body = document.body;

themeToggle.addEventListener('click', () => {
  const wordBlocks = document.querySelectorAll('.word-block');
  wordBlocks.forEach(wordBlock => {
    wordBlock.classList.toggle('dark-theme1'); // Alterna la clase 'dark-theme1' en los bloques de palabras
  });
  body.classList.toggle('dark-theme'); // Alterna la clase 'dark-theme' en el body
  isDarkTheme = !isDarkTheme; // Cambia el estado del tema oscuro
});

fontSelect.addEventListener('change', () => {
  const selectedFont = fontSelect.value;
  body.style.fontFamily = selectedFont; // Establece la familia de fuentes seleccionada en el body
});
