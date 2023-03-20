import React from "react";

import Loading from "../../../assets/loading.svg";

export default function LoadingFetchNumbers() {
    return (
        <div className="loading-fetch-numbers">
            <div className="loading-fetch-numbers__box">
                <img src={Loading} alt="Carregando..." className="loading-fetch-numbers__box__loading-animation" />
            </div>
        </div>
    );
}
