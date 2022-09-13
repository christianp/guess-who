module Grid exposing (Grid, Coords, fromString, fromCoords, fill, get_row, set_cell, get_cell, coords, indexedMap, update_cell)

import Array exposing (Array)
import Set

type alias Coords = (Int,Int)

type alias Grid x = 
    { width: Int 
    , height: Int
    , cells: Array x
    }

fromCoords width height fn =
    let
        decide i =
            let
                x = modBy width i
                y = (i - x) // width
            in
                fn (x,y)
    in
        Grid width height ((Array.fromList << List.map decide) (List.range 0 (width*height-1)))

fromString str parse_cell =
    let
        rows = (String.split "\n" (String.trim str))
        height = List.length rows
        width = Maybe.withDefault 0 (Maybe.map String.length (List.head rows))
        cells = (String.join "" >> String.toList >> (List.map parse_cell) >> Array.fromList) rows
    in
        { width = width
        , height = height
        , cells = cells
        }

fill width height value = 
    { width = width
    , height = height
    , cells = Array.repeat (width*height) value
    }

get_row : Int -> Grid x -> Array x
get_row row grid = Array.slice (row*grid.width) ((row+1)*grid.width) grid.cells

set_cell : Coords -> x -> Grid x -> Grid x
set_cell (x,y) value grid =  
    let
        i = y*grid.width + x
    in
        { grid | cells = (Array.indexedMap (\j -> \c -> if j==i then value else c) grid.cells) }

update_cell : Coords -> (x -> x) -> Grid x -> Grid x
update_cell (x,y) fn grid =  
    let
        i = y*grid.width + x
    in
        { grid | cells = (Array.indexedMap (\j -> \c -> if j==i then fn c else c) grid.cells) }

get_cell : Coords -> Grid x -> Maybe x
get_cell (x,y) grid = 
    let
        i = y*grid.width + x
    in
        if x>=0 && x<grid.width && y>=0 && y<grid.height then
            Array.get i grid.cells
        else
            Nothing

coords grid = List.concatMap (\y -> List.map (\x -> (x,y)) (List.range 0 (grid.width-1))) (List.range 0 (grid.height-1))

indexedMap : (Int -> Int -> x -> a) -> (Int -> Array a -> b) -> Grid x -> Array b
indexedMap cell_fn row_fn grid =
    let
        do_row row = 
            row_fn row <|
            Array.indexedMap
                (\col -> \cell -> cell_fn col row cell)
                (Array.slice (row*grid.width) ((row+1)*grid.width) grid.cells)
    in
        Array.map do_row (Array.fromList <| List.range 0 (grid.height-1))
