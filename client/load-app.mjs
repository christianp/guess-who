import show_error from './show-error.mjs';
import {Client} from './websocket.mjs';
async function init_app() {
    const compilation_error = await show_error;
    if(compilation_error) {
        return;
    }
    const d = document.createElement('div');
    document.body.appendChild(d);

    const localStorage_key = 'guess-who-id';

    let id = localStorage.getItem(localStorage_key);
    if(!id) {
        id = 'xxxxxxxx'.replace(/./g, () => Math.floor(Math.random()*10)+'');
        localStorage.setItem(localStorage_key, id);
    }

    const flags = {id: id};

    const app = Elm.GuessWho.init({node: d, flags});

    const client = new Client(
        id,
        data => {
            app.ports.receiveMessage.send(data);
        }
    );

    app.ports.sendMessage.subscribe(message => {
        console.log('sending',message);
        client.send(message);
    });

    const fullscreener = document.body;
    fullscreener.addEventListener('click', e => {
        if(fullscreener.requestFullscreen) {
            fullscreener.requestFullscreen();
        }
        if(fullscreener.webkitRequestFullscreen) {
            fullscreener.webkitRequestFullscreen();
        }
    });
}

init_app();
