import React from "react";

import { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";

function PlaidAuth({ publicToken }) {
  const [accounts, setAccounts] = useState();
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3003/exchange_public_token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ public_token: publicToken }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        

        console.log(data.access_token);

        const auth = await fetch("http://localhost:3003/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ access_token: data.access_token }),
        });
        const data2 = await auth.json();
        console.log(data2);
        setAccounts(data2.numbers.ach[0]);
        console.log("data2", data2);
        
        // set the access token here
      } catch (error) {
        console.error("An error occurred:", error);
      }
      
    };

    fetchData();
  }, ); // add publicToken to the dependencies array

  return (
    accounts && (
      <>
        <h2>Bank Account Details</h2>
        <p>Account Number: {accounts.account}</p>
        <p>Routing Number : {accounts.routing}</p>
      </>
    )
  );
}

function App() {
  const [linkToken, setLinkToken] = useState();
  const [publicToken, setPublicToken] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3003/create_link_token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setLinkToken(data.link_token);
        
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token, metadata) => {
      setPublicToken(public_token);
      console.log("success", public_token, metadata);
      // send public_token to server
    },
  });

  return publicToken ? (
    <PlaidAuth publicToken={publicToken} />
  ) : (
    <button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
}

export default App;
