import React from "react";

import Loading from "../../../assets/loading.svg";

export default function WinnerLoading() {
    return (
        <div className="winner-fetching">
            <div className="winner-fetching__box">
                <img src={Loading} alt="Carregando..." className="winner-fetching__box__loading-animation" />
            </div>
        </div>
    );
}
