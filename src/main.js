// [Previous imports remain the same...]

    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const notifications = await response.json();
        updateNotifications(notifications);
      } catch (error) {
        console.error('Erreur de récupération des notifications:', error);
      }
    };

    const updateNotifications = (notifications) => {
      const notificationsList = document.getElementById('notifications-list');
      notificationsList.innerHTML = notifications.map(n => `
        <div class="notification ${n.type}">
          ${n.message}
        </div>
      `).join('');
    };

    const showSubscriptionModal = async () => {
      try {
        const response = await fetch('/api/plans');
        const plans = await response.json();
        
        const modalContent = Object.entries(plans).map(([plan, details]) => `
          <div class="plan">
            <h3>${plan.toUpperCase()}</h3>
            <p>${details.credits} crédits</p>
            <p>${details.price > 0 ? `$${details.price}/mois` : 'Gratuit'}</p>
            <button onclick="subscribe('${plan}')">Choisir</button>
          </div>
        `).join('');

        document.getElementById('subscription-modal-content').innerHTML = modalContent;
        document.getElementById('subscription-modal').style.display = 'block';
      } catch (error) {
        console.error('Erreur de récupération des plans:', error);
      }
    };

    window.subscribe = async (plan) => {
      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ plan })
        });

        const result = await response.json();
        if (response.ok) {
          currentUser.credits = result.credits;
          updateUI(currentUser);
          alert(result.message);
          document.getElementById('subscription-modal').style.display = 'none';
          fetchNotifications();
        } else {
          alert(result.error);
        }
      } catch (error) {
        alert('Erreur lors de la souscription');
      }
    };

    document.addEventListener('DOMContentLoaded', () => {
      // [Previous initialization code...]

      // Gestion des notifications
      setInterval(fetchNotifications, 60000); // Rafraîchir toutes les minutes
      fetchNotifications();

      // Gestion des abonnements
      document.getElementById('upgrade-plan').addEventListener('click', showSubscriptionModal);
      document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('subscription-modal').style.display = 'none';
      });
    });
