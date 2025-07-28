import React from 'react';
import { Outlet } from 'react-router';


const App = () => {

    

    return (
        <div>
            <main>
                <Outlet/>
            </main>
        </div>
    )
}

export default App;
