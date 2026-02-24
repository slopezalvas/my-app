# 🎬 Gleni Cine Assistant - AI Chatbot

Este proyecto es un asistente de cine inteligente capaz de razonar, recordar los gustos del usuario y buscar películas en tiempo real. No es un simple "wrapper" de ChatGPT; es un sistema integrado que utiliza herramientas nativas de IA, persistencia en base de datos y consumo de APIs externas.

**Link del Deploy:** [COPIA_AQUI_TU_LINK_DE_VERCEL]

---

## 🚀 Propuesta de Valor

### El Problema que resuelve

La búsqueda de películas suele ser fragmentada. Los usuarios deben saltar entre aplicaciones para buscar recomendaciones y recordar qué géneros les gustan.

### Nuestra Solución

**Cine Assistant** centraliza la experiencia. El bot entiende el contexto, consulta una base de datos de películas real (TMDB) y guarda de forma persistente las preferencias del usuario para que cada charla sea más personalizada que la anterior.

### Público Objetivo

Entusiastas del cine que buscan una recomendación rápida y personalizada sin navegar por menús complejos.

---

## 🛠️ Stack Tecnológico

- **IA Engine:** OpenAI GPT-4o mediante **Vercel AI SDK**.
- **Frontend:** Next.js 15 (App Router) + Tailwind CSS.
- **Base de Datos:** PostgreSQL (Neon.tech).
- **ORM:** Drizzle ORM (Type-safe y ligero).
- **API Externa:** TMDB (The Movie Database).
- **Renderizado:** React Markdown + Remark GFM para contenido enriquecido.
- **Validación:** Zod para la estructura de las Tools.

---

## 📋 User Stories

1. **Búsqueda Inteligente:**
   - **Como** usuario cinéfilo,
   - **Quiero** pedir recomendaciones basadas en temas o géneros (ej. "recomiéndame un thriller"),
   - **Para** obtener resultados reales con posters y descripciones actualizadas.

2. **Memoria Persistente de Gustos:**
   - **Como** usuario recurrente,
   - **Quiero** que el bot recuerde mis géneros favoritos,
   - **Para** que no tenga que repetir mis preferencias en cada nueva sesión.

3. **Historial de Conversación:**
   - **Como** usuario,
   - **Quiero** refrescar la pestaña y que mis mensajes anteriores sigan ahí,
   - **Para** retomar mi búsqueda donde la dejé.

---

## 🧠 Decisiones Técnicas y Trade-offs (Criterio Senior)

### 1. Regla Anti-"Wrapper"

El bot demuestra criterio técnico real mediante:

- **Tool Calling Autónomo:** El LLM decide cuándo llamar a la API de películas o cuándo guardar una preferencia en la base de datos basándose en el contexto.
- **Limpieza de Datos:** Las respuestas de la API externa son filtradas en el servidor (`lib/services/movies.ts`) antes de enviarlas al LLM para optimizar el contexto y evitar "alucinaciones".

### 2. Arquitectura de Persistencia

Elegí **Drizzle ORM con Neon (Postgres)** porque:

- Permite manejar la persistencia de forma asíncrona mediante el callback `onFinish` del SDK de IA.
- Se implementó una lógica de `Upsert` para las preferencias del usuario, garantizando que los datos sean únicos y siempre actuales.

### 3. Experiencia de Usuario (UX)

- **Streaming:** Implementado para reducir el tiempo de espera percibido (TTFT).
- **Manejo de Errores de Hidratación:** Se resolvieron conflictos de anidamiento de HTML (div dentro de p) comunes al usar Markdown, asegurando una carga limpia en Next.js.

---

## ⚙️ Instalación Local

1. Clonar el repositorio:

   ```bash
   git clone [URL_DE_TU_REPOSITORIO]
   cd my-app
2. Instalar dependencias:

    ```bash
    pnpm install
3. Configurar variables de entorno (.env.local):

    ```env
    OPENAI_API_KEY=tu_key_aqui
    DATABASE_URL=tu_url_de_neon_aqui
    TMDB_TOKEN=tu_bearer_token_de_tmdb_aqui
4. Sincronizar la base de datos:

    ```bash
    pnpm drizzle-kit push
5. Iniciar el servidor:

    ```bash
    pnpm dev

## ✨ Features Bonus Implementadas

- **Streaming:** Respuestas en tiempo real para una mejor UX.
- **Tool Calling:** Capacidad de razonamiento para usar APIs externas.
- **Panel de Debug:** Consola lateral para visualizar el proceso interno del LLM.
- **Persistencia Avanzada:** Guardado de historial completo y preferencias específicas.
- **Optimización de Imágenes:** Uso de next/image para el renderizado de posters.
