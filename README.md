# ReplygAI - AI-Powered Reply Generator for Twitter/X

ReplygAI is a Chrome extension that helps you generate intelligent, context-aware replies for Twitter/X posts using AI. With a simple click, generate relevant responses while maintaining your voice.

<p align="center" style="background-color:#1a1a1a; padding:20px;">
  <img src="public/full_icon.png" alt="ReplygAI Logo" width="310" height="95">
</p>

## Features

- 🤖 One-click AI-powered reply generation
- 🔄 Regenerate responses until you're satisfied
- 🔒 Secure API key storage
- 🎯 Context-aware responses based on tweet content
- 🔌 Seamless Twitter/X integration
- 🛡️ Privacy-focused design

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/UlbertAO/ReplygAI.git
   cd ReplygAI
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the extension:

   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from your build

## Usage

1. Click the ReplygAI extension icon in your Chrome toolbar
2. Enter your AI service API key in the popup
3. Navigate to Twitter/X
4. Look for the ReplygAI icon next to the reply button on any tweet
5. Click the icon to generate an AI-powered reply
6. Edit the generated reply if needed
7. Post your reply!

Need a different response? Click the ReplygAI icon in the reply modal to regenerate.

## Configuration

The extension requires an API key from OpenRouter to access various AI models. OpenRouter provides a unified API to access multiple language models including:

- Anthropic Claude
- Google PaLM
- Meta Llama
- OpenAI GPT models
- DeepSeek
- And more

To get started:

1. Visit [OpenRouter](https://openrouter.ai/)
2. Create an account and obtain your API key
3. Store your API key securely through the extension popup interface

Your API key is stored securely in Chrome's extension storage and is only used to authenticate requests to OpenRouter's API.

## Development

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Chrome browser

### Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development build:

   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

### Project Structure

```
ReplygAI/
├── src/                # Source files
│   ├── components/    # React components
│   ├── services/      # Core services
│   └── config/        # Configuration files
├── public/            # Static assets
└── dist/             # Build output
```

## Security

- API keys are stored securely in Chrome's extension storage
- No data is sent to external servers except the AI service
- All communication with Twitter/X is local to the browser

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

If you encounter any issues or have questions:

- Open an issue in this repository
- Contact the maintainers