import { clearInputs } from './utils.js';
import { verifyOwnershipWithDappflow, submitFormToFormspree, checkClaim } from './api.js';
import { closeModal, showMessage } from './ui.js';

window.onload = function () {
    clearInputs();
};
document.getElementById('sendButton').addEventListener('click', submitFormToFormspree);
document.getElementById('clearInputs').addEventListener('click', clearInputs);
document.getElementById('checkClaim').addEventListener('click', checkClaim);
document.getElementById('userModal').addEventListener('click', closeModal);
