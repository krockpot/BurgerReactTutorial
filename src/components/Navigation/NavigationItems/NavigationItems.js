import React from 'react';
import classes from './NavigationItems.module.css'
import NavigationItem from './NavigationItem/NavigationItem'

const NavigationItems = () => (
    <ul className={classes.NavigationItems}>
        <NavigationItem exact link="/" active={true}>
            Burger Builder
        </NavigationItem>
        <NavigationItem exact link="/orders">
            Orders
        </NavigationItem>
    </ul>
);

export default NavigationItems;