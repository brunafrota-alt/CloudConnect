# Sistema de Cadastro de Clientes

## Overview

This is a client management system built as a single-page web application in Portuguese. The system allows users to register, view, edit, and delete client information including name, email, and phone number. It uses Airtable as a cloud-based database for data persistence, providing a simple yet effective solution for small to medium-scale client management without requiring traditional backend infrastructure.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single-Page Application (SPA)**: Built with vanilla HTML, CSS, and JavaScript without frameworks
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox for layout
- **Component-Based Structure**: Modular JavaScript functions for different UI operations
- **State Management**: Simple client-side state management using JavaScript variables
- **Form Validation**: HTML5 validation with custom JavaScript validation logic

### UI/UX Design Patterns
- **Theme**: Green pastel color scheme with soft gradients
- **Animation System**: CSS animations for smooth transitions and user feedback
- **Alert System**: Custom notification system for user feedback on operations
- **Loading States**: Visual feedback during data operations

### Data Flow Architecture
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Real-time Updates**: Immediate UI updates after successful operations
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Form State Management**: Dynamic form behavior for add/edit modes

### Client-Side Architecture
- **DOM Manipulation**: Direct DOM manipulation without virtual DOM
- **Event-Driven**: Event listeners for form submissions and user interactions
- **Asynchronous Operations**: Promise-based HTTP requests using Fetch API
- **Local State**: In-memory storage of client data for UI operations

## External Dependencies

### Cloud Database
- **Airtable API**: Primary data storage solution
  - Base ID: `appcKOxe8Gqark2T3`
  - Table: `Clientes`
  - API Key authentication via bearer token
  - RESTful API endpoints for CRUD operations

### Browser APIs
- **Fetch API**: For HTTP requests to Airtable
- **DOM API**: For dynamic content manipulation
- **Form API**: For form validation and data collection

### Configuration Management
- **Environment Variables**: API credentials intended for Replit Secrets
- **Hardcoded Configuration**: Base ID and table name in JavaScript constants

### No Additional Frameworks
- Pure vanilla JavaScript implementation
- No build tools or package managers required
- Direct browser compatibility without transpilation