document.addEventListener('DOMContentLoaded', function () {
    const messagesContainer = document.getElementById('messages');
    const form = document.getElementById('form');
    const input = document.getElementById('input');

    const eventSource = new window.EventSource('/sse');

    eventSource.onmessage = function (event) {
        const newMessage = document.createElement('p');
        newMessage.textContent = event.data;
        messagesContainer.appendChild(newMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll to the latest message
    };

    form.addEventListener('submit', function (evt) {
        evt.preventDefault();

        const message = input.value.trim();
        if (message !== '') {
            window.fetch(`/chat?message=${encodeURIComponent(message)}`)
                .catch(error => console.error('Error sending message:', error));

            input.value = '';
        }
    });
});
