export function showMessage(message, success = false) {
    document.getElementById('modalMessage').innerText = message;
    document.getElementById('userModal').style.display = 'block';


    if (success) {
        console.log('yay!')
    } 
}

export function closeModal() {
    document.getElementById('userModal').style.display = 'none';
}