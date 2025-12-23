// () -> Toasts
export const Toast = (function() {

    // get the toast html element..
    const container = document.getElementById("toast-container");

    // () -> show the toast
    function show({
        title = "Notification", // default title: notification
        message = "",
        type = "info", // default type: info
        duration = 3000 // default duration: 3000 (3 secs)
    }) {

        // when element not found..
        if (!container) return;

        // make a div element..
        const toast = document.createElement("div");

        // set the classname
        toast.className = `toast toast-${type}`;

        // add html
        toast.innerHTML = `
            <div class="toast-icon">
                ${getIcon(type)}
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <div class="toast-close">×</div>
        `;

        // add the div element to the toast container..
        container.appendChild(toast);

        // Close manually
        toast.querySelector(".toast-close").onclick = () => removeToast(toast);

        // () -> remove the toast after given duration automatically..
        setTimeout(() => removeToast(toast), duration);
    }

    // () -> remove the toast..
    function removeToast(toast) {

        // add animation
        toast.style.animation = "toast-fade-out 0.3s ease forwards";

        // after 300 milliseconds remove the toast..
        setTimeout(() => toast.remove(), 300);
    }

    // () -> handle the icon for toast
    function getIcon(type) {
        switch (type) {
            case "success": return "✅";
            case "error": return "❌";
            case "warning": return "⚠️";
            default: return "ℹ️";
        }
    }

    // return the show func..
    return { show };

})();
