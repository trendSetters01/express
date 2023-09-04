# NFT Claim Application

## Overview

This is a web application that allows users to claim their NFTs by verifying their ownership on the Algorand blockchain and then providing them with a corresponding Cardano NFT.

## Features

- **User Verification**: Uses the Algorand blockchain to verify if a user owns a specific NFT.
- **Claim Cardano NFT**: Upon verification, provides the user with a corresponding NFT on the Cardano blockchain.
- **UI Feedback**: Dynamic user interface that provides feedback on the claim status and errors.
  
## Setup and Installation

1. Clone the repository.
2. Install the dependencies using `npm install`.
3. Set up your Firebase admin SDK configuration. For security, use environment variables. Refer to the `.env` file for the required variables.
4. Run the application using `npm start`.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JS, CSS
- **Blockchain**: Algorand (for verification)
- **Database**: Firebase Realtime Database (for storing mappings)

## Notes

- Ensure you have set up the Firebase Admin SDK correctly and securely.
- Always use environment variables or other secure methods for sensitive data.

## Contributions