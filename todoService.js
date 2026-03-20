const fs = require('fs');
const filename = 'todo.json';

try {
    if (!fs.existsSync(filename)) {
        fs.writeFileSync(filename, JSON.stringify([]));
        console.log(`${filename} cree avec succes`);
    }
} catch (error) {
    console.log('Erreur trouve:', error);
}

const getTodos = () => {
    const data = fs.readFileSync(filename);
    return JSON.parse(data);
}

const saveTodos = (todos) => {
    fs.writeFileSync(filename, JSON.stringify(todos));
}

module.exports = { getTodos, saveTodos}