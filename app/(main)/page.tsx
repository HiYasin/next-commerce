import React from 'react';

const Home = () => {
    const user = false;
    return (
        <div>
            Home Page
            <div>
                <p>Welcome to the Home Page!</p>
            </div>
            {user ?
                <div>
                    <p>Logged in as: {user}</p>
                </div>
                :
                <div>
                    <p>You are not logged in.</p>
                </div>}
        </div>
    );
};

export default Home;