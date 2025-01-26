// [Previous imports remain the same...]
    import { analyzeContent } from './ai-analysis.js';

    // Middleware de modération
    const moderateContent = async (req, res, next) => {
      if (req.body.content) {
        const analysis = await analyzeContent(req.body.content);
        
        if (analysis.isInappropriate) {
          return res.status(400).json({
            error: 'Contenu inapproprié détecté',
            details: analysis.details
          });
        }
      }
      next();
    };

    // Route pour l'analyse de contenu
    app.post('/api/analyze', authenticate, moderateContent, async (req, res) => {
      const { content } = req.body;
      const analysis = await analyzeContent(content);
      res.json(analysis);
    });

    // Mise à jour des routes avec modération
    app.post('/api/ebooks/:id/comments', authenticate, moderateContent, async (req, res) => {
      // [Previous code...]
    });

    // Route pour les rôles utilisateurs
    app.post('/api/users/:id/role', authenticate, isAdmin, async (req, res) => {
      const { role } = req.body;
      const user = db.data.users.find(u => u.id === req.params.id);

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      user.role = role;
      await db.write();

      res.json({
        success: true,
        message: `Rôle de ${user.email} mis à jour à ${role}`
      });
    });

    // Intégration Google Docs
    app.post('/api/import/google-docs', authenticate, async (req, res) => {
      const { documentId } = req.body;

      try {
        // Simuler l'import depuis Google Docs
        const content = await fetchGoogleDocContent(documentId);
        const analysis = await analyzeContent(content);

        res.json({
          success: true,
          content,
          analysis
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
    });

    // [Rest of the server code remains the same...]
