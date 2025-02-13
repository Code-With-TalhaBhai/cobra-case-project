import OrderReceivedEmail from '@/components/emails/OrderRecievedEmail';
import { render } from '@react-email/render';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import React from 'react';


export async function POST(){
try {

const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY || '',
});

    const shippingAddress= {name:'talha',id: 'fdjsklfsd',city: 'Lahore',street:'Sant Nagar',country: 'Pakistan',phoneNumber: '23432423',postalCode: '54300',state: 'Lahore'}
    const emailHtml = await render(React.createElement(OrderReceivedEmail,{shippingAddress:shippingAddress,orderId:'orderId',orderDate:`${Date.now().toLocaleString()}`}));

    const sentFrom = new Sender("hello@jhoolisdone.work.gd", "Cobra-Case Team");
    const recipients = [
        new Recipient("talhakhalid411@gmail.com", "Your Client")
    ];

    const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject("Case Order")
    .setHtml(emailHtml)

    const res = await mailerSend.email.send(emailParams);
    return Response.json({response: res})
}
catch (error) {
    return Response.json({ error }, { status: 500 });
}

}