import React from "react";
//import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
//import { classicNameResolver } from "typescript";
import styles from "./Header.module.scss";

//        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

const Header: React.FC = () => {
  return (
    <div className={styles.root}>
      <AppBar position="static" className={styles.app_bar}>
        <Toolbar className={styles.tool_bar}>
          <Typography variant="h6" className={styles.title}>
            Redux Toolkit Todo
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
