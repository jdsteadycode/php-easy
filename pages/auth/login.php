<?php
    require_once(dirname(__DIR__, 2) . "/config/config.php");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login – Phpeasy</title>

    <link 
        rel="stylesheet"
        href="../../styles/auth/auth.css?v=<?php echo time(); ?>"
    />
</head>
<body>

    <!-- login main container -->
    <div class="login-container">

        <!-- login box -->
        <div class="login-card">

            <h2 class="login-title">Login</h2>
            <p class="login-subtitle">Welcome back! Please sign in to continue.</p>

            <!-- login form -->
            <form id="loginForm">

                <div class="input-group">
                    <label>Email</label>
                    <input type="email" name="email" class="email js-email" placeholder="Enter your email">
                </div>

                <div class="input-group">
                    <label>Password</label>
                    <input type="password" name="password" class="password js-password" placeholder="Enter your password">
                </div>

                <button type="submit" class="login-btn js-login-btn">
                    Login
                </button>

                <!-- handle error toast -->
                <p class="error-msg js-error-msg" id="errorMsg"></p>

                <!-- handle success toast -->
                <p class="success-msg js-success-msg" id="successMsg"></p>
            </form>

        </div>

    </div>

    <!-- login js -->
    <script type="module" src="/php_easy/scripts/auth/login.js?v=<?php echo time(); ?>"></script>
</body>
</html>
