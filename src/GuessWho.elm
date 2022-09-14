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
    , short_name : String
    , full_name : String
    , url : String
    , description : List String
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
    , info_card : Maybe Card
    }

type alias Model = MultiplayerGame Game

type GameMsg
    = ClickPiece PlayerID Int Int
    | StartShufflingCards
    | ShuffledCards (List (Array Card, List Card))
    | SetRound Int
    | ShowChosenCards Bool
    | HoverCard Card

type alias MetaGameMsg = Multiplayer.GameMsg GameMsg

type alias Msg = Multiplayer.Msg GameMsg

rows = 5
cols = 5

round_definitions : List (Array Card)
round_definitions = List.map Array.fromList
    [
        [ { image = "viazovska.jpg", full_name = "Maryna Viazovska", short_name = "Viazovska", url = "https://en.wikipedia.org/wiki/Maryna_Viazovska", description = [ "Maryna Sergiivna Viazovska is a Ukrainian mathematician known for her work in sphere packing.", "She is full professor and Chair of Number Theory at the Institute of Mathematics of the École Polytechnique Fédérale de Lausanne in Switzerland.", "She was awarded the Fields Medal in 2022."] }
        , { image = "avila.jpg", full_name = "Artur Avila", short_name = "Avila", url = "", description = [] }
        , { image = "mirzakhani.jpg", full_name = "Maryam Mirzakhani", short_name = "Mirzakhani", url = "", description = [] }
        , { image = "tao.jpg", full_name = "Terence Tao", short_name = "Tao", url = "", description = [] }
        , { image = "perelman.jpg", full_name = "Grigory Perelman", short_name = "Perelman", url = "", description = [] }
        , { image = "zhang.jpg", full_name = "Yitang Zhang", short_name = "Zhang", url = "", description = [] }
        , { image = "daubechies.jpg", full_name = "Ingrid Daubechies", short_name = "Daubechies", url = "", description = [] }
        , { image = "bourgain.jpg", full_name = "Jean Bourgain", short_name = "Bourgain", url = "", description = [] }
        , { image = "wiles.jpg", full_name = "Andrew Wiles", short_name = "Wiles", url = "", description = [] }
        , { image = "shamir.jpg", full_name = "Adi Shamir", short_name = "Shamir", url = "", description = [] }
        , { image = "yau.jpg", full_name = "Shing-Tung Yau", short_name = "Yau", url = "", description = [] }
        , { image = "matiyasevich.jpg", full_name = "Yuri Matiyasevich", short_name = "Matiyasevich", url = "", description = [] }
        , { image = "thurston.jpg", full_name = "William Thurston", short_name = "Thurston", url = "", description = [] }
        , { image = "uhlenbeck.jpg", full_name = "Karen Uhlenbeck", short_name = "Uhlenbeck", url = "", description = [] }
        , { image = "conway.jpg", full_name = "John H. Conway", short_name = "Conway", url = "", description = [] }
        , { image = "langlands.jpg", full_name = "Robert Langlands", short_name = "Langlands", url = "", description = [] }
        , { image = "cohen.jpg", full_name = "Paul Cohen", short_name = "Cohen", url = "", description = [] }
        , { image = "easley.jpg", full_name = "Annie Easley", short_name = "Easley", url = "", description = [] }
        , { image = "appel.jpg", full_name = "Kenneth Appel", short_name = "Appel", url = "", description = [] }
        , { image = "penrose.jpg", full_name = "Roger Penrose", short_name = "Penrose", url = "", description = [] }
        , { image = "nash.jpg", full_name = "John Nash", short_name = "Nash", url = "", description = [] }
        , { image = "grothendieck.jpg", full_name = "Alexandre Grothendieck", short_name = "Grothendieck", url = "", description = [] }
        , { image = "serre.jpg", full_name = "Jean-Pierre Serre", short_name = "Serre", url = "", description = [] }
        , { image = "mandelbrot.jpg", full_name = "Benoit Mandelbrot", short_name = "Mandelbrot", url = "", description = [] }
        , { image = "wilkins.jpg", full_name = "J. Ernest Wilkins Jr.", short_name = "Wilkins", url = "", description = [] }
        ]
    ,
        [ { image = "robinson.jpg", full_name = "", short_name = "Robinson", url = "", description = [] }
        , { image = "blackwell.jpg", full_name = "", short_name = "Blackwell", url = "", description = [] }
        , { image = "johnson.jpg", full_name = "", short_name = "Johnson", url = "", description = [] }
        , { image = "lorenz.jpg", full_name = "", short_name = "Lorenz", url = "", description = [] }
        , { image = "shannon.jpg", full_name = "", short_name = "Shannon", url = "", description = [] }
        , { image = "gardner.jpg", full_name = "", short_name = "Gardner", url = "", description = [] }
        , { image = "erdos.jpg", full_name = "", short_name = "Erdős", url = "", description = [] }
        , { image = "turing.jpg", full_name = "", short_name = "Turing", url = "", description = [] }
        , { image = "chern.jpg", full_name = "", short_name = "Chern", url = "", description = [] }
        , { image = "ulam.jpg", full_name = "", short_name = "Ulam", url = "", description = [] }
        , { image = "weil.jpg", full_name = "", short_name = "Weil", url = "", description = [] }
        , { image = "godel.jpg", full_name = "", short_name = "Gödel", url = "", description = [] }
        , { image = "neumann.jpg", full_name = "", short_name = "von Neumann", url = "", description = [] }
        , { image = "kolmogorov.jpg", full_name = "", short_name = "Kolmogorov", url = "", description = [] }
        , { image = "cartwright.jpg", full_name = "", short_name = "Cartwright", url = "", description = [] }
        , { image = "escher.jpg", full_name = "", short_name = "Escher", url = "", description = [] }
        , { image = "cox.jpg", full_name = "", short_name = "Cox", url = "", description = [] }
        , { image = "ramanujan.jpg", full_name = "", short_name = "Ramanujan", url = "", description = [] }
        , { image = "noether.jpg", full_name = "", short_name = "Noether", url = "", description = [] }
        , { image = "einstein.jpg", full_name = "", short_name = "Einstein", url = "", description = [] }
        , { image = "hardy.jpg", full_name = "", short_name = "Hardy", url = "", description = [] }
        , { image = "russell.jpg", full_name = "", short_name = "Russell", url = "", description = [] }
        , { image = "hilbert.jpg", full_name = "", short_name = "Hilbert", url = "", description = [] }
        , { image = "peano.jpg", full_name = "", short_name = "Peano", url = "", description = [] }
        , { image = "poincare.jpg", full_name = "", short_name = "Poincaré", url = "", description = [] }
        ]
    ,
        [ { image = "kovalevskaya.jpg", full_name = "", short_name = "Kovalevskaya", url = "", description = [] }
        , { image = "cantor.jpg", full_name = "", short_name = "Cantor", url = "", description = [] }
        , { image = "lie.jpg", full_name = "", short_name = "Lie", url = "", description = [] }
        , { image = "carroll.jpg", full_name = "", short_name = "Carroll", url = "", description = [] }
        , { image = "dedekind.jpg", full_name = "", short_name = "Dedekind", url = "", description = [] }
        , { image = "riemann.jpg", full_name = "", short_name = "Riemann", url = "", description = [] }
        , { image = "cayley.jpg", full_name = "", short_name = "Cayley", url = "", description = [] }
        , { image = "nightingale.jpg", full_name = "", short_name = "Nightingale", url = "", description = [] }
        , { image = "lovelace.jpg", full_name = "", short_name = "Lovelace", url = "", description = [] }
        , { image = "boole.jpg", full_name = "", short_name = "Boole", url = "", description = [] }
        , { image = "sylvester.jpg", full_name = "", short_name = "Sylvester", url = "", description = [] }
        , { image = "galois.jpg", full_name = "", short_name = "Galois", url = "", description = [] }
        , { image = "jacobi.jpg", full_name = "", short_name = "Jacobi", url = "", description = [] }
        , { image = "de-morgan.jpg", full_name = "", short_name = "De Morgan", url = "", description = [] }
        , { image = "hamilton.jpg", full_name = "", short_name = "Hamilton", url = "", description = [] }
        , { image = "bolyai.jpg", full_name = "", short_name = "Bolyai", url = "", description = [] }
        , { image = "abel.jpg", full_name = "", short_name = "Abel", url = "", description = [] }
        , { image = "lobachevsky.jpg", full_name = "", short_name = "Lobachevsky", url = "", description = [] }
        , { image = "babbage.jpg", full_name = "", short_name = "Babbage", url = "", description = [] }
        , { image = "mobius.jpg", full_name = "", short_name = "Möbius", url = "", description = [] }
        , { image = "cauchy.jpg", full_name = "", short_name = "Cauchy", url = "", description = [] }
        , { image = "somerville.jpg", full_name = "", short_name = "Somerville", url = "", description = [] }
        , { image = "gauss.jpg", full_name = "", short_name = "Gauss", url = "", description = [] }
        , { image = "germain.jpg", full_name = "", short_name = "Germain", url = "", description = [] }
        , { image = "zhenyi.jpg", full_name = "", short_name = "Wang", url = "", description = [] }
        ]
    ,
        [ { image = "fourier.jpg", full_name = "", short_name = "Fourier", url = "", description = [] }
        , { image = "legendre.jpg", full_name = "", short_name = "Legendre", url = "", description = [] }
        , { image = "mascheroni.jpg", full_name = "", short_name = "Mascheroni", url = "", description = [] }
        , { image = "laplace.jpg", full_name = "", short_name = "Laplace", url = "", description = [] }
        , { image = "monge.jpg", full_name = "", short_name = "Monge", url = "", description = [] }
        , { image = "lagrange.jpg", full_name = "", short_name = "Lagrange", url = "", description = [] }
        , { image = "banneker.jpg", full_name = "", short_name = "Banneker", url = "", description = [] }
        , { image = "lambert.jpg", full_name = "", short_name = "Lambert", url = "", description = [] }
        , { image = "agnesi.jpg", full_name = "", short_name = "Agnesi", url = "", description = [] }
        , { image = "euler.jpg", full_name = "", short_name = "Euler", url = "", description = [] }
        , { image = "chatelet.jpg", full_name = "", short_name = "Du Châtelet", url = "", description = [] }
        , { image = "bernoulli-2.jpg", full_name = "", short_name = "Bernoulli", url = "", description = [] }
        , { image = "simson.jpg", full_name = "", short_name = "Simson", url = "", description = [] }
        , { image = "de-moivre.jpg", full_name = "", short_name = "De Moivre", url = "", description = [] }
        , { image = "bernoulli-1.jpg", full_name = "", short_name = "Bernoulli", url = "", description = [] }
        , { image = "leibniz.jpg", full_name = "", short_name = "Leibniz", url = "", description = [] }
        , { image = "seki.jpg", full_name = "", short_name = "Seki", url = "", description = [] }
        , { image = "newton.jpg", full_name = "", short_name = "Newton", url = "", description = [] }
        , { image = "pascal.jpg", full_name = "", short_name = "Pascal", url = "", description = [] }
        , { image = "wallis.jpg", full_name = "", short_name = "Wallis", url = "", description = [] }
        , { image = "fermat.jpg", full_name = "", short_name = "Fermat", url = "", description = [] }
        , { image = "cavalieri.jpg", full_name = "", short_name = "Cavalieri", url = "", description = [] }
        , { image = "descartes.jpg", full_name = "", short_name = "Descartes", url = "", description = [] }
        , { image = "desargues.jpg", full_name = "", short_name = "Desargues", url = "", description = [] }
        , { image = "mersenne.jpg", full_name = "", short_name = "Mersenne", url = "", description = [] }
        ]
    ,
        [ { image = "kepler.jpg", full_name = "", short_name = "Kepler", url = "", description = [] }
        , { image = "galileo.jpg", full_name = "", short_name = "Galileo", url = "", description = [] }
        , { image = "napier.jpg", full_name = "", short_name = "Napier", url = "", description = [] }
        , { image = "stevin.jpg", full_name = "", short_name = "Stevin", url = "", description = [] }
        , { image = "viete.jpg", full_name = "", short_name = "Viète", url = "", description = [] }
        , { image = "nunes.jpg", full_name = "", short_name = "Pedro Nunes", url = "", description = [] }
        , { image = "cardano.jpg", full_name = "", short_name = "Cardano", url = "", description = [] }
        , { image = "tartaglia.jpg", full_name = "", short_name = "Tartaglia", url = "", description = [] }
        , { image = "copernicus.jpg", full_name = "", short_name = "Copernicus", url = "", description = [] }
        , { image = "leonardo.jpg", full_name = "", short_name = "Da Vinci", url = "", description = [] }
        , { image = "pacioli.jpg", full_name = "", short_name = "Pacioli", url = "", description = [] }
        , { image = "regiomontanus.jpg", full_name = "", short_name = "Regiomontanus", url = "", description = [] }
        , { image = "madhava.jpg", full_name = "", short_name = "Madhava", url = "", description = [] }
        , { image = "oresme.jpg", full_name = "", short_name = "Oresme", url = "", description = [] }
        , { image = "shijie.jpg", full_name = "", short_name = "Zhu Shijie", url = "", description = [] }
        , { image = "yang.jpg", full_name = "", short_name = "Yang", url = "", description = [] }
        , { image = "jiushao.jpg", full_name = "", short_name = "Qin", url = "", description = [] }
        , { image = "tusi.jpg", full_name = "", short_name = "Al-Din Tusi", url = "", description = [] }
        , { image = "li.jpg", full_name = "", short_name = "Li Ye", url = "", description = [] }
        , { image = "fibonacci.jpg", full_name = "", short_name = "Fibonacci", url = "", description = [] }
        , { image = "bhaskara-2.jpg", full_name = "", short_name = "Bhaskara II", url = "", description = [] }
        , { image = "khayyam.jpg", full_name = "", short_name = "Khayyam", url = "", description = [] }
        , { image = "al-haytham.jpg", full_name = "", short_name = "Al-Haytham", url = "", description = [] }
        , { image = "thabit.jpg", full_name = "", short_name = "Thabit", url = "", description = [] }
        , { image = "al-khwarizmi.jpg", full_name = "", short_name = "Al-Khwarizmi", url = "", description = [] }
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
      , info_card = Nothing
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
            case List.head <| (Array.toList >> List.filter (.short_name >> (==) name)) card_definitions of
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

encode_card = .short_name >> JE.string

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

            OtherGameMsg (HoverCard card) -> { game | info_card = if game.info_card == Just card then Nothing else Just card } |> nocmd

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
                    ((List.indexedMap (vp game.show_chosen_cards) (playing_players game)) ++ [view_info_card game])

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

view_card : Card -> Html GameMsg
view_card card = 
    div
        [ HA.class "card"
        , HE.onClick (HoverCard card)
        ]

        [ Html.img
            [ HA.src <| "images/"++card.image
            ]
            []
        , Html.div 
            [ HA.class "name" ]
            [ Html.text card.short_name ]
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

view_info_card game = case game.info_card of
    Just card -> 
        div
            [ HA.class "info-card" ]

            [ Html.h1  [] [ Html.a [ HA.href card.url, HA.target "_blank" ] [Html.text <| card.full_name] ] 
            , Html.img
                [ HA.src <| "images/"++card.image
                ]
                []
            , Html.div
                [ HA.class "description" ]
                (List.map (\p -> Html.p [] [ Html.text p ]) card.description)
            ]

    Nothing ->
        div 
            [ HA.class "info-card hidden" ]
            []
