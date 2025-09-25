// utils/validation.js
export const sanitize = (s) => String(s ?? "").trim();
export const isISODate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || "").trim());
export const toNullIfEmpty = (v) => {
  const s = v == null ? "" : String(v).trim();
  return s === "" ? null : s;
};

// Validación para crear
export function validateCreate(req, res, next) {
  let { titulo, descripcion, fecha } = req.body;

  titulo = sanitize(titulo);
  descripcion = sanitize(descripcion);
  fecha = sanitize(fecha);

  const errors = [];
  if (!titulo) errors.push("El título es obligatorio.");
  if (titulo && (titulo.length < 5 || titulo.length > 150))
    errors.push("El título debe tener entre 5 y 150 caracteres.");
  if (!descripcion) errors.push("La descripción es obligatoria.");
  if (fecha && !isISODate(fecha))
    errors.push("La fecha debe tener formato YYYY-MM-DD.");

  if (errors.length) return res.status(422).json({ ok: false, errors });

  req.body.titulo = titulo;
  req.body.descripcion = descripcion;
  req.body.fecha = fecha || null; // si falta, luego usamos CURDATE() en SQL
  next();
}

// Construye SET para UPDATE con validación leve
export function buildUpdateSet(body) {
  const allowed = ["titulo", "descripcion", "fecha", "imagen1", "imagen2", "imagen3"];
  const fields = [];
  const values = [];

  for (const key of allowed) {
    if (body[key] !== undefined) {
      if (["titulo", "descripcion"].includes(key)) {
        const val = sanitize(body[key]);
        if (key === "titulo" && (val.length < 5 || val.length > 150)) {
          throw new Error("El título debe tener entre 5 y 150 caracteres.");
        }
        if (key === "descripcion" && !val) {
          throw new Error("La descripción no puede quedar vacía.");
        }
        values.push(val);
      } else if (key === "fecha") {
        const f = sanitize(body[key]);
        if (f && !isISODate(f)) throw new Error("La fecha debe tener formato YYYY-MM-DD.");
        values.push(f || null);
      } else {
        values.push(toNullIfEmpty(body[key]));
      }
      fields.push(`${key} = ?`);
    }
  }

  return { fields, values };
}

// Query de lista/búsqueda
export function parseListQuery(req, _res, next) {
  req.q = sanitize(req.query.q || "");
  req.page = Math.max(Number(req.query.page) || 1, 1);
  req.pageSize = Math.min(Math.max(Number(req.query.pageSize) || 10, 1), 50);
  req.offset = (req.page - 1) * req.pageSize;
  next();
}
