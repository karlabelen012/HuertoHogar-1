import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/pages/Home";
import PerfilCliente from "../components/pages/PerfilCliente";
import PerfilAdmin from "../components/pages/ProfileAdmin";

const RouterConfig = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/contacto" component={Contacto} />
      <Route path="/nosotros" component={Nosotros} />
      <Route path="/carrito" component={Carrito} />
      <Route path="/perfil-admin" component={PerfilAdmin} />
      <Route path="/perfil-cliente" component={PerfilCliente} />
    </Switch>
  </Router>
);

export default RouterConfig;
