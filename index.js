const inquirer = require('inquirer');
const fs = require('fs');
const filename = 'todo.json';
const choices = ['Hampiditra', 'Hijery', 'Hanova' , 'Hamafa', 'Hanamarika ho vita' , 'Hivoaka'];

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

const showTodos = () => {
    const data = getTodos();
    if (data.length === 0) {
        console.log('Tsy misy zavatra hatao voasoratra ianao!');
    } else {
        console.log('"Num" - "Lohateny"');        
        
        data.forEach((e, i)=>{
            console.log(`${i + 1} ----> ${e.task} ${e.completed? '(vita)' : '(tsy mbola vita)'}`);
        })
    }
}

const addTodo = async () => {
    const { task } = await inquirer.prompt([
        {
            type:'input',
            name: 'task',
            message: 'Soraty eto izay tianao hampidirina! (Tsindrio ny "h" raha hiverina)',
        }
    ])

    if (task === 'h') {
        console.log('\n');
        
    } else {
        const todos = getTodos();
        todos.push({task, completed: false});
        saveTodos(todos);
        console.log('Tafiditra amim-pahombiazana!')
    }
}

const updateTodo = async () => {
    console.log("///tafiditra ato anaty fanovana");
    const todos = getTodos();
    const { Input } = require('enquirer');

    const { numTodo } = await inquirer.prompt([
        {
            type: 'input',
            name: 'numTodo',
            message: "Ampidiro ny laharan'izay tianao ho marihina ho vita!",
            validate(value){
                const isNumber = Number(value)
                if(isNaN(isNumber)){
                    return 'Mampidira isa ihany!';
                }
                
                if(isNumber > 0 && isNumber <= todos.length){
                    return true;
                }
                return 'Tsy voamarina ny laharana nampidirinao!';
            }
        }
    ])  

    const prompt = new Input({
        message: 'Ampidiro ny fanovana hataonao!',
        initial: todos[numTodo - 1].task
    });

    const answer = await prompt.run();
    try {
        todos[numTodo - 1 ].task = answer;
        saveTodos(todos);
        console.log('Tontosa ny fanamarihana ny fahavitana');
    
    } catch (error) {
        console.log('Misy tsy fahatomombanana ny fanovana', error);
    }
}

const deleteTodo = async () => {
    const todos = getTodos();
    const { numTodo } = await inquirer.prompt([
        {
            type: 'input',
            name: 'numTodo',
            message: "Ampidiro ny laharan'izay tianao ho fafaina!",
            validate(value){
                const isNumber = Number(value)
                if(isNaN(isNumber)){
                    return 'Mampidira isa ihany!';
                }
                
                if(isNumber <= 0 || isNumber > todos.length){
                    return 'Tsy voamarina ny laharana nampidirinao!';
                }

                return true;
            }
        }
    ])

    const isNumber = Number(numTodo);

    todos.splice(isNumber - 1 , 1);
    saveTodos(todos);
    console.log('Fahombiazana famafana');   
}

const markLikeCompleted = async () => {
    const todos = getTodos();
    const { numTodo } = await inquirer.prompt([
        {
            type: 'input',
            name: 'numTodo',
            message: "Ampidiro ny laharan'izay tianao ho marihina ho vita!",
            validate(value){
                const isNumber = Number(value)
                if(isNaN(isNumber)){
                    return 'Mampidira isa ihany!';
                }
                
                if(isNumber > 0 && isNumber <= todos.length){
                    return true;
                }
                return 'Tsy voamarina ny laharana nampidirinao!';
            }
        }
    ])  

    const isNumber = Number(numTodo);
    try {
        todos[isNumber - 1 ].completed = true;
        saveTodos(todos);
        console.log('Tontosa ny fanamarihana ny fahavitana');
    
    } catch (error) {
        console.log('Misy tsy fahatomombanana ny fanovana', error);
    }
    
}

const mainMenu = async () => {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Inona no hataonao izao?',
            choices: choices
        }
    ]);

    switch (action) {
        case 'Hijery':
            await showTodos();
            break;

        case 'Hampiditra':
            await addTodo();
            break;

        case 'Hamafa':
            await deleteTodo();
            break;
        
        case 'Hanamarika ho vita':
            await markLikeCompleted();
            break;
        
        case 'Hanova':
            await updateTodo();
            break;

        case 'Hivoaka':
            console.log('Eny ary!');
            return;
    }
    mainMenu();
};

mainMenu();