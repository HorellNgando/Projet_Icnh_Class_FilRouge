import React from 'react';
import Sidebar from './Sidebar';

const Dashboard = ({ user, children }) => {
    return (
        <div className="flex flex-col">
                <p className="mb-6"><strong>Dernière connexion :</strong> {new Date(user.last_login).toLocaleString()}</p>
                <div className=" p-6 rounded-lg shadow-lg mb-8 bg-blue-500 text-white">
                    <h1 className="text-3xl font-bold mb-6">
                        Bienvenue, {user.name} {user.surname} !
                    </h1>
                    <h2 className="text-xl font-semibold mb-4">Nous espérons que vous allez bien aujourd'hui.</h2>
                    
                    
                </div>
            {children}
        </div>
    );
};

export default Dashboard;