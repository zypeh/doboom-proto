{-# LANGUAGE DataKinds         #-}
{-# LANGUAGE TypeOperators     #-}
{-# LANGUAGE DeriveGeneric     #-}
{-# LANGUAGE OverloadedStrings #-}

module Lib
    ( startApp
    , app
    ) where

import Data.Aeson
import Data.Aeson.TH
import Network.Wai
import Network.Wai.Handler.Warp
import Servant

import           GHC.Generics
import           Control.Monad.Reader
import           Data.Text (Text)
import qualified Data.Text as T
import           Network.HTTP.Client (Manager)
import           Network.HTTP.Client.TLS (tlsManagerSettings)
import           Data.Maybe
import           Data.Monoid
import           System.Environment
import qualified Paths_Slashie as PS
import           Data.Version (showVersion)

-- To print version number of this server
data Version = Version {
  version :: Text
} deriving (Show, Generic)

instance ToJSON Version

type API = "version" :> Get '[JSON] Version

api :: Proxy API
api = Proxy

server :: Server API
server = returnVersion
  where version' = Version $ T.pack $ showVersion PS.version
        returnVersion = return version'

app :: Application
app = serve api server

startApp :: IO ()
startApp = do
  putStrLn "Slashie API is starting on localhost:8001"
  run 8001 app
