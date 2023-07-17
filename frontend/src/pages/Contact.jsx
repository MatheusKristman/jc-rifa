import React from 'react';

import { Header, Footer } from './components';
import ContactContent from './components/contact/ContactContent';
import Loading from './components/Loading';
import useGeneralStore from '../stores/useGeneralStore';

const Contact = () => {
    const { isLoading } = useGeneralStore((state) => ({
        isLoading: state.isLoading,
    }));

    return (
        <div className="contact">
            <Header />
            <ContactContent />
            {isLoading && <Loading>Aguarde um momento...</Loading>}
            <Footer />
        </div>
    );
};

export default Contact;
