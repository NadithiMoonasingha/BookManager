import "../App.css";

function SplashScreen() {
    return (
        <div className="splash-screen">

            <div className="splash-content">

                {/* Application Name */}
                <h1>
                    <span>Book</span> Manager
                </h1>

                <p>
                    Library Management System
                </p>

                {/* Loading Animation */}
                <div className="splash-loader">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

            </div>

            <div className="splash-footer">
                Smart Library Management
            </div>

        </div>
    );
}

export default SplashScreen;