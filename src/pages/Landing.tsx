import FeatureCard from "../components/FeatureCard";
import TopNavBar from "../components/TopNavBar";
import usersIcon from "../assets/users-svgrepo-com.svg";
import sessionsIcon from "../assets/analytics-chart-graphs-svgrepo-com.svg";
import settingsIcon from "../assets/settings-svgrepo-com.svg";
import eventsIcon from "../assets/calendar-event-activity-solid-svgrepo-com.svg";
import './Landing.styles.css';

const Landing = () => {
    return <div className="min-vh-100 d-flex flex-column position-relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="position-absolute w-100 h-100 overflow-hidden" style={{ zIndex: -1 }}>
            <div className="position-absolute bg-gradient-circle-1"></div>
            <div className="position-absolute bg-gradient-circle-2"></div>
            <div className="position-absolute bg-gradient-circle-3"></div>
        </div>

        <TopNavBar />

        {/* Hero Section */}
        <header className="hero-section py-5 py-lg-6 position-relative">
            <div className="container">
                <div className="row align-items-center min-vh-50">
                    <div className="col-12 col-lg-10 col-xl-8">
                        <div className="hero-content">
                            <div className="hero-badge mb-4">
                                <span className="badge bg-white text-dark px-3 py-2 rounded-pill shadow-sm fw-medium">
                                    ✨ Modern Admin Dashboard
                                </span>
                            </div>

                            <h1 className="hero-title display-3 fw-bold mb-4 text-dark">
                                Simple.{' '}
                                <span className="text-gradient">Modern.</span>{' '}
                                <span className="text-outline">Responsive.</span>
                            </h1>

                            <p className="hero-subtitle fs-5 text-muted mb-5 lh-lg col-lg-10">
                                Experience the next generation of admin management with our sleek,
                                intuitive dashboard designed for modern businesses.
                            </p>

                            <div className="hero-buttons d-flex flex-column flex-sm-row gap-3">
                                <a href="#login" className="btn btn-hero-primary px-5 py-3 fw-semibold text-white">
                                    Get Started
                                </a>
                                <a href="#features" className="btn btn-hero-secondary px-5 py-3 fw-semibold">
                                    <i className="bi bi-play-circle me-2"></i>
                                    Explore Features
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating elements */}
            <div className="floating-elements">
                <div className="floating-element floating-1"></div>
                <div className="floating-element floating-2"></div>
                <div className="floating-element floating-3"></div>
            </div>
        </header>

        {/* Features Section */}
        <main className="features-section flex-grow-1 py-5 py-lg-6" id="features">
            <div className="container">
                <div className="row justify-content-center mb-5">
                    <div className="col-12 col-lg-8 text-center">
                        <h2 className="section-title display-5 fw-bold mb-3 text-dark">
                            Powerful Features
                        </h2>
                        <p className="section-subtitle fs-5 text-muted mb-4">
                            Everything you need to manage your application effectively
                        </p>
                        <div className="title-underline mx-auto"></div>
                    </div>
                </div>

                <div className="features-container">
                    <div className="features-background rounded-4 p-4 p-lg-5 shadow-lg position-relative">
                        <div className="features-grid row g-4" role="list">
                            <FeatureCard
                                title="Manage Users"
                                iconSrc={usersIcon}
                                text="Create, edit, and deactivate users with advanced permissions."
                            />
                            <FeatureCard
                                title="Sessions"
                                iconSrc={sessionsIcon}
                                text="Monitor active sessions and detailed analytics in real-time."
                            />
                            <FeatureCard
                                title="Settings"
                                iconSrc={settingsIcon}
                                text="Control app preferences, security policies, and configurations."
                            />
                            <FeatureCard
                                title="Events"
                                iconSrc={eventsIcon}
                                text="Review system events, audit logs, and activity history."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>

        {/* Footer */}
        <footer className="footer-section py-4 position-relative">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <p className="mb-0 text-muted">
                            © {new Date().getFullYear()} Forest Gate.
                        </p>
                    </div>
                    <div className="col-md-6 text-md-end mt-2 mt-md-0">
                        <div className="footer-links">
                            <a href="#" className="text-muted text-decoration-none me-3 hover-lift">Privacy</a>
                            <a href="#" className="text-muted text-decoration-none me-3 hover-lift">Terms</a>
                            <a href="#" className="text-muted text-decoration-none hover-lift">Contact</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </div>
}

export default Landing;