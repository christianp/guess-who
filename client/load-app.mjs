import show_error from './show-error.mjs';
import {Client} from './websocket.mjs';
async function init_app() {
    const compilation_error = await show_error;
    if(compilation_error) {
        return;
    }
    const d = document.createElement('div');
    document.body.appendChild(d);

    const localStorage_key = 'guess-who-data';

    function load_data() {
        return JSON.parse(localStorage.getItem(localStorage_key));
    }

    function save_data() {
        localStorage.setItem(localStorage_key, JSON.stringify(my_info));
    }

    let my_info = load_data();
    if(!my_info) {
        const id = 'xxxxxxxx'.replace(/./g, () => Math.floor(Math.random()*10)+'');
        my_info = {id, name: null};
        save_data();
    }

    const flags = my_info;
    console.log(flags);

    const app = Elm.GuessWho.init({node: d, flags});

    const client = new Client(
        my_info,
        data => {
            app.ports.receiveMessage.send(data);
        }
    );

    app.ports.sendMessage.subscribe(message => {
        if(message.action=='set_name') {
            my_info.name = message.name;
            save_data();
        }

        console.log('sending',message);
        client.send(message);
    });

    const fullscreener = document.body;
    fullscreener.addEventListener('click', e => {
        if(!document.body.classList.contains('container')) {
            return;
        }
        if(fullscreener.requestFullscreen) {
            fullscreener.requestFullscreen();
        }
        if(fullscreener.webkitRequestFullscreen) {
            fullscreener.webkitRequestFullscreen();
        }
    });
}

init_app();
