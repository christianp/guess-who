port module Multiplayer exposing (MultiplayerGame, GameID, PlayerID, GameInfo, GlobalState, GameMsg(..), send_message, Msg(..), GameOptions, get_global_stats, update, decode_global_state, decode_game_info, game_message, send_game_message)

import Dict
import Json.Decode as JD
import Json.Encode as JE

type alias GameID = String
type alias PlayerID = String

type alias GameOptions game gamemsg lobby lobbymsg =
    { update_game : GameMsg gamemsg -> game -> (game, Cmd (GameMsg gamemsg))
    , update_lobby: lobbymsg -> lobby -> (lobby, Cmd lobbymsg)
    , blank_game : PlayerID -> (List PlayerID) -> Int -> (game, Cmd (Msg gamemsg lobbymsg))
    , decode_websocket_message : JD.Decoder (List (GameMsg gamemsg))
    , decode_move : JD.Decoder (List (GameMsg gamemsg))
    }

type alias MultiplayerGame game lobby =
    { game : Maybe game
    , lobby: lobby
    , global_state : Maybe GlobalState
    , my_id : PlayerID
    }

type alias GameInfo =
    { id : GameID
    , players: List PlayerID
    , state : String
    }

type alias GlobalState =
    { games : List GameInfo
    , clients : List PlayerID
    , num_players : Int
    }

type GameMsg msg
    = Restart
    | StartReplay
    | EndReplay
    | PlayerJoined PlayerID
    | EndGame
    | OtherGameMsg msg

port sendMessage : JE.Value -> Cmd msg
port receiveMessage : (JE.Value -> msg) -> Sub msg

send_message : String -> List (String, JE.Value) -> Cmd msg
send_message action = (::) ("action", JE.string action) >> Dict.fromList >> JE.dict identity identity >> sendMessage

send_game_message : String -> List (String, JE.Value) -> Cmd msg
send_game_message action data = send_message "game" [ ("data", JE.object ([("action", JE.string action)]++data)) ]

type Msg gamemsg lobbymsg
    = JoinGame String (List (GameMsg gamemsg)) (List PlayerID) Int
    | RequestJoinGame GameInfo
    | LeaveGame
    | GameMsg (GameMsg gamemsg)
    | LobbyMsg lobbymsg
    | WebsocketMessage JE.Value
    | NewGame
    | RequestGlobalState
    | SetGlobalState GlobalState

game_message : gamemsg -> Msg gamemsg lobbymsg
game_message = OtherGameMsg >> GameMsg

nocmd : model -> (model, Cmd msg)
nocmd model = (model, Cmd.none)

get_global_stats : Cmd (Msg gamemsg lobbymsg)
get_global_stats = send_message "global_stats" []

update : (MultiplayerGame game lobby -> GameOptions game gamemsg lobby lobbymsg) -> Msg gamemsg lobbymsg -> MultiplayerGame game lobby -> (MultiplayerGame game lobby, Cmd (Msg gamemsg lobbymsg))
update options_fn msg model = 
    let
        options = options_fn model
    in
        case msg of
            RequestJoinGame game -> (model, send_message "join_game" [ ("id", JE.string game.id) ])
            JoinGame id history players my_index -> 
                let
                    (blank_game, init_cmd) = options.blank_game id players my_index
                    (game, cmd) = apply_updates options.update_game blank_game ([StartReplay]++history++[EndReplay])
                in
                    ( { model | game = Just game }, Cmd.batch [init_cmd, Cmd.map GameMsg cmd] )
            LeaveGame -> ({ model | game = Nothing }, send_message "leave_game" [])
            GameMsg gmsg -> 
                case gmsg of
                    Restart -> update (\_ -> options) LeaveGame model
                    _ -> case model.game of
                        Nothing -> nocmd model
                        Just game -> 
                            let
                                (ng, gcmd) = options.update_game gmsg game
                            in
                                ({ model | game = Just ng }, Cmd.map GameMsg gcmd)
            LobbyMsg lmsg ->
                let
                    (nl, lcmd) = options.update_lobby lmsg model.lobby
                in
                    ({ model | lobby = nl }, Cmd.map LobbyMsg lcmd)
            WebsocketMessage encoded_data -> apply_websocket_message options encoded_data model
            NewGame -> (model, send_message "new_game" [])
            RequestGlobalState -> (model, get_global_stats )
            SetGlobalState state -> { model | global_state = Just state } |> nocmd


apply_updates : (msg -> model -> (model, Cmd msg)) -> model -> List msg -> (model, Cmd msg)
apply_updates updater model msgs =
    List.foldl 
        (\msg -> \(m, c) -> 
            let
                (nm,nc) = updater msg m
            in
                (nm, if c==Cmd.none then nc else if nc==Cmd.none then c else Cmd.batch [c,nc])
        ) 
        (model, Cmd.none)
        msgs


apply_websocket_message : GameOptions game gamemsg lobby lobbymsg -> JE.Value -> MultiplayerGame game lobby -> (MultiplayerGame game lobby, Cmd (Msg gamemsg lobbymsg))
apply_websocket_message options encoded_data model =
    let
        standard_actions : JD.Decoder (List (Msg gamemsg lobbymsg))
        standard_actions = 
            JD.field "action" JD.string
            |> JD.andThen (\action ->
                case action of
                    "move" -> 
                        JD.field "move" options.decode_move
                        |> JD.map (List.map GameMsg)
                    "join_game" ->
                        JD.map List.singleton
                        <| JD.map4 JoinGame
                            (JD.at ["state","id"] JD.string)
                            (JD.map List.concat (JD.at ["state", "history"] (JD.list options.decode_move)))
                            (JD.at ["state", "players"] (JD.list JD.string))
                            (JD.field "my_index" JD.int)
                    "game_player_joined" ->
                        JD.field "player_id" JD.string
                        |> JD.map (PlayerJoined >> GameMsg >> List.singleton)
                    "end_game" ->
                        JD.succeed [GameMsg EndGame]
                    "global_stats" -> JD.map (SetGlobalState >> List.singleton) decode_global_state
                    "hi" -> JD.succeed []
                    _ -> JD.fail ("unrecognised action "++action)
                )

        decode_websocket_message =
            JD.map2
                (\standard -> \specific -> List.filterMap identity [standard, specific] |> List.concat)
                (JD.map Just standard_actions)
                ((JD.map (List.map GameMsg) >> JD.maybe) options.decode_websocket_message)
    in
        case JD.decodeValue decode_websocket_message encoded_data of
            Ok msgs -> apply_updates (update (\_ -> options)) model msgs
            Err x -> 
                let
                    q = Debug.log "error" x
                in
                    nocmd model


decode_global_state : JD.Decoder GlobalState
decode_global_state =
    JD.field "data" <| 
    JD.map3
        GlobalState
        (JD.field "games" (JD.list decode_game_info))
        (JD.field "clients" (JD.list JD.string))
        (JD.field "num_clients" JD.int)

decode_game_info : JD.Decoder GameInfo
decode_game_info =
    JD.map3 GameInfo
        (JD.field "id" JD.string)
        (JD.field "players" (JD.list JD.string))
        (JD.field "state" JD.string)
