import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import VideoPage from "./components/VideoPage";

const App = () => (
  <div className="app">
    <a href="#main" className="skip-link">
      Skip to content
    </a>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route path="/video/:id" component={VideoPage} />
      <Redirect to="/" />
    </Switch>
  </div>
);

export default App;
