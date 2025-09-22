import { useSettingsHandlers } from './Settings.hooks';
import './Settings.styles.css';
import { useTranslation } from 'react-i18next';

const Settings = () => {
    // const token = Cookies.get("auth_token");

    // if (!token) {
    //     return <Navigate to="/login" replace />;
    // }
    const { t } = useTranslation();

    const {
        loading,
        data,
        configForm,
        errors,
        successMessage,
        updateConfig,
        handleInputChange,
        refreshAll,
        goBack,
        getAverageCPU,
    } = useSettingsHandlers();

    return (
        <main className="settings-main flex-grow-1 py-5">
            <div className="container">

                {/* Header */}
                <div className="settings-header d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <button onClick={goBack} className="back-button mb-3 btn d-flex align-items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="m12 19-7-7 7-7" />
                                <path d="M19 12H5" />
                            </svg>
                            Back
                        </button>
                        <h1 className="settings-title">{t("settings.title")}</h1>
                        <p className="settings-subtitle">{t("settings.subtitle")}</p>
                    </div>
                    <button onClick={refreshAll} className="refresh-button btn btn-secondary">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                            <path d="M3 21v-5h5" />
                        </svg>
                        {t("settings.refreshAll")}
                    </button>
                </div>

                <div className="row g-4">

                    {/* Version Section */}
                    <div className="col-12">
                        <div className="settings-card version-card">
                            <div className="card-header">
                                <div className="card-icon version-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M12 6v6l4 2" />
                                    </svg>
                                </div>
                                <h3 className="card-title">{t("settings.version.title")}</h3>
                            </div>
                            <div className="card-body">
                                {loading.version ? (
                                    <div className="loading-spinner">Loading...</div>
                                ) : errors.version ? (
                                    <div className="error-message">Error: {errors.version}</div>
                                ) : data.version ? (
                                    <div className="version-info">
                                        <div className="info-item">
                                            <span className="info-label">{t("settings.version.name")}:</span>
                                            <span className="info-value">{data.version.name}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">{t("settings.version.version")}:</span>
                                            <span className="info-value version-badge">{data.version.version}</span>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Health Section */}
                    <div className="col-12">
                        <div className="settings-card health-card">
                            <div className="card-header">
                                <div className="card-icon health-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                    </svg>
                                </div>
                                <h3 className="card-title">{t("settings.health.title")}</h3>
                                {data.health && (
                                    <span className={`status-badge ${data.health.status === 'healthy' ? 'healthy' : 'unhealthy'}`}>
                                        {data.health.status}
                                    </span>
                                )}
                            </div>
                            <div className="card-body">
                                {loading.health ? (
                                    <div className="loading-spinner">Loading...</div>
                                ) : errors.health ? (
                                    <div className="error-message">Error: {errors.health}</div>
                                ) : data.health ? (
                                    <div className="health-info">
                                        <div className="health-grid">
                                            <div className="health-metric">
                                                <div className="metric-header">
                                                    <span className="metric-label">{t("settings.health.system")}</span>
                                                </div>
                                                <div className="metric-value">{data.health.host.system_name}</div>
                                                <div className="metric-detail">{data.health.host.host_name}</div>
                                            </div>

                                            <div className="health-metric">
                                                <div className="metric-header">
                                                    <span className="metric-label">{t("settings.health.cpuUsage")}</span>
                                                </div>
                                                <div className="metric-value">{getAverageCPU(data.health.host.cpu_usage_per_core)}%</div>
                                                <div className="metric-detail">{data.health.host.cpu_usage_per_core ? data.health.host.cpu_usage_per_core.length : ''} cores</div>
                                            </div>

                                            <div className="health-metric">
                                                <div className="metric-header">
                                                    <span className="metric-label">{t("settings.health.lastCheck")}</span>
                                                </div>
                                                <div className="metric-value">
                                                    {data.health.timestamp ? new Date(data.health.timestamp).toLocaleTimeString() : ''}
                                                </div>
                                                <div className="metric-detail">
                                                    {data.health.timestamp ? new Date(data.health.timestamp).toLocaleDateString() : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* Configuration Section */}
                    <div className="col-12">
                        <div className="settings-card config-card">
                            <div className="card-header">
                                <div className="card-icon config-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="3" />
                                        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m11-7a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                                    </svg>
                                </div>
                                <h3 className="card-title">{t("settings.config.title")}</h3>
                            </div>
                            <div className="card-body">
                                {loading.config ? (
                                    <div className="loading-spinner">Loading...</div>
                                ) : errors.config && !data.config ? (
                                    <div className="error-message">Error: {errors.config}</div>
                                ) : (
                                    <form onSubmit={updateConfig} className="config-form">
                                        {successMessage && (
                                            <div className="success-message mb-4">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M9 12l2 2 4-4" />
                                                    <circle cx="12" cy="12" r="10" />
                                                </svg>
                                                {successMessage}
                                            </div>
                                        )}

                                        {errors.config && (
                                            <div className="error-message mb-4">
                                                Error: {errors.config}
                                            </div>
                                        )}

                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label htmlFor="ai_model" className="form-label">{t("settings.config.aiModel")}</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="ai_model"
                                                    name="ai_model"
                                                    value={configForm.ai_model}
                                                    onChange={handleInputChange}
                                                    placeholder={t("settings.config.aiModelPlaceholder")}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="token_validity_seconds" className="form-label">{t("settings.config.tokenValidity")}</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="token_validity_seconds"
                                                    name="token_validity_seconds"
                                                    value={configForm.token_validity_seconds}
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="refresh_token_validity_seconds" className="form-label">{t("settings.config.refreshTokenValidity")}</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="refresh_token_validity_seconds"
                                                    name="refresh_token_validity_seconds"
                                                    value={configForm.refresh_token_validity_seconds}
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="vector_similarity_threshold" className="form-label">{t("settings.config.vectorThreshold")}</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="vector_similarity_threshold"
                                                    name="vector_similarity_threshold"
                                                    value={configForm.vector_similarity_threshold}
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            <input
                                                type="hidden"
                                                className="form-control"
                                                id="id"
                                                name="id"
                                                value={configForm.id}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="checkbox-group">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="allow_recovery_codes"
                                                    name="allow_recovery_codes"
                                                    checked={configForm.allow_recovery_codes}
                                                    onChange={handleInputChange}
                                                />
                                                <label className="form-check-label" htmlFor="allow_recovery_codes">
                                                    {t("settings.config.allowRecoveryCodes")}
                                                </label>
                                            </div>

                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="allow_refresh_tokens"
                                                    name="allow_refresh_tokens"
                                                    checked={configForm.allow_refresh_tokens}
                                                    onChange={handleInputChange}
                                                />
                                                <label className="form-check-label" htmlFor="allow_refresh_tokens">
                                                    {t("settings.config.allowRefreshTokens")}
                                                </label>
                                            </div>
                                        </div>

                                        <div className="form-actions">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={loading.saving}
                                            >
                                                {loading.saving ? t("settings.config.saving") : t("settings.config.save")}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Settings;