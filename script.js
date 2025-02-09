let timer;
let timeLeft = 1500;  // 25 minutes par défaut (en secondes)
let tasks = [];

document.getElementById("todo-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const taskText = document.getElementById("todo-input").value.trim();
    if (taskText) {
        addTask(taskText);
        document.getElementById("todo-input").value = "";  // Effacer le champ de saisie
    }
});

function addTask(taskText) {
    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    tasks.push(task);
    renderTasks();
    updateTaskCounter();
}

function renderTasks() {
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = '';  // Réinitialiser la liste des tâches

    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('todo-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = task.id;
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

        const label = document.createElement('label');
        label.setAttribute('for', task.id);
        label.textContent = task.text;

        // Ajouter un bouton "Retirer"
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-task');
        removeButton.textContent = 'Retirer';
        removeButton.addEventListener('click', () => removeTask(task.id));

        taskElement.appendChild(checkbox);
        taskElement.appendChild(label);
        taskElement.appendChild(removeButton);
        todoList.appendChild(taskElement);
    });
}

function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        updateTaskCounter();

        // Si la tâche est terminée, supprimer après 5 secondes
        if (task.completed) {
            setTimeout(() => {
                removeTask(task.id);
            }, 5000);
        }
    }
}

function removeTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    renderTasks();
    updateTaskCounter();
}

function updateTaskCounter() {
    const remainingTasks = tasks.filter(t => !t.completed).length;
    document.getElementById("task-counter").textContent = `Tâches restantes : ${remainingTasks}`;
}

document.getElementById("clear-tasks").addEventListener("click", function() {
    tasks = [];
    renderTasks();
    updateTaskCounter();
});

document.getElementById("toggle-theme").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

document.getElementById("start-timer").addEventListener("click", function() {
    clearInterval(timer);  // Arrêter tout timer en cours

    // Récupérer la durée du timer en minutes
    let userTime = parseInt(document.getElementById("timer-input").value);
    if (isNaN(userTime) || userTime < 1) {
        alert("Veuillez entrer un temps valide !");
        return;
    }

    timeLeft = userTime * 60;  // Convertir en secondes
    updateTimerDisplay();

    // Démarrer le minuteur
    timer = setInterval(function() {
        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Temps écoulé ! Prenez une pause !");
        } else {
            timeLeft--;
            updateTimerDisplay();
        }
    }, 1000);
});

function updateTimerDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById("timer").textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
