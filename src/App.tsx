import React from "react";
import { useObserver } from "mobx-react-lite";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { Layout, Icon } from "antd";
import { NavMenu } from "./components/NavMenu";
import "./App.css";
import { useStore } from "./stores";
import { api } from "./services/index";
import { Basic } from "./pages/basic/Basic";
import { User } from "./pages/screen/User/User";
import { System } from "./pages/screen/System/System";

const App = () => {
  const { menu } = useStore();
  const [{ data, loading, error }] = api.company.getCompanyBusinessInfoById({ companyId: 1 });
  console.log(data, loading, error);

  const renderRoute = (data: any[]) => {
    return data.map(item => {
      if (item.children.length > 0) {
        return (
          <Route path={item.path} key={item.path} component={item.component}>
            {renderRoute(item.children)}
          </Route>
        );
      }
      return <Route exact path={item.path} key={item.path} component={item.component} />;
    });
  };

  return useObserver(() => (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout.Sider collapsible collapsed={menu.collapsed} style={{borderTop: "1px solid #00B1FF"}}>
          <NavMenu></NavMenu>
        </Layout.Sider>
        <Layout>
        <Layout.Header style={{background: "#fff", padding: "0 20px"}}>
          <Icon
            style={{fontSize: 25}}
            className="trigger"
            type={menu.collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={menu.toggleCollapsed}
            />
        </Layout.Header>
          <Layout.Content>
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/base" component={Basic}></Route>
              <Route path="/user" component={User}></Route>
              <Route path="/system" component={System}></Route>
              {/* {renderRoute(menu.menus)} */}
            </Switch>
          </Layout.Content>
        </Layout>
      </Layout>
    </Router>
  ));
};

export default App;
