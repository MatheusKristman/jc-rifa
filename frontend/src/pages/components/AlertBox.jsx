import React from "react";

const AlertBox = ({ success, error, message }) => {
    return (
        <div
            style={error ? { backgroundColor: "rgb(209, 52, 52)" } : {}}
            className={success || error ? "alert-box" : "alert-box desactive"}
        >
            <div className="alert-box__container">
                <span className={"alert-box__container__message"}>{message}</span>
            </div>
        </div>
    );
};

export default AlertBox;
