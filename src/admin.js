import dayjs from 'dayjs';

    const renderAdminDashboard = async () => {
      try {
        // Récupérer les statistiques
        const statsResponse = await fetch('/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const stats = await statsResponse.json();

        // Récupérer les utilisateurs
        const usersResponse = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const users = await usersResponse.json();

        // Afficher les statistiques
        document.getElementById('admin-stats').innerHTML = `
          <div class="stat-card">
            <h3>Utilisateurs</h3>
            <p>Total: ${stats.totalUsers}</p>
            <p>Actifs (30j): ${stats.activeUsers}</p>
          </div>
          <div class="stat-card">
            <h3>Ebooks</h3>
            <p>Total générés: ${stats.totalEbooks}</p>
            <p>Crédits utilisés: ${stats.creditsUsed}</p>
          </div>
          <div class="stat-card">
            <h3>Plans</h3>
            ${stats.popularPlans.map(([plan, count]) => `
              <p>${plan}: ${count}</p>
            `).join('')}
          </div>
        `;

        // Afficher les utilisateurs
        document.getElementById('admin-users').innerHTML = `
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Plan</th>
                <th>Crédits</th>
                <th>Dernière connexion</th>
                <th>Inscription</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(user => `
                <tr>
                  <td>${user.email}</td>
                  <td>${user.plan || 'free'}</td>
                  <td>${user.credits}</td>
                  <td>${dayjs(user.lastLogin).format('DD/MM/YYYY HH:mm')}</td>
                  <td>${dayjs(user.createdAt).format('DD/MM/YYYY')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      } catch (error) {
        console.error('Erreur de récupération des données admin:', error);
      }
    };

    const exportData = async () => {
      try {
        const response = await fetch('/api/admin/export', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'export.json';
        a.click();
      } catch (error) {
        alert('Erreur lors de l\'export');
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      if (document.getElementById('admin-dashboard')) {
        renderAdminDashboard();
        document.getElementById('export-data').addEventListener('click', exportData);
      }
    });
