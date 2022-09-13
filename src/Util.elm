module Util exposing (pluralise)

pluralise : Int -> String -> String -> String
pluralise n singular plural = if n==1 then singular else plural
