const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
const cors = require("cors");
require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

app.get("/", (req, res) => {
  res.send("Surya Teja Yellutla - Plaid API Integration");
});

app.post("/create_link_token", async function (request, response) {
  console.log("request");

  const plaidRequest = {
    user: {
      client_user_id: "user",
    },
    client_name: "Plaid Test App",
    products: ["auth",],
    language: "en",

    redirect_uri: "http://localhost:3000/",
    country_codes: ["US"],
  };
  try {
    const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);
     console.log(createTokenResponse.data)
    response.json(createTokenResponse.data);
  } catch (error) {
    response.json({ error: error });
  }
});

app.post("/exchange_public_token", async function (request, response, next) {
    console.log("request2")
  const publicToken = request.body.public_token;
  try {
    const plaidResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = plaidResponse.data.access_token;

    response.json({ access_token: accessToken });
  } catch (error) {
    response.json({ error: error });
  }
});

app.post("/auth", async function (request, response) {
  try {
    const accessToken = request.body.access_token;
    const plaidRequest = {
      access_token: accessToken,
    };
    const plaidResponse = await plaidClient.authGet(plaidRequest);

    response.json(plaidResponse.data);
  } catch (error) {
    response.json({ error: error });
  }
});


app.post("/accounts/balance", async function (request, response) {
    try {
        console.log("request3")
        const accessToken = request.body.access_token;
        const plaidRequest = {
        access_token: accessToken,
        };
        const plaidResponse = await plaidClient.accountsBalanceGet(plaidRequest);
        console.log(plaidResponse.data)
        response.json(plaidResponse.data);
    } catch (error) {
        response.json({ error: error });
    }
    });




app.listen(3003, () => {
  console.log("Server is running on port 3003");
});
