import React, { useEffect } from 'react';
import { useMercadopago } from 'react-sdk-mercadopago';

export default function Checkout() {
    const mercadopago = useMercadopago.v2(`${import.meta.env.MERCADO_PAGO_PUBLIC_KEY}`, {
        locale: 'pt-BR'
    });

    useEffect(() => {
        if (mercadopago) {
            mercadopago.checkout({
                preference: {
                    id: 'jc-rifa'
                },
                render: {
                    container: '.cho-container',
                    label: 'Pagar',
                }
            })
        }
    }, [mercadopago])

    return (
        <div>
            <div class="cho-container" />
        </div>
    )
}
