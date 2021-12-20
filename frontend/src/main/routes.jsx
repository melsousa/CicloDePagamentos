import React from "react";
import { Router, Route, Redirect, hashHistory } from 'react-router'

import DashBoard from "../dashboard/dashboard";
import BillingCycle from "../billingCycle/billingCycle";

const Routes = () => (

    <Router history={hashHistory}>
        <Route path='/' component={DashBoard} />
        <Route path='/billingCycles' component={BillingCycle} />
        <Redirect from='*' to='/' />
    </Router>

)

export default Routes