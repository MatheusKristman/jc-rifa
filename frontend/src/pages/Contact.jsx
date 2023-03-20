import React from "react";
import { Header, Footer } from "./components";
import ContactContent from "./components/contact/ContactContent";

const Contact = () => {
    return (
        <div className="contact">
            <Header />
            <ContactContent />
            <Footer />
        </div>
    );
};

export default Contact;
