# 🚀 ConnectU - Quick Start Guide

## ✅ Pre-requisitos

- [ ] Node.js 18+ instalado
- [ ] npm o yarn
- [ ] Expo CLI (`npm install -g expo-cli`)
- [ ] iOS Simulator (Mac) o Android Emulator
- [ ] Backend API corriendo (o URL de producción)

## 📦 Instalación Rápida (5 minutos)

```bash
# 1. Navegar al proyecto
cd ConnectU

# 2. Instalar dependencias
npm install

# 3. Configurar backend URL
# Editar: src/utils/constants.ts
# Cambiar API_BASE_URL a tu backend

# 4. Limpiar cache y ejecutar
npm run clear
npm start
```

## 🔧 Configuración del Backend

### Opción 1: Backend Local

Edita `src/utils/constants.ts`:

```typescript
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'     // ✅ Cambiar puerto si es necesario
  : 'https://api.connectu.pe/api';
```

**Para Android Emulator:**
```typescript
export const API_BASE_URL = __DEV__ 
  ? 'http://10.0.2.2:3000/api'      // ✅ Usa esta IP en Android
  : 'https://api.connectu.pe/api';
```

### Opción 2: Backend en la Nube

```typescript
export const API_BASE_URL = 'https://tu-backend.railway.app/api';
```

## 🎯 Testing sin Backend

Si aún no tienes el backend, puedes:

### Opción A: Mock Temporal en el Frontend

Crea `src/api/mock.ts`:

```typescript
export const MOCK_USER = {
  id: "mock-uuid-123",
  email: "test@utec.edu.pe",
  firstName: "Miguel",
  lastName: "Test",
  career: "Computer Science",
  semester: 3,
  university: "UTEC",
  profileImage: null,
  bio: null,
  onboardingCompleted: false
};

export const MOCK_TOKEN = "mock-jwt-token";
```

Luego en `authStore.ts`, comenta las llamadas API y usa los mocks.

### Opción B: JSON Server (Recomendado)

```bash
# Instalar JSON Server
npm install -g json-server

# Crear db.json en la raíz
# (ver ejemplo abajo)

# Ejecutar
json-server --watch db.json --port 3000
```

**Ejemplo de `db.json`:**
```json
{
  "users": [
    {
      "id": "1",
      "email": "miguel@utec.edu.pe",
      "firstName": "Miguel",
      "lastName": "Sanchez",
      "career": "Computer Science",
      "semester": 3,
      "university": "UTEC",
      "onboardingCompleted": true
    }
  ],
  "matches": [],
  "messages": []
}
```

## 🏃 Comandos Principales

```bash
# Iniciar con cache limpio
npm run clear

# Iniciar modo desarrollo
npm start

# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web (testing rápido)
npm run web

# Build para producción
npm run build:android
npm run build:ios
```

## 📱 Testing en Dispositivo Real

### iOS (Requiere Mac)
1. Instala Expo Go desde App Store
2. Escanea QR code que aparece en la terminal
3. ¡Listo!

### Android
1. Instala Expo Go desde Play Store
2. Escanea QR code que aparece en la terminal
3. ¡Listo!

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
npm run clear
rm -rf node_modules
npm install
npm start
```

### Error: "Network Error" al hacer login
1. ✅ Verifica que el backend esté corriendo
2. ✅ Verifica la URL en `constants.ts`
3. ✅ Para Android, usa `10.0.2.2` en vez de `localhost`
4. ✅ Desactiva firewall/antivirus temporalmente

### Error: TypeScript errors
```bash
npm run clear
npx tsc --noEmit
```

### Error: "Expo Go crashed"
```bash
# Reiniciar Expo
npm run clear
npm start -- --reset-cache
```

## 🎬 Demo Flow para Hackathon

### 1. Preparación (Antes del pitch)
- [ ] Backend corriendo y testeado
- [ ] App corriendo en dispositivo/emulador
- [ ] Data seed cargada (usuarios, matches)
- [ ] Screenshots de backup por si falla wifi
- [ ] Video grabado como plan B

### 2. Script de Demo (7 minutos)

**Intro (30s)**
- Mostrar WelcomeScreen
- "4 de cada 10 universitarios abandonan..."

**Auth + Onboarding (2 min)**
- Login con email institucional
- Código OTP (usar código de prueba)
- Completar 4 pasos de onboarding
- Ver dashboard con riesgo académico detectado

**Matching (2 min)**
- Abrir pantalla de descubrimiento
- Ver candidatos con scores altos
- Explicar compatibilidad (94%)
- Hacer swipe right
- Mostrar "¡Es un Match!" modal

**Chat + Sesión (1.5 min)**
- Abrir chat con mentor
- Enviar mensaje
- Agendar sesión de mentoría
- Mostrar calendario

**Gamificación (1 min)**
- Dashboard de puntos y nivel
- Ver badges desbloqueados
- Mostrar leaderboard

**Cierre (30s)**
- Métricas de impacto
- ROI: S/.40K → S/.15.7M retenidos
- Call to action

### 3. Data de Prueba Recomendada

**Usuario Cachimbo:**
- Email: `miguel.sanchez@utec.edu.pe`
- Nombre: Miguel Sanchez
- Ciclo: 3
- Riesgo: Alto (65%)
- Curso problemático: Cálculo 2

**Mentor 1:**
- Nombre: Alejandra R.
- Ciclo: 9
- Especialidad: Ciberseguridad + Cálculo
- Score: 94%
- Rating: 4.8 ⭐

**Mentor 2:**
- Nombre: Carlos M.
- Ciclo: 7
- Especialidad: DevOps
- Score: 87%
- Rating: 4.9 ⭐

## 🎨 Customización

### Cambiar Colores
Edita `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: "#TU_COLOR",  // Color principal
  }
}
```

### Cambiar Logo
Reemplaza los archivos en `assets/`:
- `icon.png` (1024x1024)
- `splash-icon.png` (2048x2048)
- `adaptive-icon.png` (1024x1024)

### Cambiar Nombre de la App
Edita `app.json`:
```json
{
  "name": "ConnectU",
  "slug": "connectu"
}
```

## 📊 Métricas para la Hackathon

### Técnicas
- ✅ Frontend 100% funcional
- ✅ 8 pantallas principales implementadas
- ✅ 40+ endpoints integrados
- ✅ TypeScript con types completos
- ✅ Animaciones fluidas (60 FPS)

### UX
- ✅ Onboarding de 4 pasos (<3 min)
- ✅ Matching estilo Tinder (familiar)
- ✅ Gamificación completa
- ✅ Dark mode ready

### Negocio
- 💰 S/. 4 por estudiante/año
- 📈 Universidad 10K alumnos = S/. 40K/año
- 🎯 Retiene S/. 15.7M en pensiones
- 📊 ROI: 392.5x

## 🏆 Tips para Impresionar a los Jueces

1. **Empieza con storytelling**
   - Historia real de un estudiante
   - Problema emocional, luego datos

2. **Muestra el producto funcionando**
   - Live demo > slides
   - Flujo completo en 2 minutos

3. **Enfatiza el impacto social**
   - No solo tech cool
   - Vidas cambiadas

4. **Modelo de negocio claro**
   - B2B SaaS a universidades
   - ROI calculado y comprobable

5. **Tecnología de punta**
   - ML para detección de riesgo
   - Matching inteligente con IA
   - Stack moderno (React Native, TypeScript)

## 📞 Soporte de Última Hora

### Día de la Hackathon

**Problema: App no inicia**
```bash
cd ConnectU
rm -rf node_modules .expo
npm install
npm run clear
```

**Problema: Backend no responde**
- Usar JSON Server con data mock
- O mostrar video de backup

**Problema: Wifi del venue falla**
- Tener hotspot de respaldo
- O modo offline con data cacheada

## ✅ Checklist Pre-Presentación

### 30 min antes
- [ ] App corriendo sin errores
- [ ] Backend respondiendo
- [ ] Data seed cargada
- [ ] Batería al 100%
- [ ] Hotspot de backup configurado
- [ ] Video de backup en laptop

### 5 min antes
- [ ] Reiniciar app
- [ ] Test login rápido
- [ ] Verificar swipe funciona
- [ ] Test enviar mensaje
- [ ] Respirar profundo 😊

## 🎉 ¡Éxito en la Hackathon!

Recuerda:
- El producto funciona ✅
- El problema es real ✅
- El impacto es medible ✅
- La solución es escalable ✅

**¡Ahora ve y gana! 🚀🏆**

---

Para más detalles técnicos, ver:
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- [BACKEND_EXAMPLES.md](./BACKEND_EXAMPLES.md)
- [README.md](../README.md)
