// export the template (structure) for settings module..
export const settingsHTML = `
    <!-- SETTINGS MAIN CONTENT -->
    <div class="main-content-container">

        <!-- HEADER -->
        <div class="main-content-header">
            <h1 class="main-content-heading">Settings</h1>
        </div>

        <!-- BODY -->
        <div class="main-content-body settings-container">

            <!-- SECTION 1 : PROFILE -->
            <div class="settings-section profile-section">

                <!-- edit icon -->
                <span class="settings-edit-icon" title="Edit Profile">✏️</span>

                <!-- left -->
                <div class="profile-left">
                    <div class="profile-image-box">
                        <!-- if image exists -->
                        <!-- <img src="profile.jpg" alt="Profile"> -->

                        <!-- fallback -->
                        <span class="profile-emoji">👤</span>
                    </div>
                </div>

                <!-- right -->
                <div class="profile-right">
                    <h2 class="profile-name">Admin Name</h2>
                    <p class="profile-email">admin@gmail.com</p>
                    <p class="profile-bio">
                        Passionate about web development and teaching PHP & JavaScript.
                    </p>
                </div>

            </div>

            <!-- SECTION 2 : PRIVACY & SECURITY -->
            <div class="settings-section security-section">

                <h2 class="settings-subheading">Privacy & Security</h2>

                <div class="security-actions">

                    <div class="security-card">
                        <h3>Update Password</h3>
                        <p>Change your current password regularly to stay secure.</p>
                        <button class="btn-primary js-update-password-btn">Update Password</button>
                    </div>

                    <div class="security-card danger">
                        <h3>Delete Account</h3>
                        <p>This action is irreversible. All your data will be removed.</p>
                        <button class="btn-danger js-delete-account-btn">Delete Account</button>
                    </div>

                </div>

            </div>

        </div>
    </div>

`;