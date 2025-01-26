const setupComments = (ebookId) => {
      const commentForm = document.getElementById('comment-form');
      const commentsList = document.getElementById('comments-list');

      const loadComments = async () => {
        try {
          const response = await fetch(`/api/ebooks/${ebookId}/comments`);
          const comments = await response.json();
          renderComments(comments);
        } catch (error) {
          console.error('Erreur de chargement des commentaires:', error);
        }
      };

      const renderComments = (comments) => {
        commentsList.innerHTML = comments.map(comment => `
          <div class="comment">
            <div class="comment-header">
              <strong>${comment.userId}</strong>
              <small>${new Date(comment.createdAt).toLocaleString()}</small>
            </div>
            <p>${comment.content}</p>
          </div>
        `).join('');
      };

      commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = document.getElementById('comment-content').value;

        try {
          const response = await fetch(`/api/ebooks/${ebookId}/comments`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ content })
          });

          const newComment = await response.json();
          loadComments();
          document.getElementById('comment-content').value = '';
        } catch (error) {
          console.error('Erreur d\'ajout de commentaire:', error);
        }
      });

      loadComments();
    };

    const setupVersioning = (ebookId) => {
      const versionSelect = document.getElementById('version-select');
      const quillEditor = document.querySelector('.ql-editor');

      const loadVersions = async () => {
        try {
          const response = await fetch(`/api/ebooks/${ebookId}/versions`);
          const versions = await response.json();
          renderVersionSelect(versions);
        } catch (error) {
          console.error('Erreur de chargement des versions:', error);
        }
      };

      const renderVersionSelect = (versions) => {
        versionSelect.innerHTML = versions.map((version, index) => `
          <option value="${version.id}">Version ${index + 1} - ${new Date(version.createdAt).toLocaleDateString()}</option>
        `).join('');
      };

      versionSelect.addEventListener('change', async (e) => {
        try {
          const response = await fetch(`/api/ebooks/${ebookId}/versions/${e.target.value}`);
          const version = await response.json();
          quillEditor.innerHTML = version.content;
        } catch (error) {
          console.error('Erreur de chargement de la version:', error);
        }
      });

      loadVersions();
    };

    const setupFavorites = (ebookId) => {
      const favoriteButton = document.getElementById('favorite-button');

      const updateFavoriteStatus = async () => {
        try {
          const response = await fetch(`/api/ebooks/${ebookId}/favorite`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const result = await response.json();
          favoriteButton.textContent = result.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris';
        } catch (error) {
          console.error('Erreur de mise à jour des favoris:', error);
        }
      };

      favoriteButton.addEventListener('click', updateFavoriteStatus);
      updateFavoriteStatus();
    };

    export const setupCollaborationFeatures = (ebookId) => {
      setupComments(ebookId);
      setupVersioning(ebookId);
      setupFavorites(ebookId);
    };
