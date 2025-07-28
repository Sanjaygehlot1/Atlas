import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ConfigProvider, App as AntApp } from 'antd'; 

const App = () => {
    return (
        <div>
            <ConfigProvider theme={{ token: { colorPrimary: '#1677ff', fontFamily: 'Inter, sans-serif', borderRadius: 8 } }}>
                <AntApp>
                    <AuthProvider>
                        <main>
                            <Outlet />
                        </main>
                    </AuthProvider>
                </AntApp>
            </ConfigProvider>
        </div>
    );
}

export default App;