import { mailConfig } from './vars';

const nodemailer = require('nodemailer');
const mock = require('nodemailer-mock');

export const transporter = nodemailer.createTransport(mailConfig);
export const mockTransporter = mock.createTransport(mailConfig);
