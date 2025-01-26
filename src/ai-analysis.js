export const analyzeContent = async (content) => {
      // Simulation d'analyse de contenu AI
      const inappropriateWords = ['spam', 'hate', 'violence']; // Liste à compléter
      const detectedIssues = inappropriateWords.filter(word => 
        content.toLowerCase().includes(word)
      );

      return {
        isInappropriate: detectedIssues.length > 0,
        details: detectedIssues.length > 0 ? {
          issues: detectedIssues,
          score: detectedIssues.length / inappropriateWords.length
        } : null
      };
    };
