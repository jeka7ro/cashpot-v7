#!/usr/bin/env node

/**
 * 🚀 CASHPOT V7 - Auto Deploy Script
 * Configurează automat deploy-ul pe Render și Vercel
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n${colors.bold}${colors.blue}🚀 ${step}${colors.reset}`);
  log(`${message}`);
}

async function main() {
  try {
    log(`${colors.bold}${colors.green}🚀 CASHPOT V7 - AUTO DEPLOY SCRIPT${colors.reset}`);
    log(`${colors.yellow}Versiunea: 7.0.6${colors.reset}\n`);

    // Verifică dacă suntem în directorul corect
    if (!fs.existsSync('package.json')) {
      throw new Error('Nu sunt în directorul corect! Rulează din root-ul proiectului.');
    }

    // 1. Verifică git status
    logStep('1/6', 'Verific git status...');
    try {
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
      if (gitStatus.trim()) {
        log(`${colors.yellow}⚠️  Există modificări necomisite:${colors.reset}`);
        console.log(gitStatus);
        log(`${colors.yellow}Comitând modificările...${colors.reset}`);
        execSync('git add .', { stdio: 'inherit' });
        execSync('git commit -m "🚀 Auto-deploy: Update before deployment"', { stdio: 'inherit' });
      } else {
        log(`${colors.green}✅ Git status clean${colors.reset}`);
      }
    } catch (error) {
      log(`${colors.red}❌ Eroare la verificarea git: ${error.message}${colors.reset}`);
    }

    // 2. Push la GitHub
    logStep('2/6', 'Push la GitHub...');
    try {
      execSync('git push origin main', { stdio: 'inherit' });
      log(`${colors.green}✅ Push reușit${colors.reset}`);
    } catch (error) {
      log(`${colors.red}❌ Eroare la push: ${error.message}${colors.reset}`);
      throw error;
    }

    // 3. Verifică configurația Render
    logStep('3/6', 'Verific configurația Render...');
    if (fs.existsSync('render.yaml')) {
      log(`${colors.green}✅ render.yaml găsit${colors.reset}`);
      const renderConfig = fs.readFileSync('render.yaml', 'utf8');
      console.log(renderConfig);
    } else {
      log(`${colors.red}❌ render.yaml nu există!${colors.reset}`);
      throw new Error('render.yaml lipsește!');
    }

    // 4. Verifică configurația Vercel
    logStep('4/6', 'Verific configurația Vercel...');
    if (fs.existsSync('vercel.json')) {
      log(`${colors.green}✅ vercel.json găsit${colors.reset}`);
      const vercelConfig = fs.readFileSync('vercel.json', 'utf8');
      console.log(vercelConfig);
    } else {
      log(`${colors.red}❌ vercel.json nu există!${colors.reset}`);
      throw new Error('vercel.json lipsește!');
    }

    // 5. Testează build-ul local
    logStep('5/6', 'Testez build-ul local...');
    try {
      log(`${colors.yellow}Building frontend...${colors.reset}`);
      execSync('npm run build', { stdio: 'inherit' });
      log(`${colors.green}✅ Build reușit${colors.reset}`);
    } catch (error) {
      log(`${colors.red}❌ Eroare la build: ${error.message}${colors.reset}`);
      throw error;
    }

    // 6. Instrucțiuni pentru deploy manual
    logStep('6/6', 'Instrucțiuni pentru deploy manual...');
    
    log(`${colors.bold}${colors.green}🎉 PREGĂTIRE COMPLETĂ!${colors.reset}`);
    log(`${colors.yellow}Acum urmează pașii manuali pentru deploy:${colors.reset}\n`);

    log(`${colors.bold}${colors.blue}📋 BACKEND PE RENDER:${colors.reset}`);
    log(`1. Mergi la: https://render.com/dashboard`);
    log(`2. Click "New +" → "Web Service"`);
    log(`3. Conectează repository: cashpot-v7`);
    log(`4. Configurează:`);
    log(`   - Name: cashpot-v7-backend`);
    log(`   - Root Directory: backend`);
    log(`   - Environment: Node`);
    log(`   - Build Command: npm install`);
    log(`   - Start Command: node server.js`);
    log(`   - Plan: Free`);
    log(`5. Click "Create Web Service"`);
    log(`6. Așteaptă 5-10 minute pentru deploy`);
    log(`7. Notează URL-ul: https://cashpot-v7-backend.onrender.com\n`);

    log(`${colors.bold}${colors.blue}📋 FRONTEND PE VERCEL:${colors.reset}`);
    log(`1. Mergi la: https://vercel.com/dashboard`);
    log(`2. Click "New Project"`);
    log(`3. Import repository: cashpot-v7`);
    log(`4. Configurează:`);
    log(`   - Framework Preset: Vite`);
    log(`   - Root Directory: . (root)`);
    log(`   - Build Command: npm run build`);
    log(`   - Output Directory: dist`);
    log(`5. Adaugă Environment Variables:`);
    log(`   - VITE_API_URL: https://cashpot-v7-backend.onrender.com/api`);
    log(`   - VITE_APP_VERSION: 7.0.6`);
    log(`6. Click "Deploy"`);
    log(`7. Notează URL-ul: https://cashpot-v7.vercel.app\n`);

    log(`${colors.bold}${colors.green}🔗 URL-URI FINALE:${colors.reset}`);
    log(`Backend: https://cashpot-v7-backend.onrender.com`);
    log(`Frontend: https://cashpot-v7.vercel.app`);
    log(`Health Check: https://cashpot-v7-backend.onrender.com/health\n`);

    log(`${colors.bold}${colors.yellow}⚠️  IMPORTANT:${colors.reset}`);
    log(`- După deploy, actualizează CORS_ORIGIN în Render cu URL-ul Vercel`);
    log(`- Testează login-ul și funcționalitățile principale`);
    log(`- Verifică că toate API-urile funcționează corect\n`);

    log(`${colors.bold}${colors.green}🎉 DEPLOY AUTOMAT COMPLET!${colors.reset}`);

  } catch (error) {
    log(`${colors.red}❌ EROARE: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

main();
