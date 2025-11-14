# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

Please report security vulnerabilities to the project maintainers privately.

**Do not** open a public GitHub issue for security vulnerabilities.

## Security Best Practices

### For Users

1. **Environment Variables**: Never commit `.env` files. Use `.env.example` as a template.
2. **Database Credentials**: Use strong passwords for production databases.
3. **HTTPS**: Always use HTTPS in production.
4. **Dependencies**: Regularly update dependencies to patch security vulnerabilities.

### For Developers

1. **Input Validation**: All API inputs are validated using Zod schemas.
2. **Password Hashing**: Passwords are hashed using bcrypt with salt rounds of 10.
3. **SQL Injection**: Using Sequelize ORM prevents SQL injection attacks.
4. **Error Handling**: Sensitive information is not exposed in error messages.

## Known Security Considerations

- API endpoints do not currently implement rate limiting (consider adding for production)
- CORS is configured but may need adjustment for production
- Consider adding authentication middleware for protected routes
