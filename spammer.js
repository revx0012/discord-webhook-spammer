document.addEventListener("DOMContentLoaded", function () {
    const webhookUrlInput = document.getElementById("webhookUrl");
    const messageInput = document.getElementById("message");
    const secondsPerMessageInput = document.getElementById("secondsPerMessage");
    const startButton = document.getElementById("startButton");
    const stopButton = document.getElementById("stopButton");
    const warningDiv = document.getElementById("warningDiv");
    const logContainer = document.getElementById("logContainer"); // New log container
    const form = document.getElementById("spammerForm");

    let intervalId;

    startButton.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent form submission
        const webhookUrl = webhookUrlInput.value;
        const message = messageInput.value;
        const secondsPerMessage = parseInt(secondsPerMessageInput.value);

        if (!webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
            warningDiv.innerHTML = '⚠️ Invalid webhook URL. Please enter a valid one.';
            startButton.classList.add("invalidUrl");
            stopButton.classList.remove("invalidUrl");
            return;
        }

        if (!message || !secondsPerMessage) {
            warningDiv.innerHTML = '';
        } else {
            warningDiv.innerHTML = '';
        }

        intervalId = setInterval(function () {
            if (!message) {
                sendMessage(webhookUrl);
            } else {
                sendMessageWithMessage(webhookUrl, message);
            }
        }, (secondsPerMessage < 3 ? secondsPerMessage * 500 : secondsPerMessage * 1000));

        startButton.disabled = true;
        stopButton.disabled = false;
        startButton.classList.add("running");
        stopButton.classList.remove("running");

        // Clear previous logs
        logContainer.innerHTML = '';
    });

    stopButton.addEventListener("click", function () {
        clearInterval(intervalId);
        startButton.disabled = false;
        stopButton.disabled = true;
        startButton.classList.remove("running");
        stopButton.classList.add("running");
        warningDiv.innerHTML = '';
    });

    function sendMessage(webhookUrl) {
        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: '' }),
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 429) {
                    logContainer.innerHTML += `<div class="logRateLimit">The API is being rate limited!</div>`;
                } else if (response.status === 204) {
                    logContainer.innerHTML += `<div class="logSuccess">Message sent successfully</div>`;
                } else if (response.status === 400) {
                    logContainer.innerHTML += `<div class="logError">Bad Request: ${response.statusText}</div>`;
                } else if (response.status === 404) {
                    logContainer.innerHTML += `<div class="logError">Not Found: ${response.statusText}</div>`;
                } else {
                    logContainer.innerHTML += `<div class="logError">Error sending message: ${response.statusText}</div>`;
                }
            } else {
                logContainer.innerHTML += `<div class="logSuccess">Message sent successfully</div>`;
            }
        })
        .catch(error => {
            logContainer.innerHTML += `<div class="logError">Error sending message: ${error.message}</div>`;
        });
    }

    function sendMessageWithMessage(webhookUrl, message) {
        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: message }),
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 429) {
                    logContainer.innerHTML += `<div class="logRateLimit">The API is being rate limited!</div>`;
                } else if (response.status === 204) {
                    logContainer.innerHTML += `<div class="logSuccess">Message sent successfully</div>`;
                } else if (response.status === 400) {
                    logContainer.innerHTML += `<div class="logError">Bad Request: ${response.statusText}</div>`;
                } else if (response.status === 404) {
                    logContainer.innerHTML += `<div class="logError">Not Found: ${response.statusText}</div>`;
                } else {
                    logContainer.innerHTML += `<div class="logError">Error sending message: ${response.statusText}</div>`;
                }
            } else {
                logContainer.innerHTML += `<div class="logSuccess">Message sent successfully</div>`;
            }
        })
        .catch(error => {
            logContainer.innerHTML += `<div class="logError">Error sending message: ${error.message}</div>`;
        });
    }
});
