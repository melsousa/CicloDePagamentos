import React from "react";
import { Router, Route, Redirect, hashHistory, IndexRoute } from 'react-router'

import AuthOrApp from './authOrApp'
import DashBoard from "../dashboard/dashboard";
import BillingCycle from "../billingCycle/billingCycle";

const Routes = () => (

    <Router history={hashHistory}>
        <Route path='/' component={AuthOrApp}>
            <IndexRoute component={DashBoard}/>
            <Route path='billingCycles' component={BillingCycle} />
        </Route>
        <Redirect from='*' to='/' />
    </Router>

)

export default Routes