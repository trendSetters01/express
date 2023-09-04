import { clearInputs } from './utils.js';
import { verifyOwnershipWithDappflow, submitFormToFormspree, checkClaim } from './api.js';
import { closeModal, showMessage } from './ui.js';



// Load the mapping JSON file when the page loads
window.onload = function () {
    clearInputs();
};
document.getElementById('sendButton').addEventListener('click', submitFormToFormspree);
document.getElementById('clearInputs').addEventListener('click', clearInputs);
document.getElementById('checkClaim').addEventListener('click', checkClaim);
document.getElementById('userModal').addEventListener('click', closeModal);
