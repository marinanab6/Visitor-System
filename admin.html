<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="CSS/admin.css">
</head>

<body>

<div class="container">

    <!-- SIDEBAR -->
    <aside class="sidebar">
        <div class="profile">
            <div class="avatar">
                <img src="user.jpg" alt="Admin Profile">
            </div>
            <p class="email">admin@gmail.com</p>
        </div>

        <div class="menu">
            <button class="menu-btn active" data-section="dashboard">📊 Dashboard</button>
            <button class="menu-btn" data-section="requests">📥 Requests</button>
            <button class="menu-btn" data-section="notifications">🔔 Notifications</button>
            <button class="menu-btn" data-section="settings">⚙️ Settings</button>
        </div>

        <button class="logout">Logout</button>
    </aside>

    <!-- MAIN -->
    <main class="main">

        <h1 class="title">Admin Dashboard</h1>

        <!-- DASHBOARD -->
        <section id="dashboard" class="section">
            <div class="cards">

                <div class="card">
                    <div class="icon">📥</div>
                    <p>Total Requests</p>
                    <h3 id="totalRequests">0</h3>
                    <button class="details-btn" data-target="requests">View Details</button>
                </div>

                <div class="card">
                    <div class="icon">✅</div>
                    <p>Approved Requests</p>
                    <h3 id="approvedRequests">0</h3>
                    <button class="details-btn" data-target="requests">View Details</button>
                </div>

                <div class="card">
                    <div class="icon">🧾</div>
                    <p>Total Visitors Registered</p>
                    <h3 id="visitorCount">0</h3>
                    <button class="details-btn" data-target="notifications">View Details</button>
                </div>

            </div>
        </section>

        <!-- REQUESTS TABLE -->
        <section id="requests" class="section" style="display:none;">
            <h2>Visitor Requests</h2>

            <table class="requests-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Student Name</th>
                        <th>Visitor Name</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody id="requestsTableBody">
                    <!-- PHP WILL INSERT DATABASE ROWS HERE -->
                    <?php
                        include "db.php";
                        $query = $conn->query("SELECT * FROM requests ORDER BY id DESC");
                        while ($row = $query->fetch_assoc()):
                    ?>
                        <tr>
                            <td><?= $row['id'] ?></td>
                            <td><?= $row['student_name'] ?></td>
                            <td><?= $row['visitor_name'] ?></td>
                            <td><?= $row['status'] ?></td>
                            <td><?= $row['date'] ?></td>
                        </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </section>

        <!-- NOTIFICATIONS -->
        <section id="notifications" class="section" style="display:none;">
            <h2>Notifications</h2>

            <div id="notifContainer">
                <!-- PHP OR JS WILL LOAD NOTIFICATIONS HERE -->
            </div>
        </section>

        <!-- SETTINGS -->
        <section id="settings" class="section" style="display:none;">
            <h2>Settings</h2>

            <!-- TABS -->
            <div class="settings-tabs">
                <button class="settings-tab active" data-tab="profileTab">Update Profile</button>
                <button class="settings-tab" data-tab="passwordTab">Change Password</button>
                <button class="settings-tab" data-tab="pictureTab">Profile Picture</button>
                <button class="settings-tab" data-tab="manageUsersTab">Manage Users</button>
                <button class="settings-tab" data-tab="accountTab">Account Actions</button>
            </div>

            <!-- PROFILE TAB -->
            <div id="profileTab" class="settings-content">
                <h3>Update Profile</h3>
                <form class="settings-form">
                    <label>Full Name</label>
                    <input type="text">

                    <label>Email</label>
                    <input type="email">

                    <label>Phone</label>
                    <input type="text">

                    <button type="button" class="save-btn">Save Changes</button>
                </form>
            </div>

            <!-- CHANGE PASSWORD -->
            <div id="passwordTab" class="settings-content" style="display:none;">
                <h3>Change Password</h3>
                <form class="settings-form">
                    <label>Current Password</label>
                    <input type="password">

                    <label>New Password</label>
                    <input type="password">

                    <label>Confirm Password</label>
                    <input type="password">

                    <button class="save-btn">Update Password</button>
                </form>
            </div>

            <!-- PROFILE PICTURE -->
          <div id="pictureTab" class="settings-content" style="display:none;">
        <h3>Update Profile Picture</h3>

        <div class="profile-picture-box">
            <img src="user.jpg" alt="Profile Picture" class="preview-img">
            <input type="file" accept="image/*">
        </div>

        <button type="button" class="save-btn">Upload Picture</button>
    </div>


            <!-- MANAGE USERS TAB -->
            <div id="manageUsersTab" class="settings-content" style="display:none;">
                <h3>Manage Users</h3>

                <button class="user-btn">Manage Hostel Managers</button>
                <button class="user-btn">Manage Security Officers</button>
                <button class="user-btn">Manage Students</button>

                <!-- You can insert the 3 tables here later -->
            </div>

            <!-- ACCOUNT ACTIONS -->
            <div id="accountTab" class="settings-content" style="display:none;">
                <h3>Account Actions</h3>
                <button class="danger-btn">Disable Account</button>
                <button class="danger-btn">Delete Account</button>
            </div>

        </section>

    </main>
</div>

<script src="admin.js"></script>
</body>
</html>
