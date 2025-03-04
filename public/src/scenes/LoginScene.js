export default class LoginScene extends Phaser.Scene {
    constructor() {
        super('LoginScene');
    }

    create() {
        // Fondo - ajustado para centrar en la pantalla
        this.add.image(700, 700, 'background').setScale(3);

        // Título - ajustado para mejor posicionamiento
        this.add.text(700, 400, 'Login', {
            font: '56px Arial',
            fill: '#000000'
        }).setOrigin(0.5);

        // Formulario de login con estilos
        this.createLoginForm();
    }

    createLoginForm() {
        const formHtml = `
    <style>
        #login-container {
            background-color: rgba(255, 255, 255, 0.5);
            padding: 54px;  /* 40px * 1.35 */
            border-radius: 20px;  /* 15px * 1.35 */
            box-shadow: 0 11px 22px rgba(0,0,0,0.1);  /* Sombra aumentada */
            min-width: 432px;  /* 320px * 1.35 */
            text-align: center;
        }

        #login-container input {
            display: block;
            margin: 20px auto;  /* 15px * 1.35 */
            padding: 16px 20px;  /* Aumentado proporcionalmente */
            width: 378px;  /* 280px * 1.35 */
            border: 2px solid #e0e0e0;
            border-radius: 11px;  /* 8px * 1.35 */
            font-size: 22px;  /* 16px * 1.35 */
            transition: all 0.3s ease;
            outline: none;
        }

        #login-container input:focus {
            border-color: #FFD700;
            box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
        }

        #login-container input::placeholder {
            color: #999;
        }

        #login-container button {
            display: block;
            width: 378px;  /* 280px * 1.35 */
            padding: 16px;  /* 12px * 1.35 */
            margin: 20px auto;  /* 15px * 1.35 */
            border: none;
            border-radius: 11px;  /* 8px * 1.35 */
            font-size: 22px;  /* 16px * 1.35 */
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        #loginButton {
            background-color: #FFD700;  /* Amarillo */
            color: #000000;  /* Texto negro para mejor contraste */
            box-shadow: 0 5px 8px rgba(255, 215, 0, 0.3);
        }

        #loginButton:hover {
            background-color: #FFC800;  /* Amarillo ligeramente más oscuro */
            transform: translateY(-2px);
            box-shadow: 0 8px 11px rgba(255, 215, 0, 0.4);
        }

        #registerButton {
            background-color: #FFD700;  /* Amarillo ligeramente diferente */
            color: #000000;
            box-shadow: 0 5px 8px rgba(255, 183, 0, 0.3);
        }

        #registerButton:hover {
            background-color: #FFC800;
            transform: translateY(-2px);
            box-shadow: 0 8px 11px rgba(255, 183, 0, 0.4);
        }

        #login-container button:active {
            transform: translateY(1px);
        }

        #login-container input:invalid {
            border-color: #ff6b6b;
        }
    </style>
    <div id="login-container">
        <input type="text" id="firstName" placeholder="Nombre" required>
        <input type="text" id="lastName" placeholder="Apellido" required>
        <button id="loginButton">Iniciar Sesión</button>
        <button id="registerButton">Registrar</button>
    </div>
`;

        // Posicionamiento centrado del formulario
        const formElement = this.add.dom(700, 700).createFromHTML(formHtml);
        formElement.setOrigin(0.5);

        // Asegurar que el formulario sea interactivo
        formElement.addListener('click');

        // Event listeners
        formElement.getChildByID('loginButton').addEventListener('click', () => {
            const firstName = formElement.getChildByID('firstName').value;
            const lastName = formElement.getChildByID('lastName').value;

            if (firstName && lastName) {
                this.loginUser(firstName, lastName);
            } else {
                alert('Por favor, complete todos los campos');
            }
        });

        formElement.getChildByID('registerButton').addEventListener('click', () => {
            const firstName = formElement.getChildByID('firstName').value;
            const lastName = formElement.getChildByID('lastName').value;

            if (firstName && lastName) {
                this.registerUser(firstName, lastName);
            } else {
                alert('Por favor, complete todos los campos');
            }
        });
    }

    loginUser(firstName, lastName) {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName })
        })
            .then(response => response.json())
            .then(user => {
                if (user.error) {
                    alert(user.error);
                } else {
                    localStorage.setItem('userId', user._id);
                    this.scene.start('MenuScene');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al iniciar sesión');
            });
    }

    registerUser(firstName, lastName) {
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName })
        })
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    alert(result.error);
                } else {
                    alert('Usuario registrado con éxito');
                    // Limpiar los campos después del registro exitoso
                    const formElement = document.getElementById('login-container');
                    formElement.querySelector('#firstName').value = '';
                    formElement.querySelector('#lastName').value = '';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al registrar usuario');
            });
    }
}