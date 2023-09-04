require('dotenv').config();
const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};


const fetch = require('node-fetch');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://nft-claim-e56c2-default-rtdb.firebaseio.com'
});

const app = express();
const PORT = 3000;
const db = admin.database();

app.use(express.json()); // To support JSON-encoded bodies
app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/api/getMappings', (req, res) => {
    const ref = db.ref('mappings');
    ref.once('value', (snapshot) => {
        res.json(snapshot.val());
    }, (error) => {
        console.error("Error fetching mappings:", error);
        res.status(500).send('Error fetching mappings.');
    });
});

app.post('/api/submitForm', (req, res) => {
    const formData = req.body;

    fetch(process.env.FORMSPREE_URL, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        res.json(data);
    })
    .catch(error => {
        console.error("Error submitting form:", error);
        res.status(500).send('Error submitting form.');
    });
});

app.post('/api/claimNFT', (req, res) => {
    const { mappingKey, algoAddress, cardanoAddress } = req.body;
    const updateData = {
        algorandAddress: algoAddress,
        cardanoAddress: cardanoAddress,
        claimed: true
    };
    const ref = db.ref('mappings/' + mappingKey);
    ref.update(updateData, (error) => {
        if (error) {
            console.error("Error updating claim:", error);
            res.status(500).send('Error updating claim.');
        } else {
            res.json({ success: true });
        }
    });
});

app.get('/api/verifyOwnership/:algoAddress', (req, res) => {
    const { algoAddress } = req.params;
    const DAPPFLOW_API_URL = `https://mainnet-idx.algonode.cloud/v2/accounts/${algoAddress}/assets`;
    fetch(DAPPFLOW_API_URL)
        .then(response => response.json())
        .then(data => {
            const assets = data.assets || [];
            const ownsNFT = assets.some(asset => asset['asset-id'] === 31566704);
            res.json({ ownsNFT });
        })
        .catch(error => {
            console.error("Error verifying ownership:", error);
            res.status(500).send('Error verifying ownership.');
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
