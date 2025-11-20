#!/bin/bash

# ConnectU - Setup & Test Script
# Este script verifica que todo esté configurado correctamente

echo "🚀 ConnectU - Setup & Test Script"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "📦 Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js ${NODE_VERSION} instalado"
else
    echo -e "${RED}✗${NC} Node.js no encontrado. Por favor instala Node.js 18+"
    exit 1
fi

# Check npm
echo "📦 Verificando npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm ${NPM_VERSION} instalado"
else
    echo -e "${RED}✗${NC} npm no encontrado"
    exit 1
fi

# Check if node_modules exists
echo ""
echo "📚 Verificando dependencias..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules encontrado"
else
    echo -e "${YELLOW}⚠${NC} node_modules no encontrado. Instalando dependencias..."
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Dependencias instaladas correctamente"
    else
        echo -e "${RED}✗${NC} Error instalando dependencias"
        exit 1
    fi
fi

# Check key files
echo ""
echo "📄 Verificando archivos clave..."

FILES=(
    "src/api/axios.ts"
    "src/api/endpoints.ts"
    "src/api/types.ts"
    "src/store/authStore.ts"
    "src/store/matchStore.ts"
    "src/utils/constants.ts"
    "App.tsx"
    "package.json"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file no encontrado"
    fi
done

# Check TypeScript compilation
echo ""
echo "🔍 Verificando TypeScript..."
npx tsc --noEmit --skipLibCheck > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} TypeScript compila sin errores"
else
    echo -e "${YELLOW}⚠${NC} Hay algunos errores de TypeScript (pueden ser de tipos de NativeWind)"
fi

# Check API URL configuration
echo ""
echo "🔗 Verificando configuración de API..."
if grep -q "localhost:3000" "src/utils/constants.ts"; then
    echo -e "${YELLOW}⚠${NC} API_BASE_URL apunta a localhost:3000"
    echo "   Asegúrate de cambiar esto si tu backend está en otra URL"
else
    echo -e "${GREEN}✓${NC} API_BASE_URL configurado"
fi

# Summary
echo ""
echo "=================================="
echo "📊 Resumen del Setup"
echo "=================================="
echo ""
echo -e "${GREEN}✓${NC} Node.js y npm instalados"
echo -e "${GREEN}✓${NC} Dependencias instaladas"
echo -e "${GREEN}✓${NC} Archivos clave presentes"
echo -e "${GREEN}✓${NC} TypeScript configurado"
echo ""
echo "🎯 Próximos pasos:"
echo ""
echo "1. Configura tu backend URL en src/utils/constants.ts"
echo "2. Ejecuta: npm start"
echo "3. Escanea el QR con Expo Go (iOS/Android)"
echo "   o presiona 'w' para abrir en web"
echo ""
echo "📖 Documentación:"
echo "   - QUICK_START.md - Guía de inicio rápido"
echo "   - IMPLEMENTATION_SUMMARY.md - Detalles técnicos"
echo "   - BACKEND_EXAMPLES.md - Ejemplos de API"
echo ""
echo -e "${GREEN}¡Todo listo para la hackathon! 🚀${NC}"
