document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const loginContainer = document.getElementById('loginContainer');
    const registerContainer = document.getElementById('registerContainer');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    document.body.appendChild(errorMessage);

    function showError(message, duration = 3000) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, duration);
    }
    
    // Event listener to show the register form and hide the login form
    showRegisterLink.addEventListener('click', function(event) {
        event.preventDefault();
        registerContainer.classList.remove('hidden');
        loginContainer.classList.add('hidden');
    });
    
    // Event listener to show the login form and hide the register form
    showLoginLink.addEventListener('click', function(event) {
        event.preventDefault();
        loginContainer.classList.remove('hidden');
        registerContainer.classList.add('hidden');
    });

    // Event listener for submitting the login form
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const mail = document.getElementById('loginMail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        if (!mail || !password) {
            showError('Veuillez remplir tous les champs');
            return;
        }

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ mail, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('email', mail);
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('userName', `${data.user.firstName} ${data.user.lastName}`);
                window.location.href = '/home.html';
            } else {
                showError(data.error || 'Erreur lors de la connexion');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            showError('Une erreur est survenue lors de la connexion');
        }
    });

    // Event listener for submitting the registration form
    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const firstName = document.getElementById('registerFirstName').value.trim();
        const lastName = document.getElementById('registerLastName').value.trim();
        
        if (!email || !password || !firstName || !lastName) {
            showError('Veuillez remplir tous les champs');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('Veuillez entrer une adresse email valide');
            return;
        }

        // Password validation (au moins 8 caractères)
        if (password.length < 8) {
            showError('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, firstName, lastName })
            });

            const data = await response.json();

            if (response.ok) {
                showError('Compte créé avec succès!', 2000);
                registerForm.reset();
                setTimeout(() => {
                    loginContainer.classList.remove('hidden');
                    registerContainer.classList.add('hidden');
                }, 2000);
            } else {
                showError(data.error || 'Erreur lors de la création du compte');
            }
        } catch (error) {
            console.error('Erreur lors de la création du compte:', error);
            showError('Une erreur est survenue lors de la création du compte');
        }
    });
});