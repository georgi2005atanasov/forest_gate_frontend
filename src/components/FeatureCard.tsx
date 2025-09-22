
interface FeatureCardProps {
    title: string;
    iconSrc: any; // TODO; find the type
    text: string;
}

const FeatureCard = ({ title, iconSrc, text }: FeatureCardProps) => {
    return (
        <div className="col-12 col-md-6 mb-4">
            <div className="card feature-card h-100 border-0 shadow-sm">
                <div className="card-body d-flex align-items-start gap-3">
                    <div className="icon-circle">
                        <img src={iconSrc} alt="" width="28" height="28" />
                    </div>
                    <div className="d-flex justify-content-start flex-column">
                        <h5 className="card-title mb-1 d-flex justify-content-start">{title}</h5>
                        <p className="card-text d-flex justify-content-start text-body-secondary mb-0">{text}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FeatureCard;