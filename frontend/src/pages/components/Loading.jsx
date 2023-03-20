import React, { useEffect } from "react";

import LoadingAnimation from "../../assets/loading.svg";
import useGeneralStore from "../../stores/useGeneralStore";

export default function Loading({ children }) {
    const { loadingAnimation } = useGeneralStore((state) => ({ loadingAnimation: state.loadingAnimation }));

    useEffect(() => {
        console.log("executando loading");
    }, []);

    return (
        <div className={loadingAnimation ? "loading-fetch active" : "loading-fetch desactive"}>
            <div className="loading-fetch__box">
                <div className="loading-fetch__box__animation-box">
                    <img
                        src={LoadingAnimation}
                        alt="Carregando dados..."
                        className="loading-fetch__box__animation-box__animation"
                    />
                </div>

                <h1 className="loading-fetch__box__desc">{children}</h1>
            </div>
        </div>
    );
}
