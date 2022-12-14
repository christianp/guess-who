const loc = window.location;
const WEBSOCKET_URL = (loc.protocol == 'https:' ? 'wss:' : 'ws:') + loc.host + loc.pathname;

export class Client {
    constructor(info, message_callback) {
        this.info = info;
        this.open_websocket();
        this.message_callback = message_callback;
    }

    open_websocket() {
        const ws = new WebSocket(WEBSOCKET_URL);
        this.ws = new Promise((resolve,reject) => {
            ws.addEventListener('open', e => {
                console.log('ws open');
                resolve(ws);
                this.send({action:'init', info: this.info});
            })
            ws.addEventListener('message', e => {
                this.receive_message(JSON.parse(e.data));
            })
            ws.addEventListener('close', e => {
                console.info('websocket closed');
            })
        });
    }

    async send(data) {
        (await this.ws).send(JSON.stringify(data));
    }

    receive_message(data) {
        if(!(data && data.action=='aglobal_stats')) {
            console.log('receive',data);
        }
        this.message_callback(data);
    }

    error(message) {
        console.error(`Client error: ${message}`);
    }
}
