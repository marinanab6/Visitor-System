<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hostel Manager Dashboard</title>
    <link rel="stylesheet" href="CSS/manager.css">
</head>
<body>

<div class="container">

    <!-- SIDEBAR -->
    <aside class="sidebar">
        <div class="profile">
            <div class="avatar">
                <img src="Image/user.jpg" alt="Manager Profile">
            </div>
            <p class="email">manager@gmail.com</p>
        </div>

        <div class="menu">
            <button class="menu-btn active" data-section="dashboard">📊 Dashboard</button>
            <button class="menu-btn" data-section="notifications">🔔 Notifications</button>
            <button class="menu-btn" data-section="requests">📥 Requests</button>
            <button class="menu-btn" data-section="settings">⚙️ Settings</button>
        </div>

        <button class="logout">Logout</button>
    </aside>

    <!-- MAIN -->
    <main class="main">
        <h1 class="title">Hostel Manager Dashboard</h1>

        <!-- DASHBOARD SECTION -->
        <section id="dashboard" class="section">
            <div class="cards">
                <div class="card">
                    <div class="icon">✅</div>
                    <p>Approved Requests</p>
                    <h3 id="approvedCount">0</h3>
                    <button class="details-btn" data-target="requests">View Details</button>
                </div>
                <div class="card">
                    <div class="icon">❌</div>
                    <p>Rejected Requests</p>
                    <h3 id="rejectedCount">0</h3>
                    <button class="details-btn" data-target="requests">View Details</button>
                </div>
                <div class="card">
                    <div class="icon">🕓</div>
                    <p>Pending Requests</p>
                    <h3 id="pendingCount">0</h3>
                    <button class="details-btn" data-target="requests">View Details</button>
                </div>
            </div>
        </section>

        <!-- NOTIFICATIONS SECTION -->
        <section id="notifications" class="section">
            <h2>Notifications</h2>
            <div id="notificationsContainer"></div>
        </section>

        <!-- REQUESTS SECTION -->
        <section id="requests" class="section">
            <h2>All Requests</h2>
            <div class="requests-filter">
                <button class="req-filter" data-type="approved">✅ Approved</button>
                <button class="req-filter" data-type="rejected">❌ Rejected</button>
                <button class="req-filter" data-type="pending">🕓 Pending</button>
            </div>
        

            <table class="requests-table">
                <thead>
                    <tr>
                        <th>Count</th>
                        <th>Student</th>
                        <th>Visitor</th>
                        <th>Phone</th>
                        <th>Purpose</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th> 
                    </tr>
                </thead>
                <tbody id="requestsTableBody"></tbody>
            </table>
        </section>

       

        
        <!-- SETTINGS SECTION -->
        <section id="settingsSection" class="section" style="display:none;">
            <h2>Settings</h2>

            <!-- TABS -->
            <div class="settings-tabs">
                <button class="settings-tab active" data-tab="profileTab">Update Profile</button>
                <button class="settings-tab" data-tab="passwordTab">Change Password</button>
                <button class="settings-tab" data-tab="pictureTab">Profile Picture</button>
                
            </div>

            <!-- PROFILE TAB -->
<div id="profileTab" class="settings-content">
    <h3>Update Profile</h3>

    <form class="settings-form" action="PHP/update_profile.php" method="POST">

        <label>Full Name</label>
        <input type="text" name="full_name" 
               
               placeholder="Enter full name" required>

        <label>Email Address</label>
        <input type="email" name="email" 
               placeholder="Enter email" required>

        <label>Phone Number</label>
        <input type="text" name="phone" 
        
               placeholder="Enter phone number" required>

        <button type="submit" class="save-btn">Save Changes</button>
    </form>
</div>


            <!-- PASSWORD TAB -->
            <div id="passwordTab" class="settings-content" style="display:none;">
                <h3>Change Password</h3>

                <form class="settings-form" id="passwordForm">
                    <label>Current Password</label>
                    <input type="password" id="currentPass" placeholder="Enter current password">

                    <label>New Password</label>
                    <input type="password" id="newPass" placeholder="Enter new password">

                    <label>Confirm New Password</label>
                    <input type="password" id="confirmPass" placeholder="Confirm new password">

                    <p id="passError" style="color:red; display:none;"></p>

                    <button type="button" id="updatePasswordBtn" class="save-btn">Update Password</button>
                </form>
            </div>

            <!-- PROFILE PICTURE TAB -->
            <div id="pictureTab" class="settings-content" style="display:none;">
                <h3>Update Profile Picture</h3>

                <div class="profile-picture-box">
                    <img src="user.jpg" alt="Profile Picture" class="preview-img" id="previewImage">
                    <input type="file" id="imageInput" accept="image/*">
                </div>

                <button type="button" class="save-btn">Upload Picture</button>
            </div>

           
        </section>
        <!-- DETAILS SECTION -->
<div id="detailsSection" class="details-section">
    <button id="backToDashboard" class="details-back">← Back</button>
    <h2 id="detailsTitle">Details</h2>
    <div id="detailsContent" class="details-content">
        
    </div>
</div>


            
    </main>

</div>

<script src="JS/manager.js"></script>
</body>
</html>
