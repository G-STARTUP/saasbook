const setupRealtime = (ebookId) => {
      const ws = new WebSocket(`ws://${window.location.host}`);

      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'subscribe',
          ebookId
        }));
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'new_comment':
            addCommentToUI(message.comment);
            break;
          case 'new_version':
            addVersionToSelect(message.version);
            break;
        }
      };

      const addCommentToUI = (comment) => {
        const commentsList = document.getElementById('comments-list');
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
          <div class="comment-header">
            <strong>${comment.userId}</strong>
            <small>${new Date(comment.createdAt).toLocaleString()}</small>
          </div>
          <p>${comment.content}</p>
        `;
        commentsList.appendChild(commentElement);
      };

      const addVersionToSelect = (version) => {
        const versionSelect = document.getElementById('version-select');
        const option = document.createElement('option');
        option.value = version.id;
        option.textContent = `Version ${versionSelect.options.length + 1} - ${new Date(version.createdAt).toLocaleDateString()}`;
        versionSelect.appendChild(option);
      };
    };

    export const initializeRealtime = (ebookId) => {
      setupRealtime(ebookId);
    };
