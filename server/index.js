const fs = require('fs');
const friendlyWords = require('friendly-words');
const WebSocket = require('ws');

function choice(list) {
    return list[Math.floor(Math.random()*list.length)];
}

function random_id() {
    const length = 3;
    const bits = [];
    for(let i=0;i<length;i++) {
        bits.push(choice(friendlyWords.objects));
    }
    return bits.join('-');
}

class Game {
    constructor(server) {
        this.server = server;
        this.start_time = new Date();
        this.id = random_id();
        this.state = 'beginning';
        this.players = [];
        this.server.games.set(this.id, this);
        this.history = [];
    }

    send(data, exclude_clients = []) {
        const clients = this.players.map(c => this.server.clients_by_id.get(c.id)).filter(c => c && exclude_clients.indexOf(c)==-1);
        data.game_id = this.id;
        console.log('game send',data)
        for(let c of clients) {
            c.send(data);
        }
    }

    receive_message(client, data) {
        const fn = this['handle_'+data.action];
        if(fn!==undefined) {
            return fn.apply(this,[client, data]);
        } else {
            this.error(`Unrecognised game action ${data.action}`);
        }
    }

    handle_info(client, data) {
        client.send({action: 'game_state', state: this.info()});
    }

    handle_move(client, data) {
        this.move(client, data);
    }

    add_player(client) {
        if(this.players.find(c=>c.id == client.id)) {
            throw(new Error("You're already in this game."));
        }
        this.players.push(client);
        this.send({action: 'game_player_joined', client: client.json_summary()});
    }

    remove_player(client) {
        console.log(`remove ${client.id}`);
        this.players = this.players.filter(c=>c.id != client.id);
    }

    info() {
        return {
            id: this.id,
            state: this.state,
            players: this.players.map(c=>c.json_summary()),
            history: this.history
        }
    }

    move(client, data) {
        console.log('move', data);
        this.history.push(data.move);
        this.send(data, [client]);
        this.write_log();
    }
  
    write_log() {
        fs.writeFile(`games/${this.start_time.toISOString()}-${this.id}.json`, JSON.stringify(this.history), err => {
            if (err) {
                console.error(err)
                return
            }
        });
    }

    end() {
        console.log(`end game ${this.id}`);
        this.send({action: 'end_game'});
        this.server.games.delete(this.id);
    }
}

class Client {
    constructor(server, ws) {
        this.server = server;
        this.n = this.server.client_acc++;
        this.ws = ws;
        this.state = 'uninitialised';
        this.closed = false;
        this.id = null;
        this.name = null;
        console.log('new connection',this.n);
    }

    json_summary() {
        return {
            id: this.id,
            name: this.name
        };
    }

    send(data) {
        this.ws.send(JSON.stringify(data));
    }

    set_state(state) {
        this.state = state;
        this.send({action: 'set_state', state: state});
    }

    set_ws(ws) {
        console.log('set ws',this.n);
        this.ws = ws;
        this.server.clients.set(this.ws, this);
        this.closed = false;
    }

    set_id(id) {
        console.log('set id',id);
        const oclient = this.server.clients_by_id.get(id);
        if(oclient) {
            oclient.reconnect(this.ws);
            oclient.send({action: 'hi', message: `hi again, ${id}`});
            this.disconnect();
            return;
        }

        console.log('id is',id);
        this.id = id;
        this.server.clients_by_id.set(id, this);
        this.state = 'floating';
        this.send({action: 'hi', message: `hi, ${id}`});
    }

    set_name(name) {
        console.log(`set name for "${this.id}" to "${name}"`);
        this.name = name;
    }

    join_game(game) {
        if(this.game) {
            this.error(`You're already in the game ${this.game.id}`);
            return;
        }
        this.game = game;
        console.log(`${this.id} joining game ${game.id}`);
        try {
            game.add_player(this);
            this.send({action: 'join_game', state: game.info(), my_index: game.players.map(c=>c.id).indexOf(this.id)});
        } catch(e) {
            this.error(`Error joining the game ${game.id}: ${e}`);
        }
    }

    leave_game() {
        if(!this.game) {
            this.error(`You're not in a game`);
            return;
        }

        const game = this.game;
        console.log(`${this.id}l leaving game ${game.id}`);
        this.game = null;
        game.remove_player(this);
        this.send({action: 'left_game', id: game.id});
    }

    error(message) {
        console.error(message);
        this.send({action: 'error', message: message});
    }

    disconnect() {
        console.log('disconnect',this.id, this.n);
        this.closed = true;
        this.server.clients.delete(this);

        if(this.id) {
            this.timeout = setTimeout(() => {
                this.forget();
            }, this.server.TIMEOUT_DURATION);
        } else {
            this.forget();
        }
    }

    reconnect(ws) {
        console.log('reconnect',this.id);
        this.server.clients.delete(this.ws);
        this.set_ws(ws);
        if(this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        if(this.game) {
            this.send({action: 'join_game', state: this.game.info(), my_index: this.game.players.map(c=>c.id).indexOf(this.id)});
        }
    }

    forget() {
        console.log('forget',this.id);
        if(this.game) {
            this.leave_game();
        }
        this.server.clients_by_id.delete(this.id);
    }

    receive_message(data) {
        const fn = this['handle_'+data.action];
        if(fn!==undefined) {
            return fn.apply(this,[data]);
        } else {
            console.log(data);
            this.error(`Unrecognised server action ${data.action}`);
        }
    }

    handle_global_stats(data) {
        this.send({
            action: 'global_stats',
            data: this.server.global_stats()
        });
    }

    handle_init(data) {
        console.log(data);
        this.set_id(data.info.id);
        this.set_name(data.info.name);
    }

    handle_set_name(data) {
        this.set_name(data.name);
    }

    handle_new_game(data) {
        if(this.game) {
            this.error(`You're already in the game ${this.game.id}`);
            return;
        }
        const g = this.server.new_game();
        this.join_game(g);
    }

    handle_join_game(data) {
        const g = this.server.games.get(data.id);
        if(!g) {
            this.error(`The game ${data.id} can't be found.`);
            return;
        }
        this.join_game(g);
    }

    handle_leave_game(data) {
        this.leave_game();
    }

    handle_game(data) {
        if(!this.game) {
            this.error("You're not in a game.");
            return;
        }
        this.game.receive_message(this, data.data);
    }
}

class GameServer {
    TIMEOUT_DURATION = 10 * 1000;
    GLOBAL_STATS_INTERVAL = 2 * 1000;

    client_acc = 0;

    constructor() {
        this.wss = new WebSocket.Server({ noServer: true });

        // map game IDs to Game objects
        this.games = new Map();

        // map websockets to Client objects
        this.clients = new Map();

        // map client IDs to Client objects
        this.clients_by_id = new Map();


        this.wss.on('connection', (ws) => {
            this.clients.set(ws, new Client(this, ws));

            ws.on('message', (messageAsString) => {
                const message = JSON.parse(messageAsString);
                const client = this.clients.get(ws);
                client.receive_message(message);
            });

            ws.on("close", () => {
                const client = this.clients.get(ws);
                if(client) {
                    client.disconnect();
                }
            });
        });

        setInterval(() => {
            this.broadcast({
                action: 'global_stats',
                data: this.global_stats()
            });
        },this.GLOBAL_STATS_INTERVAL)
    }

    new_game() {
        const g = new Game(this);
        return g;
    }

    broadcast(data) {
        for(let c of this.clients.values()) {
            c.send(data);
        }
    }

    global_stats() {
        return {
            num_clients: Array.from(this.clients.values()).filter(c=>!c.closed).length,
            clients: Array.from(this.clients.values()).filter(c=>c.id).map(c => c.json_summary()),
            games: Array.from(this.games.values()).map(g=>g.info())
        }
    }
}

const game_server = new GameServer();

const http = require('http');

const finalhandler = require('finalhandler');
const serveStatic = require('serve-static');

const serve = serveStatic("../client");

var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});

server.on('upgrade', (request, socket, head) => {
    game_server.wss.handleUpgrade(request, socket, head, ws => {
        game_server.wss.emit('connection',ws,request);
    });
});

const {PORT} = process.env;
server.listen(PORT, '0.0.0.0');
console.info(`Server running on port ${PORT}`);

