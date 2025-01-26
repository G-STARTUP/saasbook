const setupModeration = () => {
      const commentForm = document.getElementById('comment-form');
      const analyzeButton = document.getElementById('analyze-content');

      if (analyzeButton) {
        analyzeButton.addEventListener('click', async () => {
          const content = quill.getText();
          
          try {
            const response = await fetch('/api/analyze', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ content })
            });

            const analysis = await response.json();
            displayAnalysisResults(analysis);
          } catch (error) {
            console.error('Erreur d\'analyse:', error);
          }
        });
      }

      const displayAnalysisResults = (analysis) => {
        const analysisResults = document.getElementById('analysis-results');
        analysisResults.innerHTML = analysis.isInappropriate ? `
          <div class="analysis-warning">
            <h3>Problèmes détectés:</h3>
            <ul>
              ${analysis.details.issues.map(issue => `<li>${issue}</li>`).join('')}
            </ul>
            <p>Score d'inadéquation: ${(analysis.details.score * 100).toFixed(2)}%</p>
          </div>
        ` : `
          <div class="analysis-success">
            <h3>Contenu approprié</h3>
            <p>Aucun problème détecté</p>
          </div>
        `;
      };
    };

    export const initializeModeration = () => {
      setupModeration();
    };
