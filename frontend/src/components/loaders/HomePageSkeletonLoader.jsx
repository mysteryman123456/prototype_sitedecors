const HomePageSkeletonLoader = () => {
  return (
        <>
        <div className="skeleton-card">
            <div className="sk-image skeleton-animation"></div>
            <div className="sk-content">
                <div style={{marginTop:"5px"}}  className="skeleton-animation sk-title"></div>
                <div style={{marginTop:"0px"}} className="skeleton-animation sk-description"></div>

                <div className="sk-description-line">
                    <div style={{maxWidth:"15%"}} className="skeleton-animation sk-tsu"></div>
                    <div className="skeleton-animation sk-tsu"></div>
                </div>
                <div className="sk-tsu-lin">
                    <div className="skeleton-animation sk-tsu"></div>
                    <div className="skeleton-animation sk-tsu"></div>
                </div>
            </div>
            <div className="sk-price-content">
                <div className="sk-price-line">
                    <div className="skeleton-animation sk-price"></div>
                    <div style={{width:"30%"}} className="skeleton-animation sk-price"></div>
                </div>
                <div className="sk-btn-wrap">
                    <div className="skeleton-animation sk-btn"></div>
                    <div className="skeleton-animation sk-btn"></div>
                </div>
            </div>
        </div>
    </>
  )
}

export default HomePageSkeletonLoader
