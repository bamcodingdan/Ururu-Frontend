#!/bin/bash

# Next.js 프로젝트 빌드 스크립트
echo "🚀 Starting build process..."

# 의존성 설치
echo "📦 Installing dependencies..."
npm ci

# 린팅 실행
echo "🔍 Running linting..."
npm run lint

# 빌드 실행
echo "🏗️ Building application..."
npm run build

# 출력 디렉토리 생성
echo "📁 Creating output directory..."
mkdir -p output

# 빌드된 파일들을 출력 디렉토리로 복사
echo "📋 Copying build files to output..."
cp -r .next output/
cp -r public output/
cp -r src output/
cp package.json output/
cp package-lock.json output/
cp next.config.mjs output/
cp tailwind.config.ts output/
cp tsconfig.json output/
cp postcss.config.js output/
cp .eslintrc.json output/
cp components.json output/
cp prettier.config.js output/
cp README.md output/

echo "✅ Build completed successfully!"
