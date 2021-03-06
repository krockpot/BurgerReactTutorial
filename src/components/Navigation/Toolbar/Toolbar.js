import React from 'react';

import classes from './Toolbar.module.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import ToggleDrawer from '../SideDrawer/ToggleDrawer/ToggleDrawer';

const Toolbar = props => (
    <header className={classes.Toolbar}>
        <ToggleDrawer clicked={props.openSideDrawer}/>
        <div className={classes.Logo}>
            <Logo height="80%" />
        </div>
        <nav className={classes.DesktopOnly}>
            <NavigationItems />
        </nav>
    </header>
);

export default Toolbar;