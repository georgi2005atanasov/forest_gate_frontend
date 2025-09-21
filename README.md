# 🖥 Forest Gate Frontend — Admin Dashboard for Authentication, Device Control & Anomaly Detection

**Forest Gate Frontend** is the **admin dashboard** for the **Forest Gate Authentication Service**.  
It gives security teams a clear, real-time view of **users, sessions, devices, and risks**.  
With support for **Isolation Forest anomaly detection**, **LLM behavior summaries**, **GeoIP (MaxMind)**, and **SendGrid alerts**, this UI is designed to make **complex security events easy to understand**.

Backend API: [Forest Gate (Rust)](https://github.com/georgi2005atanasov/forest_gate)

> ⚠️ Status: **Work in progress / not finished yet** (features and UI are evolving).

---

## 🎯 Why Use Forest Gate Frontend

- **👀 Full visibility** — see user activity, devices, and behavior at a glance  
- **🛡 Risk insights** — Isolation Forest scores highlight unusual logins or actions  
- **🤖 Behavior summaries** — LLM-powered insights show what users did, in plain language  
- **🌍 Location awareness** — GeoIP lookups (country, city, ASN) help spot strange patterns  
- **⚡ Instant control** — revoke sessions, block devices, or change policies in one click  
- **📨 Real-time alerts** — receive SendGrid emails for config changes or high-risk events  

---

## ✨ Key Features

- **👤 User Management**  
  Search, filter, and monitor all registered users.

- **📱 Device Tracking**  
  View active devices and force logout when needed.

- **📊 Risk Dashboard**  
  See anomalies scored by Isolation Forest and review flagged actions.

- **🧠 Behavior Summaries (LLM)**  
  Quickly understand user activity through AI-generated summaries of their sessions.

- **🌍 Geo & Network Insights (MaxMind)**  
  Know the ASN, country, and city of login attempts.

- **📧 Security Alerts (SendGrid)**  
  Alerts for high-risk events and configuration changes.

- **📜 Audit View**  
  Timeline of key security events for compliance and review.

---

## 🔍 SEO Highlights

- **Authentication dashboard UI** for **Rust backend**  
- **Admin monitoring tool** for **user sessions and devices**  
- **Isolation Forest anomaly detection visualization**  
- **LLM-powered summaries** for **user behavior analysis**  
- **GeoIP ASN/country/city integration** via **MaxMind**  
- **Email alert monitoring** via **SendGrid**  
- **Security admin panel** for **access revoke** and **fraud prevention**  

---

## 🚀 Developer Experience

- Built with **React** for fast, modular UI  
- Connects directly to the **Rust API**  
- Responsive and modern design for admin workflows  
- Designed for **clarity**: risks, alerts, and actions are highlighted clearly  

---

## 🛠 Roadmap

- 📊 Interactive anomaly detection reports  
- 🔐 Role-based admin access (viewer / analyst / admin)  
- 📈 Historical risk charts  
- 📤 Export sessions and behavior summaries  

---

## ❓ FAQ

**Q: Is this frontend ready for production?**  
A: Not yet — it’s **under active development**. Features and layout will change.  

**Q: Do I need the backend to use this?**  
A: Yes, the **Rust Forest Gate API** provides all data, events, and security logic.  

**Q: What makes it different from other admin dashboards?**  
A: It focuses on **security**, combining **anomaly detection, LLM behavior summaries, and real-time alerts** into one UI.  
