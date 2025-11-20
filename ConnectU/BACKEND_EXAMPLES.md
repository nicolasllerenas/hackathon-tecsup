# Backend Response Examples

Este archivo contiene ejemplos de las respuestas que el backend debe devolver para cada endpoint.

## 🔐 Authentication

### POST /auth/send-verification
**Request:**
```json
{
  "email": "miguel.sanchez@utec.edu.pe"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Código enviado a miguel.sanchez@utec.edu.pe",
  "expires_in": 300
}
```

---

### POST /auth/verify
**Request:**
```json
{
  "email": "miguel.sanchez@utec.edu.pe",
  "code": "123456"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-123",
    "email": "miguel.sanchez@utec.edu.pe",
    "firstName": null,
    "lastName": null,
    "career": "",
    "semester": 0,
    "university": "",
    "profileImage": null,
    "bio": null,
    "onboardingCompleted": false
  }
}
```

---

### POST /auth/onboarding
**Request:**
```json
{
  "firstName": "Miguel",
  "lastName": "Sanchez",
  "career": "Computer Science",
  "semester": 3,
  "university": "UTEC",
  "careerInterests": ["Ciberseguridad", "DevOps"],
  "futureRoles": ["Security Engineer", "DevOps Engineer"],
  "industryPreference": ["Tech", "Fintech"],
  "skillsToLearn": ["Pentesting", "Docker", "AWS"],
  "weaknesses": ["Cálculo 2", "Física 1"],
  "strengths": ["Programación", "Base de Datos"],
  "studyStyle": "practical",
  "availableTimes": {
    "monday": ["14:00-16:00", "18:00-20:00"],
    "tuesday": ["16:00-18:00"],
    "wednesday": ["14:00-16:00"],
    "thursday": [],
    "friday": ["18:00-22:00"],
    "saturday": ["10:00-14:00"],
    "sunday": []
  }
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "user": {
    "id": "uuid-123",
    "email": "miguel.sanchez@utec.edu.pe",
    "firstName": "Miguel",
    "lastName": "Sanchez",
    "career": "Computer Science",
    "semester": 3,
    "university": "UTEC",
    "profileImage": "https://cdn.connectu.pe/avatars/default.png",
    "bio": null,
    "onboardingCompleted": true
  },
  "profile": {
    "careerInterests": ["Ciberseguridad", "DevOps"],
    "futureRoles": ["Security Engineer", "DevOps Engineer"],
    "industryPreference": ["Tech", "Fintech"],
    "skillsToLearn": ["Pentesting", "Docker", "AWS"],
    "weaknesses": ["Cálculo 2", "Física 1"],
    "strengths": ["Programación", "Base de Datos"],
    "studyStyle": "practical",
    "gpa": null,
    "riskScore": 65,
    "riskType": "academic",
    "riskFactors": [
      {
        "type": "academic",
        "description": "Dificultad en Cálculo 2",
        "severity": "high",
        "suggestion": "Buscar mentoría especializada en Cálculo"
      }
    ],
    "level": 1,
    "points": 0,
    "badges": [],
    "availableTimes": {
      "monday": ["14:00-16:00", "18:00-20:00"],
      "tuesday": ["16:00-18:00"],
      "wednesday": ["14:00-16:00"],
      "thursday": [],
      "friday": ["18:00-22:00"],
      "saturday": ["10:00-14:00"],
      "sunday": []
    }
  }
}
```

---

## 👤 User Endpoints

### GET /users/me
**Response: 200 OK**
```json
{
  "id": "uuid-123",
  "email": "miguel.sanchez@utec.edu.pe",
  "firstName": "Miguel",
  "lastName": "Sanchez",
  "career": "Computer Science",
  "semester": 3,
  "university": "UTEC",
  "profileImage": "https://cdn.connectu.pe/avatars/miguel-123.jpg",
  "bio": "Apasionado por ciberseguridad. Buscando mejorar en Cálculo.",
  "onboardingCompleted": true,
  "profile": {
    "careerInterests": ["Ciberseguridad", "DevOps"],
    "futureRoles": ["Security Engineer"],
    "skillsToLearn": ["Pentesting", "Docker"],
    "strengths": ["Programación", "Base de Datos"],
    "weaknesses": ["Cálculo 2", "Física 1"],
    "studyStyle": "practical",
    "gpa": 15.2,
    "riskScore": 65,
    "riskType": "academic",
    "riskFactors": [
      {
        "type": "academic",
        "description": "Calificación baja en Cálculo 2 (12)",
        "severity": "high",
        "suggestion": "Buscar mentoría especializada en Cálculo"
      }
    ],
    "level": 1,
    "points": 150,
    "badges": ["first_match"],
    "availableTimes": {
      "monday": ["14:00-16:00"],
      "tuesday": ["16:00-18:00"],
      "wednesday": [],
      "thursday": [],
      "friday": [],
      "saturday": [],
      "sunday": []
    }
  },
  "stats": {
    "mentorshipsAsmentee": 2,
    "mentorshipsAsMentor": 0,
    "sessionsCompleted": 3,
    "avgRating": 4.5
  }
}
```

---

## 🤝 Matching Endpoints

### GET /matches/candidates?limit=20&offset=0
**Response: 200 OK**
```json
{
  "candidates": [
    {
      "id": "candidate-uuid-456",
      "user": {
        "id": "uuid-456",
        "firstName": "Alejandra",
        "lastName": "R.",
        "career": "Computer Science",
        "semester": 9,
        "profileImage": "https://cdn.connectu.pe/avatars/alejandra-456.jpg",
        "bio": "Security Engineer en EY. Ayudo con Cálculo y materias de seguridad."
      },
      "compatibilityScore": 94,
      "matchType": "MENTOR",
      "matchReasons": [
        "Ambos apasionados por Ciberseguridad",
        "Alejandra destacó en Cálculo 2 (nota 18)",
        "Disponibilidad en común: Martes 4-6pm",
        "Mentoró a 7 estudiantes exitosamente"
      ],
      "commonInterests": ["Ciberseguridad", "Pentesting"],
      "mentorStats": {
        "successRate": 85,
        "avgRating": 4.8,
        "totalSessions": 23
      }
    },
    {
      "id": "candidate-uuid-789",
      "user": {
        "id": "uuid-789",
        "firstName": "Carlos",
        "lastName": "M.",
        "career": "Computer Science",
        "semester": 7,
        "profileImage": "https://cdn.connectu.pe/avatars/carlos-789.jpg",
        "bio": "DevOps Engineer. Me encanta Docker y Kubernetes."
      },
      "compatibilityScore": 87,
      "matchType": "MENTOR",
      "matchReasons": [
        "Ambos interesados en DevOps",
        "Carlos puede enseñarte Docker y AWS",
        "Horarios compatibles",
        "4.9 estrellas de rating"
      ],
      "commonInterests": ["DevOps", "Cloud Computing"],
      "mentorStats": {
        "successRate": 92,
        "avgRating": 4.9,
        "totalSessions": 15
      }
    }
  ],
  "pagination": {
    "total": 48,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### POST /matches/request
**Request:**
```json
{
  "candidateId": "uuid-456",
  "message": "Hola Alejandra! Me gustaría que me ayudes con Cálculo 2."
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "match": {
    "id": "match-uuid-789",
    "status": "pending",
    "matchType": "MENTOR",
    "compatibilityScore": 94,
    "createdAt": "2024-11-01T14:30:00Z",
    "otherUser": {
      "id": "uuid-456",
      "firstName": "Alejandra",
      "lastName": "R.",
      "profileImage": "https://cdn.connectu.pe/avatars/alejandra-456.jpg",
      "career": "Computer Science",
      "semester": 9
    }
  },
  "message": "Solicitud enviada a Alejandra. Te notificaremos cuando responda."
}
```

---

### GET /matches/my-matches?status=all
**Response: 200 OK**
```json
{
  "matches": [
    {
      "id": "match-uuid-789",
      "status": "accepted",
      "matchType": "MENTOR",
      "compatibilityScore": 94,
      "createdAt": "2024-11-01T14:30:00Z",
      "acceptedAt": "2024-11-01T16:45:00Z",
      "otherUser": {
        "id": "uuid-456",
        "firstName": "Alejandra",
        "lastName": "R.",
        "profileImage": "https://cdn.connectu.pe/avatars/alejandra-456.jpg",
        "career": "Computer Science",
        "semester": 9
      },
      "lastMessage": {
        "content": "Perfecto! Nos vemos el miércoles",
        "sentAt": "2024-11-02T10:20:00Z",
        "isRead": true
      },
      "upcomingSession": {
        "id": "session-uuid-1",
        "scheduledAt": "2024-11-06T16:00:00Z",
        "duration": 60
      },
      "stats": {
        "totalSessions": 2,
        "totalMessages": 15
      }
    }
  ],
  "counts": {
    "pending": 3,
    "active": 2,
    "completed": 1
  }
}
```

---

## 💬 Chat Endpoints

### GET /matches/:matchId/messages?limit=50
**Response: 200 OK**
```json
{
  "messages": [
    {
      "id": "msg-uuid-1",
      "matchId": "match-uuid-789",
      "senderId": "uuid-123",
      "content": "Hola Alejandra! Gracias por aceptar",
      "messageType": "text",
      "createdAt": "2024-11-01T17:00:00Z",
      "isRead": true
    },
    {
      "id": "msg-uuid-2",
      "matchId": "match-uuid-789",
      "senderId": "uuid-456",
      "content": "Hola Miguel! Con gusto. ¿Qué tema te cuesta más?",
      "messageType": "text",
      "createdAt": "2024-11-01T17:05:00Z",
      "isRead": true
    }
  ],
  "pagination": {
    "hasMore": false,
    "oldestTimestamp": "2024-11-01T17:00:00Z"
  }
}
```

---

## 📅 Session Endpoints

### POST /sessions
**Request:**
```json
{
  "matchId": "match-uuid-789",
  "scheduledAt": "2024-11-06T16:00:00Z",
  "duration": 60,
  "title": "Sesión de Cálculo 2 - Integrales",
  "description": "Repaso de integrales y derivadas aplicadas",
  "createGoogleCalendarEvent": true
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "session": {
    "id": "session-uuid-1",
    "matchId": "match-uuid-789",
    "scheduledAt": "2024-11-06T16:00:00Z",
    "duration": 60,
    "title": "Sesión de Cálculo 2 - Integrales",
    "description": "Repaso de integrales y derivadas aplicadas",
    "status": "scheduled",
    "googleCalendarEventId": "google-event-123",
    "calendarLink": "https://calendar.google.com/event?eid=...",
    "createdAt": "2024-11-02T10:00:00Z"
  },
  "emailsSent": [
    "miguel.sanchez@utec.edu.pe",
    "alejandra.r@utec.edu.pe"
  ]
}
```

---

## 🎮 Gamification Endpoints

### GET /gamification/me
**Response: 200 OK**
```json
{
  "level": 2,
  "currentPoints": 350,
  "pointsToNextLevel": 150,
  "badges": [
    {
      "id": "first_match",
      "name": "Primera Conexión",
      "description": "Hiciste tu primer match",
      "icon": "https://cdn.connectu.pe/badges/first_match.png",
      "earnedAt": "2024-11-01T16:45:00Z"
    }
  ],
  "stats": {
    "totalSessions": 5,
    "hoursVolunteered": 5,
    "menteesHelped": 2,
    "successRate": 100
  },
  "rewards": {
    "certificatesAvailable": [
      {
        "type": "volunteer_certificate",
        "hours": 5,
        "downloadUrl": "/gamification/certificates/volunteer"
      }
    ],
    "nextReward": {
      "level": 3,
      "description": "Carta de recomendación automática",
      "pointsNeeded": 150
    }
  }
}
```

---

## 🔔 Notifications

### GET /notifications?limit=20
**Response: 200 OK**
```json
{
  "notifications": [
    {
      "id": "notif-uuid-1",
      "type": "new_match",
      "title": "¡Nuevo match!",
      "body": "Alejandra aceptó tu solicitud de mentoría",
      "data": {
        "matchId": "match-uuid-789",
        "userId": "uuid-456"
      },
      "isRead": false,
      "createdAt": "2024-11-01T16:45:00Z"
    },
    {
      "id": "notif-uuid-2",
      "type": "session_reminder",
      "title": "Sesión en 1 hora",
      "body": "Tu sesión con Alejandra empieza a las 4:00 PM",
      "data": {
        "sessionId": "session-uuid-1"
      },
      "isRead": false,
      "createdAt": "2024-11-06T15:00:00Z"
    }
  ],
  "unreadCount": 3
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Código inválido o expirado",
  "error": "INVALID_CODE"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token inválido o expirado",
  "error": "UNAUTHORIZED"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Recurso no encontrado",
  "error": "NOT_FOUND"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Demasiados intentos. Por favor espera 60 segundos.",
  "error": "RATE_LIMIT_EXCEEDED"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error interno del servidor",
  "error": "INTERNAL_ERROR"
}
```
