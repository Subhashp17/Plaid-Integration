import React, { useEffect, useState } from 'react';

const Balance = ({ access_token }) => {
    const [balances, setBalances] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3003/accounts/balance", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ access_token: access_token }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data);
                setBalances(data.accounts[0].balances.available);
               
            } catch (error) {
                console.error('An error occurred:', error);
            }
        };

        fetchData();
    }, [access_token]);

    return (
        <div>
            <p>{`access_token : ${access_token}`}</p>
           <p> {balances ? `Balance: ${balances}` : 'Loading...'}</p>
        </div>
    );
}

export default Balance;