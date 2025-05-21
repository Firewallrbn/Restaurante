document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login').addEventListener('submit', async (e) => {
        e.preventDefault();
      
        const username = document.getElementById('id_username').value;
        const password = document.getElementById('id_password').value;
      
        try {
            const response = await fetch('/api/token/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ username, password })
            });
        
            const data = await response.json();
        
            if (response.ok) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                window.location.href = "";
            } else {
                alert("Credenciales inválidas");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Error al conectar con el servidor");
        }
    });
});