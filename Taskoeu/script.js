
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const url = 'https://6566caeb64fcff8d730f111a.mockapi.io/API1/Task';

    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Failed to fetch user data');
    })
    .then(userData => {
        const foundUser = userData.find(user => user.username === username && user.password === password);
        if (foundUser) {
            window.location.href = 'profile.html';        
        } else {
            alert('incorrect username or password');
        }
    })
    .catch(error => {
        alert("cvvvvvvvvvvv", error.message);
    });
}

function signup() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const url = 'https://6566caeb64fcff8d730f111a.mockapi.io/API1/Task';
    const newUser = {
        username: username,
        email: email,
        password: password,
    };

    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newUser)
    })
    .then(response => {
        if (response.ok) {            
            return response.json();
        }
        throw new Error('Error signing up');
    })
    .then(() => {
        window.location.href = 'index.html';
    })
    .catch(error => {
        alert(error.message);
    });
}


function logout() {
    window.location.href = 'index.html';
}


function getTasks(){    
    const url = 'https://6566caeb64fcff8d730f111a.mockapi.io/API1/task';
    return fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Failed to fetch tasks');
    })
    .then(data => {
        for (let i = 0; i < data.length; i++){
            let li = document.createElement('li');
            li.textContent = data[i].task;
            li.setAttribute('contenteditable', 'false');
            tasks.appendChild(li);
            let img = document.createElement('img');
            img.src = './images/edit26.png';
            img.setAttribute('tabindex', '-1');
            li.appendChild(img);
            let p = document.createElement('p');
            p.setAttribute('tabindex', '-1');
            p.innerHTML = '\u00d7';
            li.appendChild(p);
            if (data[i].done) {
                li.classList.add('done');
            }
        }
    })
    .catch(error => {
        alert(error.message);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const reload = document.getElementById('tasks');
    reload.innerHTML = '';
    getTasks();
});

// add tasks to mockAPI and to profile
function addTask(){
    const taskInput = document.getElementById('task');
    const task = taskInput.value;
    const url = 'https://6566caeb64fcff8d730f111a.mockapi.io/API1/Task';
    const newTask = {
        task: task,
        done: false
    };
    if (task != ''){
        console.log('aaaaaaaaaa')
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newTask)
        })
        .then(response => {
            if (response.ok) {            
                return response.json();
            }
            throw new Error('Error adding task');
        })
        .catch(error => {
            alert(error.message);
        });
        if(task==='')
            alert('it is empty');
        else {        
            let li = document.createElement('li');
            li.textContent = task;
            li.setAttribute('contenteditable', 'false');
            tasks.appendChild(li);
            let img = document.createElement('img');
            img.src = './images/edit26.png';
            img.setAttribute('tabindex', '-1');
            li.appendChild(img);
            let p = document.createElement('p');
            p.innerHTML = '\u00d7';
            p.setAttribute('tabindex', '-1');
            li.appendChild(p);
        }
        taskInput.value = '';
        saveTasks();
    }
    else {
        alert('It is empty');
    }
}

// delete tasks from mockAPI
function deleteTask(taskTitle) {
    const url = 'https://6566caeb64fcff8d730f111a.mockapi.io/API1/task';
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Failed to fetch tasks');
    })
    .then(data => {
        const taskDelete = data.find(task => task.task === taskTitle);
        if (taskDelete) {
            const id = taskDelete.id;
            return fetch(`${url}/${id}`, {
                method: 'DELETE'
            });
        } else {
            throw new Error('Task not found');
        }
    })
    .catch(error => {
        console.error('Error deleting task:', error);
    });
}

// updates task on mockAPI
function update(taskTitle, newInput) {   
    const url = 'https://6566caeb64fcff8d730f111a.mockapi.io/API1/Task';
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Error updating task');
    })
    .then(data => {
        const getTask = data.find(task => task.task === taskTitle);        

        if (getTask) {
            const id = getTask.id;
            return fetch(`${url}/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ task: newInput })
            });
        } else {
            throw new Error('Task not found');
        }
    })
    .catch(error => {
        alert(error);
    });
    saveTasks();
}

// marks task as done on mockAPI
function done(taskTitle){
    const url = 'https://6566caeb64fcff8d730f111a.mockapi.io/API1/task';
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Error marking task done');
    })
    .then(data => {
        const taskDone = data.find(task => task.task === taskTitle);
        let isDone = false;
        if(taskDone.done === false)
            isDone = true;

        if (taskDone) {
            const id = taskDone.id;
            return fetch(`${url}/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ done: isDone })
            });
        } else {
            throw new Error('Task not found');
        }
    })
    .catch(error => {
        alert(error);
    });
}

// marks done, deletes, updates on profile.html
let oldTitle = '';
tasks.addEventListener('click', function(e) {
    if(e.target.tagName === 'LI' && e.target.getAttribute('contenteditable') === 'false'){
        const taskTitle = e.target.textContent.slice(0, -1);
        e.target.classList.toggle('done');
        done(taskTitle);
        saveTasks();
    }
    else if(e.target.tagName === 'P'){
        const taskTitle = e.target.parentElement.textContent.slice(0, -1);
        e.target.parentElement.remove();
        deleteTask(taskTitle);
        saveTasks();
    }
    else if (e.target.tagName === 'IMG'){
        const taskTitle = e.target.parentElement.textContent.slice(0, -1);
        if (oldTitle === '') {
            oldTitle = taskTitle;
        }
        const text = e.target.parentElement;
        if(e.target.src.includes('edit')){
            e.target.src='./images/save26.png';
            text.contentEditable = true;        
            text.focus();
        }
        else if(e.target.src.includes('save')){
            e.target.src='./images/edit26.png';
            text.contentEditable = false;
            text.blur();
            let newInput = text.firstChild.textContent.trim();
            update(oldTitle, newInput);
        }       
        saveTasks();
    }
});


function all() {
    const reload = document.getElementById('tasks');
    reload.innerHTML = '';
    getTasks();
}

document.querySelector('.all').addEventListener('click', all);


function active() {
    const reload = document.getElementById('tasks');
    reload.innerHTML = ''; 
    const url = 'https://6566caeb64fcff8d730f111a.mockapi.io/API1/task';
    return fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Failed to fetch tasks');
    })
    .then(data => {
        for (let i = 0; i < data.length; i++){
            let li = document.createElement('li');
            li.textContent = data[i].task;
            li.setAttribute('contenteditable', 'false');
            if (data[i].done === false) {
                tasks.appendChild(li);
                let img = document.createElement('img');
                img.src = './images/edit26.png';
                img.setAttribute('tabindex', '-1');
                li.appendChild(img);
                let p = document.createElement('p');
                p.setAttribute('tabindex', '-1');
                p.innerHTML = '\u00d7';
                li.appendChild(p);
            }
        }
    })
    .catch(error => {
        alert(error.message);
    });
}

// shows completed tasks in profile.html
function completed() {
    const reload = document.getElementById('tasks');
    reload.innerHTML = ''; 
    const url = 'https://6566caeb64fcff8d730f111a.mockapi.io/API1/task';
    return fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Failed to fetch tasks');
    })
    .then(data => {
        for (let i = 0; i < data.length; i++){
            let li = document.createElement('li');
            li.textContent = data[i].task;
            li.setAttribute('contenteditable', 'false');
            if (data[i].done === true) {
                tasks.appendChild(li);
                let img = document.createElement('img');
                img.src = './images/edit26.png';
                img.setAttribute('tabindex', '-1');
                li.appendChild(img);
                let p = document.createElement('p');
                p.setAttribute('tabindex', '-1');
                p.innerHTML = '\u00d7';
                li.appendChild(p);
                li.classList.add('done');
            }
        }
    })
    .catch(error => {
        alert(error.message);
    });
}

function saveTasks(){
    localStorage.setItem('tasks', tasks.innerHTML);
}

function showTasks(){
    tasks.innerHTML = localStorage.getItem('tasks');
}

showTasks();
