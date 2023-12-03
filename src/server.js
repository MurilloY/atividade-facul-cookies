const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
    secret: 'seuSegredo',
    resave: false,
    saveUninitialized: true
}));

// Simulação de dados (substitua com seu banco de dados real)
const users = [
    { username: 'admin', password: 'admin' },
    // Adicione mais usuários conforme necessário
];

// Middleware de autenticação
const authenticate = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
};

// Middleware de validação do formulário
const validateForm = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.send('Preencha todos os campos. <a href="/">Voltar</a>');
    } else {
        next();
    }
};

// Rotas
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/login', validateForm, (req, res) => {
    const { username, password } = req.body;
    
    // Simulação de autenticação
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        req.session.user = username;
        res.cookie('lastLogin', new Date().toLocaleString());
        res.redirect('/dashboard');
    } else {
        res.send('Credenciais inválidas. <a href="/">Voltar</a>');
    }
});

app.get('/dashboard', authenticate, (req, res) => {
    res.render(__dirname + '/public/dashboard.html', {
        user: req.session.user,
        lastLogin: req.cookies.lastLogin
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
