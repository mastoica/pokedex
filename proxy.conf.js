module.exports = [
    {
        context: ['/api/v2/**'],
        target: 'https://pokeapi.co',
        secure: false,
        changeOrigin: true,
        logLevel: 'debug',
    },
];
