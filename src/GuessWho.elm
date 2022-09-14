port module GuessWho exposing (..)

import Array exposing (Array)
import Browser
import Browser.Events
import Dict
import Grid exposing (Grid, fill)
import Html exposing (Html, div)
import Html.Attributes as HA
import Html.Events as HE
import Json.Decode as JD
import Json.Decode.Extra
import Json.Encode as JE
import Multiplayer exposing (MultiplayerGame, GameID, PlayerID, GameMsg(..), Msg(..))
import Random
import Random.Array
import Random.Extra
import Random.List
import Tuple exposing (first, second, pair)
import Util exposing (pluralise)

fi = String.fromInt

port sendMessage : JE.Value -> Cmd msg
port receiveMessage : (JE.Value -> msg) -> Sub msg

main = Browser.document
    { init = init
    , update = update
    , subscriptions = subscriptions
    , view = view
    }

type alias Image = String

type alias Card =
    { image : Image
    , name : String
    }

type alias Piece =
    { card : Card
    , up : Bool
    }

type alias Board = Grid Piece

type Role
    = InCharge
    | Playing
    | Observing

type alias PlayerState =
    { id : PlayerID
    , role : Role
    , rounds : Array Round
    }

type alias Round =
    { board : Board
    , chosen : Maybe Card
    }

type GameStage
    = WaitingToStart
    | InProgress Int
    | Finished

type alias Game =
    { id : GameID
    , players : List PlayerState
    , my_index : Int
    , stage : GameStage
    , replaying : Bool
    , show_chosen_cards : Bool
    }

type alias Model = MultiplayerGame Game

type GameMsg
    = ClickPiece PlayerID Int Int
    | StartShufflingCards
    | ShuffledCards (List (Array Card, List Card))
    | SetRound Int
    | ShowChosenCards Bool

type alias MetaGameMsg = Multiplayer.GameMsg GameMsg

type alias Msg = Multiplayer.Msg GameMsg

rows = 5
cols = 5

round_definitions : List (Array Card)
round_definitions = List.map Array.fromList
    [
        [ { image = "viazovska.jpg", name = "Viazovska" }
        , { image = "avila.jpg", name = "Avila" }
        , { image = "mirzakhani.jpg", name = "Mirzakhani" }
        , { image = "tao.jpg", name = "Tao" }
        , { image = "perelman.jpg", name = "Perelman" }
        , { image = "zhang.jpg", name = "Zhang" }
        , { image = "daubechies.jpg", name = "Daubechies" }
        , { image = "bourgain.jpg", name = "Bourgain" }
        , { image = "wiles.jpg", name = "Wiles" }
        , { image = "shamir.jpg", name = "Shamir" }
        , { image = "yau.jpg", name = "Yau" }
        , { image = "matiyasevich.jpg", name = "Matiyasevich" }
        , { image = "thurston.jpg", name = "Thurston" }
        , { image = "uhlenbeck.jpg", name = "Uhlenbeck" }
        , { image = "conway.jpg", name = "Conway" }
        , { image = "langlands.jpg", name = "Langlands" }
        , { image = "cohen.jpg", name = "Cohen" }
        , { image = "easley.jpg", name = "Easley" }
        , { image = "appel.jpg", name = "Appel" }
        , { image = "penrose.jpg", name = "Penrose" }
        , { image = "nash.jpg", name = "Nash" }
        , { image = "grothendieck.jpg", name = "Grothendieck" }
        , { image = "serre.jpg", name = "Serre" }
        , { image = "mandelbrot.jpg", name = "Mandelbrot" }
        , { image = "wilkins.jpg", name = "Wilkins" }
        ]
    ,
        [ { image = "robinson.jpg", name = "Robinson" }
        , { image = "blackwell.jpg", name = "Blackwell" }
        , { image = "johnson.jpg", name = "Johnson" }
        , { image = "lorenz.jpg", name = "Lorenz" }
        , { image = "shannon.jpg", name = "Shannon" }
        , { image = "gardner.jpg", name = "Gardner" }
        , { image = "erdos.jpg", name = "Erdős" }
        , { image = "turing.jpg", name = "Turing" }
        , { image = "chern.jpg", name = "Chern" }
        , { image = "ulam.jpg", name = "Ulam" }
        , { image = "weil.jpg", name = "Weil" }
        , { image = "godel.jpg", name = "Gödel" }
        , { image = "neumann.jpg", name = "von Neumann" }
        , { image = "kolmogorov.jpg", name = "Kolmogorov" }
        , { image = "cartwright.jpg", name = "Cartwright" }
        , { image = "escher.jpg", name = "Escher" }
        , { image = "cox.jpg", name = "Cox" }
        , { image = "ramanujan.jpg", name = "Ramanujan" }
        , { image = "noether.jpg", name = "Noether" }
        , { image = "einstein.jpg", name = "Einstein" }
        , { image = "hardy.jpg", name = "Hardy" }
        , { image = "russell.jpg", name = "Russell" }
        , { image = "hilbert.jpg", name = "Hilbert" }
        , { image = "peano.jpg", name = "Peano" }
        , { image = "poincare.jpg", name = "Poincaré" }
        ]
    ,
        [ { image = "kovalevskaya.jpg", name = "Kovalevskaya" }
        , { image = "cantor.jpg", name = "Cantor" }
        , { image = "lie.jpg", name = "Lie" }
        , { image = "carroll.jpg", name = "Carroll" }
        , { image = "dedekind.jpg", name = "Dedekind" }
        , { image = "riemann.jpg", name = "Riemann" }
        , { image = "cayley.jpg", name = "Cayley" }
        , { image = "nightingale.jpg", name = "Nightingale" }
        , { image = "lovelace.jpg", name = "Lovelace" }
        , { image = "boole.jpg", name = "Boole" }
        , { image = "sylvester.jpg", name = "Sylvester" }
        , { image = "galois.jpg", name = "Galois" }
        , { image = "jacobi.jpg", name = "Jacobi" }
        , { image = "de-morgan.jpg", name = "De Morgan" }
        , { image = "hamilton.jpg", name = "Hamilton" }
        , { image = "bolyai.jpg", name = "Bolyai" }
        , { image = "abel.jpg", name = "Abel" }
        , { image = "lobachevsky.jpg", name = "Lobachevsky" }
        , { image = "babbage.jpg", name = "Babbage" }
        , { image = "mobius.jpg", name = "Möbius" }
        , { image = "cauchy.jpg", name = "Cauchy" }
        , { image = "somerville.jpg", name = "Somerville" }
        , { image = "gauss.jpg", name = "Gauss" }
        , { image = "germain.jpg", name = "Germain" }
        , { image = "zhenyi.jpg", name = "Wang" }
        ]
    ,
        [ { image = "fourier.jpg", name = "Fourier" }
        , { image = "legendre.jpg", name = "Legendre" }
        , { image = "mascheroni.jpg", name = "Mascheroni" }
        , { image = "laplace.jpg", name = "Laplace" }
        , { image = "monge.jpg", name = "Monge" }
        , { image = "lagrange.jpg", name = "Lagrange" }
        , { image = "banneker.jpg", name = "Banneker" }
        , { image = "lambert.jpg", name = "Lambert" }
        , { image = "agnesi.jpg", name = "Agnesi" }
        , { image = "euler.jpg", name = "Euler" }
        , { image = "chatelet.jpg", name = "Du Châtelet" }
        , { image = "bernoulli-2.jpg", name = "Bernoulli" }
        , { image = "simson.jpg", name = "Simson" }
        , { image = "de-moivre.jpg", name = "De Moivre" }
        , { image = "bernoulli-1.jpg", name = "Bernoulli" }
        , { image = "leibniz.jpg", name = "Leibniz" }
        , { image = "seki.jpg", name = "Seki" }
        , { image = "newton.jpg", name = "Newton" }
        , { image = "pascal.jpg", name = "Pascal" }
        , { image = "wallis.jpg", name = "Wallis" }
        , { image = "fermat.jpg", name = "Fermat" }
        , { image = "cavalieri.jpg", name = "Cavalieri" }
        , { image = "descartes.jpg", name = "Descartes" }
        , { image = "desargues.jpg", name = "Desargues" }
        , { image = "mersenne.jpg", name = "Mersenne" }
        ]
    ,
        [ { image = "kepler.jpg", name = "Kepler" }
        , { image = "galileo.jpg", name = "Galileo" }
        , { image = "napier.jpg", name = "Napier" }
        , { image = "stevin.jpg", name = "Stevin" }
        , { image = "viete.jpg", name = "Viète" }
        , { image = "nunes.jpg", name = "Pedro Nunes" }
        , { image = "cardano.jpg", name = "Cardano" }
        , { image = "tartaglia.jpg", name = "Tartaglia" }
        , { image = "copernicus.jpg", name = "Copernicus" }
        , { image = "leonardo.jpg", name = "Da Vinci" }
        , { image = "pacioli.jpg", name = "Pacioli" }
        , { image = "regiomontanus.jpg", name = "Regiomontanus" }
        , { image = "madhava.jpg", name = "Madhava" }
        , { image = "oresme.jpg", name = "Oresme" }
        , { image = "shijie.jpg", name = "Zhu Shijie" }
        , { image = "yang.jpg", name = "Yang" }
        , { image = "jiushao.jpg", name = "Qin" }
        , { image = "tusi.jpg", name = "Al-Din Tusi" }
        , { image = "li.jpg", name = "Li Ye" }
        , { image = "fibonacci.jpg", name = "Fibonacci" }
        , { image = "bhaskara-2.jpg", name = "Bhaskara II" }
        , { image = "khayyam.jpg", name = "Khayyam" }
        , { image = "al-haytham.jpg", name = "Al-Haytham" }
        , { image = "thabit.jpg", name = "Thabit" }
        , { image = "al-khwarizmi.jpg", name = "Al-Khwarizmi" }
        ]
    ]

make_piece card = { card = card, up = True }

make_board cards =
    let
        pieces = Array.map make_piece cards
    in
        { width = cols, height = rows, cells = pieces }

blank_game game_id players my_index = 
    ( { id = game_id
      , my_index = my_index
      , players = List.indexedMap blank_player players
      , stage = WaitingToStart
      , replaying = False
      , show_chosen_cards = False
      }
    , Cmd.none
    )

shuffle_cards =
    Random.generate (ShuffledCards >> OtherGameMsg) (Random.Extra.traverse shuffle_round round_definitions)

shuffle_round : Array Card -> Random.Generator (Array Card, List Card)
shuffle_round card_definitions =
    (Random.Array.shuffle card_definitions |> Random.map (Array.slice 0 (rows*cols)))
    |> Random.andThen 
    (   \shuffled -> Random.List.shuffle (Array.toList shuffled)
     |> Random.map (pair shuffled)
    )

blank_player i id =
    { id = id
    , rounds = Array.empty
    , role = case i of
        0 -> InCharge
        1 -> Playing
        2 -> Playing
        _ -> Observing
    }

blank_round =
    { board = make_board Array.empty
    , chosen = Nothing
    }

options : Model -> Multiplayer.GameOptions Game GameMsg
options model = 
    { blank_game = blank_game
    , update_game = update_game model.my_id
    , decode_websocket_message = decode_websocket_message
    , decode_move = decode_move
    }

decode_websocket_message : JD.Decoder (List MetaGameMsg)
decode_websocket_message =
    JD.field "action" JD.string
    |> JD.andThen (\action ->
        case action of
            _ -> JD.fail "nope"
      )

decode_round_definition : Array Card -> JD.Decoder (Array Card, List Card)
decode_round_definition card_definitions =
    let
        decode_card = JD.string |> JD.andThen (\name -> 
            case List.head <| (Array.toList >> List.filter (.name >> (==) name)) card_definitions of
                Just card -> JD.succeed card
                Nothing -> JD.fail <| "Unrecognised card "++name
            )
    in
        JD.map2 pair
            (JD.field "shown_cards" <| JD.array decode_card)
            (JD.field "chosen_cards" <| JD.list decode_card)

decode_move : JD.Decoder (List MetaGameMsg)
decode_move =
    JD.field "action" JD.string
    |> JD.andThen (\action ->
        let
            q = Debug.log "move action" action
        in
            case action of
                "shuffle cards" -> 
                    JD.map (\rounds -> [OtherGameMsg (ShuffledCards rounds)])
                        (JD.field "rounds" (Json.Decode.Extra.sequence (List.map decode_round_definition round_definitions)))

                "set round" ->
                    JD.map (SetRound >> OtherGameMsg >> List.singleton) (JD.field "round" JD.int)

                "show chosen cards" ->
                    JD.map (ShowChosenCards >> OtherGameMsg >> List.singleton) (JD.field "show" JD.bool)

                "click piece" ->
                    JD.map3
                        (\id -> \col -> \row -> [OtherGameMsg (ClickPiece id col row)])
                        (JD.field "player" JD.string)
                        (JD.field "col" JD.int)
                        (JD.field "row" JD.int)
                _ -> JD.succeed []
      )
    |> JD.map (\msgs -> [StartReplay]++msgs++[EndReplay])
    |> JD.map (Debug.log "done")

blank_model : Flags -> Model
blank_model info =
    { game = Nothing
    , global_state = Nothing
    , my_id = info.id
    }

type alias Flags = 
    { id : String 
    }

decode_flags : JD.Decoder Flags
decode_flags = JD.map (\id -> { id = id }) (JD.field "id" JD.string)

init : JE.Value -> (Model, Cmd Msg)
init flags = case JD.decodeValue decode_flags flags of
    Ok info -> 
        ( blank_model info 
        , Cmd.none
        )
    Err _ -> (blank_model {id = ""}, Cmd.none)

nocmd model = (model, Cmd.none)

update : Msg -> Model -> (Model, Cmd Msg)
update = Multiplayer.update options

encode_card = .name >> JE.string

send_move : Game -> String -> List (String, JE.Value) -> Cmd MetaGameMsg
send_move game action data = 
    if game.replaying then
        Cmd.none
    else
        Multiplayer.send_game_message "move" [ ("move", (JE.object ([ ("action", JE.string action) ] ++ data))) ]

update_game : PlayerID -> MetaGameMsg -> Game -> (Game, Cmd MetaGameMsg)
update_game my_id msg game = 
    let
        my_state = get_my_state my_id game
        qq = Debug.log "update" msg
    in
        case msg of
            StartReplay -> { game | replaying = True } |> nocmd

            EndReplay -> { game | replaying = False } |> nocmd

            OtherGameMsg (SetRound n) -> 
                ( { game | stage = InProgress n }
                , send_move game "set round" 
                    [ ("round", (JE.int n))
                    ]
                )

            OtherGameMsg (ShuffledCards rounds) -> 
                let
                    -- for a single round, make the pair (shown_cards, chosen_cards) for each player
                    make_round : (Array Card, List Card) -> List Round
                    make_round (shown_cards, chosen_cards) =
                        let
                            board = make_board shown_cards
                        in
                            List.map (Just >> Round board) chosen_cards

                    
                    each_players_rounds : List (List Round)
                    each_players_rounds = (List.map make_round rounds)

                    handle_round : List Round -> List PlayerState -> List PlayerState
                    handle_round round players =
                        List.map2
                            (\r -> \p -> { p | rounds = Array.push r p.rounds })
                            round 
                            players

                    nplayers : List PlayerState
                    nplayers = List.foldl
                        handle_round
                        game.players
                        each_players_rounds
                in
                    ( { game | stage = InProgress 0, players = nplayers  }
                    , send_move game "shuffle cards" 
                        [ ("rounds", JE.list 
                            (\(shown_cards, chosen_cards) ->
                                (JE.object
                                    [ ("shown_cards", JE.array encode_card shown_cards)
                                    , ("chosen_cards", JE.list encode_card chosen_cards)
                                    ]
                                )
                            )
                            rounds
                          )
                        ]
                    )

            OtherGameMsg (ClickPiece player_id col row) -> 
                ( update_for_player player_id (click_piece col row) game
                , send_move game "click piece"
                    [ ("player", JE.string player_id)
                    , ("col", JE.int col)
                    , ("row", JE.int row)
                    ]
                )

            OtherGameMsg StartShufflingCards -> (game, shuffle_cards)

            OtherGameMsg (ShowChosenCards show) ->
                ( { game | show_chosen_cards = show }
                , send_move game "show chosen cards"
                    [ ("show", JE.bool show)
                    ]
                )

            PlayerJoined id -> { game | players = game.players++[blank_player (List.length game.players) id] } |> nocmd

            EndGame -> { game | stage = Finished } |> nocmd

            _ -> (game, Cmd.none)

update_for_player : PlayerID -> (Round -> Round) -> Game -> Game
update_for_player id fn game = 
    case game.stage of
        InProgress n ->
            let
                update_round player = { player | rounds = Array.indexedMap (\r -> \round -> if r==n then fn round else round) player.rounds }
            in
                {game | players = List.map (\player -> if player.id == id then update_round player else player) game.players }

        _ -> game

click_piece : Int -> Int -> Round -> Round
click_piece col row round = 
    { round | board = Grid.update_cell (col,row) (\piece -> { piece | up = not piece.up }) round.board }

subscriptions model = 
    Sub.batch
    [ receiveMessage Multiplayer.WebsocketMessage 
    , Browser.Events.onKeyUp (handle_keypress model)
    ]

view model = 
    { title = "Guess Who?"
    , body = case model.game of
        Just game -> [ view_game model.my_id game ]
        Nothing -> [lobby model]
    }

header : Html msg
header = Html.header [] [ Html.h1 [] [ Html.text "Guess Who?" ] ]

lobby : Model -> Html Msg
lobby model =
    Html.div
        [ HA.id "app" ]
        [ header
        , Html.div
            []
            (case model.global_state of
                Nothing -> [ Html.div [ HA.id "not-connected" ] [ Html.text "Waiting for data from the server." ] ]
                Just state -> 
                    [ view_games state.games
                    , new_game_button model
                    , Html.div
                          [ HA.class "info" ]
                          [ Html.p
                              []
                              [ Html.text <| (String.fromInt state.num_players)++" "++(pluralise state.num_players "player" "players")++" connected" ]
                          , Html.p
                              [ HA.class "debug" ]
                              [ Html.text <| "You are: "++model.my_id ]
                          , Html.ul
                              [ HA.class "debug" ]
                              (List.map (\id -> Html.li [] [Html.text id]) state.clients)
                          ]
                    ]
            )
        ]


view_games : List Multiplayer.GameInfo -> Html Msg
view_games games =
    if List.isEmpty games then
        Html.p [] [ Html.text "There are no games at the moment" ]
    else
        Html.table
            [ HA.id "games" ]
            [ Html.thead
                []
                [ Html.tr
                    []
                    [ Html.th [] [ Html.text "Game ID"]
                    , Html.th [] [ Html.text "Players"]
                    ]
                ]
            , Html.tbody [] (List.map view_lobby_game games) 
            ]

view_lobby_game : Multiplayer.GameInfo -> Html Msg
view_lobby_game game =
    let
        num_players = List.length game.players
    in
        Html.tr
            [ HA.class "game" ]
            [ Html.td
                []
                [ Html.text game.id ]
            , Html.td
                [ HA.class "num-players" ]
                [ Html.text <| String.fromInt num_players ]
            , Html.td
                []
                [ Html.button
                    [ HE.onClick (Multiplayer.RequestJoinGame game) ]
                    [ Html.text "join" ]
                ]
            ]

new_game_button : Model -> Html Msg
new_game_button model =
    Html.button
        [ HA.id "new-game"
        , HE.onClick Multiplayer.NewGame
        ]
        [ Html.text "Start a new game" ]

get_my_state : PlayerID -> Game -> PlayerState
get_my_state my_id game = game.players |> List.filter (\p -> p.id == my_id) |> List.head |> Maybe.withDefault (blank_player -1 my_id)

view_game : PlayerID -> Game -> Html Msg
view_game my_id game = 
    let
        num_players = (playing_players >> List.length) game
        my_state = get_my_state my_id game
        main_view =
            case game.stage of
                WaitingToStart -> 
                    div
                        []
                        [ Html.h1 [] [ Html.text game.id ]
                        , Html.p [] [ Html.text "Waiting for players" ]
                        , Html.p [] [ Html.text <| (fi num_players)++" "++(pluralise num_players "player" "players") ]
                        , Html.ul
                            []
                            (List.map (\p -> 
                                Html.li
                                    []
                                    [ Html.text <| p.id ++ " : " ++(if p.role == InCharge then "in charge" else "playing") ]
                            ) game.players )
                        ]

                InProgress round -> view_boards round my_state game

                Finished -> 
                    div
                        []
                        [ Html.p [] [ Html.text "The game is finished" ] 
                        ]

        buttons = control_buttons game my_state

        controls : Html Msg
        controls =
            div
                [ HA.classList 
                    [ ("controls",True)
                    , ("always-visible", not (is_in_progress game))
                    ]
                ]
                (List.map 
                    (\b ->
                        Html.button
                            [ HE.onClick b.msg 
                            , HA.disabled b.disabled
                            ]
                            [ Html.text b.label ]
                    )
                    (List.filter .show buttons)
                )

        debugging = 
            Html.ul
                []
                (List.map (\p -> 
                    Html.li
                        []
                        [ Html.p [] [ Html.text p.id ] 
                        , Html.p [] [ Html.text (fi (Array.length p.rounds)) ]
                        , Html.ul
                            []
                            (Array.toList p.rounds |> List.map (.chosen >> Maybe.withDefault { name="", image = ""} >> view_card))
                        ]
                    )
                    game.players
                )

    in
        Html.main_
            []
            [ Html.map Multiplayer.game_message main_view
            , controls
            ]

is_in_progress game = case game.stage of
    InProgress _ -> True
    _ -> False

control_buttons : Game -> PlayerState -> List { show : Bool, disabled: Bool, msg : Msg, label : String, key : String }
control_buttons game my_state =
    let
        num_players = (playing_players >> List.length) game

        round_number = case game.stage of
            InProgress n -> n
            _ -> -1
    in
        [ { show = game.stage == WaitingToStart && my_state.role == InCharge
          , disabled = num_players < 2
          , msg = Multiplayer.game_message StartShufflingCards
          , label = "Start the game"
          , key = "s"
          }
        , { show = True
          , disabled = False
          , msg = LeaveGame
          , label = "Leave the game"
          , key = "l"
          }
        , { show = is_in_progress game && my_state.role == InCharge
          , disabled = round_number <= 0
          , msg = Multiplayer.game_message (SetRound (round_number - 1))
          , label = "Previous round"
          , key = "p"
          }
        , { show = is_in_progress game && my_state.role == InCharge
          , disabled = round_number >= (List.length round_definitions) - 1
          , msg = Multiplayer.game_message (SetRound (round_number + 1))
          , label = "Next round"
          , key = "n"
          }
        , { show = is_in_progress game && my_state.role == InCharge
          , disabled = False
          , msg = Multiplayer.game_message (ShowChosenCards (not game.show_chosen_cards))
          , label = if game.show_chosen_cards then "Hide target cards" else "Show target cards"
          , key = "t"
          }
        ]


handle_keypress : Model -> JD.Decoder Msg
handle_keypress model = case model.game of
    Just game -> 
        let
            my_state = get_my_state model.my_id game
            buttons = control_buttons game my_state
            keymap = Dict.fromList (List.map (\b -> (b.key, b)) buttons)
        in
            JD.field "key" JD.string |> JD.map (Debug.log "keypress") |> JD.andThen (\key -> case Dict.get key keymap of
                Just b -> if b.show && not b.disabled then JD.succeed b.msg else JD.fail "This key is disabled"
                Nothing -> JD.fail <| "Unrecognised key "++key
            )

    Nothing -> JD.fail ""

is_player p = p.role == Playing

playing_players game = List.filter is_player game.players

view_boards : Int -> PlayerState -> Game -> Html GameMsg
view_boards round_number my_state game =
    let
        vp = view_player round_number my_state
    in
        case my_state.role of
            Playing -> 
                div
                    [ HA.class "container one" ]
                    [ vp True (game.my_index-1) my_state ]
            _ ->
                div
                    [ HA.class "container both" ]
                    (List.indexedMap (vp game.show_chosen_cards) (playing_players game))

view_player : Int -> PlayerState -> Bool -> Int -> PlayerState -> Html GameMsg
view_player round_number my_state show_chosen_card index state =
    let
        round = Array.get round_number state.rounds |> Maybe.withDefault blank_round
    in
        div
            [ HA.classList
                [ ("player",True)
                , ("player-"++(fi index),True)
                , ("show-chosen-card", show_chosen_card)
                ]
            ]

            [ view_chosen_card round my_state state
            , view_board round my_state state
            ]

view_board : Round -> PlayerState -> PlayerState -> Html GameMsg
view_board round my_state player =
    let
        board = round.board
        is_me = my_state.id == player.id
        view_piece col row piece =
            Html.div
                ( [ HA.classList
                    [ ("piece", True)
                    , ("up", piece.up)
                    ]
                  , HA.style "grid-area" <| (fi (row+1)) ++ "/" ++ (fi (col+1))
                  , HA.attribute "role" "button"
                  ]
                  ++ (if is_me then
                      [ HE.onClick <| ClickPiece player.id col row ]
                     else
                      []
                     )
                )

                [ view_card piece.card
                ]
    in
        Html.div
            [ HA.classList
                [ ("board", True)
                , ("me", is_me)
                ]
            , HA.attribute "style" <| "--rows: "++(fi board.height)
            ]
            (List.concat <| Array.toList <| Grid.indexedMap view_piece (\_ -> Array.toList) board)

view_card card = 
    div
        [ HA.class "card" ]
        [ Html.img
            [ HA.src <| "images/"++card.image
            ]
            []
        , Html.div 
            [ HA.class "name" ]
            [ Html.text card.name ]
        ]

view_chosen_card round my_state player = 
    div
        [ HA.class "chosen-card" ]
        [ case round.chosen of
            Nothing -> 
                div [] []

            Just card ->
                view_card card
        ]
