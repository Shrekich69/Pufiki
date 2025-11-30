//Обмен данными
const port = browser.runtime.connect({ name: 'popup_content-script' });
port.postMessage({ action: 'getGroups' });

//Создание настроек
port.onMessage.addListener( (message) => {
    if (message.action === 'change_id') {

        let groupDiv = document.getElementById(message.data.oldId);
        let text = document.getElementById(message.data.oldId + 2);
        let checkbox = document.getElementById(message.data.oldId + 1);

        groupDiv.id = message.data.newId;
        checkbox.id = message.data.newId + 1;
        text.id = message.data.newId + 2;
        text.htmlFor = checkbox.id;

        return;

    }

    let elemOfGroups = document.getElementById('groupsList');
    for (let elem of message) {

        //Род. элемент
        let groupDiv = document.createElement('div');
        groupDiv.id = elem.id;
        groupDiv.classList.add('parGroup');

        //Нужен для цветных краев
        let edgesDiv = document.createElement('div');
        edgesDiv.classList.add('group');
        edgesDiv.style = "border: 2px solid " + elem.color;

        //Тело всей настройки
        let entireOption = document.createElement('span');
        entireOption.classList.add('option');

        //Label с текстом который связан с чекбоксом
        let text = document.createElement('label');
        text.id = elem.id + 2;
        text.classList.add('text')
        text.textContent = "Группирование вкл."

        //Переключатель для вкл./выкл. группировки сайта
        let labelOfBtn = document.createElement('label');
        labelOfBtn.classList.add('toggle-btn');
    
        //Checkbox для переключателя
        let checkbox = document.createElement('input');
        checkbox.id = elem.id + 1;
        checkbox.type = 'checkbox';
        checkbox.checked = true;

        text.htmlFor = checkbox.id;

        checkbox.onclick = function(event) {
            if (!event.target.checked)
                text.textContent = "Группирование выкл.";
            else 
                text.textContent = "Группирование вкл.";

            port.postMessage({
                action: 'toggle_grouping',
                object: [+groupDiv.id, event.target.checked]
            });
        }

        //Внешний вид переключателя
        let span = document.createElement('span');
        span.classList.add('switchSlider');

        //Кнопка для изменения цвета
        let colorInput = document.createElement('input');
        colorInput.type = 'button';
        colorInput.classList.add('colorInput');
        colorInput.style.background = elem.color;
        
        //ColorMenu
        const colors = [
            'blue', 'cyan',
            'grey', 'green',
            'orange', 'pink',
            'purple', 'red',
            'yellow'
        ]
        let colorDiv = document.createElement('div');
        colorDiv.id = elem.id + 3;
        colorDiv.classList.add('colorMenu', 'hidden');
        colorDiv.style = 'background: ' + elem.color;
        for (const color of colors) {
            let colorOption = document.createElement('input');
            colorOption.type = 'button';
            colorOption.classList.add('colorOption');
            colorOption.style = 'background: ' + color;

            colorDiv.append(colorOption);
        }

        //Поле ввода для назавния группы
        let nameInput = document.createElement('input');
        nameInput.classList.add('nameInput');
        nameInput.placeholder = elem.title;

        //Вкладывание элементов друг в друга
        //Второстепенные вложения
        labelOfBtn.append(checkbox, span);
        entireOption.append(text, labelOfBtn);
        edgesDiv.append(colorInput, nameInput, colorDiv);

        //Главные род. элементы
        groupDiv.append(entireOption, edgesDiv);
        elemOfGroups.append(groupDiv);
    }
});

//Изменение настроек
document.addEventListener('change', (event) => {
    let nameInp = document.getElementsByClassName(event.target.classList);

    for (elem of nameInp) {
        if (elem.parentElement.parentElement.id === event.target.parentElement.parentElement.id)
            elem.placeholder = event.target.value;
        else 
            continue;
    }
    
    port.postMessage({
        type: event.target.type,
        id: +event.target.parentElement.parentElement.id,
        value: event.target.value 
    });
});