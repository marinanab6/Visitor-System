
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

            <button class="status-btn">View All Requests</button>

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
        <section id="notifications" class="section" >
            <h2>Requests Overview</h2>
            <p class="empty-msg">No requests available.</p>
        </section>

        <!-- REQUESTS SECTION -->
<section id="requests" class="section" >
    <h2>All Requests</h2>

    <div class="requests-filter">
        <button class="req-filter" data-type="approved">✅ Approved</button>
        <button class="req-filter" data-type="rejected">❌ Rejected</button>
        <button class="req-filter" data-type="pending">🕓 Pending</button>
    </div>

    <table class="requests-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Visitor</th>
                <th>Status</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody id="requestsList">
         
        </tbody>
    </table>
</section>


        <!-- SETTINGS SECTION -->
<section id="settings" class="section" >
    <h2>Settings</h2>

    <!-- Settings Tabs -->
    <div class="settings-tabs">
        <button class="settings-tab active" data-tab="profileTab">Update Profile</button>
        <button class="settings-tab" data-tab="passwordTab">Change Password</button>
        <button class="settings-tab" data-tab="pictureTab">Profile Picture</button>

    </div>


    <!-- TAB CONTENT: Update Profile -->
    <div id="profileTab" class="settings-content">
        <h3>Update Profile</h3>

        <form class="settings-form">
            <label>Full Name</label>
            <input type="text" placeholder="Enter full name">

            <label>Email Address</label>
            <input type="email" placeholder="Enter email">

            <label>Phone Number</label>
            <input type="text" placeholder="Enter phone number">

            <button type="button" class="save-btn">Save Changes</button>
        </form>
    </div>


    <!-- TAB CONTENT: Change Password -->
    <div id="passwordTab" class="settings-content" >
        <h3>Change Password</h3>

        <form class="settings-form">
            <label>Current Password</label>
            <input type="password" placeholder="Enter current password">

            <label>New Password</label>
            <input type="password" placeholder="Enter new password">

            <label>Confirm New Password</label>
            <input type="password" placeholder="Confirm new password">

            <button type="button" class="save-btn">Update Password</button>
        </form>
    </div>


    <!-- TAB CONTENT: Profile Picture -->
    <div id="pictureTab" class="settings-content" >
        <h3>Update Profile Picture</h3>

        <div class="profile-picture-box">
            <img src="user.jpg" alt="Profile Picture" class="preview-img">
            <input type="file" accept="image/*">
        </div>

        <button type="button" class="save-btn">Upload Picture</button>
    </div>

</section>


    </main>

</div>

<script src="JS/manager.js"></script>
</body>
</html>
