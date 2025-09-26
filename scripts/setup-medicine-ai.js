#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

console.log('🔧 Nexus Mind Care - Medicine AI Setup Helper');
console.log('===============================================\n');

const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
  
  // Check if it has the required keys
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasGeminiKey = envContent.includes('VITE_GEMINI_API_KEY=') && !envContent.includes('your_primary_gemini_api_key_here');
  
  if (hasGeminiKey) {
    console.log('✅ Gemini API key appears to be configured');
    console.log('\n🎉 Medicine AI should be working properly!');
  } else {
    console.log('⚠️  Gemini API key needs to be configured');
    console.log('\n📝 Please edit your .env file and add your Gemini API key:');
    console.log('   VITE_GEMINI_API_KEY=your_actual_api_key_here');
    console.log('\n🔗 Get your API key from: https://aistudio.google.com/app/apikey');
  }
} else {
  console.log('❌ .env file not found');
  
  // Copy from .env.example if it exists
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Copying .env.example to .env...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created from template');
  } else {
    console.log('📝 Creating new .env file...');
    const envTemplate = `# Gemini AI API Configuration
# You need to get these API keys from Google AI Studio: https://aistudio.google.com/app/apikey

# Primary Gemini API Key (required)
VITE_GEMINI_API_KEY=your_primary_gemini_api_key_here

# Fallback Gemini API Key (optional - for redundancy)
VITE_GEMINI_FALLBACK_API_KEY=your_fallback_gemini_api_key_here

# Instructions:
# 1. Replace 'your_primary_gemini_api_key_here' with your actual Gemini API key
# 2. Optionally add a fallback key for redundancy
# 3. Restart the development server after adding the keys
`;
    fs.writeFileSync(envPath, envTemplate);
    console.log('✅ .env file created');
  }
  
  console.log('\n🔧 Next steps:');
  console.log('1. Get your Gemini API key from: https://aistudio.google.com/app/apikey');
  console.log('2. Edit the .env file and replace "your_primary_gemini_api_key_here" with your actual API key');
  console.log('3. Restart the development server (npm run dev)');
  console.log('4. Test the Medicine AI image analysis feature');
}

console.log('\n📚 For detailed setup instructions, see: MEDICINE_AI_SETUP_GUIDE.md');
console.log('🐛 If you encounter issues, check the browser console for error messages');