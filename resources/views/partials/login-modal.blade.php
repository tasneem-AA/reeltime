<div class="login" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">
  <div class="login-background">
    <div class="login-content-panel surface-card">
      <div class="login-shell">
        <aside class="login-hero">
          <span class="eyebrow">Member access</span>
          <h2 id="authModalTitle">One account for watchlists, bookings, and trivia.</h2>
          <p>Sign in once and keep your movie night moving across every part of ReelTime.</p>

          <div class="login-benefits">
            <div class="login-benefit">
              <i class="fa-solid fa-check" aria-hidden="true"></i>
              <span>Save and revisit watchlists</span>
            </div>
            <div class="login-benefit">
              <i class="fa-solid fa-check" aria-hidden="true"></i>
              <span>Book seats without re-entering your details</span>
            </div>
            <div class="login-benefit">
              <i class="fa-solid fa-check" aria-hidden="true"></i>
              <span>Track ratings and game scores in one place</span>
            </div>
          </div>
        </aside>

        <section class="login-panel">
          <div class="login-toolbar">
            <div class="login-tabs" role="tablist" aria-label="Authentication tabs">
              <button class="button button-secondary auth-tab is-active" data-tab="login" type="button" aria-selected="true">Log In</button>
              <button class="button button-secondary auth-tab" data-tab="signup" type="button" aria-selected="false">Sign Up</button>
            </div>

            <button type="button" class="button button-secondary login-close" data-login-close aria-label="Close dialog">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="auth-panel" id="loginPanel">
            <div class="panel-copy">
              <h3>Welcome back</h3>
              <p>Enter your details to pick up where you left off.</p>
            </div>

            <form class="login-form" id="loginForm">
              <div>
                <label for="loginUsername">Username</label>
                <input id="loginUsername" placeholder="Enter your username" required>
              </div>

              <div>
                <label for="loginPassword">Password</label>
                <input type="password" id="loginPassword" name="password" placeholder="Enter your password" required>
              </div>

              <button type="submit" class="button button-primary login-submit" id="loginSubmitBtn">
                <span class="btn-text">Log In</span>
                <span class="btn-loader" style="display:none;"><i class="fas fa-spinner fa-spin me-1"></i>Logging in...</span>
              </button>
              <p id="loginError" class="login-error" aria-live="polite"></p>
              <p id="loginSuccess" class="login-success" aria-live="polite"></p>
            </form>
          </div>

          <div class="auth-panel" id="signupPanel" style="display: none;">
            <div class="panel-copy">
              <h3>Join ReelTime</h3>
              <p>Create your account and start building your list.</p>
            </div>

            <form class="login-form" id="signupForm">
              <div>
                <label for="signupUsername">Username</label>
                <input id="signupUsername" placeholder="Choose a username" required minlength="3" maxlength="30">
              </div>

              <div>
                <label for="signupEmail">Email</label>
                <input type="email" id="signupEmail" placeholder="Enter your email" required>
              </div>

              <div>
                <label for="signupPassword">Password</label>
                <input type="password" id="signupPassword" placeholder="Create a password (min 6 chars)" required minlength="6">
              </div>

              <div>
                <label for="signupPasswordConfirm">Confirm Password</label>
                <input type="password" id="signupPasswordConfirm" placeholder="Confirm your password" required minlength="6">
              </div>

              <button type="submit" class="button button-primary login-submit" id="signupSubmitBtn">
                <span class="btn-text">Create Account</span>
                <span class="btn-loader" style="display:none;"><i class="fas fa-spinner fa-spin me-1"></i>Creating...</span>
              </button>
              <p id="signupError" class="login-error" aria-live="polite"></p>
              <p id="signupSuccess" class="login-success" aria-live="polite"></p>
            </form>
          </div>
        </section>
      </div>
    </div>
  </div>
</div>
