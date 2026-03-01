// =====================================================
// server.js — Backend Node.js para "Mi Mundo del Fútbol"
// Proyecto de Aplicación — Asturias Corporación Universitaria
// =====================================================

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Almacenamiento en memoria (sin base de datos) ──
// Los comentarios se guardan en esta variable mientras el servidor esté activo
let comentarios = [
  {
    id: 1,
    nombre: 'Juan Camilo',
    equipo: 'Atlético Nacional',
    comentario: '¡El fútbol colombiano tiene un nivel increíble! Esperemos ver más jugadores en Europa.',
    fecha: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
  },
  {
    id: 2,
    nombre: 'Valentina R.',
    equipo: 'Real Madrid',
    comentario: 'El Madrid siempre gana cuando más importa. La Champions es nuestra casa. ¡Hala Madrid!',
    fecha: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
  }
];

let nextId = 3;

// ── RUTAS DE LA API ────────────────────────────────

/**
 * GET /api/comentarios
 * Devuelve todos los comentarios almacenados
 */
app.get('/api/comentarios', (req, res) => {
  res.json({
    success: true,
    total: comentarios.length,
    comentarios: comentarios
  });
});

/**
 * POST /api/comentarios
 * Recibe un nuevo comentario y lo almacena en memoria
 * Body esperado: { nombre, equipo, comentario }
 */
app.post('/api/comentarios', (req, res) => {
  const { nombre, equipo, comentario } = req.body;

  // Validación básica
  if (!nombre || !comentario) {
    return res.status(400).json({
      success: false,
      mensaje: 'El nombre y el comentario son obligatorios.'
    });
  }

  // Crear el nuevo comentario
  const nuevoComentario = {
    id: nextId++,
    nombre: nombre.trim().substring(0, 60),     // Limitar longitud
    equipo: (equipo || 'Sin equipo').substring(0, 50),
    comentario: comentario.trim().substring(0, 500),
    fecha: new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  comentarios.push(nuevoComentario);

  console.log(`✅ Nuevo comentario de: ${nuevoComentario.nombre} | Equipo: ${nuevoComentario.equipo}`);

  res.status(201).json({
    success: true,
    mensaje: '¡Comentario registrado exitosamente!',
    comentario: nuevoComentario
  });
});

/**
 * DELETE /api/comentarios/:id
 * Elimina un comentario por su ID
 */
app.delete('/api/comentarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const indice = comentarios.findIndex(c => c.id === id);

  if (indice === -1) {
    return res.status(404).json({ success: false, mensaje: 'Comentario no encontrado.' });
  }

  comentarios.splice(indice, 1);
  res.json({ success: true, mensaje: 'Comentario eliminado.' });
});

// ── Ruta fallback → sirve index.html ──────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Iniciar servidor ──────────────────────────────
app.listen(PORT, () => {
  console.log(`\n⚽ Servidor "Mi Mundo del Fútbol" corriendo en: http://localhost:${PORT}`);
  console.log(`📦 Comentarios cargados: ${comentarios.length}\n`);
});
