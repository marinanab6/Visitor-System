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
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody id="requestsTableBody"></tbody>
            </table>
        </section>

        <!-- DETAILS SECTION -->
        <section id="detailsSection" class="section" style="display:none;">
            <button id="backToDashboard">← Back</button>
            <div id="detailsContent"></div>
        </section>

        <!-- SETTINGS SECTION -->
        <section id="settings" class="section">
            <h2>Settings</h2>
            <!-- tabs and forms here as before -->
        </section>

    </main>

</div>

<script src="JS/manager.js"></script>
</body>
</html>
