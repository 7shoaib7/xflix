// import logo from './logo.svg';
import './App.css';
import React from "react";
import { Route, Switch} from "react-router-dom";
import VideoPageView from "./components/VideoPageView"
import LandingPage from "./components/LandingPage"


export const config = {
  // endpoint: `https://39c2cffb-2fc5-4508-92c4-61685012410c.mock.pstmn.io/v1`,
  endpoint:`http://3.109.147.182:8082/v1`
};


function App() {
  return (
    <div className="App">
    <React.StrictMode>
       <Switch>
            <Route exact path ="/" component={LandingPage} />
            <Route path="/video/:id" component={VideoPageView} /> 
      </Switch>
    </React.StrictMode>
    </div>
  );
}

export default App;
