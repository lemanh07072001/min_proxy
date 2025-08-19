import React from 'react';

const InfrastructureSection = () => {
  return (
    <section className="infrastructure-section">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="infrastructure-title">
            <span className="text-red">Cơ sở hạ tầng</span> của chúng tôi
          </h2>
          <p className="infrastructure-subtitle">
            Cơ sở hạ tầng hiện đại được trang bị toàn diện các công nghệ tiên tiến nhất về máy chủ proxy,
            ổn định và bảo mật vượt trội
          </p>
        </div>

        {/* Image Gallery */}
        <div className="infrastructure-gallery">
          <div className="gallery-container">
            {/* Top row images */}
            <div className="gallery-image-wrapper gallery-top-left">
              <img
                src="https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
                alt="Server Infrastructure 1"
                className="gallery-image"
              />
            </div>
            <div className="gallery-image-wrapper gallery-top-right">
              <img
                src="https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
                alt="Server Infrastructure 2"
                className="gallery-image"
              />
            </div>

            {/* Middle row images */}
            <div className="gallery-image-wrapper gallery-middle-left">
              <img
                src="https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
                alt="Network Cables"
                className="gallery-image"
              />
            </div>

            {/* Center main image */}
            <div className="gallery-image-wrapper gallery-center">
              <img
                src="https://images.pexels.com/photos/2881232/pexels-photo-2881232.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop"
                alt="Main Server Infrastructure"
                className="gallery-image main-image"
              />
            </div>

            <div className="gallery-image-wrapper gallery-middle-right">
              <img
                src="https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
                alt="Server Hardware"
                className="gallery-image"
              />
            </div>

            {/* Bottom row images */}
            <div className="gallery-image-wrapper gallery-bottom-left">
              <img
                src="https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
                alt="Network Equipment"
                className="gallery-image"
              />
            </div>
            <div className="gallery-image-wrapper gallery-bottom-right">
              <img
                src="https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
                alt="Data Center"
                className="gallery-image"
              />
            </div>
          </div>
        </div>

        {/* Stats or Features */}
        <div className="infrastructure-stats">
          <div className="row">
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Giám sát</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">1000+</div>
                <div className="stat-label">Server</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">3</div>
                <div className="stat-label">Nhà mạng</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfrastructureSection;