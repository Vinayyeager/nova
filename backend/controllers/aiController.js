import { analyzeCode, detectLanguage, explainCode, fixCodeErrors, optimizeCode, convertCode } from '../utils/codeAnalyzer.js';

export const chat = async (req, res) => {
  try {
    const { message, language } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const lang = language || detectLanguage(message);
    const analysis = analyzeCode(message);
    
    let response = '';
    let code = '';
    
    if (analysis.isCode) {
      const explanation = explainCode(message, lang);
      response = explanation;
      code = message;
    } else {
      response = generateConversationalResponse(message);
    }

    res.json({
      response,
      code,
      language: lang,
      analysis
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const explain = async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const lang = language || detectLanguage(code);
    const explanation = explainCode(code, lang);
    
    res.json({
      explanation,
      complexity: analyzeComplexity(code, lang),
      lines: code.split('\n').length
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const fix = async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const lang = language || detectLanguage(code);
    const { fixedCode, errors, warnings } = fixCodeErrors(code, lang);
    
    res.json({
      fixedCode,
      errors,
      warnings
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const optimize = async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const lang = language || detectLanguage(code);
    const { optimizedCode, improvements } = optimizeCode(code, lang);
    
    res.json({
      optimizedCode,
      improvements
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const convert = async (req, res) => {
  try {
    const { code, from, to } = req.body;
    
    if (!code || !from || !to) {
      return res.status(400).json({ error: 'Code, source language, and target language are required' });
    }

    const { convertedCode, notes } = convertCode(code, from, to);
    
    res.json({
      convertedCode,
      notes
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

function generateConversationalResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm CodeForge AI, your intelligent coding assistant. I can help you with:\n\n• **Explaining code** - Understand what any code does\n• **Fixing errors** - Detect and resolve issues\n• **Optimizing** - Improve performance and readability\n• **Converting** - Transform code between languages\n\nJust paste your code or ask me anything!";
  }
  
  if (lowerMessage.includes('help')) {
    return "Here are the ways I can help you:\n\n1. **Explain Code** - Paste any code and I'll break it down step by step\n2. **Fix Code** - Send me buggy code and I'll identify and fix issues\n3. **Optimize** - I'll suggest performance improvements\n4. **Convert** - Transform code between JavaScript, Python, C, and Java\n\nJust type or paste your code to get started!";
  }
  
  return `I understand you're asking about "${message}". As an AI code assistant, I'm best at helping with programming tasks. 

Try pasting some code and I'll help you:
• Explain what it does
• Find and fix bugs
• Optimize for better performance
• Convert to a different language

What would you like help with?`;
}
