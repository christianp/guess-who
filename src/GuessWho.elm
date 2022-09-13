port module GuessWho exposing (..)

import Array exposing (Array)
import Browser
import Dict
import Grid exposing (Grid, fill)
import Html exposing (Html, div)
import Html.Attributes as HA
import Html.Events as HE
import Json.Decode as JD
import Json.Encode as JE
import Multiplayer exposing (MultiplayerGame, GameID, PlayerID, GameMsg(..), Msg(..))
import Random
import Random.Array
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
    , board : Board
    , chosen : Maybe Card
    }

type GameStage
    = WaitingToStart
    | InProgress
    | Finished

type alias Game =
    { id : GameID
    , players : List PlayerState
    , my_index : Int
    , stage : GameStage
    , replaying : Bool
    }

type alias Model = MultiplayerGame Game

type GameMsg
    = ClickPiece PlayerID Int Int
    | StartShufflingCards
    | ShuffledCards (Array Card) (List Card)

type alias MetaGameMsg = Multiplayer.GameMsg GameMsg

type alias Msg = Multiplayer.Msg GameMsg

rows = 5
cols = 5

card_definitions = Array.fromList
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
    , { image = "robinson.jpg", name = "Robinson" }
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
    , { image = "kovalevskaya.jpg", name = "Kovalevskaya" }
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
    , { image = "fourier.jpg", name = "Fourier" }
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
    , { image = "kepler.jpg", name = "Kepler" }
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
    , { image = "brahmagupta.jpg", name = "Brahmagupta" }
    , { image = "aryabhata.jpg", name = "Aryabhata" }
    , { image = "zu.jpg", name = "Zu" }
    , { image = "hypatia.jpg", name = "Hypatia" }
    , { image = "liu.jpg", name = "Liu" }
    , { image = "diophantus.jpg", name = "Diophantus" }
    , { image = "ptolemy.jpg", name = "Ptolemy" }
    , { image = "nicomachus.jpg", name = "Nicomachus" }
    , { image = "apollonius.jpg", name = "Apollonius" }
    , { image = "eratosthenes.jpg", name = "Eratosthenes" }
    , { image = "archimedes.jpg", name = "Archimedes" }
    , { image = "pingala.jpg", name = "Pingala" }
    , { image = "euclid.jpg", name = "Euclid" }
    , { image = "aristotle.jpg", name = "Aristotle" }
    , { image = "plato.jpg", name = "Plato" }
    , { image = "democritus.jpg", name = "Democritus" }
    , { image = "zeno.jpg", name = "Zeno" }
    , { image = "pythagoras.jpg", name = "Pythagoras" }
    , { image = "thales.jpg", name = "Thales" }
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
      }
    , Cmd.none
    )

shuffle_cards =
    Random.generate OtherGameMsg (
        (Random.Array.shuffle card_definitions |> Random.map (Array.slice 0 (rows*cols)))
        |> Random.andThen 
        (   \shuffled -> Random.List.shuffle (Array.toList shuffled)
         |> Random.map (\chosen -> ShuffledCards shuffled chosen)
        )
      )

blank_player i id =
    { id = id
    , board = make_board Array.empty
    , chosen = Nothing
    , role = case i of
        0 -> InCharge
        1 -> Playing
        2 -> Playing
        _ -> Observing
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

decode_move : JD.Decoder (List MetaGameMsg)
decode_move =
    JD.field "action" JD.string
    |> JD.andThen (\action ->
        let
            q = Debug.log "move action" action
        in
            case action of
                "shuffle cards" -> 
                    JD.map2 (\shown -> \chosen -> [OtherGameMsg (ShuffledCards shown chosen)])
                        (JD.field "shown_cards" <| JD.array decode_card)
                        (JD.field "chosen_cards" <| JD.list decode_card)
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

decode_card = JD.string |> JD.andThen (\name -> 
    case List.head <| (Array.toList >> List.filter (.name >> (==) name)) card_definitions of
        Just card -> JD.succeed card
        Nothing -> JD.fail <| "Unrecognised card "++name
    )

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

            OtherGameMsg (ShuffledCards shown_cards chosen_cards) -> 
                let
                    board = make_board shown_cards
                in
                    ( { game | stage = InProgress, players = List.map2 (\player -> \chosen -> { player | board = board, chosen = chosen }) game.players (List.map Just chosen_cards) }
                    , send_move game "shuffle cards" 
                        [ ("shown_cards", JE.array encode_card shown_cards)
                        , ("chosen_cards", JE.list encode_card chosen_cards)
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

            PlayerJoined id -> { game | players = game.players++[blank_player (List.length game.players) id] } |> nocmd

            EndGame -> { game | stage = Finished } |> nocmd

            _ -> (game, Cmd.none)

update_for_player : PlayerID -> (PlayerState -> PlayerState) -> Game -> Game
update_for_player id fn game = {game | players = List.map (\player -> if player.id == id then fn player else player) game.players }

click_piece col row playerstate = 
    { playerstate | board = Grid.update_cell (col,row) (\piece -> { piece | up = not piece.up }) playerstate.board }

subscriptions model = 
    Sub.batch
    [ receiveMessage Multiplayer.WebsocketMessage ]

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

view_game my_id game = 
    let
        n = (playing_players >> List.length) game
        my_state = get_my_state my_id game
        main_view =
            case game.stage of
                WaitingToStart -> 
                    div
                        []
                        [ Html.h1 [] [ Html.text game.id ]
                        , Html.p [] [ Html.text "Waiting for players" ]
                        , Html.p [] [ Html.text <| (fi n)++" "++(pluralise n "player" "players") ]
                        , Html.ul
                            []
                            (List.map (\p -> 
                                Html.li
                                    []
                                    [ Html.text <| p.id ++ " : " ++(if p.role == InCharge then "in charge" else "playing") ]
                            ) game.players )
                        ]

                InProgress -> view_boards my_state game

                Finished -> 
                    div
                        []
                        [ Html.p [] [ Html.text "The game is finished" ] 
                        , view_boards my_state game
                        ]

        controls =
            div
                [ HA.classList 
                    [ ("controls",True)
                    , ("always-visible", game.stage /= InProgress)
                    ]
                ]
                [ if game.stage == WaitingToStart && n >= 2 && my_state.role == InCharge then
                    Html.button
                        [ HE.onClick (Multiplayer.game_message StartShufflingCards)
                        ]
                        [ Html.text "Start the game" ]
                  else
                    div [] []
                , Html.button 
                    [ HE.onClick LeaveGame ]
                    [ Html.text "Leave the game" ]
                ]
    in
        Html.main_
            []
            [ Html.map Multiplayer.game_message main_view
            , controls
            ]

is_player p = p.role == Playing

playing_players game = List.filter is_player game.players

view_boards my_state game =
    case my_state.role of
        Playing -> 
            div
                [ HA.class "container one" ]
                [ view_player my_state (game.my_index-1) my_state ]
        _ ->
            div
                [ HA.class "container both" ]
                (List.indexedMap (view_player my_state) (playing_players game))

view_player : PlayerState -> Int -> PlayerState -> Html GameMsg
view_player my_state index state =
    div
        [ HA.class <| "player player-"++(fi index) ]

        [ view_chosen_card my_state state
        , view_board my_state state
        ]

view_board : PlayerState -> PlayerState -> Html GameMsg
view_board my_state player =
    let
        board = player.board
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

view_chosen_card my_state player = 
    div
        [ HA.class "chosen-card" ]
        [ case player.chosen of
            Nothing -> 
                div [] []

            Just card ->
                view_card card
        ]
