// Modal Actions..
export const Modal = {

    // () -> to close the view/update/delete modal
    closeModal: function(event) {

        // prevent the page reload.. (when update modal close button is clicked..)
        if(event) event.preventDefault();   

        // hide the modal..
        document.getElementById("modalOverlay").style.display = "none";
        document.querySelectorAll(".modal").forEach(modal => {
            modal.style.display = "none";
        });
    },

    // () -> to open the view/update/delete modal
    openModal: function(id) {

        // un-hide the modal..
        document.getElementById("modalOverlay").style.display = "block";

        // of specific id delete || update || view modal..
        document.getElementById(id).style.display = "block";
    }
    
};