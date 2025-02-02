# FAQ Management System

This project is an FAQ management system built with Node.js, Express.js, MongoDB, Redis, and supports multilingual content.

## Installation

1. Clone this repository

   git clone https://github.com/yourusername/faq-management.git
   cd faq-management

2. Install dependencies

   npm install

3. Set up MongoDB and Redis services

   docker-compose up

4. Start the application

    npm start

The application will run on http://localhost:5000

## API Endpoints

1. POST /faq --> Create FAQ
2. GET /faq?lang=hi --> This will return FAQs in the requested language
3. PUT /faq/:id --> Update FAQ
4. DELETE /faq/:id --> Delete FAQ








