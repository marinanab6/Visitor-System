<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard</title>
    <link rel="stylesheet" href="CSS/student.css">
</head>
<body>

<?php
session_start();
?>


<div class="container">

    <!-- SIDEBAR -->
    <aside class="sidebar">

        <div class="profile">
            <div class="avatar">
                <img src="Image/user.jpg" alt="User Icon">
            </div>
            <p class="email">student@gmail.com</p>
        </div>

        <div class="menu">
            <button class="menu-btn" id="btnDashboard">📊 Dashboard</button>
            <button class="menu-btn" id="btnNotifications">🔔 Notifications</button>
            <button class="menu-btn" id="btnNewRequest">📝 New Request</button>
            <button class="menu-btn" id="btnSettings">⚙️ Settings</button>
        </div>

        <button class="logout">Logout</button>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main">

        <h2 class="title">Student Dashboard</h2>

        <button class="status-btn">Check Request Status</button>

        <!-- DASHBOARD SECTION FIXED -->
        <section id="dashboardSection" class="section">

            <div class="cards" id="dashboardCards">

                <div class="card">
                    <div class="icon">📄</div>
                    <h3> Requests Denied </h3>
                    <button class="details-btn">View details</button>
                </div>

                <div class="card">
                    <div class="icon">✅</div>
                    <h3>Request Accepted</h3>
                    <button class="details-btn">View details</button>
                </div>

                <div class="card">
                    <div class="icon">📊</div>
                    <h3>Total Reports</h3>
                    <button class="details-btn">View details</button>
                </div>

            </div>

        </section>
    <!-- NEW REQUEST FORM -->
        <div class="Request_container">

    <section class="request-section" id="requestForm" >
        <h2>New Visitor Request</h2>

        <form id="visitorForm" class="request-form" action="PHP/submit_request.php" method="POST" enctype="multipart/form-data">
            <input type="text" id="visitorName" name="visitorName" placeholder="Enter visitor name" required>
            <input type="tel" id="visitorPhone" name="visitorPhone" placeholder="Enter phone number" required>
            <input type="number" id="visitorID" name="visitorID" placeholder="Enter ID number" required>
            <input type="date" id="visitDate" name="visitDate" placeholder="Enter visit date" required>
            <input type="time" id="visitTime" name="visitTime" required>
            <input type="email" id="visitorEmail" name="visitorEmail" placeholder="Enter visitor email"  required >
            <textarea id="visitReason" name="visitReason" placeholder="State your purpose" required></textarea>

            <label for="visitorPhoto"><b>Upload Visitor Photo:</b></label>
            <input type="file" id="visitorPhoto" name="visitorPhoto" accept="image/*" required>

            <button type="submit" class="submit-btn">Submit Request</button>
        </form>
    </section>

        

</div>


        <!-- NOTIFICATIONS -->
        <section id="notificationsSection" class="section" style="display:none;">
    <h2>Notifications</h2>

    <div id="studentNotifications" class="notifications-box">
        <!-- Notifications will be loaded here by student.js -->
    </div>
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
                    <img src="user.jpg" alt="Profile Picture" class="profile-sidebar-img"id="previewImage">
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
    
    <!--Status popopu-->
     <div id="statusPopup" class="status-popup">
    <div class="status-box">
        <span id="closeStatus" class="close-btn">&times;</span>
        <h3>Request Status</h3>
        <p id="statusMessage">Checking...</p>
    </div>
</div>

</div>

<script src="JS/student.js"></script>
</body>
</html>
