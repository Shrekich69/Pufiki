//Обмен данными
const port = browser.runtime.connect({ name: 'content-script' });
port.postMessage('getGroups');

//Создание настроек
port.onMessage.addListener( (message) => {
    let elemOfGroups = document.getElementById('groupsList');
    for (elem of message) {
        let div = document.createElement('div');

        let colInput = document.createElement('button');
        colInput.id = elem.id;
        colInput.classList.add('colorInput');
        colInput.type = 'color';
        colInput.style.background = elem.color;

        let nameInput = document.createElement('input');
        nameInput.id = elem.id;
        nameInput.classList.add('nameInput');
        nameInput.placeholder = elem.title;

        div.append(colInput, nameInput);
        elemOfGroups.append(div);
    }
});

//Изменение настроек
document.addEventListener('change', (event) => {
    let nameInp = document.getElementsByClassName(event.target.classList);

    for (elem of nameInp) {
        if (elem.id === event.target.id)
            elem.placeholder = event.target.value;
        else 
            continue;
    }
    
    port.postMessage({
        type: event.target.type,
        id: +event.target.id,
        value: event.target.value 
    });
});