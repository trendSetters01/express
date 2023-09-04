import { showMessage } from './ui.js';
import { clearInputs } from './utils.js';

export function verifyOwnershipWithDappflow(algoAddress, callback) {
    const DAPPFLOW_API_URL = `/api/verifyOwnership/${algoAddress}`;

    fetch(DAPPFLOW_API_URL)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            callback(result.ownsNFT);
        })
        .catch(error => {
            console.error("Error verifying NFT ownership:", error);
            showMessage("Error verifying NFT ownership. Please try again.");
        });
}

export function submitFormToFormspree(event) {
    // event.preventDefault();

    // const algoAddress = document.getElementById('algoAddress').value.trim();
    // const cardanoAddress = document.getElementById('cardanoAddress').value.trim();

    // const formData = new FormData(document.getElementById('claimForm'));

    // fetch('https://formspree.io/f/mpzgrpll', {
    //     method: 'POST',
    //     body: formData,
    //     headers: {
    //         'Accept': 'application/json'
    //     }
    // })
    event.preventDefault();

    const algoAddress = document.getElementById('algoAddress').value.trim();
    const cardanoAddress = document.getElementById('cardanoAddress').value.trim();
    const email = document.getElementById('email').value.trim();

    const formData = {
        algoAddress: algoAddress,
        cardanoAddress: cardanoAddress,
        email: email
    };

    fetch('/api/submitForm', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.status === 200) {
            return fetch('/api/getMappings');
        } else {
            throw new Error('Form submission error');
        }
    })
    .then(response => response.json())
    .then(allMappings => {
        const unclaimedMappingKey = Object.keys(allMappings).find(key => !allMappings[key].claimed);

        if (unclaimedMappingKey) {
            return fetch('/api/claimNFT', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mappingKey: unclaimedMappingKey,
                    algoAddress: algoAddress,
                    cardanoAddress: cardanoAddress
                })
            });
        } else {
            throw new Error('No available NFTs to claim');
        }
    })
    .then(() => {
        clearInputs();
        showMessage('Form successfully submitted!', true);
    })
    .catch(error => {
        showMessage(error.message);
    });
}

export function checkClaim() {
    const algoAddress = document.getElementById('algoAddress').value.trim();
    // First, fetch all mappings from our server
    fetch('/api/getMappings')
        .then(response => response.json())  // Convert the response to JSON
        .then(allMappings => {
            // Next, verify ownership on Algorand blockchain
            verifyOwnershipWithDappflow(algoAddress, function (ownsNFT) {
                if (ownsNFT) {
                    // Find the mapping that hasn't been claimed 
                    console.log(allMappings)
                    const unclaimedMappingKey = Object.keys(allMappings).find(key => !allMappings[key].claimed);

                    if (unclaimedMappingKey) {
                        document.getElementById('claimInfo').style.display = 'block';
                        document.getElementById('cardanoNFT').innerText = allMappings[unclaimedMappingKey].cardanoNFT;
                        document.getElementById('hiddenAlgoAddress').value = algoAddress;
                    } else {
                        showMessage('No available NFTs to claim.');
                    }
                } else {
                    showMessage('You do not own the required Algorand NFT.');
                }
            });
        });
}
