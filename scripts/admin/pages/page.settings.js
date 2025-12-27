    // grab the modules..
    import {AdminStore} from "../store.js";
    import {settingsHTML} from "/php_easy/scripts/admin/templates/settings.html.js";
    import {SettingsApi} from "/php_easy/scripts/admin/apis/api.settings.js";
    import {Toast} from "/php_easy/scripts/common/toasts.js";
    import {AuthActions} from "/php_easy/scripts/auth.js";
    import {Modal} from "../modals/modals.js";

  
    // () -> render image html..
    function renderImageHTML(path = null) {

        // when path is given..
        if(path) {

            // get the image html..
            return `
                <img 
                    src="${path}" 
                    alt="Profile Image"
                    class="profile-image js-profile-image-preview"
                />
            `;
        }

        // otherwise generate fallback..
        return `
            <div class="profile-image-placeholder js-profile-image-placeholder">
                👤
            </div>
        `;
    }

    // () -> render user details..
    function renderUserDetails() {

        // get the current user..
        const user = AdminStore.userData;

        // get the path to image..
        const imagePath = `${window.origin}/${`php_easy`}/`;


        // set the image..
        document.querySelector(".profile-image-box") .innerHTML = 
        user.profile_image 
            ?
        `<img src="${imagePath + user.profile_image}" alt="Profile">`
            :
        `<span class="profile-emoji">👤</span>`;

        // set the basic details..
        // set first name + last name (or full name)
        document.querySelector(".profile-name").innerHTML = 
        `${user.first_name} ${user.last_name}`;

        // set the mail..
        document.querySelector(".profile-email").innerHTML = user.email;

        // set the bio
        document.querySelector(".profile-bio").innerHTML = user.bio ? user.bio : "No bio written";

        // attach events for settings module..
        attachSettingsEvents();
    }

    // () -> render the profile image or fallback..
    function renderProfileImageOrFallback(modal = null) {

        // initial profile image outer html..
        const profileImageHTML = modal ? modal.querySelector(".profile-image-preview") : document.querySelector(".profile-image-box");

        // check for image?
        const userImage = AdminStore.userData.profile_image ?? null;

        // get the path to image..
        const imagePath = `${window.origin}/${`php_easy`}/${userImage}`;

        // render the image..
        profileImageHTML.innerHTML = renderImageHTML(imagePath);
    }

    // () -> attach the user settings module events..
    function attachSettingsEvents() {

        // add click event to update user details icon..
        document.querySelector(".settings-edit-icon").onclick = handleOpenUpdateUserModal;

        // add click event to update profile..
        document.querySelector(".profile-left").onclick = handleOpenProfileUpdateModal;

        // add click event to update password btn..
        document.querySelector(".js-update-password-btn").onclick = handleOpenUpdatePasswordModal;

        // add click event to delete account btn..
        document.querySelector(".js-delete-account-btn").onclick = handleOpenDeleteAccountModal;
    }

    // () -> attach save changes events (update settings modal)
    function attachUpdateSaveChanges(modal) {

        // add click event..
        modal.querySelector(".js-save-profile-btn").onclick = function(event) {

            // handle profile update..
            handleUpdateProfile(modal, event);
        }
    } 

    // () -> attach update user profile events..
    function attachUpdateProfileImageEvents(modal) {

        // add change event when file is uploaded..
        modal.querySelector(".js-profile-image-input").onchange = function(event) {

            // preview the image..
            toggleImagePreview(modal, event);
        }

        // add click listener to update profile image btn..
        modal.querySelector(".js-save-profile-image-btn").onclick = function(event) {

            // handle profile image update..
            handleProfileImageUpdate(modal, event);
        }

        // add click listener to remove profile image btn..
        modal.querySelector(".js-remove-profile-image-btn").onclick = function(event) {

            // handle profile image update..
            handleProfileImageRemoval(modal, event);
        }
    }

    // () -> attach update password modal events..
    function attachUpdatePasswordModalEvents(modal) {

        // when update password button is clicked..
        modal.querySelector(".js-save-password-btn").onclick = function(event) {

            // handle password update..
            handlePasswordUpdate(modal, event);
        };
    }

    // () -> attach delete account modal events..
    function attachDeleteAccountModalEvents(modal) {

        // attach on input of delete confirmation box..
        modal.querySelector(".js-delete-confirm-input").oninput = function(event) {

            // toggle button..
            toggleDeleteConfirmBtn(modal, event);
        }

        // attach on click of final delete button..
        modal.querySelector(".js-confirm-delete-account-btn").onclick = handleProfileDelete;
    }

    // () -> manage topics..
    export async function initSettings() {

        // show the topics html (view)..
        document.querySelector(".main").innerHTML = settingsHTML;

        // get the user details..
        const userResponse = await SettingsApi.getUser(AdminStore.currentUserId ?? "");

        // check log..
        // console.log(userResponse);

        // set the state..
        AdminStore.userData = userResponse.data;

        // attach the settings events..
        attachSettingsEvents();

        // Section 1..
        // render the profile image..
        renderProfileImageOrFallback();

        // render the user details..
        renderUserDetails();

    }

    // () -> handle open update user modal..
    function handleOpenUpdateUserModal(event) {

        // check log..
        // console.log("open update modal");

        // get the modal..
        const modal = document.querySelector("#updateProfileModal");

        // get the data..
        const user = AdminStore.userData;

        // set the details..
        modal.querySelector(".js-update-user-id").value = user.id ?? "";
        modal.querySelector(".js-update-first-name").value = user.first_name ?? "";
        modal.querySelector(".js-update-last-name").value = user.last_name ?? "";
        modal.querySelector(".js-update-username").value = user.username ?? "";
        modal.querySelector(".js-update-gender").value = user.gender ?? "";
        modal.querySelector(".js-update-bio").value = user.bio ?? "";

        // add save changes event..
        attachUpdateSaveChanges(modal);
        
        // open the modal..
        Modal.openModal("updateProfileModal");
    }

    // () -> handle open profile update modal..
    function handleOpenProfileUpdateModal(event) {

        // modal to open
        const modal = document.querySelector("#updateProfileImageModal");
        
        // attach update profile modal events..
        attachUpdateProfileImageEvents(modal);

        // render image or fallback..
        renderProfileImageOrFallback(modal);

        // open the modal
        Modal.openModal("updateProfileImageModal");
    }

    // () -> handle open update password modal..
    function handleOpenUpdatePasswordModal(event) {

        // get the modal..
        const modal = document.querySelector("#updatePasswordModal");

        // attach update password events..
        attachUpdatePasswordModalEvents(modal);

        // open the modal..
        Modal.openModal("updatePasswordModal");
    }

    // () -> handle open delete account modal..
    function handleOpenDeleteAccountModal(event) {

        // get the modal..
        const modal = document.querySelector("#deleteAccountModal");

        // attach delete account events..
        attachDeleteAccountModalEvents(modal);

        // open the modal..
        Modal.openModal("deleteAccountModal");
    }

    // () -> handle update user profile..
    async function handleUpdateProfile(modal, event) {

        // update the text..
        event.target.innerText = "saving..";

        // disable the button..
        event.target.setAttribute("disabled", "");

        // restrict the reload..
        event.preventDefault();

        // initial data to update..
        const dataToUpdate = {};

        // get the user data to update..
        const idEl = modal.querySelector(".js-update-user-id");
        const firstNameEl = modal.querySelector(".js-update-first-name");
        const lastNameEl = modal.querySelector(".js-update-last-name");
        const usernameEl = modal.querySelector(".js-update-username");
        const genderEl = modal.querySelector(".js-update-gender");
        const bioEl = modal.querySelector(".js-update-bio");

        // get existing user data..
        const user = AdminStore.userData;

        // attach id for updates..
        dataToUpdate["id"] = idEl.value.trim();

        // check if any new updates..
        if(firstNameEl.value.trim() !== user.first_name) {

            // check log..
            // console.log("yes first name is updated");

            // add to updates..
            dataToUpdate["first_name"] = firstNameEl.value.trim();
        }

        if(lastNameEl.value.trim() !== user.last_name) {

            // check log..
            // console.log("yes last name is updated");

            // add to updates..
            dataToUpdate["last_name"] = lastNameEl.value.trim();
        }

        if(usernameEl.value.trim() !== user.username) {

            // check log..
            // console.log("yes username is updated");

            // add to updates..
            dataToUpdate["username"] = usernameEl.value.trim();
        }

        if(genderEl.value.trim() !== user.gender) {

            // check log..
            // console.log("yes gender is updated");

            // add to updates..
            dataToUpdate["gender"] = genderEl.value.trim();
        }

        if(bioEl.value.trim() !== (user.bio ?? "")) {

            // check log..
            // console.log("yes bio is updated");

            // add to updates..
            dataToUpdate["bio"] = bioEl.value.trim();
        }

        // check log..
        // console.log(dataToUpdate);

        // try to make an update..
        const updateResponse = await SettingsApi.updateProfile(dataToUpdate);

        // check log..
        console.log(updateResponse);

        // get the updated data..
        const userResponse = await SettingsApi.getUser(AdminStore.currentUserId ?? user.id);

        // update the state..
        AdminStore.userData = userResponse.data;

        // render the data..
        renderUserDetails();

        // show the toast..
        Toast.show({
            "title": updateResponse.status ? "Success" : "Error",
            "message": updateResponse.message,
            "type": updateResponse.status ? "success" : "error",
            "duration": 2800
        });

        // after 1.8 seconds..
        setTimeout(function() {

            // update the text..
            event.target.innerText = "Save Profile Changes";

            // make it enabled again..
            event.target.removeAttribute("disabled");

            // close the modal..
            Modal.closeModal(event);
        }, 1800);
    }

    // () -> handle update user profile image..
    async function handleProfileImageUpdate(modal, event) {

        // update the text..
        event.target.innerText = "saving..";

        // disable the button..
        event.target.setAttribute("disabled", "");

        // restrict the reload behavior..
        event.preventDefault();

        // check log..
        // console.log("update profile image is initiated");

        // get the image..
        const image = modal.querySelector(".js-profile-image-input").files[0] ?? null;

        // when image is available for update..
        if(image) {

            // check log..
            // console.log(image);

            // handle the update..
            const profileImageResponse = await SettingsApi.updateProfileImage(
                image,
                AdminStore.currentUserId ?? ""
            );


            // again render the user details..
            const userResponse = await SettingsApi.getUser(AdminStore.currentUserId ?? "");

            // update the state..
            AdminStore.userData = userResponse.data;

            // render the new image..
            // for update image form
            renderProfileImageOrFallback(modal);

            // and for settings page..
            renderProfileImageOrFallback();

            // show the toast..
            Toast.show({
                "title": profileImageResponse.status ? "Success" : "Error",
                "message": profileImageResponse.message,
                "type": profileImageResponse.status ? "success" : "error",
                "duration": 2800
            });

            // after 1.8 seconds..
            setTimeout(function() {

                // update the text..
                event.target.innerText = "Update Image";

                // make it enabled again..
                event.target.removeAttribute("disabled");

                // close the modal..
                Modal.closeModal(event);
            }, 1800);
        }

        // when no image is provided..
        else { 

            // show the toast..
            Toast.show({
                "title":  "Error",
                "message": "Select new profile image",
                "type": "error",
                "duration": 1500
            });

            // after 1.8 seconds..
            setTimeout(function() {

                // update the text..
                event.target.innerText = "Update Image";

                // enable the button once again..
                event.target.removeAttribute("disabled");
            }, 1800);
        }
    }

    // () -> toggle image preview..
    function toggleImagePreview(modal, event) {

        // image preview container..
        const imagePreviewContainer = modal.querySelector(".profile-image-preview");

        // check if image is uploaded..
        const uploadedImage = modal.querySelector(".js-profile-image-input").files[0] ?? null;

        // check log..
        // console.log(isUploaded);

        // get the url of uploaded image..
        const imageUrl = URL.createObjectURL(uploadedImage);
        
        // render the image preview..
        imagePreviewContainer.innerHTML = renderImageHTML(imageUrl);
    }

     // () -> handle profile image removal..
    function handleProfileImageRemoval(modal, event) {

        // image preview container..
        const imagePreviewContainer = modal.querySelector(".profile-image-preview");

        // check if image is uploaded..
        const uploadedImage = 

        // when existing image
        AdminStore.userData.profile_image ??

        // or user uploaded image
        modal.querySelector(".js-profile-image-input").files[0] ?? null;

        // check log..
        // console.log(isUploaded);

        // when image is uploaded..
        if(uploadedImage) {
            // remove image
            modal.querySelector(".js-profile-image-input").value = "";

            // set the html..
            imagePreviewContainer.innerHTML = renderImageHTML();
        }
    }

    // () -> handle the password update..
    async function handlePasswordUpdate(modal, event) {

        // update the text..
        event.target.innerText = "Updating..";

        // disable the button..
        event.target.setAttribute("disabled", "");

        // restrict the default behavior..
        event.preventDefault();

        // get the update details elements
        const oldPasswordEl = modal.querySelector(".js-current-password");
        const newPasswordEl = modal.querySelector(".js-new-password");
        const confirmNewPasswordEl = modal.querySelector(".js-confirm-password");

        // get the data..
        const oldPassword = oldPasswordEl.value.trim();
        const newPassword = newPasswordEl.value.trim();
        const confirmNewPassword = confirmNewPasswordEl.value.trim();

        // check log..
        // console.log(oldPassword, newPassword, confirmNewPassword);

        // validate the inputs..
        const checkInputs = validatePassword(oldPassword, newPassword, confirmNewPassword);
        
        // when validation fails..
        if(!checkInputs["status"]) {

            // disable the button
            event.target.setAttribute("disabled", "");

            // show the toast..
            Toast.show({
                "title": checkInputs.status ? "Success" : "Error",
                "message": checkInputs.message,
                "type": checkInputs.status ? "success" : "error",
                "duration": 2800
            });

            // after 1.8 seconds..
            setTimeout(function() {

                // again enable button..
                event.target.removeAttribute("disabled");

                // update the text..
                event.target.innerText = "Update Password";
            }, 1800);
            return;
        }

        // handle the password update..
        const updateResponse = await SettingsApi.updatePassword(
            oldPassword,
            newPassword,
            confirmNewPassword,
            AdminStore.currentUserId ?? ""
        );

        // check log..
        // console.log(updateResponse);

        // render the user data..
        const userResponse = await SettingsApi.getUser(AdminStore.currentUserId ?? "");

        // update the user..
        AdminStore.userData = userResponse.data;

        // show the toast..
        Toast.show({
            "title": updateResponse.status ? "Success" : "Error",
            "message": updateResponse.message,
            "type": updateResponse.status ? "success" : "error",
            "duration": 2800
        });

        // after 1.8 seconds..
        setTimeout(function() {

            // update the text..
            event.target.innerText = "Update Password";

            // enable the button..
            event.target.removeAttribute("disabled");

            // clear the passwords..
            oldPasswordEl.value = "";
            newPasswordEl.value = "";
            confirmNewPasswordEl.value = "";

            // close the modal
            Modal.closeModal(event);
        }, 1800);

    }

    // () -> validate passwords..
    function validatePassword(oldPassword, newPassword, confirmPassword) {
        // when passwords are empty..
        if(oldPassword.trim() === "" || newPassword.trim() === "" || confirmPassword.trim() === "") {
            return {
                "status": false,
                "message": "passwords are empty"
            };
        }

        // when old password is same as the new one
        else if(oldPassword === newPassword || oldPassword === confirmPassword) {
            return  {
                "status": false,
                "message": "new password cannot be same as old password"
            };
        }

        // when lengths don't fit..
        else if(newPassword.length < 8 || confirmPassword.length < 8) {
            return {
                "status": false,
                "message": "new password must be of atleast 8 characters"
            }
        }

        // when confirm password and new pasword don't match..
        else if(confirmPassword !== newPassword) {
            return {
                "status": false,
                "message": "passwords entered didn't match"
            }
        }

        // when stages are passed..
        return {"status": true};
    }

    // () -> toggle delete confirmation button..
    function toggleDeleteConfirmBtn(modal, event) {

        // when input is empty..
        if(event.target.value.trim() === "") {

            // disable the button..
            modal.querySelector(".js-confirm-delete-account-btn").setAttribute("disabled", "");
        }

        // when input doesn't match `to be deleted text`
        else if(event.target.value.trim() !== "DELETE") {

            // disable the button..
            modal.querySelector(".js-confirm-delete-account-btn").setAttribute("disabled", "");
        }

        // otherwise,
        else {

             // enable it..
             modal.querySelector(".js-confirm-delete-account-btn").removeAttribute("disabled");
        }
    }

    // () -> handle account delete..
    async function handleProfileDelete(event) {

        console.log(event);

        // update the text..
        event.target.innerText = "deleting..";

        // disable the button
        event.target.setAttribute("disabled", "");

        // make the account delete..
        const deleteResponse = await SettingsApi.deleteAccount(AdminStore.currentUserId ?? "");

        // show the toast..
        Toast.show({
            "title": deleteResponse.status ? "Success" : "Error",
            "message": deleteResponse.message,
            "type": "warning",
            "duration": 2800
        });

        // after 1.8 seconds..
        setTimeout(function() {

            // update the text..
            event.target.innerText = "Confirm";

            // enable the button..
            event.target.removeAttribute("disabled");

            // again show the toast..
            Toast.show({
                "title": "Important",
                "message": "You will be logged-out shortly..",
                "duration": 2800
            });

            // logout the user
            AuthActions.logoutTheUser();

            // close the modal
            Modal.closeModal(event);
        }, 1800);
    }