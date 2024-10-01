$(document).ready(function() {
  $(".accordion").click(function() {
    $(this).toggleClass("active");
    var panel = $(this).next();
    if (panel.css('display') === "none") {
      panel.slideDown(200);
    } else {
      panel.slideUp(200);
    }
  });
});
  // Adjusts the width of the image box based on the window size
  function adjustImageBoxWidth() {
    const imageBox = document.querySelector('.image-box');
    if (window.innerWidth < 600) {
      // Adjust according to your preference for smaller screens
      imageBox.style.width = '90%';
    } else {
      // Default width for larger screens
      imageBox.style.width = '80%';
    }
  }

  // Updates the page with the data from the selected entry
  function updatePage(entry) {
    document.querySelector('.image-box').style.backgroundImage = `linear-gradient(rgba(0, 0, 139, 0.62), rgba(0, 0, 139, 0.22) 30%, rgba(128, 0, 128, 0.22) 70%, rgba(128, 0, 128, 0.62)), url('${entry.img}')`;
    document.querySelector('.post-title').innerHTML = `<div style="font-size: 24px; font-family: 'ArgosBoldItalic';">${entry.title}</div>`;
    document.querySelector('.post-subtitle').innerHTML = entry.subtitle;

    const imageBoxLink = document.querySelector('#image-box-link');
    imageBoxLink.href = entry.readMoreUrl;

    const linksHTML = entry.links.map(link => `<li class="post-subtitle"><a class="post-subtitle" href="${link.url}">${link.text}</a></li>`).join('');
    document.querySelector('ul').innerHTML = linksHTML;
  }

  // Main function to fetch data and initialize the page
  document.addEventListener('DOMContentLoaded', function() {
    adjustImageBoxWidth(); // Call to adjust the image box width on page load

    // Fetch data from 'pubs_en.json' and initialize the page
    fetch('index_files/pubs.json?' + new Date().getTime())
      .then(response => response.json())
      .then(data => {
        const randomEntries = [];
        for (let i = 0; i < 5; i++) { // Load 5 random entries
          const randomEntryIndex = Math.floor(Math.random() * data.length);
          randomEntries.push(data[randomEntryIndex]);
        }
        updateCarousel(randomEntries); // Update carousel with random entries
      })
      .catch(error => console.error('Error loading the JSON file:', error));

    fetch('pubs_en.json?' + new Date().getTime())
      .then(response => response.json())
      .then(data => {
        const buttons = document.querySelectorAll('.slider-btn');
        buttons.forEach(button => {
          button.addEventListener('click', () => {
            const key = button.getAttribute('data-key');
            const entry = data.find(item => item.title.includes(key));
            if (entry) {
              updatePage(entry);
            } else {
              console.error(`Entry not found for key: ${key}`);
            }
          });
        });
      })
      .catch(error => console.error('Error loading the JSON file:', error));
  });
  document.addEventListener('DOMContentLoaded', function() {
    let timeout; // Memorizza il timeout per controllare l'inattività dopo lo scroll
    const iconsContainer = document.querySelector('.icons-container');

    window.addEventListener('scroll', () => {
      // Imposta l'opacità a 0 (rende le icone trasparenti)
      iconsContainer.style.opacity = '0';

      // Cancella il timeout precedente se lo scroll continua
      clearTimeout(timeout);

      // Imposta un nuovo timeout per far riapparire le icone dopo 1 secondo di inattività
      timeout = setTimeout(() => {
        iconsContainer.style.opacity = '1';
      }, 3000); // Tempo in millisecondi
    });
  });
            document.addEventListener('DOMContentLoaded', function() {
              let allData = [];
              const paroleEscluse = ['perchè', 'perché', 'quando', 'e', 'ma', 'se', 'come', 'con', 'su', 'per', 'tra', 'fra', 'nel', 'nello', 'nella', 'nei', 'nelle', 'al', 'allo', 'alla', 'ai', 'agli', 'alle', 'dal', 'dallo', 'dalla', 'dai', 'dagli', 'dalle', 'del', 'dello', 'della', 'dei', 'degli', 'delle', 'sul', 'sullo', 'sulla', 'sui', 'sugli', 'sulle', 'un', 'uno', 'una', 'gli', 'le', 'di', 'da', 'in', 'a', 'da', 'che', 'chi', 'cosa', 'quale', 'quanto', 'quanta', 'quanti', 'quante', 'dove', 'come', 'quando', 'perché', 'anche', 'solo', 'qui', 'lì', 'là', 'dunque', 'quindi', 'perciò', 'anche', 'ancora', 'già', 'mai', 'sempre', 'poi', 'prima', 'dopo', 'sopra', 'sotto', 'contro', 'molto', 'poco', 'troppo', 'più', 'meno', 'bene', 'male', 'meglio', 'peggio', 'quasi', 'circa', 'appena', 'solo', 'tanto', 'così', 'pure', 'anche', 'neanche', 'nemmeno', 'quasi', 'sia', 'anche'];

              // Carica i dati dal CSV
              fetch('/index_files/notes_ff_michele_merelli_2024_futuro_fortissimo.csv')
                .then(response => response.text())
                .then(csvText => {
                  allData = csvText.split('\n').map(row => row.split(','));
                  updateContent(allData); // Visualizza tutti i dati inizialmente
                });

              function updateContent(data) {
                const contentArea = document.getElementById('content-area');
                contentArea.innerHTML = ''; // Pulisce il contenitore prima di ripopolarlo

                // Mescola i dati e poi limita le voci a quelle disponibili
                let displayData = data.sort(() => 0.5 - Math.random());

                displayData.forEach((row, index) => {
                  const contentDiv = document.createElement('div');
                  contentDiv.classList.add('highlight-on-hover');
                  contentDiv.style.borderRadius = '10px';
                  contentDiv.style.padding = '10px';
                  contentDiv.style.marginBottom = '20px';
                  contentDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  contentDiv.style.backgroundColor = '#f9f9f9';
                  contentDiv.style.position = 'relative';

                  const topicsDiv = document.createElement('div');
                  topicsDiv.textContent = row[0]; // Assuming topic is in the first column
                  topicsDiv.style.textAlign = 'left';

                  const url = new URL(row[2]);
                  const domainDiv = document.createElement('div');
                  domainDiv.style.position = 'absolute';
                  domainDiv.style.bottom = '5px';
                  domainDiv.style.right = '10px';
                  domainDiv.style.fontSize = '12px';
                  domainDiv.style.color = '#777';

                  // Creating a container for domain and note
                  const domainNoteContainer = document.createElement('div');
                  domainNoteContainer.style.display = 'flex';
                  domainNoteContainer.style.alignItems = 'center'; // Aligns items vertically in the center

                  const domainText = document.createElement('span');
                  domainText.textContent = url.hostname; // Extracts the domain from the URL

                  // Extract the note number (removing '#') and create the note span with emoji
                  const noteNumber = row[row.length - 1].replace('#', '');
                  const noteSpan = document.createElement('span');
                  noteSpan.textContent = ` 🎵 ${noteNumber}`;
                  noteSpan.style.marginLeft = '5px'; // Space between domain and note

                  // Assemble the domain and note inside the container
                  domainNoteContainer.appendChild(domainText);
                  domainNoteContainer.appendChild(noteSpan);

                  // Now, append the container instead of just the domainText
                  domainDiv.appendChild(domainNoteContainer);

                  const textDiv = document.createElement('div');
                  textDiv.textContent = row[1]; // Assuming the text/content is in the second column
                  textDiv.style.marginBottom = '10px';

                  textDiv.style.cursor = 'pointer';
                  textDiv.addEventListener('click', () => {
                    window.open(row[2], '_blank'); // Open link in new tab
                  });

                  // Assembling the content
                  contentDiv.appendChild(textDiv);
                  contentDiv.appendChild(topicsDiv);
                  contentDiv.appendChild(domainDiv); // Adding the domain (with note) display

                  // Add the assembled div to the main container
                  contentArea.appendChild(contentDiv);
                });
              }

              function performSearch() {
                let filteredData = allData; // Inizia con tutti i dati
                const searchText = searchInput.value.toLowerCase().split(' ').filter(parola => !paroleEscluse.includes(parola) && parola.trim() !== '');
                const isLibriChecked = document.getElementById('csv-checkbox-libri').checked;
                const isClimaChecked = document.getElementById('csv-checkbox-clima').checked;
                const isUomoChecked = document.getElementById('csv-checkbox-uomo').checked;
                const isTecnologiaChecked = document.getElementById('csv-checkbox-tecnologia').checked;
                const isFuturoChecked = document.getElementById('csv-checkbox-futuro').checked;
                const isCriptoChecked = document.getElementById('csv-checkbox-criptovalute').checked;
                const isAlimentazioneChecked = document.getElementById('csv-checkbox-alimentazione').checked;
                const isSportChecked = document.getElementById('csv-checkbox-sport').checked;
                const isPodcastChecked = document.getElementById('csv-checkbox-podcast').checked;
                const isIntelligenzaChecked = document.getElementById('csv-checkbox-intelligenza').checked;
                const isSaluteChecked = document.getElementById('csv-checkbox-salute').checked;
                const isWellbeingChecked = document.getElementById('csv-checkbox-wellbeing').checked;
                const isArtChecked = document.getElementById('csv-checkbox-art').checked;
                const isMetaverseChecked = document.getElementById('csv-checkbox-metaverse').checked;
                const isSocietyChecked = document.getElementById('csv-checkbox-society').checked;
                const isMobilitybeingChecked = document.getElementById('csv-checkbox-mobility').checked;

                // Filtro basato sul testo di ricerca
                if (searchText.length > 0) {
                  filteredData = filteredData.filter(row =>
                    searchText.some(parola =>
                      row.some(cell => cell.toLowerCase().includes(parola))
                    )
                  );
                }

                // Filtro basato sui checkbox
                if (isLibriChecked) filteredData = filteredData.filter(row => row.some(cell => cell.includes("📚")));
                if (isTecnologiaChecked) filteredData = filteredData.filter(row => row.some(cell => cell.includes("💻")));
                if (isUomoChecked) filteredData = filteredData.filter(row => row.some(cell => cell.includes("❤️")));
                if (isSaluteChecked) filteredData = filteredData.filter(row => row.some(cell => cell.includes("💊")));
                if (isIntelligenzaChecked) filteredData = filteredData.filter(row => row.some(cell => cell.includes("🧠")));
                if (isWellbeingChecked) filteredData = filteredData.filter(row => row.some(cell => cell.includes("💆")));
                if (isClimaChecked) filteredData = filteredData.filter(row => row.some(cell => cell.includes("🍃")));
                if (isFuturoChecked) filteredData = filteredData.filter(row => row.some(cell => cell.includes("🎼")));
                if (isCriptoChecked) filteredData = filteredData.filter(row => row.some(cell => cell.includes("💸")));
                if (isSportChecked) filteredData = filteredData.filter(row => row.some(cell => cell.includes("⚽")));
                if (isAlimentazioneChecked) filteredData = filteredData.filter(row => row.some(cell => cell.includes("🍽️")));
                if (isPodcastChecked) filteredData = filteredData.filter(row => row.some(cell => cell.includes("🎙️")));
                if (isArtChecked) filteredData = filteredData.filter(row => row.some(cell => cell.includes("🎨")));
                if (isMetaverseChecked) filteredData = filteredData.filter(row => row.some(cell => cell.includes("🥽")));
                if (isMobilitybeingChecked) filteredData = filteredData.filter(row => row.some(cell => cell.includes("🚕")));
                if (isSocietyChecked) filteredData = filteredData.filter(row => row.some(cell => cell.includes("👥")));

                updateContent(filteredData);
              }

              const searchButton = document.getElementById('csv-search-button');
              const refreshButton = document.getElementById('refreshButton');
              const searchInput = document.getElementById('csv-search-input');
              const divSearch = document.getElementById('div_search');
              const divSearch_2 = document.getElementById('div_search_2');
              const divSearch_4 = document.getElementById('div_search_4');
              const divSearch_5 = document.getElementById('div_search_5');

              // Gestione click sul bottone di ricerca
              searchButton.addEventListener('click', performSearch);
              divSearch.addEventListener('click', performSearch);
              divSearch_2.addEventListener('click', performSearch);
              divSearch_4.addEventListener('click', performSearch);
              divSearch_5.addEventListener('click', performSearch);
              document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.addEventListener('change', performSearch));

              // Gestisci anche l'evento "Enter" sulla tastiera per la ricerca
              document.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') performSearch();
              });

              // Function to reset all checkboxes
              function resetCheckboxes() {
                document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);
              }

              // Attach event listener to the refresh button
              refreshButton.addEventListener('click', function() {
                resetCheckboxes();
                updateContent(allData); // Aggiorna la tabella con tutte le voci
              });
            });

            var mySwiper = new Swiper('.mySwiper', {
              slidesPerView: 7,
              spaceBetween: 1,
              freeMode: true,
              pagination: { el: '.swiper-pagination', clickable: true },
              mousewheel: { invert: false },
              on: {
                init: function() {
                  const swiper = this;
                  swiper.slides.each((index, slide) => {
                    slide.addEventListener('mouseenter', () => swiper.zoom.in());
                    slide.addEventListener('mouseleave', () => swiper.zoom.out());
                  });
                },
              },
              zoom: { maxRatio: 1.1 },
            });

// Function to update the carousel with multiple entries
function updateCarousel(entries) {
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.innerHTML = ''; // Clear existing content

    entries.forEach(entry => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('carousel-item');
        itemDiv.innerHTML = `
            <div class="image-box" style="background-image: url('${entry.img}');">
                <div class="post-title">${entry.title}</div>
                <div class="post-subtitle">${entry.subtitle}</div>
            </div>
        `;
        carouselContainer.appendChild(itemDiv);
    });
}