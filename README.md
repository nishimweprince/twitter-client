# X API Integration

A TypeScript-based integration with X (formerly Twitter) API v1.1, providing a robust framework for automated X interactions.

## 🚀 Features

- OAuth 1.0a Authentication with X API
- Automated request signing
- Environment-based configuration
- Type-safe API interactions
- Configurable tweet length validation

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- X Developer Account with API credentials

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/nishimweprince/twitter-client
cd twitter-client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your X API credentials:
Check the `.env.example` file for required environment variables and their format.

## ⚙️ Configuration

### Environment Variables

Please refer to the `.env.example` file in the root directory for a complete list of required and optional environment variables.

### TypeScript Configuration

The project uses TypeScript with the following key configurations:
- Target: ES2018
- Module: CommonJS
- Strict type checking enabled
- Decorator metadata enabled
- Full type safety with `noImplicitAny`

## 📦 Project Structure

```
src/
├── helpers/
│   ├── axios.helper.ts    # Axios configuration with OAuth
│   └── errors.helper.ts   # Error handling utilities
├── posts/
│   ├── post.routes.ts     # Route definitions
│   ├── post.service.ts    # Business logic
│   └── post.controller.ts # Request handlers
├── types/
│   ├── post.types.ts      # Post-related type definitions
│   └── common.types.ts    # Shared type definitions
└── routes/
    └── index.ts           # Route aggregation
```

## 🔒 Security

- All sensitive credentials are stored in environment variables
- OAuth 1.0a authentication for secure API requests
- Request signing for each API call

## 🚀 Usage

### Making API Requests

```typescript
import { axiosInstance } from './helpers/axios.helper';

// Post a tweet
await axiosInstance.post('/statuses/update.json', {
  status: 'Hello, World!'
});
```

### Error Handling

The application includes built-in error handling for common X API errors and rate limits.

## 🧪 Development

1. Enable dry run mode in `.env`:
```env
TWITTER_DRY_RUN=true
```

2. Run in development mode:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚠️ Important Notes

- Keep your API credentials secure and never commit them to version control
- Follow X's API rate limits and usage guidelines
- Test thoroughly in dry run mode before enabling live API calls

## 📫 Support

- Email: princeelysee@gmail.com
- Twitter: @nishimweprince
- LinkedIn: https://www.linkedin.com/in/nishimweprince
