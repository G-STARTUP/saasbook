const setupTemplates = async () => {
      try {
        const response = await fetch('/api/templates');
        const templates = await response.json();

        const templateSelect = document.getElementById('template-select');
        templateSelect.innerHTML = templates.map(t => `
          <option value="${t.id}">${t.name}</option>
        `).join('');

        templateSelect.addEventListener('change', (e) => {
          const selected = templates.find(t => t.id === e.target.value);
          document.getElementById('template-description').textContent = selected.description;
        });
      } catch (error) {
        console.error('Erreur de récupération des templates:', error);
      }
    };

    const setupCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const categories = await response.json();

        const categorySelect = document.getElementById('category-select');
        categorySelect.innerHTML = `
          <option value="">Toutes les catégories</option>
          ${categories.map(c => `
            <option value="${c}">${c}</option>
          `).join('')}
        `;
      } catch (error) {
        console.error('Erreur de récupération des catégories:', error);
      }
    };

    const setupSearch = () => {
      const searchForm = document.getElementById('search-form');
      if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const query = document.getElementById('search-query').value;
          const category = document.getElementById('category-select').value;

          try {
            const response = await fetch(`/api/search?query=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            const results = await response.json();
            displaySearchResults(results);
          } catch (error) {
            console.error('Erreur de recherche:', error);
          }
        });
      }
    };

    const displaySearchResults = (results) => {
      const resultsContainer = document.getElementById('search-results');
      resultsContainer.innerHTML = results.map(ebook => `
        <div class="ebook-result">
          <h3>${ebook.category || 'Sans catégorie'}</h3>
          <p>${ebook.content.substring(0, 200)}...</p>
          <small>Créé le ${new Date(ebook.createdAt).toLocaleDateString()}</small>
        </div>
      `).join('');
    };

    const setupSocialSharing = () => {
      const shareButtons = document.querySelectorAll('.share-button');
      shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const ebookId = e.target.dataset.ebookId;
          const ebook = db.data.ebooks.find(e => e.id === ebookId);
          
          if (ebook) {
            const text = `Découvrez mon ebook "${ebook.category}" généré avec EbookSaaS!`;
            const url = `${window.location.origin}/share/${ebookId}`;
            
            if (navigator.share) {
              navigator.share({
                title: 'Mon Ebook',
                text: text,
                url: url
              });
            } else {
              // Fallback pour les navigateurs sans support de l'API Share
              prompt('Copiez ce lien pour partager:', url);
            }
          }
        });
      });
    };

    document.addEventListener('DOMContentLoaded', () => {
      setupTemplates();
      setupCategories();
      setupSearch();
      setupSocialSharing();
    });
