'use strict';

import React from 'react'
import {Navbar, NavbarBrand} from 'react-bootstrap';
import {Link} from 'react-router-dom'

export default function Nav() {
    return <Navbar>
        <NavbarBrand>
            <Link to='/'>
                Sterling Ranch
            </Link>
        </NavbarBrand>
    </Navbar>
}